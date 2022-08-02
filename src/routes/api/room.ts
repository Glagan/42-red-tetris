import Room from '$lib/Room';
import { validateRequest } from '$lib/Validator';
import isValidName from '$lib/Validators/Name';
import rooms from '$stores/rooms';
import { objectOf } from '@altostra/type-validations';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { get } from 'svelte/store';

export const GET: RequestHandler = async () => {
	return {
		status: 200,
		headers: {
			'access-control-allow-origin': '*'
		},
		body: {
			number: Math.random()
		}
	};
};

export type CreateRoomRequest = {
	name: string;
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await validateRequest(
		request,
		objectOf<CreateRoomRequest>({
			name: isValidName
		})
	);
	const roomName = body.name.trim();

	console.log('body', body, roomName);

	rooms.addRoom(new Room(roomName));

	return {
		status: 200,
		headers: {
			'access-control-allow-origin': '*',
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			id: nanoid(),
			rooms: get(rooms)
		})
	};
};
