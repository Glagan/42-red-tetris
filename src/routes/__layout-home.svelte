<!-- ========================= SCRIPT -->
<script lang="ts">
	import '../app.css';
	import Header from '$components/layout/header.svelte';
	import Notifications from '$components/layout/notifications.svelte';
	import ParametersPopup from '$components/parameters/popup.svelte';
	import { browser } from '$app/env';
	import { onDestroy } from 'svelte';
	import ParametersButtons from '$components/parameters/buttons.svelte';
	import * as Sounds from '$client/effects/sounds';

	let parameters = false;

	$: parameters ? Sounds.select() : Sounds.cancel();

	if (browser) {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				parameters = false;
			}
		};

		document.addEventListener('keydown', onKeyDown);

		onDestroy(() => {
			document.removeEventListener('keydown', onKeyDown);
		});
	}
</script>

<!-- ========================= HTML -->
<svelte:head>
	<title>Tetris 3D</title>
</svelte:head>

<Header />
<ParametersButtons bind:open={parameters} />
<main>
	{#if parameters}
		<ParametersPopup />
	{/if}
	<div class="flex flex-col justify-center  items-center" style="opacity: {parameters ? 0.2 : 1};">
		<slot />
	</div>
</main>
<Notifications />

<!-- ========================= CSS -->
<style lang="postcss">
	main {
		@apply text-center w-full flex flex-col justify-center align-middle content-center items-center;
		height: calc(100% - var(--footer-height));
	}
</style>
