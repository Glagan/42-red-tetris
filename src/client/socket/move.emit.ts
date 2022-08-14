import socket from './socket';
import * as Sounds from '$client/effects/sounds';

export function left() {
	socket.emit('game:move:left', (ok) => {
		if (ok) Sounds.left_right();
	});
}

export function right() {
	socket.emit('game:move:right', (ok) => {
		if (ok) Sounds.left_right();
	});
}

export function down() {
	socket.emit('game:move:down', (ok) => {
		if (ok) Sounds.down();
	});
}
