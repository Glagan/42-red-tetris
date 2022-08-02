import InvalidRequestError from '$lib/Errors/InvalidRequestError';
import ValidationError from '$lib/Errors/ValidationError';
import type { Handle } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

// Mark the function async to catch both promises and non-promise exceptions
export const handle: Handle = async ({ event, resolve }) => {
	event.locals.id = nanoid();
	try {
		return await resolve(event);
	} catch (error) {
		if (error instanceof ValidationError) {
			return new Response(
				JSON.stringify({
					message: 'Bad request',
					error: error.reasons
				}),
				{
					status: 400,
					headers: {
						'content-type': 'application/json'
					}
				}
			);
		} else if (error instanceof InvalidRequestError) {
			return new Response(
				JSON.stringify({
					message: error.message
				}),
				{
					headers: {
						'content-type': 'application/json'
					}
				}
			);
		}
		throw error;
	}
};

// export const handleError: HandleError = ({ error, event }) => {};
