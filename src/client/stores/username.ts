import { writable } from 'svelte/store';

function createUsernameStore() {
	const { subscribe, set } = writable('');

	return {
		subscribe,
		set: (username: string) => {
			set(username);
		}
	};
}

export default createUsernameStore();
