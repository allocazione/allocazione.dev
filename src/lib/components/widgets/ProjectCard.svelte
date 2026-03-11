<script>
  let { title, description, link, tags = [], external = false, updatedAt = null } = $props();

  function formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
      }).toLowerCase();
  }
</script>

<a href={link} target={external ? '_blank' : null} rel={external ? 'noopener noreferrer' : null} class="group block relative overflow-hidden rounded-3xl border border-[#252525] bg-transparent p-6 transition-all duration-500 focus-ring h-full">
    <div class="relative z-10 flex flex-col h-full">

        <span class="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none grid place-items-center">
            <svg aria-hidden="true" class="w-3 h-3 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path></svg>
        </span>

        <h3 class="text-sm font-medium text-gray-200 mb-2 lowercase tracking-wider font-['Space_Mono']">{title}</h3>
        
        <p class="text-xs text-gray-500 leading-relaxed mb-4 grow lowercase">
            {description}
        </p>

        {#if updatedAt}
            <div class="flex items-center gap-2 mb-6 opacity-40 transition-opacity duration-500 card-date">
                <span class="text-[9px] font-['Space_Mono'] text-gray-400 tracking-widest lowercase">last updated {formatDate(updatedAt)}</span>
            </div>
        {/if}

        {#if tags.length > 0}
            <div class="flex flex-wrap gap-2 mt-auto">
                {#each tags as tag}
                    <span class="text-[10px] text-gray-600 border border-white/5 px-2 py-0.5 rounded backdrop-blur-sm lowercase tracking-widest transition-colors card-tag">
                        {tag}
                    </span>
                {/each}
            </div>
        {/if}
    </div>
    

    <div class="absolute inset-0 bg-linear-to-tr from-accent/0 via-accent/1.5 to-accent/3 opacity-0 transition-opacity duration-500 card-glow"></div>
</a>

<style>
  @media (hover: hover) {
    a:hover {
      background-color: rgba(255, 255, 255, 0.02);
      transform: translateY(-4px);
      border-color: rgba(var(--accent-rgb), 0.3);
      box-shadow: 0 4px 30px rgba(255, 255, 255, 0.03);
    }
    
    a:hover .card-glow {
      opacity: 1;
    }

    a:hover svg {
        opacity: 1;
    }

    a:hover .card-date {
        opacity: 0.6;
    }

    a:hover .card-tag {
        border-color: rgba(255, 255, 255, 0.1);
        color: #9ca3af;
    }
  }
</style>
