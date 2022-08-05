<script lang="ts">
	import '$client/socket';
	import rooms from '$client/stores/rooms';
	import socket from '$client/socket';
	import currentRoom from '$client/stores/currentRoom';

	function joinRoom(roomId: string) {
		socket.emit('room:join', roomId, (room) => {
			console.log('joined room', room);
			if (room && !('message' in room)) {
				$currentRoom = room.id;
			} else {
				console.log('failed to join room', roomId);
			}
		});
	}

	function leaveRoom(roomId: string) {
		socket.emit('room:leave');
		$currentRoom = '';
	}
</script>

<h1 class="text-blue-400">Welcome to SvelteKit</h1>
<p>
	Visit <a class="text-red-400" href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<h1>Rooms</h1>
{#each $rooms as room (room.id)}
	<div>
		{room.id}
		{room.name}
		{#if $currentRoom == room.id}
			<button class="text-orange-300" on:click={leaveRoom.bind(null, room.id)}>Leave</button>
		{:else}
			<button class="text-blue-300" on:click={joinRoom.bind(null, room.id)}>Join</button>
		{/if}
		<div>
			{#each room.players as player}
				<span class="ml-4" />{player.id} {player.name} <br />
			{/each}
		</div>
	</div>
{/each}
