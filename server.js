import http from 'http';
import express from 'express';
import { handler } from './build/handler.js';
import { Server } from 'socket.io';

// Manually find hooks and setup WebSocket server
import path from 'path';
import fs from 'fs';

function regImport(startPath, nameReg) {
	if (!fs.existsSync(startPath)) {
		throw new Error(`Cannot find directory ${startPath}`);
	}

	const name = fs.readdirSync(startPath).find((file) => nameReg.test(file));

	if (!name) {
		throw new Error(`No filename that matches ${nameReg} in ${startPath}`);
	}

	const filename = path.join(startPath, name);
	return import(`./${filename}`);
}
const hooks = await regImport('./build/server/_app/immutable/chunks', /hooks-.*\.js/);
//

const app = express();
const server = http.createServer(app);

// Use socket.io
const io = new Server(server);
global.io = io;
hooks.WebSocket.server = io;

hooks.SetupSocketServer();

// SvelteKit handlers
app.use(handler);

server.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});
