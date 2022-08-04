<!-- ========================= SCRIPT -->
<script lang="ts">
	export let title = '';
</script>

<!-- ========================= HTML -->
<div class="central-box">
	{#if title.length > 0}
		<h2 class="absolute cant-select-text left-4 -top-4 text-2xl">{title}</h2>
	{/if}
	<slot />
</div>

<!-- ========================= CSS -->
<style lang="postcss">
	.central-box {
		@apply relative bg-neutral-900 p-7 text-center m-5;
		width: var(--central-box-width);
        filter: drop-shadow(5px 5px 5px #000);
	}
</style>
