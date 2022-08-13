import { writable } from 'svelte/store';

const initial = 3; // 2:2D | 3:3D

function createDimensionStore() {
	const { subscribe, update, set } = writable(initial);

	return {
		subscribe,
		set_2D: () => {
			set(2);
		},
		set_3D: () => {
			set(3);
		},
		switch: () => {
			update((dimension) => (dimension === 3 ? 2 : 3));
		}
	};
}

export default createDimensionStore();
