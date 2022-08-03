import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss: true
	}),

	kit: {
		adapter: adapter(),
		prerender: {
			default: false
		},
		alias: {
			$components: 'src/components',
			$server: 'src/server',
			'$server/lib': 'src/server/lib',
			'$server/events': 'src/server/events',
			$client: 'src/client',
			'$client/lib': 'src/client/lib',
			$stores: 'src/client/stores'
		}
	}
};

export default config;
