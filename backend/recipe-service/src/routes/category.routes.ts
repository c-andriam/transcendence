import { FastifyInstance } from "fastify";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, getCategoryBySlug, updateCategory } from "../services/category.service";
import { HttpStatus, sendConflict, sendError, sendNotFound, sendCreated, sendSuccess } from "@transcendence/common";

export async function categoryRoutes(app: FastifyInstance) {
    app.post("/categories", async (request, reply) => {
        const body = request.body as {
            name: string;
            iconName?: string;
            color?: string;
            sortOrder?: number;
        };
        try {
            const category = await createCategory(body);
            return sendCreated(reply, category);
        } catch (error) {
            if ((error as any).code === "P2002") {
                return sendConflict(reply, "Category name already exists");
            }
            sendError(reply, "Internal server error");
        }
    });

    app.get("/categories", async (request, reply) => {
        try {
            const categories = await getAllCategories();
            return sendSuccess(reply, categories);
        } catch (error) {
            sendError(reply, "Internal server error");
        }
    });

    app.get("/categories/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const category = await getCategoryById(id);
            if (!category) {
                return sendNotFound(reply, "Category not found");
            }
            return sendSuccess(reply, category);
        } catch (error) {
            sendError(reply, "Internal server error");
        }
    });

    app.get("/categories/by-slug/:slug", async (request, reply) => {
        const { slug } = request.params as { slug: string };
        try {
            const category = await getCategoryBySlug(slug);
            if (!category) {
                return sendNotFound(reply, "Category not found");
            }
            return sendSuccess(reply, category);
        } catch (error) {
            sendError(reply, "Internal server error");
        }
    });

    app.put("/categories/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as {
            name?: string;
            iconName?: string;
            color?: string;
            sortOrder?: number;
        };
        try {
            const category = await updateCategory(id, body);
            if (!category) {
                return sendNotFound(reply, "Category not found");
            }
            return sendSuccess(reply, category);
        } catch (error) {
            if ((error as any).code === "P2025") {
                return sendNotFound(reply, "Category not found");
            }
            sendError(reply, "Internal server error");
        }
    });

    app.delete("/categories/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const category = await deleteCategory(id);
            if (!category) {
                return sendNotFound(reply, "Category not found");
            }
            return sendSuccess(reply, category);
        } catch (error) {
            if ((error as any).code === "P2025") {
                return sendNotFound(reply, "Category not found");
            }
            sendError(reply, "Internal server error");
        }
    });
}