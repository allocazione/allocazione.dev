<script>
  import Button from "$lib/components/ui/Button.svelte";
  import { siteConfig } from "$lib/config.js";
  import { fadeIn } from "$lib/actions.js";
  import { tooltip } from "$lib/tooltip.js";
  const { email, name } = siteConfig;
</script>

<svelte:head>
  <title>@seleneftw / contact</title>
  <meta name="description" content="Reach out to {name}." />
</svelte:head>

<div class="w-full pt-4 pb-8">
  <div
    use:fadeIn
    class="mb-16 transition-all duration-1000 opacity-0 translate-y-8"
  >
    <h1
      class="font-['Space_Mono'] text-accent text-2xl lowercase tracking-widest mb-4"
    >
      contact.
    </h1>
    <p
      class="text-gray-400 font-light text-sm max-w-xl leading-loose lowercase"
    >
      available for strategic research collaborations, software development
      engagements, and technical security consulting.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
    <div
      use:fadeIn
      class="md:col-span-2 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-12 group relative overflow-hidden shadow-2xl transition-all duration-1000 opacity-0 translate-y-8"
    >
      <div class="relative z-10 h-full flex flex-col justify-between">
        <div>
          <div
            class="text-accent text-xs tracking-[0.2em] font-light lowercase mb-8 flex items-center gap-3"
          >
            <span class="w-2 h-2 rounded-full bg-accent/30"></span>
          </div>
          <p
            class="text-xl text-gray-300 font-light leading-relaxed mb-12 max-w-lg"
          >
            feel free to reach out by email or dm for collaborations, questions
            or just to say hi!
          </p>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 py-8 border-y border-white/[0.03]"
          >
            <div>
              <h3
                class="text-[10px] text-gray-600 font-['Space_Mono'] uppercase tracking-[0.2em] mb-3"
              >
                availability
              </h3>
              <p
                class="text-sm text-gray-400 font-light lowercase leading-relaxed italic"
              >
                down for cool projects, research, or interesting collaborations
              </p>
            </div>
            <div>
              <h3
                class="text-[10px] text-gray-600 font-['Space_Mono'] uppercase tracking-[0.2em] mb-3"
              >
                protocol
              </h3>
              <p
                class="text-sm text-gray-400 font-light lowercase leading-relaxed italic"
              >
                dms are always open for a quick chat!
              </p>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-8 mt-4"
        >
          <Button href={`mailto:${email}`}>
            email me <span class="ml-2 text-accent">&lt;/&gt;</span>
          </Button>
          <div class="flex flex-col gap-1">
            <span
              class="text-[10px] text-gray-600 font-['Space_Mono'] uppercase tracking-widest"
              >direct inquiry</span
            >
            <span class="text-sm text-gray-400 lowercase">{email}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      use:fadeIn
      style="transition-delay: 150ms"
      class="md:col-span-1 bg-[#0f0f0f]/80 backdrop-blur-xl border border-[#252525] rounded-4xl p-10 group relative overflow-hidden shadow-2xl transition-all duration-1000 opacity-0 translate-y-8"
    >
      <h2
        class="text-gray-500 text-[10px] tracking-[0.3em] font-['Space_Mono'] lowercase mb-12"
      >
        presence
      </h2>

      <div class="space-y-4">
        {#each siteConfig.socials as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-[#252525] hover:border-accent/40 hover:bg-white/5 transition-all duration-500 group/social"
          >
            <span
              class="text-sm text-gray-300 lowercase font-light group-hover/social:text-white transition-colors"
            >
              {social.name}
            </span>
            <svg
              class="w-4 h-4 text-gray-600 group-hover/social:text-accent group-hover/social:translate-x-1 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </a>
        {/each}
      </div>

      <div class="mt-12 text-center">
        <span
          class="text-[10px] text-gray-600 font-['Space_Mono'] lowercase tracking-[0.2em] animate-pulse"
        >
          // waiting for signal
        </span>
      </div>
    </div>
  </div>
</div>
