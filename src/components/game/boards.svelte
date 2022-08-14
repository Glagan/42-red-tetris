<!-- ========================= SCRIPT -->
<script lang="ts">
	import Board from './board.svelte';
	import generatedBoards from '$client/stores/generatedBoards';
	import theme from '$client/stores/theme';
	import generatedPieces from '$client/stores/generatedPieces';
	import generatedSpectres from '$client/stores/generatedSpectres';
	import Config from '$client/config';
	import convert3Dto2D from '$client/themes/generators/3Dto2D';
	import { browser } from '$app/env';
	import Themes from '$client/themes/themes';

	export let solo: boolean;

	$: backgroundTheme = Themes[$theme].background;
	let background3Dto2Dleft: string | undefined = undefined;
	let background3Dto2Dright: string | undefined = undefined;

	$: backgroundWithoutFront =
		background3Dto2Dleft != undefined && background3Dto2Dright != undefined;

	let horizontalAlignement: 0 | 1;
	$: horizontalAlignement = solo ? 0 : 1;

	async function generate2DBackgroundsFrom3D() {
		if (backgroundTheme?.left?._3d != undefined && backgroundTheme?.right?._3d != undefined) {
			background3Dto2Dleft = await convert3Dto2D(
				backgroundTheme.left._3d.cubeSize,
				backgroundTheme.left._3d.cubes[0]
			);
			background3Dto2Dright = await convert3Dto2D(
				backgroundTheme.left._3d.cubeSize,
				backgroundTheme.right._3d.cubes[0]
			);
		}
	}

	$: if (browser && Config.game.background._3Dto2D && backgroundTheme) {
		generate2DBackgroundsFrom3D();
	}
</script>

<!-- ========================= HTML -->
<div class="mt-4">
	<div class="board-wrap" style="margin: 0 {Config.game.blockSize}px;">
		<Board
			piece={$generatedPieces[0]}
			spectre={$generatedSpectres[0]}
			cubes={$generatedBoards[0]}
			{horizontalAlignement}
			layer={0}
			backgroundPicture={backgroundTheme.left.picture}
			background3Dto2D={background3Dto2Dleft}
			backgroundBrightness={backgroundTheme.left.brightness}
		/>
		{#if backgroundTheme.left._3d != undefined}
			{#each backgroundTheme.left._3d.cubes as board}
				<Board
					cubes={board}
					{horizontalAlignement}
					layer={-1}
					background={true}
					{backgroundWithoutFront}
					backgroundBrightness={backgroundTheme.left.brightness}
				/>
			{/each}
		{/if}
	</div>
	{#if !solo}
		<div class="board-wrap" style="margin: 0 {Config.game.blockSize}px;">
			<Board
				piece={$generatedPieces[1]}
				spectre={$generatedSpectres[1]}
				cubes={$generatedBoards[1]}
				horizontalAlignement={-1}
				layer={0}
				backgroundPicture={backgroundTheme.right.picture}
				background3Dto2D={background3Dto2Dright}
				backgroundBrightness={backgroundTheme.right.brightness}
			/>
			{#if backgroundTheme.right._3d != undefined}
				{#each backgroundTheme.right._3d.cubes as board}
					<Board
						cubes={board}
						horizontalAlignement={-1}
						layer={-1}
						background={true}
						{backgroundWithoutFront}
						backgroundBrightness={backgroundTheme.left.brightness}
					/>
				{/each}
			{/if}
		</div>
	{/if}
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
