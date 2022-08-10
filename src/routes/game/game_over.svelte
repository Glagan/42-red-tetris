<!-- ========================= SCRIPT -->
<script lang="ts">
	import IdStore from '../../client/stores/id';
	import CurrentRoomStore from '../../client/stores/currentRoom';
	import WinnerStore from '../../client/stores/winner';
	import CentralBox from '../../client/components/containers/central_box.svelte';
	import { leave_room as Leave } from '../../client/socket/leave.emit';
	import { goto } from '$app/navigation';

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
	<div class="absolute z-[100000]">
		<CentralBox {loading}>
			<h2>Game over</h2>
			<p class="mt-5">
				{$CurrentRoomStore?.players[$WinnerStore]?.name}{$CurrentRoomStore?.players[$WinnerStore]
					?.id === $IdStore
					? ' (you)'
					: ''} win !
			</p>
			<div class="button-container flex justify-between mt-6">
				<button on:click={handle_new}>New</button>
				<button on:click={handle_quit}>Quit</button>
			</div>
		</CentralBox>
	</div>
{/if}

<!-- ========================= CSS -->
<style lang="postcss">
</style>
