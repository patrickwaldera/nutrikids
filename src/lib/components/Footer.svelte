<script lang="ts">
	import logo from '$lib/images/nutrikids.png';
    const year = new Date().getFullYear();
</script>

<footer class="flex flex-col sm:flex-row gap-8 justify-between p-10 bg-base-200">
    <aside>
        <p class="text-sm flex items-center gap-2">
            <img alt="Logo" src={logo} class="w-8" />
            <span>NutriKids</span>
        </p>
    </aside>

    <nav class="flex gap-4">
        <a class="btn btn-ghost btn-sm btn-circle" href="https://github.com/patrickwaldera">
            <i class='bx bxl-github text-3xl'></i>
        </a>
        <a class="btn btn-ghost btn-sm btn-circle" href="https://www.linkedin.com/in/patrickwaldera">
            <i class='bx bxl-linkedin-square text-3xl'></i>
        </a>
    </nav>
</footer>