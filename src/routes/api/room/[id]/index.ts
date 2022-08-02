import JSONResponse from '$lib/JSONResponse';
import { validateBody } from '$lib/Validator';
import isValidID from '$lib/Validators/ID';
import rooms from '$stores/rooms';
import { objectOf } from '@altostra/type-validations';
import type { RequestHandler } from '@sveltejs/kit';
import type { GetRoomRequest } from '../types';

export const GET: RequestHandler = async ({ params }) => {
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
		return JSONResponse(200, { room });
	}

	return JSONResponse(404, { message: "The room doesn't exists" });
};
