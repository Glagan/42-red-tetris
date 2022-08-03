import type { RequestHandlerOutput } from '@sveltejs/kit';

export default function JSONResponse(
	status: number,
	body: RequestInit['body'] | Record<string | number | symbol, unknown>,
	init?: RequestInit & { body: never }
): RequestHandlerOutput<string> {
	const headers: Record<string, string> = {
		'access-control-allow-origin': '*',
		'content-type': 'application/json'
	};
	if (init?.headers) {
		if (Array.isArray(init?.headers)) {
			for (const header of init.headers) {
				if (header.length >= 2) {
					headers[header[0]] = header.slice(1).join('; ');
				}
			}
		} else if (init.headers instanceof Headers) {
			init.headers.forEach((value, key) => {
				headers[key] = value;
			});
		} else {
			for (const key in init.headers) {
				headers[key] = init.headers[key];
			}
		}
	}
	return {
		status,
		...init,
		headers,
		body: JSON.stringify(body)
	};
}
