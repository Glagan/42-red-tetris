import type { Handle } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import SetupSocketServer from '$server/setup';

// Create and initialize the server socket
SetupSocketServer();

// Add debug headers and check performances
export const handle: Handle = async ({ event, resolve }) => {
	// Add debug
	event.locals.id = nanoid();
	const start = performance.now();
	console.log(`[${event.locals.id}] ${event.request.method} ${event.url}`);
	const response = await resolve(event);
	console.log(
		`[${event.locals.id}] ${response.status} ${Math.round((performance.now() - start) * 10) / 10}ms`
	);
	response.headers.append('Request-Id', event.locals.id);
	return response;
};
