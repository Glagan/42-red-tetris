import http from 'http';
import { Server } from 'socket.io';

let httpServer: http.Server;
export function setup() {
	// Start http server for the socket
	httpServer = new http.Server();
	httpServer.listen(0);
	// const httpPort = httpServer.address()

	// Start Socket server
	const io = new Server(httpServer);
	global.io = io;
}

export function teardown() {
	if (global.io && global.io?.close) {
		global.io.close();
		delete global.io;
	}
	if (httpServer) {
		httpServer.close();
	}
}
