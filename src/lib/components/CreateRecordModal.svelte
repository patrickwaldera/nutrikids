<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    import type { Record } from '$lib/core/entities/Record';
    import type { Student } from '$lib/core/entities/Student';
    import { BmiService } from '$lib/core/services/BmiService';
    import { calculateAge, convertDateToDDMMYYYY, formatDateInput, validateDateFormat } from '$lib/core/utils/dateUtil';
    import { clickOutside } from '$lib/core/utils/clickOutsideUtil';

    const dispatch = createEventDispatcher();
	
	export let students: Student[] = [];
		
	$: disabled = !record.studentId || !record.date || record.ageAtMeasurement === 0 || record.weight === 0 || record.height === 0;
	$: record.weight, record.height, updateBmi();
	$: filteredStudents = students.filter(function(student) {
		return student.name.toLowerCase().includes(record.studentName.toLowerCase())
	})
	
    let record: Record = { 
		id: "",
		studentId: "",
		studentName: "",
		classId: "",
		className: "",
		classAlias: "",
		date: convertDateToDDMMYYYY(new Date().toISOString().split('T')[0]),
		ageAtMeasurement: 0,
		weight: 0,
		height: 0,
		bmi: 0,
		notes: ""
	};

	let errorDateMessage = "";
	let errorStudentMessage = "";

    function closeModal() {
        dispatch('close');
    }


    async function createRecord() {
		const isDateValid = validateDateFormat(record.date);
		if (!isDateValid) {
			errorDateMessage = `O formato da data é inválido! Use o formato ${new Date().toLocaleDateString("pt-BR")}.`;
			return;
		}
		const isStudentValid = validateStudent();
		if (!isStudentValid) {
			return;
		}
        dispatch('create', record);
        closeModal();
    }

	function updateBmi() {
		const bmi = BmiService.calculateBmi(record.weight, record.height);
		if (bmi) {
			record.bmi = bmi;
			record.notes = BmiService.getBmiStatus(bmi);
		} else {
			record.bmi = 0;
			record.notes = "";
		}
	}

	function validateStudent() {
		if (!record.studentName || !record.studentId || !record.classId) {
			clearStudentOfRecord();
			errorStudentMessage = "Selecione um aluno.";
			return false;
		}

		const nameExists = students.some((student) => student.name === record.studentName);
		if (!nameExists) {
			clearStudentOfRecord();
			errorStudentMessage = "Aluno não encontrado, por favor, tente novamente ou adicione um novo aluno.";
			return false;
		}
		
		return true;
	}

	function clearStudentOfRecord() {
		record.studentName = "";
		record.studentId = "";
		record.classId = "";
		record.className = "";
		record.classAlias = "";
	}

	function onStudentClicked(student: Student) {
		record.studentName = student.name;
		record.studentId = student.id;
		record.classId = student.classId;
		record.className = student.className;
		record.classAlias = student.classAlias;
		record.ageAtMeasurement = student.birthDate ? calculateAge(student.birthDate) : 0;
	}
</script>

<section transition:fade={{ duration: 200 }} class="w-full">
	<div class="modal-backdrop"></div>
    <div class="modal-container w-full rounded-lg" use:clickOutside={closeModal}>
		<form class="w-full flex flex-col gap-2" on:submit|preventDefault={createRecord}>
			<h2 class="text-lg font-bold">Adicionar Registro</h2>
			<div class="form-control w-full">
				<label class="label" for="name">
					<span class="label-text">Aluno</span>
				</label>
				<div class="dropdown">
					<input
					id="name"
					type="text"
					class="input-sm input-bordered w-full border-2 rounded-md"
					bind:value={record.studentName}
					required
					/>
					{#if record.studentName.length >= 2}
						<ul class="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-full max-h-80 flex-nowrap overflow-auto">
							{#each filteredStudents ?? [] as student}
								<li>
									<button on:click|preventDefault={() => onStudentClicked(student)}>{student.name}</button>
								</li>
							{/each}
						</ul>
					{/if}
					{#if errorStudentMessage}
						<p transition:fade={{ duration: 300 }} class="text-xs text-error mt-2">{errorStudentMessage}</p>
					{/if}
				</div>
			</div>
			<div class="form-control w-full">
				<label class="label" for="date">
					<span class="label-text">Data</span>
				</label>
				<input
					id="date"
					type="text"
					class="input-sm input-bordered w-full border-2 rounded-md"
					bind:value={record.date}
					on:input={formatDateInput}
					required
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
					bind:value={record.ageAtMeasurement}
					required
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
					bind:value={record.weight}
					step="0.1"
					required
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
					bind:value={record.height}
					required
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
					bind:value={record.bmi}
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
					bind:value={record.notes}
				/>
			</div>
			<div class="form-control w-full flex flex-col gap-2 mt-6">
				<button type="submit" class="btn btn-primary w-full" {disabled}>Salvar</button>
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