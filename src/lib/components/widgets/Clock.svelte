<script>
  import Ticker from "../ui/Ticker.svelte";

  let time = $state("00:00:00");

  function updateTime() {
    const now = new Date();
    time = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  $effect(() => {
    updateTime();
    let interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });
</script>

<div
  class="relative z-10 flex flex-col h-full items-center justify-center text-center"
  aria-label="Current time"
>

  <div
    class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
  >
    <div class="w-32 h-32 bg-white/3 rounded-full blur-[50px]"></div>
  </div>


  <div
    class="font-['Space_Mono'] text-accent flex items-end gap-1 mb-2 tracking-wider"
  >
    <Ticker value={time} />
  </div>

  <div class="mt-4 flex flex-col items-center gap-1">
    <span class="text-[10px] text-gray-500 tracking-widest mt-1"
      >in Bologna, Italy</span
    >
  </div>
</div>
