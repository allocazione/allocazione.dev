<script>
  import { onMount } from "svelte";
  import { onNavigate, afterNavigate } from "$app/navigation";
  import "../app.css";
  import Nav from "$lib/components/ui/Nav.svelte";

  let { children } = $props();

  afterNavigate(() => {
    const container = document.getElementById("app-container");
    if (container) container.scrollTo(0, 0);
  });

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

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
      const randomColor = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
      document.cookie = `accent_color=${encodeURIComponent(randomColor)}; max-age=31536000; path=/; samesite=lax`;

      // Apply instantly without a full page reload to fix the "double refresh" bug
      document.documentElement.style.setProperty("--accent", randomColor);
      document.documentElement.style.setProperty(
        "--accent-rgb",
        hexToRgbStr(randomColor),
      );
    }
  });
</script>

<svelte:head>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Sel",
      "jobTitle": "Cybersecurity Researcher",
      "url": "https://allocazione.dev",
      "sameAs": [
        "https://github.com/allocazione",
        "https://t.me/seleneftw"
      ],
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

<div id="app-container">
  <div class="overlay" aria-hidden="true"></div>

  <div
    class="min-h-screen flex flex-col items-center justify-between font-['Inter'] relative w-full"
  >
    <div
      class="fixed top-0 inset-x-0 h-125 bg-linear-to-b from-white/2 to-transparent pointer-events-none z-0"
    ></div>

    <div
      class="relative z-60 w-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col min-h-screen"
    >
      <Nav />

      <main
        id="main-content"
        class="grow flex flex-col justify-center py-20 pb-[calc(5rem+env(safe-area-inset-bottom))] relative w-full"
      >
        {@render children()}
      </main>
    </div>
  </div>
</div>

<style>
  :global(h1),
  :global(h2),
  :global(h3) {
    font-family: "Space Mono", monospace;
  }
</style>
