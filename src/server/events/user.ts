import { validatePayload } from '$server/lib/Validator';
import isValidName from '$server/lib/Validators/Name';
import { objectOf } from '@altostra/type-validations';
import type { Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../../socket';
import PlayerManager from '$server/PlayerManager';

export type SetUsernamePayload = {
	username: string;
};

export default function useUserAPI(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
	socket.on('set:username', (username, callback) => {
		console.log(`[${socket.id}]  set:username`, username);
		const token = socket.handshake.auth.token;

		validatePayload(
			{ username },
			objectOf<SetUsernamePayload>({
				username: isValidName
			})
		);

		username = username.trim();
		const player = PlayerManager.getPlayer(token);
		if (player && !player.room) {
			player.name = username;
			callback(true);
		} else if (player?.room) {
			callback({ message: "You can't change your username while in a room" });
		} else {
			callback({ message: 'No plqyer found' });
		}
	});
}
