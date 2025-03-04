/**
 * File: backend/src/services/gameServices.ts
 * Author: Connor Vardakis
 * Date: 2/24/25
 * Updated: 3/3/25
 * Description: gameServices.ts controls the creation of the game and how users get added
 *              to other player games
 */
import { GameStore } from "./gameStore.ts";
import { getQuestions } from "./mathServices.ts";

const gameRooms = new GameStore();

function generateRoomCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export function createGame(hostSocket: WebSocket): string {
    console.log("[INFO] Attempting Game Creation");
    // Create GameID
    const gameID = generateRoomCode();
    console.log("[INFO] Game Id Created: ", gameID);
    // Get Questions Based on difficulty level
    const questions = getQuestions("easy");
    // Add first player (host)
    const player: Player = {
        name: "player1",
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
        level: "easy",
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

export function joinGame(gameID: string, player: Websocket): boolean {
    const game = gameRooms.get(gameID);
    if (!game) {
        return false;
    }
    game.players.set(player, { answered: 0 });
    console.log("[INFO] Joined game: ", gameID);
    return true;
}

export function updatePlayerProgress(gameID: string, player: WebSocket) {
    const game = gameRooms.get(gameID);
    if (!game) {
        console.log("[ERROR] Failed to update player game count");
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