<!-- ========================= SCRIPT -->
<script lang="ts">
	import type Player from '../../client/lib/Player';
	import IdStore from '../../client/stores/id';
	import NextPieces from './next_pieces.svelte';

	export let player: Player | undefined = undefined;
	export let horizontal_alignement: -1 | 0 | 1 = 0; // -1:left | 0:center | 1:right

	let player_number: 0 | 1;
	$: player_number = horizontal_alignement == 1 ? 1 : 0;
	$: player_name = player == undefined ? '?' : player.name;
</script>

<!-- ========================= HTML -->
<div
	class="bg-neutral-900 p-3 w-[260px]"
	style={horizontal_alignement != 0
		? `transform: rotateY(10deg) rotateX(${-horizontal_alignement * 30}deg);`
		: ''}
>
	<p>
		{player_name}{player != undefined && player.id === $IdStore ? ' (you)' : ''}
	</p>
	<p>Score: <span>34</span></p>
	<NextPieces player={player_number} />
</div>

<!-- ========================= CSS -->
<style lang="postcss">
	p {
		@apply inline px-1 mx-1;
	}
</style>
