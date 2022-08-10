import type GameBoard from './GameBoard';
import type GamePiece from './GamePiece';
import type { NextGamePiece } from './GamePiece';

export type GameState = {
	playerOne: {
		id: string;
		current: GamePiece | undefined;
		next: NextGamePiece[];
		board: GameBoard;
	};
	playerTwo?: {
		id: string;
		current: GamePiece | undefined;
		next: NextGamePiece[];
		board: GameBoard;
	};
};
export default GameState;

export type GameInitialState = {
	current: GamePiece | undefined;
	next: NextGamePiece[];
};
