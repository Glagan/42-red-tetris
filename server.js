import http from 'http';
import express from 'express';
import { handler } from './build/handler.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

// Use socket.io
const io = new Server(server);
global.io = io;

// SvelteKit handlers
app.use(handler);

server.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});
