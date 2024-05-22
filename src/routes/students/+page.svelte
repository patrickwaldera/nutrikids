<script lang="ts">
    import { fade } from "svelte/transition";
	import type { Student } from "$lib/core/entities/Student";
	import ErrorComponent from "$lib/components/ErrorComponent.svelte";
    import DeleteModal from "$lib/components/DeleteModal.svelte";
    import EditStudentModal from "$lib/components/EditStudentModal.svelte";
    import { calculateAge } from "$lib/core/utils/Date";
    import { StudentService } from "$lib/core/services/StudentService";

	export let data;

	let selectedClass = "default";
	let students = data.students;
	let studentsToShow = students;

	let showEditModal = false;
	let showDeleteModal = false;
	let selectedStudent: Student | null = null;

	function filterByClass() {
		if (selectedClass === "default") {
			studentsToShow = students;
		} else {
			studentsToShow = data?.students?.filter((student: any) => student.classId === selectedClass);
		}
	}

	function openEditModal(record: Student) {
		showEditModal = true;
		selectedStudent = record;
	}

	function closeEditModal() {
		showEditModal = false;
		selectedStudent = null;
	}

	async function handleUpdate(event: any) {
		const updatedStudent = event.detail;
		const index = studentsToShow!.findIndex((record) => record.id === updatedStudent.id);
		if (index !== -1) {
			studentsToShow![index] = updatedStudent;
		}
		studentsToShow = studentsToShow?.sort((a, b) => a.name.localeCompare(b.name));
		try {
			await StudentService.update(data.token!, updatedStudent);
		} catch (error) {
			data.error = "Erro ao atualizar o registro.";
		}
	}

	function openDeleteModal(record: Student) {
		showDeleteModal = true;
		selectedStudent = record;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		selectedStudent = null;
	}

	async function handleDelete() {
		const index = studentsToShow!.findIndex((record) => record.id === selectedStudent!.id);
		if (index !== -1) {
			studentsToShow!.splice(index, 1);
			studentsToShow = studentsToShow;
		}
		try {
			await StudentService.delete(data.token!, selectedStudent!.id);
		} catch (error) {
			data.error = "Erro ao deletar o registro.";
		}
	}

</script>

<svelte:head>
	<title>NutriKids - Alunos</title>
</svelte:head>

<section in:fade={{ duration: 300 }} class="w-full">
	{#if data.error}
		<ErrorComponent errorMessage={data.error} />
	{:else}
		<div class="flex flex-wrap justify-between items-center gap-4">
			<div>
				<h1 class="text-3xl font-bold underline">Alunos</h1>
			</div>
			<div class="flex gap-2">
				<select class="select select-bordered max-w-xs" bind:value={selectedClass} on:change={filterByClass}>
					<option value="default" selected>Selecione uma turma</option>
					{#each data.classes ?? [] as {id, name}}
						<option value={id}>{name}</option>
					{/each}
				</select>
			</div>
		</div>
		{#if studentsToShow?.length === 0}
			<div class="mt-6">
				<p>Nenhum registro encontrado.</p>
			</div>
		{/if}
		{#if studentsToShow && studentsToShow.length > 0}
			<div class="overflow-x-auto mt-6">
				<table class="table table-xs">
				<thead>
					<tr>
						<th>Nome</th> 
						<th>Data de nascimento</th>
						<th>Idade</th>
						<th>Turma</th> 
					</tr>
				</thead> 
					<tbody>
						{#each studentsToShow ?? [] as student}
							<tr out:fade={{ duration: 200 }} class="hover cursor-pointer" on:click={() => openEditModal(student)}>
								<td>{student.name}</td>
								<td class="text-nowrap">{student.birthDate}</td>
								<td>{student.birthDate ? calculateAge(student.birthDate) : ""}</td>
								<td>{student.className}</td>

								<td class="flex gap-2">
									<button class="btn btn-xs btn-neutral" on:click={() => openEditModal(student)}>Editar</button>
									<button class="btn btn-xs btn-error" on:click|stopPropagation={() => openDeleteModal(student)}>
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

	{#if showEditModal}
		<EditStudentModal student={selectedStudent} on:close={closeEditModal} on:save={handleUpdate}/>
	{/if}

	{#if showDeleteModal}
		<DeleteModal
			item={selectedStudent}
			title="Tem certeza que deseja remover este aluno?"
			message="Esta ação não pode ser desfeita."
			content="{selectedStudent?.name}"
			on:close={closeDeleteModal}
			on:delete={handleDelete}
		/>
	{/if}
</section>