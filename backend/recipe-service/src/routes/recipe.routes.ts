import { FastifyInstance } from "fastify";
import {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    getRecipeBySlug,
    rateRecipe,
    getRecipeRatings,
    removeRecipeRating,
    getAllRecipesBySearch,
    addToFavorites,
    removeFromFavorites,
    getUserFavorites,
    getRecipesByCategory,
    getRecipesByAuthor,
    getRecipesByDifficulty,
    getMyRecipes
} from "../services/recipe.service";

import {
    sendSuccess,
    sendCreated,
    sendDeleted,
    ForbiddenError,
    NotFoundError,
    paramValidator
} from "@transcendence/common";
import { authMiddleware, bodyValidator } from "@transcendence/common";
import { getCategoryById } from "../services/category.service";
import { request } from "node:http";
import { z } from "zod";
import {
    getComments,
    createCommentHandler,
    updateCommentHandler,
    deleteCommentHandler,
    createReplyHandler
} from "../controllers/comment.controller";

export async function recipesRoutes(app: FastifyInstance) {

    // ========== ROUTES RECETTES ==========

    app.get("/recipes", async (request, reply) => {
        const data = await getAllRecipes();
        sendSuccess(reply, data, data.length ? 'Recipes found' : 'No recipes yet');
    });

    app.post("/recipes", { preHandler: authMiddleware }, async (request, reply) => {
        const body = request.body as any;
        const recipe = await createRecipe({
            ...body,
            authorId: request.user!.id
        });
        sendCreated(reply, recipe, 'Recipe created successfully');
    });

    app.get("/recipes/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const recipe = await getRecipeById(id);
        sendSuccess(reply, recipe, 'Recipe found');
    });

    app.put("/recipes/:id", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const existingRecipe = await getRecipeById(id);
        if (!existingRecipe) {
            throw new NotFoundError('Recipe not found');
        }
        if (existingRecipe.authorId !== request.user!.id) {
            throw new ForbiddenError('You do not have access to update this recipe');
        }
        const body = request.body as any;
        const recipe = await updateRecipe(id, body);
        sendSuccess(reply, recipe, 'Recipe updated successfully');
    });

    app.delete("/recipes/:id", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const existingRecipe = await getRecipeById(id);
        if (!existingRecipe) {
            throw new NotFoundError('Recipe not found');
        }
        if (existingRecipe.authorId !== request.user!.id) {
            throw new ForbiddenError('You do not have access to delete this recipe');
        }
        const recipe = await deleteRecipe(id);
        sendDeleted(reply, recipe, 'Recipe deleted successfully');
    });

    app.get("/recipes/by-slug/:slug", async (request, reply) => {
        const { slug } = request.params as { slug: string };
        const recipe = await getRecipeBySlug(slug);
        if (!recipe) {
            throw new Error('Recipe not found');
        }
        sendSuccess(reply, recipe, 'Recipe found');
    });

    app.get("/recipes/search", async (request, reply) => {
        const {
            q,
            categoryId,
            difficulty,
            page,
            limit,
            sortBy,
            sortOrder,
            minPrepTime,
            maxPrepTime,
            minCookTime,
            maxCookTime,
            servings
        } = request.query as {
            q?: string;
            categoryId?: string;
            difficulty?: string;
            page?: string;
            limit?: string;
            sortBy?: string;
            sortOrder?: string;
            minPrepTime?: string;
            maxPrepTime?: string;
            minCookTime?: string;
            maxCookTime?: string;
            servings?: string;
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const minPrepTimeNum = minPrepTime ? parseInt(minPrepTime, 10) : undefined;
        const maxPrepTimeNum = maxPrepTime ? parseInt(maxPrepTime, 10) : undefined;
        const minCookTimeNum = minCookTime ? parseInt(minCookTime, 10) : undefined;
        const maxCookTimeNum = maxCookTime ? parseInt(maxCookTime, 10) : undefined;
        const servingsNum = servings ? parseInt(servings, 10) : undefined;
        const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];
        const difficultyEnum = difficulty && validDifficulties.includes(difficulty.toUpperCase())
            ? difficulty.toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD'
            : undefined;
        const validSortBy = ['createdAt', 'title', 'prepTime', 'cookTime', 'viewCount'] as const;
        const sortByValidated = sortBy && validSortBy.includes(sortBy as any) ? sortBy as typeof validSortBy[number] : 'createdAt';
        const validSortOrder = ['asc', 'desc'] as const;
        const sortOrderValidated = sortOrder && validSortOrder.includes(sortOrder as any) ? sortOrder as typeof validSortOrder[number] : 'desc';
        const data = await getAllRecipesBySearch(
            pageNum,
            limitNum,
            categoryId,
            difficultyEnum,
            q,
            undefined,
            undefined,
            sortByValidated,
            sortOrderValidated,
            minPrepTimeNum,
            maxPrepTimeNum,
            minCookTimeNum,
            maxCookTimeNum,
            servingsNum
        );
        sendSuccess(reply, data, 'Recipes found');
    });

    app.get("/recipes/category/:categoryId", async (request, reply) => {
        const { categoryId } = request.params as { categoryId: string };
        const existCategoryId = await getCategoryById(categoryId);
        if (!existCategoryId) {
            throw new NotFoundError('Category not found');
        }
        const {
            page,
            limit,
            sortBy,
            sortOrder
        } = request.query as {
            page?: string;
            limit?: string;
            sortBy?: string;
            sortOrder?: string;
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const validSortBy = ['createdAt', 'title', 'prepTime', 'cookTime', 'viewCount'] as const;
        const sortByValidated = sortBy && validSortBy.includes(sortBy as any) ? sortBy as typeof validSortBy[number] : 'createdAt';
        const validSortOrder = ['asc', 'desc'] as const;
        const sortOrderValidated = sortOrder && validSortOrder.includes(sortOrder as any) ? sortOrder as typeof validSortOrder[number] : 'desc';
        const data = await getRecipesByCategory(
            categoryId,
            pageNum,
            limitNum,
            sortByValidated,
            sortOrderValidated,
        );
        sendSuccess(reply, data, 'Recipes found');
    });

    app.get("/recipes/author/:authorId", async (request, reply) => {
        const { authorId } = request.params as { authorId: string };
        const {
            page,
            limit,
            sortBy,
            sortOrder
        } = request.query as {
            page?: string;
            limit?: string;
            sortBy?: string;
            sortOrder?: string;
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const validSortBy = ['createdAt', 'title', 'prepTime', 'cookTime', 'viewCount'] as const;
        const sortByValidated = sortBy && validSortBy.includes(sortBy as any) ? sortBy as typeof validSortBy[number] : 'createdAt';
        const validSortOrder = ['asc', 'desc'] as const;
        const sortOrderValidated = sortOrder && validSortOrder.includes(sortOrder as any) ? sortOrder as typeof validSortOrder[number] : 'desc';
        const data = await getRecipesByAuthor(
            authorId,
            pageNum,
            limitNum,
            undefined,
            sortByValidated,
            sortOrderValidated
        );
        sendSuccess(reply, data, 'Recipes found');
    });

    app.get("/recipes/difficulty/:difficulty", async (request, reply) => {
        const { difficulty } = request.params as { difficulty: string };
        const {
            page,
            limit,
            sortBy,
            sortOrder
        } = request.query as {
            page?: string;
            limit?: string;
            sortBy?: string;
            sortOrder?: string;
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const validSortBy = ['createdAt', 'title', 'prepTime', 'cookTime', 'viewCount'] as const;
        const sortByValidated = sortBy && validSortBy.includes(sortBy as any) ? sortBy as typeof validSortBy[number] : 'createdAt';
        const validSortOrder = ['asc', 'desc'] as const;
        const sortOrderValidated = sortOrder && validSortOrder.includes(sortOrder as any) ? sortOrder as typeof validSortOrder[number] : 'desc';
        const validDifficulties = ['EASY', 'MEDIUM', 'HARD'] as const;
        if (!validDifficulties.includes(difficulty as any)) {
            throw new NotFoundError('Invalid difficulty level');
        }
        const data = await getRecipesByDifficulty(
            difficulty as 'EASY' | 'MEDIUM' | 'HARD',
            pageNum,
            limitNum,
            sortByValidated,
            sortOrderValidated
        );
        sendSuccess(reply, data, 'Recipes found');
    });

    app.get("/recipes/me", { preHandler: authMiddleware }, async (request, reply) => {
        const {
            page,
            limit,
            sortBy,
            sortOrder,
            publishedOnly
        } = request.query as {
            page?: string;
            limit?: string;
            sortBy?: string;
            sortOrder?: string;
            publishedOnly?: string;
        };
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const validSortBy = ['createdAt', 'title', 'prepTime', 'cookTime', 'viewCount'] as const;
        const sortByValidated = sortBy && validSortBy.includes(sortBy as any) ? sortBy as typeof validSortBy[number] : 'createdAt';
        const validSortOrder = ['asc', 'desc'] as const;
        const sortOrderValidated = sortOrder && validSortOrder.includes(sortOrder as any) ? sortOrder as typeof validSortOrder[number] : 'desc';
        const publishedOnlyBool = publishedOnly === 'true' ? true : false;
        const data = await getMyRecipes(
            request.user!.id,
            pageNum,
            limitNum,
            publishedOnlyBool,
            sortByValidated,
            sortOrderValidated
        )
        sendSuccess(reply, data, 'Your recipes retrieved');
    });

    // ========== ROUTES RATINGS ==========

    app.post("/recipes/:id/ratings", {
        preHandler: [authMiddleware, paramValidator(z.object({
            id: z.string().min(1)
        })), bodyValidator(z.object({
            score: z.number().min(1).max(5)
        }))]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const { score } = request.body as { score: number };

        const rating = await rateRecipe(id, request.user!.id, score);
        sendCreated(reply, rating, 'Rating added successfully');
    });

    app.put("/recipes/:id/ratings", {
        preHandler: [authMiddleware, paramValidator(z.object({
            id: z.string().min(1)
        })), bodyValidator(z.object({
            score: z.number().min(1).max(5)
        }))]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const { score } = request.body as { score: number };

        const rating = await rateRecipe(id, request.user!.id, score);
        sendSuccess(reply, rating, 'Rating updated successfully');
    });

    app.get("/recipes/:id/ratings", {
        preHandler: [paramValidator(z.object({
            id: z.string().min(1)
        }))]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const ratings = await getRecipeRatings(id);
        sendSuccess(reply, ratings, 'Ratings retrieved');
    });

    app.delete("/recipes/:id/ratings", {
        preHandler: [authMiddleware, paramValidator(z.object({
            id: z.string().min(1)
        }))]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const result = await removeRecipeRating(id, request.user!.id);
        sendSuccess(reply, result, 'Rating removed successfully');
    });

    // ================= ROUTES COMMENTS =================

    app.get("/recipes/:id/comments", async (request, reply) => {
        const { id } = request.params as { id: string };
        const comments = await getComments(request, reply);
        sendSuccess(reply, comments, "Comments retrieved successfully");
    });

    app.post("/recipes/:id/comments", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const comment = await createCommentHandler(request, reply);
        sendCreated(reply, comment, "Comment created successfully");
    });

    app.put("/recipes/:id/comments/:commentId", { preHandler: authMiddleware }, async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        const comment = await updateCommentHandler(request, reply);
        sendSuccess(reply, comment, "Comment updated successfully");
    });

    app.delete("/recipes/:id/comments/:commentId", { preHandler: authMiddleware }, async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        const result = await deleteCommentHandler(request, reply);
        sendSuccess(reply, result, "Comment deleted successfully");
    });

    app.post("/recipes/:id/comments/:commentId/replies", { preHandler: authMiddleware }, async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        const replyComment = await createReplyHandler(request, reply);
        sendCreated(reply, replyComment, "Reply created successfully");
    });

    // ================= ROUTES FAVORITES =================

    app.post("/recipes/:id/favorite", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const favorite = await addToFavorites(request.user!.id, id);
        sendCreated(reply, favorite, "Recipe added to favorites");
    });

    app.delete("/recipes/:id/favorite", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const result = await removeFromFavorites(request.user!.id, id);
        sendSuccess(reply, result, "Recipe removed from favorites");
    });

    app.get("/me/favorites", { preHandler: authMiddleware }, async (request, reply) => {
        const query = request.query as { page?: string; limit?: string; sortBy?: string; sortOrder?: string };
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.limit || '10');
        const sortBy = query.sortBy || 'createdAt';
        const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
        const favorites = await getUserFavorites(request.user!.id, page, limit, sortBy, sortOrder);
        sendSuccess(reply, favorites, "User favorites retrieved successfully");
    });
}
