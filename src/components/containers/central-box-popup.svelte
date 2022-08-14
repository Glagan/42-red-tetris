<!-- ========================= SCRIPT -->
<script lang="ts">
	import CentralBox from './central-box.svelte';

	export let title = '';
	export let showUsername = false;
	export let showRoom = false;
	export let loading = false;
	export let loadingTitle = false;
	export let waitingTime = 0;
	export let extraLarge = false;
</script>

<!-- ========================= HTML -->
<div class="absolute z-[100000]">
	<CentralBox {title} {showUsername} {showRoom} {loading} {loadingTitle} {waitingTime} {extraLarge}>
		<slot />
	</CentralBox>
</div>
