<script>
  let { href = '#', external = false, children } = $props();
</script>

<a 
    href={href} 
    target={external ? '_blank' : null} 
    rel={external ? 'noopener noreferrer' : null}
    class="inline-flex items-center justify-center px-6 py-3 border border-white/10 text-xs sm:text-sm text-gray-300 hover:text-white rounded bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 tracking-widest lowercase shadow-[0_0_15px_rgba(255,255,255,0)] hover:shadow-[0_0_15px_rgba(255,255,255,0.03)] group"
>

    {@render children()}
</a>
