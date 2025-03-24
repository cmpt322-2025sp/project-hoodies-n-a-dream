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
    return Math.floor(1000 + Math.random() * 9000).toString();
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
    console.log(game);
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
    console.log("[TROUBLESHOOT] Game was found: ");
    if (!game) {
        console.log("[ERROR] Failed to update player game count");
        return JSON.stringify( {"type": "ERROR", "message": "Game not found"}) ;
    } else if (game.status != "open") {
        console.log("[ERROR] Game status: ", game.status);
        return JSON.stringify( {"type": "ERROR", "message": "Game not join-able"}) ;
    }
    console.log("[TROUBLESHOOT] Skipped If statements ");
    const newPlayer: Player = {
        name: playerName,
        websocket: playerSocket,
        attempts: 0,
        score: 0,
        status: "waiting"
    }
    console.log("[TROUBLESHOOT] Created Player ", newPlayer);
    const updatedPlayers = [...game.players, newPlayer];
    console.log("Attempting Player addition");
    console.log(updatedPlayers);
    gameRooms.updateGame(gameID, { players: updatedPlayers });
    const message = JSON.stringify({ "type": "playerJoined", "name": playerName });
    broadcast(gameID, message, newPlayer.name);
    // console.log(gameRooms.getGame(gameID));

    return JSON.stringify({"type": "joinedGame", "gameID": game.id});
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

function broadcast(gameID:string, message:string, triggerPlayer:string){
    const game = gameRooms.getGame(gameID);
    if (!game) {
        console.log("[ERROR] Game does not exist");
    }

    game.players.forEach(player => {
        if (player.name != triggerPlayer) {
            try {
                player.websocket.send(message);
            } catch (err) {
                console.error("[ERROR] Failed to send game message: ", err);
            }
        }
    })
    return;
}