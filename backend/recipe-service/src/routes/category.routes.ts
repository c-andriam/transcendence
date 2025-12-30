import { FastifyInstance } from "fastify";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, getCategoryBySlug, updateCategory } from "../services/category.service";

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
            reply.status(201).send({
                status: "success",
                data: category
            });
        } catch (error) {
            if ((error as any).code === "P2002") {
                return reply.status(409).send({
                    status: "error",
                    message: "Category name already exists"
                });
            }
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
    });

    app.get("/categories", async (request, reply) => {
        try {
            const categories = await getAllCategories();
            reply.status(200).send({
                status: "success",
                data: categories
            });
        } catch (error) {
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
    });

    app.get("/categories/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const category = await getCategoryById(id);
            if (!category) {
                return reply.status(404).send({
                    status: "error",
                    message: "Category not found"
                });
            }
            reply.status(200).send({
                status: "success",
                data: category
            });
        } catch (error) {
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
    });

    app.get("/categories/by-slug/:slug", async (request, reply) => {
        const { slug } = request.params as { slug: string };
        try {
            const category = await getCategoryBySlug(slug);
            if (!category) {
                return reply.status(404).send({
                    status: "error",
                    message: "Category not found"
                });
            }
            reply.status(200).send({
                status: "success",
                data: category
            });
        } catch (error) {
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
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
                return reply.status(404).send({
                    status: "error",
                    message: "Category not found"
                });
            }
            reply.status(200).send({
                status: "success",
                data: category
            });
        } catch (error) {
            if ((error as any).code === "P2025") {
                return reply.status(404).send({
                    status: "error",
                    message: "Category not found"
                });
            }
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
    });

    app.delete("/categories/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const category = await deleteCategory(id);
            if (!category) {
                return reply.status(404).send({
                    status: "error",
                    message: "Category not found"
                });
            }
            reply.status(200).send({
                status: "success",
                data: category
            });
        } catch (error) {
            if ((error as any).code === "P2025") {
                return reply.status(404).send({
                    status: "error",
                    message: "Category not found"
                });
            }
            reply.status(500).send({
                status: "error",
                message: "Internal server error"
            });
        }
    });
}