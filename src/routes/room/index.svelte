<!-- ========================= SCRIPT -->
<script lang="ts">
	import CentralBox from '../../client/components/containers/central_box.svelte';

	const tips: Array<string> = [
		'When you complete more than two lines, your opponent receives additional lines.'
	];
</script>

<!-- ========================= HTML -->
<CentralBox title="Room">
	<p class="mt-3">The game starts when both players are ready</p>
	<p class="text-neutral-400 mt-7">{tips[0]}</p>
	<div class="mt-2">
		<div class="float-left">
			<p>tata</p>
			<button class="mt-2 cant-click">Ready</button>
		</div>
		<div class="float-right">
			<p class="underline underline-offset-1">toto (you)</p>
			<button class="mt-2">Ready</button>
		</div>
	</div>
</CentralBox>