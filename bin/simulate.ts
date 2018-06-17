import { Simulation, SimulationOptions } from "../lib/simulation";
import { join } from "path";
import { Stopwatch } from "@cablanchard/stopwatch";

const MEMORY_PATH = join(__dirname, "../memory");

const s = Stopwatch();

const options: SimulationOptions = {
	simulations: 100,
	size: 9,
};

const simulation = new Simulation(options);

// Load where last left off
const inputFile = join(MEMORY_PATH, "output.json");
if (inputFile) simulation.load(inputFile);

const outputFile = inputFile;

console.log("Starting Simulation");
console.table({ "Memory File": inputFile, "New Memory File": outputFile, ...options });

simulation.run();

console.log(`Completed simulation in ${s.split("s")}s`);

simulation.save(outputFile);

console.log(`Saved output to ${outputFile}`);
