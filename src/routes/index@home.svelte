<!-- ========================= SCRIPT -->
<script lang="ts">
	import UsernameStore from '../client/stores/username';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import CentralBox from '../client/components/containers/central_box.svelte';
	
	let username = '';

	if (browser && $UsernameStore.length > 0) {
		username = $UsernameStore
	}


	$: disabled_enter = username.length == 0;

	function handle_enter() {
		if (username.length > 0) {
			UsernameStore.set(username);
			goto('/search');
		}
	}
</script>

<!-- ========================= HTML -->
<CentralBox title="Username">
	<input type="text" class="text-input" placeholder="Your username" bind:value={username} />
	<button class="mt-5" on:click={handle_enter} disabled={disabled_enter}>Enter</button>
</CentralBox>
