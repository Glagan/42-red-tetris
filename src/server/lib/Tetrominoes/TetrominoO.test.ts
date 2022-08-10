import Tetromino from './Tetromino';
import TetrominoO from './TetrominoO';

describe('Tetromino O', () => {
	it('Rotate Clockwise', () => {
		const tetromino = new TetrominoO();

		// 0
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(Tetromino.calculateBottom(tetromino.matrix));
		expect(tetromino.left).toEqual(Tetromino.calculateLeft(tetromino.matrix));
		expect(tetromino.right).toEqual(Tetromino.calculateRight(tetromino.matrix));

		// 1
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(Tetromino.calculateBottom(tetromino.matrix));
		expect(tetromino.left).toEqual(Tetromino.calculateLeft(tetromino.matrix));
		expect(tetromino.right).toEqual(Tetromino.calculateRight(tetromino.matrix));

		// 2
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(Tetromino.calculateBottom(tetromino.matrix));
		expect(tetromino.left).toEqual(Tetromino.calculateLeft(tetromino.matrix));
		expect(tetromino.right).toEqual(Tetromino.calculateRight(tetromino.matrix));

		// 3
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(Tetromino.calculateBottom(tetromino.matrix));
		expect(tetromino.left).toEqual(Tetromino.calculateLeft(tetromino.matrix));
		expect(tetromino.right).toEqual(Tetromino.calculateRight(tetromino.matrix));

		// Reset
		tetromino.rotateClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(Tetromino.calculateBottom(tetromino.matrix));
		expect(tetromino.left).toEqual(Tetromino.calculateLeft(tetromino.matrix));
		expect(tetromino.right).toEqual(Tetromino.calculateRight(tetromino.matrix));
	});

	it('Rotate Counter Clockwise', () => {
		const tetromino = new TetrominoO();

		// 0
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(Tetromino.calculateBottom(tetromino.matrix));
		expect(tetromino.left).toEqual(Tetromino.calculateLeft(tetromino.matrix));
		expect(tetromino.right).toEqual(Tetromino.calculateRight(tetromino.matrix));

		// 1
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(Tetromino.calculateBottom(tetromino.matrix));
		expect(tetromino.left).toEqual(Tetromino.calculateLeft(tetromino.matrix));
		expect(tetromino.right).toEqual(Tetromino.calculateRight(tetromino.matrix));

		// 2
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(Tetromino.calculateBottom(tetromino.matrix));
		expect(tetromino.left).toEqual(Tetromino.calculateLeft(tetromino.matrix));
		expect(tetromino.right).toEqual(Tetromino.calculateRight(tetromino.matrix));

		// 3
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(Tetromino.calculateBottom(tetromino.matrix));
		expect(tetromino.left).toEqual(Tetromino.calculateLeft(tetromino.matrix));
		expect(tetromino.right).toEqual(Tetromino.calculateRight(tetromino.matrix));

		// Reset
		tetromino.rotateCounterClockwise();
		expect(tetromino.matrix).toEqual([
			[1, 1],
			[1, 1]
		]);
		expect(tetromino.bottom).toEqual(Tetromino.calculateBottom(tetromino.matrix));
		expect(tetromino.left).toEqual(Tetromino.calculateLeft(tetromino.matrix));
		expect(tetromino.right).toEqual(Tetromino.calculateRight(tetromino.matrix));
	});
});
