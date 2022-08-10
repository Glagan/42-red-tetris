import type { TetrominoType } from '$shared/Tetromino';

export type GamePiece = {
	player: number;
	x: number;
	y: number;
	type: TetrominoType;
	matrix: (0 | 1)[][];
};

export default GamePiece;

export type NextGamePiece = {
	type: TetrominoType;
	matrix: (0 | 1)[][];
};
