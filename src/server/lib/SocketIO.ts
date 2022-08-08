import type { SocketServer } from '../../socket';

/* c8 ignore start */
export const WebSocket: { server: SocketServer } = { server: globalIoServer() };
export default WebSocket;

export function globalIoServer() {
	return (global as unknown as { io: SocketServer }).io;
}
/* c8 ignore end */
