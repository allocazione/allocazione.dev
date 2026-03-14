import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';

register('en', () => import('./data/en.json'));
register('it', () => import('./data/it.json'));
register('de', () => import('./data/de.json'));
register('es', () => import('./data/es.json'));

const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const supportedLocales = new Set(['en', 'it', 'de', 'es']);

const normalizeLocale = (value) => {
  if (!value || typeof value !== 'string') return 'en';
  const normalized = value.toLowerCase().split('-')[0];
  return supportedLocales.has(normalized) ? normalized : 'en';
};

const desiredClientLocale =
  typeof window !== 'undefined'
    ? normalizeLocale(getCookie('locale') || getLocaleFromNavigator())
    : 'en';

// Keep SSR and first hydration render aligned for prerendered pages.
const initialLocale = 'en';

init({
  fallbackLocale: 'en',
  initialLocale,
});

if (typeof window !== 'undefined') {
  locale.subscribe((newLocale) => {
    if (newLocale) {
      document.cookie = `locale=${newLocale}; max-age=31536000; path=/; samesite=lax`;
    }
  });

  // Apply saved locale after hydration to avoid hydration_html_changed warnings.
  if (desiredClientLocale !== initialLocale) {
    requestAnimationFrame(() => {
      locale.set(desiredClientLocale);
    });
  }
}
