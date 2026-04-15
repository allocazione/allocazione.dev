<script>
  import "$lib/locales/i18n.js";
  import { siteConfig } from "$lib/config.js";
  import { t, json } from "svelte-i18n";

  const { lastUpdated } = siteConfig;
  
  const categories = $derived($json("uses.categories") || []);
  const randomDescription = siteConfig.descriptions[Math.floor(Math.random() * siteConfig.descriptions.length)];
</script>

<svelte:head>
  <title>{$t('uses.title')}</title>
  <meta property="og:title" content={$t('uses.title')} />
  <meta name="description" content={randomDescription} />
  <meta property="og:description" content={randomDescription} />
  <meta name="twitter:description" content={randomDescription} />
</svelte:head>

<div class="w-full pt-12 pb-24">
  <div
    class="mb-16 animate-page-in"
  >
    <div class="flex items-center justify-between mb-4">
      <h1
        class="font-['Space_Mono'] text-accent text-2xl lowercase tracking-widest"
      >
        {$t('uses.header')}
      </h1>
      {#if lastUpdated}
        <div class="flex items-center gap-2 opacity-50">
          <svg
            aria-hidden="true"
            class="w-3 h-3 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path></svg
          >
          <span
            class="text-[10px] text-gray-500 font-['Space_Mono'] tracking-widest lowercase"
            >{$t('uses.last_updated', { values: { date: lastUpdated } })}</span
          >
        </div>
      {/if}
    </div>
    <p
      class="text-gray-400 font-light text-sm max-w-xl leading-loose lowercase"
    >
      {$t('uses.description')}
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 animate-page-in">
    {#each categories as category, i}
      <div
        class="bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-8 group relative overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.03)]"
      >
        <div
          aria-hidden="true"
          class="absolute -top-12 -right-12 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none opacity-0"
        ></div>

        <h2
          class="text-accent text-xs tracking-[0.2em] font-light lowercase mb-8 flex items-center gap-3"
        >
          <span class="w-2 h-2 rounded-full bg-accent/30"></span>
          {category.title}
        </h2>

        <div class="space-y-6">
          {#each category.items as item}
            <div class="flex flex-col gap-1">
              {#if item.url && item.url !== "#"}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-300 text-sm font-medium lowercase tracking-wide font-['Space_Mono'] hover:text-accent transition-colors duration-300 inline-flex items-center gap-2 group/link"
                >
                  {item.name}
                  <svg
                    aria-hidden="true"
                    class="w-2.5 h-2.5 opacity-0 group-hover/link:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path></svg
                  >
                </a>
              {:else}
                <span
                  class="text-gray-300 text-sm font-medium lowercase tracking-wide font-['Space_Mono']"
                  >{item.name}</span
                >
              {/if}
              <span
                class="text-gray-500 text-xs font-light lowercase leading-relaxed"
                >{item.description}</span
              >
            </div>
          {/each}
        </div>
      </div>
    {/each}

    <div
      class="bg-[#0f0f0f]/40 border border-[#252525] border-dashed rounded-4xl p-8 flex items-center justify-center"
    >
      <span
        class="text-gray-600 text-xs font-['Space_Mono'] tracking-widest lowercase animate-pulse"
        >{$t('uses.pending')}</span
      >
    </div>
  </div>
</div>
