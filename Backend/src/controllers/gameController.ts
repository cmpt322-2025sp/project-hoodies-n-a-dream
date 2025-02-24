/**
 * File: Backend/src/controllers/gameController.ts
 * Author: Connor Vardakis
 * Date: 2/19/25
 * Updated: 2/19/25
 * Description: gameController.ts processes all websocket communication
 *              regarding controlling the game
 */


export function handleGameMessages(socket: WebSocket, data: string) {
    try{
        const message = JSON.parse(data);

        switch (message.type) {
            case "createGame": {
                break;
            }

            case "joinGame": {
                break;
            }

            case "gameStart": {
                break;
            }

            case "questions": {
                break;
            }

            case "scoreUpdate": {
                break;
            }

            case "completeGame": {
                break;
            }

            case "endGame": {
                break;
            }

            default:
                console.error(`[ERROR] Unknown request from ${clientIp}\n>>>\t ${JSON.stringify(data)}\n`);
                socket.send(JSON.stringify({type: "ERROR", message: "Unknown type"}))
        }
    } catch (err) {}
}