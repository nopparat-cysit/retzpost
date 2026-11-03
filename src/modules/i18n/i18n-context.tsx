'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Locale, TranslationSchema } from './i18n-types';
import { th } from './translations/th';
import { en } from './translations/en';
import { Globe } from 'lucide-react';

export const LANGUAGE_STORAGE_KEY = 'retzpost_language';
export const LANGUAGE_CHANGE_EVENT = 'retzpost:language-change';

const translations: Record<Locale, TranslationSchema> = {
  th,
  en,
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'th',
  setLocale: () => {},
  toggleLocale: () => {},
  t: (path: string) => path,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Locale | null;
        if (saved === 'th' || saved === 'en') {
          return saved;
        }
      } catch {
        // Safe fallback in restricted environments
      }
    }
    return 'th';
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Locale | null;
      if (saved === 'th' || saved === 'en') {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      } else {
        // Fallback or browser detection
        const browserLang = navigator.language?.toLowerCase() || '';
        const detected: Locale = browserLang.startsWith('th') ? 'th' : 'en';
        setLocaleState(detected);
        document.documentElement.lang = detected;
      }

      const handleStorage = (e: Event) => {
        const custom = e as CustomEvent<Locale>;
        if (custom.detail === 'th' || custom.detail === 'en') {
          setLocaleState(custom.detail);
          document.documentElement.lang = custom.detail;
        }
      };

      window.addEventListener(LANGUAGE_CHANGE_EVENT, handleStorage);
      return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleStorage);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
      window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: newLocale }));
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'th' ? 'en' : 'th');
  }, [locale, setLocale]);

  /**
   * Helper to resolve nested key paths, e.g. "pricing.soloTagline" or "common.save"
   */
  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const keys = path.split('.');
      let currentTh: any = translations.th;
      let currentActive: any = translations[locale];

      for (const k of keys) {
        currentActive = currentActive?.[k];
        currentTh = currentTh?.[k];
      }

      let text = typeof currentActive === 'string' ? currentActive : (typeof currentTh === 'string' ? currentTh : path);

      if (params) {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramVal));
        });
      }

      return text;
    },
    [locale]
  );

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t,
    }),
    [locale, setLocale, toggleLocale, t]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export function useTranslation() {
  return useContext(LanguageContext);
}

/**
 * Reusable Language Switcher Component
 */
export interface LanguageToggleProps {
  className?: string;
  variant?: 'compact' | 'pill' | 'badge';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '', variant = 'pill' }) => {
  const { locale, setLocale, toggleLocale } = useTranslation();

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleLocale}
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-editorial text-[11px] font-mono font-bold border border-border-rule hover:border-brand-indigo/40 bg-paper-card transition-all ${className}`}
        title={locale === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
        aria-label="Switch Language"
      >
        <Globe className="w-3.5 h-3.5 text-brand-indigo" />
        <span>{locale === 'th' ? 'EN' : 'ไทย'}</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-editorial border border-border-rule bg-paper-canvas p-0.5 text-[11px] font-mono shadow-2xs ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLocale('th')}
        className={`px-2 py-0.5 rounded transition-all font-bold ${
          locale === 'th'
            ? 'bg-brand-indigo text-white shadow-2xs'
            : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-raised'
        }`}
      >
        🇹🇭 TH
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-2 py-0.5 rounded transition-all font-bold ${
          locale === 'en'
            ? 'bg-brand-indigo text-white shadow-2xs'
            : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-raised'
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
};
