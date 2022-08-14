<!-- ========================= SCRIPT -->
<script lang="ts">
	import IdStore from '$client/stores/id';
	import CurrentRoomStore from '$client/stores/currentRoom';
	import WinnerStore from '$client/stores/winner';
	import CentralBoxPopup from '$components/containers/central-box-popup.svelte';
	import { leave_room as Leave } from '$client/socket/leave.emit';
	import { goto } from '$app/navigation';
	import * as Sounds from '$client/effects/sounds';

	let loading = false;

	function handle_new() {
		goto('/room');
	}

	function handle_quit() {
		loading = true;
		Leave(() => {
			loading = false;
		});
	}
</script>

<!-- ========================= HTML -->
{#if $WinnerStore != -1}
	<CentralBoxPopup {loading}>
		<h2>Game over</h2>
		<p class="mt-5">
			@{$CurrentRoomStore?.players[$WinnerStore]?.name}
			{#if $CurrentRoomStore?.players[$WinnerStore]?.id === $IdStore}
				<span class="text-neutral-500"> (you)</span>{/if}
		</p>
		<div class="button-container flex justify-between mt-6">
			<button
				on:click={() => {
					Sounds.ok();
					handle_new();
				}}>Play again</button
			>
			<button
				on:click={() => {
					Sounds.cancel();
					handle_quit();
				}}>Quit</button
			>
		</div>
	</CentralBoxPopup>
{/if}

<!-- ========================= CSS -->
<style lang="postcss">
	button {
		@apply w-[100px];
	}
</style>
