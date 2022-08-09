import { validatePayload } from '$server/lib/Validator';
import isValidName from '$server/lib/Validators/Name';
import RoomManager from '$server/RoomManager';
import { objectOf } from '@altostra/type-validations';
import type { ClientToServerEvents, TypedSocket } from '../../socket';

export type SetUsernamePayload = {
	username: string;
};

export default function useUserAPI(socket: TypedSocket) {
	const seUsername: ClientToServerEvents['set:username'] = (username, callback) => {
		if (
			!validatePayload(
				{ username },
				objectOf<SetUsernamePayload>({
					username: isValidName
				})
			)
		) {
			if (callback) {
				callback(false, {
					message: 'Invalid username, must be non-empty and at most 20 characters'
				});
			}
			return;
		}

		if (
			socket.data.player &&
			!socket.data.player.room &&
			!RoomManager.playerIsInMatchmaking(socket.data.player.id)
		) {
			username = username.trim();
			socket.data.player.name = username;
			callback(true);
		} else {
			callback(false, {
				message: "You can't change your username while in a room or in Matchmaking"
			});
		}
	};
	socket.on('set:username', seUsername);
}
