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
		setupFiles: ['./setup-tests.ts'],
		// Exclude files in c8
		coverage: {
			all: true,
			exclude: [
				'.svelte-kit/**',
				'.coverage/**',
				'node_modules/**',
				'build/**',
				'.yarn/**',
				'setup-tests.ts',
				'setup-global.ts',
				'**/*.d.ts',
				'**/*.test.ts',
				'src/routes/__*', // Layout files *can't* be tested
				'src/client/lib/*.ts', // Types only
				'src/socket.ts' // Types only
			],
			extension: ['.js', '.cjs', '.ts', '.svelte'],
			reporter: ['text', 'html'],
			src: 'src/'
		},
		silent: true,

		deps: {
			// Put Svelte component here, e.g., inline: [/svelte-multiselect/, /msw/]
			inline: []
		},
		// Exclude playwright tests folder
		exclude: [...configDefaults.exclude, 'tests']
	}
};

export default config;
