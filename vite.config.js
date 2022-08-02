import { sveltekit } from '@sveltejs/kit/vite';
import { configDefaults } from 'vitest/config';
import useSocketIo from './src/socket';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		useSocketIo(server.httpServer);
	}
};

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), webSocketServer],
	define: {
		// Eliminate in-source test code
		'import.meta.vitest': 'undefined'
	},
	test: {
		// jest like globals
		globals: true,
		environment: 'jsdom',
		// in-source testing
		includeSource: ['src/**/*.{js,ts,svelte}'],
		// Add @testing-library/jest-dom matchers
		setupFiles: ['./setupTest.ts'],
		// Exclude files in c8
		coverage: {
			exclude: ['setupTest.ts']
		},

		deps: {
			// Put Svelte component here, e.g., inline: [/svelte-multiselect/, /msw/]
			inline: []
		},
		// Exclude playwright tests folder
		exclude: [...configDefaults.exclude, 'tests']
	}
};

export default config;
