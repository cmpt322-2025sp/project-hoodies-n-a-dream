/**
 * File: Backend/src/server.ts
 * Author: Connor Vardakis
 * Date: 2/18/25
 * Updated: 2/18/25
 * Description: server.ts starts up DENO server and controls additional action
 */
import { serve } from "std/http/server.ts";

serve(async (req: Request) => {
   const pathway = new URL(req.url).pathname;

   if (pathway == "/") {
       return new Response("Hello from Deno Racing!", {
           headers: { "content-type": "text/plain" },
       });
   }

   return new Response("Not Found", { status: 404 })
});

