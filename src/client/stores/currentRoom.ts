import type { Room } from '../../client/lib/Room';

import { writable } from 'svelte/store';

const initial: Room | null = null;

function createCurrentRoomStore() {
	const { subscribe, set } = writable(initial);

	return {
		subscribe,
		set,
		clean: () => {
			set(null);
		}
	};
}

export default createCurrentRoomStore();
