<script>
  import { browser } from "$app/environment";
  import { untrack } from "svelte";

  let {
    text = "",
    className = "",
    fadeWidth = 8,
    href = undefined,
    children,
  } = $props();

  let containerRef = $state();
  let textRef = $state();
  let dupeTextRef = $state();
  let dividerRef = $state();

  let isOverflowing = $state(false);
  let animationDuration = $state(0);
  let textWidth = $state(0);
  let dividerWidth = $state(0);
  let containerWidth = $state(0);

  const calculateOverflow = () => {
    if (containerRef && textRef) {
      let isTextOverflowing;
      let len;

      if (isOverflowing && dupeTextRef) {
        const r1 = textRef.getBoundingClientRect();
        const r2 = dupeTextRef.getBoundingClientRect();
        len = r2.left - r1.left;

        isTextOverflowing =
          dupeTextRef.getBoundingClientRect().width > containerRef.offsetWidth;
      } else {
        isTextOverflowing = textRef.scrollWidth > containerRef.offsetWidth;
        len = textRef.scrollWidth;
      }

      if (isOverflowing !== isTextOverflowing) {
        isOverflowing = isTextOverflowing;
      }

      if (isTextOverflowing) {
        containerWidth = containerRef.offsetWidth;
        const pixelsPerSecond = 30;
        animationDuration = len / pixelsPerSecond;
        textWidth = len;
      }
    }
  };

  $effect(() => {
    text;
    children;
    isOverflowing;
    if (browser) {
      setTimeout(() => untrack(calculateOverflow), 0);
    }
  });

  $effect(() => {
    if (browser) {
      untrack(calculateOverflow);
      window.addEventListener("resize", calculateOverflow);
      return () => window.removeEventListener("resize", calculateOverflow);
    }
  });

  let leftStop = $derived(
    containerWidth ? `${(8 / containerWidth) * 100 + fadeWidth / 2}%` : "0%",
  );
  let rightStop = $derived(`calc(100% - ${leftStop})`);
</script>

<div
  bind:this={containerRef}
  class="relative w-full overflow-hidden {className}"
  style={isOverflowing
    ? `
      --leftStop: ${leftStop};
      --rightStop: ${rightStop};
      mask-image: linear-gradient(to right, transparent 0%, black var(--leftStop), black var(--rightStop), transparent 100%);
      -webkit-mask-image: linear-gradient(to right, transparent 0%, black var(--leftStop), black var(--rightStop), transparent 100%);
    `
    : ""}
>
  <div
    bind:this={textRef}
    class="whitespace-nowrap {isOverflowing
      ? 'animate-scroll-text inline-block'
      : 'inline-block truncate w-full'}"
    style={isOverflowing
      ? `
        animation-duration: ${animationDuration}s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        --text-width: ${textWidth}px;
        will-change: transform;
      `
      : ""}
  >
    {#if children}
      {@render children()}
    {:else if href}
      <a
        {href}
        target="_blank"
        rel="noopener noreferrer"
        class="relative inline-block hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-accent before:scale-x-0 before:origin-bottom-right hover:before:origin-bottom-left before:transition-transform before:duration-300 md:inline"
        class:pointer-events-none={!href}
      >
        {text}
      </a>
    {:else}
      <span>{text}</span>
    {/if}

    {#if isOverflowing}
      <div class="text-center inline-block px-2" bind:this={dividerRef}>・</div>
      <span bind:this={dupeTextRef} aria-hidden="true">
        {#if children}
          {@render children()}
        {:else if href}
          <a
            {href}
            target="_blank"
            rel="noopener noreferrer"
            class="relative inline-block hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-accent before:scale-x-0 before:origin-bottom-right hover:before:origin-bottom-left before:transition-transform before:duration-300"
            class:pointer-events-none={!href}
            tabindex="-1"
          >
            {text}
          </a>
        {:else}
          {text}
        {/if}
      </span>
    {/if}
  </div>
</div>

<style>
  @keyframes scrollText {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-1 * var(--text-width)));
    }
  }

  .animate-scroll-text {
    animation-name: scrollText;
  }
</style>
