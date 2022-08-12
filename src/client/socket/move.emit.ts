import Socket from './socket';
import * as Sounds from '../effects/sounds';

export function left() {
	Socket.emit('game:move:left', (ok) => {
		if (ok) Sounds.left_right();
	});
}

export function right() {
	Socket.emit('game:move:right', (ok) => {
		if (ok) Sounds.left_right();
	});
}

export function down() {
	Socket.emit('game:move:down', (ok) => {
		if (ok) Sounds.down();
	});
}
