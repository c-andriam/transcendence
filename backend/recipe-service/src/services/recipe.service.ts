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
    const recipes = await db.recipe.findMany({
        where: where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
            ingredients: true,
            instructions: { orderBy: { stepNumber: 'asc' } },
            category: true,
        },
        orderBy: {
            createdAt: 'desc'
        },
    });
    return recipes;
}

export async function addToFavorites(
    userId: string,
    recipeId: string
) {
    const recipe = await db.recipe.findUnique({
        where: { id: recipeId }
    });
    if (!recipe) {
        throw new NotFoundError("Recipe not found");
    }
    const isFavorite = await db.favorite.findUnique({
        where: {
            userId_recipeId: {
                userId,
                recipeId
            }
        }
    });
    if (isFavorite) {
        throw new Error("Recipe already in favorites");
    }
    const favorite = await db.favorite.create({
            data: {
                userId,
                recipeId
            }
        });
    return favorite;
}

export async function removeFromFavorites(
    userId: string,
    recipeId: string
) {
    const favorite = await db.favorite.findUnique({
        where: {
            userId_recipeId: {
                userId,
                recipeId
            }
        }
    });
    if (!favorite) {
        throw new NotFoundError("Favorite recipe not found");
    }
    await db.favorite.delete({
        where: {
            userId_recipeId: {
                userId,
                recipeId
            }
        }
    });
    return favorite;
}

export async function getUserFavorites(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
) {
    const skip = (page - 1) * limit;
    const validSortBy = ['createdAt', 'title', 'prepTime', 'cookTime', 'viewCount'] as const;
    const sortByValidated = sortBy && validSortBy.includes(sortBy as any) ? sortBy as typeof validSortBy[number] : 'createdAt';
    const validSortOrder = ['asc', 'desc'] as const;
    const sortOrderValidated = sortOrder && validSortOrder.includes(sortOrder as any) ? sortOrder as typeof validSortOrder[number] : 'desc';
    const orderBy: any = sortByValidated === 'createdAt' ? { createdAt: sortOrderValidated } : { recipe: { [sortByValidated]: sortOrderValidated } };
    const [favorites, total] = await Promise.all([
        db.favorite.findMany({
            where: {
                userId
            },
            include: {
                recipe: {
                    include: {
                        category: true,
                        ratings: true,
                        ingredients: true,
                        instructions: true
                    }
                }
            },
            orderBy,
            skip,
            take: limit
        }),
        db.favorite.count({
            where: { userId }
        })
    ]);

    const recipes = favorites.map(fav => {
        const recipe = fav.recipe;
        const ratingCount = recipe.ratings.length;
        const totalScore = recipe.ratings.reduce((total, rating) => total + rating.score, 0);
        const averageScore = ratingCount > 0 ? Math.round((totalScore / ratingCount) * 10) / 10 : 0;
        return {
            ...recipe,
            averageScore,
            ratingCount,
            favoritedAt: fav.createdAt
        };
    });

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
        recipes,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext,
            hasPrev
        }
    };
}