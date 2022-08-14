<!-- ========================= SCRIPT -->
<script lang="ts">
	import UsernameStore from '$client/stores/username';
	import CurrentRoomStore from '$client/stores/currentRoom';
	import SocketStore from '$client/stores/socket';
	import ThreePoints from '$components/loading/three-points.svelte';

	export let title = '';
	export let showUsername = false;
	export let showRoom = false;
	export let loading = false;
	export let loadingTitle = false;
	export let waitingTime = 0;
	export let extraLarge = false;

	$: isLoading = loading || ($SocketStore != 'connect' && $SocketStore != 'reconnect');
</script>

<!-- ========================= HTML -->
<div class="central-box shadow" class:extra-large={extraLarge}>
	<div
		style="pointer-events: none; opacity: {isLoading ? 1 : 0};"
		class="absolute top-0 left-0 z-40 w-full h-full transition-all duration-300"
	/>
	<div class:transparent={isLoading} disabled>
		{#if title.length > 0}
			<h2 class="absolute left-4 -top-4">
				{title}{#if loadingTitle}<ThreePoints bind:waitingTime />{/if}
			</h2>
		{/if}
		{#if showUsername && showRoom}
			<p class="absolute right-4 -top-[11px]">
				{$CurrentRoomStore?.name}&nbsp;<span class="text-neutral-500">@{$UsernameStore}</span>
			</p>
		{:else if showUsername}
			<p class="absolute text-neutral-500 right-4 -top-[11px]">@{$UsernameStore}</p>
		{:else if showRoom}
			<p class="absolute text-neutral-500 right-4 -top-[11px]">Room: {$CurrentRoomStore?.name}</p>
		{/if}
		<slot />
	</div>
</div>

<!-- ========================= CSS -->
<style lang="postcss">
	.central-box {
		@apply relative bg-neutral-900 p-7 text-center m-5;
		width: var(--central-box-width);
	}

	.extra-large {
		width: calc(var(--central-box-width) + 64px) !important;
	}
</style>
