import { Simulation, SimulationOptions } from "../lib/simulation";
import { join } from "path";
import { Stopwatch } from "@cablanchard/stopwatch";

const options: SimulationOptions = {
	simulations: 100,
	size: 9,
};

const simulation = new Simulation(options);

// Load where last left off
const inputFile = join(__dirname, "../output.json");
if (inputFile) simulation.load(inputFile);

simulation.run();

simulation.save("./output.json");
