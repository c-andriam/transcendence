import db from "../utils/dbPlugin";
import { BadRequestError, NotFoundError, ConflictError } from "@transcendence/common";

export async function sendFriendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
        throw new BadRequestError("You cannot send a friend request to yourself");
    }
    const receiver = await db.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
        throw new NotFoundError("User not found");
    }
    const existingRequest = await db.friendRequest.findFirst({
        where: {
            OR: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }
    });
    if (existingRequest) {
        if (existingRequest.status === 'ACCEPTED') {
            throw new ConflictError("You are already friends");
        }
        if (existingRequest.status === 'PENDING') {
            throw new ConflictError("A friend request is already pending");
        }
        if (existingRequest.status === 'REJECTED') {
            return await db.friendRequest.update({
                where: { id: existingRequest.id },
                data: {
                    senderId,
                    receiverId,
                    status: 'PENDING'
                }
            });
        }
    }
    const request = await db.friendRequest.create({
        data: {
            senderId,
            receiverId,
            status: 'PENDING'
        }
    });
    return request;
}

export async function acceptFriendRequest(requestId: string, userId: string) {
    const request = await db.friendRequest.findUnique({ where: { id: requestId } });
    if (!request) {
        throw new NotFoundError("Friend request not found");
    }
    if (request.receiverId !== userId) {
        throw new BadRequestError("You are not the receiver of this friend request");
    }
    if (request.status !== 'PENDING') {
        throw new BadRequestError("Friend request is not pending");
    }
    const updatedRequest = await db.friendRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' }
    });
    return updatedRequest;
}

export async function rejectFriendRequest(requestId: string, userId: string) {
    const request = await db.friendRequest.findUnique({ where: { id: requestId } });
    if (!request) {
        throw new NotFoundError("Friend request not found");
    }
    if (request.receiverId !== userId) {
        throw new BadRequestError("You are not the receiver of this friend request");
    }
    if (request.status !== 'PENDING') {
        throw new BadRequestError("Friend request is not pending");
    }
    const updatedRequest = await db.friendRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
    });
    return updatedRequest;
}

export async function removeFriend(userId: string, friendId: string) {
    const request = await db.friendRequest.findFirst({
        where: {
            OR: [
                { senderId: userId, receiverId: friendId, status: 'ACCEPTED' },
                { senderId: friendId, receiverId: userId, status: 'ACCEPTED' }
            ]
        }
    });

    if (!request) {
        throw new NotFoundError("Friendship not found");
    }

    await db.friendRequest.delete({ where: { id: request.id } });
    return { message: "Friend removed" };
}

export async function getFriends(userId: string) {
    const requests = await db.friendRequest.findMany({
        where: {
            OR: [
                { senderId: userId, status: 'ACCEPTED' },
                { receiverId: userId, status: 'ACCEPTED' }
            ]
        },
        include: {
            sender: { select: { id: true, username: true, avatarUrl: true, isOnline: true } },
            receiver: { select: { id: true, username: true, avatarUrl: true, isOnline: true } }
        }
    });

    return requests.map(req => {
        if (req.senderId === userId) return req.receiver;
        return req.sender;
    });
}

export async function getFriendRequests(userId: string) {
    const requests = await db.friendRequest.findMany({
        where: {
            receiverId: userId,
            status: 'PENDING'
        },
        include: {
            sender: { select: { id: true, username: true, avatarUrl: true } }
        }
    });
    return requests;
}
