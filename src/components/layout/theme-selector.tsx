'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTranslation } from '@/modules/i18n/i18n-context';

export type ThemeId = 'NEWSPRINT' | 'MIDNIGHT' | 'MATCHA' | 'TERRACOTTA' | 'INDIGO';

interface ThemeOption {
  id: ThemeId;
  nameTh: string;
  nameEn: string;
  dotColor: string;
}

const THEMES: ThemeOption[] = [
  { id: 'NEWSPRINT', nameTh: 'คลาสสิก Newsprint', nameEn: 'Classic Newsprint', dotColor: 'bg-[#364165]' },
  { id: 'MIDNIGHT', nameTh: 'โหมดมืด Midnight', nameEn: 'Midnight Dark', dotColor: 'bg-[#6366F1]' },
  { id: 'MATCHA', nameTh: 'ชาเขียว Matcha', nameEn: 'Matcha Botanical', dotColor: 'bg-[#1D6F42]' },
  { id: 'TERRACOTTA', nameTh: 'ดินเผา Terracotta', nameEn: 'Kyoto Terracotta', dotColor: 'bg-[#A24836]' },
  { id: 'INDIGO', nameTh: 'น้ำเงิน Indigo', nameEn: 'Royal Indigo', dotColor: 'bg-[#1E2B58]' },
];

export const ThemeSelector: React.FC = () => {
  const { locale } = useTranslation();
  const [activeTheme, setActiveTheme] = useState<ThemeId>('NEWSPRINT');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('retzpost_theme_preset') as ThemeId;
      if (saved && THEMES.some((t) => t.id === saved)) {
        setActiveTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
      }
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const selectTheme = (themeId: ThemeId) => {
    setActiveTheme(themeId);
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('retzpost_theme_preset', themeId);
      document.documentElement.setAttribute('data-theme', themeId);
      window.dispatchEvent(new CustomEvent('retzpost:theme-change', { detail: themeId }));
    }
  };

  const currentTheme = THEMES.find((t) => t.id === activeTheme) || THEMES[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-editorial border border-border-rule bg-paper-raised hover:bg-paper-subtle text-ink-primary shadow-2xs transition-all cursor-pointer"
        title={locale === 'th' ? 'เปลี่ยนชุดสีธีม' : 'Switch Theme'}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${currentTheme.dotColor}`} />
        <Palette className="w-3.5 h-3.5 text-ink-secondary" />
        <span className="hidden xl:inline text-[11px]">
          {locale === 'th' ? currentTheme.nameTh : currentTheme.nameEn}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-paper-card border border-border-rule rounded-dialog shadow-xl p-1.5 z-50 text-xs font-sans animate-in fade-in duration-100">
          <div className="px-2 py-1 text-[10px] font-mono font-bold text-ink-secondary uppercase tracking-wider border-b border-border-rule/60 mb-1">
            {locale === 'th' ? 'เลือกธีมระบบ' : 'Select Theme'}
          </div>
          <div className="space-y-0.5">
            {THEMES.map((theme) => {
              const isSelected = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => selectTheme(theme.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-editorial transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-brand-indigo/10 text-brand-indigo font-bold'
                      : 'text-ink-primary hover:bg-paper-raised'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${theme.dotColor} border border-border-rule/60`} />
                    <span>{locale === 'th' ? theme.nameTh : theme.nameEn}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-indigo" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
