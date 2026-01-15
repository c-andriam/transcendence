import { FastifyInstance } from "fastify";
import { proxyHydrate } from "../utils/proxy";
import { commonResponses, createResponseSchema, recipeFullSchema, recipeSummarySchema, paginationSchema, categorySummarySchema, imageSchema } from "../utils/swagger.schemas";
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
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Retrieve a list of all published recipes. Note: For paginated search, use /recipes/search",
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: recipeSummarySchema
                }),
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
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Retrieve full details of a specific recipe including ingredients and instructions.",
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Unique recipe identifier" }
                },
            },
            response: {
                200: createResponseSchema(recipeFullSchema),
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
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Create a new recipe. Requires authentication. categoryId and authorId are required.",
            body: {
                type: "object",
                required: ["title", "description", "prepTime", "cookTime", "servings", "categoryId"],
                properties: {
                    title: { type: "string", minLength: 3, maxLength: 200, example: "Poulet Tikka Masala" },
                    description: { type: "string", minLength: 10, maxLength: 2000, example: "Un délicieux plat indien crémeux et épicé..." },
                    ingredients: {
                        type: "array",
                        minItems: 1,
                        items: {
                            type: "object",
                            required: ["name", "quantityText"],
                            properties: {
                                name: { type: "string", example: "Poulet" },
                                quantityText: { type: "string", example: "500g" },
                                isOptional: { type: "boolean", default: false }
                            }
                        }
                    },
                    instructions: {
                        type: "array",
                        minItems: 1,
                        items: {
                            type: "object",
                            required: ["stepNumber", "description"],
                            properties: {
                                stepNumber: { type: "integer", example: 1 },
                                description: { type: "string", example: "Couper le poulet en morceaux..." }
                            }
                        }
                    },
                    prepTime: { type: "integer", minimum: 0, description: "Preparation time in minutes", example: 30 },
                    cookTime: { type: "integer", minimum: 0, description: "Cooking time in minutes", example: 45 },
                    servings: { type: "integer", minimum: 1, example: 4 },
                    difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"], default: "MEDIUM" },
                    categoryId: { type: "string", format: "uuid", example: "76201871-6a2c-4060-a112-e91dee221b75" },
                    isPublished: { type: "boolean", default: false },
                    dietaryTagIds: { type: "array", items: { type: "string", format: "uuid" } }
                }
            },
            response: {
                201: createResponseSchema(recipeFullSchema),
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
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Partially update a recipe. Only the author can perform this action.",
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Unique recipe identifier" }
                },
            },
            body: {
                type: "object",
                properties: {
                    title: { type: "string", minLength: 3, maxLength: 200 },
                    description: { type: "string", minLength: 10, maxLength: 2000 },
                    ingredients: {
                        type: "array",
                        items: {
                            type: "object",
                            required: ["name", "quantityText"],
                            properties: {
                                id: { type: "string", format: "uuid" },
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
                                id: { type: "string", format: "uuid" },
                                stepNumber: { type: "integer" },
                                description: { type: "string" }
                            }
                        }
                    },
                    prepTime: { type: "integer", minimum: 0 },
                    cookTime: { type: "integer", minimum: 0 },
                    servings: { type: "integer", minimum: 1 },
                    difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"] },
                    categoryId: { type: "string", format: "uuid" },
                    isPublished: { type: "boolean" },
                    dietaryTagIds: { type: "array", items: { type: "string", format: "uuid" } }
                }
            },
            response: {
                200: createResponseSchema(recipeFullSchema),
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
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Soft delete a recipe. Only the author or an admin can perform this action.",
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Unique recipe identifier" }
                },
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Recipe deleted successfully" }
                    }
                }),
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
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Retrieve a recipe using its SEO-friendly slug.",
            params: {
                type: "object",
                properties: {
                    slug: { type: "string" }
                },
            },
            response: {
                200: createResponseSchema(recipeFullSchema),
                ...commonResponses
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
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Add a rating from 1 to 5 stars. Author cannot rate their own recipe.",
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            body: {
                type: "object",
                required: ["score"],
                properties: { score: { type: "number", minimum: 1, maximum: 5, example: 5 } }
            },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        userId: { type: "string", format: "uuid" },
                        recipeId: { type: "string", format: "uuid" },
                        score: { type: "number" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/ratings`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/:id/ratings", {
        schema: {
            tags: ["Recipes"],
            summary: "Get ratings summary for a recipe",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Retrieve average score and total number of raters.",
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        averageScore: { type: "number", example: 4.5 },
                        totalRaters: { type: "integer", example: 12 }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/ratings`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:id/ratings", {
        schema: {
            tags: ["Recipes"],
            summary: "Update rating",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            body: { type: "object", required: ["score"], properties: { score: { type: "number", minimum: 1, maximum: 5 } } },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        score: { type: "number" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/ratings`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id/ratings", {
        schema: {
            tags: ["Recipes"],
            summary: "Delete rating",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Remove your rating from a recipe.",
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        averageScore: { type: "number" },
                        totalRaters: { type: "integer" }
                    }
                }),
                ...commonResponses
            }
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
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Create a new recipe category. Required for grouping recipes.",
            body: {
                type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string", minLength: 2, example: "Dessert" },
                    description: { type: "string", example: "Sweet treats and pastries" }
                }
            },
            response: {
                201: createResponseSchema(categorySummarySchema),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/categories", RECIPE_SERVICE_URL);
    });

    app.get("/categories", {
        schema: {
            tags: ["Categories"],
            summary: "Get all categories",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: categorySummarySchema
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/categories", RECIPE_SERVICE_URL);
    });

    app.get("/categories/:id", {
        schema: {
            tags: ["Categories"],
            summary: "Get category by ID",
            description: "Retrieve a specific category by its unique identifier.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Unique category identifier" }
                }
            },
            response: {
                200: createResponseSchema(categorySummarySchema),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/${id}`, RECIPE_SERVICE_URL);
    });

    app.get("/categories/by-slug/:slug", {
        schema: {
            tags: ["Categories"],
            summary: "Get category by slug",
            description: "Retrieve a specific category by its URL-friendly slug.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["slug"],
                properties: {
                    slug: { type: "string", description: "URL-friendly category identifier" }
                }
            },
            response: {
                200: createResponseSchema(categorySummarySchema),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { slug } = request.params as { slug: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/by-slug/${slug}`, RECIPE_SERVICE_URL);
    });

    app.put("/categories/:id", {
        schema: {
            tags: ["Categories"],
            summary: "Update category",
            description: "Update an existing category. Admin access required.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Unique category identifier" }
                }
            },
            body: {
                type: "object",
                properties: {
                    name: { type: "string", minLength: 2 },
                    iconName: { type: "string" },
                    color: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
                    sortOrder: { type: "integer", minimum: 0 }
                }
            },
            response: {
                200: createResponseSchema(categorySummarySchema),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/categories/:id", {
        schema: {
            tags: ["Categories"],
            summary: "Delete category",
            description: "Delete a category. Admin access required. Will fail if recipes are using this category.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Unique category identifier" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Category deleted successfully" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/categories/${id}`, RECIPE_SERVICE_URL);
    });

    // Search & Filters
    app.get("/recipes/search", {
        schema: {
            tags: ["Recipes"],
            summary: "Search recipes",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Advanced search with multiple filters and pagination.",
            querystring: {
                type: "object",
                properties: {
                    q: { type: "string", description: "Search term for title/description/ingredients" },
                    categoryId: { type: "string", format: "uuid" },
                    difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"] },
                    page: { type: "integer", default: 1 },
                    limit: { type: "integer", default: 10 },
                    sortBy: { type: "string", enum: ["createdAt", "title", "prepTime", "cookTime", "viewCount"], default: "createdAt" },
                    sortOrder: { type: "string", enum: ["asc", "desc"], default: "desc" },
                    minPrepTime: { type: "integer" },
                    maxPrepTime: { type: "integer" },
                    minCookTime: { type: "integer" },
                    maxCookTime: { type: "integer" },
                    servings: { type: "integer" },
                    dietaryTags: { type: "array", items: { type: "string" }, description: "Array of dietary tag slugs" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        recipes: { type: "array", items: recipeSummarySchema },
                        pagination: paginationSchema
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/recipes/search", RECIPE_SERVICE_URL);
    });

    app.get("/recipes/category/:categoryId", {
        schema: {
            tags: ["Recipes"],
            summary: "Get recipes by category",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["categoryId"],
                properties: {
                    categoryId: { type: "string", format: "uuid", description: "Category ID" }
                }
            },
            querystring: {
                type: "object",
                properties: {
                    page: { type: "integer", default: 1 },
                    limit: { type: "integer", default: 10 }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        recipes: { type: "array", items: recipeSummarySchema },
                        pagination: paginationSchema
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { categoryId } = request.params as { categoryId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/category/${categoryId}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/author/:authorId", {
        schema: {
            tags: ["Recipes"],
            summary: "Get recipes by author",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["authorId"],
                properties: {
                    authorId: { type: "string", format: "uuid", description: "UUID of the author" }
                }
            },
            querystring: {
                type: "object",
                properties: {
                    page: { type: "integer", default: 1 },
                    limit: { type: "integer", default: 10 }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        recipes: { type: "array", items: recipeSummarySchema },
                        pagination: paginationSchema
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { authorId } = request.params as { authorId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/author/${authorId}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/difficulty/:difficulty", {
        schema: {
            tags: ["Recipes"],
            summary: "Get recipes by difficulty",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["difficulty"],
                properties: {
                    difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"], description: "Filter by difficulty level" }
                }
            },
            querystring: {
                type: "object",
                properties: {
                    page: { type: "integer", default: 1 },
                    limit: { type: "integer", default: 10 }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        recipes: { type: "array", items: recipeSummarySchema },
                        pagination: paginationSchema
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { difficulty } = request.params as { difficulty: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/difficulty/${difficulty}`, RECIPE_SERVICE_URL);
    });

    app.get("/recipes/me", {
        schema: {
            tags: ["Recipes"],
            summary: "Get my recipes",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Retrieve professional recipes created by the authenticated user, including unpublished drafts.",
            querystring: {
                type: "object",
                properties: {
                    page: { type: "integer", default: 1 },
                    limit: { type: "integer", default: 10 },
                    publishedOnly: { type: "boolean", default: false }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        recipes: { type: "array", items: recipeSummarySchema },
                        pagination: paginationSchema
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/recipes/me", RECIPE_SERVICE_URL);
    });

    // Comments
    app.get("/recipes/:id/comments", {
        schema: {
            tags: ["Comments"],
            summary: "Get comments for a recipe",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        comments: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string", format: "uuid" },
                                    content: { type: "string" },
                                    userId: { type: "string", format: "uuid" },
                                    recipeId: { type: "string", format: "uuid" },
                                    parentId: { type: "string", format: "uuid", nullable: true },
                                    createdAt: { type: "string", format: "date-time" },
                                    updatedAt: { type: "string", format: "date-time" },
                                    replies: {
                                        type: "array",
                                        items: { type: "object", additionalProperties: true }
                                    }
                                }
                            }
                        },
                        pagination: paginationSchema
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:id/comments", {
        schema: {
            tags: ["Comments"],
            summary: "Post a comment on a recipe",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            body: {
                type: "object",
                required: ["content"],
                properties: {
                    content: { type: "string", minLength: 1, maxLength: 2000, example: "This recipe looks amazing!" }
                }
            },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        content: { type: "string" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:id/comments/:commentId", {
        schema: {
            tags: ["Comments"],
            summary: "Update your comment",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id", "commentId"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" },
                    commentId: { type: "string", format: "uuid", description: "Comment ID" }
                }
            },
            body: {
                type: "object",
                required: ["content"],
                properties: {
                    content: { type: "string", minLength: 1, maxLength: 2000 }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        content: { type: "string" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments/${commentId}`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id/comments/:commentId", {
        schema: {
            tags: ["Comments"],
            summary: "Delete your comment",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id", "commentId"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" },
                    commentId: { type: "string", format: "uuid", description: "Comment ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: { message: { type: "string" } }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments/${commentId}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:id/comments/:commentId/replies", {
        schema: {
            tags: ["Comments"],
            summary: "Reply to a comment",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id", "commentId"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" },
                    commentId: { type: "string", format: "uuid", description: "Parent Comment ID" }
                }
            },
            body: {
                type: "object",
                required: ["content"],
                properties: {
                    content: { type: "string", minLength: 1, maxLength: 2000 }
                }
            },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        content: { type: "string" },
                        parentId: { type: "string", format: "uuid" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id, commentId } = request.params as { id: string; commentId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/comments/${commentId}/replies`, RECIPE_SERVICE_URL);
    });

    // Favorites
    app.post("/recipes/:id/favorite", {
        schema: {
            tags: ["Recipes"],
            summary: "Add to favorites",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Add a recipe to your personal favorites list.",
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        userId: { type: "string", format: "uuid" },
                        recipeId: { type: "string", format: "uuid" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/favorite`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:id/favorite", {
        schema: {
            tags: ["Recipes"],
            summary: "Remove from favorites",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        userId: { type: "string", format: "uuid" },
                        recipeId: { type: "string", format: "uuid" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/favorite`, RECIPE_SERVICE_URL);
    });

    app.get("/me/favorites", {
        schema: {
            tags: ["Recipes"],
            summary: "Get my favorite recipes",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            querystring: {
                type: "object",
                properties: {
                    page: { type: "integer", default: 1 },
                    limit: { type: "integer", default: 10 }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        recipes: {
                            type: "array",
                            items: recipeSummarySchema
                        },
                        pagination: paginationSchema
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/me/favorites", RECIPE_SERVICE_URL);
    });

    // Images
    app.get("/recipes/:recipeId/images", {
        schema: {
            tags: ["Images"],
            summary: "Get recipe images",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["recipeId"],
                properties: {
                    recipeId: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            response: {
                200: createResponseSchema({ type: "array", items: imageSchema }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/upload", {
        validatorCompiler: () => () => true,
        schema: {
            tags: ["Images"],
            summary: "Upload recipe image",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            description: "Upload a single image file for a recipe.",
            consumes: ['multipart/form-data'],
            params: {
                type: "object",
                required: ["recipeId"],
                properties: {
                    recipeId: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            body: {
                type: 'object',
                required: ['file'],
                properties: { file: { type: 'string', format: 'binary', description: "Image file to upload" } }
            },
            response: {
                201: createResponseSchema(imageSchema),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        const { proxyMultipart } = await import("../utils/proxy");
        return proxyMultipart(request, reply, `/api/v1/recipes/${recipeId}/images/upload`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/url", {
        schema: {
            tags: ["Images"],
            summary: "Add image by URL",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["recipeId"],
                properties: {
                    recipeId: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            body: {
                type: "object",
                required: ["imageUrl"],
                properties: {
                    imageUrl: { type: "string", format: "uri", example: "https://example.com/image.jpg" },
                    altText: { type: "string", example: "Delicious cake" }
                }
            },
            response: {
                201: createResponseSchema(imageSchema),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/url`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:recipeId/images/bulk", {
        schema: {
            tags: ["Images"],
            summary: "Bulk delete images",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["recipeId"],
                properties: {
                    recipeId: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            body: {
                type: "object",
                required: ["imageIds"],
                properties: { imageIds: { type: "array", items: { type: "string", format: "uuid" } } }
            },
            response: {
                200: createResponseSchema({ type: "object", properties: { message: { type: "string" } } }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/bulk`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:recipeId/images/:imageId", {
        schema: {
            tags: ["Images"],
            summary: "Update image metadata",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["recipeId", "imageId"],
                properties: {
                    recipeId: { type: "string", format: "uuid", description: "Recipe ID" },
                    imageId: { type: "string", format: "uuid", description: "Image ID" }
                }
            },
            body: {
                type: "object",
                properties: {
                    altText: { type: "string" },
                    isPrimary: { type: "boolean" },
                    sortOrder: { type: "integer" }
                }
            },
            response: {
                200: createResponseSchema(imageSchema),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { recipeId, imageId } = request.params as { recipeId: string; imageId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/${imageId}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/:imageId/primary", {
        schema: {
            tags: ["Images"],
            summary: "Set as primary image",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["recipeId", "imageId"],
                properties: {
                    recipeId: { type: "string", format: "uuid", description: "Recipe ID" },
                    imageId: { type: "string", format: "uuid", description: "Image ID" }
                }
            },
            response: {
                200: createResponseSchema(imageSchema),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { recipeId, imageId } = request.params as { recipeId: string; imageId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/${imageId}/primary`, RECIPE_SERVICE_URL);
    });

    app.delete("/recipes/:recipeId/images/:imageId", {
        schema: {
            tags: ["Images"],
            summary: "Delete recipe image",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["recipeId", "imageId"],
                properties: {
                    recipeId: { type: "string", format: "uuid", description: "Recipe ID" },
                    imageId: { type: "string", format: "uuid", description: "Image ID" }
                }
            },
            response: {
                200: createResponseSchema({ type: "object", properties: { message: { type: "string" } } }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { recipeId, imageId } = request.params as { recipeId: string; imageId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/${imageId}`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/urls", {
        schema: {
            tags: ["Images"],
            summary: "Add multiple images by URLs",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["recipeId"],
                properties: {
                    recipeId: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            body: {
                type: "object",
                required: ["images"],
                properties: {
                    images: {
                        type: "array",
                        items: {
                            type: "object",
                            required: ["imageUrl"],
                            properties: { imageUrl: { type: "string" }, altText: { type: "string" } }
                        }
                    }
                }
            },
            response: {
                201: createResponseSchema({ type: "array", items: imageSchema }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/urls`, RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:recipeId/images/uploads", {
        validatorCompiler: () => () => true,
        schema: {
            tags: ["Images"],
            summary: "Upload multiple images",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            consumes: ['multipart/form-data'],
            params: {
                type: "object",
                required: ["recipeId"],
                properties: {
                    recipeId: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            body: {
                type: "object",
                required: ["files"],
                properties: { files: { type: "array", items: { type: "string", format: "binary" } } }
            },
            response: {
                201: createResponseSchema({ type: "array", items: imageSchema }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        const { proxyMultipart } = await import("../utils/proxy");
        return proxyMultipart(request, reply, `/api/v1/recipes/${recipeId}/images/uploads`, RECIPE_SERVICE_URL);
    });

    app.put("/recipes/:recipeId/images/reorder", {
        schema: {
            tags: ["Images"],
            summary: "Reorder recipe images",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["recipeId"],
                properties: {
                    recipeId: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            body: {
                type: "object",
                required: ["imageIds"],
                properties: { imageIds: { type: "array", items: { type: "string", format: "uuid" }, description: "Array of image IDs in desired order" } }
            },
            response: {
                200: createResponseSchema({ type: "array", items: imageSchema }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${recipeId}/images/reorder`, RECIPE_SERVICE_URL);
    });

    // Dietary Tags
    app.post("/dietary-tags", {
        schema: {
            hide: true,
            tags: ["Dietary Tags"],
            summary: "Create dietary tag",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            body: {
                type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string", example: "Vegan" },
                    description: { type: "string", example: "No animal products" },
                    iconName: { type: "string", example: "leaf" }
                }
            },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        slug: { type: "string" },
                        iconName: { type: "string", nullable: true }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/dietary-tags", RECIPE_SERVICE_URL);
    });

    app.get("/dietary-tags", {
        schema: {
            tags: ["Dietary Tags"],
            summary: "Get all dietary tags",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            name: { type: "string" },
                            slug: { type: "string" },
                            iconName: { type: "string", nullable: true }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/dietary-tags", RECIPE_SERVICE_URL);
    });

    app.get("/dietary-tags/:id", {
        schema: {
            tags: ["Dietary Tags"],
            summary: "Get dietary tag by ID",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Dietary Tag ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        slug: { type: "string" },
                        iconName: { type: "string", nullable: true }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/dietary-tags/${id}`, RECIPE_SERVICE_URL);
    });

    app.put("/dietary-tags/:id", {
        schema: {
            hide: true,
            tags: ["Dietary Tags"],
            summary: "Update dietary tag",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Dietary Tag ID" }
                }
            },
            body: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    iconName: { type: "string" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        slug: { type: "string" },
                        iconName: { type: "string", nullable: true }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/dietary-tags/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/dietary-tags/:id", {
        schema: {
            hide: true,
            tags: ["Dietary Tags"],
            summary: "Delete dietary tag",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Dietary Tag ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        slug: { type: "string" },
                        iconName: { type: "string", nullable: true }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/dietary-tags/${id}`, RECIPE_SERVICE_URL);
    });

    // Collections
    app.post("/collections", {
        schema: {
            tags: ["Collections"],
            summary: "Create collection",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            body: {
                type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string", minLength: 1, example: "Summer BBQ" },
                    description: { type: "string", example: "My favorite recipes for summer" },
                    isPublic: { type: "boolean", default: true }
                }
            },
            response: {
                201: createResponseSchema({ type: "object", properties: { id: { type: "string" }, name: { type: "string" }, isPublic: { type: "boolean" } } }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/collections", RECIPE_SERVICE_URL);
    });

    app.get("/collections", {
        schema: {
            tags: ["Collections"],
            summary: "Get all collections",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, recipeCount: { type: "integer" } } }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/collections", RECIPE_SERVICE_URL);
    });

    app.get("/collections/:id", {
        schema: {
            tags: ["Collections"],
            summary: "Get collection details",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Collection ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        description: { type: "string", nullable: true },
                        isPublic: { type: "boolean" },
                        userId: { type: "string", format: "uuid" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        _count: {
                            type: "object",
                            properties: {
                                recipes: { type: "integer" }
                            }
                        },
                        recipes: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    recipe: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string", format: "uuid" },
                                            title: { type: "string" },
                                            slug: { type: "string" },
                                            images: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        url: { type: "string" },
                                                        altText: { type: "string", nullable: true }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/collections/${id}`, RECIPE_SERVICE_URL);
    });

    app.put("/collections/:id", {
        schema: {
            tags: ["Collections"],
            summary: "Update collection",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Collection ID" }
                }
            },
            body: {
                type: "object",
                properties: { name: { type: "string" }, description: { type: "string" }, isPublic: { type: "boolean" } }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        description: { type: "string", nullable: true },
                        isPublic: { type: "boolean" },
                        userId: { type: "string", format: "uuid" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/collections/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/collections/:id", {
        schema: {
            tags: ["Collections"],
            summary: "Delete collection",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Collection ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/collections/${id}`, RECIPE_SERVICE_URL);
    });

    app.post("/collections/:id/recipes", {
        schema: {
            tags: ["Collections"],
            summary: "Add recipe to collection",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Collection ID" }
                }
            },
            body: { type: "object", required: ["recipeId"], properties: { recipeId: { type: "string", format: "uuid" } } },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {
                        collectionId: { type: "string", format: "uuid" },
                        recipeId: { type: "string", format: "uuid" },
                        addedAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/collections/${id}/recipes`, RECIPE_SERVICE_URL);
    });

    app.delete("/collections/:id/recipes/:recipeId", {
        schema: {
            tags: ["Collections"],
            summary: "Remove recipe from collection",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id", "recipeId"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Collection ID" },
                    recipeId: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id, recipeId } = request.params as { id: string; recipeId: string };
        return proxyHydrate(app, request, reply, `/api/v1/collections/${id}/recipes/${recipeId}`, RECIPE_SERVICE_URL);
    });

    // Shopping List
    app.get("/shopping-list", {
        schema: {
            tags: ["Shopping List"],
            summary: "Get my shopping list",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            quantity: { type: "string" },
                            isChecked: { type: "boolean" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/shopping-list", RECIPE_SERVICE_URL);
    });

    app.post("/shopping-list/items", {
        schema: {
            tags: ["Shopping List"],
            summary: "Add item manually to list",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            body: {
                type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string", example: "Milk" },
                    quantity: { type: "string", example: "1L" }
                }
            },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        quantity: { type: "string", nullable: true },
                        isChecked: { type: "boolean" },
                        userId: { type: "string", format: "uuid" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/shopping-list/items", RECIPE_SERVICE_URL);
    });

    app.post("/recipes/:id/shopping-list", {
        schema: {
            tags: ["Shopping List"],
            summary: "Add all recipe ingredients to list",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/shopping-list`, RECIPE_SERVICE_URL);
    });

    app.put("/shopping-list/items/:id", {
        schema: {
            tags: ["Shopping List"],
            summary: "Update shopping list item",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Item ID" }
                }
            },
            body: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    quantity: { type: "string" },
                    isChecked: { type: "boolean" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/shopping-list/items/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/shopping-list/items/:id", {
        schema: {
            tags: ["Shopping List"],
            summary: "Remove item from list",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Item ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/shopping-list/items/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/shopping-list/checked", {
        schema: {
            tags: ["Shopping List"],
            summary: "Remove all checked items",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/shopping-list/checked", RECIPE_SERVICE_URL);
    });

    app.delete("/shopping-list", {
        schema: {
            tags: ["Shopping List"],
            summary: "Clear all items from list",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/shopping-list", RECIPE_SERVICE_URL);
    });

    // Meal Plans
    app.post("/meal-plans", {
        schema: {
            tags: ["Meal Plans"],
            summary: "Plan a meal",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            body: {
                type: "object",
                required: ["recipeId", "date", "mealType"],
                properties: {
                    recipeId: { type: "string", format: "uuid" },
                    date: { type: "string", format: "date", example: "2024-03-20" },
                    mealType: { type: "string", enum: ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] }
                }
            },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        userId: { type: "string", format: "uuid" },
                        recipeId: { type: "string", format: "uuid" },
                        date: { type: "string", format: "date-time" },
                        mealType: { type: "string", enum: ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] },
                        notes: { type: "string", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/meal-plans", RECIPE_SERVICE_URL);
    });

    app.get("/meal-plans", {
        schema: {
            tags: ["Meal Plans"],
            summary: "Get my meal plans",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            querystring: {
                type: "object",
                properties: {
                    startDate: { type: "string", format: "date" },
                    endDate: { type: "string", format: "date" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            userId: { type: "string", format: "uuid" },
                            recipeId: { type: "string", format: "uuid" },
                            date: { type: "string", format: "date-time" },
                            mealType: { type: "string", enum: ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] },
                            notes: { type: "string", nullable: true },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/meal-plans", RECIPE_SERVICE_URL);
    });

    app.get("/meal-plans/:date", {
        schema: {
            tags: ["Meal Plans"],
            summary: "Get meal plans for a specific date",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["date"],
                properties: {
                    date: { type: "string", format: "date", description: "Date (YYYY-MM-DD)" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            userId: { type: "string", format: "uuid" },
                            recipeId: { type: "string", format: "uuid" },
                            date: { type: "string", format: "date-time" },
                            mealType: { type: "string", enum: ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] },
                            notes: { type: "string", nullable: true },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { date } = request.params as { date: string };
        return proxyHydrate(app, request, reply, `/api/v1/meal-plans/${date}`, RECIPE_SERVICE_URL);
    });

    app.put("/meal-plans/:id", {
        schema: {
            tags: ["Meal Plans"],
            summary: "Update meal plan",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Meal Plan ID" }
                }
            },
            body: {
                type: "object",
                properties: {
                    date: { type: "string", format: "date" },
                    mealType: { type: "string", enum: ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        userId: { type: "string", format: "uuid" },
                        recipeId: { type: "string", format: "uuid" },
                        date: { type: "string", format: "date-time" },
                        mealType: { type: "string", enum: ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] },
                        notes: { type: "string", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/meal-plans/${id}`, RECIPE_SERVICE_URL);
    });

    app.delete("/meal-plans/:id", {
        schema: {
            tags: ["Meal Plans"],
            summary: "Delete meal plan",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Meal Plan ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        userId: { type: "string", format: "uuid" },
                        recipeId: { type: "string", format: "uuid" },
                        date: { type: "string", format: "date-time" },
                        mealType: { type: "string", enum: ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] },
                        notes: { type: "string", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/meal-plans/${id}`, RECIPE_SERVICE_URL);
    });


    app.post("/recipes/:id/report", {
        schema: {
            hide: true,
            tags: ["Reports"],
            summary: "Report a recipe",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Recipe ID" }
                }
            },
            body: {
                type: "object",
                required: ["reason"],
                properties: { reason: { type: "string" }, description: { type: "string" } }
            },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        reporterId: { type: "string", format: "uuid" },
                        targetType: { type: "string", enum: ["RECIPE", "COMMENT"] },
                        targetId: { type: "string", format: "uuid" },
                        reason: { type: "string" },
                        description: { type: "string", nullable: true },
                        status: { type: "string", enum: ["PENDING", "REVIEWED", "RESOLVED", "DISMISSED"] },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/recipes/${id}/report`, RECIPE_SERVICE_URL);
    });

    app.post("/comments/:id/report", {
        schema: {
            hide: true,
            tags: ["Reports"],
            summary: "Report a comment",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Comment ID" }
                }
            },
            body: {
                type: "object",
                required: ["reason"],
                properties: { reason: { type: "string" }, description: { type: "string" } }
            },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        reporterId: { type: "string", format: "uuid" },
                        targetType: { type: "string", enum: ["RECIPE", "COMMENT"] },
                        targetId: { type: "string", format: "uuid" },
                        reason: { type: "string" },
                        description: { type: "string", nullable: true },
                        status: { type: "string", enum: ["PENDING", "REVIEWED", "RESOLVED", "DISMISSED"] },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/comments/${id}/report`, RECIPE_SERVICE_URL);
    });

    app.get("/admin/reports", {
        schema: { hide: true, tags: ["Admin"], summary: "Get all reports", security: [{ bearerAuth: [] }] }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/admin/reports", RECIPE_SERVICE_URL);
    });

    app.get("/admin/reports/stats", {
        schema: { hide: true, tags: ["Admin"], summary: "Get reports statistics", security: [{ bearerAuth: [] }] }
    }, async (request, reply) => {
        return proxyHydrate(app, request, reply, "/api/v1/admin/reports/stats", RECIPE_SERVICE_URL);
    });

    app.get("/admin/reports/:id", {
        schema: {
            hide: true, tags: ["Admin"], summary: "Get report by ID", security: [{ bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Report ID" }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/admin/reports/${id}`, RECIPE_SERVICE_URL);
    });

    app.put("/admin/reports/:id", {
        schema: {
            hide: true, tags: ["Admin"], summary: "Update report status", security: [{ bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "Report ID" }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        return proxyHydrate(app, request, reply, `/api/v1/admin/reports/${id}`, RECIPE_SERVICE_URL);
    });
}
