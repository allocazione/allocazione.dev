<script>
  import ProjectCard from "$lib/components/widgets/ProjectCard.svelte";
  import { siteConfig } from "$lib/config.js";
  import { tooltip } from "$lib/tooltip.js";
  import { fadeIn } from "$lib/actions.js";
  import { onMount } from "svelte";
  import { invalidateAll } from "$app/navigation";

  let { data } = $props();
</script>

<svelte:head>
  <title>@seleneftw / projects</title>
  <meta
    name="description"
    content="an archive of my digital garden and open source contributions."
  />
</svelte:head>

<div class="w-full pt-12 pb-24">
  <div
    use:fadeIn
    class="mb-16 transition-all duration-1000 opacity-0 translate-y-8"
  >
    <h1
      class="font-['Space_Mono'] text-accent text-2xl lowercase tracking-widest mb-4"
    >
      the archive.
    </h1>
    <p
      class="text-gray-400 font-light text-sm max-w-xl leading-loose lowercase"
    >
      a collection of things i've built, experiments, and open source
      contributions pulled directly from my github.
    </p>
  </div>

  {#if data.stats && data.stats.topLanguages.length > 0}
    <div
      use:fadeIn
      class="mb-16 relative z-10 w-full transition-all duration-1000 opacity-0 translate-y-8"
    >
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-['Space_Mono'] text-gray-300 lowercase tracking-widest">language breakdown</span>
        <div class="flex items-center gap-2 opacity-60">
          <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
          <span class="text-[10px] text-gray-500 font-['Space_Mono'] tracking-widest lowercase">analyzed {data.stats.totalRepos} repos</span>
        </div>
      </div>
      
      <div class="relative z-60 w-full h-1.5 rounded-full overflow-hidden flex mb-6 bg-[#252525]">
        {#each data.stats.topLanguages as lang, i}
          <div 
            style="width: {lang.percent}%; background-color: {lang.color}; animation-delay: {i * 100}ms;" 
            class="h-full hover:brightness-125 transition-all duration-300 cursor-default animate-stretch whitespace-nowrap"
            use:tooltip={`${lang.name} - ${lang.displayPercent}%`}
          ></div>
        {/each}
      </div>

      <div class="flex flex-wrap gap-x-6 gap-y-2">
        {#each data.stats.topLanguages as lang}
          <div class="flex items-center gap-2 group cursor-default">
            <span class="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300" style="background-color: {lang.color};"></span>
            <span class="text-xs text-gray-500 font-['Space_Mono'] group-hover:text-gray-300 transition-colors duration-300">{lang.name} <span class="text-gray-600 ml-1">({lang.count})</span></span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div
    use:fadeIn
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 transition-all duration-1000 opacity-0 translate-y-8 delay-100 relative z-10"
  >
    {#if data.projects.length === 0}
      <div
        class="md:col-span-3 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-12 text-center shadow-2xl"
      >
        <p
          class="text-gray-500 font-['Space_Mono'] text-sm tracking-widest lowercase"
        >
          // signal lost. unable to fetch from github.
        </p>
      </div>
    {:else}
      {#each data.projects as project}

        <div
          class="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl overflow-hidden shadow-2xl h-full flex flex-col group relative"
        >
          <div
            class="absolute inset-0 bg-linear-to-br from-white/2 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          ></div>
          <ProjectCard
            title={project.title}
            description={project.title === 'allocazione.dev' ? 'this very own website source code!' : project.description}
            link={project.link}
            tags={project.tags}
            updatedAt={project.pushedAt}
            external={true}
          />
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  @keyframes slideInFade {
    0% {
      opacity: 0;
      transform: translateX(-15px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-stretch {
    animation: slideInFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0;
  }
</style>
