import { register, init, getLocaleFromNavigator, waitLocale, locale } from 'svelte-i18n';

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

const initialLocale = typeof window !== 'undefined' ? (getCookie('locale') || getLocaleFromNavigator()) : 'en';

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
  waitLocale();
}
