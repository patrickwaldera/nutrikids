<script lang="ts">
    import { fade } from "svelte/transition";
	import type { Student } from "$lib/core/entities/Student";
	import ErrorComponent from "$lib/components/ErrorComponent.svelte";
    import DeleteModal from "$lib/components/DeleteModal.svelte";
    import EditStudentModal from "$lib/components/EditStudentModal.svelte";
    import { calculateAge } from "$lib/core/utils/Date";
    import { StudentService } from "$lib/core/services/StudentService";
    import CreateStudentModal from "$lib/components/CreateStudentModal.svelte";

	export let data;

	let selectedClass = "default";
	let students = data.students;
	let studentsToShow = students;

	let showEditModal = false;
	let showDeleteModal = false;
	let showCreateModal = false;
	let selectedStudent: Student | null = null;

	function filterByClass() {
		if (selectedClass === "default") {
			studentsToShow = students;
		} else {
			studentsToShow = students?.filter((student: any) => student.classId === selectedClass);
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
		let index = students!.findIndex((student) => student.id === updatedStudent.id);
		if (index !== -1) {
			students![index] = updatedStudent;
		}
		students = students?.sort((a, b) => a.name.localeCompare(b.name));

		index = studentsToShow!.findIndex((record) => record.id === updatedStudent.id);
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
		const studentId = selectedStudent!.id;
		let index = students!.findIndex((student) => student.id === studentId);
		if (index !== -1) {
			students!.splice(index, 1);
			students = students;
		}
		
		index = studentsToShow!.findIndex((record) => record.id === studentId);
		if (index !== -1) {
			studentsToShow!.splice(index, 1);
			studentsToShow = studentsToShow;
		}
		try {
			await StudentService.delete(data.token!, studentId);
		} catch (error) {
			data.error = "Erro ao deletar o registro.";
		}
	}

	function openCreateModal() {
		showCreateModal = true;
	}

	function closeCreateModal() {
		showCreateModal = false;
	}

	async function handleCreate(event: any) {
		const newStudent = event.detail;
		try {
			const studentId = await StudentService.create(data.token!, newStudent);
			newStudent.id = studentId;
			students = [...students!, newStudent];
			students = students?.sort((a, b) => a.name.localeCompare(b.name));
			if (selectedClass === "default" || selectedClass === newStudent.classId) {
				studentsToShow = [...studentsToShow!, newStudent];
				studentsToShow = studentsToShow?.sort((a, b) => a.name.localeCompare(b.name));
			}
		} catch (error) {
			data.error = "Erro ao criar o registro.";
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
			<div class="flex flex-wrap gap-6 justify-between items-center">
				<h1 class="text-3xl font-bold underline">Alunos</h1>
				
				<button class="sm:block hidden btn btn-primary" on:click|stopPropagation={() => openCreateModal()}>Adicionar aluno</button>

				<button class="sm:hidden btn btn-primary btn-circle btn-lg text-3xl flex items-center fixed bottom-10 right-10 shadow-lg shadow-neutral-400 z-20" on:click|stopPropagation={() => openCreateModal()}><i class='bx bx-plus'></i></button>
			</div>
			<div class="flex flex-wrap gap-2 max-w-full">
				<select class="select select-bordered select-sm max-w-xs" bind:value={selectedClass} on:change={filterByClass}>
					<option value="default" selected>Selecione uma turma</option>
					{#each data.classes ?? [] as {id, name}}
						<option value={id}>{name}</option>
					{/each}
				</select>
			</div>
		</div>
		{#if studentsToShow?.length === 0}
			<div class="mt-6" in:fade={{ duration: 300 }}>
				<p>Nenhum registro encontrado.</p>
			</div>
		{/if}
		{#if studentsToShow && studentsToShow.length > 0}
			<div class="overflow-x-auto mt-6" in:fade={{ duration: 300 }}>
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
							<tr transition:fade={{ duration: 300 }} class="hover cursor-pointer text-nowrap" on:click|stopPropagation={() => openEditModal(student)}>
								<td>{student.name}</td>
								<td>{student.birthDate}</td>
								<td>{student.birthDate ? calculateAge(student.birthDate) : ""}</td>
								<td>{student.className}</td>

								<td class="flex gap-2">
									<button class="btn btn-xs btn-neutral" on:click|stopPropagation={() => openEditModal(student)}>Editar</button>
									<button class="btn btn-xs btn-error" on:click|stopPropagation={() => openDeleteModal(student)}>
										<i class='bx bxs-trash text-white'></i>
									</button>
								</td>
							</tr>
						{/each}
						<tr>
							<td class="text-left" colspan="4"><b>Total: {studentsToShow.length}</b></td>
						</tr>
					</tbody>
				</table>
			</div>
		{/if}
	{/if}

	{#if showEditModal}
		<EditStudentModal student={selectedStudent} classes={data?.classes} on:close={closeEditModal} on:save={handleUpdate}/>
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

	{#if showCreateModal}
		<CreateStudentModal classes={data?.classes} on:close={closeCreateModal} on:create={handleCreate}/>
	{/if}
</section>