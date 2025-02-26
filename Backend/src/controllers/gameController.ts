/**
 * File: Backend/src/controllers/gameController.ts
 * Author: Connor Vardakis
 * Date: 2/19/25
 * Updated: 2/24/25
 * Description: gameController.ts processes all websocket communication
 *              regarding controlling the game
 */
import { createGame, joinGame, updatePlayerProgress, getPlayerProgress, endGame } from "../services/gameServices.ts";

export function handleGameMessages(socket: WebSocket, data: string) {
    try{
        // console.log("[INFO] Handler Triggered: ", data);
        // const message = JSON.parse(data);
        // console.log("[INFO] Parsed Data: ", message);
        // console.log("[INFO] Parsed Type: ", message.type);
        switch (data.type) {
            case "createGame": {
                console.log("[INFO] Triggered game creation")
                const gameID = createGame(socket);
                socket.send(JSON.stringify({ type: "gameCreated", gameID: gameID }));
                break;
            }

            case "joinGame": {
                console.log("[INFO] Triggered game creation")
                const gameID = message;
                if (joinGame(gameID, socket)) {
                    socket.send(JSON.stringify({ type: "joinedGame", gameID }));
                } else {
                    socket.send(JSON.stringify({ type: "ERROR", message: "Game not found" }));
                }
                break;
            }

            case "gameStart": {
                break;
            }

            case "questions": {
                break;
            }

            case "scoreUpdate": {
                console.log("[INFO] Triggered score update")
                const { gameID } = message;
                updatePlayerProgress(gameID, socket);

                const progress = getPlayerProgress(gameID);
                socket.send(JSON.stringify({ type: "progressUpdate", progress }));

                break;
            }

            case "completeGame": {
                break;
            }

            case "endGame": {
                console.log("[INFO] Triggered game end");
                const { gameID } = data.gameID;
                console.log("[INFO] Passing to endGame: ", gameID);
                endGame(gameID);
                socket.send(JSON.stringify({ type: "endGame", message: "Game end" }));
                break;
            }

            case "rematch": {
                break;
            }

            default:
                console.error(`[ERROR] Unknown request from ${clientIp}\n>>>\t ${JSON.stringify(data)}\n`);
                socket.send(JSON.stringify({type: "ERROR", message: "Unknown type"}))
        }
    } catch (err) {}
}