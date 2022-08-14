import socket from './socket';

export default function dash() {
	socket.emit('game:dash');
}
