<!-- ========================= SCRIPT -->
<script lang="ts">
	import Config from '$client/config';
	import dimensions from '$stores/dimensions';
	import shadow from '$stores/shadow';

	export let sprites: string[] = ['/sprites/default/cross.png'];

	$: spriteSide = sprites[0];
	$: spriteTop = sprites.length >= 2 ? sprites[1] : spriteSide;
	$: spriteBottom = sprites.length >= 3 ? sprites[2] : spriteTop;

	export let x: number;
	export let y: number;
	export let zIndex = 0;
	export let layer = 0;
	export let background = false;
	export let horizontalAlignement: number | undefined = undefined;
	export let opacity = 1;
	export let noFront = false;
	export let infoMode = false;
	export let spectre = false;
	export let onlyFront = false;

	$: onlyBack = $dimensions === 2;

	$: xInPx = x * (infoMode ? Config.gameInfo.blockSize : Config.game.blockSize);
	$: yInPx = y * (infoMode ? Config.gameInfo.blockSize : Config.game.blockSize);
	$: zInPx = layer * (infoMode ? Config.gameInfo.blockSize : Config.game.blockSize);

	$: showFront =
		!onlyBack && (onlyFront || (!noFront && !(background && Config.game.background._3Dto2D)));

	$: showBack =
		!(Config.game.background._3Dto2D && background) && (onlyBack || (!onlyFront && opacity != 1));

	$: showLeft =
		!onlyBack &&
		((!onlyFront && opacity != 1) ||
			(horizontalAlignement != undefined && horizontalAlignement <= 0 && !(background && x != 0)));

	$: showRight =
		!onlyBack &&
		((!onlyFront && opacity != 1) ||
			(horizontalAlignement != undefined && horizontalAlignement >= 0 && !(background && x != 9)));

	$: showTop = !onlyBack && ((!onlyFront && opacity != 1) || (y > 9 && !background));
	$: showBottom = !onlyBack && ((!onlyFront && opacity != 1) || (y < 9 && !background));

	$: inBoard = x >= 0 && x < 10 && y >= 0 && y < 20;
	$: show = inBoard && (showFront || showBack || showLeft || showRight || showTop || showBottom);
</script>

<!-- ========================= HTML -->
{#if show}
	<div
		class:info={infoMode}
		class:pseudo-shadow={$shadow}
		class="cube select-none"
		style="transform: translate3d({xInPx}px, {yInPx}px , {zInPx}px); z-index: {zIndex}; will-change: {background
			? 'transform'
			: 'transform'}; contain: {background ? 'layout' : 'none'};"
	>
		{#if showFront}
			<div class:spectre class="front" style="background-image: url('{spriteSide}');" />
		{/if}
		{#if showBack}
			<div class:spectre class="back" style="background-image: url('{spriteSide}');" />
		{/if}
		{#if showTop}
			<div class:spectre class="top" style="background-image: url('{spriteTop}');" />
		{/if}
		{#if showBottom}
			<div class:spectre class="bottom" style="background-image: url('{spriteBottom}');" />
		{/if}
		{#if showLeft}
			<div class:spectre class="left" style="background-image: url('{spriteSide}');" />
		{/if}
		{#if showRight}
			<div class:spectre class="right" style="background-image: url('{spriteSide}');" />
		{/if}
	</div>
{/if}

<!-- ========================= CSS -->
<style lang="postcss">
	.cube {
		position: absolute;
		margin: auto;
		height: var(--cube-size);
		width: var(--cube-size);
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
	}

	.spectre {
		@apply opacity-50;
	}

	.info {
		height: var(--cube-info-size);
		width: var(--cube-info-size);
	}

	.cube > div {
		@apply select-none;
		position: absolute;
		box-sizing: border-box;
		text-align: center;
		height: 100%;
		width: 100%;
		background-position: center;
		background-size: cover;
	}

	.cube > .front {
		-webkit-transform: translateZ(var(--cube-half-size));
		transform: translateZ(var(--cube-half-size));
		/* background-color: #00d7ff; */
	}

	.cube.pseudo-shadow > .front {
		filter: brightness(95%);
	}

	.cube > .back {
		-webkit-transform: translateZ(var(--cube-half-size-negative)) rotateY(180deg);
		transform: translateZ(var(--cube-half-size-negative)) rotateY(180deg);
		/* background-color: #e86836; */
	}

	.cube > .right {
		-webkit-transform: rotateY(-270deg) translateX(var(--cube-half-size));
		transform: rotateY(-270deg) translateX(var(--cube-half-size));
		transform-origin: top right;
		/* background-color: #ffc900; */
	}

	.cube.pseudo-shadow > .right {
		filter: brightness(70%);
	}

	.cube > .left {
		-webkit-transform: rotateY(270deg) translateX(var(--cube-half-size-negative));
		transform: rotateY(270deg) translateX(var(--cube-half-size-negative));
		transform-origin: center left;
		/* background-color: #00ff73; */
	}

	.cube.pseudo-shadow > .left {
		filter: brightness(80%);
	}

	.cube > .top {
		-webkit-transform: rotateX(-270deg) translateY(var(--cube-half-size-negative));
		transform: rotateX(-270deg) translateY(var(--cube-half-size-negative));
		transform-origin: top center;
		/* background-color: #ff00f9; */
	}

	.cube > .bottom {
		-webkit-transform: rotateX(270deg) translateY(var(--cube-half-size));
		transform: rotateX(270deg) translateY(var(--cube-half-size));
		transform-origin: bottom center;
		/* background-color: #7552bc; */
	}

	.cube.pseudo-shadow > .bottom {
		filter: brightness(50%);
	}
</style>
