<script>
  import { page } from "$app/state";
  import { tick, onMount } from "svelte";
  import { browser } from "$app/environment";

  const links = [
    { label: "home", href: "/" },
    { label: "projects", href: "/projects/" },
    { label: "/uses", href: "/uses/" },
    { label: "contact", href: "/contact/" },
  ];

  let navElement;
  let highlightStyle = $state("opacity: 0;");
  let activePath = $derived(page.url.pathname);

  function updateHighlight(element) {
    if (!element || !navElement) {
      highlightStyle = "opacity: 0;";
      return;
    }

    const navRect = navElement.getBoundingClientRect();
    const linkRect = element.getBoundingClientRect();

    const left = linkRect.left - navRect.left;
    const width = linkRect.width;

    highlightStyle = `
            transform: translateX(${left}px);
            width: ${width}px;
            opacity: 1;
        `;
  }

  async function setActiveHighlight(currentPath) {
    if (!browser) return;

    // Try to find exact match first, then fallback to match without trailing slash if needed
    let activeLinkEl = navElement?.querySelector(`a[href="${currentPath}"]`);

    if (!activeLinkEl && currentPath.endsWith("/") && currentPath.length > 1) {
      activeLinkEl = navElement?.querySelector(
        `a[href="${currentPath.slice(0, -1)}"]`,
      );
    }

    if (activeLinkEl) {
      updateHighlight(activeLinkEl);
    } else {
      highlightStyle = "opacity: 0;";
    }
  }

  $effect(() => {
    setActiveHighlight(activePath);
  });

  onMount(() => {
    setActiveHighlight(activePath);

    const handleResize = () => {
      setActiveHighlight(activePath);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  });

  function handleMouseLeave() {
    setActiveHighlight(activePath);
  }
</script>

<div
  class="fixed top-[calc(1.5rem+env(safe-area-inset-top,0px))] left-0 right-0 z-40 flex justify-center w-full pointer-events-none px-4"
>
  <nav
    bind:this={navElement}
    onmouseleave={handleMouseLeave}
    class="pointer-events-auto relative flex items-center p-1 sm:p-1.5 rounded-full bg-[#1a1a1a]/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-full overflow-hidden"
    aria-label="Main Navigation"
  >
    <div
      class="absolute top-1.5 bottom-1.5 left-0 bg-white/10 rounded-full sm:transition-all sm:duration-300 sm:ease-out z-0 border border-white/5"
      style={highlightStyle}
    ></div>

    <ul class="flex relative z-10 w-full justify-between sm:justify-start whitespace-nowrap">
      {#each links as link}
        <li>
          <a
            href={link.href}
            onclick={(e) => updateHighlight(e.currentTarget)}
            onmouseenter={(e) => updateHighlight(e.currentTarget)}
            class="block px-3 sm:px-5 py-2 text-[11px] sm:text-sm transition-colors duration-300 lowercase tracking-wide rounded-full focus-ring touch-manipulation
                               {activePath === link.href ||
            (activePath === link.href + '/' && link.href !== '/') ||
            (link.href === activePath + '/' && activePath !== '/') ||
            (activePath.startsWith(link.href) && link.href !== '/')
              ? 'text-white font-medium'
              : 'text-gray-400'}"
            aria-label={`Go to ${link.label} page`}
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style>
  @media (hover: hover) {
    a:not(.text-white):hover {
      color: #e5e7eb;
    }
  }
</style>
