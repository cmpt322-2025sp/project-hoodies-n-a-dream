/**
 * File: Backend/src/services/gameServices.ts
 * Author: Connor Vardakis
 * Date: 2/24/25
 * Updated: 3/3/25
 * Description: gameServices.ts controls the creation of the game and how users get added
 *              to other player games
 */

interface Player {
    name: string;
    attempts: number;
    score: number;
    status: "waiting" | "racing" | "completed";
}

interface Question {
    id: number;
    question: string;
    correct_answer: number;
    incorrect_answers: number[];
}

interface Game {
    id: string;
    players: Player[];
    status: "open" | "racing" | "full" | "ended";
    level: "easy" | "medium" | "hard";
    questions: [];
    startTime: date;
}

const gameRooms = new Map<string, {
    host: WebSocket,
    players: Map<WebSocket, { answered:number }>
}>();

function generateRoomCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export function createGame(host: WebSocket): string {
    const gameID = generateRoomCode();
    gameRooms.set(gameID, { host, players: new Map() });
    console.log("[INFO] Created game room: ", gameID);
    console.log(">>>\t", gameRooms);
    return gameID;
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