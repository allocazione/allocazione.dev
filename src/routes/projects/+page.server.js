// Data is fetched client-side in +page.svelte to avoid stale builds with adapter-static
export const load = async () => {
    return { projects: [], stats: null };
};
