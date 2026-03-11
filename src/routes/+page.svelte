<script>
  import Button from "$lib/components/ui/Button.svelte";
  import Clock from "$lib/components/widgets/Clock.svelte";
  import StatsFM from "$lib/components/widgets/StatsFM.svelte";
  import { tooltip } from "$lib/tooltip.js";
  import { fadeIn } from "$lib/actions.js";

  import { siteConfig } from "$lib/config.js";

  const { name, profession, skills, email, avatar } = siteConfig;
</script>

<svelte:head>
  <title>@seleneftw / home</title>
  <meta name="description" content="portfolio of {name}" />
</svelte:head>

<div
  use:fadeIn
  class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 md:gap-6 w-full transition-all duration-1000 opacity-0 translate-y-8 relative z-10"
>
  <div
    class="md:col-span-1 md:row-span-2 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-8 flex flex-col justify-between relative group overflow-hidden shadow-2xl"
  >
    <div
      aria-hidden="true"
      class="absolute -top-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-[80px] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100"
    ></div>

    <div class="relative z-10 grow pt-4">
      <img
        src={avatar}
        alt={name}
        class="w-32 h-32 mb-8 rounded-2xl object-cover border border-[#252525] shadow-lg group-hover:border-accent/30 transition-colors duration-500"
      />
      <h1
        class="text-2xl mt-2 text-accent mb-2 lowercase"
        style="letter-spacing: normal; text-shadow: none;"
      >
        hi, i'm <span class="font-semibold">{name}</span>.
      </h1>
      <p
        class="text-[15px] text-gray-500 mb-12 lowercase tracking-[0.2em] font-light"
      >
        {profession.toLowerCase()}
      </p>

      <div class="font-['Space_Mono'] text-xs tracking-widest mt-8 space-y-1.5 opacity-90">
        <div class="flex items-center gap-2">
          <span class="text-gray-600">~</span>
          <span class="text-accent">selene</span>
          <span class="text-gray-500">&gt;_</span><span class="text-[#c084fc]">portfolio</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-600">~</span>
          <span class="text-[#60a5fa]">📁 home</span>
          <span class="text-gray-600">~</span>
          <span class="animate-[pulse_1s_infinite] font-bold">_</span>
        </div>
      </div>
    </div>

    <div class="relative z-10 mt-8 mb-4">
      <div class="flex gap-4">
        {#each siteConfig.socials as social}
          <div class="relative inline-flex">
            <a
              use:tooltip={social.name}
              target="_blank"
              href={social.url}
              class="text-lg text-gray-500 hover:text-accent transition-colors duration-300"
            >
              {#if social.name === "GitHub"}
                <svg
                  aria-hidden="true"
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 496 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                  ></path></svg
                >
              {:else if social.name === "Discord"}
                <svg
                  aria-hidden="true"
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 640 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"
                  ></path></svg
                >
              {:else if social.name === "Telegram"}
                <svg
                  aria-hidden="true"
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 448 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"
                  ></path></svg
                >
              {:else if social.name === "Steam"}
                <svg
                  aria-hidden="true"
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 496 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    d="M496 256c0 137-111.2 248-248.4 248-113.8 0-209.6-76.3-239-180.4l95.2 39.3c6.4 32.1 34.9 56.4 68.9 56.4 39.2 0 71.9-32.4 70.2-73.5l84.5-60.2c52.1 1.3 95.8-40.9 95.8-93.5 0-51.6-42-93.5-93.7-93.5s-93.7 42-93.7 93.5v1.2L176.6 279c-15.5-.9-30.7 3.4-43.5 12.1L0 236.1C10.2 108.4 117.1 8 247.6 8 384.8 8 496 119 496 256zM155.7 384.3l-30.5-12.6a52.79 52.79 0 0 0 27.2 25.8c26.9 11.2 57.8-1.6 69-28.4 5.4-13 5.5-27.3.1-40.3-5.4-13-15.5-23.2-28.5-28.6-12.9-5.4-26.7-5.2-38.9-.6l31.5 13c19.8 8.2 29.2 30.9 20.9 50.7-8.3 19.9-31 29.2-50.8 21zm173.8-129.9c-34.4 0-62.4-28-62.4-62.3s28-62.3 62.4-62.3 62.4 28 62.4 62.3-27.9 62.3-62.4 62.3zm.1-15.6c25.9 0 46.9-21 46.9-46.8 0-25.9-21-46.8-46.9-46.8s-46.9 21-46.9 46.8c.1 25.8 21.1 46.8 46.9 46.8z"
                  ></path></svg
                >
              {:else}
                {social.name}
              {/if}
            </a>
          </div>
        {/each}
      </div>
    </div>

    <div class="relative z-10 flex justify-between items-center">
      <span class="text-xs text-gray-600 font-light lowercase tracking-wider">
        // i'll lose the beat to be complete and fall<br> // i'll be human after all
      </span>
      <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
    </div>
  </div>

  <div
    id="about"
    use:fadeIn
    class="md:col-span-3 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-8 flex flex-col justify-center relative group overflow-hidden shadow-2xl transition-all duration-1000 opacity-0 translate-y-8"
  >
    <div
      aria-hidden="true"
      class="absolute -bottom-24 -right-24 w-64 h-64 bg-white/2 rounded-full blur-[80px] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100"
    ></div>

    <div class="relative z-10 w-full flex flex-col items-end text-right">
      <div class="flex items-center gap-4 mb-6 justify-end">
        <h2 class="text-accent text-xs tracking-[0.2em] font-light lowercase">
          who am i?
        </h2>
      </div>

      <div
        class="text-gray-400 text-sm leading-loose font-light space-y-4 max-w-xl"
      >
        <p>
          i'm a researcher and developer focused on <span class="text-gray-200"
            >low-level systems</span
          >
          and <span class="text-gray-200">security</span>. i enjoy the technical
          challenge of optimizing
          <span class="text-gray-200">high-concurrency architectures</span>
          and developing
          <span class="text-gray-200">forensic methodologies</span>
          that actually scale. i spend most of my time working with
          <span class="text-gray-200">C, Rust, Go, and Python</span> to build things
          that are both performant and memory-safe.
        </p>
        <p class="pt-2">
          i believe in <span class="text-gray-200">technical integrity</span>,
          <span class="text-gray-200">security by design</span>
          and i focus on rigorous
          <span class="text-gray-200">vulnerability research</span> to build tools
          that don't just solve problems, but also ensuring they're actually built
          for speed and efficiency.
        </p>
      </div>
    </div>
  </div>

  <div
    id="clock"
    class="md:col-span-1 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-8 flex flex-col relative group overflow-hidden shadow-2xl"
  >
    <Clock />
  </div>

  <div
    id="music"
    class="md:col-span-2 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-8 mt-4 md:mt-0 flex flex-col justify-center relative group overflow-hidden shadow-2xl"
  >
    <StatsFM />
  </div>
</div>
