/**
 * File: Backend/src/routes/gameWebSockets.ts
 * Author: Connor Vardakis
 * Date: 2/18/25
 * Updated: 2/24/25
 * Description: gameWebSockets.ts handles upgrade from http to websocket
 */


import { handleGameMessages } from "../controllers/gameController.ts";

export function handleGameWebSocket(req: Request) {
    try {
        const {socket, response} = Deno.upgradeWebSocket(req);

        const clientIp = req.conn?.remoteAddr?.hostname || "Unknown";

        socket.onopen = () => {
            console.log(`[INFO] Websocket connected: ${clientIp}`);
        };

        socket.onmessage = (event) => {
            console.log("[INFO] Request received - sending to handler")
            // console.log(event);
            // console.log(JSON.stringify(event.data));
            const data = JSON.parse(event.data);

            handleGameMessages(socket, data)

        }

        socket.onclose = () => {
            console.log(`[INFO] Websocket closed for ${clientIp}`);
        };

        return response;

    } catch (err) {
        console.error("[ERROR] Failed to upgrade Websocket: ", err);
        return new Response("Server failed due to Websocket server", { status: 500 })
    }
}




