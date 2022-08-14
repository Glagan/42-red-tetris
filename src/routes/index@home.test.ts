import { render } from '@testing-library/svelte';
import Indexhome from './index@home.svelte';

describe('Index page', () => {
	it('Should display the home page', () => {
		const { component, container, getByPlaceholderText, getByText } = render(Indexhome);

		// Inputs in slots
		expect(component).toBeTruthy();
		const usernameInput = getByPlaceholderText('Your username');
		expect(usernameInput).toBeTruthy();
		const enterButton = getByText('Enter');
		expect(enterButton).toBeTruthy();

		// Central box
		const centralBox = container.querySelector('.central-box');
		expect(centralBox).toBeTruthy();
	});
});
