import { validatePayload } from '$server/lib/Validator';
import isValidName from '$server/lib/Validators/Name';
import { objectOf } from '@altostra/type-validations';
import type { Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../../socket';

export type SetUsernamePayload = {
	username: string;
};

export default function useUserAPI(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
	socket.on('set:username', (username, callback) => {
		console.log(`[${socket.id}]  set:username`, username);

		validatePayload(
			{ username },
			objectOf<SetUsernamePayload>({
				username: isValidName
			})
		);

		username = username.trim();
		if (!socket.data.player.room) {
			socket.data.player.name = username;
			callback(true);
		} else {
			callback({ message: "You can't change your username while in a room" });
		}
	});
}
