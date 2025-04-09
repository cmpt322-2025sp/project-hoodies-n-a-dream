/**
 * File: backend/src/controllers/gameController.ts
 * Author: Connor Vardakis
 * Date: 2/19/25
 * Updated: 3/4/25
 * Description: gameController.ts processes all websocket communication
 *              regarding controlling the game
 */
import { createGame, joinGame, startGame, updatePlayerStatus, updatePlayerProgress, getPlayerProgress, endGame } from "../services/gameServices.ts";
import {getQuestions} from "../services/mathServices";

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
                const gameID = createGame(difficulty, name, socket);
                if (gameID != "ERROR") {
                    socket.send(JSON.stringify({type: "gameCreated", gameID: gameID}));
                    break;
                } else {
                    socket.send(JSON.stringify({type: "ERROR", message: "Unable to make Game Room"}));
                    break;
                }
            }

            case "joinGame": {
                console.log("[INFO] New Player")
                const gameID = data.gameID;
                const name = data.name || "player"+Math.floor(Math.random() * (100 - 1 + 1)) + 1;
                const response = joinGame(gameID, name, socket);
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

            case "requestNextQuestion": {
                const difficulty = data.difficulty || "easy";

                // 1) Generate the entire question set
                let questionSet = getQuestions(difficulty);

                // If you want EXACTLY 20 questions:
                questionSet = questionSet.slice(0, 20);

                // 2) Send them to the requesting socket
                socket.send(JSON.stringify({
                    type: "questions",
                    questions: questionSet
                }));

                break;
            }
            default:
                console.error(`[ERROR] Unknown request from ${clientIp}\n>>>\t ${JSON.stringify(data)}\n`);
                socket.send(JSON.stringify({type: "ERROR", message: "Unknown type"}))
        }
    } catch (err) {}
}