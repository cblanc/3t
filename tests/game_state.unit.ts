import { assert } from "chai";
import { tail } from "../lib/utils";
import { GameState, newGame, move } from "../lib/game_state";

describe("newGame", () => {
	it ("instantiates a list of no moves", () => {
		const moves = newGame(9);
		assert.equal(moves.length, 9);
		moves.forEach(assert.isNull.bind(assert));
	});
});

describe("GameState", () => {
	let gameState: GameState;
	let moves: move[];

	beforeEach(() => {
		moves = newGame(9);
		gameState = new GameState(moves);
	});

	describe("new", () => {
		it ("instantiates a copy of board", () => {
			gameState.moves.forEach(assert.isNull.bind(assert));
			assert.notEqual(gameState.moves, moves);
		});
		
		it ("assigns grid length as sqrt of size", () => {
			assert.equal(gameState.gridLength, 3);
		});
	});

	describe("rows", () => {
		it ("returns rows", () => {
			gameState.moves = [0,0,0,1,1,1,0,0,0];
			const [first, second, third] = gameState.rows;
			assert.deepEqual(first, [0,0,0]);
			assert.deepEqual(second, [1,1,1]);
			assert.deepEqual(third, [0,0,0]);
		});
	});

	describe("columns", () => {
		it ("returns columns", () => {
			gameState.moves = [0,0,0,1,1,1,0,0,0];
			const [first, second, third] = gameState.columns;
			assert.deepEqual(first, [0,1,0]);
			assert.deepEqual(second, [0,1,0]);
			assert.deepEqual(third, [0,1,0]);
		});
	});

	describe("winner", () => {
		it ("returns 1 if X has winning moves", () => {
			gameState.moves[0] = gameState.moves[1] = gameState.moves[2] = 1;
			assert.equal(gameState.winner, 1);
		});
		it ("returns 0 if O has winning moves", () => {
			gameState.moves[0] = gameState.moves[1] = gameState.moves[2] = 0;
			assert.equal(gameState.winner, 0);
		});
		it ("returns null if no winner", () => {
			assert.isNull(gameState.winner);
		});
	});

	describe("applyMove", () => {
		it ("applies move and returns new game state", () => {
			const newState = gameState.applyMove(1, 0);
			assert.notEqual(newState, gameState);
			assert.equal(newState.moves[0], 1);
		});
	});

	describe("isDrawn", () => {
		describe("when complete board", () => {
			it ("returns true if drawn", () => {
				gameState.moves = [
					1,1,0,
					0,0,1,
					1,1,0,
				];
				assert.isTrue(gameState.drawn);
			});
			it ("returns false if winner", () => {
				gameState.moves = [
					1,1,1,
					1,0,0,
					0,1,0,
				];
				assert.isFalse(gameState.drawn);
			});
		});
		describe("when board is incomplete", () => {
			it ("returns false if no winner", () => {
				gameState.moves = [
					1,1,0,
					null,null,null,
					null,null,null,
				];
				assert.isFalse(gameState.drawn);
			});
			it ("returns false if winner", () => {
				gameState.moves = [
					1,1,1,
					0,0,null,
					null,null,null,
				];
				assert.isFalse(gameState.drawn);
			});
		});
	});

	describe("id", () => {
		it ("returns a number identifying game state", () => {
			gameState.moves = [
				null,1,0,
				0,0,1,
				1,1,0,
			];
			assert.isNumber(gameState.id);
			assert.isTrue(gameState.id > 0);
		});
	});

	describe("nextMover", () => {
		it ("returns the next mover", () => {
			const gameStates = [gameState];
			assert.equal(tail(gameStates).nextMover, 1);
			gameStates.push(gameState.applyMove(1, 0));
			assert.equal(tail(gameStates).nextMover, 0);
			gameStates.push(gameState.applyMove(0, 1));
			assert.equal(tail(gameStates).nextMover, 1);
		});
		it ("returns null when no moves left", () => {
			gameState.moves = [
				1,1,0,
				0,0,1,
				1,1,0,
			];
			assert.isNull(gameState.nextMover);
		});
	});

	describe("applyRandomMove", () => {
		it ("applies a random move", () => {
			assert.isTrue(gameState.moves.every(move => move === null));
			const lastGame = gameState.applyRandomMove();
			if (lastGame === null) throw new Error("Bad game state");
			assert.isFalse(lastGame.moves.every(move => move === null));
			assert.equal(lastGame.moves.filter(move => move === 1).length, 1);
		});

		it ("returns null if game is drawn", () => {
			gameState.moves = [
				1,1,0,
				0,0,1,
				1,1,0,
			];
			assert.isNull(gameState.applyRandomMove());
		});

		it ("returns null if winner", () => {
			gameState.moves = [
				1,1,1,
				0,0,1,
				1,1,0,
			];
			assert.isNull(gameState.applyRandomMove());
		});
	});
});
