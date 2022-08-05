import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';
import { configDefaults } from 'vitest/config';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		const io = new Server(server.httpServer);
		global.io = io;
	}
};

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [webSocketServer, sveltekit()],
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
			all: true,
			exclude: ['.svelte-kit/**', 'setupTest.ts', '**/*.d.ts', '**/*.test.ts'],
			extension: ['.js', '.cjs', '.ts', '.svelte'],
			reporter: ['text', 'html'],
			src: 'src/'
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
