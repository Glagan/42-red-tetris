<!-- ========================= SCRIPT -->
<script lang="ts">
	import CentralBox from './central-box.svelte';

	export let title = '';
	export let show_username = false;
	export let show_room = false;
	export let loading = false;
	export let loading_title = false;
	export let waiting_time = 0;
	export let extra_large = false;
</script>

<!-- ========================= HTML -->
<div class="absolute z-[100000]">
	<CentralBox
		{title}
		{show_username}
		{show_room}
		{loading}
		{loading_title}
		{waiting_time}
		{extra_large}
	>
		<slot />
	</CentralBox>
</div>
