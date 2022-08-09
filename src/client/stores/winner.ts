import { writable } from 'svelte/store';

function createWinnerStore() {
	const { subscribe, set } = writable<-1 | 0 | 1>(0);

	return {
		subscribe,
		set,
		remove: () => {
			set(-1);
		}
	};
}

export default createWinnerStore();
