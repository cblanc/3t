/**
 * Runs a series of 3t simulations
 * - `n` number of simulations, defaults to 1000
 * - `i` name of input file, defaults to `output`
 * - `o` name of output file, defaults to `output`
 */

import { Simulation, SimulationOptions } from "../lib/simulation";
import { join } from "path";
import { Stopwatch } from "@cablanchard/stopwatch";
import parseArgs from "minimist";

// Setup
const argv = parseArgs(process.argv.slice(2));
const MEMORY_PATH = join(__dirname, "../memory");
const s = Stopwatch();
const inputFile = join(MEMORY_PATH, `${argv.i || "output"}.json`);
const outputFile = join(MEMORY_PATH, `${argv.o || "output"}.json`);
const options: SimulationOptions = {
	simulations: parseInt(argv.n, 10) || 100,
	size: 9,
};

console.log("Starting Simulation");
console.table({ "Memory File": inputFile, "New Memory File": outputFile, ...options });

// Start Simulation
const simulation = new Simulation(options);
simulation.load(inputFile);
simulation.run();
console.log(`Completed simulation in ${s.split("s")}s`);
simulation.save(outputFile);
console.log(`Saved output to ${outputFile}`);
