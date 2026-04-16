export const languages = {
  de: '🇩🇪',
  en: '🇬🇧',
};

export const defaultLang = 'de';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof languages) {
  return function t(key: string) {
    return key;
  }
}
