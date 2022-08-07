import type { Room } from '../../client/lib/Room';
import type { Player } from '../../client/lib/Player';

import { writable } from 'svelte/store';

const initial: Room | null = null;

function createUsernameStore() {
	const { subscribe, update, set } = writable(initial);

	return {
		subscribe,
		add_player: (player: Player) => {
			update((room) => {
				room?.players.push(player);
				return room;
			});
		},
		set
	};
}

export default createUsernameStore();
