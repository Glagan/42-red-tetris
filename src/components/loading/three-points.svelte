<!-- ========================= SCRIPT -->
<script lang="ts">
	import { onDestroy } from 'svelte';

	let waiting_points = '.';
	export let waiting_time = 0;
	export let hidden = false;
	export let grey = false;

	const interval = setInterval(() => {
		waiting_time++;
		if (waiting_points.length === 3) {
			waiting_points = '';
		} else {
			waiting_points += '.';
		}
	}, 1000);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<!-- ========================= HTML -->
<span style={hidden ? 'display: none;' : ''} class:grey>
	{#if waiting_points == ''}
		&nbsp;
	{:else}
		{waiting_points}
	{/if}
</span>

<!-- ========================= CSS -->
<style lang="postcss">
	.grey {
		@apply text-neutral-500;
	}
</style>
