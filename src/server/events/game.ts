import type { Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../../socket';
import Game from '$server/lib/Game';

export default function useGameAPI(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
	socket.on('game:test', () => {
		console.log(`[${socket.id}]  game:test`);
		const game = new Game();
		game.loop.start();
	});
}
