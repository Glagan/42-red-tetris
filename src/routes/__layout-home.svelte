<!-- ========================= SCRIPT -->
<script lang="ts">
	import '../app.css';
	import Header from '../client/components/layout/header.svelte';
	import Notifications from '../client/components/layout/notifications.svelte';
</script>

<!-- ========================= HTML -->
<Header />
<main>
	<slot />
</main>
<Notifications />

<!-- ========================= CSS -->
<style lang="postcss">
	main {
		@apply text-center w-full flex flex-col justify-center align-middle content-center items-center;
		height: calc(100% - var(--footer-height));
	}
</style>
