import { DateTime } from 'luxon';
import Player from '$server/lib/Player';

export class PlayerManager {
	// References to User given a token
	players: Record<string, Player> = {};
	// References to User token given a socket ID
	playersBySocket: Record<string, string> = {};

	exists(socketId: string) {
		return this.playersBySocket[socketId] !== undefined;
	}

	getPlayer(socketIdOrToken: string) {
		if (this.players[socketIdOrToken]) {
			return this.players[socketIdOrToken];
		}
		if (this.playersBySocket[socketIdOrToken]) {
			return this.players[this.playersBySocket[socketIdOrToken]];
		}
		return undefined;
	}

	addPlayer(socketId: string, token: string, username?: string | null) {
		this.playersBySocket[socketId] = token;
		this.players[token] = new Player(username ?? 'Player');
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
