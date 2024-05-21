<script lang="ts">
    import type { Record } from '$lib/core/entities/Record';
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    export let record: Record | null;

    const dispatch = createEventDispatcher();

    function closeModal() {
        dispatch('close');
    }

    function deleteRecord() {
		dispatch('delete', record);
		closeModal();
    }
</script>

<section transition:fade={{ duration: 200 }} class="w-full">
    <div class="modal-backdrop"></div>
    <div class="modal-container w-full rounded-lg p-4">
        <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">Deletar Registro</h2>
        </div>
        <div class="p-4">
            <p>Tem certeza que deseja excluir o registro de:</p>
			<p><b>{record?.studentName}</b> - <b>{record?.date}</b></p>
            <div class="flex justify-end mt-4">
                <button class="btn btn-error mr-2" on:click={deleteRecord}>Deletar</button>
                <button class="btn btn-neutral" on:click={closeModal}>Cancelar</button>
            </div>
        </div>
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
        overflow: hidden;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
        z-index: 1000;
    }
</style>