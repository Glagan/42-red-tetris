import { writable } from 'svelte/store';
import type Notification from '$client/lib/Notification';
import * as Sounds from '$client/effects/sounds';

const initial: Notification[] = [];

function createUsernameStore() {
	const { subscribe, update } = writable(initial);

	return {
		subscribe,
		push: (notification: Notification) =>
			update((notifications) => {
				if (notification.error) Sounds.error();
				notifications.push(notification);
				return notifications;
			})
	};
}

export default createUsernameStore();
