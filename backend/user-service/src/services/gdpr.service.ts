import db from "../utils/dbPlugin";
import crypto from "crypto";
import { NotFoundError, BadRequestError } from "@transcendence/common";

const RECIPE_SERVICE_URL = `${process.env.DOMAIN}:${process.env.RECIPE_SERVICE_PORT}`;
const NOTIFICATION_SERVICE_URL = `${process.env.DOMAIN}:${process.env.NOTIFICATION_SERVICE_PORT}`;
const CHAT_SERVICE_URL = `${process.env.DOMAIN}:${process.env.CHAT_SERVICE_PORT}`;

export async function exportUserData(userId: string) {
    const user = await db.user.findUnique({
        where: { id: userId },
        include: {
            followers: {
                include: {
                    follower: { select: { id: true, username: true } }
                }
            },
            following: {
                include: {
                    following: { select: { id: true, username: true } }
                }
            },
            friendRequestsSent: {
                include: {
                    receiver: { select: { id: true, username: true } }
                }
            },
            friendRequestsReceived: {
                include: {
                    sender: { select: { id: true, username: true } }
                }
            },
            blocksSent: {
                include: {
                    blocked: { select: { id: true, username: true } }
                }
            }
        }
    });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    let recipes: any[] = [];
    let notifications: any[] = [];
    let messages: any[] = [];

    try {
        const recipesRes = await fetch(`${RECIPE_SERVICE_URL}/api/v1/internal/users/${userId}/data`, {
            headers: { 'x-internal-api-key': process.env.INTERNAL_API_KEY! }
        });
        if (recipesRes.ok) {
            const data = await recipesRes.json();
            recipes = data.data || [];
        }
    } catch (e) {
        console.error("Failed to fetch recipes for export:", e);
    }

    try {
        const notifRes = await fetch(`${NOTIFICATION_SERVICE_URL}/api/v1/internal/users/${userId}/data`, {
            headers: { 'x-internal-api-key': process.env.INTERNAL_API_KEY! }
        });
        if (notifRes.ok) {
            const data = await notifRes.json();
            notifications = data.data || [];
        }
    } catch (e) {
        console.error("Failed to fetch notifications for export:", e);
    }

    try {
        const chatRes = await fetch(`${CHAT_SERVICE_URL}/api/v1/internal/users/${userId}/data`, {
            headers: { 'x-internal-api-key': process.env.INTERNAL_API_KEY! }
        });
        if (chatRes.ok) {
            const data = await chatRes.json();
            messages = data.data || [];
        }
    } catch (e) {
        console.error("Failed to fetch messages for export:", e);
    }

    const exportData = {
        exportDate: new Date().toISOString(),
        profile: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            isOnline: user.isOnline,
            lastSeenAt: user.lastSeenAt,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isEmailVerified: user.isEmailVerified
        },
        social: {
            followers: user.followers.map(f => ({
                userId: f.follower.id,
                username: f.follower.username,
                followedAt: f.createdAt
            })),
            following: user.following.map(f => ({
                userId: f.following.id,
                username: f.following.username,
                followedAt: f.createdAt
            })),
            friendRequestsSent: user.friendRequestsSent.map(fr => ({
                to: fr.receiver.username,
                status: fr.status,
                sentAt: fr.createdAt
            })),
            friendRequestsReceived: user.friendRequestsReceived.map(fr => ({
                from: fr.sender.username,
                status: fr.status,
                receivedAt: fr.createdAt
            })),
            blockedUsers: user.blocksSent.map(b => ({
                userId: b.blocked.id,
                username: b.blocked.username,
                blockedAt: b.createdAt
            }))
        },
        content: {
            recipes,
            notifications,
            messages
        }
    };

    return exportData;
}

export async function requestAccountDeletion(userId: string) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new NotFoundError("User not found");
    }

    await db.accountDeletionToken.updateMany({
        where: { userId, used: false },
        data: { used: true }
    });

    const token = crypto.randomBytes(64).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.accountDeletionToken.create({
        data: {
            token: hashedToken,
            userId,
            expiresAt
        }
    });

    try {
        await fetch(`${NOTIFICATION_SERVICE_URL}/api/v1/internal/send-deletion-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-api-key': process.env.INTERNAL_API_KEY!
            },
            body: JSON.stringify({
                email: user.email,
                deletionToken: token,
                username: user.username
            })
        });
    } catch (e) {
        console.error("Failed to send deletion email:", e);
    }

    return { token, email: user.email, username: user.username };
}

export async function confirmAccountDeletion(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const deletionToken = await db.accountDeletionToken.findUnique({
        where: { token: hashedToken },
        include: { user: true }
    });

    if (!deletionToken) {
        throw new BadRequestError("Invalid deletion token");
    }

    if (deletionToken.used) {
        throw new BadRequestError("This deletion token has already been used");
    }

    if (deletionToken.expiresAt < new Date()) {
        throw new BadRequestError("Deletion token has expired");
    }

    const userId = deletionToken.userId;
    const userEmail = deletionToken.user.email;

    await db.accountDeletionToken.update({
        where: { id: deletionToken.id },
        data: { used: true }
    });

    const deletePromises = [
        fetch(`${RECIPE_SERVICE_URL}/api/v1/internal/users/${userId}`, {
            method: 'DELETE',
            headers: { 'x-internal-api-key': process.env.INTERNAL_API_KEY! }
        }).catch(e => console.error("Failed to delete user recipes:", e)),

        fetch(`${NOTIFICATION_SERVICE_URL}/api/v1/internal/users/${userId}`, {
            method: 'DELETE',
            headers: { 'x-internal-api-key': process.env.INTERNAL_API_KEY! }
        }).catch(e => console.error("Failed to delete user notifications:", e)),

        fetch(`${CHAT_SERVICE_URL}/api/v1/internal/users/${userId}`, {
            method: 'DELETE',
            headers: { 'x-internal-api-key': process.env.INTERNAL_API_KEY! }
        }).catch(e => console.error("Failed to delete user messages:", e))
    ];

    await Promise.all(deletePromises);

    await db.user.delete({ where: { id: userId } });

    return { email: userEmail, deleted: true };
}
