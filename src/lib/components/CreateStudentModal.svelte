<script lang="ts">
    import type { Class } from '$lib/core/entities/Class';
    import type { Student } from '$lib/core/entities/Student';
    import { formatDateInput, validateDateFormat } from '$lib/core/utils/Date';
    import { clickOutside } from '$lib/core/utils/clickOutside';
	import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
	
    const dispatch = createEventDispatcher();

	export let classes: Class[] = [];

	$: disabled = !student.name || !student.classId;

    let student: Student = { 
		id: "",
		name: "",
		birthDate: "",
		classId: "",
		className: "",
		classAlias: ""
	 };

	let errorDateMessage = "";

	function closeModal() {
        dispatch('close');
    }

	async function createStudent() {
		if (student.birthDate !== "") {
			const isDateValid = validateDateFormat(student?.birthDate!);
			if (!isDateValid) {
				errorDateMessage = `O formato da data é inválido! Use o formato ${new Date().toLocaleDateString("pt-BR")}.`;
				return;
			}
		}
		classes?.forEach((classItem) => {
			if (classItem.id === student.classId) {
				student.className = classItem.name;
				student.classAlias = classItem.alias;
			}
		})
        dispatch('create', student);
        closeModal();
    }

</script>

<section transition:fade={{ duration: 200 }} class="w-full">
	<div class="modal-backdrop"></div>
    <div class="modal-container w-full rounded-lg" use:clickOutside={closeModal}>
		<form class="w-full flex flex-col gap-2" on:submit|preventDefault={createStudent}>
			<h2 class="text-lg font-semibold">Adicionar Aluno</h2>
			<div class="form-control w-full">
				<label class="label" for="name">
					<span class="label-text">Nome</span>
				</label>
				<input
					id="name"
					type="text"
					class="input-sm input-bordered w-full border-2 rounded-md"
					bind:value={student.name}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="date">
					<span class="label-text">Data de nascimento (dd/mm/aaaa)</span>
				</label>
				<input
					id="date"
					type="text"
					class="input-sm input-bordered w-full border-2 rounded-md"
					bind:value={student.birthDate}
					on:input={formatDateInput}
				/>
				{#if errorDateMessage}
					<p transition:fade={{ duration: 300 }} class="text-xs text-error mt-2">{errorDateMessage}</p>
				{/if}
			</div>
			<div class="form-control w-full">
				<label class="label" for="date">
					<span class="label-text">Turma</span>
				</label>
				<select class="select select-bordered select-sm" bind:value={student.classId}>
					<option value="default" disabled selected>Selecione uma turma</option>
					{#each classes ?? [] as {id, name}}
						<option value={id}>{name}</option>
					{/each}
				</select>
			</div>
			<div class="form-control w-full flex flex-col gap-2 mt-6">
				<button type="submit" class="btn btn-primary w-full" {disabled}>Adicionar</button>
				<button type="button" class="btn btn-neutral-500 w-full" on:click={closeModal}>Cancelar</button>
			</div>
		</form>
	</div>
</section>

<style>
	.modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    .modal-container {
		width: 30rem;
		max-width: 90%;
		max-height: 90%;
		overflow: auto;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        z-index: 1000;
    }
</style>