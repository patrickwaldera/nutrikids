<script>
	import { Pie } from "svelte-chartjs";
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js"

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

	export let content;
</script>

<section>
	<Pie data={content} />
</section>