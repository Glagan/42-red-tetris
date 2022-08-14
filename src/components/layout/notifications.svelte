<!-- ========================= SCRIPT -->
<script lang="ts">
	import { nanoid } from 'nanoid';
	import { browser } from '$app/env';
	import Notification from './notification.svelte';
	import notifications from '$client/stores/notification';
	import socket from '$client/socket/socket';

	if (browser) {
		socket.on('connect', () => {
			notifications.push({ message: 'connected', error: false, id: nanoid() });
		});
	}
</script>

<!-- ========================= HTML -->
<div class="absolute bottom-0 right-0 text-right">
	{#each $notifications as notification}
		<Notification message={notification.message} error={notification.error} />
	{/each}
</div>

<!-- ========================= CSS -->
<style lang="postcss">
</style>
