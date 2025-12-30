import { FastifyInstance } from "fastify";
import { createRecipe } from "../services/recipe.service"
import { getAllRecipes } from "../services/recipe.service"
import { getRecipeById } from "../services/recipe.service"
import { updateRecipe } from "../services/recipe.service"
import { deleteRecipe } from "../services/recipe.service"
import { getRecipeBySlug } from "../services/recipe.service"
import { rateRecipe } from "../services/recipe.service"
import { getRecipeRatings } from "../services/recipe.service"
import { removeRecipeRating } from "../services/recipe.service"

// import { getAllRecipesBySearch } from "../config/services.config"

export async function recipesRoutes(app: FastifyInstance) {


    // ========== ROUTES RECETTES ==========

    app.get("/recipes", {
        schema: {
            tags: ["Recipes"],
            summary: "Get all available recipes",
            description: "Get all available recipes",
            response: {
                200: {
                    description: "Success",
                    type: "object",
                    properties: {
                        status: { "type": "string" },
                        message: { "type": "string" },
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { "type": "string" },
                                    title: { "type": "string" },
                                    slug: { "type": "string" },
                                    description: { "type": "string" },
                                    prepTime: { "type": "number" },
                                    cookTime: { "type": "number" },
                                    servings: { "type": "number" },
                                    difficulty: { "type": "string", "enum": ["EASY", "MEDIUM", "HARD"] },
                                    isPublished: { "type": "boolean" },
                                    viewCount: { "type": "number" },
                                    createdAt: { "type": "string", "format": "date-time" },
                                    updatedAt: { "type": "string", "format": "date-time" },
                                    authorId: { "type": "string" },
                                    categoryId: { "type": "string" },
                                    category: { "type": "object", "properties": { "name": { "type": "string" } } },
                                    averageScore: { "type": "number" },
                                    ratingCount: { "type": "number" },
                                }
                            }
                        }
                    }
                },
                403: {
                    description: "Forbidden",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const data = await getAllRecipes();
            if (data.length === 0) {
                return reply.code(200).send({
                    status: "success",
                    message: "No recipes are created yet",
                    data
                });
            }
            return reply.code(200).send({
                status: "success",
                message: "Recipes found successfully",
                data
            });
        } catch (err) {
            app.log.error(err);
            return reply.code(500).send({
                error: "Internal Server Error",
                message: "Failed to find recipes"
            });
        }
    });

    app.post("/recipes", {
        schema: {
            tags: ["Recipes"],
            summary: "Create a new recipe",
            description: "Create a new recipe",
            body: {
                type: "object",
                required: [
                    "title",
                    "description",
                    "authorId",
                    "categoryId",
                    "ingredients",
                    "instructions"
                ]
            },
            response: {
                201: {
                    description: "success",
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        message: { type: "string" },
                        data: {
                            type: "object",
                            properties: {
                                id: { "type": "string" },
                                title: { "type": "string" },
                                slug: { "type": "string" },
                                description: { "type": "string" },
                                prepTime: { "type": "number" },
                                cookTime: { "type": "number" },
                                servings: { "type": "number" },
                                difficulty: { "type": "string", "enum": ["EASY", "MEDIUM", "HARD"] },
                                isPublished: { "type": "boolean" },
                                viewCount: { "type": "number" },
                                createdAt: { "type": "string", "format": "date-time" },
                                updatedAt: { "type": "string", "format": "date-time" },
                                authorId: { "type": "string" },
                                categoryId: { "type": "string" },
                                ingredients: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: { "type": "string" },
                                            quantityText: { "type": "string" },
                                            isOptional: { "type": "boolean" }
                                        }
                                    }
                                },
                                instructions: { "type": "array", "items": { "type": "object", "properties": { "stepNumber": { "type": "number" }, "description": { "type": "string" } } } },
                                category: { "type": "object", "properties": { "name": { "type": "string" }, "sortOrder": { "type": "string" } } }
                            }
                        }
                    }
                },
                400: {
                    description: "Bad Request",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                403: {
                    description: "Forbidden",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const body = request.body as {
            title: string;
            description: string;
            prepTime: number;
            cookTime: number;
            servings: number;
            difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
            isPublished?: boolean;
            authorId: string;
            categoryId: string;
            ingredients: { name: string; quantityText: string; isOptional?: boolean }[];
            instructions: { stepNumber: number; description: string }[];
        };
        if (!body.title || body.title.trim() === "" ||
            !body.description ||
            !body.authorId ||
            !body.categoryId ||
            !body.ingredients || body.ingredients.length === 0 ||
            !body.instructions || body.instructions.length === 0) {
            return reply.code(400).send({
                status: "error",
                message: "Title, description, authorId, categoryId, ingredients (not empty) and instructions (not empty) are required"
            });
        }

        try {
            const data = await createRecipe(body);
            return reply.code(201).send({
                status: "success",
                message: "Recipe created successfully",
                data
            });
        } catch (err) {
            app.log.error(err);
            return reply.code(500).send({
                error: "Internal Server Error",
                message: "Failed to create recipe"
            });
        }
    });

    app.get("/recipes/:id", {
        schema: {
            tags: ["Recipes"],
            summary: "Get a recipe by id",
            description: "Get a recipe by id",
            response: {
                200: {
                    description: "Success",
                    type: "object",
                    properties: {
                        status: { "type": "string" },
                        message: { "type": "string" },
                        data: {
                            type: "object",
                            properties: {
                                id: { "type": "string" },
                                title: { "type": "string" },
                                slug: { "type": "string" },
                                description: { "type": "string" },
                                prepTime: { "type": "number" },
                                cookTime: { "type": "number" },
                                servings: { "type": "number" },
                                difficulty: { "type": "string", "enum": ["EASY", "MEDIUM", "HARD"] },
                                isPublished: { "type": "boolean" },
                                viewCount: { "type": "number" },
                                createdAt: { "type": "string", "format": "date-time" },
                                updatedAt: { "type": "string", "format": "date-time" },
                                authorId: { "type": "string" },
                                categoryId: { "type": "string" },
                                ingredients: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: { "type": "string" },
                                            name: { "type": "string" },
                                            quantityText: { "type": "string" },
                                            isOptional: { "type": "boolean" }
                                        }
                                    }
                                },
                                instructions: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: { "type": "string" },
                                            stepNumber: { "type": "number" },
                                            description: { "type": "string" }
                                        }
                                    }
                                },
                                category: { "type": "object", "properties": { "name": { "type": "string" }, "sortOrder": { "type": "number" } } },
                                averageScore: { "type": "number" },
                                ratingCount: { "type": "number" },
                            }
                        }
                    }
                },
                403: {
                    description: "Forbidden",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                404: {
                    description: "Recipe Not Found",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const data = await getRecipeById(id);
            if (!data) {
                return reply.code(404).send({
                    status: "error",
                    message: "Recipe not found"
                });
            }
            return reply.code(200).send({
                status: "success",
                message: "Recipe found successfully",
                data
            });
        } catch (err) {
            app.log.error(err);
            return reply.code(500).send({
                error: "Internal Server Error",
                message: "Failed to find recipe"
            });
        }
    });

    app.put("/recipes/:id", {
        schema: {
            tags: ["Recipes"],
            summary: "Update a recipe",
            description: "Update an existing recipe",
            body: {
                type: "object",
                minProperties: 1,
                properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    prepTime: { type: "number" },
                    cookTime: { type: "number" },
                    servings: { type: "number" },
                    difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"] },
                    isPublished: { type: "boolean" },
                    categoryId: { type: "string" },
                    ingredients: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
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
                            properties: {
                                id: { type: "string" },
                                stepNumber: { type: "number" },
                                description: { type: "string" }
                            }
                        }
                    }
                }
            },
            response: {
                200: {
                    description: "success",
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        message: { type: "string" },
                        data: {
                            type: "object",
                            properties: {
                                id: { "type": "string" },
                                title: { "type": "string" },
                                description: { "type": "string" },
                                prepTime: { "type": "number" },
                                cookTime: { "type": "number" },
                                servings: { "type": "number" },
                                difficulty: { "type": "string", "enum": ["EASY", "MEDIUM", "HARD"] },
                                isPublished: { "type": "boolean" },
                                categoryId: { "type": "string" },
                                ingredients: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: { "type": "string" },
                                            quantityText: { "type": "string" },
                                            isOptional: { "type": "boolean" }
                                        }
                                    }
                                },
                                instructions: { "type": "array", "items": { "type": "object", "properties": { "stepNumber": { "type": "number" }, "description": { "type": "string" } } } },
                            }
                        }
                    }
                },
                400: {
                    description: "Bad Request",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                403: {
                    description: "Forbidden",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                404: {
                    description: "Recipe Not found",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                }
            }
        }
    },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const body = request.body as {
                title?: string,
                description?: string,
                prepTime?: number,
                cookTime?: number,
                servings?: number,
                difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
                isPublished?: boolean;
                categoryId?: string;
                ingredients?: { id?: string; name: string; quantityText: string; isOptional?: boolean }[];
                instructions?: { stepNumber: number; description: string }[];
            };

            if (!body || Object.keys(body).length === 0) {
                return reply.code(400).send({
                    status: "error",
                    message: "No data provided"
                });
            }

            try {
                const data = await updateRecipe(id, body);
                if (!data) {
                    return reply.code(404).send({
                        status: "error",
                        message: "Recipe not found"
                    });
                }
                return reply.code(200).send({
                    status: "success",
                    message: "Recipe updated successfully",
                    data
                });
            } catch (err) {
                app.log.error(err);
                return reply.code(500).send({
                    error: "Internal Server Error",
                    message: "Failed to update recipe"
                });
            }

        });

    app.delete("/recipes/:id", {
        schema: {
            tags: ["Recipes"],
            summary: "Delete a recipe by its ID",
            description: "Remove a recipe by its ID",
            response: {
                200: {
                    description: "Success",
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        message: { type: "string" },
                    }
                },
                403: {
                    description: "Forbidden",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                404: {
                    description: "Recipe Not Found",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const data = await deleteRecipe(id);
            if (!data) {
                return reply.code(404).send({
                    error: "Not Found",
                    message: "Recipe not found"
                })
            }
            return reply.code(200).send({
                status: "success",
                message: "Recipe deleted successfully",
                data
            });
        } catch (err) {
            app.log.error(err);
            return reply.code(500).send({
                error: "Internal Server Error",
                message: "Failed to find recipe"
            });
        }
    });

    app.get("/recipes/by-slug/:slug", {
        schema: {
            tags: ["Recipes"],
            summary: "Get a recipe by slug",
            description: "Get a recipe by slug",
            response: {
                200: {
                    description: "Success",
                    type: "object",
                    properties: {
                        status: { "type": "string" },
                        message: { "type": "string" },
                        data: {
                            type: "object",
                            properties: {
                                id: { "type": "string" },
                                title: { "type": "string" },
                                slug: { "type": "string" },
                                description: { "type": "string" },
                                prepTime: { "type": "number" },
                                cookTime: { "type": "number" },
                                servings: { "type": "number" },
                                difficulty: { "type": "string", "enum": ["EASY", "MEDIUM", "HARD"] },
                                isPublished: { "type": "boolean" },
                                viewCount: { "type": "number" },
                                createdAt: { "type": "string", "format": "date-time" },
                                updatedAt: { "type": "string", "format": "date-time" },
                                authorId: { "type": "string" },
                                categoryId: { "type": "string" },
                                ingredients: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: { "type": "string" },
                                            quantityText: { "type": "string" },
                                            isOptional: { "type": "boolean" }
                                        }
                                    }
                                },
                                instructions: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            stepNumber: { "type": "number" },
                                            description: { "type": "string" }
                                        }
                                    }
                                },
                                category: { "type": "object", "properties": { "name": { "type": "string" }, "sortOrder": { "type": "number" } } },
                                averageScore: { "type": "number" },
                                ratingCount: { "type": "number" },
                            }
                        }
                    }
                },
                403: {
                    description: "Forbidden",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                404: {
                    description: "Not Found",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                }
            }
        }
    },
        async (request, reply) => {
            const { slug } = request.params as { slug: string };
            try {
                const data = await getRecipeBySlug(slug);
                if (!data) {
                    return reply.code(404).send({
                        status: "error",
                        message: "Recipe not found"
                    });
                }
                return reply.code(200).send({
                    status: "success",
                    message: "Recipe found successfully",
                    data
                });
            } catch (err) {
                app.log.error(err);
                return reply.code(500).send({
                    error: "Internal Server Error",
                    message: "Failed to find recipe"
                });
            }
        });

    app.post("/recipes/:id/rate", {
        schema: {
            tags: ["Recipes"],
            summary: "Rate a recipe by its ID",
            description: "Rate a recipe by its ID",
            body: {
                type: "object",
                required: [
                    "userId",
                    "score"
                ],
                properties: {
                    userId: { type: "string" },
                    score: { type: "number" }
                }
            },
            response: {
                200: {
                    description: "Success",
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        message: { type: "string" },
                        data: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                score: { type: "number" }
                            }
                        }
                    }
                },
                400: {
                    description: "Bad Request",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                403: {
                    description: "Forbidden",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                404: {
                    description: "Recipe Not found",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as { userId: string, score: number };
        if (!body.userId) {
            return reply.code(400).send({
                status: "Bad Request",
                message: "userId is required"
            });
        }
        if (body.score < 1 || body.score > 5) {
            return reply.code(400).send({
                status: "Bad Request",
                message: "score must be between 1 and 5"
            });
        }
        try {
            const data = await rateRecipe(id, body.userId, body.score);
            return reply.code(200).send({
                status: "success",
                message: "Recipe rated successfully",
                data
            });
        } catch (err: any) {
            if (err.message === "RECIPE_NOT_FOUND") {
                return reply.code(404).send({
                    error: "Not Found",
                    message: "Recipe not found"
                });
            }
            if (err.message === "RECIPE_NOT_PUBLISHED") {
                return reply.code(403).send({
                    error: "Forbidden",
                    message: "Cannot rate an unpublished recipe"
                });
            }
            if (err.message === "AUTHOR_CANNOT_RATE_OWN_RECIPE") {
                return reply.code(403).send({
                    error: "Forbidden",
                    message: "Authors cannot rate their own recipes"
                });
            }
            app.log.error(err);
            return reply.code(500).send({
                error: "Internal Server Error",
                message: "Failed to rate recipe"
            });
        }
    });

    app.get("/recipes/:id/rate", {
        schema: {
            tags: ["Recipes"],
            summary: "Get an average rating of a recipe",
            description: "Get an average rating of a recipe",
            response: {
                200: {
                    description: "success",
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        message: { type: "string" },
                        data: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                averageScore: { type: "number" },
                                totalRaters: { type: "number" }
                            }
                        }
                    }
                },
                403: {
                    description: "Forbidden",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const data = await getRecipeRatings(id);
            if (data.totalRaters === 0) {
                return reply.code(200).send({
                    status: "success",
                    message: "There is no recipe ratings yet",
                    data: {
                        id: data.id,
                        averageScore: 0,
                        totalRaters: 0,
                    }
                });
            }
            return reply.code(200).send({
                status: "success",
                message: "Recipe ratings found successfully",
                data
            })
        } catch (err) {
            app.log.error(err);
            return reply.code(500).send({
                error: "Internal Server Error",
                message: "Failed to find recipe ratings"
            })
        }
    });

    app.delete("/recipes/:id/rate", {
        schema: {
            tags: ["Recipes"],
            summary: "Delete a recipe rate by its ID",
            description: "Delete a recipe rate by its ID",
            body: {
                type: "object",
                required: ["userId"],
                properties: {
                    userId: { type: "string" },
                },
            },
            response: {
                200: {
                    description: "success",
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        message: { type: "string" },
                        data: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                averageScore: { type: "number" },
                                totalRaters: { type: "number" }
                            }
                        }
                    }
                },
                400: {
                    description: "Bad Request",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                403: {
                    description: "Forbidden",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                },
                404: {
                    description: "Not Found",
                    type: "object",
                    properties: {
                        error: { "type": "string" },
                        message: { "type": "string" }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as { userId: string };
        if (!body.userId) {
            return reply.code(400).send({
                status: "Bad Request",
                message: "userId is required"
            });
        }
        try {
            const data = await removeRecipeRating(id, body.userId);
            return reply.code(200).send({
                status: "success",
                message: "Recipe rating removed successfully",
                data
            })
        } catch (err) {
            app.log.error(err);
            return reply.code(404).send({
                status: "error",
                message: "Recipe rating not found"
            })
        }
    });
}
