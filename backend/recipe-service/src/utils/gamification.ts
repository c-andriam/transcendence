
import { validateEnv } from "@transcendence/common";

const env = validateEnv();
const USER_SERVICE_URL = `${process.env.DOMAIN}:${env.USER_SERVICE_PORT}`;

export enum GamificationEvent {
    RECIPE_CREATED = 'RECIPE_CREATED',
    REVIEW_GIVEN = 'REVIEW_GIVEN',
    FIRST_LOGIN = 'FIRST_LOGIN',
    FOLLOWER_GAINED = 'FOLLOWER_GAINED'
}

export async function triggerGamificationEvent(userId: string, event: GamificationEvent, data: any = {}) {
    try {
        await fetch(`${USER_SERVICE_URL}/api/v1/internal/gamification/event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-api-key': process.env.INTERNAL_API_KEY!
            },
            body: JSON.stringify({
                userId,
                event,
                data
            })
        });
    } catch (error) {
        console.error(`Failed to trigger gamification event ${event} for user ${userId}:`, error);
    }
}
