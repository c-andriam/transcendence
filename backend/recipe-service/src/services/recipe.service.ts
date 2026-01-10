import { FastifyInstance } from "fastify";
import db from "../utils/db";
import { slugify, NotFoundError, ForbiddenError } from "@transcendence/common";

export async function createRecipe(
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
    const recipe = await db.recipe.create({
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
            ingredients: {
                select: {
                    name: true,
                    quantityText: true,
                    sortOrder: true,
                    isOptional: true
                }
            },
            instructions: { orderBy: { stepNumber: 'asc' } },
            category: true,
        }
    });
    return recipe;
}

export async function getAllRecipes() {
    const recipes = await db.recipe.findMany({
        where: { isPublished: true },
        include: {
            category: true,
            ratings: true,
        },
        orderBy: {
            createdAt: 'desc'
        },
    });

    return recipes.map(recipe => {
        const ratingCount = recipe.ratings.length;
        const totalScore = recipe.ratings.reduce((total, rating) => total + rating.score, 0);
        const averageScore = ratingCount > 0 ? Math.round((totalScore / ratingCount) * 10) / 10 : 0;

        const { ratings, ...recipeWithoutRatings } = recipe;

        return {
            ...recipeWithoutRatings,
            averageScore,
            ratingCount,
        };
    });
}

export async function getRecipeById(id: string) {
    const recipe = await db.recipe.findUnique({
        where: { id },
        include: {
            ingredients: true,
            instructions: true,
            category: true,
            ratings: true,
            comments: {
                orderBy: {
                    createdAt: 'desc'
                },
            },
        },
    });
    if (!recipe) {
        return null;
    }

    const ratingCount = recipe.ratings.length;
    const totalScore = recipe.ratings.reduce((total, rating) => total + rating.score, 0);
    const averageScore = recipe.ratings.length > 0 ? Math.round((totalScore / recipe.ratings.length) * 10) / 10 : 0;
    return {
        ...recipe,
        averageScore,
        ratingCount,
    };
}

export async function updateRecipe(id: string,
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

    const existing = await db.recipe.findUnique({
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

    const updatedRecipe = await db.recipe.update({
        where: { id },
        data: {
            ...updateData,
            ...(data.ingredients && {
                ingredients: {
                    deleteMany: {},
                    create: data.ingredients.map((ing, index) => ({
                        name: ing.name,
                        quantityText: ing.quantityText,
                        sortOrder: index,
                        isOptional: ing.isOptional ?? false,
                    })),
                },
            }),
            ...(data.instructions && {
                instructions: {
                    deleteMany: {},
                    create: data.instructions.map((ins) => ({
                        stepNumber: ins.stepNumber,
                        description: ins.description,
                    })),
                },
            }),
        },
        include: {
            ingredients: true,
            instructions: { orderBy: { stepNumber: 'asc' } },
            category: true,
        }
    });
    return updatedRecipe;
}

export async function deleteRecipe(id: string) {
    const existing = await db.recipe.findUnique({
        where: { id }
    });
    if (!existing) {
        return null;
    }

    const recipe = await db.recipe.delete({
        where: { id }
    });
    return recipe;
}

export async function getRecipeBySlug(slug: string) {
    const recipe = await db.recipe.findUnique({
        where: { slug },
        include: {
            ingredients: true,
            instructions: { orderBy: { stepNumber: 'asc' } },
            category: true,
            ratings: true,
            comments: {
                orderBy: {
                    createdAt: 'desc'
                },
            },
        },
    });
    if (!recipe) {
        return null;
    }

    const ratingCount = recipe.ratings.length;
    const totalScore = recipe.ratings.reduce((total, rating) => total + rating.score, 0);
    const averageScore = recipe.ratings.length > 0 ? Math.round((totalScore / recipe.ratings.length) * 10) / 10 : 0;
    return {
        ...recipe,
        averageScore,
        ratingCount,
    };
}

export async function rateRecipe(
    recipeId: string,
    userId: string,
    score: number) {

    const recipe = await db.recipe.findUnique({
        where: { id: recipeId },
        select: { isPublished: true, authorId: true }
    });

    if (!recipe) {
        throw new NotFoundError("Recipe not found");
    }

    if (!recipe.isPublished) {
        throw new ForbiddenError("Cannot rate an unpublished recipe");
    }

    if (recipe.authorId === userId) {
        throw new ForbiddenError("Authors cannot rate their own recipes");
    }

    const rating = await db.rating.upsert({
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

export async function getRecipeRatings(recipeId: string) {
    const ratings = await db.rating.findMany({
        where: { recipeId },
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

export async function removeRecipeRating(recipeId: string, userId: string) {
    const rating = await db.rating.delete({
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

    const ratings = await db.rating.findMany({
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
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD',
    search?: string,
    isPublished?: boolean,
    authorId?: string,
    sortBy: 'createdAt' | 'title' | 'prepTime' | 'cookTime' | 'viewCount' = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    minPrepTime?: number,
    maxPrepTime?: number,
    minCookTime?: number,
    maxCookTime?: number,
    servings?: number
) {
    const where: any = {};
    
    if (categoryId) {
        where.categoryId = categoryId;
    }
    if (difficulty) {
        where.difficulty = difficulty;
    }
    if (authorId) {
        where.authorId = authorId;
    }
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { ingredients: { some: { name: { contains: search, mode: 'insensitive' } } } }
        ];
    }
    if (isPublished !== undefined) {
        where.isPublished = isPublished;
    } else {
        where.isPublished = true;
    }
    if (minPrepTime !== undefined) {
        where.prepTime = { ...where.prepTime, gte: minPrepTime };
    }
    if (maxPrepTime !== undefined) {
        where.prepTime = { ...where.prepTime, lte: maxPrepTime };
    }
    if (minCookTime !== undefined) {
        where.cookTime = { ...where.cookTime, gte: minCookTime };
    }
    if (maxCookTime !== undefined) {
        where.cookTime = { ...where.cookTime, lte: maxCookTime };
    }
    if (servings !== undefined) {
        where.servings = servings;
    }

    const [recipes, total] = await Promise.all([
        db.recipe.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                ingredients: true,
                instructions: { orderBy: { stepNumber: 'asc' } },
                category: true,
                ratings: true,
            },
            orderBy: {
                [sortBy]: sortOrder,
            },
        }),
        db.recipe.count({ where })
    ]);

    const recipesWithRatings = recipes.map(recipe => {
        const ratingCount = recipe.ratings.length;
        const totalScore = recipe.ratings.reduce((total, rating) => total + rating.score, 0);
        const averageScore = ratingCount > 0 ? Math.round((totalScore / ratingCount) * 10) / 10 : 0;
        const { ratings, ...recipeWithoutRatings } = recipe;
        
        return {
            ...recipeWithoutRatings,
            averageScore,
            ratingCount,
        };
    });

    return {
        recipes: recipesWithRatings,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
        }
    };
}

export async function getRecipesByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10
) {
    return getAllRecipesBySearch(page, limit, categoryId);
}

export async function getRecipesByAuthor(
    authorId: string,
    page: number = 1,
    limit: number = 10,
    includeUnpublished: boolean = false
) {
    return getAllRecipesBySearch(
        page,
        limit,
        undefined,
        undefined,
        undefined,
        includeUnpublished ? undefined : true,
        authorId
    );
}

export async function getRecipesByDifficulty(
    difficulty: 'EASY' | 'MEDIUM' | 'HARD',
    page: number = 1,
    limit: number = 10
) {
    return getAllRecipesBySearch(
        page,
        limit,
        undefined,
        difficulty
    );
}

export async function getMyRecipes(
    userId: string,
    page: number = 1,
    limit: number = 10,
    publishedOnly: boolean = false
) {
    const where: any = {
        authorId: userId
    };
    if (publishedOnly) {
        where.isPublished = true;
    }
    const [recipes, total] = await Promise.all([
        db.recipe.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                ingredients: true,
                instructions: { orderBy: { stepNumber: 'asc' } },
                category: true,
                ratings: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        db.recipe.count({ where })
    ]);
    const recipesWithRatings = recipes.map(recipe => {
        const ratingCount = recipe.ratings.length;
        const totalScore = recipe.ratings.reduce((total, rating) => total + rating.score, 0);
        const averageScore = ratingCount > 0 ? Math.round((totalScore / ratingCount) * 10) / 10 : 0;
        const { ratings, ...recipeWithoutRatings } = recipe;
        return {
            ...recipeWithoutRatings,
            averageScore,
            ratingCount,
        };
    });
    return {
        recipes: recipesWithRatings,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
        }
    };
}