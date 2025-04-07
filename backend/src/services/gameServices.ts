/**
 * File: backend/src/services/gameServices.ts
 * Author: Connor Vardakis
 * Date: 2/24/25
 * Updated: 3/4/25
 * Description: gameServices.ts controls the creation of the game and how users get added
 *              to other player games
 */
import { GameStore } from "./gameStore.ts";
import { getQuestions } from "./mathServices.ts";

const gameRooms = new GameStore();

function generateRoomCode(): string {
    const gameID =  Math.floor(1000 + Math.random() * 9000).toString();
    const game = gameRooms.getGame(gameID);
    if (!game) {
        return gameID;
    } else {
        return generateRoomCode();
    }
}

export function createGame(gameDifficulty: string, hostName: string, hostSocket: WebSocket): string {
    console.log("[INFO] Attempting Game Creation");
    // Create GameID
    const gameID = generateRoomCode();
    console.log("[INFO] Game Id Created: ", gameID);
    // Get Questions Based on difficulty level
    const questions = getQuestions(gameDifficulty);
    // Add first player (host)

    const player: Player = {
        name: hostName,
        websocket: hostSocket,
        attempts: 0,
        score: 0,
        status: "waiting"
    }

    // Generate Game instance and save to gameStore
    console.log("[INFO] Creating Game interface");
    const game: Game = {
        id: gameID,
        players: [player],
        status: "open",
        level: gameDifficulty,
        questions: questions,
        startTime: new Date(),
    }
    // console.log(game);
    // Save Game
    console.log("[INFO] Attempting Saving");
    const result = gameRooms.createGame(game);
    if(result){
        console.log("[INFO] Sending gameID");
        return gameID;
    }
    console.log("[INFO] Failed Game Create");
    return "ERROR";
}

export function joinGame(gameID: string, playerName: string, playerSocket: Websocket): string {
    console.log("[INFO] Join game called in gameServices")
    const game = gameRooms.getGame(gameID);
    // console.log("[TROUBLESHOOT] Game was found: ");
    if (!game) {
        console.log("[ERROR] Failed to update player game count");
        return JSON.stringify( {"type": "ERROR", "message": "Game not found"}) ;
    } else if (game.status != "open") {
        console.log("[ERROR] Game status: ", game.status);
        return JSON.stringify( {"type": "ERROR", "message": "Game not join-able"}) ;
    }

    const currentPlayers = game.players.map(player => player.name);
    console.log("[TROUBLESHOOT] Skipped If statements ");
    const newPlayer: Player = {
        name: playerName,
        websocket: playerSocket,
        attempts: 0,
        score: 0,
        status: "waiting"
    }
    // console.log("[TROUBLESHOOT] Created Player ", newPlayer);
    const updatedPlayers = [...game.players, newPlayer];
    // console.log("Attempting Player addition");
    // console.log(updatedPlayers);
    gameRooms.updateGame(gameID, { players: updatedPlayers });

    if (game.players.length >= 2) {
        gameRooms.updateGame(gameID, { status: "full" });
    }

    const message = JSON.stringify({ "type": "playerJoined", "name": playerName });
    broadcast(gameID, message, newPlayer.name, true);
    // console.log(gameRooms.getGame(gameID));

    return JSON.stringify({"type": "joinedGame", "gameID": game.id, "players": currentPlayers});
}

export async function startGame(gameID: string) {
    console.log("[INFO] Starting Game ", gameID);
    const game = gameRooms.getGame(gameID);
    if (!game) {
        console.log("[ERROR] Game not found");
        // return JSON.stringify( {"type": "ERROR", "message": "Game not found"}) ;
    }

    gameRooms.updateGame(gameID, { status: "racing" });
    await sendQuestions(gameID);
    sendCountdown(gameID, 3);
}

export async function updatePlayerScore(gameID: string, socket: WebSocket, score: number, attempts: number) {
    const game = gameRooms.getGame(gameID);
    if (!game) {
        console.log("[ERROR] Game not found");
        // return JSON.stringify( {"type": "ERROR", "message": "Game not found"}) ;
    }

    let playerName = null;
    const updatedPlayers = game.players.map(player => {
        if (player.websocket === socket) {
            playerName = player.name;
            return { ...player, attempts: attempts, score: score };
        }
    });

    // Use the updateGame function to update the game with the new players array
    gameRooms.updateGame(gameID, { players: updatedPlayers });

    const message = JSON.stringify({"type": "scoreReport", "name": playerName, "score": score});
    broadcast(gameID, message, playerName, true);
}

export function updatePlayerProgress(gameID: string, player: WebSocket): string {
    const game = gameRooms.get(gameID);
    if (!game) {
        console.log("[ERROR] Failed to update player game count");
        return JSON.stringify( {"type": "ERROR", "message": "Game not found"}) ;
    } else if (game.status != "open") {
        return JSON.stringify( {"type": "ERROR", "message": "Game not join-able"}) ;
    } else {

    }
    game.players.get(player)!.answered++;
    console.log("[INFO] Updated players score: ", game.players.get(player).answered);
}

export function getPlayerProgress(gameID: string): Record<string, number> {
    const game = gameRooms.get(gameID);
    if (!game) {
        console.log("[ERROR] Failed to update player game count");
    }

    const progress: Record<string, number> = {};
    game.players.forEach((data, ws) => {
        progress[ws.url || "Unknown"] = data.answered
    });

    console.log(progress);

    return progress;
}

export function endGame(gameID: string) {

    const game = gameRooms.get(gameID);

    if (!game) {
        console.log("[ERROR] Game does not exist");
        return;
    }
    gameRooms.delete(gameID);
    console.log("[INFO] Ended Game: ", gameID);
    console.log(">>>\t", gameRooms);
    return;
}

const sendCountdown = async (gameID: string, seconds: number = 3) => {
    console.log("[INFO] Sending countdown for game: ", gameID);
    for (let i = seconds; i > 0; i--) {
        const countdownMessage = JSON.stringify({
            type: "gameStarting",
            gameID: gameID,
            countdown: i.toString()
        });
        broadcast(gameID, countdownMessage, null, false);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    }

    // At the end of the countdown, send the game started message.
    const startMessage = JSON.stringify({
        type: "gameStarted",
        gameID: gameID
    });
    broadcast(gameID, startMessage, null, false);
};

async function sendQuestions(gameID: string, targetPlayer?: Player, retryCount: number = 0) {
    const game = gameRooms.getGame(gameID);
    const questions = game.questions;
    // If a specific player is provided, only send to that player.
    const players = targetPlayer ? [targetPlayer] : game.players;

    if (targetPlayer) {
        console.log(`[TROUBLESHOOT] Sending questions to ${targetPlayer.name} (attempt ${retryCount + 1})`);
    } else {
        console.log("[TROUBLESHOOT] Sending questions to all players");
    }

    await Promise.all(players.map(async (player) => {
        try {
            // Send questions using the WebSocket connection.
            player.websocket.send(JSON.stringify({
                type: "questions",
                questions: questions,
            }));

            // Wait for the player's acknowledgment.
            await sleep(500);

            // Re-fetch the updated game and find the player by a unique reference.
            const updatedGame = gameRooms.getGame(gameID);
            const updatedPlayer = updatedGame.players.find(p => p.websocket === player.websocket);
            if (updatedPlayer?.status !== "ready") {
                console.error(`Player ${player.name} did not confirm receiving questions.`);
                if (retryCount + 1 < 3) {
                    // Retry by recursively calling sendQuestions with an incremented retry count.
                    await sendQuestions(gameID, player, retryCount + 1);
                } else {
                    console.error(`Player ${player.name} failed to confirm after 3 attempts. Removing player.`);
                    // Placeholder for removePlayer functionality:
                    // removePlayer(gameID, player);
                }
            } else {
                console.log(`Player ${player.name} confirmed receiving questions.`);
            }
        } catch (error) {
            console.error(`Error sending questions to player ${player.name}:`, error);
        }
    }));

    console.log("[INFO] Finished sending questions for targeted players");
}



function waitForPlayerResponse(player: Player, expectedType: string, timeout = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
        // Define a message handler that listens for incoming messages
        const messageHandler = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === expectedType) {
                    clearTimeout(timer);
                    // Remove the event listener once we get the expected response
                    player.ws.removeEventListener("message", messageHandler);
                    resolve(data);
                }
            } catch (error) {
                // If parsing fails, ignore the message
            }
        };

        // Set up a timeout in case the player doesn't respond in time
        const timer = setTimeout(() => {
            player.ws.removeEventListener("message", messageHandler);
            reject(new Error(`Timeout waiting for ${expectedType} from ${player.name}`));
        }, timeout);

        // Attach the event listener to the player's WebSocket
        player.ws.addEventListener("message", messageHandler);
    });
}

export function updatePlayerStatus(gameID: string, socket: WebSocket, newStatus: string) {
    let game = gameRooms.getGame(gameID)
    if (!game) {
        console.log("[ERROR] Game does not exist");
    }

    const updatedPlayers = game.players.map(player => {
        if (player.websocket === socket) {
            // Update the player's status
            return { ...player, status: newStatus };
        }
        return player;
    });

    // Use the updateGame function to update the game with the new players array
    return gameRooms.updateGame(gameID, { players: updatedPlayers });


}

function broadcast(gameID:string, message:string, triggerPlayer:string, ignoreTriggerPlayer:boolean) {
    const game = gameRooms.getGame(gameID);
    if (!game) {
        console.log("[ERROR] Game does not exist");
    }

    game.players.forEach(player => {
        if (!(ignoreTriggerPlayer && player.name == triggerPlayer)) {
            try {
                player.websocket.send(message);
            } catch (err) {
                console.error("[ERROR] Failed to send game message: ", err);
            }
        }
    })
    return;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}