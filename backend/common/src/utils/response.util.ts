import { FastifyReply } from 'fastify';

import { ApiResponse } from '../types/api-response.types';

export function sendSuccess<T>(
    reply: FastifyReply,
    data: T,
    message?: string,
    statusCode: number = 200,
): void {
    reply.status(statusCode).send({
        status: 'success',
        message,
        data
    } as ApiResponse<T>);
}

export function sendCreated<T>(
    reply: FastifyReply,
    data: T,
    message: string = 'Resource created successfully'
): void {
    sendSuccess(reply, data, message, 201);
}

export function sendUpdated<T>(
    reply: FastifyReply,
    data: T,
    message: string = 'Resource updated successfully'
): void {
    sendSuccess(reply, data, message, 200);
}

export function sendDeleted<T>(
    reply: FastifyReply,
    data: T,
    message: string = 'Resource deleted successfully'
): void {
    sendSuccess(reply, data, message, 200);
}

export function sendError(
    reply: FastifyReply,
    message: string,
    statusCode: number = 500,
    errors?: any[]
): void {
    reply.status(statusCode).send({
        status: 'error',
        message,
        errors
    } as ApiResponse);
}

export function sendPaginated<T>(
    reply: FastifyReply,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
): void {
    reply.status(200).send({
        status: 'success',
        message,
        data,
        meta: {
            page,
            limit,
            total
        }
    } as ApiResponse<T[]>);
}