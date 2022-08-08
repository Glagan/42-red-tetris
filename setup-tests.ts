import http from 'http';
import express from 'express';
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import { Server } from 'socket.io';
import SetupSocketServer from './src/server/setup';

expect.extend(matchers);

beforeAll(() => {
	// Use socket.io
	const app = express();
	const server = http.createServer(app);
	global.io = new Server(server);
	server.listen(0);
	SetupSocketServer(global.io);
});

afterAll(() => {
	// console.log('Closing Socket.io server...');
	if (global.io) {
		global.io.close();
	}
	delete global.io;
});
