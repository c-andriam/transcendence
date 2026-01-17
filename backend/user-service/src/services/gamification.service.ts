
import db from "../utils/dbPlugin";
import { NotFoundError } from "@transcendence/common";

export enum GamificationEvent {
    RECIPE_CREATED = 'RECIPE_CREATED',
    REVIEW_GIVEN = 'REVIEW_GIVEN',
    FIRST_LOGIN = 'FIRST_LOGIN'
}

export async function awardXp(userId: string, amount: number) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found");

    const newXp = user.xp + amount;
    const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;

    const updatedUser = await db.user.update({
        where: { id: userId },
        data: { xp: newXp, level: newLevel }
    });

    return {
        xp: newXp,
        level: newLevel,
        leveledUp: newLevel > user.level
    };
}

export async function awardBadge(userId: string, badgeSlug: string) {
    const badge = await db.badge.findUnique({ where: { slug: badgeSlug } });
    if (!badge) {
        console.warn(`Badge with slug ${badgeSlug} not found`);
        return null;
    }

    // Check if user already has it
    const existing = await db.userBadge.findUnique({
        where: {
            userId_badgeId: {
                userId,
                badgeId: badge.id
            }
        }
    });

    if (existing) return existing;

    const userBadge = await db.userBadge.create({
        data: {
            userId,
            badgeId: badge.id
        }
    });

    return userBadge;
}

export async function processGamificationEvent(userId: string, event: GamificationEvent, data?: any) {
    // 1. Award generic XP based on event
    let xpAmount = 0;
    switch (event) {
        case GamificationEvent.RECIPE_CREATED:
            xpAmount = 50;
            break;
        case GamificationEvent.REVIEW_GIVEN:
            xpAmount = 10;
            break;
    }

    let xpResult = null;
    if (xpAmount > 0) {
        xpResult = await awardXp(userId, xpAmount);
    }

    // 2. Check for Specific Badges
    const badgeAwards: any[] = [];

    if (event === GamificationEvent.RECIPE_CREATED) {
        // Example: If this is the FIRST recipe, award "First Chef"
        // Note: In a real microservice, we might not know if it's the "first" unless passed in stats
        // For this MVP, let's assume if it's recipe created, we try to award "First Chef" 
        // Logic: Checks if user has >= 1 recipe? But user-service doesn't have recipes.
        // We rely on data.recipeCount if provided, or we accept a dedicated badgeSlug in params?
        // Let's rely on data.recipeCount
        if (data?.recipeCount === 1) {
            const b = await awardBadge(userId, 'first-recipe');
            if (b) badgeAwards.push('first-recipe');
        }
    }

    return { xpResult, badgeAwards };
}

export async function getUserGamificationProfile(userId: string) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true, badges: { include: { badge: true } } }
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
}
