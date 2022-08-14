import { render } from '@testing-library/svelte';
import CentralBox from './central_box.svelte';

describe('CentralBox', () => {
	it('Should display the box', () => {
		const { container } = render(CentralBox);

		expect(container.querySelector('.central-box')).toBeTruthy();
	});
});
