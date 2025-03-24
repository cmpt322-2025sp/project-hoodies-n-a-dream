/**
 * File: backend/src/server.ts
 * Author: Connor Vardakis
 * Date: 2/18/25
 * Updated: 3/4/25
 * Description: server.ts starts up DENO server and controls additional action
 */
// @ts-ignore
import { serve } from "std/http/server.ts";
import { extname, join, dirname } from "std/path/mod.ts";
import { handleGameWebSocket } from "./routes/gameWebSockets.ts";


//Paths
const BASE_PATH = Deno.cwd();
const FRONTEND_PATH = join(BASE_PATH, "/frontend"); // Adjust for backend/src structure
const ASSETS_PATH = join(BASE_PATH, "/assets");

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


// @ts-ignore
const handler = async (req: Request):Promise<Response> => {
    const parsedURL = new URL(req.url);
    const pathway = parsedURL.pathname;

    console.log(`[INFO] Incoming request: ${pathway}`);

    if (pathway === "/ws" && req.headers.get("upgrade") === "websocket") {
        // console.log("[INFO] Request received:", req);
        return handleGameWebSocket(req);
    }

    if (pathway == "/") {
        return serveFile(FRONTEND_PATH, "background.html");
    }

    if (pathway.startsWith("/assets/")) {
        return serveFile(ASSETS_PATH, pathway.replace("/assets/", ""));
    }

    return new Response("Not Found", { status: 404 })
};

const PORT = 8000;
console.log('[INFO] Server started on port', PORT);
serve(handler, {port: PORT})