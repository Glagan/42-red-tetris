import Socket from './socket';

export default function move(direction: boolean) {
	Socket.emit(direction ? 'game:move:right' : 'game:move:left');
}
