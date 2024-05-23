<script lang="ts">
    import { fade } from "svelte/transition";
    
    import { isLoading } from "$lib/stores/LoadingStore";

    let username = "";
    let password = "";

    $: disabled = !username || !password;

    export let form;
</script>

<svelte:head>
	<title>NutriKids - Login</title>
</svelte:head>

<form method="POST" action="?/login" transition:fade={{ duration: 200 }} class="flex flex-col gap-4 rounded-box bg-base-200 p-6 max-w-md w-full">
    <h1 class="text-3xl font-bold self-center">Log in</h1>

    <label class="form-control">
        <div class="label">
            <span class="label-text">Nome de usuário ou email</span>
        </div>

        <input name="username" class="input input-bordered" bind:value={username} />
    </label>

    <label class="form-control">
        <div class="label">
            <span class="label-text">Senha</span>
        </div>

        <input name="password" type="password" class="input input-bordered" bind:value={password} />
    </label>

    {#if form?.error}
        <div transition:fade={{ duration: 300 }} class="badge badge-error gap-2 h-auto max-h-14 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            {form?.error}
        </div>
    {/if}

    {#if $isLoading}
        <span class="loading loading-dots loading-lg self-center"></span>
    {:else}
        <button class="btn btn-primary" {disabled}>Log in</button>
    {/if}

</form>