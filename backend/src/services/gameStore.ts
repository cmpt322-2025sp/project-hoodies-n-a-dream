/**
 * File: backend/src/services/gameStore.ts
 * Author: Connor Vardakis
 * Date: 3/3/25
 * Updated: 3/4/25
 * Description: gameStore.ts is a class file the helps organize the data storage for the game
 */

interface Player {
    name: string;
    websocket: WebSocket;
    attempts: number;
    score: number;
    status: "waiting" | "ready" | "completed";
}

interface Game {
    id: string;
    players: Player[];
    status: "open" | "racing" | "full" | "ended";
    level: "easy" | "medium" | "hard";
    questions: [];
    startTime: date;
}

export class GameStore {
    private games: Map<string, Game> = new Map();

    createGame(game: Game): boolean {
        console.log("[INFO] createGame method inside gameStore.ts called");
        try{
            this.games.set(game.id, game);
            console.log("[INFO] Created game room: ", game.id);
            return true;
        }
        catch(err){
            console.log("[ERROR] Creating game room: ", err);
            return false;
        }

    }

    getGame(id: string): Game | undefined {
        return this.games.get(id);
    }

    updateGame(id: string, updateData: Partial<Game>): boolean {
        const game = this.games.get(id);
        // console.log("[INFO] Testing updating game: ", game);
        if (!game) {
            console.log("[ERROR] Game not found.");
            return false;
        }
        const updateGame = {...game, ...updateData};
        this.games.set(id,updateGame);
        // console.log("[INFO] Updated game room: ", game);
    }

    deleteGame(id: string): boolean {
        if (this.games.delete(id)) {
            console.log("[INFO] Deleted game room: ", id);
            return true;
        }
        console.error("[ERROR] Failed to delete game room: ", id);
        return false;
    }

    // cleanupExpiredGames(expirationsMS: number): void {
    //     const now = Date.now();
    //     for (const [id, game] of this.games.entries()) {
    //         if (now - game.startTime.getTime() > expirationsMS) && game.status === "open" {
    //             this.games.delete(id);
    //             console.log("[INFO] Cleaned up expired game:", id);
    //         }
    //     }
    // }
}