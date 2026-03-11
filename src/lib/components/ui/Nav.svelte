<script>
  import { page } from "$app/state";
  import { tick, onMount } from "svelte";
  import { browser } from "$app/environment";

  const links = [
    { label: "home", href: "/" },
    { label: "projects", href: "/projects" },
    { label: "/uses", href: "/uses" },
    { label: "contact", href: "/contact" },
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

    await tick();

    const activeLinkEl = navElement?.querySelector(`a[href="${currentPath}"]`);

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

    const handleResize = () => setActiveHighlight(activePath);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  function handleMouseLeave() {
    setActiveHighlight(activePath);
  }
</script>

<div
  class="fixed top-6 left-0 right-0 z-40 flex justify-center w-full pointer-events-none px-4"
>
  <nav
    bind:this={navElement}
    onmouseleave={handleMouseLeave}
    class="pointer-events-auto relative flex items-center p-1.5 rounded-full bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
    aria-label="Main Navigation"
  >
    <div
      class="absolute top-1.5 bottom-1.5 left-0 bg-white/10 rounded-full transition-all duration-300 ease-out z-0 border border-white/5"
      style={highlightStyle}
    ></div>

    <ul class="flex relative z-10">
      {#each links as link}
        <li>
          <a
            href={link.href}
            onmouseenter={(e) => updateHighlight(e.currentTarget)}
            class="block px-5 py-2 text-xs sm:text-sm transition-colors duration-300 lowercase tracking-wide focus:outline-none rounded-full
                               {activePath === link.href
              ? 'text-white font-medium'
              : 'text-gray-400 hover:text-gray-200'}"
            aria-label={`Go to ${link.label} page`}
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</div>
