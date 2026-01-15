export const errorSchema = {
    type: "object",
    properties: {
        statusCode: { type: "integer" },
        error: { type: "string" },
        message: { type: "string" }
    }
};

export const commonResponses = {
    400: errorSchema,
    401: errorSchema,
    403: errorSchema,
    404: errorSchema,
    409: errorSchema,
    422: errorSchema,
    429: errorSchema,
    500: errorSchema
};

export const createResponseSchema = (dataSchema: object) => ({
    type: "object",
    properties: {
        status: { type: "string", example: "success" },
        message: { type: "string" },
        data: dataSchema
    }
});

export const paginationSchema = {
    type: "object",
    properties: {
        page: { type: "integer" },
        limit: { type: "integer" },
        total: { type: "integer" },
        totalPages: { type: "integer" },
        hasNext: { type: "boolean" },
        hasPrev: { type: "boolean" }
    }
};

export const authorSummarySchema = {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid" },
        username: { type: "string" },
        avatarUrl: { type: "string", nullable: true }
    }
};

export const categorySummarySchema = {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string" },
        slug: { type: "string" }
    }
};

export const imageSchema = {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid" },
        url: { type: "string" },
        altText: { type: "string", nullable: true },
        isPrimary: { type: "boolean" },
        sortOrder: { type: "integer" }
    }
};

export const recipeSummarySchema = {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid" },
        title: { type: "string" },
        slug: { type: "string" },
        description: { type: "string" },
        prepTime: { type: "integer" },
        cookTime: { type: "integer" },
        servings: { type: "integer" },
        difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"] },
        viewCount: { type: "integer" },
        averageScore: { type: "number" },
        ratingCount: { type: "integer" },
        isPublished: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        author: authorSummarySchema,
        category: { ...categorySummarySchema, nullable: true },
        images: { type: "array", items: imageSchema }
    }
};

export const recipeFullSchema = {
    type: "object",
    properties: {
        ...recipeSummarySchema.properties,
        ingredients: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    name: { type: "string" },
                    quantityText: { type: "string" },
                    isOptional: { type: "boolean" },
                    sortOrder: { type: "integer" }
                }
            }
        },
        instructions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    stepNumber: { type: "integer" },
                    description: { type: "string" }
                }
            }
        },
        dietaryTags: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    name: { type: "string" },
                    slug: { type: "string" }
                }
            }
        },
        updatedAt: { type: "string", format: "date-time" }
    }
};
