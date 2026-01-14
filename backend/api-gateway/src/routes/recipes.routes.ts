import { FastifyInstance } from "fastify";
import { proxyHydrate } from "../utils/proxy";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../../../.env"),
});

const DOMAIN = process.env.DOMAIN;
const RECIPE_SERVICE_PORT = process.env.RECIPE_SERVICE_PORT;

const RECIPE_SERVICE_URL = `${DOMAIN}:${RECIPE_SERVICE_PORT}`;

if (!RECIPE_SERVICE_URL) {
    throw new Error("RECIPE_SERVICE_URL is not defined");
}

export async function recipesRoutes(app: FastifyInstance) {
    app.get("/recipes", async (request, reply) => {
        console.log("Recipe service URL: ", RECIPE_SERVICE_URL);
        return proxyHydrate(app, request, reply, "/api/v1/recipes", RECIPE_SERVICE_URL);
    });

    app.get("/recipes/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes", async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/recipes", RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/by-slug/:slug", async (request, reply) => {
        const { slug } = request.params as { slug: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/by-slug/${slug}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:id/ratings", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/ratings`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/:id/ratings", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/ratings`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:id/ratings", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/ratings`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id/ratings", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/ratings`, RECIPE_SERVICE_URL);
    });

    app.post("/categories", async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/categories", RECIPE_SERVICE_URL);
    });

    app.get("/categories", async (request, reply) => {
        console.log("Recipe service URL: ", RECIPE_SERVICE_URL);
        return proxyHydrate(app, request, reply, "/api/v1/categories", RECIPE_SERVICE_URL);
    });

    app.get("/categories/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/${id}`, RECIPE_SERVICE_URL);
    });

    app.get("/categories/by-slug/:slug", async (request, reply) => {
        const { slug } = request.params as { slug: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/by-slug/${slug}`, RECIPE_SERVICE_URL);
    });

    app.put("/categories/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/categories/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/${id}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/search", async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/recipes/search", RECIPE_SERVICE_URL);
    });

    app.get("/recipes/category/:categoryId", async (request, reply) => {
        const { categoryId } = request.params as { categoryId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/category/${categoryId}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/author/:authorId", async (request, reply) => {
        const { authorId } = request.params as { authorId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/author/${authorId}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/difficulty/:difficulty", async (request, reply) => {
        const { difficulty } = request.params as { difficulty: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/difficulty/${difficulty}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/me", async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/recipes/me", RECIPE_SERVICE_URL);
    });

    app.get("/recipes/:id/comments", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:id/comments", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:id/comments/:commentId", async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments/${commentId}`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id/comments/:commentId", async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments/${commentId}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:id/comments/:commentId/replies", async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments/${commentId}/replies`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:id/favorite", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/favorite`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id/favorite", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/favorite`, RECIPE_SERVICE_URL);
    });

    app.get("/me/favorites", async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/me/favorites", RECIPE_SERVICE_URL);
    });

    app.get("/recipes/:recipeId/images", async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/upload", async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        const { proxyMultipart } = await import("../utils/proxy");
        return proxyMultipart(request, reply, `/api/v1/recipes/${recipeId}/images/upload`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/url", async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/url`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:recipeId/images/bulk", async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/bulk`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:recipeId/images/:imageId", async (request, reply) => {
        const { recipeId, imageId } = request.params as { recipeId: string; imageId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/${imageId}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/:imageId/primary", async (request, reply) => {
        const { recipeId, imageId } = request.params as { recipeId: string; imageId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/${imageId}/primary`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:recipeId/images/:imageId", async (request, reply) => {
        const { recipeId, imageId } = request.params as { recipeId: string; imageId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/${imageId}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/urls", async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/urls`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/uploads", async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        const { proxyMultipart } = await import("../utils/proxy");
        return proxyMultipart(request, reply, `/api/v1/recipes/${recipeId}/images/uploads`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:recipeId/images/reorder", async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/reorder`, RECIPE_SERVICE_URL);
    });
}
