import type { Handle } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import InvalidRequestError from '$lib/Errors/InvalidRequestError';
import ValidationError from '$lib/Errors/ValidationError';

// Mark the function async to catch both promises and non-promise exceptions
export const handle: Handle = async ({ event, resolve }) => {
	// Add debug
	event.locals.id = nanoid();
	const start = performance.now();
	console.log(`[${event.locals.id}] ${event.request.method} ${event.url}`);

	// Resolve the route with a try catch to handle validation
	try {
		const response = await resolve(event);
		console.log(
			`[${event.locals.id}] ${response.status} ${
				Math.round((performance.now() - start) * 10) / 10
			}ms`
		);
		response.headers.append('Request-Id', event.locals.id);
		return response;
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
						'Request-Id': event.locals.id,
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
						'Request-Id': event.locals.id,
						'content-type': 'application/json'
					}
				}
			);
		}
		throw error;
	}
};

// export const handleError: HandleError = ({ error, event }) => {};
