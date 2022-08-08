import Cron from 'node-cron';
import Player from '$server/lib/Player';
import RoomManager from './RoomManager';
import ioServer from './lib/SocketIO';

export class PlayerManager {
	// References to User given a token
	players: Record<string, Player> = {};

	exists(token: string) {
		return this.players[token] !== undefined;
	}

	get(token: string) {
		return this.players[token];
	}

	add(token: string, username?: string | null): Player {
		this.players[token] = new Player(username ?? 'Player');
		return this.players[token];
	}

	/**
	 * Remove players without sockets that aren't in a game
	 */
	cleanup() {
		for (const token of Object.keys(this.players)) {
			const player = this.players[token];
			if (!player.socket) {
				const room = this.players[token].room;
				if (!room || !room.isPlaying()) {
					const previousRoom = this.players[token].leaveCurrentRoom();
					delete this.players[token];
					// Cleanup room
					if (previousRoom) {
						if (previousRoom.isEmpty()) {
							RoomManager.removeRoom(previousRoom.id);
							ioServer.emit('room:deleted', previousRoom.id);
						} else {
							ioServer.emit('room:playerLeft', player.toClient(), previousRoom.toClient());
						}
					}
				}
			}
		}
	}
}
const manager = new PlayerManager();
export default manager as PlayerManager;

/* c8 ignore start */
Cron.schedule('*/1 * * * *', () => {
	console.log('Cleaning up players...');
	manager.cleanup();
});
/* c8 ignore end */
