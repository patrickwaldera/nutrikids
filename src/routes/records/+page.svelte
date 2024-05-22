<script lang="ts">
    import DeleteModal from "$lib/components/DeleteModal.svelte";
    import EditRecordModal from "$lib/components/EditRecordModal.svelte";
    import ErrorComponent from "$lib/components/ErrorComponent.svelte";
    import SkeletonTable from "$lib/components/SkeletonTable.svelte";
    import type { Record } from "$lib/core/entities/Record";
    import { RecordService } from "$lib/core/services/RecordService";
    import { startLoading, stopLoading } from "$lib/core/utils/LoadingUtil";
    import { isLoading } from "$lib/stores/LoadingStore.js";
    import { fade } from "svelte/transition";

	export let data;
	
	let recordsByMonth = data.records;
	let recordsToShow = recordsByMonth;
	let selectedClass = "default";
	let selectedMonth = data.currentMonth;

	let showEditModal = false;
	let showDeleteModal = false;
	let selectedRecord: Record | null = null;

	async function fetchRecordsByMonth() {
		if (selectedMonth) {
			startLoading();
			try {
				recordsByMonth = await RecordService.getRecordsBySchoolIdAndMonth(data.token!, data.user.schoolId, selectedMonth);
				recordsByMonth = recordsByMonth.sort((a, b) => b.bmi - a.bmi);
				filterByClass();
			} catch (error) {
				data.error = "Erro ao buscar os registros.";
			} finally {
				stopLoading();
			}
		}
	}

	async function filterByClass() {
		if (selectedClass) {
			if (selectedClass === "default") {
				recordsToShow = recordsByMonth;
				return;
			}			
			recordsToShow = recordsByMonth!.filter((record) => record.classId === selectedClass);
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
		const index = recordsToShow!.findIndex((record) => record.id === updatedRecord.id);
		if (index !== -1) {
			recordsToShow![index] = updatedRecord;
		}
		recordsToShow = recordsToShow?.sort((a, b) => b.bmi - a.bmi);
		try {
			await RecordService.update(data.token!, updatedRecord);
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
		const index = recordsToShow!.findIndex((record) => record.id === selectedRecord!.id);
		if (index !== -1) {
			recordsToShow!.splice(index, 1);
			recordsToShow = recordsToShow;
		}
		try {
			await RecordService.delete(data.token!, selectedRecord!.id);
		} catch (error) {
			data.error = "Erro ao deletar o registro.";
		}
	}

	function getCssClassByBmi(bmi: number) {
		if (bmi < 18.5) {
			return "bg-red-300";
		} else if (bmi >= 18.5 && bmi < 25) {
			return "bg-green-300";
		} else if (bmi >= 25 && bmi < 30) {
			return "bg-yellow-300";
		} else {
			return "bg-red-400";
		}
	}

</script>

<svelte:head>
	<title>NutriKids - Registros</title>
</svelte:head>

<section in:fade={{ duration: 300 }} class="w-full">
	{#if data.error}
		<ErrorComponent errorMessage={data.error} />
	{:else}
		<div class="flex flex-wrap justify-between items-center gap-4 w-full">
			<div class="flex flex-wrap gap-6 justify-between items-center">
				<h1 class="text-3xl font-bold underline">Registros</h1>

				<button class="sm:block hidden btn btn-primary" on:click={() => console.log("// TODO add")}>Adicionar registro</button>

				<button class="sm:hidden btn btn-primary btn-circle btn-lg text-3xl flex items-center fixed bottom-10 right-10 shadow-lg shadow-neutral-400" on:click={() => console.log("// TODO add")}><i class='bx bx-plus'></i></button>

			</div>
			<div class="flex flex-wrap gap-2 max-w-full items-center">
				<select class="select select-bordered select-sm max-w-xs" bind:value={selectedClass} on:change={filterByClass}>
					<option value="default" selected>Selecione uma turma</option>
					{#each data.classes ?? [] as {id, name}}
					<option value={id}>{name}</option>
					{/each}
				</select>
				<select class="select select-bordered select-sm max-w-xs" bind:value={selectedMonth} on:change={fetchRecordsByMonth}>
					<option disabled selected>Selecione o mês</option>
					{#each data.months ?? [] as {value, label}}
					<option value={value}>{label}</option>
					{/each}
				</select>
			</div>
		</div>

		{#if $isLoading}
			<div class="mt-6">
				<SkeletonTable />
			</div>
		{:else}
			{#if recordsToShow?.length === 0}
				<div class="mt-6">
					<p>Nenhum registro encontrado.</p>
				</div>
			{/if}
			{#if recordsToShow && recordsToShow.length > 0}
				<div class="overflow-x-auto mt-6">
					<table class="table table-xs">
					<thead>
						<tr>
							<th>Turma</th>
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
							{#each recordsToShow ?? [] as record}
							<tr out:fade={{ duration: 200 }} class="hover cursor-pointer" on:click={() => openEditModal(record)}>
								<td>{record.classAlias}</td>
								<td class="text-nowrap">{record.studentName}</td>
								<td class="text-nowrap">{record.date}</td>
								<td>{record.ageAtMeasurement}</td>
								<td>{record.weight}</td>
								<td>{record.height}</td>
								<td class={getCssClassByBmi(record.bmi)}>{record.bmi}</td>
								<td class={`${getCssClassByBmi(record.bmi)} text-nowrap`}>{record.notes}</td>
								<td class="flex gap-2">
									<button class="btn btn-xs btn-neutral" on:click={() => openEditModal(record)}>Editar</button>
									<button class="btn btn-xs btn-error" on:click|stopPropagation={() => openDeleteModal(record)}>
										<i class='bx bxs-trash text-white'></i>
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
		<EditRecordModal record={selectedRecord} on:close={closeEditModal} on:save={handleUpdate}/>
	{/if}

	{#if showDeleteModal}
		<DeleteModal 
			item={selectedRecord}
			title="Deletar Registro"
			message="Tem certeza que deseja excluir este registro?"
			content="{selectedRecord?.studentName} - {selectedRecord?.date}"
			on:close={closeDeleteModal}
			on:delete={handleDelete}
		/>
	{/if}
</section>
  