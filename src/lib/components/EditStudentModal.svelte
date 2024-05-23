<script lang="ts">
    import type { Class } from '$lib/core/entities/Class';
    import type { Student } from '$lib/core/entities/Student';
    import { formatDateInput, validateDateFormat } from '$lib/core/utils/Date';
	import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

	export let student: Student | null = null;
	export let classes: Class[] = [];

    const dispatch = createEventDispatcher();

    let updatedStudent = { ...student };

	let errorDateMessage = "";

	function closeModal() {
        dispatch('close');
    }

	async function saveChanges() {
		if (updatedStudent.birthDate !== "") {
			const isDateValid = validateDateFormat(updatedStudent?.birthDate!);
			if (!isDateValid) {
				errorDateMessage = `O formato da data é inválido! Use o formato ${new Date().toLocaleDateString("pt-BR")}.`;
				return;
			}
		}
		classes?.forEach((classItem) => {
			if (updatedStudent.classId === classItem.id) {
				updatedStudent.className = classItem.name;
				updatedStudent.classAlias = classItem.alias;
			}
		})
        dispatch('save', updatedStudent);
        closeModal();
    }

</script>

<section transition:fade={{ duration: 200 }} class="w-full">
	<div class="modal-backdrop"></div>
    <div class="modal-container w-full rounded-lg">
		<form class="w-full flex flex-col gap-2" on:submit|preventDefault={saveChanges}>
			<div class="form-control w-full">
				<label class="label" for="name">
					<span class="label-text">Nome</span>
				</label>
				<input
					id="name"
					type="text"
					class="input-sm input-bordered w-full border-2 rounded-md"
					bind:value={updatedStudent.name}
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
					bind:value={updatedStudent.birthDate}
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
				<select class="select select-bordered select-sm" bind:value={updatedStudent.classId}>
					<option value="default" disabled selected>Selecione uma turma</option>
					{#each classes ?? [] as {id, name}}
						<option value={id}>{name}</option>
					{/each}
				</select>
			</div>
			<div class="form-control w-full flex flex-col gap-2 mt-6">
				<button type="submit" class="btn btn-primary w-full">Salvar</button>
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