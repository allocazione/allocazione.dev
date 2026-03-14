<script>
  import Button from "$lib/components/ui/Button.svelte";
  import Clock from "$lib/components/widgets/Clock.svelte";
  import StatsFM from "$lib/components/widgets/StatsFM.svelte";
  import { t } from "svelte-i18n";
  import { onMount } from "svelte";

  import { siteConfig } from "$lib/config.js";

  const { name, profession, skills, email, avatar } = siteConfig;
  const randomDescription =
    siteConfig.descriptions[
      Math.floor(Math.random() * siteConfig.descriptions.length)
    ];

  let isMounted = $state(false);
  onMount(() => {
    isMounted = true;
  });

  let greeting = $derived($t("home.greeting", {
    values: {
      name: `<span class="font-bold text-accent" style="text-shadow: 0 0 20px rgba(var(--accent-rgb), 0.7), 0 0 40px rgba(var(--accent-rgb), 0.3);">${name}</span>`,
    },
  }));
  let about_p1 = $derived($t("home.about_p1"));
  let about_p2 = $derived($t("home.about_p2"));
</script>

<svelte:head>
  <title>{$t("home.title")}</title>
  <meta property="og:title" content={$t("home.title")} />
  <meta name="description" content={randomDescription} />
  <meta property="og:description" content={randomDescription} />
  <meta name="twitter:description" content={randomDescription} />
</svelte:head>

<div
  class="home-page grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 md:gap-6 w-full animate-page-in relative z-10"
>
  <div
    class="md:col-span-1 md:row-span-2 self-center bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-8 flex flex-col justify-center relative group overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.03)]"
  >
    <div
      aria-hidden="true"
      class="absolute -top-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-[80px] pointer-events-none opacity-50"
    ></div>

    <div class="relative z-10 pt-4">
      <img
        src={avatar}
        alt={name}
        class="w-32 h-32 mb-8 rounded-2xl object-cover border border-[#252525] shadow-lg group-hover:border-accent/30 transition-colors duration-500"
      />
      <h1
        class="text-3xl mt-2 text-white/30 mb-0.5 lowercase leading-tight"
        style="letter-spacing: -0.02em;"
      >
        {#if isMounted}
          {@html greeting}
        {:else}
          <span style="visibility: hidden;">&nbsp;</span>
        {/if}
      </h1>
      <p class="text-[13px] text-gray-500/70 mb-4 lowercase font-light italic">
        {$t("home.short_for")}
      </p>
      <p
        class="text-[15px] text-gray-500 mb-2 lowercase tracking-[0.2em] font-light"
      >
        {profession.toLowerCase()}
      </p>
    </div>
  </div>

  <div
    id="about"
    class="md:col-span-3 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-8 flex flex-col justify-center relative group overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.03)]"
  >
    <div
      aria-hidden="true"
      class="absolute -bottom-24 -right-24 w-64 h-64 bg-white/2 rounded-full blur-[80px] pointer-events-none opacity-50"
    ></div>

    <div class="relative z-10 w-full flex flex-col items-end text-right">
      <div class="flex items-center gap-4 mb-6 justify-end">
        <h2 class="text-accent text-xs tracking-[0.2em] font-light lowercase">
          {$t("home.who_am_i")}
        </h2>
      </div>

      <div
        class="text-gray-400 text-sm leading-loose font-light space-y-4 max-w-xl"
      >
        {#if isMounted}
          <p>{@html about_p1}</p>
          <p class="pt-2">{@html about_p2}</p>
        {:else}
          <p style="visibility: hidden;">&nbsp;</p>
          <p class="pt-2" style="visibility: hidden;">&nbsp;</p>
        {/if}
      </div>
    </div>
  </div>

  <div
    id="music"
    class="md:col-span-2 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-8 mt-4 md:mt-0 flex flex-col justify-center relative group overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.03)]"
  >
    <StatsFM />
  </div>

  <div
    id="clock"
    class="md:col-span-1 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-8 flex flex-col relative group overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.03)]"
  >
    <Clock />
  </div>
</div>
