/**
 * Returns last elem of array
 * @type {[type]}
 */
export const tail = <T>(arr: T[]): T => arr[arr.length - 1];

/**
 * Breaks up array into chunks of `size`
 * @type {[type]}
 */
export const chunkify = <T>(arr: T[], size: number): T[][] => {
	return new Array(size)
		.fill(undefined)
		.map((_, i) => arr.slice(i * size, (i + 1) * size));
};

/**
 * Transposes an array which represents a 2d matrix
 * @type {[type]}
 */
export const transpose = <T>(arr: T[]): T[] => {
	const gridSize = Math.sqrt(arr.length);
	const result = arr.slice(0);
	for (let i = 0; i < gridSize; ++i) {
		for (let j = 0; j < gridSize; ++j) {
			result[(i * gridSize) + j] = arr[(j * gridSize) + i];
		}
	}

	return result;
};

export const diagonals = <T>(arr: T[]): [T[], T[]] => {
	const gridSize = Math.sqrt(arr.length);
	const rows = chunkify(arr, gridSize);
	const leadingDiagonal = rows.map((row, i) => row[i]);
	const trailingDiagonal = rows.reverse().map((row, i) => row[i]);
	
	return [leadingDiagonal, trailingDiagonal];
};

/**
 * Returns random int less than `n` and greater than 0
 * @type {[type]}
 */
const randomInt = (n: number): number => {
	return Math.floor(Math.random() * n);
};

/**
 * Picks random element in array
 * @type {[type]}
 */
export const randomElem = <T>(arr: T[]): T => {
	return arr[randomInt(arr.length)];
};


