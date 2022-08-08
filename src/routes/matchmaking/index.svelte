<!-- ========================= SCRIPT -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import CentralBox from '../../client/components/containers/central_box.svelte';
	import CurrentRoomStore from '../../client/stores/currentRoom';
	import Leave from '../../client/socket/leave.emit';

	// prevent come back <-
	if ($CurrentRoomStore == null || $CurrentRoomStore == undefined) {
		goto('/search');
	}

	let loading = false;

	let waiting_time = 0;

	const tips: Array<string> = [
		'When you complete more than two lines, your opponent receives additional lines.'
	];

	function handle_abort() {
		loading = true;
		Leave(() => {
			loading = false;
		});
	}
</script>

<!-- ========================= HTML -->
<CentralBox title="Matchmaking" {loading} loading_title bind:waiting_time show_room show_username>
	<p class="mt-3">Waiting for another player</p>
	<p class="text-neutral-400 mt-7">{tips[0]}</p>
	<button class="mt-5" on:click={handle_abort}>Abort</button>
	<p class="absolute text-neutral-800  bottom-1 right-3 text-center">{waiting_time} seconds</p>
</CentralBox>
