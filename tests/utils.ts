import { assert } from "chai";
import { tail, chunkify, transpose, diagonals } from "../lib/utils";

describe("Utils", () => {
	describe("tail", () => {
		it ("returns last element of array", () => {
			assert.equal(tail([1,2,3]), 3);
			assert.deepEqual(tail([[1],[2],[3]]), [3]);
		});
	});

	describe("chunkify", () => {
		it ("breaks up array into chunks of size", () => {
			const [first, second, third] = chunkify([0,1,2,3,4,5,6,7,8], 3);
			assert.deepEqual(first, [0,1,2]);
			assert.deepEqual(second, [3,4,5]);
			assert.deepEqual(third, [6,7,8]);
		});
	});

	describe("transpose", () => {
		it ("transposes a 2d matrix represented as an array", () => {
			const matrix = [
				0,1,2,
				3,4,5,
				6,7,8,
			];
			assert.deepEqual(transpose(matrix), [
				0,3,6,
				1,4,7,
				2,5,8,
			]);
		});
	});

	describe("diagonals", () => {
		it ("returns diagonals of 2d matrix represented as an array", () => {
			const matrix = [
				0,1,2,
				3,4,5,
				6,7,8,
			];
			assert.deepEqual(diagonals(matrix), [[0,4,8], [6,4,2]]);
		});
	});
});
