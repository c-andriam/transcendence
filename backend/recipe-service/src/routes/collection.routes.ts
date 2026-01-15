import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
    createCollection,
    getUserCollections,
    getCollectionById,
    updateCollection,
    deleteCollection,
    addRecipeToCollection,
    removeRecipeFromCollection
} from "../services/collection.service";
import {
    sendSuccess,
    sendCreated,
    sendDeleted,
    authMiddleware,
    bodyValidator,
    paramValidator,
    NotFoundError,
    ForbiddenError,
    ConflictError
} from "@transcendence/common";

const createCollectionSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    isPublic: z.boolean().optional()
});

const updateCollectionSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    isPublic: z.boolean().optional()
});

const addRecipeSchema = z.object({
    recipeId: z.string().uuid()
});

export async function collectionRoutes(app: FastifyInstance) {
    app.post("/collections", {
        preHandler: [authMiddleware, bodyValidator(createCollectionSchema)]
    }, async (request, reply) => {
        const body = request.body as z.infer<typeof createCollectionSchema>;
        const collection = await createCollection({
            ...body,
            userId: request.user!.id
        });
        sendCreated(reply, collection, "Collection created successfully");
    });

    app.get("/collections", {
        preHandler: [authMiddleware]
    }, async (request, reply) => {
        const collections = await getUserCollections(request.user!.id);
        sendSuccess(reply, collections, "Collections retrieved successfully");
    });

    app.get("/collections/:id", {
        preHandler: [authMiddleware]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const collection = await getCollectionById(id);

        if (!collection) {
            throw new NotFoundError("Collection not found");
        }

        if (collection.userId !== request.user!.id && !collection.isPublic) {
            throw new ForbiddenError("You do not have permission to view this collection");
        }

        sendSuccess(reply, collection, "Collection retrieved successfully");
    });

    app.put("/collections/:id", {
        preHandler: [authMiddleware, bodyValidator(updateCollectionSchema)]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as z.infer<typeof updateCollectionSchema>;

        const existing = await getCollectionById(id);
        if (!existing) throw new NotFoundError("Collection not found");
        if (existing.userId !== request.user!.id) throw new ForbiddenError("Not authorized");

        const updated = await updateCollection(id, body);
        sendSuccess(reply, updated, "Collection updated successfully");
    });

    app.delete("/collections/:id", {
        preHandler: [authMiddleware]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };

        const existing = await getCollectionById(id);
        if (!existing) throw new NotFoundError("Collection not found");
        if (existing.userId !== request.user!.id) throw new ForbiddenError("Not authorized");

        await deleteCollection(id);
        sendDeleted(reply, null, "Collection deleted successfully");
    });

    app.post("/collections/:id/recipes", {
        preHandler: [authMiddleware, bodyValidator(addRecipeSchema)]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const { recipeId } = request.body as { recipeId: string };

        const existing = await getCollectionById(id);
        if (!existing) throw new NotFoundError("Collection not found");
        if (existing.userId !== request.user!.id) throw new ForbiddenError("Not authorized");

        try {
            const result = await addRecipeToCollection(id, recipeId);
            sendCreated(reply, result, "Recipe added to collection");
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictError("Recipe already in collection");
            }
            throw error;
        }
    });

    app.delete("/collections/:id/recipes/:recipeId", {
        preHandler: [authMiddleware]
    }, async (request, reply) => {
        const { id, recipeId } = request.params as { id: string; recipeId: string };

        const existing = await getCollectionById(id);
        if (!existing) throw new NotFoundError("Collection not found");
        if (existing.userId !== request.user!.id) throw new ForbiddenError("Not authorized");

        await removeRecipeFromCollection(id, recipeId);
        sendDeleted(reply, null, "Recipe removed from collection");
    });
}
