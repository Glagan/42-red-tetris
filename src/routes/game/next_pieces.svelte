<!-- ========================= SCRIPT -->
<script lang="ts">
	import NextPiece from './next_piece.svelte';
	import NextPiecesStore from '../../client/stores/generatedNextPieces';

	export let player: 0 | 1;
</script>

<!-- ========================= HTML -->
<div class="my-4 flex justify-between z-[100000000000]">
	{#each $NextPiecesStore[player] as piece, index}
		<NextPiece {piece} opacity={1 - index / 2.2} />
	{/each}
</div>
