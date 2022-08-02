import type http from 'http';
import { Server } from 'socket.io';

export default function useSocketIo(server: http.Server) {
	const io = new Server(server);

	io.on('connection', (socket) => {
		console.log(`[${socket.id}]  on:connection`);
		socket.emit('eventFromServer', 'Hello, World!');
	});
}
