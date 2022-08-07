import type { SocketServer } from '../../socket';

export const ioServer = (global as unknown as { io: SocketServer }).io;
