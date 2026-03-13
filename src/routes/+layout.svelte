<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { onNavigate, afterNavigate } from "$app/navigation";
  import "../app.css";
  import Nav from "$lib/components/ui/Nav.svelte";
  import { siteConfig } from "$lib/config.js";
  import "$lib/locales/i18n.js";
  import { isLoading, waitLocale } from "svelte-i18n";
  import { page } from "$app/state";

  let { children } = $props();

  const pageName = $derived(
    page.route?.id === "/"
      ? "home"
      : page.route?.id?.replace(/^\//, "") || "error",
  );
  let localeLoaded = $state(false);

  onMount(async () => {
    await waitLocale();
    localeLoaded = true;
  });

  // Pick a random description at build time (and client side during hydration)
  const randomDescription =
    siteConfig.descriptions[
      Math.floor(Math.random() * siteConfig.descriptions.length)
    ];

  afterNavigate(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  });

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  onMount(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    const hexToRgbStr = (hex) => {
      const cleanHex = hex.replace("#", "");
      if (cleanHex.length < 6) return "225, 102, 102";
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    };

    if (!getCookie("accent_color")) {
      const pickLight = () =>
        Math.floor(128 + Math.random() * 127)
          .toString(16)
          .padStart(2, "0");
      const randomColor = `#${pickLight()}${pickLight()}${pickLight()}`;
      document.cookie = `accent_color=${encodeURIComponent(randomColor)}; max-age=31536000; path=/; samesite=lax`;

      document.documentElement.style.setProperty("--accent", randomColor);
      document.documentElement.style.setProperty(
        "--accent-rgb",
        hexToRgbStr(randomColor),
      );
    }
  });
</script>

<svelte:head>
  <meta property="og:site_name" content={`allocazione.dev / ${pageName}`} />
  <meta name="description" content={randomDescription} />
  <meta property="og:description" content={randomDescription} />
  <meta name="twitter:description" content={randomDescription} />

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Sel",
      "jobTitle": "Cybersecurity Researcher",
      "url": "https://allocazione.dev",
      "sameAs": ["https://github.com/allocazione", "https://t.me/seleneftw"],
      "description": "Cybersecurity Intern, Malware Researcher and Linux Tinkerer specializing in low-level systems and security."
    }
  </script>
</svelte:head>

<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium"
>
  Skip to main content
</a>

<div class="overlay" aria-hidden="true"></div>

<svg
  width="0"
  height="0"
  class="absolute pointer-events-none"
  aria-hidden="true"
>
  <filter id="ambilight" width="200%" height="200%" x="-50%" y="-50%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur"
    ></feGaussianBlur>
    <feColorMatrix in="blur" type="saturate" values="2" result="saturated"
    ></feColorMatrix>
    <feComponentTransfer in="saturated">
      <feFuncA type="linear" slope="0.6"></feFuncA>
    </feComponentTransfer>
  </filter>
</svg>

<div
  class="min-h-screen flex flex-col items-center justify-between font-inter relative w-full"
>
  <div
    class="fixed top-0 inset-x-0 h-125 bg-linear-to-b from-white/2 to-transparent pointer-events-none z-0"
  ></div>

  <div
    id="main-content"
    class="relative z-60 w-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col min-h-screen"
  >
    <Nav />

    <main
      class="grow flex flex-col justify-center py-20 relative w-full transition-all duration-500 {localeLoaded
        ? 'opacity-100'
        : 'opacity-0 invisible pointer-events-none'}"
    >
      {@render children()}
    </main>

    {#if !localeLoaded}
      <div
        out:fade={{ duration: 300 }}
        class="fixed inset-0 z-100 flex items-center justify-center bg-bg-dark pointer-events-none"
      >
        <div
          class="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin"
        ></div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(h1),
  :global(h2),
  :global(h3) {
    font-family: "Space Mono", monospace;
  }
</style>
