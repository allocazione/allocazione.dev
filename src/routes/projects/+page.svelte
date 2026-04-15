<script>
  import ProjectCard from "$lib/components/widgets/ProjectCard.svelte";
  import { siteConfig } from "$lib/config.js";
  import { tooltip } from "$lib/actions/tooltip.js";
  import { onMount } from "svelte";
  import { t } from "svelte-i18n";

  let { data } = $props();
  const randomDescription =
    siteConfig.descriptions[
      Math.floor(Math.random() * siteConfig.descriptions.length)
    ];

  let projects = $state([]);
  let stats = $state(null);
  let loading = $state(true);

  const langColors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Svelte': '#ff3e00',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Rust': '#dea584',
    'Go': '#00add8',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#178600',
    'PHP': '#4f5d95',
    'Ruby': '#701516',
    'Shell': '#89e051',
    'Vue': '#41b883',
    'Lua': '#000080',
    'Sass': '#a53b70',
    'Markdown': '#083fa1'
  };

  async function fetchProjects() {
    try {
      const res = await fetch(`https://api.github.com/users/${siteConfig.github}/repos?sort=updated&per_page=30`);

      if (!res.ok) {
        console.error('GitHub API error:', res.statusText);
        loading = false;
        return;
      }

      const repos = await res.json();

      if (!Array.isArray(repos)) {
        loading = false;
        return;
      }

      const nonForks = repos.filter(repo => !repo.fork).slice(0, 12);

      let totalStars = 0;
      const languageCounts = {};

      projects = nonForks.map(repo => {
        totalStars += repo.stargazers_count;

        let tags = [];
        const isPersonal = repo.name.toLowerCase() === repo.owner.login.toLowerCase();

        if (repo.language) {
          const lang = repo.language;
          languageCounts[lang] = (languageCounts[lang] || 0) + 1;
          tags.push(lang.toLowerCase());
        } else if (isPersonal) {
          languageCounts['Markdown'] = (languageCounts['Markdown'] || 0) + 1;
        }

        if (isPersonal && !tags.includes('markdown')) {
          tags.push('markdown');
        }

        return {
          title: repo.name.toLowerCase(),
          description: repo.description ? repo.description.toLowerCase() : 'no description provided.',
          link: repo.html_url,
          pushedAt: repo.pushed_at,
          tags
        };
      });

      if (languageCounts['Batchfile']) {
        languageCounts['Shell'] = (languageCounts['Shell'] || 0) + languageCounts['Batchfile'];
      }

      const omittedLanguages = ['Makefile', 'Dockerfile', 'AutoHotkey', 'Batchfile'];
      omittedLanguages.forEach(lang => {
        delete languageCounts[lang];
      });

      const totalLanguages = Object.values(languageCounts).reduce((a, b) => a + b, 0) || 1;

      const topLanguages = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([lang, count]) => {
          const exactPct = (count / totalLanguages) * 100;
          return {
            name: lang.toLowerCase(),
            percent: exactPct,
            displayPercent: Math.round(exactPct),
            count: count,
            color: langColors[lang] || '#8b8b8b'
          };
        });

      stats = {
        totalRepos: nonForks.length,
        totalStars,
        topLanguages
      };
    } catch (e) {
      console.error('Error fetching projects:', e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchProjects();
  });
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

  {#if loading}
    <div class="flex items-center justify-center py-24">
      <div class="flex items-center gap-3">
        <span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
        <span class="text-sm font-['Space_Mono'] text-gray-500 lowercase tracking-widest"
          >{$t("projects.language_breakdown")}...</span
        >
      </div>
    </div>
  {:else}
    {#if stats && stats.topLanguages.length > 0}
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
                values: { count: stats.totalRepos },
              })}</span
            >
          </div>
        </div>

        <div
          class="relative z-60 w-full h-1.5 rounded-full overflow-hidden flex mb-6 bg-[#252525]"
        >
          {#each stats.topLanguages as lang, i}
            <div
              style="width: {lang.percent}%; background-color: {lang.color}; animation-delay: {i *
                100}ms;"
              class="h-full hover:brightness-125 transition-all duration-300 cursor-default animate-stretch whitespace-nowrap"
              use:tooltip={`${lang.name} - ${lang.displayPercent}%`}
            ></div>
          {/each}
        </div>

        <div class="flex flex-wrap gap-x-6 gap-y-2">
          {#each stats.topLanguages as lang}
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
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-page-in relative z-10"
    >
      {#if projects.length === 0}
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
        {#each projects as project}
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
  {/if}
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
