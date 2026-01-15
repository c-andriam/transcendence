import db from "../utils/db";
import {
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    NotificationType
} from "@transcendence/common";
import { notifyUser } from "../utils/notifyUser";

export async function getCommentsByRecipeId(
    recipeId: string,
    page: number = 1,
    limit: number = 10
) {
    const recipe = await db.recipe.findUnique({
        where: { id: recipeId },
    });

    if (!recipe) {
        throw new NotFoundError("Recipe not found");
    }
    const skip = (page - 1) * limit;
    const comments = await db.comment.findMany({
        where: { recipeId, parentId: null },
        include: {
            replies: {
                include: {
                    replies: true
                },
                orderBy: { createdAt: "asc" }
            }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
    });
    const total = await db.comment.count({
        where: {
            recipeId: recipeId
        }
    });

    return {
        comments,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export async function createComment(
    recipeId: string,
    userId: string,
    content: string
) {
    const recipe = await db.recipe.findUnique({
        where: { id: recipeId },
    });

    if (!recipe) {
        throw new NotFoundError("Recipe not found");
    }
    const comment = await db.comment.create({
        data: {
            recipeId,
            userId,
            content,
        },
        include: {
            replies: true,
        }
    });

    if (recipe.authorId !== userId) {
        notifyUser(
            recipe.authorId,
            NotificationType.NEW_COMMENT,
            'New Comment',
            `Someone commented on your recipe "${recipe.title}"`,
            { recipeId, commentId: comment.id }
        );
    }

    return comment;
}

export async function updateComment(
    commentId: string,
    userId: string,
    content: string
) {
    const comment = await db.comment.findUnique({
        where: { id: commentId }
    });
    if (!comment) {
        throw new NotFoundError("Comment not found");
    }
    if (comment.userId !== userId) {
        throw new ForbiddenError("You are not allowed to update this comment");
    }
    const updatedComment = await db.comment.update({
        where: { id: commentId },
        data: { content },
        include: {
            replies: true,
        }
    });
    return updatedComment;
}

export async function deleteComment(
    commentId: string,
    userId: string
) {
    const comment = await db.comment.findUnique({
        where: { id: commentId }
    });
    if (!comment) {
        throw new NotFoundError("Comment not found");
    }
    if (comment.userId !== userId) {
        throw new ForbiddenError("You are not allowed to delete this comment");
    }
    await db.comment.deleteMany({
        where: {
            parentId: commentId
        }
    });
    const deletedComment = await db.comment.delete({
        where: { id: commentId }
    });
    return deletedComment;
}

export async function createReplyToComment(
    commentId: string,
    userId: string,
    content: string
) {
    const parentComment = await db.comment.findUnique({
        where: { id: commentId }
    });
    if (!parentComment) {
        throw new NotFoundError("Parent comment not found");
    }
    const reply = await db.comment.create({
        data: {
            content,
            userId,
            recipeId: parentComment.recipeId,
            parentId: commentId
        }
    });
    return reply;
}