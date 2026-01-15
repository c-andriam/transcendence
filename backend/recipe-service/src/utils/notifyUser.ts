import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { NotificationType } from "@transcendence/common";

const NOTIFICATION_SERVICE_URL = `${process.env.DOMAIN}:${process.env.NOTIFICATION_SERVICE_PORT}`;

export async function notifyUser(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any
) {
    try {
        const response = await fetch(`${NOTIFICATION_SERVICE_URL}/api/v1/internal/notifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-api-key': process.env.INTERNAL_API_KEY!
            },
            body: JSON.stringify({
                userId,
                type,
                title,
                message,
                data
            })
        });

        if (!response.ok) {
            console.error('Failed to send notification:', await response.text());
        }

        return response.ok;
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
}
