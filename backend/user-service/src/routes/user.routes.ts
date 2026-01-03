import { FastifyInstance } from "fastify";
import { createUser, deleteUser, getAllUsers, getUserById, getUserByIdentifier, getUsersByIds, updateUser } from "../services/user.service";
import { sendSuccess, sendCreated, sendDeleted, stripPassword, NotFoundError, authMiddleware } from "@transcendence/common";

export async function userRoutes(app: FastifyInstance) {

    app.get("/users", async (request, reply) => {
        const users = await getAllUsers();
        sendSuccess(reply, users.map(stripPassword), 'Users retrieved');
    });

    app.get("/users/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const user = await getUserById(id);
        if (!user) {
            throw new NotFoundError('User not found');
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

    app.get("/me", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user!.id;
        const user = await getUserById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        sendSuccess(reply, stripPassword(user), 'Profile retrieved');
    });

    app.put("/users/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
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

    app.delete("/users/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
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
            throw new NotFoundError('User not found');
        }
        sendSuccess(reply, user, 'User found');
    });
}