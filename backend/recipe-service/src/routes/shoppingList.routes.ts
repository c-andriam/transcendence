import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
    addToShoppingList,
    addRecipeToShoppingList,
    getShoppingList,
    updateShoppingListItem,
    deleteShoppingListItem,
    clearCheckedItems,
    clearAllItems
} from "../services/shoppingList.service";
import {
    sendSuccess,
    sendCreated,
    sendDeleted,
    authMiddleware,
    bodyValidator,
    NotFoundError
} from "@transcendence/common";

const addItemSchema = z.object({
    name: z.string().min(1).max(100),
    quantity: z.string().max(50).optional()
});

const updateItemSchema = z.object({
    name: z.string().max(100).optional(),
    quantity: z.string().max(50).optional(),
    isChecked: z.boolean().optional()
});

export async function shoppingListRoutes(app: FastifyInstance) {
    app.post("/shopping-list/items", {
        preHandler: [authMiddleware, bodyValidator(addItemSchema)]
    }, async (request, reply) => {
        const item = await addToShoppingList(request.user!.id, request.body as any);
        sendCreated(reply, item, "Item added to shopping list");
    });

    app.post("/recipes/:id/shopping-list", {
        preHandler: [authMiddleware]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        await addRecipeToShoppingList(request.user!.id, id);
        sendCreated(reply, null, "Recipe ingredients added to shopping list");
    });

    app.get("/shopping-list", {
        preHandler: [authMiddleware]
    }, async (request, reply) => {
        const items = await getShoppingList(request.user!.id);
        sendSuccess(reply, items, "Shopping list retrieved successfully");
    });

    app.put("/shopping-list/items/:id", {
        preHandler: [authMiddleware, bodyValidator(updateItemSchema)]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        await updateShoppingListItem(id, request.user!.id, request.body as any);
        sendSuccess(reply, null, "Shopping list item updated");
    });

    app.delete("/shopping-list/items/:id", {
        preHandler: [authMiddleware]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        await deleteShoppingListItem(id, request.user!.id);
        sendDeleted(reply, null, "Item removed from shopping list");
    });

    app.delete("/shopping-list/checked", {
        preHandler: [authMiddleware]
    }, async (request, reply) => {
        await clearCheckedItems(request.user!.id);
        sendDeleted(reply, null, "Checked items cleared");
    });

    app.delete("/shopping-list", {
        preHandler: [authMiddleware]
    }, async (request, reply) => {
        await clearAllItems(request.user!.id);
        sendDeleted(reply, null, "Shopping list cleared");
    });

    app.post("/internal/shopping-list/items", async (request, reply) => {
        const { userId, name, quantity } = request.body as any;
        const item = await addToShoppingList(userId, { name, quantity });
        sendCreated(reply, item, "Item added to shopping list");
    });

    app.put("/internal/shopping-list/items/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { userId, ...data } = request.body as any;
        const item = await updateShoppingListItem(id, userId, data);
        sendSuccess(reply, item, "Shopping list item updated");
    });

    app.delete("/internal/shopping-list/items/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { userId } = request.body as any;
        await deleteShoppingListItem(id, userId);
        sendDeleted(reply, null, "Item removed from shopping list");
    });
}
