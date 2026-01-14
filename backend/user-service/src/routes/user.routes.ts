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
    generateApiKey,
    sendNotFound,
    sendBadRequest,
    sendForbidden,
    sendError
} from "@transcendence/common";

export async function userRoutes(app: FastifyInstance) {

    app.get("/users", async (request, reply) => {
        const users = await getAllUsers();
        sendSuccess(reply, users.map(stripPassword), 'Users retrieved');
    });

    app.get("/users/search", async (request, reply) => {
        const query = request.query as { q: string | string[] };
        const q = Array.isArray(query.q) ? query.q[0] : query.q;

        if (!q) {
            return sendSuccess(reply, [], 'No query provided');
        }
        const users = await searchUsers(q);
        sendSuccess(reply, users, 'Users found');
    });

    app.get("/users/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const user = await getUserById(id);
        if (!user) {
            return sendNotFound(reply, 'User not found');
        }
        sendSuccess(reply, stripPassword(user), 'User found');
    });

    app.post("/users", async (request, reply) => {
        const { email, username, password, firstName, lastName, avatarUrl, bio } = request.body as {
            email: string;
            username: string;
            password: string;
            firstName?: string;
            lastName?: string;
            avatarUrl?: string;
            bio?: string;
        };
        const user = await createUser({
            email,
            username,
            password,
            firstName,
            lastName,
            avatarUrl,
            bio
        });
        sendCreated(reply, stripPassword(user), 'User created');
    });

    app.get("/users/me", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const user = await getUserById(userId);
        if (!user) {
            return sendNotFound(reply, 'User not found');
        }
        sendSuccess(reply, stripPassword(user), 'Profile retrieved');
    });

    app.put("/users/:id", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        if (request.user!.id !== id) {
            return sendForbidden(reply, 'You can only update your own profile');
        }
        const body = request.body as {
            username?: string;
            firstName?: string;
            lastName?: string;
            avatarUrl?: string;
            bio?: string;
        };
        const user = await updateUser(id, body);
        sendSuccess(reply, stripPassword(user), 'User updated');
    });

    app.post("/users/me/avatar", { preHandler: authMiddleware }, async (request, reply) => {
        const data = await request.file();
        if (!data) {
            return sendBadRequest(reply, "No image uploaded");
        }
        const userId = request.user!.id;
        const user = await updateAvatar(userId, data);
        sendSuccess(reply, stripPassword(user), "Avatar updated successfully");
    });

    app.post("/users/change-password", { preHandler: authMiddleware }, async (request, reply) => {
        const { oldPassword, newPassword } = request.body as { oldPassword: string, newPassword: string };
        const userId = request.user!.id;
        await changePassword(userId, oldPassword, newPassword);
        sendSuccess(reply, {}, "Password changed successfully");
    });


    app.delete("/users/:id", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        if (request.user!.id !== id) {
            return sendForbidden(reply, 'You can only delete your own profile');
        }
        const user = await deleteUser(id);
        sendDeleted(reply, stripPassword(user), 'User deleted');
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
        sendSuccess(reply, followers, 'Your followers retrieved');
    });

    app.get("/users/me/following", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const following = await getFollowing(userId);
        sendSuccess(reply, following, 'Who you follow retrieved');
    });

    app.get("/users/:id/followers", async (request, reply) => {
        const { id } = request.params as { id: string };
        const followers = await getFollowers(id);
        sendSuccess(reply, followers, 'Followers retrieved');
    });

    app.get("/users/:id/following", async (request, reply) => {
        const { id } = request.params as { id: string };
        const following = await getFollowing(id);
        sendSuccess(reply, following, 'Following retrieved');
    });

    app.get("/users/:id/is-following", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const followerId = request.user!.id;
        const isFollowing = await checkIsFollowing(followerId, id);
        sendSuccess(reply, { isFollowing }, 'Follow status retrieved');
    });

    app.post("/users/friend-requests", { preHandler: authMiddleware }, async (request, reply) => {
        const { receiverId } = request.body as { receiverId: string };
        const senderId = request.user!.id;
        const result = await sendFriendRequest(senderId, receiverId);
        sendCreated(reply, result, 'Friend request sent');
    });

    app.put("/users/friend-requests/:id/accept", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const userId = request.user!.id;
        const result = await acceptFriendRequest(id, userId);
        sendSuccess(reply, result, 'Friend request accepted');
    });

    app.put("/users/friend-requests/:id/reject", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const userId = request.user!.id;
        const result = await rejectFriendRequest(id, userId);
        sendSuccess(reply, result, 'Friend request rejected');
    });

    app.delete("/users/friends/:friendId", { preHandler: authMiddleware }, async (request, reply) => {
        const { friendId } = request.params as { friendId: string };
        const userId = request.user!.id;
        const result = await removeFriend(userId, friendId);
        sendSuccess(reply, result, 'Friend removed');
    });

    app.get("/users/me/friends", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const friends = await getFriends(userId);
        sendSuccess(reply, friends, 'Friends list retrieved');
    });

    app.get("/users/me/friend-requests", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const requests = await getFriendRequests(userId);
        sendSuccess(reply, requests, 'Friend requests retrieved');
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
        sendSuccess(reply, blockedUsers, 'Blocked users retrieved');
    });

    app.get("/internal/users/batch", async (request, reply) => {
        const { ids } = request.query as { ids: string };
        const splittedIds = ids.split(",");
        const users = await getUsersByIds(splittedIds);
        sendSuccess(reply, users.map(stripPassword), 'Users retrieved');
    });

    app.get("/internal/users/by-identifier/:identifier", async (request, reply) => {
        const { identifier } = request.params as { identifier: string };
        const user = await getUserByIdentifier(identifier);
        if (!user) {
            return sendNotFound(reply, 'User not found');
        }
        sendSuccess(reply, user, 'User found');
    });

    app.post("/internal/verify-reset-token", async (request, reply) => {
        const { token } = request.body as { token: string };
        const user = await verifyResetToken(token);
        sendSuccess(reply, user, 'Token verified');
    });

    app.post("/internal/update-password", async (request, reply) => {
        const { userId, newPassword } = request.body as { userId: string; newPassword: string };
        await updatePassword(userId, newPassword);
        sendSuccess(reply, {}, 'Password updated');
    });

    app.get("/internal/users/by-email-identifier/:email", async (request, reply) => {
        const { email } = request.params as { email: string };
        const user = await getUserByEmailIdentifier(email);
        sendSuccess(reply, user, 'User found');
    });

    app.post("/internal/create-verification-token", async (request, reply) => {
        const { userId } = request.body as { userId: string };
        const verificationToken = await createEmailVerificationToken(userId);
        sendSuccess(reply, { verificationToken }, 'Token created');
    });

    app.post("/internal/verify-email-token", async (request, reply) => {
        const { token } = request.body as { token: string };
        const user = await verifyEmailToken(token);
        sendSuccess(reply, user, 'Token verified');
    });

    app.post("/users/api-key/generate", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const user = await getUserById(userId);

        if (!user) {
            return sendNotFound(reply, 'User not found');
        }

        if (!user.isEmailVerified) {
            return sendForbidden(reply, 'Email must be verified to generate an API key');
        }

        const masterSecret = process.env.API_MASTER_SECRET;
        if (!masterSecret) {
            return sendError(reply, 'API_MASTER_SECRET not configured');
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

    app.put("/internal/users/:id/status", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { isOnline } = request.body as { isOnline: boolean };
        const user = await updateUserStatus(id, isOnline);
        sendSuccess(reply, { id: user.id, isOnline: user.isOnline }, 'Status updated');
    });
}