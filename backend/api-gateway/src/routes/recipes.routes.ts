import { FastifyInstance } from "fastify";
import { proxyHydrate } from "../utils/proxy";
import { commonResponses } from "../utils/swagger.schemas";
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
    app.get("/recipes", {
        schema: {
            tags: ["Recipes"],
            summary: "Get all recipes",
            querystring: {
                type: "object",
                properties: {
                    page: { type: "integer", default: 1 },
                    limit: { type: "integer", default: 10 }
                },
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        recipes: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string", format: "uuid" },
                                    title: { type: "string" },
                                    slug: { type: "string" },
                                    description: { type: "string" },
                                    prepTime: { type: "integer" },
                                    cookTime: { type: "integer" },
                                    difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"] },
                                    viewCount: { type: "integer" },
                                    createdAt: { type: "string", format: "date-time" },
                                    author: { type: "object", properties: { id: { type: "string", format: "uuid" }, username: { type: "string" }, avatarUrl: { type: "string" } } }
                                }
                            }
                        },
                        total: { type: "integer" },
                        page: { type: "integer" }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/recipes", RECIPE_SERVICE_URL);
    });

    app.get("/recipes/:id", {
        schema: {
            tags: ["Recipes"],
            summary: "Get recipe by ID",
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                },
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        title: { type: "string" },
                        slug: { type: "string" },
                        description: { type: "string" },
                        prepTime: { type: "integer" },
                        cookTime: { type: "integer" },
                        servings: { type: "integer" },
                        difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"] },
                        isPublished: { type: "boolean" },
                        ingredients: { type: "array", items: { type: "object", properties: { name: { type: "string" }, quantityText: { type: "string" }, isOptional: { type: "boolean" } } } },
                        instructions: { type: "array", items: { type: "object", properties: { stepNumber: { type: "integer" }, description: { type: "string" } } } },
                        authorId: { type: "string", format: "uuid" },
                        author: { type: "object", properties: { id: { type: "string", format: "uuid" }, username: { type: "string" }, avatarUrl: { type: "string" } } },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes", {
        schema: {
            tags: ["Recipes"],
            summary: "Create a new recipe",
            body: {
                type: "object",
                required: ["title", "description", "ingredients", "instructions", "prepTime", "cookTime", "servings", "categoryId"],
                properties: {
                    title: { type: "string", minLength: 1, maxLength: 200 },
                    description: { type: "string", minLength: 1, maxLength: 2000 },
                    ingredients: {
                        type: "array",
                        items: {
                            type: "object",
                            required: ["name", "quantityText"],
                            properties: {
                                name: { type: "string" },
                                quantityText: { type: "string" },
                                isOptional: { type: "boolean" }
                            }
                        }
                    },
                    instructions: {
                        type: "array",
                        items: {
                            type: "object",
                            required: ["stepNumber", "description"],
                            properties: {
                                stepNumber: { type: "integer" },
                                description: { type: "string" }
                            }
                        }
                    },
                    prepTime: { type: "integer", minimum: 0 },
                    cookTime: { type: "integer", minimum: 0 },
                    servings: { type: "integer", minimum: 1 },
                    difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"] },
                    categoryId: { type: "string" },
                    isPublished: { type: "boolean" },
                    dietaryTagIds: { type: "array", items: { type: "string" } }
                }
            },
            response: {
                201: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        title: { type: "string" }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/recipes", RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:id", {
        schema: {
            tags: ["Recipes"],
            summary: "Update recipe",
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                },
            },
            body: {
                type: "object",
                properties: {
                    title: { type: "string", minLength: 1, maxLength: 200 },
                    description: { type: "string", minLength: 1, maxLength: 2000 },
                    ingredients: {
                        type: "array",
                        items: {
                            type: "object",
                            required: ["name", "quantityText"],
                            properties: {
                                name: { type: "string" },
                                quantityText: { type: "string" },
                                isOptional: { type: "boolean" }
                            }
                        }
                    },
                    instructions: {
                        type: "array",
                        items: {
                            type: "object",
                            required: ["stepNumber", "description"],
                            properties: {
                                stepNumber: { type: "integer" },
                                description: { type: "string" }
                            }
                        }
                    },
                    prepTime: { type: "integer", minimum: 0 },
                    cookTime: { type: "integer", minimum: 0 },
                    servings: { type: "integer", minimum: 1 },
                    difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"] },
                    categoryId: { type: "string" },
                    isPublished: { type: "boolean" },
                    dietaryTagIds: { type: "array", items: { type: "string" } }
                }
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        title: { type: "string" }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id", {
        schema: {
            tags: ["Recipes"],
            summary: "Delete recipe",
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                },
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/by-slug/:slug", {
        schema: {
            tags: ["Recipes"],
            summary: "Get recipe by Slug",
            params: {
                type: "object",
                properties: {
                    slug: { type: "string" }
                },
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        title: { type: "string" },
                        slug: { type: "string" },
                        description: { type: "string" },
                        prepTime: { type: "integer" },
                        cookTime: { type: "integer" },
                        servings: { type: "integer" },
                        difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"] },
                        isPublished: { type: "boolean" },
                        ingredients: { type: "array", items: { type: "object", properties: { name: { type: "string" }, quantityText: { type: "string" }, isOptional: { type: "boolean" } } } },
                        instructions: { type: "array", items: { type: "object", properties: { stepNumber: { type: "integer" }, description: { type: "string" } } } },
                        authorId: { type: "string", format: "uuid" },
                        author: { type: "object", properties: { id: { type: "string", format: "uuid" }, username: { type: "string" }, avatarUrl: { type: "string" } } },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
            }
        }
    }, async (request, reply) => {
        const { slug } = request.params as { slug: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/by-slug/${slug}`, RECIPE_SERVICE_URL);
    });

    // Ratings
    app.post("/recipes/:id/ratings", {
        schema: {
            tags: ["Recipes"],
            summary: "Rate a recipe",
            params: { type: "object", properties: { id: { type: "string", format: "uuid" } } },
            body: { type: "object", properties: { rating: { type: "number", minimum: 1, maximum: 5 } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/ratings`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/:id/ratings", {
        schema: {
            tags: ["Recipes"],
            summary: "Get ratings for a recipe",
            params: { type: "object", properties: { id: { type: "string", format: "uuid" } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/ratings`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:id/ratings", {
        schema: {
            tags: ["Recipes"],
            summary: "Update rating",
            params: { type: "object", properties: { id: { type: "string", format: "uuid" } } },
            body: { type: "object", properties: { rating: { type: "number" } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/ratings`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id/ratings", {
        schema: {
            tags: ["Recipes"],
            summary: "Delete rating",
            params: { type: "object", properties: { id: { type: "string", format: "uuid" } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/ratings`, RECIPE_SERVICE_URL);
    });

    // Categories
    app.post("/categories", {
        schema: {
            tags: ["Categories"],
            summary: "Create category",
            body: { type: "object", required: ["name"], properties: { name: { type: "string" } } }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/categories", RECIPE_SERVICE_URL);
    });

    app.get("/categories", {
        schema: { tags: ["Categories"], summary: "Get all categories" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/categories", RECIPE_SERVICE_URL);
    });

    app.get("/categories/:id", {
        schema: { tags: ["Categories"], summary: "Get category by ID", params: { type: "object", properties: { id: { type: "string", format: "uuid" } } } }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/${id}`, RECIPE_SERVICE_URL);
    });

    app.get("/categories/by-slug/:slug", {
        schema: { tags: ["Categories"], summary: "Get category by slug", params: { type: "object", properties: { slug: { type: "string" } } } }
    }, async (request, reply) => {
        const { slug } = request.params as { slug: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/by-slug/${slug}`, RECIPE_SERVICE_URL);
    });

    app.put("/categories/:id", {
        schema: { tags: ["Categories"], summary: "Update category", params: { type: "object", properties: { id: { type: "string", format: "uuid" } } } }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/categories/:id", {
        schema: { tags: ["Categories"], summary: "Delete category", params: { type: "object", properties: { id: { type: "string", format: "uuid" } } } }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/${id}`, RECIPE_SERVICE_URL);
    });

    // Search & Filters
    app.get("/recipes/search", {
        schema: { tags: ["Recipes"], summary: "Search recipes", querystring: { type: "object", properties: { q: { type: "string" } } } }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/recipes/search", RECIPE_SERVICE_URL);
    });

    app.get("/recipes/category/:categoryId", {
        schema: { tags: ["Recipes"], summary: "Get recipes by category", params: { type: "object", properties: { categoryId: { type: "string" } } } }
    }, async (request, reply) => {
        const { categoryId } = request.params as { categoryId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/category/${categoryId}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/author/:authorId", {
        schema: { tags: ["Recipes"], summary: "Get recipes by author", params: { type: "object", properties: { authorId: { type: "string", format: "uuid" } } } }
    }, async (request, reply) => {
        const { authorId } = request.params as { authorId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/author/${authorId}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/difficulty/:difficulty", {
        schema: { tags: ["Recipes"], summary: "Get recipes by difficulty", params: { type: "object", properties: { difficulty: { type: "string" } } } }
    }, async (request, reply) => {
        const { difficulty } = request.params as { difficulty: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/difficulty/${difficulty}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/me", {
        schema: { tags: ["Recipes"], summary: "Get my recipes" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/recipes/me", RECIPE_SERVICE_URL);
    });

    // Comments
    app.get("/recipes/:id/comments", {
        schema: { tags: ["Comments"], summary: "Get comments", params: { type: "object", properties: { id: { type: "string", format: "uuid" } } } }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:id/comments", {
        schema: {
            tags: ["Comments"],
            summary: "Post comment",
            body: {
                type: "object",
                required: ["content"],
                properties: {
                    content: { type: "string", minLength: 1, maxLength: 2000 }
                }
            },
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:id/comments/:commentId", {
        schema: { tags: ["Comments"], summary: "Update comment", params: { type: "object", properties: { id: { type: "string", format: "uuid" }, commentId: { type: "string" } } } }
    }, async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments/${commentId}`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id/comments/:commentId", {
        schema: { tags: ["Comments"], summary: "Delete comment", params: { type: "object", properties: { id: { type: "string", format: "uuid" }, commentId: { type: "string" } } } }
    }, async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments/${commentId}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:id/comments/:commentId/replies", {
        schema: { tags: ["Comments"], summary: "Reply to comment", params: { type: "object", properties: { id: { type: "string", format: "uuid" }, commentId: { type: "string" } } } }
    }, async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments/${commentId}/replies`, RECIPE_SERVICE_URL);
    });

    // Favorites
    app.post("/recipes/:id/favorite", {
        schema: { tags: ["Recipes"], summary: "Add to favorites", params: { type: "object", properties: { id: { type: "string", format: "uuid" } } } }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/favorite`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id/favorite", {
        schema: { tags: ["Recipes"], summary: "Remove from favorites", params: { type: "object", properties: { id: { type: "string", format: "uuid" } } } }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/favorite`, RECIPE_SERVICE_URL);
    });

    app.get("/me/favorites", {
        schema: { tags: ["Recipes"], summary: "Get my favorites" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/me/favorites", RECIPE_SERVICE_URL);
    });

    // Images
    app.get("/recipes/:recipeId/images", {
        schema: { tags: ["Images"], summary: "Get recipe images", params: { type: "object", properties: { recipeId: { type: "string" } } } }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/upload", {
        schema: {
            tags: ["Images"], summary: "Upload image",
            consumes: ['multipart/form-data'],
            body: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } }
        }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        const { proxyMultipart } = await import("../utils/proxy");
        return proxyMultipart(request, reply, `/api/v1/recipes/${recipeId}/images/upload`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/url", {
        schema: { tags: ["Images"], summary: "Add image by URL", params: { type: "object", properties: { recipeId: { type: "string" } } } }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/url`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:recipeId/images/bulk", {
        schema: { tags: ["Images"], summary: "Bulk delete images", params: { type: "object", properties: { recipeId: { type: "string" } } } }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/bulk`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:recipeId/images/:imageId", {
        schema: { tags: ["Images"], summary: "Update image" }
    }, async (request, reply) => {
        const { recipeId, imageId } = request.params as { recipeId: string; imageId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/${imageId}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/:imageId/primary", {
        schema: { tags: ["Images"], summary: "Set primary image" }
    }, async (request, reply) => {
        const { recipeId, imageId } = request.params as { recipeId: string; imageId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/${imageId}/primary`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:recipeId/images/:imageId", {
        schema: { tags: ["Images"], summary: "Delete image" }
    }, async (request, reply) => {
        const { recipeId, imageId } = request.params as { recipeId: string; imageId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/${imageId}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/urls", {
        schema: { tags: ["Images"], summary: "Add multiple images by URLs" }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/urls`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/uploads", {
        schema: { tags: ["Images"], summary: "Upload multiple images", consumes: ['multipart/form-data'] }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        const { proxyMultipart } = await import("../utils/proxy");
        return proxyMultipart(request, reply, `/api/v1/recipes/${recipeId}/images/uploads`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:recipeId/images/reorder", {
        schema: { tags: ["Images"], summary: "Reorder images" }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/reorder`, RECIPE_SERVICE_URL);
    });

    // Dietary Tags
    app.post("/dietary-tags", {
        schema: { tags: ["Dietary Tags"], summary: "Create dietary tag" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/dietary-tags", RECIPE_SERVICE_URL);
    });

    app.get("/dietary-tags", {
        schema: { tags: ["Dietary Tags"], summary: "Get all dietary tags" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/dietary-tags", RECIPE_SERVICE_URL);
    });

    app.get("/dietary-tags/:id", {
        schema: { tags: ["Dietary Tags"], summary: "Get dietary tag" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/dietary-tags/${id}`, RECIPE_SERVICE_URL);
    });

    app.put("/dietary-tags/:id", {
        schema: { tags: ["Dietary Tags"], summary: "Update dietary tag" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/dietary-tags/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/dietary-tags/:id", {
        schema: { tags: ["Dietary Tags"], summary: "Delete dietary tag" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/dietary-tags/${id}`, RECIPE_SERVICE_URL);
    });

    // Collections
    app.post("/collections", {
        schema: { tags: ["Collections"], summary: "Create collection" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/collections", RECIPE_SERVICE_URL);
    });

    app.get("/collections", {
        schema: { tags: ["Collections"], summary: "Get all collections" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/collections", RECIPE_SERVICE_URL);
    });

    app.get("/collections/:id", {
        schema: { tags: ["Collections"], summary: "Get collection details" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/collections/${id}`, RECIPE_SERVICE_URL);
    });

    app.put("/collections/:id", {
        schema: { tags: ["Collections"], summary: "Update collection" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/collections/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/collections/:id", {
        schema: { tags: ["Collections"], summary: "Delete collection" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/collections/${id}`, RECIPE_SERVICE_URL);
    });

    app.post("/collections/:id/recipes", {
        schema: { tags: ["Collections"], summary: "Add recipe to collection" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/collections/${id}/recipes`, RECIPE_SERVICE_URL);
    });

    app.delete("/collections/:id/recipes/:recipeId", {
        schema: { tags: ["Collections"], summary: "Remove recipe from collection" }
    }, async (request, reply) => {
        const { id, recipeId } = request.params as { id: string; recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/collections/${id}/recipes/${recipeId}`, RECIPE_SERVICE_URL);
    });

    // Shopping List
    app.get("/shopping-list", {
        schema: { tags: ["Shopping List"], summary: "Get shopping list" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/shopping-list", RECIPE_SERVICE_URL);
    });

    app.post("/shopping-list/items", {
        schema: { tags: ["Shopping List"], summary: "Add item manual" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/shopping-list/items", RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:id/shopping-list", {
        schema: { tags: ["Shopping List"], summary: "Add ingredients from recipe" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/shopping-list`, RECIPE_SERVICE_URL);
    });

    app.put("/shopping-list/items/:id", {
        schema: { tags: ["Shopping List"], summary: "Update item" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/shopping-list/items/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/shopping-list/items/:id", {
        schema: { tags: ["Shopping List"], summary: "Remove item" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/shopping-list/items/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/shopping-list/checked", {
        schema: { tags: ["Shopping List"], summary: "Clean checked items" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/shopping-list/checked", RECIPE_SERVICE_URL);
    });

    app.delete("/shopping-list", {
        schema: { tags: ["Shopping List"], summary: "Clear shopping list" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/shopping-list", RECIPE_SERVICE_URL);
    });

    // Meal Plans
    app.post("/meal-plans", {
        schema: { tags: ["Meal Plans"], summary: "Create meal plan" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/meal-plans", RECIPE_SERVICE_URL);
    });

    app.get("/meal-plans", {
        schema: { tags: ["Meal Plans"], summary: "Get meal plans" }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/meal-plans", RECIPE_SERVICE_URL);
    });

    app.get("/meal-plans/:date", {
        schema: { tags: ["Meal Plans"], summary: "Get meal plan by date" }
    }, async (request, reply) => {
        const { date } = request.params as { date: string };
        return proxyHydrate(app, request, reply, `/api/v1/meal-plans/${date}`, RECIPE_SERVICE_URL);
    });

    app.put("/meal-plans/:id", {
        schema: { tags: ["Meal Plans"], summary: "Update meal plan" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/meal-plans/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/meal-plans/:id", {
        schema: { tags: ["Meal Plans"], summary: "Delete meal plan" }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/meal-plans/${id}`, RECIPE_SERVICE_URL);
    });

    // ADMIN ROUTES - HIDDEN
    app.post("/recipes/:id/report", {
        schema: { hide: true }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/report`, RECIPE_SERVICE_URL);
    });

    app.post("/comments/:id/report", {
        schema: { hide: true }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/comments/${id}/report`, RECIPE_SERVICE_URL);
    });

    app.get("/admin/reports", {
        schema: { hide: true }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/admin/reports", RECIPE_SERVICE_URL);
    });

    app.get("/admin/reports/stats", {
        schema: { hide: true }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/admin/reports/stats", RECIPE_SERVICE_URL);
    });

    app.get("/admin/reports/:id", {
        schema: { hide: true }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/admin/reports/${id}`, RECIPE_SERVICE_URL);
    });

    app.put("/admin/reports/:id", {
        schema: { hide: true }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/admin/reports/${id}`, RECIPE_SERVICE_URL);
    });
}
