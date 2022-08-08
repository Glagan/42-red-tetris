import type { SocketServer } from '../../socket';

/* c8 ignore next 2 */
// eslint-disable-next-line prefer-const
export let ioServer = (global as unknown as { io: SocketServer }).io;
export default ioServer;

export function setIoServer(server: SocketServer) {
	ioServer = server;
}
