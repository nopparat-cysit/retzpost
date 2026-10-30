import { Locale } from './i18n-types';

/**
 * Format a numeric amount into Thai Baht currency string
 */
export function formatCurrencyThb(amount: number, locale: Locale = 'th'): string {
  const formatted = Math.round(amount).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US');
  if (locale === 'th') {
    return `฿${formatted}`;
  }
  return `฿${formatted} THB`;
}

/**
 * Format token count with token coin glyph
 */
export function formatTokenCount(tokens: number, locale: Locale = 'th'): string {
  const formatted = Math.round(tokens).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US');
  return `${formatted} 🪙`;
}

/**
 * Format date string into friendly localized display
 */
export function formatLocalizedDate(date: Date | string | number, locale: Locale = 'th'): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);

  if (locale === 'th') {
    return d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time with hours and minutes
 */
export function formatLocalizedTime(date: Date | string | number, locale: Locale = 'th'): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleTimeString(locale === 'th' ? 'th-TH' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
