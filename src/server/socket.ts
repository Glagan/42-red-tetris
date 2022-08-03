import type http from 'http';
import { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '$server/types';

export default function useSocketIo(server: http.Server) {
	return new Server<ClientToServerEvents, ServerToClientEvents>(server);
}
