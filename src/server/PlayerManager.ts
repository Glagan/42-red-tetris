import { DateTime } from 'luxon';
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

	getPlayer(token: string) {
		return this.players[token];
	}

	addPlayer(socketId: string, token: string, username?: string | null) {
		this.playersBySocket[socketId] = token;
		this.players[token] = new Player(username ?? 'Player');
		return this.players[token];
	}

	refreshPlayer(token: string) {
		const player = this.players[token];
		if (player) {
			player.lastUpdate = DateTime.now();
		}
	}

	removeSocket(socketId: string) {
		delete this.playersBySocket[socketId];
	}
}
export default new PlayerManager();
