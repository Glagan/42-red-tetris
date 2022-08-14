import { nanoid } from 'nanoid';
import notifications from '$client/stores/notification';
import currentRoom from '$client/stores/currentRoom';
import matchmaking from '$client/stores/matchmaking';
import type { BasicError } from 'src/socket';
import { goto } from '$app/navigation';
import socket from './socket';

export function leave_room(callback: ((ok: boolean) => void) | undefined = undefined) {
	let ok = false;

	socket.emit('room:leave', (deleted: boolean | null, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			notifications.push({ id: nanoid(), message: error.message, error: true });
		} else {
			ok = true;
			currentRoom.set(null);
			notifications.push({
				id: nanoid(),
				message: `room ${deleted ? 'deleted' : 'leaved'}`,
				error: false
			});
			goto('/search');
		}
		if (callback != undefined) callback(ok);
	});
}

export function leave_matchmaking(callback: ((ok: boolean) => void) | undefined = undefined) {
	let ok = false;

	socket.emit(
		'matchmaking:leave',
		(success: boolean | null, error: BasicError | null | undefined) => {
			if (error != null && error != undefined) {
				notifications.push({ id: nanoid(), message: error.message, error: true });
			} else if (success) {
				ok = true;
				notifications.push({
					id: nanoid(),
					message: 'matchmaking leaved',
					error: false
				});
				matchmaking.set(false);
				goto('/search');
			} else {
				notifications.push({
					id: nanoid(),
					message: 'matchmaking not leaved',
					error: false
				});
			}
			if (callback != undefined) callback(ok);
		}
	);
}
