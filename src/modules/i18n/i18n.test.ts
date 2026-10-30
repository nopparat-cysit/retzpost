import { describe, it, expect } from 'vitest';
import { th } from './translations/th';
import { en } from './translations/en';
import { formatCurrencyThb, formatTokenCount, formatLocalizedDate } from './i18n-formatters';

function getDeepKeys(obj: Record<string, any>, prefix = ''): string[] {
  return Object.keys(obj).reduce((res: string[], el: string) => {
    const key = prefix ? `${prefix}.${el}` : el;
    if (typeof obj[el] === 'object' && obj[el] !== null && !Array.isArray(obj[el])) {
      return [...res, ...getDeepKeys(obj[el], key)];
    }
    return [...res, key];
  }, []);
}

describe('RETZPOST Bilingual i18n System', () => {
  it('has 100% key parity between Thai and English dictionaries', () => {
    const thKeys = getDeepKeys(th).sort();
    const enKeys = getDeepKeys(en).sort();

    const missingInEn = thKeys.filter((k) => !enKeys.includes(k));
    const missingInTh = enKeys.filter((k) => !thKeys.includes(k));

    expect(missingInEn, `Keys present in Thai but missing in English: ${missingInEn.join(', ')}`).toEqual([]);
    expect(missingInTh, `Keys present in English but missing in Thai: ${missingInTh.join(', ')}`).toEqual([]);
    expect(thKeys.length).toBeGreaterThan(50);
  });

  it('formats currency correctly for Thai and English locales', () => {
    expect(formatCurrencyThb(79, 'th')).toBe('฿79');
    expect(formatCurrencyThb(199, 'th')).toBe('฿199');
    expect(formatCurrencyThb(199, 'en')).toBe('฿199 THB');
    expect(formatCurrencyThb(1490, 'en')).toBe('฿1,490 THB');
  });

  it('formats token count correctly with token coin glyph', () => {
    expect(formatTokenCount(150, 'th')).toBe('150 🪙');
    expect(formatTokenCount(3500, 'en')).toBe('3,500 🪙');
  });

  it('formats dates properly across locales without crashing', () => {
    const dateStr = '2026-10-30T00:00:00Z';
    const thDate = formatLocalizedDate(dateStr, 'th');
    const enDate = formatLocalizedDate(dateStr, 'en');

    expect(thDate).toBeTruthy();
    expect(enDate).toBeTruthy();
    expect(enDate).toContain('2026');
  });
});
