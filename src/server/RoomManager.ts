import type Room from '$server/lib/Room';

export class RoomManager {
	rooms: Room[] = [];

	all() {
		return this.rooms.map((room) => room.toClient());
	}

	getRoom(roomIdentifier: Room | string) {
		return this.rooms.find((room) => room === roomIdentifier || room.id === roomIdentifier);
	}

	addRoom(newRoom: Room) {
		const index = this.rooms.findIndex((room) => room.id === newRoom.id);
		if (index < 0) {
			this.rooms.push(newRoom);
		}
	}

	removeRoom(roomIdentifier: Room | string) {
		const index = this.rooms.findIndex(
			(room) => room === roomIdentifier || room.id === roomIdentifier
		);
		if (index >= 0) {
			this.rooms.splice(index, 1);
		}
	}
}
export default new RoomManager();
