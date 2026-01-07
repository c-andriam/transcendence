import db from "../utils/dbPlugin";
import { hashPassword, isValidEmail } from "@transcendence/common";
import { BadRequestError } from "@transcendence/common";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function createUser(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
}) {
    const isSafeEmail = await isValidEmail(data.email);
    if (!isSafeEmail) {
        throw new BadRequestError("Invalid email or email address doesn't exist");
    }

    if (data.password.length < 8 || data.password.length > 142) {
        throw new BadRequestError("Password must be between 8 and 142 characters");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await db.user.create({
        data: { 
            ...data,
            password: hashedPassword
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
    // email?: string;
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

export async function getUserByEmailIdentifier(email: string) {
    const user = await db.user.findUnique({
        where: {
            email: email
        }
    });
    if (user) {
        const resetToken = crypto.randomBytes(64).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
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