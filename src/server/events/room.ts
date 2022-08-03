import Room from '$server/lib/Room';
import { validateBody } from '$server/lib/Validator';
import isValidName from '$server/lib/Validators/Name';
import rooms from '$stores/rooms';
import { objectOf } from '@altostra/type-validations';
import type { Socket } from 'socket.io';
import type { CreateRoomRequest } from 'src/routes/api/room/types';
import type { ClientToServerEvents, ServerToClientEvents } from '$server/types';

export default function useRoomAPI(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
	socket.on('room:create', (name) => {
		console.log('on:room:create', name);
		validateBody(
			{ name },
			objectOf<CreateRoomRequest>({
				name: isValidName
			})
		);
		const roomName = name.trim();
		const room = new Room(roomName);
		rooms.addRoom(room);
		socket.emit('room:created', room);
	});
}
