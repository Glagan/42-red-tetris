import { validatePayload } from '$server/lib/Validator';
import isValidName from '$server/lib/Validators/Name';
import RoomManager from '$server/RoomManager';
import { objectOf } from '@altostra/type-validations';
import type { TypedSocket } from '../../socket';

export type SetUsernamePayload = {
	username: string;
};

export default function useUserAPI(socket: TypedSocket) {
	socket.on('set:username', (username, callback) => {
		console.log(`[${socket.id}]  set:username`, username);

		validatePayload(
			{ username },
			objectOf<SetUsernamePayload>({
				username: isValidName
			})
		);

		username = username.trim();
		if (
			socket.data.player &&
			!socket.data.player.room &&
			!RoomManager.playerIsInMatchmaking(socket.data.player.id)
		) {
			socket.data.player.name = username;
			callback(true);
		} else {
			callback(false, {
				message: "You can't change your username while in a room or in Matchmaking"
			});
		}
	});
}
