import Cron from 'node-cron';
import Player from '$server/lib/Player';

export class PlayerManager {
	// References to User given a token
	players: Record<string, Player> = {};
	// References to User token given a socket ID
	playersBySocket: Record<string, string> = {};

	exists(socketIdOrToken: string) {
		return (
			this.players[socketIdOrToken] !== undefined ||
			this.playersBySocket[socketIdOrToken] !== undefined
		);
	}

	get(token: string) {
		return this.players[token];
	}

	add(socketId: string, token: string, username?: string | null): Player {
		this.playersBySocket[socketId] = token;
		this.players[token] = new Player(username ?? 'Player');
		return this.players[token];
	}

	removeSocket(socketId: string) {
		delete this.playersBySocket[socketId];
	}

	/**
	 * Remove players without sockets that aren't in a game
	 */
	cleanup() {
		const tokensInSockets = Object.values(this.playersBySocket);
		for (const token of Object.keys(this.players)) {
			if (tokensInSockets.indexOf(token) < 0) {
				const room = this.players[token].room;
				if (!room || !room.isPlaying()) {
					this.players[token].leaveCurrentRoom();
					delete this.players[token];
				}
			}
		}
	}
}
const manager = new PlayerManager();
export default manager as PlayerManager;

/* c8 ignore start */
Cron.schedule('*/5 * * * *', () => {
	console.log('Cleaning up players...');
	manager.cleanup();
});
/* c8 ignore end */
