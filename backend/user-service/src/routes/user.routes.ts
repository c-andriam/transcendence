import { FastifyInstance } from "fastify";
import {
    createEmailVerificationToken,
    createUser,
    deleteUser,
    getAllUsers,
    searchUsers,
    getUserByEmailIdentifier,
    getUserById,
    getUserByIdentifier,
    getUsersByIds,
    updatePassword,
    updateUser,
    updateAvatar,
    changePassword,
    verifyResetToken,
    verifyEmailToken,
    updateUserStatus
} from "../services/user.service";
import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkIsFollowing
} from "../services/follow.service";
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getFriends,
    getFriendRequests
} from "../services/friend.service";
import {
    blockUser,
    unblockUser,
    getBlockedUsers
} from "../services/block.service";
import {
    sendSuccess,
    sendCreated,
    sendDeleted,
    stripPassword,
    authMiddleware,
    bodyValidator,
    generateApiKey,
    NotFoundError,
    BadRequestError,
    ForbiddenError,
    InternalServerError
} from "@transcendence/common";
import { z } from "zod";

const createUserSchema = z.object({
    email: z.string().email("Invalid email format"),
    username: z.string().min(3, "Username must be at least 3 characters").max(50),
    password: z.string().min(8, "Password must be at least 8 characters").max(142),
    firstName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional(),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(500).optional()
});

const updateUserSchema = z.object({
    username: z.string().min(3).max(50).optional(),
    firstName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional(),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(500).optional()
});

const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters").max(142)
});

const friendRequestSchema = z.object({
    receiverId: z.string().min(1, "Receiver ID is required")
});

const tokenSchema = z.object({
    token: z.string().min(1, "Token is required")
});

const updatePasswordSchema = z.object({
    userId: z.string().min(1),
    newPassword: z.string().min(8).max(142)
});

const userIdSchema = z.object({
    userId: z.string().min(1)
});

const statusSchema = z.object({
    isOnline: z.boolean()
});

export async function userRoutes(app: FastifyInstance) {

    app.get("/users", async (request, reply) => {
        const users = await getAllUsers();
        sendSuccess(reply, users.map(stripPassword), 'Users retrieved successfully');
    });

    app.get("/users/search", async (request, reply) => {
        const query = request.query as { q: string | string[] };
        const q = Array.isArray(query.q) ? query.q[0] : query.q;

        if (!q) {
            return sendSuccess(reply, [], 'No search query provided');
        }
        const users = await searchUsers(q);
        sendSuccess(reply, users, 'Users search completed successfully');
    });

    app.get("/users/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const user = await getUserById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        sendSuccess(reply, stripPassword(user), 'User retrieved successfully');
    });

    app.post("/users", {
        preHandler: bodyValidator(createUserSchema)
    }, async (request, reply) => {
        const body = request.body as z.infer<typeof createUserSchema>;
        const user = await createUser(body);
        sendCreated(reply, stripPassword(user), 'User created');
    });

    app.get("/users/me", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const user = await getUserById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        sendSuccess(reply, stripPassword(user), 'Profile retrieved successfully');
    });

    app.put("/users/:id", {
        preHandler: [authMiddleware, bodyValidator(updateUserSchema)]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        if (request.user!.id !== id) {
            throw new ForbiddenError('You can only update your own profile');
        }
        const body = request.body as z.infer<typeof updateUserSchema>;
        const user = await updateUser(id, body);
        sendSuccess(reply, stripPassword(user), 'User updated successfully');
    });

    app.post("/users/me/avatar", { preHandler: authMiddleware }, async (request, reply) => {
        const data = await request.file();
        if (!data) {
            throw new BadRequestError("No image uploaded");
        }
        const userId = request.user!.id;
        const user = await updateAvatar(userId, data);
        sendSuccess(reply, stripPassword(user), "Avatar updated successfully");
    });

    app.post("/users/change-password", {
        preHandler: [authMiddleware, bodyValidator(changePasswordSchema)]
    }, async (request, reply) => {
        const { oldPassword, newPassword } = request.body as z.infer<typeof changePasswordSchema>;
        const userId = request.user!.id;
        await changePassword(userId, oldPassword, newPassword);
        sendSuccess(reply, {}, "Password changed successfully");
    });


    app.delete("/users/:id", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        if (request.user!.id !== id) {
            throw new ForbiddenError('You can only delete your own profile');
        }
        const user = await deleteUser(id);
        sendDeleted(reply, stripPassword(user), 'User deleted successfully');
    });

    app.post("/users/:id/follow", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const followerId = request.user!.id;
        const result = await followUser(followerId, id);
        sendCreated(reply, result, 'User followed successfully');
    });

    app.delete("/users/:id/follow", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const followerId = request.user!.id;
        const result = await unfollowUser(followerId, id);
        sendSuccess(reply, result, 'User unfollowed successfully');
    });

    app.get("/users/me/followers", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const followers = await getFollowers(userId);
        sendSuccess(reply, followers, 'Followers retrieved successfully');
    });

    app.get("/users/me/following", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const following = await getFollowing(userId);
        sendSuccess(reply, following, 'Following list retrieved successfully');
    });

    app.get("/users/:id/followers", async (request, reply) => {
        const { id } = request.params as { id: string };
        const followers = await getFollowers(id);
        sendSuccess(reply, followers, 'Followers retrieved successfully');
    });

    app.get("/users/:id/following", async (request, reply) => {
        const { id } = request.params as { id: string };
        const following = await getFollowing(id);
        sendSuccess(reply, following, 'Following list retrieved successfully');
    });

    app.get("/users/:id/is-following", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const followerId = request.user!.id;
        const isFollowing = await checkIsFollowing(followerId, id);
        sendSuccess(reply, { isFollowing }, 'Follow status retrieved successfully');
    });

    app.post("/users/friend-requests", {
        preHandler: [authMiddleware, bodyValidator(friendRequestSchema)]
    }, async (request, reply) => {
        const { receiverId } = request.body as z.infer<typeof friendRequestSchema>;
        const senderId = request.user!.id;
        const result = await sendFriendRequest(senderId, receiverId);
        sendCreated(reply, result, 'Friend request sent successfully');
    });

    app.put("/users/friend-requests/:id/accept", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const userId = request.user!.id;
        const result = await acceptFriendRequest(id, userId);
        sendSuccess(reply, result, 'Friend request accepted successfully');
    });

    app.put("/users/friend-requests/:id/reject", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const userId = request.user!.id;
        const result = await rejectFriendRequest(id, userId);
        sendSuccess(reply, result, 'Friend request rejected successfully');
    });

    app.delete("/users/friends/:friendId", { preHandler: authMiddleware }, async (request, reply) => {
        const { friendId } = request.params as { friendId: string };
        const userId = request.user!.id;
        const result = await removeFriend(userId, friendId);
        sendSuccess(reply, result, 'Friend removed successfully');
    });

    app.get("/users/me/friends", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const friends = await getFriends(userId);
        sendSuccess(reply, friends, 'Friends list retrieved successfully');
    });

    app.get("/users/me/friend-requests", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const requests = await getFriendRequests(userId);
        sendSuccess(reply, requests, 'Friend requests retrieved successfully');
    });

    app.post("/users/:id/block", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const userId = request.user!.id;
        const result = await blockUser(userId, id);
        sendCreated(reply, result, 'User blocked successfully');
    });

    app.delete("/users/:id/block", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const userId = request.user!.id;
        const result = await unblockUser(userId, id);
        sendSuccess(reply, result, 'User unblocked successfully');
    });

    app.get("/users/me/blocked", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const blockedUsers = await getBlockedUsers(userId);
        sendSuccess(reply, blockedUsers, 'Blocked users retrieved successfully');
    });

    app.get("/internal/users/batch", async (request, reply) => {
        const { ids } = request.query as { ids: string };
        const splittedIds = ids.split(",");
        const users = await getUsersByIds(splittedIds);
        sendSuccess(reply, users.map(stripPassword), 'Users retrieved successfully');
    });

    app.get("/internal/users/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const user = await getUserById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        sendSuccess(reply, { id: user.id, username: user.username, role: user.role }, 'User retrieved successfully');
    });

    app.get("/internal/users/by-identifier/:identifier", async (request, reply) => {
        const { identifier } = request.params as { identifier: string };
        const user = await getUserByIdentifier(identifier);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        sendSuccess(reply, user, 'User retrieved successfully');
    });

    app.post("/internal/verify-reset-token", {
        preHandler: bodyValidator(tokenSchema)
    }, async (request, reply) => {
        const { token } = request.body as z.infer<typeof tokenSchema>;
        const user = await verifyResetToken(token);
        sendSuccess(reply, user, 'Token verified successfully');
    });

    app.post("/internal/update-password", {
        preHandler: bodyValidator(updatePasswordSchema)
    }, async (request, reply) => {
        const { userId, newPassword } = request.body as z.infer<typeof updatePasswordSchema>;
        await updatePassword(userId, newPassword);
        sendSuccess(reply, {}, 'Password updated successfully');
    });

    app.get("/internal/users/by-email-identifier/:email", async (request, reply) => {
        const { email } = request.params as { email: string };
        const user = await getUserByEmailIdentifier(email);
        sendSuccess(reply, user, 'User retrieved successfully');
    });

    app.post("/internal/create-verification-token", {
        preHandler: bodyValidator(userIdSchema)
    }, async (request, reply) => {
        const { userId } = request.body as z.infer<typeof userIdSchema>;
        const verificationToken = await createEmailVerificationToken(userId);
        sendSuccess(reply, { verificationToken }, 'Verification token created successfully');
    });

    app.post("/internal/verify-email-token", {
        preHandler: bodyValidator(tokenSchema)
    }, async (request, reply) => {
        const { token } = request.body as z.infer<typeof tokenSchema>;
        const user = await verifyEmailToken(token);
        sendSuccess(reply, user, 'Email verified successfully');
    });

    app.post("/users/api-key/generate", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const user = await getUserById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (!user.isEmailVerified) {
            throw new ForbiddenError('Email must be verified to generate an API key');
        }

        const masterSecret = process.env.API_MASTER_SECRET;
        if (!masterSecret) {
            throw new InternalServerError('API_MASTER_SECRET not configured');
        }

        const apiKey = generateApiKey(userId, masterSecret);

        sendCreated(reply, {
            apiKey,
            userId,
            message: 'Store this API key securely. It will not be shown again.',
            usage: {
                header: 'x-gateway-api-key',
                example: `curl -H "x-gateway-api-key: ${apiKey}" https://cookshare.me/documentation/api/v1/recipes`
            }
        }, 'API Key generated');
    });

    app.put("/internal/users/:id/status", {
        preHandler: bodyValidator(statusSchema)
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const { isOnline } = request.body as z.infer<typeof statusSchema>;
        const user = await updateUserStatus(id, isOnline);
        sendSuccess(reply, { id: user.id, isOnline: user.isOnline }, 'User status updated successfully');
    });
}