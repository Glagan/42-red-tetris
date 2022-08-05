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
}
export default new PlayerManager();
