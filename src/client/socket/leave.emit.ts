import { nanoid } from 'nanoid';
import NotificationStore from '$client/stores/notification';
import CurrentRoomStore from '$client/stores/currentRoom';
import MatchmakingStore from '$client/stores/matchmaking';
import type { BasicError } from 'src/socket';
import { goto } from '$app/navigation';
import Socket from './socket';

export function leave_room(callback: ((ok: boolean) => void) | undefined = undefined) {
	let ok = false;

	Socket.emit('room:leave', (deleted: boolean | null, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			NotificationStore.push({ id: nanoid(), message: error.message, error: true });
		} else {
			ok = true;
			CurrentRoomStore.set(null);
			NotificationStore.push({
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

	Socket.emit(
		'matchmaking:leave',
		(success: boolean | null, error: BasicError | null | undefined) => {
			if (error != null && error != undefined) {
				NotificationStore.push({ id: nanoid(), message: error.message, error: true });
			} else if (success) {
				ok = true;
				NotificationStore.push({
					id: nanoid(),
					message: 'matchmaking leaved',
					error: false
				});
				MatchmakingStore.set(false);
				goto('/search');
			} else {
				NotificationStore.push({
					id: nanoid(),
					message: 'matchmaking not leaved',
					error: false
				});
			}
			if (callback != undefined) callback(ok);
		}
	);
}
