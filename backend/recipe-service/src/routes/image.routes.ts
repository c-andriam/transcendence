import { FastifyInstance } from 'fastify';
import { 
    sendSuccess, 
    sendCreated, 
    sendDeleted,
    authMiddleware,
    BadRequestError 
} from '@transcendence/common';
import {
    getRecipeImages,
    uploadLocalImage,
    uploadImageFromExternalUrl,
    removeImage,
    updateImage,
    setAsPrimaryImage,
    reorderImages,
    removeMultipleImages,
    uploadMultipleImagesFromUrls,
    uploadMultipleLocalImages
} from '../services/image.service';

interface UploadUrlBody {
    imageUrl: string;
    altText?: string;
    isPrimary?: boolean;
}

interface UploadMultipleUrlsBody {
    images: { imageUrl: string; altText?: string }[];
}

interface DeleteMultipleBody {
    imageIds: string[];
}

interface UpdateImageBody {
    altText?: string;
    isPrimary?: boolean;
    sortOrder?: number;
}

interface ReorderImagesBody {
    imageIds: string[];
}

export async function imageRoutes(app: FastifyInstance) {

    app.get('/recipes/:recipeId/images', async (request, reply) => {
        const { recipeId } = request.params as { recipeId: string };
        const images = await getRecipeImages(recipeId);
        sendSuccess(reply, images, images.length ? 'Images found' : 'No images for this recipe');
    });

    app.post('/recipes/:recipeId/images/upload', 
        { preHandler: authMiddleware },
        async (request, reply) => {
            const { recipeId } = request.params as { recipeId: string };
            const userId = request.user!.id;
            let fileBuffer: Buffer | null = null;
            let fileMimetype: string = '';
            let altText: string | undefined;
            let isPrimary: boolean = false;

            const parts = request.parts();
            for await (const part of parts) {
                if (part.type === 'file') {
                    fileMimetype = part.mimetype;
                    fileBuffer = await part.toBuffer();
                } else {
                    if (part.fieldname === 'altText') {
                        altText = part.value as string;
                    } else if (part.fieldname === 'isPrimary') {
                        isPrimary = part.value === 'true';
                    }
                }
            }
            if (!fileBuffer) {
                throw new BadRequestError('No file uploaded');
            }
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
            if (!allowedMimeTypes.includes(fileMimetype)) {
                throw new BadRequestError(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`);
            }
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (fileBuffer.length > maxSize) {
                throw new BadRequestError('File size exceeds 10MB limit');
            }
            const image = await uploadLocalImage(recipeId, userId, fileBuffer, {
                altText,
                isPrimary
            });
            sendCreated(reply, image, 'Image uploaded successfully');
        }
    );

    app.post('/recipes/:recipeId/images/url',
        { preHandler: authMiddleware },
        async (request, reply) => {
            const { recipeId } = request.params as { recipeId: string };
            const userId = request.user!.id;
            const body = request.body as UploadUrlBody;

            if (!body.imageUrl) {
                throw new BadRequestError('imageUrl is required');
            }

            const image = await uploadImageFromExternalUrl(recipeId, userId, body.imageUrl, {
                altText: body.altText,
                isPrimary: body.isPrimary
            });

            sendCreated(reply, image, 'Image uploaded from URL successfully');
        }
    );

    app.put('/recipes/:recipeId/images/:imageId',
        { preHandler: authMiddleware },
        async (request, reply) => {
            const { imageId } = request.params as { recipeId: string; imageId: string };
            const userId = request.user!.id;
            const body = request.body as UpdateImageBody;

            const image = await updateImage(imageId, userId, body);
            sendSuccess(reply, image, 'Image updated successfully');
        }
    );

    app.delete('/recipes/:recipeId/images/bulk',
        { preHandler: authMiddleware },
        async (request, reply) => {
            const userId = request.user!.id;
            const body = request.body as DeleteMultipleBody;

            if (!body.imageIds || !Array.isArray(body.imageIds) || body.imageIds.length === 0) {
                throw new BadRequestError('imageIds array is required and cannot be empty');
            }

            const result = await removeMultipleImages(body.imageIds, userId);
            sendSuccess(reply, result, `${result.deleted.length} image(s) deleted successfully`);
        }
    );

    app.post('/recipes/:recipeId/images/:imageId/primary',
        { preHandler: authMiddleware },
        async (request, reply) => {
            const { imageId } = request.params as { recipeId: string; imageId: string };
            const userId = request.user!.id;

            const image = await setAsPrimaryImage(imageId, userId);
            sendSuccess(reply, image, 'Image set as primary successfully');
        }
    );

    app.delete('/recipes/:recipeId/images/:imageId',
        { preHandler: authMiddleware },
        async (request, reply) => {
            const { imageId } = request.params as { recipeId: string; imageId: string };
            const userId = request.user!.id;

            const image = await removeImage(imageId, userId);
            sendDeleted(reply, image, 'Image deleted successfully');
        }
    );

    app.post('/recipes/:recipeId/images/urls',
        { preHandler: authMiddleware },
        async (request, reply) => {
            const { recipeId } = request.params as { recipeId: string };
            const userId = request.user!.id;
            const body = request.body as UploadMultipleUrlsBody;

            if (!body.images || !Array.isArray(body.images) || body.images.length === 0) {
                throw new BadRequestError('images array is required and cannot be empty');
            }
            if (body.images.length > 10) {
                throw new BadRequestError('Maximum 10 images per request');
            }
            const result = await uploadMultipleImagesFromUrls(recipeId, userId, body.images);
            sendCreated(reply, result, `${result.uploaded.length} image(s) uploaded successfully`);
        }
    );

    app.post('/recipes/:recipeId/images/uploads',
        { preHandler: authMiddleware },
        async (request, reply) => {
            const { recipeId } = request.params as { recipeId: string };
            const userId = request.user!.id;

            const files: { buffer: Buffer; altText?: string; mimetype: string }[] = [];
            
            const parts = request.parts();
            for await (const part of parts) {
                if (part.type === 'file') {
                    const buffer = await part.toBuffer();
                    // Vérifier la taille du fichier (max 10MB)
                    if (buffer.length > 10 * 1024 * 1024) {
                        throw new BadRequestError(`File ${part.filename} exceeds 10MB limit`);
                    }
                    files.push({
                        buffer,
                        mimetype: part.mimetype,
                        altText: undefined
                    });
                }
            }

            if (files.length === 0) {
                throw new BadRequestError('No files uploaded');
            }
            if (files.length > 10) {
                throw new BadRequestError('Maximum 10 images per request');
            }
            const result = await uploadMultipleLocalImages(recipeId, userId, files);
            sendCreated(reply, result, `${result.uploaded.length} image(s) uploaded successfully`);
        }
    );

    app.put('/recipes/:recipeId/images/reorder',
        { preHandler: authMiddleware },
        async (request, reply) => {
            const { recipeId } = request.params as { recipeId: string };
            const userId = request.user!.id;
            const body = request.body as ReorderImagesBody;
            if (!body.imageIds || !Array.isArray(body.imageIds)) {
                throw new BadRequestError('imageIds array is required');
            }
            const images = await reorderImages(recipeId, userId, body.imageIds);
            sendSuccess(reply, images, 'Images reordered successfully');
        }
    );
}
