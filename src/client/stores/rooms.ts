import { writable } from 'svelte/store';
import type Room from '$client/lib/Room';

function createRoomsStore() {
	const { subscribe, update, set } = writable<Room[]>([]);

	return {
		subscribe,
		removeRoom: (roomId: string) => {
			update((rooms) => rooms.filter((room) => room.id != roomId));
		},
		addRoom: (room: Room) => {
			update((rooms) => [...rooms, room]);
		},
		updateRoom: (room: Room) => {
			update((rooms) =>
				rooms.map((existingRoom) => (existingRoom.id === room.id ? room : existingRoom))
			);
		},
		set
	};
}

export default createRoomsStore();
