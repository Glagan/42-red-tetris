import type { ValidationRejection } from '@altostra/type-validations';

export default class ValidationError extends Error {
	reasons: ValidationRejection;

	constructor(reasons: ValidationRejection) {
		super('Failed to validate body');
		this.reasons = reasons;
	}
}
