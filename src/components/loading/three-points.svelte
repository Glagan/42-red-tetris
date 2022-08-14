<!-- ========================= SCRIPT -->
<script lang="ts">
	import { onDestroy } from 'svelte';

	let text = '.';
	export let waitingTime = 0;
	export let hidden = false;
	export let grey = false;

	const interval = setInterval(() => {
		waitingTime++;
		if (text.length === 3) {
			text = '';
		} else {
			text += '.';
		}
	}, 1000);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<!-- ========================= HTML -->
<span style={hidden ? 'display: none;' : ''} class:grey>
	{#if text == ''}
		&nbsp;
	{:else}
		{text}
	{/if}
</span>

<!-- ========================= CSS -->
<style lang="postcss">
	.grey {
		@apply text-neutral-500;
	}
</style>
