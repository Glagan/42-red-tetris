<!-- ========================= SCRIPT -->
<script lang="ts">
	import Notification from './notification.svelte';
	import NotificationStore from '../../stores/notification';
	import type _Notification from '../../lib/Notification';
	import Socket from '../../socket/socket';
	import { browser } from '$app/env';
	import { v4 as uuidv4 } from 'uuid';

	let notifications: Array<_Notification> = [
		{ message: 'ouidddd', error: true, id: uuidv4() },
		{ message: 'osdfasdfasdfasdd', error: false, id: uuidv4() },
		{ message: 'ouidddfsdfdd', error: true, id: uuidv4() }
	];

	if (browser) {
		Socket.on('connect', () => {
			console.log('haaaa');
			notifications.push({ message: 'connected', error: false, id: uuidv4() });
		});
	}

	function handle_notification() {}
</script>

<!-- ========================= HTML -->
<div class="absolute bottom-0 right-0 text-right" on:message={handle_notification}>
	{#each $NotificationStore as notification}
		<Notification message={notification.message} error={notification.error} />
	{/each}
</div>

<!-- ========================= CSS -->
<style lang="postcss">
</style>
