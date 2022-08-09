<!-- ========================= SCRIPT -->
<script lang="ts">
	import { nanoid } from 'nanoid';
	import UsernameStore from '../client/stores/username';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import CentralBox from '../client/components/containers/central_box.svelte';
	import Socket from '../client/socket/socket';
	import type { BasicError } from '../socket';
	import WinnerStore from '$client/stores/winner';
	import NotificationStore from '../client/stores/notification';
	import OpponenReadytStore from '../client/stores/opponentReady';

	let username = '';
	let loading = false;

	if (browser && $UsernameStore.length > 0) {
		username = $UsernameStore;
	}

	$: disabled_enter = username.length == 0;

	function handle_enter() {
		if ($UsernameStore == username) return goto('/search');
		loading = true;
		if (username.length > 0) {
			Socket.emit(
				'set:username',
				username,
				(success: boolean, error: BasicError | null | undefined) => {
					if (error != null && error != undefined) {
						NotificationStore.push({ id: nanoid(), message: error.message, error: true });
					} else {
						if (success) {
							localStorage.setItem('username', username);
							UsernameStore.set(username);
							NotificationStore.push({ id: nanoid(), message: 'username updated', error: false });
							goto('/search');
						} else {
							NotificationStore.push({
								id: nanoid(),
								message: 'username not updated',
								error: true
							});
						}
					}
					loading = false;
				}
			);
		}
	}

	OpponenReadytStore.set(false);
	WinnerStore.remove();
</script>

<!-- ========================= HTML -->
<CentralBox title="Username" {loading}>
	<input type="text" class="text-input" placeholder="Your username" bind:value={username} />
	<button class="mt-5" on:click={handle_enter} disabled={disabled_enter}>Enter</button>
</CentralBox>
