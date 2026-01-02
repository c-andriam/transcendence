import { FastifyInstance } from "fastify";
import { proxyHydrate } from "../utils/proxy";

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

    app.post("/recipes/:id/rate", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/rate`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/:id/rate", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/rate`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id/rate", async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/rate`, RECIPE_SERVICE_URL);
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
}
