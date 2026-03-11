<script>
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>@seleneftw / not found</title>
</svelte:head>

<div class="w-full min-h-[70vh] flex items-center justify-center">
  <div class="text-center">
    <p class="font-['Space_Mono'] text-accent text-6xl font-light mb-4 tracking-widest">404</p>
    <p class="text-gray-500 text-sm lowercase tracking-widest mb-8">// page not found</p>
    <a
      href="/"
      class="text-xs text-gray-400 hover:text-accent transition-colors duration-300 tracking-widest lowercase border border-white/10 px-5 py-2.5 rounded hover:border-white/20"
    >
      go home
    </a>
  </div>
</div>
