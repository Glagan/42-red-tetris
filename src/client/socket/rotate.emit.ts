import Socket from './socket';

export default function rotate(direction = false) {
	Socket.emit(direction ? 'game:rotate:clockwise' : 'game:rotate:counter-clockwise');
}
