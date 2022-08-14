import Socket from './socket';

export default function dash() {
	Socket.emit('game:dash');
}
