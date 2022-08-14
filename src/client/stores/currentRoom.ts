import { writable } from 'svelte/store';
import type { Room } from '$client/lib/Room';

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
