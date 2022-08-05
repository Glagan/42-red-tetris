import type { Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../../socket';
import Game from '$server/lib/Game';
import { MoveDirection, RotationDirection } from '$server/lib/Board';

export default function useGameAPI(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
	socket.on('game:test', () => {
		console.log(`[${socket.id}]  game:test`);
		const game = new Game(1);
		game.loop.start();
	});

	socket.on('game:move:left', (callback) => {
		console.log(`[${socket.id}]  game:move:left`);
		const room = socket.player.room;
		if (room && room.game && !room.game.paused) {
			const index = room.playersIndex[socket.player.id];
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
		const room = socket.player.room;
		if (room && room.game && !room.game.paused) {
			const index = room.playersIndex[socket.player.id];
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
		const room = socket.player.room;
		if (room && room.game && !room.game.paused) {
			const index = room.playersIndex[socket.player.id];
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
		const room = socket.player.room;
		if (room && room.game && !room.game.paused) {
			const index = room.playersIndex[socket.player.id];
			const ok = room.game.rotate(index, RotationDirection.CounterClockwise);
			if (callback) {
				callback(ok);
			}
			// TODO: emit game state
		} else if (callback) {
			callback(false);
		}
	});
}
