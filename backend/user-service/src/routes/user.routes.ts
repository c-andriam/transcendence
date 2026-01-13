import { FastifyInstance } from "fastify";
import {
    createEmailVerificationToken,
    createUser,
    deleteUser,
    getAllUsers,
    getUserByEmailIdentifier,
    getUserById,
    getUserByIdentifier,
    getUsersByIds,
    updatePassword,
    updateUser,
    verifyResetToken,
    verifyEmailToken
} from "../services/user.service";
import {
    sendSuccess,
    sendCreated,
    sendDeleted,
    stripPassword,
    authMiddleware,
    generateApiKey,
    sendNotFound,
    sendForbidden,
    sendError
} from "@transcendence/common";

export async function userRoutes(app: FastifyInstance) {

    app.get("/users/users", async (request, reply) => {
        const users = await getAllUsers();
        sendSuccess(reply, users.map(stripPassword), 'Users retrieved');
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

    app.delete("/users/:id", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        if (request.user!.id !== id) {
            return sendForbidden(reply, 'You can only delete your own profile');
        }
        const user = await deleteUser(id);
        sendDeleted(reply, stripPassword(user), 'User deleted');
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
}