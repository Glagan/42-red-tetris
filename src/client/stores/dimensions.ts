import { browser } from '$app/env';
import { writable } from 'svelte/store';

const initial = 3; // 2:2D | 3:3D

const localStorageDimensionsKey = 'dimensions';

function createDimensionStore() {
	const { subscribe, update, set } = writable(initial);

	return {
		subscribe,
		set2D: () => {
			set(2);
			localStorage.setItem(localStorageDimensionsKey, '2');
		},
		set3D: () => {
			set(3);
			localStorage.setItem(localStorageDimensionsKey, '3');
		},
		switch: () => {
			update((dimensions) => {
				const new_dimensions = dimensions === 3 ? 2 : 3;
				localStorage.setItem(localStorageDimensionsKey, new_dimensions.toString());
				return new_dimensions;
			});
		}
	};
}

const DimensionStore = createDimensionStore();

function loadLocalStorage() {
	switch (localStorage.getItem(localStorageDimensionsKey)) {
		case '2':
			DimensionStore.set2D();
			break;
		case '3':
			DimensionStore.set3D();
			break;
	}
	return;
}

if (browser) loadLocalStorage();

export default DimensionStore;
