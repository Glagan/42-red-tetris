<!-- ========================= SCRIPT -->
<script lang="ts">
	import UsernameStore from '../../stores/username';
	import CurrentRoomStore from '../../stores/currentRoom';
	import SquareSpinner from '../loading/square_spinner.svelte';
	import SocketStore from '../../stores/socket';
	import ThreePoints from '../loading/three_points.svelte';

	export let title = '';
	export let show_username = false;
	export let show_room = false;
	export let loading = false;
	export let loading_title = false;
	export let waiting_time = 0;

	$: _loading = loading || ($SocketStore != 'connect' && $SocketStore != 'reconnect');
</script>

<!-- ========================= HTML -->
<div class="central-box shadow">
	{#if _loading}
		<div class="absolute top-0 left-0 z-40 w-full h-full" />
		<SquareSpinner />
	{/if}
	<div class:transparent={_loading} disabled>
		{#if title.length > 0}
			<h2 class="absolute cant-select-text left-4 -top-4">
				{title}{#if loading_title}<ThreePoints bind:waiting_time />{/if}
			</h2>
		{/if}
		{#if show_username && show_room}
			<p class="absolute right-4 -top-[11px]">
				{$CurrentRoomStore?.name}&nbsp;<span class="text-neutral-500">@{$UsernameStore}</span>
			</p>
		{:else if show_username}
			<p class="absolute text-neutral-500 right-4 -top-[11px]">@{$UsernameStore}</p>
		{:else if show_room}
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
</style>
