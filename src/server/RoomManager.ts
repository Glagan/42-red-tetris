import type Player from '$server/lib/Player';
import type Room from '$server/lib/Room';
import WebSocket from '$server/lib/SocketIO';

export class RoomManager {
	rooms: Room[] = [];
	matchmaking: Player[] = [];

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
		WebSocket.server.emit('room:created', newRoom.toClient());
	}

	removeRoom(roomIdentifier: Room | string) {
		const index = this.rooms.findIndex(
			(room) => room === roomIdentifier || room.id === roomIdentifier
		);
		if (index >= 0) {
			// Avoid removing room that are in game
			// -- and cleanup players for room before removing it
			const room = this.rooms[index];
			if (room.isPlaying()) {
				return;
			}
			for (const player of room.players) {
				player.leaveCurrentRoom();
			}
			this.rooms.splice(index, 1);
			WebSocket.server.emit('room:deleted', room.id);
		}
	}

	playerIsInMatchmaking(playerId: string) {
		return this.matchmaking.findIndex((player) => player.id == playerId) >= 0;
	}

	findOpponent(playerId: string) {
		return this.matchmaking.find((player) => player.id != playerId);
	}

	addPlayerToMatchmaking(player: Player) {
		this.matchmaking.push(player);
	}

	removePlayerFromMatchmaking(playerId: string) {
		const index = this.matchmaking.findIndex((player) => player.id == playerId);
		if (index >= 0) {
			this.matchmaking.splice(index, 1);
			return true;
		}
		return false;
	}

	search(query: string) {
		const results: Room[] = [];
		for (const room of this.rooms) {
			if (room.matchAny(query)) {
				results.push(room);
				if (results.length >= 50) {
					break;
				}
			}
		}
	}
}
const manager = new RoomManager();
export default manager as RoomManager;
