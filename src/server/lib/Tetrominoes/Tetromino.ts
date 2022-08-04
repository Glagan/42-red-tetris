export type Matrix = number[][];

export type Coordinates = [number, number];

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

export default abstract class Tetromino {
	offset: Coordinates;
	type: TetrominoType;
	matrix: Matrix;
	bottomCoordinates: Coordinates[][];
	direction: number;
	locked: boolean;

	constructor(type: TetrominoType, matrix: Matrix, bottomCoordinates: Coordinates[][]) {
		this.offset = [0, 0];
		this.matrix = matrix;
		this.bottomCoordinates = bottomCoordinates;
		this.direction = 0;
		this.type = type;
		this.locked = false;
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
		return this.bottomCoordinates[this.direction];
	}

	/*print() {
		let repr = '';
		for (const row of this.matrix) {
			for (const column of row) {
				if (column) {
					repr += '1';
				} else {
					repr += ' ';
				}
			}
			repr += '\n';
		}
		console.log(repr);
	}*/
}
