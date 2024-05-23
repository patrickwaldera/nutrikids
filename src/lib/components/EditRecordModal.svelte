<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    import { BmiService } from '$lib/core/services/BmiService';
    import { validateDateFormat } from '$lib/core/utils/dateUtil';
    import { clickOutside } from '$lib/core/utils/clickOutsideUtil';

    export let record;

    const dispatch = createEventDispatcher();

    let updatedRecord = { ...record };

	let errorDateMessage = "";

    function closeModal() {
        dispatch('close');
    }

	$: updatedRecord.weight, updatedRecord.height, updateBmi();

    async function saveChanges() {
		const isDateValid = validateDateFormat(updatedRecord.date);
		if (!isDateValid) {
			errorDateMessage = `O formato da data é inválido! Use o formato ${new Date().toLocaleDateString("pt-BR")}.`;
			return;
		}
        dispatch('save', updatedRecord);
        closeModal();
    }

	function updateBmi() {
		const bmi = BmiService.calculateBmi(updatedRecord.weight, updatedRecord.height);
		if (bmi) {
			updatedRecord.bmi = bmi;
			updatedRecord.notes = BmiService.getBmiStatus(bmi);
		} else {
			updatedRecord.bmi = null;
			updatedRecord.notes = "";
		}
	}
</script>

<section transition:fade={{ duration: 200 }} class="w-full">
	<div class="modal-backdrop"></div>
    <div class="modal-container w-full rounded-lg" use:clickOutside={closeModal}>
		<form class="w-full flex flex-col gap-2" on:submit|preventDefault={saveChanges}>
			<h2 class="text-lg font-semibold">Editar Registro</h2>
			<div class="form-control w-full">
				<label class="label" for="name">
					<span class="label-text">Nome</span>
				</label>
				<input
					disabled
					id="name"
					type="text"
					class="input-sm input-bordered w-full border-2 rounded-md bg-neutral-200"
					bind:value={updatedRecord.studentName}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="date">
					<span class="label-text">Data</span>
				</label>
				<input
					id="date"
					type="text"
					class="input-sm input-bordered w-full border-2 rounded-md"
					bind:value={updatedRecord.date}
				/>
				{#if errorDateMessage}
					<p transition:fade={{ duration: 300 }} class="text-xs text-error mt-2">{errorDateMessage}</p>
				{/if}
			</div>
			<div class="form-control w-full">
				<label class="label" for="age">
					<span class="label-text">Idade na medição (anos)</span>
				</label>
				<input
					id="age"
					type="number"
					class="input-sm input-bordered w-full border-2 rounded-md"
					bind:value={updatedRecord.ageAtMeasurement}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="weight">
					<span class="label-text">Peso (kg)</span>
				</label>
				<input
					id="weight"
					type="number"
					class="input-sm input-bordered w-full border-2 rounded-md"
					bind:value={updatedRecord.weight}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="height">
					<span class="label-text">Altura (cm)</span>
				</label>
				<input
					id="height"
					type="number"
					class="input-sm input-bordered w-full border-2 rounded-md"
					bind:value={updatedRecord.height}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="bmi">
					<span class="label-text">IMC</span>
				</label>
				<input
					disabled
					id="bmi"
					type="number"
					class="input-sm input-bordered w-full border-2 rounded-md bg-neutral-200"
					bind:value={updatedRecord.bmi}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="notes">
					<span class="label-text">Notas</span>
				</label>
				<input
					disabled
					id="notes"
					type="text"
					class="input-sm input-bordered w-full border-2 rounded-md bg-neutral-200"
					bind:value={updatedRecord.notes}
				/>
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