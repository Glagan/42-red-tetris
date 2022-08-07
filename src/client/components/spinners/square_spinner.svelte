<!-- ========================= HTML -->
<div>
	<div class="square-spinner" style="animation-delay: 0s;" />
</div>

<!-- ========================= CSS -->
<style lang="postcss">
	div {
		font-size: 0;
	}

	.square-spinner {
		@apply w-[32px] h-[32px] bg-white absolute z-50;
		animation: square-spinner-animation 4s infinite;
		top: calc(50% - 16px);
		left: calc(50% - 16px);
	}

	@keyframes square-spinner-animation {
		0% {
			transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
		}
		25% {
			transform: rotateX(0deg) rotateY(180deg) rotateZ(45deg);
		}
		50% {
			transform: rotateX(180deg) rotateY(180deg) rotateZ(90deg);
		}
		75% {
			transform: rotateX(180deg) rotateY(0deg) rotateZ(45deg);
		}
	}
</style>
