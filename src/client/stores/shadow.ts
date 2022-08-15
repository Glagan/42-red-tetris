import { browser } from '$app/env';
import { writable } from 'svelte/store';

const localStorageShadowKey = 'shadow';

function createShadowStore() {
	const { subscribe, update, set } = writable<boolean>(false);

	return {
		subscribe,
		on: () => {
			const newShadow = true;
			set(newShadow);
			localStorage.setItem(localStorageShadowKey, newShadow.toString());
		},
		off: () => {
			const newShadow = false;
			set(newShadow);
			localStorage.setItem(localStorageShadowKey, newShadow.toString());
		},
		switch: () => {
			update((shadow) => {
				const newShadow = !shadow;
				localStorage.setItem(localStorageShadowKey, newShadow.toString());
				return newShadow;
			});
		}
	};
}

const ShadowStore = createShadowStore();

function loadLocalStorage() {
	switch (localStorage.getItem(localStorageShadowKey)) {
		case true.toString():
			ShadowStore.on();
			break;
		case false.toString():
			ShadowStore.off();
			break;
	}
	return;
}

if (browser) loadLocalStorage();

export default ShadowStore;
