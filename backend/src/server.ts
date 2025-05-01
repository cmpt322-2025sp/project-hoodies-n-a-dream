/**
 * File: backend/src/server.ts
 * Author: Connor Vardakis
 * Date: 2/18/25
 * Updated: 3/4/25 (and now modified to serve additional frontend files)
 * Description: server.ts starts up DENO server and controls additional action
 */
// @ts-ignore
import { serve } from "std/http/server.ts";
import { extname, join } from "std/path/mod.ts";
import { handleGameWebSocket } from "./routes/gameWebSockets.ts";

// Paths
const BASE_PATH = Deno.cwd();
const FRONTEND_PATH = join(BASE_PATH, "/frontend"); // Adjust for backend/src structure
const ASSETS_PATH = join(BASE_PATH, "/assets");
const AUDIO_PATH = join(BASE_PATH, "/audio");

console.log(`[INFO] Serving frontend from: ${FRONTEND_PATH}`);
console.log(`[INFO] Server assets from ${ASSETS_PATH}`);

const serveFile = async (directory: string, filePath: string) => {
    try {
        const fullPath = join(directory, filePath);
        const file = await Deno.readFile(fullPath);
        const contentType = getContentType(filePath);
        return new Response(file, { headers: { "content-type": contentType } });
    } catch (error) {
        console.error(`[ERROR] File not found: ${filePath}`);
        return new Response("File not found", { status: 404 });
    }
};

const getContentType = (path: string) => {
    const extension = extname(path);
    const types: Record<string, string> = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".ico": "image/x-icon",
        ".wav": "audio/wav",
        ".mp3": "audio/mpeg",
        ".json": "application/json",
        ".svg": "image/svg+xml"
    };
    return types[extension] || "application/octet-stream";
};

// Main request handler
// @ts-ignore
const handler = async (req: Request): Promise<Response> => {
    const parsedURL = new URL(req.url);
    const pathway = parsedURL.pathname;

    console.log(`[INFO] Incoming request: ${pathway}`);

    // WebSocket request
    if (pathway === "/ws" && req.headers.get("upgrade") === "websocket") {
        return handleGameWebSocket(req);
    }

    // Serve files from the assets directory (if request begins with /assets/)
    if (pathway.startsWith("/assets/")) {
        // Remove the "/assets/" prefix and serve from ASSETS_PATH
        return serveFile(ASSETS_PATH, pathway.replace("/assets/", ""));
    }

    if (pathway.startsWith("/audio/")) {
        // Remove the "/assets/" prefix and serve from ASSETS_PATH
        return serveFile(AUDIO_PATH, pathway.replace("/audio/", ""));
    }

    // For the root request, send Startsection.html
    if (pathway === "/") {
        return serveFile(FRONTEND_PATH, "index.html");
    }

    // For all other requests, attempt to serve the file from the frontend folder.
    // This covers any additional HTML (or JS, CSS, etc.) that your frontend calls.
    const filePath = pathway.startsWith("/") ? pathway.substring(1) : pathway;
    return serveFile(FRONTEND_PATH, filePath);
};

const PORT = 8000;
console.log('[INFO] Server started on port', PORT);
serve(handler, { port: PORT });
