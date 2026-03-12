<script>
  import ProjectCard from "$lib/components/widgets/ProjectCard.svelte";
  import { siteConfig } from "$lib/config.js";
  import { tooltip } from "$lib/actions/tooltip.js";
  import { onMount } from "svelte";
  import { invalidateAll } from "$app/navigation";
  import { t } from "svelte-i18n";

  let { data } = $props();
  const randomDescription =
    siteConfig.descriptions[
      Math.floor(Math.random() * siteConfig.descriptions.length)
    ];
</script>

<svelte:head>
  <title>{$t("projects.title")}</title>
  <meta property="og:title" content={$t("projects.title")} />
  <meta name="description" content={randomDescription} />
  <meta property="og:description" content={randomDescription} />
  <meta name="twitter:description" content={randomDescription} />
</svelte:head>

<div class="w-full pt-12 pb-24">
  <div
    class="mb-16 animate-fade-in"
  >
    <h1
      class="font-['Space_Mono'] text-accent text-2xl lowercase tracking-widest mb-4"
    >
      {$t("projects.header")}
    </h1>
    <p
      class="text-gray-400 font-light text-sm max-w-xl leading-loose lowercase"
    >
      {$t("projects.description")}
    </p>
  </div>

  {#if data.stats && data.stats.topLanguages.length > 0}
    <div
      class="mb-16 relative z-10 w-full animate-fade-in"
    >
      <div class="flex items-center justify-between mb-4">
        <span
          class="text-sm font-['Space_Mono'] text-gray-300 lowercase tracking-widest"
          >{$t("projects.language_breakdown")}</span
        >
        <div class="flex items-center gap-2 opacity-60">
          <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
          <span
            class="text-[10px] text-gray-500 font-['Space_Mono'] tracking-widest lowercase"
            >{$t("projects.analyzed_repos", {
              values: { count: data.stats.totalRepos },
            })}</span
          >
        </div>
      </div>

      <div
        class="relative z-60 w-full h-1.5 rounded-full overflow-hidden flex mb-6 bg-[#252525]"
      >
        {#each data.stats.topLanguages as lang, i}
          <div
            style="width: {lang.percent}%; background-color: {lang.color}; animation-delay: {i *
              100}ms;"
            class="h-full hover:brightness-125 transition-all duration-300 cursor-default animate-stretch whitespace-nowrap"
            use:tooltip={`${lang.name} - ${lang.displayPercent}%`}
          ></div>
        {/each}
      </div>

      <div class="flex flex-wrap gap-x-6 gap-y-2">
        {#each data.stats.topLanguages as lang}
          <div class="flex items-center gap-2 group cursor-default">
            <span
              class="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300"
              style="background-color: {lang.color};"
            ></span>
            <span
              class="text-xs text-gray-500 font-['Space_Mono'] group-hover:text-gray-300 transition-colors duration-300"
              >{lang.name}
              <span class="text-gray-600 ml-1">({lang.count})</span></span
            >
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fade-in relative z-10"
  >
    {#if data.projects.length === 0}
      <div
        class="md:col-span-3 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-12 text-center shadow-2xl"
      >
        <p
          class="text-gray-500 font-['Space_Mono'] text-sm tracking-widest lowercase"
        >
          {$t("projects.github_error")}
        </p>
      </div>
    {:else}
      {#each data.projects as project}
        <div
          class="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl overflow-hidden shadow-2xl h-full flex flex-col group relative transition-all duration-500 hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.03)]"
        >
          <div
            class="absolute inset-0 bg-linear-to-br from-white/2 to-transparent pointer-events-none opacity-0"
          ></div>
          <ProjectCard
            title={project.title}
            description={project.title === "allocazione.dev"
              ? $t("projects.own_website")
              : project.description}
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
