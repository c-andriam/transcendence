import { Server, Socket } from 'socket.io';
import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { validateEnv } from '@transcendence/common';

const env = validateEnv();

interface ExtendedSocket extends Socket {
    userId?: string;
}

export class SocketService {
    private static io: Server;
    private static userSockets: Map<string, string[]> = new Map();

    public static initialize(app: FastifyInstance) {
        this.io = new Server(app.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            },
            path: '/socket.io/'
        });

        this.io.use((socket: ExtendedSocket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token missing'));
            }

            try {
                const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
                socket.userId = decoded.id;
                next();
            } catch (err) {
                return next(new Error('Authentication error: Invalid token'));
            }
        });

        this.io.on('connection', async (socket: ExtendedSocket) => {
            if (!socket.userId) return;

            const userId = socket.userId;
            const socketId = socket.id;

            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, []);
                await this.updateUserStatus(userId, true);
            }
            this.userSockets.get(userId)?.push(socketId);

            app.log.info(`User connected: ${userId} (Socket: ${socketId})`);

            socket.on('typing_start', ({ receiverId }: { receiverId: string }) => {
                const receiverSockets = this.userSockets.get(receiverId);
                if (receiverSockets) {
                    receiverSockets.forEach(sId => {
                        this.io.to(sId).emit('typing_start', { senderId: userId });
                    });
                }
            });

            socket.on('typing_stop', ({ receiverId }: { receiverId: string }) => {
                const receiverSockets = this.userSockets.get(receiverId);
                if (receiverSockets) {
                    receiverSockets.forEach(sId => {
                        this.io.to(sId).emit('typing_stop', { senderId: userId });
                    });
                }
            });

            socket.on('join_recipe', ({ recipeId }: { recipeId: string }) => {
                socket.join(`recipe_${recipeId}`);
            });

            socket.on('join_shopping_list', () => {
                // User joins their own shopping list room
                if (socket.userId) {
                    const roomName = `shopping_list_${socket.userId}`;
                    socket.join(roomName);
                    // app.log.info(`User ${socket.userId} joined ${roomName}`);
                }
            });

            socket.on('leave_recipe', ({ recipeId }: { recipeId: string }) => {
                socket.leave(`recipe_${recipeId}`);
            });

            socket.on('comment_typing_start', ({ recipeId }: { recipeId: string }) => {
                socket.to(`recipe_${recipeId}`).emit('comment_typing_start', {
                    senderId: userId,
                    recipeId: recipeId
                });
            });

            socket.on('comment_typing_stop', ({ recipeId }: { recipeId: string }) => {
                socket.to(`recipe_${recipeId}`).emit('comment_typing_stop', {
                    senderId: userId,
                    recipeId: recipeId
                });
            });

            socket.on('disconnect', async () => {
                app.log.info(`User disconnected: ${userId} (Socket: ${socketId})`);
                const sockets = this.userSockets.get(userId) || [];
                const index = sockets.indexOf(socketId);
                if (index !== -1) {
                    sockets.splice(index, 1);
                }

                if (sockets.length === 0) {
                    this.userSockets.delete(userId);
                    await this.updateUserStatus(userId, false);
                }
            });
        });

        app.log.info('Socket.io initialized');
    }

    private static async updateUserStatus(userId: string, isOnline: boolean) {
        try {
            const userServiceUrl = `http://localhost:${env.USER_SERVICE_PORT}/api/v1/internal/users/${userId}/status`;

            const response = await fetch(userServiceUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-api-key': env.INTERNAL_API_KEY
                },
                body: JSON.stringify({ isOnline })
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`[SocketService] Failed to update status: ${response.status} ${text}`);
            }
        } catch (err) {
            console.error(`Failed to update user status for ${userId}:`, err);
        }
    }

    public static emitToUser(userId: string, event: string, data: any) {
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.forEach(socketId => {
                this.io.to(socketId).emit(event, data);
            });
        }
    }

    public static emitToRoom(room: string, event: string, data: any) {
        this.io.to(room).emit(event, data);
    }
}
