import type { ClientToServerEvents, TypedSocket } from '../../socket';
import { MoveDirection, RotationDirection } from '$server/lib/Board';

export default function useGameAPI(socket: TypedSocket) {
	const gameMoveLeft: ClientToServerEvents['game:move:left'] = (callback) => {
		if (!socket.data.player) {
			if (callback) callback(false);
			return;
		}

		const room = socket.data.player.room;
		if (room && room.game && !room.game.paused) {
			const index = room.playersIndex[socket.data.player.id];
			const ok = room.game.move(index, MoveDirection.Left);
			if (callback) {
				callback(ok);
			}
		} else if (callback) {
			callback(false);
		}
	};
	socket.on('game:move:left', gameMoveLeft);

	// *

	const gameMoveRight: ClientToServerEvents['game:move:right'] = (callback) => {
		if (!socket.data.player) {
			if (callback) callback(false);
			return;
		}

		const room = socket.data.player.room;
		if (room && room.game && !room.game.paused) {
			const index = room.playersIndex[socket.data.player.id];
			const ok = room.game.move(index, MoveDirection.Right);
			if (callback) {
				callback(ok);
			}
		} else if (callback) {
			callback(false);
		}
	};
	socket.on('game:move:right', gameMoveRight);

	// *

	const gameMoveDown: ClientToServerEvents['game:move:down'] = (callback) => {
		if (!socket.data.player) {
			if (callback) callback(false);
			return;
		}

		const room = socket.data.player.room;
		if (room && room.game && !room.game.paused) {
			const index = room.playersIndex[socket.data.player.id];
			const ok = room.game.moveDown(index);
			if (callback) {
				callback(ok);
			}
		} else if (callback) {
			callback(false);
		}
	};
	socket.on('game:move:down', gameMoveDown);

	// *

	const gameRotateClockwise: ClientToServerEvents['game:rotate:clockwise'] = (callback) => {
		if (!socket.data.player) {
			if (callback) callback(false);
			return;
		}

		const room = socket.data.player.room;
		if (room && room.game && !room.game.paused) {
			const index = room.playersIndex[socket.data.player.id];
			const ok = room.game.rotate(index, RotationDirection.Clockwise);
			if (callback) {
				callback(ok);
			}
		} else if (callback) {
			callback(false);
		}
	};
	socket.on('game:rotate:clockwise', gameRotateClockwise);

	// *

	const gameRotateCounterClockwise: ClientToServerEvents['game:rotate:counter-clockwise'] = (
		callback
	) => {
		if (!socket.data.player) {
			if (callback) callback(false);
			return;
		}

		const room = socket.data.player.room;
		if (room && room.game && !room.game.paused) {
			const index = room.playersIndex[socket.data.player.id];
			const ok = room.game.rotate(index, RotationDirection.CounterClockwise);
			if (callback) {
				callback(ok);
			}
		} else if (callback) {
			callback(false);
		}
	};
	socket.on('game:rotate:counter-clockwise', gameRotateCounterClockwise);

	// *

	const gameDash: ClientToServerEvents['game:dash'] = (callback) => {
		if (!socket.data.player) {
			if (callback) callback(false);
			return;
		}

		const room = socket.data.player.room;
		if (room && room.game && !room.game.paused) {
			const index = room.playersIndex[socket.data.player.id];
			const ok = room.game.dash(index);
			if (callback) {
				callback(ok);
			}
		} else if (callback) {
			callback(false);
		}
	};
	socket.on('game:dash', gameDash);

	// *

	const gameConcede: ClientToServerEvents['game:concede'] = (callback) => {
		if (!socket.data.player) {
			if (callback) callback(false);
			return;
		}

		const room = socket.data.player.room;
		if (room && room.game && !room.game.paused) {
			const index = room.playersIndex[socket.data.player.id];
			room.game.concede(index);
			if (callback) {
				callback(true);
			}
		} else if (callback) {
			callback(false);
		}
	};
	socket.on('game:concede', gameConcede);
}
