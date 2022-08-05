import type { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from 'src/socket';

export const ioServer = (
	global as unknown as { io: Server<ClientToServerEvents, ServerToClientEvents> }
).io;
