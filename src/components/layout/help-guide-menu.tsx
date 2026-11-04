'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, BookOpen, Clock, ShieldCheck, FileText, Headphones, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/modules/i18n/i18n-context';

export const HelpGuideMenu: React.FC = () => {
  const { locale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const guideLinks = [
    {
      titleTh: 'คู่มือการใช้งานเริ่มต้น',
      titleEn: 'Quickstart Guide',
      descTh: 'ขั้นตอนการเชื่อมต่อเพจและเขียนข่าว',
      descEn: 'Connect channels and draft first dispatch',
      href: '/docs',
      icon: BookOpen,
    },
    {
      titleTh: 'สถิติและช่วงเวลายอดนิยม',
      titleEn: 'Peak Slot Times',
      descTh: 'คำนวณช่วงเวลาที่มีการมีส่วนร่วมสูงสุด',
      descEn: 'Optimal publishing engagement windows',
      href: '/docs#slots',
      icon: Clock,
    },
    {
      titleTh: 'ความปลอดภัยและ PDPA',
      titleEn: 'Security & PDPA',
      descTh: 'การเข้ารหัสข้อมูลและการปฏิบัติตามกฎหมาย',
      descEn: 'Data encryption and regulatory compliance',
      href: '/docs#security',
      icon: ShieldCheck,
    },
    {
      titleTh: 'ข้อกำหนดและเงื่อนไข',
      titleEn: 'Terms of Service',
      descTh: 'ข้อตกลงการใช้บริการแพลตฟอร์ม',
      descEn: 'Platform usage agreement and policies',
      href: '/terms',
      icon: FileText,
    },
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-editorial border border-border-rule bg-paper-raised hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary flex items-center justify-center shadow-2xs transition-all cursor-pointer"
        title={locale === 'th' ? 'คู่มือและศูนย์ช่วยเหลือ' : 'Help & Documentation'}
        aria-label="Help and Documentation"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-paper-card border border-border-rule rounded-dialog shadow-xl p-3 z-50 text-xs font-sans animate-in fade-in duration-100">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-rule/60">
            <span className="font-mono text-[10px] font-bold text-ink-secondary uppercase tracking-wider">
              {locale === 'th' ? 'ศูนย์ช่วยเหลือและคู่มือ' : 'Help Center & Guides'}
            </span>
            <span className="text-[10px] font-mono text-brand-indigo font-semibold">
              RetzPost Support
            </span>
          </div>

          <div className="space-y-1">
            {guideLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-2.5 p-2 rounded-editorial hover:bg-paper-raised transition-colors group"
                >
                  <div className="w-7 h-7 rounded-md bg-paper-subtle group-hover:bg-brand-indigo/10 text-ink-secondary group-hover:text-brand-indigo flex items-center justify-center shrink-0 transition-colors mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-primary group-hover:text-brand-indigo transition-colors">
                      {locale === 'th' ? item.titleTh : item.titleEn}
                    </p>
                    <p className="text-[11px] text-ink-secondary leading-tight mt-0.5">
                      {locale === 'th' ? item.descTh : item.descEn}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-border-rule/60">
            <a
              href="mailto:support@retzpost.io"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-editorial bg-brand-indigo/5 hover:bg-brand-indigo/10 text-brand-indigo font-mono text-[11px] font-semibold transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                <span>{locale === 'th' ? 'ติดต่อทีมงานฝ่ายสนับสนุน' : 'Contact Support'}</span>
              </div>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
