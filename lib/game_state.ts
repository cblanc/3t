import { chunkify, diagonals, randomElem, transpose } from "./utils";

const isX = (m: Move): boolean => m === 1;
const isO = (m: Move): boolean => m === 0;
const isNoMove = (m: Move): boolean => m === null;

const NO_POSSIBLE_MOVES = 3;

export type Position = number;

// A number which uniquely identifies and board and moves played
export type GameId = number;

/**
 * Translates move to string
 * @type {string}
 */
const toString = (m: Move): string => {
	if (m === 1) return "X";
	if (m === 0) return "O";

	return " ";
};

// Returns true if X occupies every POSITION
const xWins = (moves: Move[]): boolean => moves.every(isX);

// Returns true if O occupies every POSITION
const oWins = (moves: Move[]): boolean => moves.every(isO);

export type Move = 1 		 // Cross
			 			 	 	 | 0		 // Circle
								 | null; // No move

const EMPTY_POSITION: Position = 2;

export const newGame = (n: number): Move[] => new Array(n).fill(null);

export class GameState {
	public moves: Move[];

	constructor(moves: Move[]) {
		this.moves = moves.slice(0);
	}

	get gridLength(): number {
		return Math.sqrt(this.moves.length);
	}

	/**
	 * Returns row of moves from top to bottom
	 * @return {Move[]}
	 */
	get rows(): Move[][] {
		return chunkify(this.moves, this.gridLength);
	}

	/**
	 * Return columns of moves from left to right
	 * @return {Move[]}
	 */
	get columns(): Move[][] {
		return chunkify(transpose(this.moves), this.gridLength); 
	}

	/**
	 * Returns leading and trailing diagonals as tuple (in that order)
	 */
	get diagonals(): [Move[], Move[]] {
		return diagonals(this.moves);
	}

	/**
	 * It returns winner or null if no winner
	 * @return {Move}
	 */
	get winner(): Move {
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
	 * Returns true if game is complete
	 * @return {boolean}
	 */
	get complete(): boolean {
		return this.drawn || this.winner !== null;
	}

	/**
	 * Returns a unique number to represent moves
	 * Note that once grid size is sufficiently large,
	 * the set of integers available to javascript (2^53) will no 
	 * longer sufficient uniquely identify all possible boards
	 * 
	 * @return {number}
	 */
	get id(): GameId {
		return GameState.toId(this.moves);
	}

	/**
	 * Returns who moves next (X is first)
	 * Upon completed game, just returns the first mover
	 * @return {Move} 
	 */
	get nextMover(): Move {
		const noMoves = this.moves.filter(isNoMove);
		const x = this.moves.filter(isX);
		const o = this.moves.filter(isO);
		if (noMoves.length === 0) return null;

		return (o.length >= x.length) ? 1 : 0;
	}

	/**
	 * Applies a move to gamestate given mover and position
	 * Returns a new gamestate instance
	 * @param  {Move}      m        
	 * @param  {Position}    position 
	 * @return {GameState}          
	 */
	public applyMove(m: Move, pos: Position): GameState {
		const newMoves = this.moves.slice(0);
		newMoves[pos] = m;

		return new GameState(newMoves);
	}

	/**
	 * Applies a random move according to rules, returning gamestate
	 * Returns null if no valid next move available
	 * @return {GameState} 
	 */
	public applyRandomMove(): GameState|null {
		const { nextMover, availablePositions } = this;

		return this.applyMove(nextMover, randomElem(availablePositions));
	}

	/**
	 * Prints divider used in table printing
	 */
	get dividerString(): string {
		let rowDivider = "+";
		for (let i = 0; i < this.gridLength; i++) {
			rowDivider += "-+"
		}

		return `\n${rowDivider}\n`;
	}

	/**
	 * Returns a list of possible next states
	 * @return {GameState[]} [description]
	 */
	get possibleNextStates(): GameState[] {
		return this.availablePositions.map(pos => {
			return this.applyMove(this.nextMover, pos);
		});
	}

	/**
	 * Returns list of empty positions
	 * Returns empty positions list if
	 * - game is won or drawn
	 * - no further positions availble
	 * @return {number[]}
	 */
	get availablePositions(): Position[] {
		const availablePositions: Position[] = [];
		if (this.winner !== null) return availablePositions;
		this.moves.forEach((elem, i) => {
			if (elem === null) availablePositions.push(i);
		});

		return availablePositions;
	}

	/**
	 * Prints current state to console
	 */
	public print(): void {
		const table = this.rows.map(row => {
			const r = row.map(move => {
				if (move === null) return "";

				return toString(move);
			})
			.join("|");
			
			return `|${r}|`;
		}).join(this.dividerString);
		console.log(table);
	}

	/**
	 * Creates an empty gamestate
	 * @param  {number}    size
	 * @return {GameState}     
	 */
	static empty(size: number): GameState {
		const moves = new Array(size).fill(null);

		return new GameState(moves);
	}

	static toId(moves: Move[]): GameId {
		const id = moves
			.map(elem => {
				if (elem === null) return EMPTY_POSITION;

				return elem;
			})
			.join("");

		return parseInt(id, NO_POSSIBLE_MOVES);
	}

	/**
	 * Creates gamestate from gameId
	 * @param  {GameId}    id [description]
	 * @return {GameState}    [description]
	 */
	static fromId(id: GameId): GameState {
		const moves = id
			.toString(NO_POSSIBLE_MOVES) // Convert back to base 3 representation
			.split("")
			.map(n => parseInt(n, 10))
			.map(n => {
				if (n === EMPTY_POSITION) return null;

				return n;
			});
			
		return new GameState(moves as Move[]);
	}
}
