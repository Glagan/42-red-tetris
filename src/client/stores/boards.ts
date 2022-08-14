import { writable } from 'svelte/store';
import type { TetrominoType } from '$shared/Tetromino';
import type GameBoard from '$client/lib/GameBoard';

function initial(): TetrominoType[][][] {
	return [[], []];
}

function createBoardsStore() {
	const { subscribe, update, set } = writable(initial());

	return {
		subscribe,
		refreshBoard: (board: GameBoard) => {
			update((boards) => {
				boards[board.player] = board.board;
				return boards;
			});
		},
		clean: () => {
			set(initial());
		}
	};
}

export default createBoardsStore();
