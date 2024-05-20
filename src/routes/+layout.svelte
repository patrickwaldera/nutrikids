<script lang="ts">
	import "../app.css"

    import Footer from "$lib/components/Footer.svelte";
    import Header from "$lib/components/Header.svelte";
    import Navbar from "$lib/components/Navbar.svelte";

	export let data;
</script>

<svelte:head>
	<link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
</svelte:head>

<div class="app">
	<Header />
	{#if data.user !== null}
		<Navbar />
	{/if}

	<main>
		<slot />
	</main>

	<Footer />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
		align-items: center;
	}
</style>
