import { Brain } from "./brain";
import { GameState } from "./game_state";
import { tail } from "./utils";

export interface SimulationOptions {
	size: number;
	simulations: number;
	filePath?: string;
}

export class Simulation {
	private brain: Brain;
	private size: number;
	private simulations: number;

	constructor(options: SimulationOptions) {
		const { size, simulations, filePath } = options;
		this.size = size;
		this.simulations = simulations;
		this.brain = new Brain();
		if (filePath) this.brain.load(filePath);
	}

	/**
	 * Runs simulation
	 */
	run(): void {
		for (let i = 0; i < this.simulations; i += 1) {
			this.dispatchSimulation();
		}
	}

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

	/**
	 * Saves brain
	 */
	cleanUp(): void {

	}
}