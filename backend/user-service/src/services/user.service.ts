import db from "../utils/dbPlugin";
import {
    hashPassword,
    isValidEmail,
    BadRequestError,
    NotFoundError
} from "@transcendence/common";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { MultipartFile } from "@fastify/multipart";
import {
    uploadImageFromBuffer,
    deleteImage,
    getThumbnailUrl
} from "./cloudinary.service";

export async function createUser(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
}, avatarFile?: MultipartFile) {
    const isSafeEmail = await isValidEmail(data.email);
    if (!isSafeEmail) {
        throw new BadRequestError("Invalid email or email address doesn't exist");
    }

    if (data.password.length < 8 || data.password.length > 142) {
        throw new BadRequestError("Password must be between 8 and 142 characters");
    }

    const hashedPassword = await hashPassword(data.password);

    let finalAvatarUrl = data.avatarUrl;

    if (avatarFile) {
        const buffer = await avatarFile.toBuffer();
        const result = await uploadImageFromBuffer(buffer, {
            folder: 'avatars',
            publicId: `avatar_${Date.now()}_${data.username}`,
            transformation: [
                { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        });
        finalAvatarUrl = result.secureUrl;
    }

    const user = await db.user.create({
        data: {
            ...data,
            password: hashedPassword,
            avatarUrl: finalAvatarUrl
        }
    });
    return user;
}

export async function getAllUsers() {
    const users = await db.user.findMany();
    return users;
}

export async function getUserById(id: string) {
    const user = await db.user.findUnique({ where: { id } });
    return user;
}

export async function updateUser(id: string, data: {
    username?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
}) {
    const user = await db.user.update({
        where: { id },
        data: {
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            avatarUrl: data.avatarUrl,
            bio: data.bio
        }
    });
    return user;
}

export async function updateAvatar(userId: string, data: MultipartFile) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new NotFoundError("User not found");
    }

    const buffer = await data.toBuffer();
    const result = await uploadImageFromBuffer(buffer, {
        folder: 'avatars',
        publicId: `avatar_${userId}`,
        transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
        ]
    });

    const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
            avatarUrl: result.secureUrl
        }
    });

    return updatedUser;
}

export async function deleteUser(id: string) {
    const user = await db.user.delete({ where: { id } });
    return user;
}

export async function getUsersByIds(ids: string[]) {
    const users = await db.user.findMany({
        where: { id: { in: ids } },
        select: {
            id: true,
            username: true,
            avatarUrl: true
        }
    });
    return users;
}

export async function getUserByIdentifier(identifier: string) {
    const user = await db.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { username: identifier }
            ]
        }
    });
    return user;
}

export async function searchUsers(query: string) {
    return await db.user.findMany({
        where: {
            OR: [
                { username: { contains: query, mode: 'insensitive' } },
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } }
            ]
        },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
        },
        take: 20
    });
}

export async function getUserByEmailIdentifier(email: string) {
    const user = await db.user.findUnique({
        where: {
            email: email
        }
    });
    if (user) {
        const resetToken = crypto.randomBytes(64).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
        await db.passwordResetToken.create({
            data: {
                token: hashedToken,
                userId: user.id,
                expiresAt
            }
        });
        return { user, resetToken };
    }
    return null;
}

export async function verifyResetToken(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetToken = await db.passwordResetToken.findUnique({
        where: { token: hashedToken },
        include: { user: true }
    });
    if (!resetToken || resetToken.expiresAt < new Date() || resetToken.used) {
        throw new BadRequestError("Invalid or expired reset token");
    }
    await db.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true }
    });
    return resetToken.user;
}

export async function updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await hashPassword(newPassword);
    await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });
}

export async function updateUserStatus(userId: string, isOnline: boolean) {
    return await db.user.update({
        where: { id: userId },
        data: {
            isOnline,
            lastSeenAt: isOnline ? null : new Date()
        }
    });
}
export async function changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new NotFoundError("User not found");
    }

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) {
        throw new BadRequestError("Invalid old password");
    }

    if (newPass.length < 8 || newPass.length > 142) {
        throw new BadRequestError("Password must be between 8 and 142 characters");
    }

    const hashedPassword = await hashPassword(newPass);
    await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });
}

export async function createEmailVerificationToken(userId: string) {
    const token = crypto.randomBytes(64).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.emailVerificationToken.create({
        data: {
            token: hashedToken,
            userId,
            expiresAt
        }
    });
    return token;
}

export async function verifyEmailToken(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const verificationToken = await db.emailVerificationToken.findUnique({
        where: { token: hashedToken },
        include: { user: true }
    });
    if (!verificationToken || verificationToken.expiresAt < new Date() || verificationToken.used) {
        throw new BadRequestError("Invalid or expired email verification token");
    }
    await db.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { used: true }
    });
    await db.user.update({
        where: { id: verificationToken.userId },
        data: { isEmailVerified: true }
    });
    return verificationToken.user;
}