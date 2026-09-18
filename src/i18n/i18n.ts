import en from '@/i18n/en';

const languages = { en };
const activeLang = languages.en;

/*** Returns the localized string for a translation key. */
export function t(term: string) {
  return activeLang[term] || `{${term}}`;
}

export type ILanguage = Readonly<Record<string, string>>;
