import JSONResponse from '$lib/JSONResponse';
import Player from '$lib/Player';
import { validateBody } from '$lib/Validator';
import isValidID from '$lib/Validators/ID';
import rooms from '$stores/rooms';
import { objectOf } from '@altostra/type-validations';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import type { GetRoomRequest } from '../types';

export const POST: RequestHandler = async ({ params }) => {
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
		// Check if the room is not full
		if (room.isFull()) {
			return JSONResponse(400, { message: 'The room is full' });
		}

		room.addPlayer(new Player(nanoid()));
		return JSONResponse(201, { room });
	}

	return JSONResponse(404, { message: "The room doesn't exists" });
};
