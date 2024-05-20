<script lang="ts">
    import ErrorComponent from "$lib/components/ErrorComponent.svelte";
    import SkeletonTable from "$lib/components/SkeletonTable.svelte";
    import { RecordsService } from "$lib/core/services/RecordsService.js";
    import { startLoading, stopLoading } from "$lib/core/utils/LoadingUtil.js";
    import { isLoading } from "$lib/stores/LoadingStore.js";
    import { fade } from "svelte/transition";

	export let data;

	$: selectedMonth = data.selectedMonth;

	$: records = data.records;

	async function fetchRecordsByMonth() {
		if (selectedMonth) {
			startLoading();
			try {
				records = await RecordsService.getRecordsBySchoolIdAndMonth(data.token!, data.user.schoolId, selectedMonth);
			} catch (error) {
				data.error = "Erro ao buscar os registros";
			} finally {
				stopLoading();
			}
		}
	}
</script>

<section transition:fade={{ duration: 300 }} class="w-full">
	{#if data.error}
		<ErrorComponent />
	{:else}
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-3xl font-bold underline">Registros</h1>
			</div>
			<select class="select select-bordered w-48 max-w-xs" bind:value={data.selectedMonth} on:change={fetchRecordsByMonth}>
				<option disabled selected>Selecione o mês</option>
				{#each data.months as {value, label}}
				<option value={value}>{label}</option>
				{/each}
			</select>
		</div>

		{#if $isLoading}
			<div class="mt-6">
				<SkeletonTable />
			</div>
		{:else}
			{#if records}
				<div class="overflow-x-auto mt-6">
					<table class="table table-xs">
					<thead>
						<tr>
							<th>Nome</th> 
							<th>Idade na medição</th> 
							<th>Altura (cm)</th> 
							<th>Peso (kg)</th> 
							<th>IMC</th> 
							<th>Notas</th>
						</tr>
					</thead> 
						<tbody>
							{#each records as record}
							<tr>
								<td class="text-nowrap">{record.studentName}</td>
								<td>{record.ageAtMeasurement}</td>
								<td>{record.height}</td>
								<td>{record.weight}</td>
								<td>{record.bmi}</td>
								<td>{record.notes}</td>
								<td class="flex gap-2">
									<button class="btn btn-xs btn-neutral">Editar</button>
									<button class="btn btn-xs btn-error">
										<i class='bx bxs-trash'></i>
									</button>
								</td>
							</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		{/if}
	{/if}
</section>
  