import InvalidRequestError from './InvalidRequestError';
import ValidationError from './ValidationError';
import type { ValidationRejection } from '@altostra/type-validations';

describe('Test Errors', () => {
	it('InvalidRequestError', () => {
		const error = new InvalidRequestError('Invalid request');
		expect(error).toBeInstanceOf(InvalidRequestError);
	});

	it('ValidationError', () => {
		const reasons: ValidationRejection = {
			reason: 'Invalid',
			path: ['/'],
			propertyType: 'string'
		};
		const error = new ValidationError(reasons);
		expect(error).toBeInstanceOf(ValidationError);
		expect(error.reasons).toBe(reasons);
		expect(error.message).toBe('Failed to validate body');
	});
});
