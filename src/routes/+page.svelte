<script lang="ts">
    import ErrorComponent from "$lib/components/ErrorComponent.svelte";
    import Chart from "$lib/components/PieChart.svelte";
    import { fade } from "svelte/transition";

	export let data;

	const content = {
		labels: ["Muito abaixo do peso", "Abaixo do peso", "Peso normal", "Acima do peso", "Obesidade grau 1", "Obesidade grau 2", "Obesidade grau 3"],
		datasets: [
			{
			data: [300, 50, 100, 40, 120],
			backgroundColor: [
				"#F7464A",
				"#46BFBD",
				"#FDB45C",
				"#949FB1",
				"#4D5360",
				"#AC64AD",
			],
			hoverBackgroundColor: [
				"#FF5A5E",
				"#5AD3D1",
				"#FFC870",
				"#A8B3C5",
				"#616774",
				"#DA92DB",
			],
			},
		],
	};

</script>

<svelte:head>
	<title>NutriKids - {data.school?.name}</title>
</svelte:head>

<section in:fade={{ duration: 300 }} class="w-full">
	{#if data.error}
		<ErrorComponent errorMessage={data.error} />
	{:else}
		<header class="text-center">
			<h1 class="text-3xl font-bold underline">
				{data.school?.name}
			</h1>
			<p class="text-xl">{data.school?.city} - {data.school?.state}</p>
		</header>

		<div class="flex flex-wrap justify-center p-2 gap-4">
			{#each data.classes ?? [] as classItem}
				<div class="card w-[30rem] bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">{classItem.name}</h2>
						<Chart content={content} />
					</div>
				</div>
			{/each}
		</div>
	{/if}  
</section>