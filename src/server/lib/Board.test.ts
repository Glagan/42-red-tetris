import { cleanupWebSocketTestServer, setupWebSocketTestServer } from '$utils/test';
import Board, { COLUMNS, MoveDirection, RotationDirection, ROWS } from './Board';
import { TetrominoType } from '$shared/Tetromino';
import TetrominoI from './Tetrominoes/TetrominoI';
import TetrominoJ from './Tetrominoes/TetrominoJ';
import TetrominoL from './Tetrominoes/TetrominoL';
import TetrominoO from './Tetrominoes/TetrominoO';
import TetrominoS from './Tetrominoes/TetrominoS';
import TetrominoT from './Tetrominoes/TetrominoT';
import TetrominoZ from './Tetrominoes/TetrominoZ';

describe('Test Board', () => {
	const board = new Board();

	beforeAll(async () => {
		setupWebSocketTestServer();
	});

	afterAll(() => {
		cleanupWebSocketTestServer();
	});

	it('Has a valid default state', () => {
		expect(board.movingTetromino).toBeUndefined();
		expect(board.tetrominoes.length).toBe(0);
		expect(
			board.bitboard.every((row) => row.every((column) => column == TetrominoType.None))
		).toBeTruthy();
	});

	it('Can validate a line', () => {
		const board = new Board();
		board.bitboard.pop();

		board.bitboard.push(new Array(COLUMNS).fill(TetrominoType.I));
		expect(board.checkLine(ROWS - 1)).toBeTruthy();
		expect(board.checkLine(ROWS - 2)).toBeFalsy();

		board.bitboard[ROWS - 1][0] = TetrominoType.None;
		expect(board.checkLine(ROWS - 1)).toBeFalsy();
		expect(board.checkLine(ROWS - 2)).toBeFalsy();

		expect(board.checkLine(-1)).toBeFalsy();
		expect(board.checkLine(Infinity)).toBeFalsy();
	});

	it('Can remove a line', () => {
		const board = new Board();
		board.bitboard.pop();

		board.bitboard[ROWS - 2][0] = TetrominoType.I;
		board.bitboard.push(new Array(COLUMNS).fill(TetrominoType.I));
		board.removeLine(ROWS - 1);
		expect(board.bitboard.length).toBe(ROWS);
		expect(board.bitboard.every((row) => row.length == COLUMNS)).toBeTruthy();
		expect(board.bitboard[ROWS - 2][0]).toBe(TetrominoType.None);
		expect(board.bitboard[ROWS - 1][0]).toBe(TetrominoType.I);
	});

	it('Can clear completed lines', () => {
		const board = new Board();

		expect(board.clearAllCompletedLines()).toBe(0);

		board.bitboard.splice(0, 1);
		board.bitboard.push(new Array(COLUMNS).fill(TetrominoType.Blocked));
		expect(board.clearAllCompletedLines()).toBe(1);

		board.bitboard.splice(0, 2);
		board.bitboard.push(new Array(COLUMNS).fill(TetrominoType.Blocked));
		board.bitboard.push(new Array(COLUMNS).fill(TetrominoType.Blocked));
		expect(board.clearAllCompletedLines()).toBe(2);
	});

	it('Can clear completed a line in the middle of the board', () => {
		const board = new Board();

		expect(board.clearAllCompletedLines()).toBe(0);

		board.bitboard.splice(ROWS / 4, 1, new Array(COLUMNS).fill(TetrominoType.Blocked));
		expect(board.clearAllCompletedLines()).toBe(1);

		board.bitboard.splice(
			ROWS / 2,
			2,
			new Array(COLUMNS).fill(TetrominoType.Blocked),
			new Array(COLUMNS).fill(TetrominoType.Blocked)
		);
		expect(board.clearAllCompletedLines()).toBe(2);
	});

	it('Can spawn a tetromino on an empty board', () => {
		const board = new Board();
		const tetromino = new TetrominoI();
		Board.translateTetrominoToCenter(tetromino);
		expect(board.canSpawnTetromino(tetromino)).toBeTruthy();

		expect(board.movingTetromino).toBeUndefined();
		board.spawnTetromino(tetromino);
		expect(board.movingTetromino).toBe(tetromino);
		expect(
			board.bitboard.every((row) => row.every((column) => column == TetrominoType.None))
		).toBeTruthy();
	});

	it("Can't spawn a tetromino on an occupied space", () => {
		const board = new Board();
		const tetromino = new TetrominoI();
		board.setTetrominoOnBitboard(tetromino);

		const blockedTetromino = new TetrominoI();
		Board.translateTetrominoToCenter(blockedTetromino);
		blockedTetromino.offset[1] -= 1;
		expect(board.canSpawnTetromino(blockedTetromino)).toBeFalsy();
	});

	it('Correctly add a tetromino to the bitboard', () => {
		const board = new Board();
		const tetromino = new TetrominoI();

		expect(
			board.bitboard.every((row) => row.every((column) => column == TetrominoType.None))
		).toBeTruthy();
		board.spawnTetromino(tetromino);
		expect(board.bitboard[0].every((column) => column == TetrominoType.None)).toBeTruthy();
		board.setTetrominoOnBitboard(tetromino);
		const expectedRow = new Array(COLUMNS).fill(TetrominoType.None);
		for (let index = 0; index < 4; index++) {
			expectedRow[index] = TetrominoType.I;
		}
		expect(board.bitboard[0].every((column) => column == TetrominoType.None)).toBeTruthy();
		expect(board.bitboard[1]).toEqual(expectedRow);
		expect(board.bitboard[2].every((column) => column == TetrominoType.None)).toBeTruthy();
	});

	it('Can correctly attach the moving tetromino to the board', () => {
		const board = new Board();
		const tetrominoDown = new TetrominoI();
		tetrominoDown.offset[0] = ROWS - 2;
		board.spawnTetromino(tetrominoDown);
		expect(board.movingTetrominoIsTouching()).toBeTruthy();

		expect(tetrominoDown.locked).toBeFalsy();
		board.tickDown();
		expect(tetrominoDown.locked).toBeTruthy();
		board.tickDown();
		expect(board.movingTetromino).toBeUndefined();
		expect(board.tetrominoes.length).toBe(1);

		const expectedRow = new Array(COLUMNS).fill(TetrominoType.None);
		for (let index = 0; index < 4; index++) {
			expectedRow[index] = TetrominoType.I;
		}
		expect(board.bitboard[1].every((column) => column == TetrominoType.None)).toBeTruthy();
		expect(board.bitboard[ROWS - 1]).toEqual(expectedRow);
	});

	it('Can correctly identify a tetromino touching the bottom of the board', () => {
		let board = new Board();
		const tetromino = new TetrominoI();
		board.spawnTetromino(tetromino);
		expect(board.movingTetrominoIsTouching()).toBeFalsy();

		board = new Board();
		tetromino.offset[0] = ROWS - 3;
		board.spawnTetromino(tetromino);
		expect(board.movingTetrominoIsTouching()).toBeFalsy();

		board = new Board();
		tetromino.offset[0] = ROWS - 2;
		board.spawnTetromino(tetromino);
		expect(board.movingTetrominoIsTouching()).toBeTruthy();
	});

	it('Can correctly identify a tetromino touching another tetromino', () => {
		const board = new Board();
		const tetrominoDown = new TetrominoI();
		tetrominoDown.offset[0] = ROWS - 2;
		tetrominoDown.locked = true;
		board.spawnTetromino(tetrominoDown);
		expect(board.movingTetrominoIsTouching()).toBeTruthy();

		board.tickDown(); // Lock the down tetromino to the board
		const tetromino = new TetrominoI();
		board.spawnTetromino(tetromino);
		expect(board.movingTetrominoIsTouching()).toBeFalsy();

		tetromino.offset[0] = ROWS - 3;
		board.spawnTetromino(tetromino);
		expect(board.movingTetrominoIsTouching()).toBeTruthy();
	});

	it('Can move the current tetromino', () => {
		let board = new Board();
		expect(board.move(MoveDirection.Left)).toBeFalsy();
		expect(board.move(MoveDirection.Right)).toBeFalsy();
		let tetromino = new TetrominoI();
		board.spawnTetromino(tetromino);

		// Tied to the left
		expect(board.move(MoveDirection.Left)).toBeFalsy();
		expect(board.movingTetromino?.offset[1]).toBe(0);

		expect(board.move(MoveDirection.Right)).toBeTruthy();
		expect(board.movingTetromino?.offset[1]).toBe(1);

		expect(board.move(MoveDirection.Left)).toBeTruthy();
		expect(board.movingTetromino?.offset[1]).toBe(0);

		// Tied to the right
		board = new Board();
		tetromino = new TetrominoI();
		const originalOffset = COLUMNS - 4;
		tetromino.offset[1] = originalOffset;
		board.spawnTetromino(tetromino);

		expect(board.move(MoveDirection.Right)).toBeFalsy();
		expect(board.movingTetromino?.offset[1]).toBe(originalOffset);

		expect(board.move(MoveDirection.Left)).toBeTruthy();
		expect(board.movingTetromino?.offset[1]).toBe(originalOffset - 1);

		expect(board.move(MoveDirection.Right)).toBeTruthy();
		expect(board.movingTetromino?.offset[1]).toBe(originalOffset);
	});

	it('Can dash the current tetromino', () => {
		const board = new Board();
		expect(board.dash()).toBe(-1);

		const tetromino = new TetrominoI();
		board.spawnTetromino(tetromino);
		expect(board.dash()).toBe(0);
		expect(board.movingTetromino).toBeUndefined();
		expect(board.tetrominoes.length).toBe(1);

		expect(board.bitboard[1].every((column) => column == TetrominoType.None)).toBeTruthy();
		const expectedRow = new Array(COLUMNS).fill(TetrominoType.None);
		for (let index = 0; index < 4; index++) {
			expectedRow[index] = TetrominoType.I;
		}
		expect(board.bitboard[ROWS - 1]).toEqual(expectedRow);
	});

	it('Can rotate with wallkicks 1', () => {
		const board = new Board();
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeFalsy();
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeFalsy();

		const tetrominoes = [
			TetrominoI,
			TetrominoJ,
			TetrominoL,
			TetrominoO,
			TetrominoS,
			TetrominoT,
			TetrominoZ
		];
		for (const tetrominoClass of tetrominoes) {
			const board = new Board();
			const tetromino = new tetrominoClass();
			Board.translateTetrominoToCenter(tetromino);
			board.spawnTetromino(tetromino);
			expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
			expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
			expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
			expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
			expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
			expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
			expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
			expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
		}
	});

	it('Can rotate with wallkicks 2', () => {
		const board = new Board();
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeFalsy();
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeFalsy();

		const bottom = new TetrominoI();
		Board.translateTetrominoToCenter(bottom);
		bottom.offset[0] = 5;
		board.spawnTetromino(bottom);
		const top = new TetrominoI();
		Board.translateTetrominoToCenter(top);
		top.offset[0] = 4;
		board.spawnTetromino(top);

		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
		// console.log(board.repr());
	});

	it('Can rotate with wallkicks 3', () => {
		const board = new Board();
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeFalsy();
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeFalsy();

		const bottom = new TetrominoS();
		Board.translateTetrominoToCenter(bottom);
		bottom.offset[0] = 5;
		board.spawnTetromino(bottom);
		const top = new TetrominoS();
		Board.translateTetrominoToCenter(top);
		top.offset[0] = 5;
		top.offset[1] -= 2;
		board.spawnTetromino(top);

		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
		// console.log(board.repr());
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
		// console.log(board.repr());
	});

	it('Manage the next blocked line empty column', () => {
		const board = new Board();

		expect(board.emptyLineBlockedColumn).toBeUndefined();
		board.nextBlockedLineBlockedColumn();
		expect(board.emptyLineBlockedColumn).toBeTruthy();
		board.nextBlockedLineBlockedColumn();
		expect(board.emptyLineBlockedColumn).toBeTruthy();
	});

	it('Can generate blocked lines', () => {
		let board = new Board();

		expect(board.bitboard[ROWS - 1].every((column) => column == TetrominoType.None));

		board.generateBlockedLine(1);
		expect(board.bitboard[ROWS - 2].every((column) => column == TetrominoType.None));
		expect(
			board.bitboard[ROWS - 1].reduce((carry, isSet) => {
				if (isSet) carry += 1;
				return carry;
			}, 0)
		).toBe(COLUMNS - 1);

		board = new Board();
		board.generateBlockedLine(2);
		expect(board.bitboard[ROWS - 3].every((column) => column == TetrominoType.None));
		expect(
			board.bitboard[ROWS - 2].reduce((carry, isSet) => {
				if (isSet) carry += 1;
				return carry;
			}, 0)
		).toBe(COLUMNS - 1);
		expect(
			board.bitboard[ROWS - 1].reduce((carry, isSet) => {
				if (isSet) carry += 1;
				return carry;
			}, 0)
		).toBe(COLUMNS - 1);
	});

	it('Handle failure to rotate a tetromino', () => {
		const board = new Board();

		// Fill the board with blocks and clear only enough space for a tetromino with no space for arotation
		board.bitboard = [];
		for (let index = 0; index < ROWS; index++) {
			board.bitboard.push(new Array(COLUMNS).fill(TetrominoType.Blocked));
		}
		board.bitboard[1][0] = TetrominoType.None;
		board.bitboard[1][1] = TetrominoType.None;
		board.bitboard[1][2] = TetrominoType.None;
		board.bitboard[1][3] = TetrominoType.None;

		board.movingTetromino = new TetrominoI();
		board.setTetrominoOnBitboard(board.movingTetromino);
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeFalsy();
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeFalsy();
	});

	it('Can rotate a tetromino with wallkicks clockwise', () => {
		const board = new Board();

		const initialTetromino = new TetrominoI();
		board.movingTetromino = initialTetromino;
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
		board.setTetrominoOnBitboard(initialTetromino);

		// This will rotate the tetromino and apply the first wallkick it find
		let tetromino = new TetrominoI();
		board.movingTetromino = tetromino;
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
		tetromino = new TetrominoI();
		board.movingTetromino = tetromino;
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
	});

	it('Can rotate a tetromino with wallkicks counterclockwise', () => {
		const board = new Board();

		const initialTetromino = new TetrominoI();
		board.movingTetromino = initialTetromino;
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
		board.setTetrominoOnBitboard(initialTetromino);

		// This will rotate the tetromino and apply the first wallkick it find
		let tetromino = new TetrominoI();
		board.movingTetromino = tetromino;
		expect(board.rotateWithWallKicks(RotationDirection.CounterClockwise)).toBeTruthy();
		tetromino = new TetrominoI();
		board.movingTetromino = tetromino;
		expect(board.rotateWithWallKicks(RotationDirection.Clockwise)).toBeTruthy();
	});

	it('Can fix a tetromino position on spawn', () => {
		const board = new Board();

		const initialTetromino = new TetrominoI();
		expect(board.fixTetrominoPosition(initialTetromino)).toBeTruthy();
		board.setTetrominoOnBitboard(initialTetromino);

		// This will apply the last wallkick below the initial tetromino
		const tetromino = new TetrominoI();
		expect(board.fixTetrominoPosition(tetromino)).toBeTruthy();
	});
});
