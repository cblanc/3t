import { chunkify, diagonals, randomElem, transpose } from "./utils";

const isX = (m: move): boolean => m === 1;
const isO = (m: move): boolean => m === 0;
const isNoMove = (m: move): boolean => m === null;

// Returns true if X occupies every cell
const xWins = (moves: move[]): boolean => moves.every(isX);

// Returns true if O occupies every cell
const oWins = (moves: move[]): boolean => moves.every(isO);

export type move = 1 		 // Cross
			 			 	 	 | 0		 // Circle
								 | null; // No move

const EMPTY_CELL = 2;

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

	/**
	 * Returns true if game is drawn
	 * @return {boolean} 
	 */
	get drawn(): boolean {
		if (this.winner !== null) return false;
		if (this.moves.some(isNoMove)) return false;

		return true;
	}

	/**
	 * Returns a unique number to represent moves
	 * Note that once grid size is sufficiently large,
	 * the set of integers available to javascript (2^53) will no 
	 * longer sufficient uniquely identify all possible boards
	 * 
	 * @return {number}
	 */
	get id(): number {

		return parseInt(
			this.moves
				.map(elem => {
					if (elem === null) return EMPTY_CELL;
					
					return elem;
				})
				.join("")
		, 3);
	}

	/**
	 * Returns who moves next (X is first)
	 * Upon completed game, just returns the first mover
	 * @return {move} 
	 */
	get nextMover(): move {
		const noMoves = this.moves.filter(isNoMove);
		const x = this.moves.filter(isX);
		const o = this.moves.filter(isO);
		if (noMoves.length === 0) return null;

		return (o.length >= x.length) ? 1 : 0;
	}

	/**
	 * Applies a move to gamestate given mover and position
	 * Returns a new gamestate instance
	 * @param  {move}      m        
	 * @param  {number}    position 
	 * @return {GameState}          
	 */
	public applyMove(m: move, position: number): GameState {
		const newMoves = this.moves.slice(0);
		newMoves[position] = m;

		return new GameState(newMoves);
	}

	/**
	 * Applies a random move according to rules, returning gamestate
	 * Returns null if no valid next move available
	 * @return {GameState} 
	 */
	public applyRandomMove(): GameState|null {
		if (this.winner !== null) return null;
		const availableMoves: number[] = [];
		this.moves.forEach((elem, i) => {
			if (elem === null) availableMoves.push(i);
		});
		if (availableMoves.length === 0) return null;
		const nextMove = randomElem(availableMoves);

		return this.applyMove(this.nextMover, nextMove);
	}
}
