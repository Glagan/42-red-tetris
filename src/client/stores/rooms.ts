import type Room from '$client/lib/Room';
import { writable } from 'svelte/store';

function createRoomsStore() {
	const { subscribe, update, set } = writable<Room[]>([]);

	return {
		subscribe,
		removeRoom: (room_id: string) => {
			update((rooms) => rooms.filter((room) => room.id != room_id));
		},
		addRoom: (room: Room) => {
			update((rooms) => [...rooms, room]);
		},
		updateRoom: (room: Room) => {
			update((rooms) => rooms.map((_room) => (_room.id === room.id ? room : _room)));
		},
		set
	};
}

export default createRoomsStore();
