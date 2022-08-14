import { writable } from 'svelte/store';

function createShadowStore() {
	const { subscribe, update, set } = writable<boolean>(true);

	return {
		subscribe,
		on: () => {
			set(true);
		},
		off: () => {
			set(true);
		},
		switch: () => {
			update((shadow) => !shadow);
		}
	};
}

export default createShadowStore();
