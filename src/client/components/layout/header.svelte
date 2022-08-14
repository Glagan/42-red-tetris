<!-- ========================= HTML -->

<header class="absolute w-full text-center z-[10000000]">
	<div class="relative p-6 w-fit m-auto">
		<h1>
			<span class="text-red-300">T</span>
			<span class="text-inherit">E</span>
			<span class="text-yellow-300">T</span>
			<span class="text-blue-300">R</span>
			<span class="text-green-300">I</span>
			<span class="text-pink-300">S</span>
			<span class="pl-3 absolute right-0 rotate text-inherit text-xl text-center">3D</span>
		</h1>
	</div>
</header>

<!-- ========================= CSS -->
<style lang="postcss">
	.rotate {
		animation: rotation 5s infinite linear;
	}

	@keyframes rotation {
		from {
			transform: rotateY(0deg) rotate(10deg) translateY(30px);
		}
		to {
			transform: rotateY(359deg) rotate(10deg) translateY(30px);
		}
	}
</style>
