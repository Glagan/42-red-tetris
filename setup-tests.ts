import http from 'http';
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import { Server } from 'socket.io';

expect.extend(matchers);

let httpServer: http.Server | undefined = global.httpServer;
let io: Server | undefined = global.io;
if (!global.io) {
	// console.log('Starting Socket.io server...');
	// Start http server for the socket
	httpServer = new http.Server();
	httpServer.listen(0);
	// const httpPort = httpServer.address()
	global.httpServer = httpServer;

	// Start Socket server
	io = new Server(httpServer);
	global.io = io;
}

afterAll(() => {
	// console.log('Closing Socket.io server...');
	if (io) {
		io.close();
	}
	delete global.io;
	if (httpServer) {
		httpServer.close();
	}
	delete global.httpServer;
});
