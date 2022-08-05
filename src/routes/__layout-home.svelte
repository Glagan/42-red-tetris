<!-- ========================= SCRIPT -->
<script lang="ts">
	import '../app.css';
	import Header from '../client/components/layout/header.svelte';
</script>

<!-- ========================= HTML -->
<Header />
<main
	class="text-center w-full h-full flex flex-col justify-center align-middle content-center items-center"
>
	<slot />
</main>
