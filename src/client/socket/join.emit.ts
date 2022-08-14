import { nanoid } from 'nanoid';
import notifications from '$client/stores/notification';
import currentRoom from '$client/stores/currentRoom';
import matchmaking from '$client/stores/matchmaking';
import winner from '$client/stores/winner';
import type { BasicError } from 'src/socket';
import type Room from '$client/lib/Room';
import { goto } from '$app/navigation';
import socket from './socket';
import Username from './username.emit';
import Create from './create.emit';
import ParseUrlHash from '$utils/parse-url-hash';

export function join_url(
	url_hash: string,
	callback: ((ok: boolean) => void) | undefined = undefined
) {
	const hash_split = ParseUrlHash(url_hash);

	if (hash_split === null) {
		notifications.push({ id: nanoid(), message: 'url hash corrupted', error: true });
		if (callback != undefined) callback(false);
		return;
	} else {
		Username(hash_split.username, (ok: boolean) => {
			if (ok) {
				join_room(hash_split.room, true, true, (ok: boolean) => {
					if (!ok) {
						Create(hash_split.room, callback);
					} else {
						if (callback != undefined) callback(true);
						return;
					}
				});
			} else {
				if (callback != undefined) callback(false);
				return;
			}
		});
	}
}

export function join_room(
	label: string,
	by_name: boolean,
	no_error: boolean,
	callback: ((ok: boolean) => void) | undefined = undefined
) {
	let ok = false;

	socket.emit(
		by_name ? 'room:joinByName' : 'room:join',
		label,
		(room: Room | null, error: BasicError | null | undefined) => {
			if (error != null && error != undefined) {
				if (!no_error) notifications.push({ id: nanoid(), message: error.message, error: true });
			} else {
				if (room != null) {
					ok = true;
					currentRoom.set(room);
					winner.remove();
					notifications.push({ id: nanoid(), message: 'room joined', error: false });
					goto('/room');
				} else {
					if (!no_error)
						notifications.push({
							id: nanoid(),
							message: 'room not joined',
							error: true
						});
				}
			}
			if (callback != undefined) callback(ok);
		}
	);
}

export function join_matchmaking(callback: ((ok: boolean) => void) | undefined = undefined) {
	let ok = false;

	socket.emit('matchmaking:join', (success: boolean, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			notifications.push({ id: nanoid(), message: error.message, error: true });
		} else if (success) {
			ok = true;
			notifications.push({
				id: nanoid(),
				message: 'matchmaking start',
				error: false
			});
			matchmaking.set(true);
			goto('/matchmaking');
		} else {
			notifications.push({
				id: nanoid(),
				message: 'matchmaking not start',
				error: false
			});
		}
		if (callback != undefined) callback(ok);
	});
}
