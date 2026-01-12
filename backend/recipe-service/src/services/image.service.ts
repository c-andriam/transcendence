import db from '../utils/db';
import { 
    uploadImageFromBuffer, 
    uploadImageFromUrl, 
    deleteImage,
    CloudinaryUploadResult 
} from './cloudinary.service';
import { NotFoundError, BadRequestError } from '@transcendence/common';

export interface RecipeImageData {
    id: string;
    url: string;
    altText: string | null;
    isPrimary: boolean;
    sortOrder: number;
    recipeId: string;
}

export async function getRecipeImages(recipeId: string): Promise<RecipeImageData[]> {
    const recipe = await db.recipe.findUnique({
        where: { id: recipeId },
        select: { id: true }
    });

    if (!recipe) {
        throw new NotFoundError('Recipe not found');
    }

    return db.recipeImage.findMany({
        where: { recipeId },
        orderBy: { sortOrder: 'asc' }
    });
}

export async function getImageById(imageId: string): Promise<RecipeImageData | null> {
    return db.recipeImage.findUnique({
        where: { id: imageId }
    });
}

export async function uploadLocalImage(
    recipeId: string,
    authorId: string,
    buffer: Buffer,
    options?: {
        altText?: string;
        isPrimary?: boolean;
    }
): Promise<RecipeImageData> {
    const recipe = await db.recipe.findUnique({
        where: { id: recipeId },
        select: { id: true, authorId: true }
    });

    if (!recipe) {
        throw new NotFoundError('Recipe not found');
    }

    if (recipe.authorId !== authorId) {
        throw new BadRequestError('You are not authorized to add images to this recipe');
    }

    const cloudinaryResult = await uploadImageFromBuffer(buffer, {
        folder: `recipes/${recipeId}`,
    });

    if (options?.isPrimary) {
        await db.recipeImage.updateMany({
            where: { recipeId, isPrimary: true },
            data: { isPrimary: false }
        });
    }

    const lastImage = await db.recipeImage.findFirst({
        where: { recipeId },
        orderBy: { sortOrder: 'desc' }
    });
    const nextSortOrder = (lastImage?.sortOrder ?? -1) + 1;

    const imageCount = await db.recipeImage.count({ where: { recipeId } });
    const shouldBePrimary = options?.isPrimary || imageCount === 0;

    // Créer l'entrée en base de données
    const image = await db.recipeImage.create({
        data: {
            url: cloudinaryResult.secureUrl,
            altText: options?.altText || null,
            isPrimary: shouldBePrimary,
            sortOrder: nextSortOrder,
            recipeId
        }
    });

    return image;
}

/**
 * Upload une image depuis une URL externe
 */
export async function uploadImageFromExternalUrl(
    recipeId: string,
    authorId: string,
    imageUrl: string,
    options?: {
        altText?: string;
        isPrimary?: boolean;
    }
): Promise<RecipeImageData> {
    // Vérifier que la recette existe et appartient à l'auteur
    const recipe = await db.recipe.findUnique({
        where: { id: recipeId },
        select: { id: true, authorId: true }
    });

    if (!recipe) {
        throw new NotFoundError('Recipe not found');
    }

    if (recipe.authorId !== authorId) {
        throw new BadRequestError('You are not authorized to add images to this recipe');
    }

    // Valider l'URL
    try {
        new URL(imageUrl);
    } catch {
        throw new BadRequestError('Invalid image URL');
    }

    // Upload vers Cloudinary depuis l'URL
    const cloudinaryResult = await uploadImageFromUrl(imageUrl, {
        folder: `recipes/${recipeId}`,
    });

    // Si isPrimary est true, mettre à jour les autres images
    if (options?.isPrimary) {
        await db.recipeImage.updateMany({
            where: { recipeId, isPrimary: true },
            data: { isPrimary: false }
        });
    }

    // Obtenir le prochain sortOrder
    const lastImage = await db.recipeImage.findFirst({
        where: { recipeId },
        orderBy: { sortOrder: 'desc' }
    });
    const nextSortOrder = (lastImage?.sortOrder ?? -1) + 1;

    // Vérifier si c'est la première image
    const imageCount = await db.recipeImage.count({ where: { recipeId } });
    const shouldBePrimary = options?.isPrimary || imageCount === 0;

    // Créer l'entrée en base de données
    const image = await db.recipeImage.create({
        data: {
            url: cloudinaryResult.secureUrl,
            altText: options?.altText || null,
            isPrimary: shouldBePrimary,
            sortOrder: nextSortOrder,
            recipeId
        }
    });

    return image;
}

/**
 * Supprimer une image
 */
export async function removeImage(
    imageId: string,
    authorId: string
): Promise<RecipeImageData> {
    // Récupérer l'image avec la recette
    const image = await db.recipeImage.findUnique({
        where: { id: imageId },
        include: {
            recipe: {
                select: { authorId: true }
            }
        }
    });

    if (!image) {
        throw new NotFoundError('Image not found');
    }

    if (image.recipe.authorId !== authorId) {
        throw new BadRequestError('You are not authorized to delete this image');
    }

    // Extraire le publicId de l'URL Cloudinary
    const publicId = extractPublicIdFromUrl(image.url);
    
    if (publicId) {
        try {
            await deleteImage(publicId);
        } catch (error) {
            console.error('Failed to delete image from Cloudinary:', error);
            // Continue même si la suppression Cloudinary échoue
        }
    }

    // Supprimer de la base de données
    const deletedImage = await db.recipeImage.delete({
        where: { id: imageId }
    });

    // Si l'image supprimée était primary, définir la première image restante comme primary
    if (image.isPrimary) {
        const firstImage = await db.recipeImage.findFirst({
            where: { recipeId: image.recipeId },
            orderBy: { sortOrder: 'asc' }
        });

        if (firstImage) {
            await db.recipeImage.update({
                where: { id: firstImage.id },
                data: { isPrimary: true }
            });
        }
    }

    return deletedImage;
}

/**
 * Mettre à jour une image
 */
export async function updateImage(
    imageId: string,
    authorId: string,
    data: {
        altText?: string;
        isPrimary?: boolean;
        sortOrder?: number;
    }
): Promise<RecipeImageData> {
    // Récupérer l'image avec la recette
    const image = await db.recipeImage.findUnique({
        where: { id: imageId },
        include: {
            recipe: {
                select: { authorId: true, id: true }
            }
        }
    });

    if (!image) {
        throw new NotFoundError('Image not found');
    }

    if (image.recipe.authorId !== authorId) {
        throw new BadRequestError('You are not authorized to update this image');
    }

    // Si on définit cette image comme primary, retirer le statut primary des autres
    if (data.isPrimary) {
        await db.recipeImage.updateMany({
            where: { recipeId: image.recipeId, isPrimary: true, id: { not: imageId } },
            data: { isPrimary: false }
        });
    }

    return db.recipeImage.update({
        where: { id: imageId },
        data: {
            altText: data.altText,
            isPrimary: data.isPrimary,
            sortOrder: data.sortOrder
        }
    });
}

/**
 * Définir une image comme image principale
 */
export async function setAsPrimaryImage(
    imageId: string,
    authorId: string
): Promise<RecipeImageData> {
    return updateImage(imageId, authorId, { isPrimary: true });
}

export async function reorderImages(
    recipeId: string,
    authorId: string,
    imageIds: string[]
): Promise<RecipeImageData[]> {
    // Vérifier que la recette existe et appartient à l'auteur
    const recipe = await db.recipe.findUnique({
        where: { id: recipeId },
        select: { id: true, authorId: true }
    });

    if (!recipe) {
        throw new NotFoundError('Recipe not found');
    }

    if (recipe.authorId !== authorId) {
        throw new BadRequestError('You are not authorized to reorder images of this recipe');
    }

    // Mettre à jour l'ordre de chaque image
    const updatePromises = imageIds.map((imageId, index) =>
        db.recipeImage.update({
            where: { id: imageId },
            data: { sortOrder: index }
        })
    );

    await Promise.all(updatePromises);

    return getRecipeImages(recipeId);
}

function extractPublicIdFromUrl(url: string): string | null {
    try {
        // Format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

/**
 * Supprimer plusieurs images à la fois
 */
export async function removeMultipleImages(
    imageIds: string[],
    authorId: string
): Promise<{ deleted: RecipeImageData[]; failed: { id: string; error: string }[] }> {
    const deleted: RecipeImageData[] = [];
    const failed: { id: string; error: string }[] = [];

    for (const imageId of imageIds) {
        try {
            const deletedImage = await removeImage(imageId, authorId);
            deleted.push(deletedImage);
        } catch (error: any) {
            failed.push({ id: imageId, error: error.message || 'Unknown error' });
        }
    }

    return { deleted, failed };
}

/**
 * Upload plusieurs images depuis des URLs
 */
export async function uploadMultipleImagesFromUrls(
    recipeId: string,
    authorId: string,
    images: { imageUrl: string; altText?: string }[]
): Promise<{ uploaded: RecipeImageData[]; failed: { url: string; error: string }[] }> {
    const uploaded: RecipeImageData[] = [];
    const failed: { url: string; error: string }[] = [];

    // La première image uploadée sera primary si aucune image n'existe
    let isFirst = true;
    const existingImageCount = await db.recipeImage.count({ where: { recipeId } });

    for (const img of images) {
        try {
            const image = await uploadImageFromExternalUrl(recipeId, authorId, img.imageUrl, {
                altText: img.altText,
                isPrimary: isFirst && existingImageCount === 0
            });
            uploaded.push(image);
            isFirst = false;
        } catch (error: any) {
            failed.push({ url: img.imageUrl, error: error.message || 'Unknown error' });
        }
    }

    return { uploaded, failed };
}

/**
 * Upload plusieurs images locales (depuis des buffers)
 */
export async function uploadMultipleLocalImages(
    recipeId: string,
    authorId: string,
    files: { buffer: Buffer; altText?: string; mimetype: string }[]
): Promise<{ uploaded: RecipeImageData[]; failed: { index: number; error: string }[] }> {
    const uploaded: RecipeImageData[] = [];
    const failed: { index: number; error: string }[] = [];

    // Valider les types MIME
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];

    // La première image uploadée sera primary si aucune image n'existe
    let isFirst = true;
    const existingImageCount = await db.recipeImage.count({ where: { recipeId } });

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!allowedMimeTypes.includes(file.mimetype)) {
            failed.push({ index: i, error: `Invalid file type: ${file.mimetype}` });
            continue;
        }

        try {
            const image = await uploadLocalImage(recipeId, authorId, file.buffer, {
                altText: file.altText,
                isPrimary: isFirst && existingImageCount === 0
            });
            uploaded.push(image);
            isFirst = false;
        } catch (error: any) {
            failed.push({ index: i, error: error.message || 'Unknown error' });
        }
    }

    return { uploaded, failed };
}
