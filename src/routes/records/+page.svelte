<script lang="ts">
    import { fade } from "svelte/transition";

    import type { Record } from "$lib/core/entities/Record";
    import { isLoading } from "$lib/stores/LoadingStore";
    import { RecordService } from "$lib/core/services/RecordService";
    import { BmiService } from "$lib/core/services/BmiService";
    import { startLoading, stopLoading } from "$lib/core/utils/loadingUtil";
    import CreateRecordModal from "$lib/components/CreateRecordModal.svelte";
    import DeleteModal from "$lib/components/DeleteModal.svelte";
    import EditRecordModal from "$lib/components/EditRecordModal.svelte";
    import ErrorComponent from "$lib/components/ErrorComponent.svelte";
    import SkeletonTable from "$lib/components/SkeletonTable.svelte";

	export let data;
	
	let recordsByMonth = data.records;
	let recordsToShow = recordsByMonth;
	let selectedClass = "default";
	let selectedMonth = data.currentMonth;

	let showEditModal = false;
	let showDeleteModal = false;
	let showCreateModal = false;
	let selectedRecord: Record | null = null;

	function openModal(modalType: string, record: Record | null = null) {
		if (modalType === "edit") {
			showEditModal = true;
			selectedRecord = record;
		} else if (modalType === "delete") {
			showDeleteModal = true;
			selectedRecord = record;
		} else if (modalType === "create") {
			showCreateModal = true;
		}
	}

	function closeModal(modalType: string) {
		if (modalType === "edit") {
			showEditModal = false;
			selectedRecord = null;
		} else if (modalType === "delete") {
			showDeleteModal = false;
			selectedRecord = null;
		} else if (modalType === "create") {
			showCreateModal = false;
		}
	}

	async function fetchRecordsByMonth() {
		if (selectedMonth) {
			startLoading();
			try {
				recordsByMonth = await RecordService.getRecordsBySchoolIdAndMonth(data.token!, data.user.schoolId, selectedMonth);
				recordsByMonth = recordsByMonth.sort((a, b) => b.bmi - a.bmi);
				filterRecordsByClass();
			} catch (error) {
				data.error = "Erro ao buscar os registros.";
			} finally {
				stopLoading();
			}
		}
	}

	async function filterRecordsByClass() {
		if (selectedClass) {
			if (selectedClass === "default") {
				recordsToShow = recordsByMonth;
				return;
			}			
			recordsToShow = recordsByMonth!.filter((record) => record.classId === selectedClass);
		}
	}

	async function handleUpdate(event: any) {
		const updatedRecord = event.detail;
		let index = recordsByMonth!.findIndex((record) => record.id === updatedRecord.id);
		if (index !== -1) {
			recordsByMonth![index] = updatedRecord;
		}
		recordsByMonth = recordsByMonth?.sort((a, b) => b.bmi - a.bmi);

		index = recordsToShow!.findIndex((record) => record.id === updatedRecord.id);
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

	async function handleDelete() {
		const recordId = selectedRecord!.id;

		recordsByMonth = recordsByMonth!.filter((record) => record.id !== recordId);
		recordsToShow = recordsToShow!.filter((record) => record.id !== recordId);

		try {
			await RecordService.delete(data.token!, recordId);
		} catch (error) {
			data.error = "Erro ao deletar o registro.";
		}
	}

	async function handleCreate(event: any) {
		const newRecord = event.detail;
		try {
			const recordId = await RecordService.create(data.token!, newRecord);
			newRecord.id = recordId;
			recordsByMonth = [...recordsByMonth!, newRecord];
			recordsByMonth = recordsByMonth?.sort((a, b) => b.bmi - a.bmi);
			if (selectedClass === "default" || selectedClass === newRecord.classId) {
				recordsToShow = [...recordsToShow!, newRecord];
				recordsToShow = recordsToShow?.sort((a, b) => b.bmi - a.bmi);
			}
		} catch (error) {
			data.error = "Erro ao criar o registro.";
		}
	}

	function getCssClassByBmi(age: number, bmi: number) {
		if (!age || !bmi) {
			return "bg-gray-300";
		}
		const bmiStatus = BmiService.getBmiStatus(age, bmi);
		if (bmiStatus === "Muito abaixo do peso" || bmiStatus === "Abaixo do peso") {
			return "bg-red-300";
		} else if (bmiStatus === "Peso normal") {
			return "bg-green-300";
		} else if (bmiStatus === "Acima do peso") {
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

				<button class="sm:block hidden btn btn-primary" on:click|stopPropagation={() => openModal("create")}>Adicionar registro</button>

				<button class="sm:hidden btn btn-primary btn-circle btn-lg text-3xl flex items-center fixed bottom-10 right-10 shadow-lg shadow-neutral-400 z-20" on:click|stopPropagation={() => openModal("create")}><i class='bx bx-plus'></i></button>

			</div>
			<div class="flex flex-wrap gap-2 max-w-full items-center">
				<select class="select select-bordered select-sm max-w-xs" bind:value={selectedClass} on:change={filterRecordsByClass}>
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
							<tr out:fade={{ duration: 200 }} class="hover cursor-pointer" on:click|stopPropagation={() => openModal("edit", record)}>
								<td>{record.classAlias}</td>
								<td class="text-nowrap">{record.studentName}</td>
								<td class="text-nowrap">{record.date}</td>
								<td>{record.ageAtMeasurement}</td>
								<td>{record.weight}</td>
								<td>{record.height}</td>
								<td class={getCssClassByBmi(record.ageAtMeasurement, record.bmi)}>{record.bmi}</td>
								<td class={`${getCssClassByBmi(record.ageAtMeasurement, record.bmi)} text-nowrap`}>{record.notes}</td>
								<td class="flex gap-2">
									<button class="btn btn-xs btn-neutral" on:click|stopPropagation={() => openModal("edit", record)}>Editar</button>
									<button class="btn btn-xs btn-error" on:click|stopPropagation={() => openModal("delete", record)}>
										<i class='bx bxs-trash text-white'></i>
									</button>
								</td>
							</tr>
							{/each}
							<tr>
								<td class="text-left" colspan="4"><b>Total: {recordsToShow.length}</b></td>
							</tr>
						</tbody>
					</table>
				</div>
			{/if}
		{/if}
	{/if}

	{#if showEditModal}
		<EditRecordModal record={selectedRecord} on:close={() => closeModal("edit")} on:save={handleUpdate}/>
	{/if}

	{#if showDeleteModal}
		<DeleteModal 
			item={selectedRecord}
			title="Deletar Registro"
			message="Tem certeza que deseja excluir este registro?"
			content="{selectedRecord?.studentName} - {selectedRecord?.date}"
			on:close={() => closeModal("delete")}
			on:delete={handleDelete}
		/>
	{/if}

	{#if showCreateModal}
		<CreateRecordModal students={data?.students} on:close={() => closeModal("create")} on:create={handleCreate}/>
	{/if}
</section>
  