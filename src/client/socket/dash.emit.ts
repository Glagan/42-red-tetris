import Socket from './socket';
import * as Sounds from '../effects/sounds';

export default function dash() {
	Socket.emit('game:dash', (ok) => {
		if (ok) Sounds.dash();
	});
}
