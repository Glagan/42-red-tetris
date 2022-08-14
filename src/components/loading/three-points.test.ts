import { render } from '@testing-library/svelte';
import ThreePoints from './three-points.svelte';

describe('Three points', () => {
	it('Should display the spinner', () => {
		const { container } = render(ThreePoints);

		expect(container.querySelector('span')).toBeTruthy();
	});
});
