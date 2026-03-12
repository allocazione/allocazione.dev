import { register, init, getLocaleFromNavigator, waitLocale } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('it', () => import('./locales/it.json'));
register('de', () => import('./locales/de.json'));
register('es', () => import('./locales/es.json'));

const initialLocale = typeof window !== 'undefined' ? getLocaleFromNavigator() : 'en';

init({
  fallbackLocale: 'en',
  initialLocale,
});

if (typeof window !== 'undefined') {
  waitLocale();
}
