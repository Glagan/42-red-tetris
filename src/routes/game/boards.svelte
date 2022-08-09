<!-- ========================= SCRIPT -->
<script lang="ts">
	import Board from './board.svelte';
	import GeneratedBoardsStore from '../../client/stores/generatedBoards';
	import ThemeStore from '../../client/stores/theme';
	import GeneratedPiecesStore from '../../client/stores/generatedPieces';
	import Config from '../../client/config';
	import _3Dto2D from '../../client/themes/generators/3Dto2D';
	import { browser } from '$app/env';

	let background_theme = $ThemeStore.backgrounds[2];
	let background_3Dto2D_left: string | undefined = undefined;
	let background_3Dto2D_right: string | undefined = undefined;

	$: background_without_front =
		background_3Dto2D_left != undefined && background_3Dto2D_right != undefined;

	if (browser && Config.game.background._2Dto3D) {
		(async () => {
			if (background_theme.left._3d != undefined && background_theme.right._3d != undefined) {
				background_3Dto2D_left = await _3Dto2D(
					background_theme.left._3d.cube_size,
					background_theme.left._3d.cubes[0]
				);
				background_3Dto2D_right = await _3Dto2D(
					background_theme.left._3d.cube_size,
					background_theme.right._3d.cubes[0]
				);
			}
		})();
	}
</script>

<!-- ========================= HTML -->
<div class="mt-4">
	<div class="board-wrap" style="margin: 0 {Config.game.block_size}px;">
		<Board
			piece={$GeneratedPiecesStore[0]}
			cubes={$GeneratedBoardsStore[0]}
			horizontal_alignement={1}
			layer={0}
			background_picture={background_theme.left.picture}
			background_3Dto2D={background_3Dto2D_left}
		/>
		{#if background_theme.left._3d != undefined}
			{#each background_theme.left._3d.cubes as board}
				<Board
					cubes={board}
					horizontal_alignement={1}
					layer={-1}
					background={true}
					{background_without_front}
				/>
			{/each}
		{/if}
	</div>
	<div class="board-wrap" style="margin: 0 {Config.game.block_size}px;">
		{#if background_theme.right._3d != undefined}
			{#each background_theme.right._3d.cubes as board}
				<Board
					cubes={board}
					horizontal_alignement={-1}
					layer={-1}
					background={true}
					{background_without_front}
				/>
			{/each}
		{/if}
		<Board
			piece={$GeneratedPiecesStore[1]}
			cubes={$GeneratedBoardsStore[1]}
			horizontal_alignement={-1}
			layer={0}
			background_picture={background_theme.left.picture}
			background_3Dto2D={background_3Dto2D_right}
		/>
	</div>
</div>

<!-- ========================= CSS -->
<style lang="postcss">
	.board-wrap {
		@apply relative inline-block;
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
		perspective: 1000px;
	}
</style>
