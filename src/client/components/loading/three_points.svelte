<!-- ========================= SCRIPT -->
<script lang="ts">
	import sleep from '$utils/sleep';

	let waiting_points = '.';
	export let waiting_time = 0;
	export let hidden = false;
	export let grey = false;

	async function add_one_second() {
		await sleep(1000);
		waiting_time++;
		if (waiting_points.length === 3) waiting_points = '';
		else waiting_points += '.';
		add_one_second();
	}

	$: waiting_points_or_space = waiting_points == '' ? '&nbsp;' : waiting_points;

	add_one_second();
</script>

<!-- ========================= HTML -->
<span style={hidden ? 'display: none;' : ''} class:grey>
	{@html waiting_points_or_space}
</span>

<!-- ========================= CSS -->
<style lang="postcss">
	.grey {
		@apply text-neutral-500;
	}
</style>
