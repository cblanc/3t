import { Brain } from "./brain";
import { GameState } from "./game_state";
import { tail } from "./utils";

export interface SimulationOptions {
	size: number; // Board size
	simulations: number;
	filePath?: string;
}

export class Simulation {
	public brain: Brain;
	private size: number;
	private simulations: number;

	constructor(options: SimulationOptions) {
		const { size, simulations, filePath } = options;
		this.size = size;
		this.simulations = simulations;
		this.brain = new Brain();
		if (filePath) this.brain.load(filePath);
	}

	// Runs simulation
	run(): void {
		for (let i = 0; i < this.simulations; i += 1) {
			this.dispatchSimulation();
		}
	}

	/**
	 * Run a game from start to finish. Update brain with moves and final game
	 * endstate
	 */
	dispatchSimulation(): void {
		let current: GameState = GameState.empty(this.size);
		const gameStates = [current];
		while (!current.complete) {
			const nextState = current.applyRandomMove();
			if (nextState === null) break;
			gameStates.push(nextState);
			current = tail(gameStates);
		}
		this.brain.learn(gameStates);
	}
	
	// Loads brain
	save(file: string): Promise<void> {
		return this.brain.save(file);
	}

	// Loads brain
	load(file: string): void {
		this.brain.load(file);
	}
}