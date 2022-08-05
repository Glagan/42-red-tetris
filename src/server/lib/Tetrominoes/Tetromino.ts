export type Matrix = number[][];

export type Coordinates = [number, number];
export type TouchCoordinates = Coordinates[][];
export type DirectionWallkicks = [
	[Coordinates, Coordinates, Coordinates, Coordinates],
	[Coordinates, Coordinates, Coordinates, Coordinates]
];
export type Wallkicks = [
	DirectionWallkicks,
	DirectionWallkicks,
	DirectionWallkicks,
	DirectionWallkicks
];

export enum TetrominoType {
	None,
	I,
	J,
	L,
	O,
	S,
	T,
	Z
}

/**
 * Shared wallkicks for the J, L, T, S and Z tetrominoes
 * @returns Wallkicks
 */
export function JLTSZWallkicks(): Wallkicks {
	return [
		[
			[
				[-1, 0],
				[-1, 1],
				[0, -2],
				[-1, -2]
			],
			[
				[1, 0],
				[1, 1],
				[0, -2],
				[1, -2]
			]
		],
		[
			[
				[1, 0],
				[1, -1],
				[0, 2],
				[1, 2]
			],
			[
				[1, 0],
				[1, -1],
				[0, 2],
				[1, 2]
			]
		],
		[
			[
				[1, 0],
				[1, 1],
				[0, -2],
				[1, -2]
			],
			[
				[-1, 0],
				[-1, 1],
				[0, -2],
				[-1, -2]
			]
		],
		[
			[
				[-1, 0],
				[-1, -1],
				[0, 2],
				[-1, 2]
			],
			[
				[-1, 0],
				[-1, -1],
				[0, 2],
				[-1, 2]
			]
		]
	];
}

export function GenerateTetromino<C extends typeof Tetromino>(inherit: C) {
	inherit.bottomCoordinates = (() => {
		const coordinates: TouchCoordinates = [[], [], [], []];
		/// @ts-expect-error inherit is not abstract
		const tetromino = new inherit();
		for (let direction = 0; direction < 4; direction++) {
			coordinates[direction] = Tetromino.calculateBottom(tetromino.matrix);
			tetromino.rotateClockwise();
		}
		return coordinates;
	})();

	inherit.leftCoordinates = (() => {
		const coordinates: TouchCoordinates = [[], [], [], []];
		/// @ts-expect-error inherit is not abstract
		const tetromino = new inherit();
		for (let direction = 0; direction < 4; direction++) {
			coordinates[direction] = Tetromino.calculateLeft(tetromino.matrix);
			tetromino.rotateClockwise();
		}
		return coordinates;
	})();

	inherit.rightCoordinates = (() => {
		const coordinates: TouchCoordinates = [[], [], [], []];
		/// @ts-expect-error inherit is not abstract
		const tetromino = new inherit();
		for (let direction = 0; direction < 4; direction++) {
			coordinates[direction] = Tetromino.calculateRight(tetromino.matrix);
			tetromino.rotateClockwise();
		}
		return coordinates;
	})();

	inherit.blockCoordinates = (() => {
		const coordinates: TouchCoordinates = [];
		/// @ts-expect-error inherit is not abstract
		const tetromino = new inherit();
		const N = tetromino.matrix.length;
		for (let direction = 0; direction < 4; direction++) {
			const directionCoordinates: Coordinates[] = [];
			for (let n = 0; n < N; n++) {
				for (let m = 0; m < N; m++) {
					if (tetromino.matrix[n][m]) {
						directionCoordinates.push([n, m]);
					}
				}
			}
			coordinates.push(directionCoordinates);
			tetromino.rotateClockwise();
		}
		return coordinates;
	})();
}

export default abstract class Tetromino {
	offset: Coordinates;
	type: TetrominoType;
	matrix: Matrix;
	direction: number;
	// Flag for the next tickDown to set the tetromino to the bitboard
	locked: boolean;

	// Array indexed [direction][] list of coordinates for each directions that represent the bottom of the piece in the matrix
	static bottomCoordinates: TouchCoordinates = [[], [], [], []];
	static rightCoordinates: TouchCoordinates = [[], [], [], []];
	static leftCoordinates: TouchCoordinates = [[], [], [], []];
	static blockCoordinates: TouchCoordinates = [[], [], [], []];
	// Array indexed [initialDirection][Clockwise/Counter-clockwise][] with the last dimension being an array of offset for the attempts
	static wallKicks: Wallkicks | undefined = undefined;

	/**
	 * Calculate the coordinates of the blocks that are the furthest down in the matrix
	 * @param matrix
	 */
	static calculateBottom(matrix: Matrix) {
		const coordinates: Coordinates[] = [];
		const N = matrix.length;
		for (let m = 0; m < N; m++) {
			for (let n = N - 1; n >= 0; n--) {
				if (matrix[n][m]) {
					coordinates.push([n, m]);
					break;
				}
			}
		}
		return coordinates;
	}

	/**
	 * Calculate the coordinates of the blocks that are the furthest left in the matrix
	 * @param matrix
	 */
	static calculateLeft(matrix: Matrix) {
		const coordinates: Coordinates[] = [];
		const N = matrix.length;
		for (let m = 0; m < N; m++) {
			for (let n = 0; n < N; n++) {
				if (matrix[n][m]) {
					coordinates.push([n, m]);
					break;
				}
			}
		}
		return coordinates;
	}

	/**
	 * Calculate the coordinates of the blocks that are the furthest right in the matrix
	 * @param matrix
	 */
	static calculateRight(matrix: Matrix) {
		const coordinates: Coordinates[] = [];
		const N = matrix.length;
		for (let m = N - 1; m >= 0; m--) {
			for (let n = 0; n < N; n++) {
				if (matrix[n][m]) {
					coordinates.push([n, m]);
					break;
				}
			}
		}
		return coordinates;
	}

	constructor(type: TetrominoType, matrix: Matrix) {
		this.offset = [0, 0];
		this.matrix = matrix;
		this.direction = 0;
		this.type = type;
		this.locked = false;
	}

	translate(coordinates: Coordinates) {
		this.offset[0] += coordinates[0];
		this.offset[1] += coordinates[1];
	}

	rotateClockwise() {
		// Swap rows
		this.matrix.reverse();
		// Transpose
		// All matrices are square
		const N = this.matrix.length;
		for (let n = 0; n < N; n++) {
			for (let m = n; m < N; m++) {
				const tmp = this.matrix[n][m];
				this.matrix[n][m] = this.matrix[m][n];
				this.matrix[m][n] = tmp;
			}
		}
		this.direction = (this.direction + 1) % 4;
	}

	rotateCounterClockwise() {
		// Transpose
		// All matrices are square
		const N = this.matrix.length;
		for (let n = 0; n < N; n++) {
			for (let m = n; m < N; m++) {
				const tmp = this.matrix[n][m];
				this.matrix[n][m] = this.matrix[m][n];
				this.matrix[m][n] = tmp;
			}
		}
		// Swap rows
		this.matrix.reverse();
		this.direction -= 1;
		if (this.direction < 0) {
			this.direction = 3;
		}
	}

	get bottom() {
		// Access instance static variable
		return (this.constructor as typeof Tetromino).bottomCoordinates[this.direction];
	}

	get left() {
		// Access instance static variable
		return (this.constructor as typeof Tetromino).leftCoordinates[this.direction];
	}

	get right() {
		// Access instance static variable
		return (this.constructor as typeof Tetromino).rightCoordinates[this.direction];
	}

	get blocks() {
		// Access instance static variable
		return (this.constructor as typeof Tetromino).blockCoordinates[this.direction];
	}

	get wallKicksInDirection() {
		// Access instance static variable
		return (this.constructor as typeof Tetromino).wallKicks?.[this.direction];
	}
}
