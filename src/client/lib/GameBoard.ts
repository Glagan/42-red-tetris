import type { TetrominoType } from '$shared/Tetromino';

export type GameBoard = {
	player: number;
	level: number;
	score: number;
	board: TetrominoType[][];
	touched: boolean;
	tetris: boolean;
	blockedLine: boolean;
};
export default GameBoard;
