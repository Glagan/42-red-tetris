import { writable } from 'svelte/store';

function initial(): number[] {
	return [0, 0];
}

function createScoresStore() {
	const { subscribe, update, set } = writable(initial());

	return {
		subscribe,
		update: (player: 0 | 1, score: number) =>
			update((scores) => {
				scores[player] = score;
				return scores;
			}),
		clean: () => {
			set(initial());
		}
	};
}

export default createScoresStore();
