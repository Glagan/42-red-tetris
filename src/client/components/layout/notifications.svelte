<!-- ========================= SCRIPT -->
<script lang="ts">
	import { nanoid } from 'nanoid';
	import { browser } from '$app/env';
	import Notification from './notification.svelte';
	import NotificationStore from '../../stores/notification';
	import type _Notification from '../../lib/Notification';
	import Socket from '../../socket/socket';

	let notifications: Array<_Notification> = [
		{ message: 'ouidddd', error: true, id: nanoid() },
		{ message: 'osdfasdfasdfasdd', error: false, id: nanoid() },
		{ message: 'ouidddfsdfdd', error: true, id: nanoid() }
	];

	if (browser) {
		Socket.on('connect', () => {
			console.log('haaaa');
			notifications.push({ message: 'connected', error: false, id: nanoid() });
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
