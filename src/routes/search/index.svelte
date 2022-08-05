<!-- ========================= SCRIPT -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import CentralBox from '../../components/containers/central_box.svelte';

	let games = [
		{ name: 'game_1', creator: 'z' },
		{ name: 'yoloooo', creator: 'chat-malade' },
		{ name: 'asdfasdfasdf', creator: 'sacetre' },
		{ name: 'asdf', creator: 'toto' },
		{ name: 'z', creator: 'tir-bouchon' },
		{ name: 'zsdf', creator: 'tisschon' }
	];

	let create = '';

	$: disabled_create = create.length == 0;

	function handle_quick_match() {
		goto('/matchmaking?');
	}

	function handle_create() {
		if (create.length > 0) {
			const urlParams = new URLSearchParams(window.location.search);
			urlParams.set('game', create);
			goto('/matchmaking?' + urlParams.toString());
		}
	}
</script>

<!-- ========================= HTML -->
<CentralBox title="Join">
	<input type="text" class="text-input" placeholder="Search a game" />
	<div class="games mt-5 w-[80%] m-auto h-[120px] overflow-y-scroll overflow-x-hidden">
		{#each games as game}
			<p class="cant-select-text scale-hover">
				{game.name}&nbsp;<span class="text-neutral-500">@{game.creator}</span>
			</p>
		{/each}
	</div>
	<button class="mt-5" on:click={handle_quick_match}>Quick Match</button>
</CentralBox>

<CentralBox title="Create">
	<input type="text" class="text-input" placeholder="Name" bind:value={create} />
	<button class="mt-5" disabled={disabled_create} on:click={handle_create}>Create</button>
</CentralBox>
