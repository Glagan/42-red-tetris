import type { TypedSocket } from '../../socket';
import Game from '$server/lib/Game';
import { MoveDirection, RotationDirection } from '$server/lib/Board';

export default function useGameAPI(socket: TypedSocket) {
	socket.on('game:test', () => {
		console.log(`[${socket.id}]  game:test`);
		const game = new Game(`room:test`, 1);
		game.loop.start();
	});

	socket.on('game:move:left', (callback) => {
		console.log(`[${socket.id}]  game:move:left`);

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
			// TODO: emit game state
		} else if (callback) {
			callback(false);
		}
	});

	socket.on('game:move:right', (callback) => {
		console.log(`[${socket.id}]  game:move:right`);

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
			// TODO: emit game state
		} else if (callback) {
			callback(false);
		}
	});

	socket.on('game:rotate:clockwise', (callback) => {
		console.log(`[${socket.id}]  game:rotate:clockwise`);

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
			// TODO: emit game state
		} else if (callback) {
			callback(false);
		}
	});

	socket.on('game:rotate:counter-clockwise', (callback) => {
		console.log(`[${socket.id}]  game:rotate:counter-clockwise`);

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
			// TODO: emit game state
		} else if (callback) {
			callback(false);
		}
	});

	socket.on('game:dash', (callback) => {
		console.log(`[${socket.id}]  game:dash`);

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
			// TODO: emit game state
		} else if (callback) {
			callback(false);
		}
	});
}
