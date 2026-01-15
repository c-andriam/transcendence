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
