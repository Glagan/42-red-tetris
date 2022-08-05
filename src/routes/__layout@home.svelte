<!-- ========================= SCRIPT -->
<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { browser } from '$app/env';

	export const load: Load = () => {
		if (browser) {
			return {
				status: 200
			};
		}
		return {
			redirect: '/',
			status: 308
		};
	};
</script>

<!-- ========================= HTML -->
<slot />
