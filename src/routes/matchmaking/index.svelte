<!-- ========================= SCRIPT -->
<script lang="ts">
	import CentralBox from '$components/containers/central-box.svelte';
	import { leave_matchmaking as Leave } from '$client/socket/leave.emit';
	import * as Sounds from '$client/effects/sounds';
	import { goto } from '$app/navigation';

	let loading = false;

	let waitingTime = 0;

	const tips: string[] = [
		'When you complete more than two lines, your opponent receives additional lines.'
	];

	function leaveMatchmaking() {
		loading = true;
		Leave(() => {
			loading = false;
		});
	}
</script>

<!-- ========================= HTML -->
<CentralBox title="Matchmaking" {loading} loadingTitle {waitingTime}>
	<p class="mt-3">Waiting for another player</p>
	<p class="text-neutral-400 mt-7">{tips[0]}</p>
	<button
		class="mt-5"
		on:click={() => {
			Sounds.cancel();
			leaveMatchmaking();
			goto('/search');
		}}>Leave</button
	>
	<p class="absolute text-neutral-800  bottom-1 right-3 text-center">{waitingTime} seconds</p>
</CentralBox>
