<script lang="ts">
	import '../app.css';
	import '$client/socket';
	import rooms from '$client/stores/rooms';
</script>

<h1 class="text-blue-400">Welcome to SvelteKit</h1>
<p>
	Visit <a class="text-red-400" href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<h1>Rooms</h1>
{#each $rooms as room (room.id)}
	<div>{room.id}</div>
{/each}
