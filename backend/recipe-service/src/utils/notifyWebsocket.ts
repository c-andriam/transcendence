

export async function notifyShoppingListUpdate(userId: string, action: string, item: any) {
    const WEBSOCKET_SERVICE_URL = `${process.env.DOMAIN}:${process.env.WEBSOCKET_SERVICE_PORT}`;

    console.log(`[NotifyWS] Attempting to notify ${userId} with action ${action}`);

    const response = await fetch(`${WEBSOCKET_SERVICE_URL}/api/v1/internal/trigger-room-event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-internal-api-key': process.env.INTERNAL_API_KEY!
        },
        body: JSON.stringify({
            room: `shopping_list_${userId}`,
            event: 'shopping_list_update',
            data: {
                action,
                item,
                timestamp: new Date().toISOString()
            }
        })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to notify websocket: ${response.status} ${text}`);
    }
}
