import { browser } from '$app/env';
import { writable } from 'svelte/store';

const localStorageThemeKey = '0';

function createThemeStore() {
	const { subscribe, set } = writable<number>(0);

	return {
		subscribe,
		set: (id: number) => {
			localStorage.setItem(localStorageThemeKey, id.toString());
			set(id);
		}
	};
}

const ThemeStore = createThemeStore();

function loadLocalStorage() {
	const theme = localStorage.getItem(localStorageThemeKey);

	if (theme && theme.length > 0) {
		ThemeStore.set(parseInt(theme));
	}
	return;
}

if (browser) loadLocalStorage();

export default ThemeStore;
