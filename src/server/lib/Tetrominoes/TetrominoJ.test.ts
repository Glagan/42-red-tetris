import TetrominoJ from './TetrominoJ';

describe('Test Tetromino J', () => {
	it('Rotate Clockwise', () => {
		const tetromino = new TetrominoJ();

		// 0
		expect(tetromino.matrix).toEqual([
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0]
		]);

		// 1
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[0, 1, 1],
			[0, 1, 0],
			[0, 1, 0]
		]);

		// 2
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[0, 0, 0],
			[1, 1, 1],
			[0, 0, 1]
		]);

		// 3
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 0]
		]);

		// Reset
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0]
		]);
	});

	it('Rotate Counter Clockwise', () => {
		const tetromino = new TetrominoJ();

		// 0
		expect(tetromino.matrix).toEqual([
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0]
		]);

		// 1
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 0]
		]);

		// 2
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[0, 0, 0],
			[1, 1, 1],
			[0, 0, 1]
		]);

		// 3
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[0, 1, 1],
			[0, 1, 0],
			[0, 1, 0]
		]);

		// Reset
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0]
		]);
	});
});
