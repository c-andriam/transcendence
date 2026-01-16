import { validateEnv } from '@transcendence/common';

const env = validateEnv();

export async function notifyUser(userId: string, event: string, data: any) {
    try {
        const websocketServiceUrl = `http://localhost:${env.WEBSOCKET_SERVICE_PORT}/internal/trigger-event`;

        await fetch(websocketServiceUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-api-key': env.INTERNAL_API_KEY
            },
            body: JSON.stringify({
                userId,
                event,
                data
            })
        });
    } catch (error) {
        console.error(`Failed to notify user ${userId}:`, error);
    }
}
