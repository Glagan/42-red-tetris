import Socket from './socket';

export function left() {
	Socket.emit('game:move:left');
}

export function right() {
	Socket.emit('game:move:right');
}

export function down() {
	Socket.emit('game:move:down');
}
