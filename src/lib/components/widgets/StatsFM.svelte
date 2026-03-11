<script>
  import { siteConfig } from "$lib/config.js";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import ScrollingText from "../ui/ScrollingText.svelte";

  let data = $state(null);
  let loading = $state(true);
  let error = $state(false);

  let spotifyUrls = $state({
    currentTrackId: null,
    album: "",
    artists: {},
  });

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
      error = true;
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

<div class="relative z-10 flex flex-col h-full items-start justify-center">
  <div class="flex items-center gap-2 mb-4">
    {#if isPlaying}
      <span class="text-xs text-accent tracking-[0.2em] font-light lowercase"
        >now listening on</span
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
      <svg
        aria-hidden="true"
        class="w-3 h-3 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        ></path><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path></svg
      >
      <span class="text-xs text-gray-500 tracking-[0.2em] font-light lowercase"
        >last played on</span
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
    <div class="flex gap-4 items-center w-full" in:fade={{ duration: 300 }}>
      <a
        href={spotifyUrls.album || undefined}
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0"
        class:pointer-events-none={!spotifyUrls.album}
        aria-label="View album on Spotify"
      >
        <img
          src={data.track.albums[0]?.image || ""}
          alt={data.track.name}
          class="w-16 h-16 rounded-xl object-cover border border-[#252525] shadow-lg shrink-0"
        />
      </a>

      <div class="flex flex-col min-w-0 overflow-hidden w-full relative">
        <ScrollingText
          text={data.track.name}
          href={data.track.externalIds?.spotify?.[0]
            ? `https://open.spotify.com/track/${data.track.externalIds.spotify[0]}`
            : undefined}
          className="text-sm font-medium text-gray-200"
        />
        <ScrollingText
          text={data.track.artists.map((a) => a.name).join(", ")}
          className="mt-0.5 text-[10px] text-gray-400 font-['Space_Mono'] lowercase w-full"
        >
          {#each data.track.artists as artist, i}
            {#if spotifyUrls.artists[artist.id]}
              <a
                href={spotifyUrls.artists[artist.id]}
                target="_blank"
                rel="noopener noreferrer"
                class="relative inline tracking-widest mr-[-0.1em] hover:text-gray-200 transition-colors duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:w-full before:h-px before:bottom-0 before:left-0 before:bg-accent before:scale-x-0 before:origin-bottom-right hover:before:origin-bottom-left before:transition-transform before:duration-300"
                >{artist.name}</a
              >
            {:else}
              <span class="tracking-widest mr-[-0.1em]"
                >{artist.name}</span
              >
            {/if}{#if i < data.track.artists.length - 1}<span
                class="tracking-normal text-gray-600">,&nbsp;</span
              >{/if}
          {/each}
        </ScrollingText>
      </div>
    </div>
  {/if}
</div>
