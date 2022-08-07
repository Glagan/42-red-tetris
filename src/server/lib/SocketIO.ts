import type { SocketServer } from '../../socket';

/* c8 ignore next */
export const ioServer = (global as unknown as { io: SocketServer }).io;
