import { writable } from 'svelte/store';
import type { NextGamePiece } from '$client/lib/GamePiece';

function createNextPiecesStore() {
	const { subscribe, update } = writable<NextGamePiece[][]>([[], []]);

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
