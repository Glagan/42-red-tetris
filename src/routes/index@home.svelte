<!-- ========================= SCRIPT -->
<script lang="ts">
	import UsernameStore from '../client/stores/username';
	import { browser } from '$app/env';
	import CentralBox from '../client/components/containers/central_box.svelte';
	import WinnerStore from '$client/stores/winner';
	import OpponenReadytStore from '../client/stores/opponentReady';
	import * as Sounds from '../client/effects/sounds';
	import Username from '../client/socket/username.emit';

	let username = '';
	let loading = false;

	if (browser && $UsernameStore.length > 0) {
		username = $UsernameStore;
	}

	$: disabled = username.length == 0 || loading;

	function onClick() {
		loading = true;
		Username(username, () => {
			loading = false;
		});
	}

	OpponenReadytStore.set(false);
	WinnerStore.remove();
</script>

<!-- ========================= HTML -->
<CentralBox title="Username" {loading}>
	<input
		type="text"
		class="text-input"
		placeholder="Your username"
		bind:value={username}
		on:input={Sounds.text}
	/>
	<button class="mt-5" on:click={onClick} {disabled}>Enter</button>
</CentralBox>
