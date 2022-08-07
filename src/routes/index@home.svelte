<!-- ========================= SCRIPT -->
<script lang="ts">
	import UsernameStore from '../client/stores/username';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import CentralBox from '../client/components/containers/central_box.svelte';
	import Socket from '../client/home-socket';
	import type { BasicError } from '../socket';
	import NotificationStore from '../client/stores/notification';
	import { v4 as uuidv4 } from 'uuid';

	let username = '';
	let loading = false;

	if (browser && $UsernameStore.length > 0) {
		username = $UsernameStore;
	}

	$: disabled_enter = username.length == 0;

	function handle_enter() {
		loading = true;
		if (username.length > 0) {
			Socket.emit('set:username', username, (success: boolean | BasicError) => {
				if (typeof success == 'boolean' && success) {
					localStorage.setItem('username', username);
					UsernameStore.set(username);
					NotificationStore.push({ id: uuidv4(), message: 'username updated', error: false });
					goto('/search');
				} else
					NotificationStore.push({ id: uuidv4(), message: 'username not updated', error: true });
				loading = false;
			});
		}
	}
</script>

<!-- ========================= HTML -->
<CentralBox title="Username" bind:loading>
	<input type="text" class="text-input" placeholder="Your username" bind:value={username} />
	<button class="mt-5" on:click={handle_enter} disabled={disabled_enter}>Enter</button>
</CentralBox>
