import type { ObjectOfTypeValidation, ValidationRejection } from '@altostra/type-validations';
import ValidationError from './Errors/ValidationError';

export function validatePayload<T extends object>(
	payload: unknown,
	validator: ObjectOfTypeValidation<T>
): payload is T {
	let reasons = {} as ValidationRejection;
	const isValid = validator(payload, (rejectionReasons) => {
		reasons = rejectionReasons;
	});
	if (!isValid) {
		throw new ValidationError(reasons);
	}
	return true;
}
