import type Room from '$lib/Room';
import { writable } from 'svelte/store';

function createStore() {
	const rooms: Room[] = [];
	const { set, subscribe, update } = writable<Room[]>(rooms);

	return {
		set,
		subscribe,
		update,
		addRoom(newRoom: Room) {
			const index = rooms.findIndex((room) => room.id === newRoom.id);
			if (index < 0) {
				rooms.push(newRoom);
				set(rooms);
			}
		},
		removeRoom(roomIdentifier: Room | string) {
			const index = rooms.findIndex(
				(room) => room === roomIdentifier || room.id === roomIdentifier
			);
			if (index >= 0) {
				rooms.splice(index, 1);
				set(rooms);
			}
		}
	};
}

const rooms = createStore();
export default rooms;
