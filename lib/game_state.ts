import { chunkify, diagonals, transpose } from "./utils";

const isX = (m: move): boolean => m === 1;
const isO = (m: move): boolean => m === 0;

// Returns true if X occupies every cell
const xWins = (moves: move[]): boolean => moves.every(isX);

// Returns true if O occupies every cell
const oWins = (moves: move[]): boolean => moves.every(isO);

export type move = 1 				 // Cross
			 			 	 	 | 0					 // Circle
								 | null; // No move

export const newGame = (n: number): move[] => new Array(n).fill(null);

export class GameState {
	public moves: move[];

	constructor(moves: move[]) {
		this.moves = moves.slice(0);
	}

	get gridLength(): number {
		return Math.sqrt(this.moves.length);
	}

	/**
	 * Returns row of moves from top to bottom
	 * @return {move[]}
	 */
	get rows(): move[][] {
		return chunkify(this.moves, this.gridLength);
	}

	/**
	 * Return columns of moves from left to right
	 * @return {move[]}
	 */
	get columns(): move[][] {
		return chunkify(transpose(this.moves), this.gridLength); 
	}

	/**
	 * Returns leading and trailing diagonals as tuple (in that order)
	 */
	get diagonals(): [move[], move[]] {
		return diagonals(this.moves);
	}

	/**
	 * It returns winner or null if no winner
	 * @return {move}
	 */
	get winner(): move {
		const cases = [...this.rows, ...this.columns, ...this.diagonals];
		if (cases.some(xWins)) return 1;
		if (cases.some(oWins)) return 0;

		return null;
	}

	public applyMove(m: move, position: number): GameState {
		const newMoves = this.moves.slice(0);
		newMoves[position] = m;

		return new GameState(newMoves);
	}
}
