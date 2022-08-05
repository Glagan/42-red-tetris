<!-- ========================= SCRIPT -->
<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import PseudoStore from '../stores/pseudo';
	import CentralBox from '../components/containers/central_box.svelte';

	if (browser && $PseudoStore.length > 0) {
		goto('/search');
	}

	let pseudo = '';

	$: disabled_enter = pseudo.length == 0;

	function handle_enter() {
		if (pseudo.length > 0) {
			PseudoStore.set(pseudo);
			goto('/search');
		}
	}
</script>

<!-- ========================= HTML -->
<CentralBox title="Pseudo">
	<input type="text" class="text-input" placeholder="Your pseudo" bind:value={pseudo} />
	<button class="mt-5" on:click={handle_enter} disabled={disabled_enter}>Enter</button>
</CentralBox>
