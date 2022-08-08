import type { SocketServer } from '../../socket';

/* c8 ignore start */
export const WebSocket: { server: SocketServer } = {
	server: (global as unknown as { io: SocketServer }).io
};
export default WebSocket;
/* c8 ignore end */
