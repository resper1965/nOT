// i18n Configuration for ness. OT GRC
// Based on next-intl for multi-language support

import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['pt', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'pt';

// Locale configuration
export const localeNames: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
};

// Locale flags (for UI)
export const localeFlags: Record<Locale, string> = {
  pt: '🇧🇷',
  en: '🇺🇸',
  es: '🇪🇸',
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

