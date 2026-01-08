import { FastifyInstance } from "fastify";
import { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe, getRecipeBySlug, rateRecipe, getRecipeRatings, removeRecipeRating } from "../services/recipe.service";
import { sendSuccess, sendCreated, sendDeleted, ForbiddenError, NotFoundError } from "@transcendence/common";
import { authMiddleware } from "@transcendence/common";

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

    app.get("/recipes/slug/:slug", async (request, reply) => {
        const { slug } = request.params as { slug: string };
        const recipe = await getRecipeBySlug(slug);
        if (!recipe) {
            throw new Error('Recipe not found');
        }
        sendSuccess(reply, recipe, 'Recipe found');
    });

    // ========== ROUTES RATINGS ==========

    app.post("/recipes/:id/rate", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const { score } = request.body as { score: number };

        const rating = await rateRecipe(id, request.user!.id, score);
        sendCreated(reply, rating, 'Rating added successfully');
    });

    app.get("/recipes/:id/ratings", async (request, reply) => {
        const { id } = request.params as { id: string };
        const ratings = await getRecipeRatings(id);
        sendSuccess(reply, ratings, 'Ratings retrieved');
    });

    app.delete("/recipes/:id/ratings", { preHandler: authMiddleware }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const result = await removeRecipeRating(id, request.user!.id);
        sendSuccess(reply, result, 'Rating removed successfully');
    });
}
