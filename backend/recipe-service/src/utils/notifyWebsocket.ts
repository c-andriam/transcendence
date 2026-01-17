
const WEBSOCKET_SERVICE_URL = `${process.env.DOMAIN}:${process.env.WEBSOCKET_SERVICE_PORT}`;

export async function notifyShoppingListUpdate(userId: string, action: string, item: any) {
    try {
        await fetch(`${WEBSOCKET_SERVICE_URL}/api/v1/internal/trigger-room-event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-api-key': process.env.INTERNAL_API_KEY!
            },
            body: JSON.stringify({
                room: `shopping_list_${userId}`,
                event: 'SHOPPING_LIST_UPDATE',
                data: {
                    action,
                    item,
                    timestamp: new Date().toISOString()
                }
            })
        });
    } catch (error) {
        console.error("Failed to notify websocket service of shopping list update:", error);
    }
}
