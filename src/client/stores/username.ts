import { writable } from 'svelte/store';

function createPseudoStore() {
	const { subscribe, set } = writable('');

	return {
		subscribe,
		set
	};
}

export default createPseudoStore();
