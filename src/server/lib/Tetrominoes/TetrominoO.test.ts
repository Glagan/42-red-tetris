import type { Coordinates } from './Tetromino';
import type Tetromino from './Tetromino';
import TetrominoO from './TetrominoO';

describe('Test Tetromino O', () => {
	function calculateBottom(tetromino: Tetromino) {
		const coordinates: Coordinates[] = [];
		const N = tetromino.matrix.length;
		for (let m = 0; m < N; m++) {
			for (let n = N - 1; n >= 0; n--) {
				if (tetromino.matrix[n][m]) {
					coordinates.push([n, m]);
					break;
				}
			}
		}
		return coordinates;
	}

	it('Rotate Clockwise', () => {
		const tetromino = new TetrominoO();

		// 0
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(calculateBottom(tetromino));

		// 1
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(calculateBottom(tetromino));

		// 2
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(calculateBottom(tetromino));

		// 3
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(calculateBottom(tetromino));

		// Reset
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(calculateBottom(tetromino));
	});

	it('Rotate Counter Clockwise', () => {
		const tetromino = new TetrominoO();

		// 0
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(calculateBottom(tetromino));

		// 1
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(calculateBottom(tetromino));

		// 2
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(calculateBottom(tetromino));

		// 3
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(calculateBottom(tetromino));

		// Reset
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(calculateBottom(tetromino));
	});
});
