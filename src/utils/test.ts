import http from 'http';
import WebSocket from '$server/lib/SocketIO';
import { Server } from 'socket.io';
import { io, Socket } from 'socket.io-client';
import SetupSocketServer from '$server/setup';
import type { ClientToServerEvents, ServerToClientEvents } from 'src/socket';

/* c8 ignore start */
let httpServer: http.Server;
let testPort = 0;
export function setupWebSocketTestServer() {
	const httpServer = http.createServer();
	WebSocket.server = new Server(httpServer);
	SetupSocketServer();
	// console.log('setup ws test server', WebSocket.server);
	httpServer.listen(0);
	testPort = (httpServer.address() as { port: number }).port;
}

export async function connectTestWebSocket(token: string | undefined, username: string) {
	const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
		`http://localhost:${testPort}`,
		{
			auth: {
				token,
				username
			}
		}
	);
	// socket.on('connect', () => {
	// 	console.log('connected', socket.id);
	// });
	// socket.on('connect_error', (error) => {
	// 	console.log('connect_error', error, socket.id);
	// });
	// console.log(socket);
	await new Promise((resolve) => {
		socket.on('connect', () => {
			resolve(true);
		});
	});
	return socket;
}
export function pendingTestWebSocket(token: string | undefined, username: string) {
	const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
		`http://localhost:${testPort}`,
		{
			auth: {
				token,
				username
			}
		}
	);
	// socket.on('connect', () => {
	// 	console.log('connected', socket.id);
	// });
	// socket.on('connect_error', (error) => {
	// 	console.log('connect_error', error, socket.id);
	// });
	// console.log(socket);
	return socket;
}

export function cleanupWebSocketTestServer() {
	if (WebSocket.server) {
		WebSocket.server.close();
	}
	if (httpServer) {
		httpServer.close();
	}
}
/* c8 ignore end */
