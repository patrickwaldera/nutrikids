<script lang="ts">
    import { goto } from "$app/navigation";
    import { AuthService } from "$lib/core/services/AuthService";
    import { ClientResponseError } from "pocketbase";
    import { fade } from "svelte/transition";

    let username = "";
    let password = "";
    let errorMessage = "";

    $: disabled = !username || !password;

    async function handleSubmit() {
        try {
            console.log(username, password);
            await AuthService.login(username, password);
            goto("/");            
        } catch (error) {
            if (error instanceof ClientResponseError) {
                errorMessage = "Nome de usuário ou senha inválidos. Se o problema persistir contate um administrador.";
            } else {
                errorMessage = "Ocorreu um erro inesperado, tente novamente mais tarde.";
            }
        } finally {
            setTimeout(() => (errorMessage = ""), 5000);
            password = "";
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4 rounded-box bg-base-200 p-6 max-w-md w-full">
    <h1 class="text-3xl font-bold self-center">Log in</h1>

    <label class="form-control">
        <div class="label">
            <span class="label-text">Nome de usuário ou email</span>
        </div>

        <input id="username" class="input input-bordered" bind:value={username} />
    </label>

    <label class="form-control">
        <div class="label">
            <span class="label-text">Senha</span>
        </div>

        <input id="password" type="password" class="input input-bordered" bind:value={password} />
    </label>

    {#if errorMessage}
        <div transition:fade={{ duration: 300 }} class="badge badge-error gap-2 h-auto max-h-14 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            {errorMessage}
        </div>
    {/if}

    <button class="btn btn-primary" {disabled}>Log in</button>

</form>