/**
 * File: Backend/src/server.ts
 * Author: Connor Vardakis
 * Date: 2/18/25
 * Updated: 2/19/25
 * Description: server.ts starts up DENO server and controls additional action
 */
// @ts-ignore
import { serve } from "std/http/server.ts";
import { handleGameWebSocket } from "./routes/gameWebSockets.ts";

// @ts-ignore
const handler = async (req: Request):Promise<Response> => {
    const { method, url } = req;
    const parsedURL = new URL(url);
    const pathway = parsedURL.pathname;
    const searchParams = parsedURL.searchParams;

    if (pathway === "/ws" && req.headers.get("upgrade") === "websocket") {
        // console.log("[INFO] Request received:", req);
        return handleGameWebSocket(req);
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