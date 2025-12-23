import { FastifyInstance } from "fastify";

export function slugify(text: string): string {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function createRecipe(
    app: FastifyInstance,
    data: {
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
    }) {
    const slug = slugify(data.title);
    const recipe = await app.db.recipe.create({
        data: {
            title: data.title,
            slug: slug,
            description: data.description,
            prepTime: data.prepTime,
            cookTime: data.cookTime,
            servings: data.servings,
            difficulty: data.difficulty,
            isPublished: data.isPublished,
            authorId: data.authorId,
            categoryId: data.categoryId,
            ingredients: {
                create: data.ingredients.map((ing, index) => ({
                    name: ing.name,
                    quantityText: ing.quantityText,
                    sortOrder: index,
                    isOptional: ing.isOptional ?? false,
                })),
            },
            instructions: {
                create: data.instructions.map((ins) => ({
                    stepNumber: ins.stepNumber,
                    description: ins.description,
                })),
            },
        },
        include: {
            // ingredients: true,
            ingredients: {
                select: {
                    name: true,
                    quantityText: true,
                    sortOrder: true,
                    isOptional: true
                }
            },
            instructions: { orderBy: { stepNumber: 'asc' } },
            author: {
                select: {
                    // id: true,
                    username: true,
                    avatarUrl: true,
                }
            },
            category: true,
        }
    });
    return recipe;
}

export async function getAllRecipes(app: FastifyInstance) {
    const recipes = await app.db.recipe.findMany({
        include: {
            // ingredients: true,
            // instructions: { orderBy: { stepNumber: 'asc' } },
            author: {
                select: { id: true, username: true, avatarUrl: true },
            },
            category: true,
            ratings: true,
        },
        orderBy: {
            createdAt: 'desc'
        },
    });
    return recipes.map(recipe => {
        const totalScore = recipe.ratings.reduce((total, rating) => total + rating.score, 0);
        const averageScore = recipe.ratings.length > 0 ? Math.round((totalScore / recipe.ratings.length) * 10) / 10 : 0;
        return {
            ...recipe,
            averageScore,
        };
    });
}

export async function getRecipeById(app: FastifyInstance, id: string) {
    const recipe = await app.db.recipe.findUnique({
        where: { id },
        include: {
            ingredients: true,
            instructions: true,
            author: {
                select: { id: true, username: true, avatarUrl: true },
            },
            category: true,
            ratings: true,
            comments: {
                include: {
                    user: { select: { id: true, username: true, avatarUrl: true } },
                },
                orderBy: {
                    createdAt: 'desc'
                },
            },
        },
    });
    if (!recipe) {
        return null;
    }
    // return recipe;
    // return recipe.map(recipe => {
    const totalScore = recipe.ratings.reduce((total, rating) => total + rating.score, 0);
    const averageScore = recipe.ratings.length > 0 ? Math.round((totalScore / recipe.ratings.length) * 10) / 10 : 0;
    return {
        ...recipe,
        averageScore,
    };
    // });
}

export async function updateRecipe(app: FastifyInstance, id: string,
    data: {
        title?: string;
        description?: string;
        prepTime?: number;
        cookTime?: number;
        servings?: number;
        difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
        isPublished?: boolean;
        categoryId?: string;
        ingredients?: { id?: string; name: string; quantityText: string; isOptional?: boolean }[];
        instructions?: { id?: string; stepNumber: number; description: string }[];
    }) {

    const existing = await app.db.recipe.findUnique({
        where: { id },
    });
    if (!existing) {
        return null;
    }

    const updateData: any = {};

    if (data.title && data.title !== existing.title) {
        updateData.title = data.title;
        updateData.slug = slugify(data.title);
    }
    if (data.description && data.description !== existing.description) {
        updateData.description = data.description;
    }
    if (data.prepTime !== undefined && data.prepTime !== existing.prepTime) {
        updateData.prepTime = data.prepTime;
    }
    if (data.cookTime !== undefined && data.cookTime !== existing.cookTime) {
        updateData.cookTime = data.cookTime;
    }
    if (data.servings !== undefined && data.servings !== existing.servings) {
        updateData.servings = data.servings;
    }
    if (data.difficulty && data.difficulty !== existing.difficulty) {
        updateData.difficulty = data.difficulty;
    }
    if (data.isPublished !== undefined && data.isPublished !== existing.isPublished) {
        updateData.isPublished = data.isPublished;
    }
    if (data.categoryId && data.categoryId !== existing.categoryId) {
        updateData.categoryId = data.categoryId;
    }

    const ingredientsUpdate = data.ingredients?.filter(ing => ing.id).map((ing) => ({
        where: { id: ing.id },
        data: {
            name: ing.name,
            quantityText: ing.quantityText,
            isOptional: ing.isOptional ?? false,
        }
    })) || [];

    const ingredientsCreate = data.ingredients?.filter(ing => !ing.id).map((ing) => ({
        name: ing.name,
        quantityText: ing.quantityText,
        isOptional: ing.isOptional ?? false,
        // recipeId: id,
    })) || [];

    const instructionsUpdate = data.instructions?.filter(ins => ins.id).map((ins => ({
        where: { id: ins.id },
        data: {
            stepNumber: ins.stepNumber,
            description: ins.description,
        }
    }))) || [];

    const instructionsCreate = data.instructions?.filter(ins => !ins.id).map((ins => ({
        stepNumber: ins.stepNumber,
        description: ins.description
    }))) || [];

    const updatedRecipe = await app.db.recipe.update({
        where: { id },
        data: {
            ...updateData,
            ingredients: {
                update: ingredientsUpdate,
                create: ingredientsCreate,
            },
            instructions: {
                update: instructionsUpdate,
                create: instructionsCreate,
            },
        },
        include: {
            ingredients: true,
            instructions: { orderBy: { stepNumber: 'asc' } },
            author: { select: { id: true, username: true, avatarUrl: true } },
            category: true,
        }
    });
    return updatedRecipe;
}

export async function deleteRecipe(app: FastifyInstance, id: string) {
    const existing = await app.db.recipe.findUnique({
        where: { id }
    });
    if (!existing) {
        return null;
    }

    const recipe = await app.db.recipe.delete({
        where: { id }
    });
    return recipe;
}

export async function getRecipeBySlug(app: FastifyInstance, slug: string) {
    const recipe = await app.db.recipe.findUnique({
        where: { slug },
        include: {
            ingredients: true,
            instructions: { orderBy: { stepNumber: 'asc' } },
            author: {
                select: { id: true, username: true, avatarUrl: true },
            },
            category: true,
            ratings: true,
            comments: {
                include: {
                    user: { select: { id: true, username: true, avatarUrl: true } },
                },
                orderBy: {
                    createdAt: 'desc'
                },
            },
        },
    });
    if (!recipe) {
        return null;
    }
    const totalScore = recipe.ratings.reduce((total, rating) => total + rating.score, 0);
    const averageScore = recipe.ratings.length > 0 ? Math.round((totalScore / recipe.ratings.length) * 10) / 10 : 0;
    return {
        ...recipe,
        averageScore,
    };
}

export async function rateRecipe(
    app: FastifyInstance,
    recipeId: string,
    userId: string,
    score: number) {
    const rating = await app.db.rating.upsert({
        where: {
            userId_recipeId: {
                recipeId,
                userId
            }
        },
        update: {
            score
        },
        create: {
            recipeId,
            userId,
            score
        }
    });
    return rating;
}

export async function getRecipeRatings(app: FastifyInstance, recipeId: string) {
    const ratings = await app.db.rating.findMany({
        where: { recipeId },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                }
            }
        },
        orderBy: {
            score: 'desc'
        },
    });
    const totalScore = ratings.reduce((total, rating) => total + rating.score, 0);
    const averageScore = ratings.length > 0 ? Math.round((totalScore / ratings.length) * 10) / 10 : 0;
    const totalRaters = ratings.length;
    return {
        id: recipeId,
        averageScore,
        totalRaters
    };
}

export async function removeRecipeRating(app: FastifyInstance, recipeId: string, userId: string) {
    const rating = await app.db.rating.delete({
        where: {
            userId_recipeId: {
                recipeId,
                userId
            },
        }
    });
    if (!rating) {
        throw new Error("Rating not Found");
    }
    // await app.db.rating.delete({
    //     where: { id: rating.id }
    // });

    const ratings = await app.db.rating.findMany({
        where: { recipeId },
    });

    const totalScore = ratings.reduce((total, rating) => total + rating.score, 0);
    const averageScore = ratings.length > 0 ? Math.round((totalScore / ratings.length) * 10) / 10 : 0;
    const totalRaters = ratings.length;
    return {
        id: recipeId,
        averageScore,
        totalRaters
    };
}

export async function getAllRecipesBySearch(
    app: FastifyInstance,
    page: number,
    limit: number,
    categoryId?: string,
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD',
    search?: string,
    isPublished?: boolean) {
    const where: any = {};
    if (categoryId) {
        where.categoryId = categoryId;
    }
    if (difficulty) {
        where.difficulty = difficulty;
    }
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }
    if (isPublished !== undefined) {
        where.isPublished = isPublished;
    }
    else
        where.isPublished = true;
    const recipes = await app.db.recipe.findMany({
        where: where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
            ingredients: true,
            instructions: { orderBy: { stepNumber: 'asc' } },
            author: {
                select: { id: true, username: true, avatarUrl: true },
            },
            category: true,
        },
        orderBy: {
            createdAt: 'desc'
        },
    });
    return recipes;
}

export async function recipesRoutes(app: FastifyInstance) {

    // ========== ROUTES TEMPORAIRES POUR CRÉER DES DONNÉES DE TEST ==========

    // Créer un utilisateur de test
    app.post("/seed/chef", async (request, reply) => {
        try {
            const user = await app.db.user.create({
                data: {
                    email: "chef@example.com",
                    username: "chef_marie",
                    password: "password123",
                    firstName: "Marie",
                    lastName: "Dupont",
                    bio: "Passionnée de cuisine française et indienne",
                }
            });
            return reply.code(201).send({
                status: "success",
                message: "User created! Use this ID for authorId",
                data: { id: user.id, username: user.username }
            });
        } catch (err) {
            return reply.code(500).send({
                error: "Error creating user",
                message: String(err)
            });
        }
    });

    app.post("/seed/user", async (request, reply) => {
        try {
            const user = await app.db.user.create({
                data: {
                    email: "visitor@example.com",
                    username: "visitor",
                    password: "password123",
                    firstName: "Visitor",
                    lastName: "",
                    bio: "",
                }
            });
            return reply.code(201).send({
                status: "success",
                message: "User created! Use this ID for authorId",
                data: { id: user.id, username: user.username }
            });
        } catch (err) {
            return reply.code(500).send({
                error: "Error creating user",
                message: String(err)
            });
        }
    });

    // Créer une catégorie de test
    app.post("/seed/category", async (request, reply) => {
        try {
            const category = await app.db.category.create({
                data: {
                    name: "Plats principaux",
                    slug: "plats-principaux",
                    iconName: "🍽️",
                    sortOrder: 1,
                }
            });
            return reply.code(201).send({
                status: "success",
                message: "Category created! Use this ID for categoryId",
                data: { id: category.id, name: category.name }
            });
        } catch (err) {
            return reply.code(500).send({
                error: "Error creating category",
                message: String(err)
            });
        }
    });

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
                                    author: { "type": "object", "properties": { "id": { "type": "string" }, "username": { "type": "string" }, "avatarUrl": { "type": "string" } } },
                                    category: { "type": "object", "properties": { "name": { "type": "string" } } },
                                    averageScore: { "type": "number" },
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
            const data = await getAllRecipes(app);
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
                                author: { "type": "object", "properties": { "username": { "type": "string" }, "avatarUrl": { "type": "string" } } },
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
            const data = await createRecipe(app, body);
            return reply.code(201).send({
                status: "success",
                message: "Recipe created successfully",
                data
            });
        } catch (err) {
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
                                author: { "type": "object", "properties": { "id": { "type": "string" }, "username": { "type": "string" }, "avatarUrl": { "type": "string" } } },
                                category: { "type": "object", "properties": { "name": { "type": "string" }, "sortOrder": { "type": "number" } } },
                                averageScore: { "type": "number" },
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
            const data = await getRecipeById(app, id);
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
                const data = await updateRecipe(app, id, body);
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
            const data = await deleteRecipe(app, id);
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
                                author: { "type": "object", "properties": { "id": { "type": "string" }, "username": { "type": "string" }, "avatarUrl": { "type": "string" } } },
                                category: { "type": "object", "properties": { "name": { "type": "string" }, "sortOrder": { "type": "number" } } },
                                averageScore: { "type": "number" },
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
                const data = await getRecipeBySlug(app, slug);
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
        const recipe = await getRecipeById(app, id);
        if (!recipe) {
            return reply.code(404).send({
                status: "Not Found",
                message: "Recipe not found"
            });
        }
        try {
            const data = await rateRecipe(app, id, body.userId, body.score);
            return reply.code(200).send({
                status: "success",
                message: "Recipe rated successfully",
                data
            });
        } catch (err) {
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
            const data = await getRecipeRatings(app, id);
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
            const data = await removeRecipeRating(app, id, body.userId);
            return reply.code(200).send({
                status: "success",
                message: "Recipe rating removed successfully",
                data
            })
        } catch (err) {
            return reply.code(404).send({
                status: "error",
                message: "Recipe rating not found"
            })
        }
    });
}
