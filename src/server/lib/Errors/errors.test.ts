import ValidationError from './ValidationError';
import type { ValidationRejection } from '@altostra/type-validations';

describe('Errors', () => {
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
