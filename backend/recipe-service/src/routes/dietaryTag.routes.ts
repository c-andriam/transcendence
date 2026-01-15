import { FastifyInstance } from "fastify";
import { createDietaryTag, deleteDietaryTag, getAllDietaryTags, getDietaryTagById, updateDietaryTag } from "../services/dietaryTag.service";
import {
    sendCreated,
    sendSuccess,
    sendDeleted,
    authMiddleware,
    adminMiddleware,
    bodyValidator,
    NotFoundError,
    ConflictError
} from "@transcendence/common";
import { z } from "zod";

const createDietaryTagSchema = z.object({
    name: z.string().min(1).max(50),
    iconName: z.string().optional()
});

const updateDietaryTagSchema = z.object({
    name: z.string().min(1).max(50).optional(),
    iconName: z.string().optional()
});

export async function dietaryTagRoutes(app: FastifyInstance) {

    app.post("/dietary-tags", {
        preHandler: [authMiddleware, adminMiddleware, bodyValidator(createDietaryTagSchema)]
    }, async (request, reply) => {
        const body = request.body as z.infer<typeof createDietaryTagSchema>;
        try {
            const tag = await createDietaryTag(body);
            return sendCreated(reply, tag, "Dietary tag created successfully");
        } catch (error) {
            if ((error as any).code === "P2002") {
                throw new ConflictError("Dietary tag name already exists");
            }
            throw error;
        }
    });

    app.get("/dietary-tags", async (request, reply) => {
        const tags = await getAllDietaryTags();
        return sendSuccess(reply, tags, "Dietary tags retrieved successfully");
    });

    app.get("/dietary-tags/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const tag = await getDietaryTagById(id);
        if (!tag) {
            throw new NotFoundError("Dietary tag not found");
        }
        return sendSuccess(reply, tag, "Dietary tag retrieved successfully");
    });

    app.put("/dietary-tags/:id", {
        preHandler: [authMiddleware, adminMiddleware, bodyValidator(updateDietaryTagSchema)]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as z.infer<typeof updateDietaryTagSchema>;
        try {
            const tag = await updateDietaryTag(id, body);
            return sendSuccess(reply, tag, "Dietary tag updated successfully");
        } catch (error) {
            if ((error as any).code === "P2025") {
                throw new NotFoundError("Dietary tag not found");
            }
            if ((error as any).code === "P2002") {
                throw new ConflictError("Dietary tag name already exists");
            }
            throw error;
        }
    });

    app.delete("/dietary-tags/:id", {
        preHandler: [authMiddleware, adminMiddleware]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const tag = await deleteDietaryTag(id);
            if (!tag) {
                throw new NotFoundError("Dietary tag not found");
            }
            return sendDeleted(reply, tag, "Dietary tag deleted successfully");
        } catch (error) {
            if ((error as any).code === "P2025") {
                throw new NotFoundError("Dietary tag not found");
            }
            throw error;
        }
    });
}
