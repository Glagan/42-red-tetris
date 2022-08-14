import { nanoid } from 'nanoid';
import notifications from '$client/stores/notification';
import currentRoom from '$client/stores/currentRoom';
import winner from '$client/stores/winner';
import type { BasicError } from 'src/socket';
import type Room from '$client/lib/Room';
import { goto } from '$app/navigation';
import socket from './socket';

export default function create(
	create: string,
	callback: ((ok: boolean) => void) | undefined = undefined
) {
	let ok = false;

	socket.emit('room:create', create, (room: Room | null, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			notifications.push({ id: nanoid(), message: error.message, error: true });
		} else {
			if (room != null) {
				ok = true;
				currentRoom.set(room);
				winner.remove();
				notifications.push({ id: nanoid(), message: 'room created', error: false });
				goto('/room');
			} else {
				notifications.push({
					id: nanoid(),
					message: 'room not created',
					error: true
				});
			}
		}
		if (callback != undefined) callback(ok);
	});
}
