import { FastifyInstance } from "fastify";
import db from "../utils/db";

export function slugify(text: string): string {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/^-+|-+$/g, '');
}

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
            // Remplacement complet des ingrédients si fournis
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
            // Remplacement complet des instructions si fournies
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
        throw new Error("RECIPE_NOT_FOUND");
    }

    if (!recipe.isPublished) {
        throw new Error("RECIPE_NOT_PUBLISHED");
    }

    if (recipe.authorId === userId) {
        throw new Error("AUTHOR_CANNOT_RATE_OWN_RECIPE");
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
    // await app.db.rating.delete({
    //     where: { id: rating.id }
    // });

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