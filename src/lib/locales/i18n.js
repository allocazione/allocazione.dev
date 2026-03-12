import { register, init, getLocaleFromNavigator, waitLocale } from 'svelte-i18n';

register('en', () => import('./data/en.json'));
register('it', () => import('./data/it.json'));
register('de', () => import('./data/de.json'));
register('es', () => import('./data/es.json'));

const initialLocale = typeof window !== 'undefined' ? getLocaleFromNavigator() : 'en';

init({
  fallbackLocale: 'en',
  initialLocale,
});

if (typeof window !== 'undefined') {
  waitLocale();
}
