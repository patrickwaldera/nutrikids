<script lang="ts">
    import DeleteModal from "$lib/components/DeleteModal.svelte";
    import EditModal from "$lib/components/EditModal.svelte";
    import ErrorComponent from "$lib/components/ErrorComponent.svelte";
    import SkeletonTable from "$lib/components/SkeletonTable.svelte";
    import type { Record } from "$lib/core/entities/Record.js";
    import { RecordsService } from "$lib/core/services/RecordsService.js";
    import { startLoading, stopLoading } from "$lib/core/utils/LoadingUtil.js";
    import { isLoading } from "$lib/stores/LoadingStore.js";
    import { fade } from "svelte/transition";

	export let data;

	$: selectedMonth = data.selectedMonth;
	$: records = data.records;

	let showEditModal = false;
	let showDeleteModal = false;
	let selectedRecord: Record | null = null;

	async function fetchRecordsByMonth() {
		if (selectedMonth) {
			startLoading();
			try {
				records = await RecordsService.getRecordsBySchoolIdAndMonth(data.token!, data.user.schoolId, selectedMonth);
			} catch (error) {
				data.error = "Erro ao buscar os registros.";
			} finally {
				stopLoading();
			}
		}
	}

	function openEditModal(record: Record) {
		showEditModal = true;
		selectedRecord = record;
	}

	function closeEditModal() {
		showEditModal = false;
		selectedRecord = null;
	}

	async function handleUpdate(event: any) {
		const updatedRecord = event.detail;
		const index = records!.findIndex((record) => record.id === updatedRecord.id);
		if (index !== -1) {
			records![index] = updatedRecord;
		}
		try {
			await RecordsService.update(data.token!, updatedRecord);
		} catch (error) {
			data.error = "Erro ao atualizar o registro.";
		}
	}

	function openDeleteModal(record: Record) {
		showDeleteModal = true;
		selectedRecord = record;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		selectedRecord = null;
	}

	async function handleDelete() {
		const index = records!.findIndex((record) => record.id === selectedRecord!.id);
		if (index !== -1) {
			records!.splice(index, 1);
			records = records;
		}
		try {
			await RecordsService.delete(data.token!, selectedRecord!.id);
		} catch (error) {
			data.error = "Erro ao deletar o registro.";
		}
	}

</script>

<section in:fade={{ duration: 300 }} class="w-full">
	{#if data.error}
		<ErrorComponent errorMessage={data.error} />
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
			{#if records?.length === 0}
				<div class="mt-6">
					<p>Nenhum registro encontrado.</p>
				</div>
			{/if}
			{#if records && records.length > 0}
				<div class="overflow-x-auto mt-6">
					<table class="table table-xs">
					<thead>
						<tr>
							<th>Nome</th> 
							<th>Data</th>
							<th>Idade na medição</th> 
							<th>Peso (kg)</th> 
							<th>Altura (cm)</th> 
							<th>IMC</th> 
							<th>Notas</th>
						</tr>
					</thead> 
						<tbody>
							{#each records as record}
							<tr out:fade={{ duration: 200 }}>
								<td class="text-nowrap">{record.studentName}</td>
								<td>{record.date}</td>
								<td>{record.ageAtMeasurement}</td>
								<td>{record.weight}</td>
								<td>{record.height}</td>
								<td>{record.bmi}</td>
								<td>{record.notes}</td>
								<td class="flex gap-2">
									<button class="btn btn-xs btn-neutral" on:click={() => openEditModal(record)}>Editar</button>
									<button class="btn btn-xs btn-error" on:click={() => openDeleteModal(record)}>
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

	{#if showEditModal}
		<EditModal record={selectedRecord} on:close={closeEditModal} on:save={handleUpdate}/>
	{/if}

	{#if showDeleteModal}
		<DeleteModal record={selectedRecord} on:close={closeDeleteModal} on:delete={handleDelete}/>
	{/if}
</section>
  