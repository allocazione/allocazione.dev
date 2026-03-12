<script>
  let { value = "0" } = $props();

  const digitsArray = $derived(value.split(""));
</script>

<div class="relative flex flex-row transition-all duration-300">
  {#each digitsArray as char, i (i)}
    {#if char === ":"}
      <span class="text-3xl sm:text-4xl font-light opacity-50 px-0.5">:</span>
    {:else}
      <div
        class="relative overflow-hidden h-10 sm:h-12 w-5 sm:w-6"
        style="transform: translateZ(0); backface-visibility: hidden;"
      >
        <div
          class="absolute w-full flex flex-col transition-transform duration-300 ease-in-out"
          style="transform: translateY(-{parseInt(char) * 10}%);"
        >
          {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as num}
            <div class="flex justify-center items-center h-10 sm:h-12">
              <span
                class="text-3xl sm:text-4xl font-light"
                style="backface-visibility: hidden;">{num}</span
              >
            </div>
          {/each}
        </div>
        <span class="invisible text-3xl sm:text-4xl font-light">0</span>
      </div>
    {/if}
  {/each}
</div>
