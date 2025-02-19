/**
 * File: Backend/src/server.ts
 * Author: Connor Vardakis
 * Date: 2/18/25
 * Updated: 2/18/25
 * Description: server.ts starts up DENO server and controls additional action
 */
// @ts-ignore
import { serve } from "std/http/server.ts";

// @ts-ignore
const handler = async (req: Request):Promise<Response> => {
    const { method, url } = req;
    const parsedURL = new URL(url);
    const pathway = parsedURL.pathname;
    const searchParams = parsedURL.searchParams;

    if (pathway === "/ws" && req.headers.get("upgrade") === "websocket") {
        // @ts-ignore
        const { socket, response } = Deno.upgradeWebSocket(req);

        socket.onopen = () => {
            console.log("[INFO] Websocket opened");
        };

        socket.onmessage = (event) => {
            console.log("[INFO] Websocket message received: " + JSON.stringify(event.data));

            socket.send("Server received: " + JSON.stringify(event.data));
        };

        socket.onclose = () => {
            console.log("[INFO] Websocket closed");
        };

        return response;
    }

    if (pathway == "/") {
        return new Response("Hello from Deno Racing! (with Websockets)", {
            headers: { "content-type": "text/plain" },
        });
    }
    return new Response("Not Found", { status: 404 })
};

const PORT = 8000;
console.log('[INFO] Server started on port', PORT);
serve(handler, {port: PORT})