/**
 * File: Backend/src/routes/gameWebSockets.ts
 * Author: Connor Vardakis
 * Date: 2/18/25
 * Updated: 2/19/25
 * Description: gameWebSockets.ts handles upgrade from http to websocket
 */
export function handleGameWebSocket(req: Request) {
    try {
        const {socket, response} = Deno.upgradeWebSocket(req);

        const clientIp = req.conn?.remoteAddr?.hostname || "Unknown";

        socket.onopen = () => {
            console.log(`[INFO] Websocket connected: ${clientIp}`);
        };

        socket.onmessage = (event) => {

            const data = JSON.parse(event.data);

            switch (data.type) {
                case "createGame":
                    break;

                case "joinGame":
                    break;

                case "gameStart":
                    break;

                case "nextQuestion":
                    break;

                default:
                    console.error(`[ERROR] Unknown request from ${clientIp}\n>>>\t ${JSON.stringify(data)}\n`);
                    socket.send(JSON.stringify({type: "ERROR", message: "Unknown type"}));
            }

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




