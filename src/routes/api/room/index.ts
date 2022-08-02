import JSONResponse from '$lib/JSONResponse';
import Room from '$lib/Room';
import { validateRequest } from '$lib/Validator';
import isValidName from '$lib/Validators/Name';
import rooms from '$stores/rooms';
import { objectOf } from '@altostra/type-validations';
import type { RequestHandler } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { CreateRoomRequest } from './types';

export const GET: RequestHandler = async () => {
	return JSONResponse(200, { rooms: get(rooms) });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await validateRequest(
		request,
		objectOf<CreateRoomRequest>({
			name: isValidName
		})
	);
	const roomName = body.name.trim();

	const room = new Room(roomName);
	rooms.addRoom(room);

	return JSONResponse(200, { room });
};
