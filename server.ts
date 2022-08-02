import http from 'http';
import express from 'express';
import { handler } from './build/handler.js';
import useSocketIo from './src/socket';

const app = express();
const server = http.createServer(app);

// Use socket.io
useSocketIo(server);

// SvelteKit handlers
app.use(handler);

server.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});
