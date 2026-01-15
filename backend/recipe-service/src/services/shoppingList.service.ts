import db from "../utils/db";

export async function addToShoppingList(userId: string, data: { name: string; quantity?: string }) {
    return db.shoppingListItem.create({
        data: {
            userId,
            name: data.name,
            quantity: data.quantity
        }
    });
}

export async function addRecipeToShoppingList(userId: string, recipeId: string) {
    const recipe = await db.recipe.findUnique({
        where: { id: recipeId },
        include: { ingredients: true }
    });

    if (!recipe) {
        throw new Error("Recipe not found");
    }

    const items = recipe.ingredients.map(ing => ({
        userId,
        name: ing.name,
        quantity: ing.quantityText,
        recipeId: recipe.id,
        recipeTitle: recipe.title
    }));

    return db.shoppingListItem.createMany({
        data: items
    });
}

export async function getShoppingList(userId: string) {
    return db.shoppingListItem.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
}

export async function updateShoppingListItem(id: string, userId: string, data: { isChecked?: boolean; name?: string; quantity?: string }) {
    return db.shoppingListItem.updateMany({
        where: { id, userId },
        data
    });
}

export async function deleteShoppingListItem(id: string, userId: string) {
    return db.shoppingListItem.deleteMany({
        where: { id, userId }
    });
}

export async function clearCheckedItems(userId: string) {
    return db.shoppingListItem.deleteMany({
        where: { userId, isChecked: true }
    });
}

export async function clearAllItems(userId: string) {
    return db.shoppingListItem.deleteMany({
        where: { userId }
    });
}
