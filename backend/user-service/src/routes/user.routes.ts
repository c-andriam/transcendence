import { FastifyInstance } from "fastify";
import { createUser, deleteUser, getAllUsers, getUserById, getUserByIdentifier, getUsersByIds, updateUser } from "../services/user.service";

export async function userRoutes(app: FastifyInstance) {

    app.get("/users", async (request, reply) => {
        try {
            const users = await getAllUsers();
            const usersWithoutPasswords = users.map((user: any) => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            reply.send({
                status: "success",
                data: usersWithoutPasswords
            });
        } catch (error) {
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }

    });

    app.get("/users/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const user = await getUserById(id);
            if (!user) {
                reply.status(404).send({
                    status: "error",
                    message: "User not found"
                });
                return;
            }
            const { password, ...userWithoutPassword } = user as any;
            reply.status(200).send({
                status: "success",
                data: userWithoutPassword
            });
        } catch (error) {
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
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
        try {
            const user = await createUser({
                email,
                username,
                password,
                firstName,
                lastName,
                avatarUrl,
                bio
            });
            // Strip password
            const { password: _, ...userWithoutPassword } = user as any;
            reply.status(201).send({
                status: "success",
                data: userWithoutPassword
            });
        } catch (error) {
            if ((error as any).code === "P2002") {
                reply.status(409).send({
                    status: "error",
                    message: "Email or username already exists"
                });
                return;
            }
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
    });

    app.put("/users/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as {
            email?: string;
            username?: string;
            firstName?: string;
            lastName?: string;
            avatarUrl?: string;
            bio?: string;
        };
        try {
            const user = await updateUser(id, body);
            // Strip password
            const { password, ...userWithoutPassword } = user as any;
            reply.status(200).send({
                status: "success",
                data: userWithoutPassword
            });
        } catch (error) {
            if ((error as any).code === "P2002") {
                reply.status(409).send({
                    status: "error",
                    message: "Email or username already exists"
                });
                return;
            }
            if ((error as any).code === "P2025") {
                reply.status(404).send({
                    status: "error",
                    message: "User not found"
                });
                return;
            }
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
    });

    app.delete("/users/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const user = await deleteUser(id);
            // Strip password
            const { password, ...userWithoutPassword } = user as any;
            reply.status(200).send({
                status: "success",
                data: userWithoutPassword
            });
        } catch (error) {
            if ((error as any).code === "P2025") {
                reply.status(404).send({
                    status: "error",
                    message: "User not found"
                });
                return;
            }
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
    });

    app.get("/internal/users/batch", async (request, reply) => {
        const { ids } = request.query as { ids: string };
        const splittedIds = ids.split(",");
        try {
            const users = await getUsersByIds(splittedIds);
            // Strip passwords
            const usersWithoutPasswords = users.map((user: any) => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            reply.status(200).send({
                status: "success",
                data: usersWithoutPasswords
            });
        } catch (error) {
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
    });

    app.get("/internal/users/by-identifier/:identifier", async (request, reply) => {
        const { identifier } = request.params as { identifier: string };
        try {
            const user = await getUserByIdentifier(identifier);
            if (!user) {
                reply.status(404).send({
                    status: "error",
                    message: "User not found"
                });
                return;
            }

            reply.status(200).send({
                status: "success",
                data: user
            });
        } catch (error) {
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
    });
}