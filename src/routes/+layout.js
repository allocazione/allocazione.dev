import { browser } from '$app/environment';
import { init, waitLocale } from 'svelte-i18n';
import '$lib/i18n.js';

export const prerender = true;
export const trailingSlash = 'always';

export const load = async () => {
  await waitLocale();
};
