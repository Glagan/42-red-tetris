import { writable } from 'svelte/store';
import sleep from '$utils/sleep';

const initial = -1;
let updates = 0;

// 1 and more: startIn
// 0: start now
// -1: no game waiting

function createGameStartStore() {
	const { subscribe, set } = writable(initial);

	return {
		subscribe,
		startIn: async (duration: number) => {
			set(duration);
			const local_updates = ++updates;
			for (;;) {
				await sleep(1000);
				if (local_updates === updates && duration > 0) {
					set(--duration);
				} else {
					break;
				}
			}
		},
		start: () => {
			set(0);
		},
		remove: () => {
			set(-1);
		}
	};
}

export default createGameStartStore();
