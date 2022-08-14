import socket from './socket';
import * as Sounds from '$client/effects/sounds';

export default function rotate(direction = false) {
	socket.emit(direction ? 'game:rotate:clockwise' : 'game:rotate:counter-clockwise', (ok) => {
		if (ok) Sounds.rotate();
	});
}
