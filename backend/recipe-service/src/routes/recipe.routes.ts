import { FastifyInstance } from "fastify";
import { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe, getRecipeBySlug, rateRecipe, getRecipeRatings, removeRecipeRating } from "../services/recipe.service";
import { sendSuccess, sendCreated, sendDeleted, ForbiddenError } from "@transcendence/common";

export async function recipesRoutes(app: FastifyInstance) {

    // ========== ROUTES RECETTES ==========

    app.get("/recipes", async (request, reply) => {
        const data = await getAllRecipes();
        sendSuccess(reply, data, data.length ? 'Recipes found' : 'No recipes yet');
    });

    app.post("/recipes", async (request, reply) => {
        const body = request.body as any;
        const recipe = await createRecipe(body);
        sendCreated(reply, recipe, 'Recipe created successfully');
    });

    app.get("/recipes/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const recipe = await getRecipeById(id);
        sendSuccess(reply, recipe, 'Recipe found');
    });

    app.put("/recipes/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as any;
        const recipe = await updateRecipe(id, body);
        sendSuccess(reply, recipe, 'Recipe updated successfully');
    });

    app.delete("/recipes/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const recipe = await deleteRecipe(id);
        if (!recipe) {
            throw new Error('Recipe not found');
        }
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

    app.post("/recipes/:id/rate", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { userId, score } = request.body as { userId: string, score: number };

        const rating = await rateRecipe(id, userId, score);
        sendCreated(reply, rating, 'Rating added successfully');
    });

    app.get("/recipes/:id/ratings", async (request, reply) => {
        const { id } = request.params as { id: string };
        const ratings = await getRecipeRatings(id);
        sendSuccess(reply, ratings, 'Ratings retrieved');
    });

    app.delete("/recipes/:id/ratings", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { userId } = request.body as { userId: string };
        const result = await removeRecipeRating(id, userId);
        sendSuccess(reply, result, 'Rating removed successfully');
    });
}
