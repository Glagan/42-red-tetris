import { get } from 'svelte/store';
import { nanoid } from 'nanoid';
import notifications from '$client/stores/notification';
import { goto } from '$app/navigation';
import username from '$client/stores/username';
import socket from './socket';
import type { BasicError } from 'src/socket';
import * as Sounds from '$client/effects/sounds';

export default function Username(
	newUsername: string,
	callback: ((ok: boolean) => void) | undefined = undefined
) {
	let ok = false;

	if (get(username) === newUsername) {
		Sounds.ok();
		ok = true;
		goto('/search');
		if (callback != undefined) callback(ok);
	} else if (newUsername.length > 0) {
		socket.emit(
			'set:username',
			newUsername,
			(success: boolean, error: BasicError | null | undefined) => {
				if (error != null && error != undefined) {
					notifications.push({ id: nanoid(), message: error.message, error: true });
				} else {
					if (success) {
						Sounds.ok();
						localStorage.setItem('username', newUsername);
						username.set(newUsername);
						notifications.push({ id: nanoid(), message: 'username updated', error: false });
						ok = true;
						goto('/search');
					} else {
						notifications.push({
							id: nanoid(),
							message: 'username not updated',
							error: true
						});
					}
				}
				if (callback != undefined) callback(ok);
			}
		);
	}
}
