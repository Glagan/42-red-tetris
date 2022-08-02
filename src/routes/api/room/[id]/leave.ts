import JSONResponse from '$lib/JSONResponse';
import { validateBody } from '$lib/Validator';
import isValidID from '$lib/Validators/ID';
import rooms from '$stores/rooms';
import { objectOf } from '@altostra/type-validations';
import type { RequestHandler } from '@sveltejs/kit';

export type GetRoomRequest = {
	id: string;
};

export const DELETE: RequestHandler = async ({ params }) => {
	if (
		!validateBody(
			params,
			objectOf<GetRoomRequest>({
				id: isValidID
			})
		)
	) {
		// Never called on failure
		throw new Error();
	}

	const room = rooms.getRoom(params.id);
	if (room) {
		// Check if the room is not emty
		if (room.isEmpty()) {
			return JSONResponse(400, { message: 'The room is empty' });
		}

		room.removePlayer(room.players[0].id);
		// Delete the room if we were the last player in it
		if (room.isEmpty()) {
			rooms.removeRoom(room.id);
			return JSONResponse(200, { room: undefined });
		}
		return JSONResponse(200, { room });
	}

	return JSONResponse(404, { message: "The room doesn't exists" });
};
