<!-- ========================= SCRIPT -->
<script lang="ts">
	export let message: string;
	export let error = false;
</script>

<!-- ========================= HTML -->
<p class="{error ? 'text-red-300' : 'text-green-300'} my-2 mx-3">{message}</p>

<!-- ========================= CSS -->
<style lang="postcss">
	p {
		animation-name: disappear;
		animation-duration: 8s;
		animation-fill-mode: forwards;
	}

	@keyframes disappear {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			display: none;
		}
	}
</style>
