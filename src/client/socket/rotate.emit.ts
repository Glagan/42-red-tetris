import Socket from './socket';
import * as Sounds from '../effects/sounds';

export default function rotate(direction = false) {
	Socket.emit(direction ? 'game:rotate:clockwise' : 'game:rotate:counter-clockwise', (ok) => {
		if (ok) Sounds.rotate();
	});
}
