import { browser } from '$app/environment';
import { init, waitLocale } from 'svelte-i18n';
import '$lib/locales/i18n.js';

export const prerender = true;
export const trailingSlash = 'always';

export const load = async () => {
  await waitLocale();
};
