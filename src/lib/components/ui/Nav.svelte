<script>
  import { page } from "$app/state";
  import { tick, onMount } from "svelte";
  import { browser } from "$app/environment";
  import { t, locale, locales } from "svelte-i18n";
  import { fly, fade } from "svelte/transition";

  const links = $derived([
    { label: $t("nav.home"), href: "/" },
    { label: $t("nav.projects"), href: "/projects/" },
    { label: $t("nav.uses"), href: "/uses/" },
    { label: $t("nav.contact"), href: "/contact/" },
  ]);

  let navElement = $state();
  let highlightStyle = $state("opacity: 0;");
  let activePath = $derived(page.url.pathname);
  let isLangOpen = $state(false);
  let langButton = $state();
  let dropdownElement = $state();
  let dropdownHighlightStyle = $state("opacity: 0;");
  let isMobile = $state(false);

  const flagUrls = {
    en: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCAzMCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxnIGlkPSJ1ayI+PHBhdGggZmlsbD0iIzAwMjQ3ZCIgZD0iTTAsMHYzMGg2MFYweiIvPjxwYXRoIGQ9Ik0wLDAgTDYwLDMwIE02MCwwIEwwLDMwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNiIvPjxwYXRoIGQ9Ik0wLDAgTDYwLDMwIE02MCwwIEwwLDMwIiBzdHJva2U9IiNjZjE0MmIiIHN0cm9rZS13aWR0aD0iNCIvPjxwYXRoIGQ9Ik0zMCwwIHYzMCBNMCwxNSBoNjAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxMCIvPjxwYXRoIGQ9Ik0zMCwwIHYzMCBNMCwxNSBoNjAiIHN0cm9rZT0iI2NmMTQyYiIgc3Ryb2tlLXdpZHRoPSI2Ii8+PC9nPjwvZGVmcz48dXNlIHhsaW5rOmhyZWY9IiN1ayIvPjwvc3ZnPg==',
    it: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzIDIiPjxwYXRoIGZpbGw9IiMwMDlmNDYiIGQ9Ik0wIDBoMXYyaC0xeiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xIDBoMXYyaC0xeiIvPjxwYXRoIGZpbGw9IiNjZTJiMzciIGQ9Ik0yIDBoMXYyaC0xeiIvPjwvc3ZnPg==',
    de: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1IDMiPjxwYXRoIGQ9Ik0wIDBoNXYxSDB6IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTAgMWg1djFIMHoiIGZpbGw9IiNmMDAiLz48cGF0aCBkPSJNMCAyaDV2MUgweiIgZmlsbD0iI2ZmY2UwMCIvPjwvc3ZnPg==',
    es: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3NTAgNTAwIj48cmVjdCB3aWR0aD0iNzUwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2M2MGIxZSIvPjxyZWN0IHdpZHRoPSI3NTAiIGhlaWdodD0iMjUwIiB5PSIxMjUiIGZpbGw9IiNmZmM0MDAiLz48L3N2Zz4='
  };

  const availableLocales = [
    { id: "en", label: "English" },
    { id: "it", label: "Italiano" },
    { id: "de", label: "Deutsch" },
    { id: "es", label: "Español" },
  ];

  function toggleLang() {
    isLangOpen = !isLangOpen;
  }

  function selectLang(lang) {
    $locale = lang;
    isLangOpen = false;
  }

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

  function updateDropdownHighlight(element) {
    if (!element || !dropdownElement) {
      dropdownHighlightStyle = "opacity: 0;";
      return;
    }

    const parentRect = dropdownElement.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();

    // Account for parent border to ensure perfect centering
    const style = window.getComputedStyle(dropdownElement);
    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const borderTop = parseFloat(style.borderTopWidth) || 0;

    const top = Math.round(itemRect.top - parentRect.top - borderTop);
    const left = Math.round(itemRect.left - parentRect.left - borderLeft);
    const height = Math.round(itemRect.height);
    const width = Math.round(itemRect.width);

    dropdownHighlightStyle = `
            transform: translate(${left}px, ${top}px);
            width: ${width}px;
            height: ${height}px;
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

  function setDropdownActiveHighlight() {
    if (!browser || !dropdownElement) return;

    const activeBtn = dropdownElement.querySelector(`button[data-id="${$locale}"]`);
    if (activeBtn) {
      updateDropdownHighlight(activeBtn);
    } else {
      dropdownHighlightStyle = "opacity: 0;";
    }
  }

  $effect(() => {
    if (isLangOpen && langButton) {
      updateHighlight(langButton);
      // Wait for dropdown to mount before setting its highlight
      tick().then(setDropdownActiveHighlight);
    } else {
      setActiveHighlight(activePath);
    }
  });

  $effect(() => {
    // Re-highlight if path changes, but only if language menu isn't open
    if (!isLangOpen) {
      setActiveHighlight(activePath);
    }
  });

  onMount(() => {
    isMobile = window.innerWidth < 640;
    setActiveHighlight(activePath);

    const handleResize = () => {
      isMobile = window.innerWidth < 640;
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
    if (isLangOpen && langButton) {
      updateHighlight(langButton);
    } else {
      setActiveHighlight(activePath);
    }
  }

  function handleDropdownMouseLeave() {
    setDropdownActiveHighlight();
  }

  // Close dropdown when clicking outside
  if (browser) {
    onMount(() => {
      const handleClickOutside = (event) => {
        if (isLangOpen && navElement && !navElement.contains(event.target)) {
          isLangOpen = false;
        }
      };
      window.addEventListener("click", handleClickOutside);
      return () => window.removeEventListener("click", handleClickOutside);
    });
  }
</script>

<div
  class="fixed top-[calc(1.5rem+env(safe-area-inset-top,0px))] left-0 right-0 z-40 flex justify-center w-full pointer-events-none px-4"
>
  <nav
    bind:this={navElement}
    onmouseleave={handleMouseLeave}
    class="pointer-events-auto relative flex items-center p-1 sm:p-1.5 rounded-full bg-[#1a1a1a]/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-full"
    aria-label="Main Navigation"
  >
    <div
      class="absolute top-1.5 bottom-1.5 left-0 bg-white/10 rounded-full sm:transition-all sm:duration-300 sm:ease-out z-0 border border-white/5"
      style={highlightStyle}
    ></div>

    <ul
      class="flex relative z-10 w-full justify-between sm:justify-start whitespace-nowrap items-center"
    >
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

      <li class="relative flex items-center">
        <button
          bind:this={langButton}
          onclick={(e) => {
            e.stopPropagation();
            toggleLang();
          }}
          onmouseenter={(e) => updateHighlight(e.currentTarget)}
          class="px-3 sm:px-5 py-2 text-gray-400 hover:text-white transition-all duration-300 rounded-full focus-ring flex items-center justify-center group pointer-events-auto"
          aria-label="Change language"
          aria-expanded={isLangOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="transition-transform duration-300 sm:w-5 sm:h-5 w-4 h-4 {isLangOpen ? 'outline-none' : ''}"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path
              d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
            />
          </svg>
        </button>

        {#if isLangOpen}
          <div
            bind:this={dropdownElement}
            role="menu"
            tabindex="-1"
            onmouseleave={handleDropdownMouseLeave}
            transition:fly={isMobile ? { duration: 0 } : { y: 8, duration: 400, opacity: 0 }}
            class="absolute top-full left-1/2 -translate-x-1/2 mt-3 p-1 sm:p-1.5 rounded-full bg-[#1a1a1a]/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 flex flex-col gap-1 items-center pointer-events-auto"
          >
            <div
              class="absolute top-0 left-0 bg-white/10 rounded-full sm:transition-all sm:duration-300 sm:ease-out z-0 border border-white/5"
              style={dropdownHighlightStyle}
            ></div>

            {#each availableLocales as loc}
              <button
                data-id={loc.id}
                role="menuitem"
                onclick={() => selectLang(loc.id)}
                onmouseenter={(e) => updateDropdownHighlight(e.currentTarget)}
                class="relative z-10 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full transition-colors duration-300 group/item
                         {$locale === loc.id ? 'text-white' : 'text-gray-400 hover:text-white'}"
                aria-label={loc.label}
              >
                <img
                  src={flagUrls[loc.id]}
                  alt={loc.label}
                  class="w-5 h-3.5 sm:w-6 sm:h-4 object-cover transition-transform duration-300 group-hover/item:scale-110 rounded-[2px] shadow-sm"
                />
              </button>
            {/each}
          </div>
        {/if}
      </li>
    </ul>
  </nav>
</div>

<style>
  @media (hover: hover) {
    a:not(.text-white):hover,
    button:hover {
      color: #e5e7eb;
    }
  }
</style>
