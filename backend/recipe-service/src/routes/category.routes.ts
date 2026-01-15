import { FastifyInstance } from "fastify";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, getCategoryBySlug, updateCategory } from "../services/category.service";
import {
    sendCreated,
    sendSuccess,
    sendDeleted,
    authMiddleware,
    bodyValidator,
    NotFoundError,
    ConflictError
} from "@transcendence/common";
import { z } from "zod";

const createCategorySchema = z.object({
    name: z.string().min(1).max(100),
    iconName: z.string().optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    sortOrder: z.number().int().min(0).optional()
});

const updateCategorySchema = z.object({
    name: z.string().min(1).max(100).optional(),
    iconName: z.string().optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    sortOrder: z.number().int().min(0).optional()
});

export async function categoryRoutes(app: FastifyInstance) {

    app.post("/categories", {
        preHandler: [authMiddleware, bodyValidator(createCategorySchema)]
    }, async (request, reply) => {
        const body = request.body as z.infer<typeof createCategorySchema>;
        try {
            const category = await createCategory(body);
            return sendCreated(reply, category, "Category created successfully");
        } catch (error) {
            if ((error as any).code === "P2002") {
                throw new ConflictError("Category name already exists");
            }
            throw error;
        }
    });

    app.get("/categories", async (request, reply) => {
        const categories = await getAllCategories();
        return sendSuccess(reply, categories, "Categories retrieved successfully");
    });

    app.get("/categories/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const category = await getCategoryById(id);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        return sendSuccess(reply, category, "Category retrieved successfully");
    });

    app.get("/categories/by-slug/:slug", async (request, reply) => {
        const { slug } = request.params as { slug: string };
        const category = await getCategoryBySlug(slug);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        return sendSuccess(reply, category, "Category retrieved successfully");
    });

    app.put("/categories/:id", {
        preHandler: [authMiddleware, bodyValidator(updateCategorySchema)]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as z.infer<typeof updateCategorySchema>;
        try {
            const category = await updateCategory(id, body);
            if (!category) {
                throw new NotFoundError("Category not found");
            }
            return sendSuccess(reply, category, "Category updated successfully");
        } catch (error) {
            if ((error as any).code === "P2025") {
                throw new NotFoundError("Category not found");
            }
            throw error;
        }
    });

    app.delete("/categories/:id", {
        preHandler: [authMiddleware]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const category = await deleteCategory(id);
            if (!category) {
                throw new NotFoundError("Category not found");
            }
            return sendDeleted(reply, category, "Category deleted successfully");
        } catch (error) {
            if ((error as any).code === "P2025") {
                throw new NotFoundError("Category not found");
            }
            throw error;
        }
    });
}