<!-- ========================= SCRIPT -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import id from '$client/stores/id';
	import currentRoom from '$client/stores/currentRoom';
	import winner from '$client/stores/winner';
	import CentralBoxPopup from '$components/containers/central-box-popup.svelte';
	import { leave_room as Leave } from '$client/socket/leave.emit';
	import * as Sounds from '$client/effects/sounds';

	let loading = false;

	function playAgain() {
		goto('/room');
	}

	function quitGame() {
		loading = true;
		Leave(() => {
			loading = false;
		});
	}
</script>

<!-- ========================= HTML -->
{#if $winner != -1}
	<CentralBoxPopup {loading}>
		<h2>Game over</h2>
		<p class="mt-5">
			@{$currentRoom?.players[$winner]?.name}
			{#if $currentRoom?.players[$winner]?.id === $id}
				<span class="text-neutral-500"> (you)</span>{/if}
		</p>
		<div class="button-container flex justify-between mt-6">
			<button
				on:click={() => {
					Sounds.ok();
					playAgain();
				}}>Play again</button
			>
			<button
				on:click={() => {
					Sounds.cancel();
					quitGame();
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
