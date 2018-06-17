/**
 * Predicts outcomes based of state of play
 * - `m` moves
 * - `i` name of input file, defaults to `output`
 */

import { Brain } from "../lib/brain";
import { GameState, EMPTY_POSITION, Move } from "../lib/game_state";
import { join } from "path";
import parseArgs from "minimist";

// Setup
const argv = parseArgs(process.argv.slice(2));
const MEMORY_PATH = join(__dirname, "../memory");
const inputFile = join(MEMORY_PATH, `${argv.i || "output"}.json`);

const gameSetup = argv.m.split(",") as string[];

if (gameSetup.length !== 9) {
	throw new Error("Please enter valid gamestate. E.g. `npm run predict -- -m '0,1,,,0,,1,,' `");
}
const moves = gameSetup
	.map(s => parseInt(s, 10))
	.map(n => {
		if (isNaN(n)) return null;

		return n;
	});

console.log("Loading memory");
const brain = new Brain();
brain.load(inputFile);

const gameState = new GameState(moves as Move[]);

console.log(`Predicting gamestate for game:\n${gameState.print()}`);

console.table(brain.predict(gameState.id));
