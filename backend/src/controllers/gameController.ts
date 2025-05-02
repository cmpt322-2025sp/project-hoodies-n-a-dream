/**
 * File: backend/src/controllers/gameController.ts
 * Author: Connor Vardakis
 * Date: 2/19/25
 * Updated: 3/4/25
 * Description: gameController.ts processes all websocket communication
 *              regarding controlling the game
 */
import {
    createGame,
    joinGame,
    startGame,
    updatePlayerStatus,
    scoreUpdate,
    gameComplete,
    getPlayerProgress,
    endGame,
    leaveGame
} from "../services/gameServices.ts";

export function handleGameMessages(socket: WebSocket, data: string) {
    try{
        console.log("[INFO] Handler Triggered: ", data);
        // const message = JSON.parse(data);
        // console.log("[INFO] Parsed Data: ", message);
        // console.log("[INFO] Parsed Type: ", message.type);
        switch (data.type) {
            case "createGame": {
                console.log("[INFO] Triggered game creation");
                const difficulty = data.difficulty || "easy";
                const name = data.name || "player1";
                createGame(difficulty, name, socket);
                break;
            }

            case "joinGame": {
                console.log("[INFO] New Player")
                const gameID = data.gameID;
                const name = data.name || "player"+Math.floor(Math.random() * (100 - 1 + 1)) + 1;
                const response = joinGame(gameID, name, socket);
                socket.send(response);
                break;
            }

            case "leaveGame": {
                console.log("[INFO] Remove Player");
                const gameID = data.gameID;
                const response = leaveGame(gameID, socket);
                socket.send(response);
                break;
            }

            case "startGame": {
                console.log("[INFO] Game Start")
                const gameID = data.gameID;
                startGame(gameID);
                break;
            }

            case "questionsReceived": {
                const gameID = data.gameID;
                updatePlayerStatus(gameID, socket, "ready");
                break;
            }

            case "scoreUpdate": {
                //Client -> Server { "type": "scoreUpdate", "gameID": "1234", "score": "10", "attempts": "12" }
                console.log("[INFO] Triggered score update")
                const gameID  = data.gameID;
                const score = data.score;
                const attempts = data.attempts
                scoreUpdate(gameID, socket, score, attempts);
                break;
            }

            case "gameComplete": {
                const gameID = data.gameID;
                const time =  data.time;
                const score = data.score;
                gameComplete(gameID, socket, time, score);
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