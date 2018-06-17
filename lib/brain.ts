/**
 * @module learn.ts
 * Match contains multiple rounds
 */

import { writeFile } from "fs";
import { promisify } from "util";
import { 
	GameId,
	GameState,
	Move,
} from "./game_state";
import { tail } from "./utils";

const write = promisify(writeFile);

interface BrainJSON {
	memory: GameStateConfig[];
}

interface Predictions {
	x: number;
	o: number;
	draw: number;
}

interface GameStateConfig {
	x: number; // Number of X wins
	o: number; // Number of O wins
	draw: number;
	gameId: GameId;
}

class GameStateMemory {
	public gameId: GameId;
	public x: number;
	public o: number;
	public draw: number;

	constructor(state: GameStateConfig) {
		this.gameId = state.gameId;
		this.x = state.x;
		this.o = state.o;
		this.draw = state.draw;
	}

	get total() {
		return this.x + this.o + this.draw;
	}

	// private load(state: GameStateConfig): void {
	// 	this.gameId = state.gameId;
	// 	this.x = state.x;
	// 	this.o = state.o;
	// 	this.draw = state.draw;
	// }

	public boostX(): number {
		return this.x += 1;
	}

	public boostO(): number {
		return this.o += 1;
	}

	public boostDraw(): number {
		return this.draw += 1;
	}

	static newEmpty(gameId: GameId): GameStateMemory {
		return new GameStateMemory({
			gameId,
			x: 1,
			o: 1,
			draw: 1,
		});
	}

	get predictions(): Predictions {
		const { total, x, o, draw } = this;
		
		return {
			x: x / total,
			o: o / total,
			draw: draw / total,
		};
	}

	get json(): GameStateConfig {
		return {
			x: this.x,
			o: this.o,
			draw: this.draw,
			gameId: this.gameId,
		};
	}
}

export class Brain {
	private memory: Map<GameId, GameStateMemory>; 

	constructor() {
		this.memory = new Map<GameId, GameStateMemory>();
	}

	/**
	 * Given a completed chain of gamestates, update brain with outcome
	 * @param {GameStates[]} gameStates
	 */
	learn(gameStates: GameState[]): void {
		const { winner } = tail(gameStates);
		
		gameStates.forEach(gameState => {
			const { id } = gameState;
			const memory = this.recall(id);
			if (winner === 1) return memory.boostX();
			if (winner === 0) return memory.boostO();

			return memory.boostDraw();
		});
	}


	/**
	 * Retrives memory for particular game
	 * If no memory exists, empty one is created and returned
	 * @param  {GameId}          id
	 * @return {GameStateMemory}   
	 */
	recall(id: GameId): GameStateMemory {
		const memory = this.memory.get(id);
		if (memory !== undefined) return memory;
		// Instantiate new memory if never before state observed
		const newMemory = GameStateMemory.newEmpty(id);
		this.memory.set(id, newMemory);

		return newMemory;
	}

	// Predicts outcomes given gamestate
	predict(id: GameId): Predictions {
		const memory = this.recall(id);
		
		return memory.predictions;
	}

	load(file: string): void {
		console.log(file)
		const data = require(file) as BrainJSON;
		data.memory.forEach(memory => {
			this.memory.set(memory.gameId, new GameStateMemory(memory));
		});
	}

	toJson(): string {
		const memory = Array
			.from(this.memory.values())
			.map(m => m.json);

		return JSON.stringify({ memory });
	}

	save(filePath: string): Promise<void> {
		return write(
			filePath,
			this.toJson(),
			{ encoding: "utf8" }
		);
	}
}
