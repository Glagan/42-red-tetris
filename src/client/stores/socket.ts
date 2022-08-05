import { writable } from 'svelte/store';

function createSocketStore() {
	const { subscribe, set } = writable('');

	return {
		subscribe,
		set
	};
}

export default createSocketStore();
