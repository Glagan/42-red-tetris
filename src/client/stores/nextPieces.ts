import { writable } from 'svelte/store';
import type { NextGamePiece } from '$client/lib/GamePiece';

function createNextPiecesStore() {
	const { subscribe, update } = writable<NextGamePiece[][]>([[], []]);

	return {
		subscribe,
		updateNextPieces: (player: number, pieces: NextGamePiece[]) =>
			update((nextPieces) => {
				nextPieces[player] = pieces;
				return nextPieces;
			})
	};
}

export default createNextPiecesStore();
