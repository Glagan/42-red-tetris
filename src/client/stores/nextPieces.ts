import { writable } from 'svelte/store';
import type { NextGamePiece } from '../lib/GamePiece';

function createNextPiecesStore() {
	const { subscribe, update } = writable<Array<NextGamePiece[]>>([[], []]);

	return {
		subscribe,
		updateNextPieces: (player: number, pieces: NextGamePiece[]) =>
			update((next_pieces) => {
				next_pieces[player] = pieces;
				return next_pieces;
			})
	};
}

export default createNextPiecesStore();
