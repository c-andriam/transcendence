import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
    createReport,
    getReportsByStatus,
    getReportById,
    updateReportStatus,
    getReportStats
} from "../services/report.service";
import { getRecipeById } from "../services/recipe.service";
import { getCommentById } from "../services/comment.service";
import {
    sendSuccess,
    sendCreated,
    authMiddleware,
    adminMiddleware,
    bodyValidator,
    NotFoundError,
    ForbiddenError,
    ConflictError
} from "@transcendence/common";

const reportReasons = [
    'SPAM',
    'INAPPROPRIATE_CONTENT',
    'HARASSMENT',
    'COPYRIGHT',
    'MISLEADING',
    'OTHER'
] as const;

const createReportSchema = z.object({
    reason: z.enum(reportReasons),
    description: z.string().max(1000).optional()
});

const updateReportStatusSchema = z.object({
    status: z.enum(['REVIEWED', 'RESOLVED', 'DISMISSED'])
});

export async function reportRoutes(app: FastifyInstance) {

    app.post("/recipes/:id/report", {
        preHandler: [authMiddleware, bodyValidator(createReportSchema)]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as z.infer<typeof createReportSchema>;

        const recipe = await getRecipeById(id);
        if (!recipe) {
            throw new NotFoundError("Recipe not found");
        }

        if (recipe.authorId === request.user!.id) {
            throw new ForbiddenError("You cannot report your own content");
        }

        const result = await createReport({
            reporterId: request.user!.id,
            targetType: 'RECIPE',
            targetId: id,
            reason: body.reason,
            description: body.description
        });

        if (result.alreadyReported) {
            throw new ConflictError("You have already reported this content");
        }

        sendCreated(reply, result.report, "Recipe reported successfully");
    });

    app.post("/comments/:id/report", {
        preHandler: [authMiddleware, bodyValidator(createReportSchema)]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as z.infer<typeof createReportSchema>;

        const comment = await getCommentById(id);
        if (!comment) {
            throw new NotFoundError("Comment not found");
        }

        if (comment.userId === request.user!.id) {
            throw new ForbiddenError("You cannot report your own content");
        }

        const result = await createReport({
            reporterId: request.user!.id,
            targetType: 'COMMENT',
            targetId: id,
            reason: body.reason,
            description: body.description
        });

        if (result.alreadyReported) {
            throw new ConflictError("You have already reported this content");
        }

        sendCreated(reply, result.report, "Comment reported successfully");
    });

    app.get("/admin/reports", {
        preHandler: [authMiddleware, adminMiddleware]
    }, async (request, reply) => {
        const { status, page, limit } = request.query as {
            status?: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
            page?: string;
            limit?: string;
        };

        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;

        const result = await getReportsByStatus(status, pageNum, limitNum);
        sendSuccess(reply, result, "Reports retrieved");
    });

    app.get("/admin/reports/stats", {
        preHandler: [authMiddleware, adminMiddleware]
    }, async (request, reply) => {
        const stats = await getReportStats();
        sendSuccess(reply, stats, "Report stats retrieved");
    });

    app.get("/admin/reports/:id", {
        preHandler: [authMiddleware, adminMiddleware]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };

        const report = await getReportById(id);
        if (!report) {
            throw new NotFoundError("Report not found");
        }

        sendSuccess(reply, report, "Report retrieved");
    });

    app.put("/admin/reports/:id", {
        preHandler: [authMiddleware, adminMiddleware, bodyValidator(updateReportStatusSchema)]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const { status } = request.body as z.infer<typeof updateReportStatusSchema>;

        const existing = await getReportById(id);
        if (!existing) {
            throw new NotFoundError("Report not found");
        }

        const updated = await updateReportStatus(id, status, request.user!.id);
        sendSuccess(reply, updated, "Report status updated");
    });
}
