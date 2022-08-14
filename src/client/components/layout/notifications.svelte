<!-- ========================= SCRIPT -->
<script lang="ts">
	import { nanoid } from 'nanoid';
	import { browser } from '$app/env';
	import Notification from './notification.svelte';
	import NotificationStore from '$client/stores/notification';
	import type _Notification from '$client/lib/Notification';
	import Socket from '$client/socket/socket';

	if (browser) {
		Socket.on('connect', () => {
			NotificationStore.push({ message: 'connected', error: false, id: nanoid() });
		});
	}
</script>

<!-- ========================= HTML -->
<div class="absolute bottom-0 right-0 text-right">
	{#each $NotificationStore as notification}
		<Notification message={notification.message} error={notification.error} />
	{/each}
</div>

<!-- ========================= CSS -->
<style lang="postcss">
</style>
