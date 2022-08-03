import type { ObjectOfTypeValidation, ValidationRejection } from '@altostra/type-validations';
import InvalidRequestError from './Errors/InvalidRequestError';
import ValidationError from './Errors/ValidationError';

export function validateBody<T extends object>(
	body: unknown,
	validator: ObjectOfTypeValidation<T>
): body is T {
	let reasons = {} as ValidationRejection;
	const isValid = validator(body, (rejectionReasons) => {
		reasons = rejectionReasons;
	});
	if (!isValid) {
		throw new ValidationError(reasons);
	}
	return true;
}

export async function validateRequest<T extends object>(
	request: Request,
	validator: ObjectOfTypeValidation<T>
): Promise<T> {
	if (!request.body) {
		throw new InvalidRequestError('Missing body');
	}

	// Only handle JSON
	let body: unknown;
	try {
		body = await request.json();
	} catch (error) {
		throw new InvalidRequestError('Invalid body');
	}

	// Validate with the given validator and return the object itself with the type
	if (validateBody<T>(body, validator)) {
		return body;
	}
	// Never called
	return body as T;
}
