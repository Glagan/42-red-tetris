<!-- ========================= SCRIPT -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import CentralBox from '../../client/components/containers/central_box.svelte';
	import sleep from '../../utils/sleep';

	let waiting_time = 0;
	let waiting_points = '.';

	const tips: Array<string> = [
		'When you complete more than two lines, your opponent receives additional lines.'
	];

	async function add_one_second() {
		await sleep(1000);
		waiting_time++;
		if (waiting_points.length === 3) waiting_points = '';
		else waiting_points += '.';
		add_one_second();
	}

	function handle_abort() {
		goto('/search?');
	}

	add_one_second();
</script>

<!-- ========================= HTML -->
<CentralBox title="Matchmaking{waiting_points}">
	<p class="mt-3">Waiting for another player</p>
	<p class="text-neutral-400 mt-7">{tips[0]}</p>
	<button class="mt-5" on:click={handle_abort}>Abort</button>
	<p class="absolute text-neutral-800  bottom-1 right-3 text-center">{waiting_time} seconds</p>
</CentralBox>
