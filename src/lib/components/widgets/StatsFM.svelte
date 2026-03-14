<script>
  import { siteConfig } from "$lib/config.js";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import ScrollingText from "../ui/ScrollingText.svelte";
  import { themeState } from "$lib/state.svelte.js";

  const CACHE_KEY = "statsfm_widget_cache_v1";
  const CACHE_TTL_MS = 120000;

  let data = $state(null);
  let loading = $state(true);
  let error = $state(false);

  let spotifyUrls = $state({
    currentTrackId: null,
    album: "",
    artists: {},
  });

  const readCache = () => {
    if (!browser) return null;

    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      const isValid =
        parsed?.cachedAt &&
        Date.now() - parsed.cachedAt < CACHE_TTL_MS &&
        parsed?.data?.track;

      return isValid ? parsed : null;
    } catch (err) {
      console.error("Error reading Stats.fm cache:", err);
      return null;
    }
  };

  const writeCache = () => {
    if (!browser || !data?.track) return;

    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          cachedAt: Date.now(),
          data,
          spotifyUrls,
        }),
      );
    } catch (err) {
      console.error("Error writing Stats.fm cache:", err);
    }
  };

  const fetchSpotifyUrls = async (track) => {
    if (!track) return;

    if (spotifyUrls.currentTrackId !== track.id) {
      spotifyUrls = { currentTrackId: track.id, album: "", artists: {} };
    }

    let nextAlbum = spotifyUrls.album;
    let nextArtists = { ...spotifyUrls.artists };
    let hasChanges = false;

    if (track.albums?.length > 0 && !nextAlbum) {
      try {
        const albumId = track.albums[0].id;
        const res = await fetch(
          `https://beta-api.stats.fm/api/v1/albums/${albumId}`,
        );
        const albumData = await res.json();
        if (albumData?.item?.externalIds?.spotify?.length > 0) {
          nextAlbum = `https://open.spotify.com/album/${albumData.item.externalIds.spotify[0]}`;
          hasChanges = true;
        }
      } catch (err) {
        console.error("Error fetching album Spotify ID", err);
      }
    }

    if (track.artists?.length > 0) {
      await Promise.all(
        track.artists.map(async (artist) => {
          if (!nextArtists[artist.id]) {
            try {
              const res = await fetch(
                `https://beta-api.stats.fm/api/v1/artists/${artist.id}`,
              );
              const artistData = await res.json();
              if (artistData?.item?.externalIds?.spotify?.length > 0) {
                nextArtists[artist.id] =
                  `https://open.spotify.com/artist/${artistData.item.externalIds.spotify[0]}`;
                hasChanges = true;
              }
            } catch (err) {
              console.error("Error fetching artist Spotify ID", err);
            }
          }
        }),
      );
    }

    if (hasChanges) {
      spotifyUrls = {
        currentTrackId: track.id,
        album: nextAlbum,
        artists: nextArtists,
      };

      writeCache();
    }
  };

  const updateAccentColor = async (imageUrl) => {
    if (!browser || !imageUrl) return;

    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 1;
      canvas.height = 1;
      ctx.drawImage(img, 0, 0, 1, 1);
      let [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

      const r_norm = r / 255, g_norm = g / 255, b_norm = b / 255;
      const max = Math.max(r_norm, g_norm, b_norm), min = Math.min(r_norm, g_norm, b_norm);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r_norm: h = (g_norm - b_norm) / d + (g_norm < b_norm ? 6 : 0); break;
          case g_norm: h = (b_norm - r_norm) / d + 2; break;
          case b_norm: h = (r_norm - g_norm) / d + 4; break;
        }
        h /= 6;
      }

      if (l < 0.6) {
         l = 0.6;
         if (s === 0) {
           r = g = b = Math.round(l * 255);
         } else {
           const hue2rgb = (p, q, t) => {
             if(t < 0) t += 1;
             if(t > 1) t -= 1;
             if(t < 1/6) return p + (q - p) * 6 * t;
             if(t < 1/2) return q;
             if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
             return p;
           };
           const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
           const p = 2 * l - q;
           r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
           g = Math.round(hue2rgb(p, q, h) * 255);
           b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
         }
      }

      const hex =
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

      themeState.accentColor = hex;
      themeState.accentRgb = `${r}, ${g}, ${b}`;

      document.cookie = `accent_color=${encodeURIComponent(hex)}; max-age=31536000; path=/; samesite=lax`;
      document.documentElement.style.setProperty("--accent", hex);
      document.documentElement.style.setProperty(
        "--accent-rgb",
        `${r}, ${g}, ${b}`,
      );
    } catch (err) {
      console.error("Error extracting album color:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `https://beta-api.stats.fm/api/v1/users/${siteConfig.statsFmUser}/streams/current`,
      );

      if (!res.ok) {
        throw new Error("Stats.fm API error");
      }

      const rawData = await res.json();

      if (rawData && rawData.item) {
        data = rawData.item;
        error = false;
        if (data.track) {
          fetchSpotifyUrls(data.track);
          updateAccentColor(data.track.albums[0]?.image);
          writeCache();
        }
      } else {
        const recentRes = await fetch(
          `https://beta-api.stats.fm/api/v1/users/${siteConfig.statsFmUser}/streams/recent?limit=1`,
        );
        if (recentRes.ok) {
          const recentData = await recentRes.json();
          if (recentData?.items?.length > 0) {
            data = {
              isPlaying: false,
              track: recentData.items[0].track,
            };
            error = false;
            if (data.track) {
              fetchSpotifyUrls(data.track);
              updateAccentColor(data.track.albums[0]?.image);
              writeCache();
            }
          } else {
            error = true;
          }
        } else {
          error = true;
        }
      }
    } catch (err) {
      console.error("Error fetching Stats.fm data:", err);
      if (!data?.track) {
        error = true;
      }
    } finally {
      loading = false;
    }
  };

  $effect(() => {
    if (!siteConfig.statsFmUser) {
      loading = false;
      error = true;
      return;
    }

    const cached = readCache();
    if (cached) {
      data = cached.data;
      spotifyUrls = {
        currentTrackId: cached.spotifyUrls?.currentTrackId ?? null,
        album: cached.spotifyUrls?.album ?? "",
        artists: cached.spotifyUrls?.artists ?? {},
      };
      loading = false;
      error = false;
    }

    fetchStats();
    const pollingInterval = setInterval(fetchStats, 20000);

    return () => {
      if (browser && pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  });

  let isPlaying = $derived(data?.isPlaying ?? false);
</script>

{#if data?.track}{/if}

<div class="relative z-10 flex flex-col h-full w-full">
  {#if loading}
    <div class="animate-pulse flex gap-4 w-full" in:fade={{ duration: 300 }}>
      <div class="w-16 h-16 bg-white/5 rounded-xl shrink-0"></div>
      <div class="flex flex-col gap-2 w-full justify-center">
        <div class="h-3 bg-white/5 rounded-full w-3/4"></div>
        <div class="h-2 bg-white/5 rounded-full w-1/2"></div>
      </div>
    </div>
  {:else if error || !data?.track}
    <div
      class="flex items-center h-16 text-gray-500 text-xs tracking-wider"
      in:fade={{ duration: 300 }}
    >
      // offline...
    </div>
  {:else}
    <div
      class="flex gap-8 items-center w-full grow"
      in:fade={{ duration: 300 }}
    >
      <a
        href={spotifyUrls.album || undefined}
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 relative group/art"
        class:pointer-events-none={!spotifyUrls.album}
        aria-label="View album on Spotify"
      >
        <div class="relative flex items-center justify-center shrink-0">
          <!-- Ambilight glow background -->
          <div class="absolute inset-0 z-0 pointer-events-none opacity-60">
            <img
              src={data.track.albums[0]?.image || ""}
              alt=""
              class="w-full h-full object-cover rounded-2xl scale-110"
              style="filter: url(#ambilight);"
            />
          </div>

          <!-- Main Album Art -->
          <img
            src={data.track.albums[0]?.image || ""}
            alt={data.track.name}
            class="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-white/10 shadow-2xl group-hover/art:scale-105 transition-transform duration-500"
          />
        </div>
      </a>

      <div class="flex flex-col min-w-0 overflow-hidden w-full gap-1">
        <div class="flex items-center gap-2 mb-2">
          {#if isPlaying}
            <span
              class="text-[10px] text-accent tracking-[0.2em] font-medium uppercase opacity-80"
              >now playing on</span
            >
            <svg
              aria-hidden="true"
              class="h-2.5 w-auto text-accent"
              style="display:inline-block;vertical-align:middle;"
              viewBox="0 0 509 509"
              fill="currentColor"
              ><path
                d="M77.7698 151.964H31.8607C14.3745 151.964 0.199219 166.169 0.199219 183.691V477.17C0.199219 494.691 14.3745 508.896 31.8607 508.896H77.7698C95.256 508.896 109.431 494.691 109.431 477.17V183.691C109.431 166.169 95.256 151.964 77.7698 151.964Z"
              ></path><path
                d="M277.239 0.72998H231.33C213.843 0.72998 199.668 14.9348 199.668 32.4574V477.17C199.668 494.691 213.843 508.896 231.33 508.896H277.239C294.726 508.896 308.9 494.691 308.9 477.17V32.4574C308.9 14.9348 294.726 0.72998 277.239 0.72998Z"
              ></path><path
                d="M476.702 291.035H430.794C413.306 291.035 399.133 305.24 399.133 322.761V477.168C399.133 494.691 413.306 508.896 430.794 508.896H476.702C494.19 508.896 508.363 494.691 508.363 477.168V322.761C508.363 305.24 494.19 291.035 476.702 291.035Z"
              ></path></svg
            >
          {:else}
            <span
              class="text-[10px] text-gray-500 tracking-[0.2em] font-medium uppercase"
              >Last Played on</span
            >
            <svg
              aria-hidden="true"
              class="h-2.5 w-auto text-gray-500"
              style="display:inline-block;vertical-align:middle;"
              viewBox="0 0 509 509"
              fill="currentColor"
              ><path
                d="M77.7698 151.964H31.8607C14.3745 151.964 0.199219 166.169 0.199219 183.691V477.17C0.199219 494.691 14.3745 508.896 31.8607 508.896H77.7698C95.256 508.896 109.431 494.691 109.431 477.17V183.691C109.431 166.169 95.256 151.964 77.7698 151.964Z"
              ></path><path
                d="M277.239 0.72998H231.33C213.843 0.72998 199.668 14.9348 199.668 32.4574V477.17C199.668 494.691 213.843 508.896 231.33 508.896H277.239C294.726 508.896 308.9 494.691 308.9 477.17V32.4574C308.9 14.9348 294.726 0.72998 277.239 0.72998Z"
              ></path><path
                d="M476.702 291.035H430.794C413.306 291.035 399.133 305.24 399.133 322.761V477.168C399.133 494.691 413.306 508.896 430.794 508.896H476.702C494.19 508.896 508.363 494.691 508.363 477.168V322.761C508.363 305.24 494.19 291.035 476.702 291.035Z"
              ></path></svg
            >
          {/if}
        </div>

        <ScrollingText
          text={data.track.name}
          href={data.track.externalIds?.spotify?.[0]
            ? `https://open.spotify.com/track/${data.track.externalIds.spotify[0]}`
            : undefined}
          className="text-xl md:text-2xl font-bold text-white tracking-tight"
        />
        <ScrollingText
          text={data.track.artists.map((a) => a.name).join(", ")}
          className="text-sm md:text-base text-gray-400 font-light lowercase w-full"
        >
          {#each data.track.artists as artist, i}
            {#if spotifyUrls.artists[artist.id]}
              <a
                href={spotifyUrls.artists[artist.id]}
                target="_blank"
                rel="noopener noreferrer"
                class="relative inline hover:text-white transition-colors artist-link"
                >{artist.name}</a
              >
            {:else}
              <span class="">{artist.name}</span>
            {/if}{#if i < data.track.artists.length - 1}<span
                class="text-gray-600">,&nbsp;</span
              >{/if}
          {/each}
        </ScrollingText>
      </div>
    </div>
  {/if}
</div>

<style>
  @media (hover: hover) {
    .artist-link {
      transition: color 200ms;
    }
    .artist-link:hover {
      color: #e5e7eb; /* text-gray-200 */
    }
    .artist-link::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
      bottom: 0;
      left: 0;
      background-color: var(--color-accent);
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 300ms;
    }
    .artist-link:hover::before {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
</style>
