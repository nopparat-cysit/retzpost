'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  LayoutDashboard, 
  LogIn, 
  UserPlus,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';
import { Sticker } from '@/components/ui/sticker';
import { getCurrentUser } from '@/modules/auth/auth-service';
import { AuthUser } from '@/modules/auth/auth-types';
import { useTranslation, LanguageToggle } from '@/modules/i18n/i18n-context';
import { UserProfileMenu } from '@/components/layout/user-profile-menu';

export const DocsSubNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const items = [
    { href: '/docs', label: t('docs.guideTab'), icon: BookOpen },
    { href: '/privacy', label: t('docs.privacyTab'), icon: ShieldCheck },
    { href: '/terms', label: t('docs.termsTab'), icon: FileText },
  ];

  return (
    <div className="bg-paper-canvas/95 border-b border-border-rule px-4 py-2 text-xs font-mono">
      <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-secondary font-bold uppercase tracking-wider hidden sm:inline">
            Docs & Legal:
          </span>
          <div className="flex items-center gap-1.5">
            {items.map((it) => {
              const isActive = pathname === it.href;
              const Icon = it.icon;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`px-3 py-1.5 rounded-editorial flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-paper-raised text-brand-indigo font-bold border border-border-rule shadow-xs'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{it.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <LanguageToggle variant="compact" />
      </div>
    </div>
  );
};

export const PublicHeader: React.FC = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.landing'), icon: Sparkles },
    { href: '/pricing', label: t('nav.pricing'), icon: Sparkles },
    { href: '/docs', label: t('nav.docs'), icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper-raised/95 backdrop-blur-md border-b-2 border-border-rule shadow-xs">
      {/* Top Editorial Folio Bar */}
      <div className="bg-paper-canvas/80 border-b border-border-rule/80 py-1 px-4 sm:px-6 lg:px-8 text-[10px] font-mono text-ink-secondary flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-brand-indigo uppercase">
            RETZPOST GAZETTE • THE CREATOR PRESS DESK
          </span>
          <span className="text-border-rule hidden sm:inline">|</span>
          <span className="hidden sm:inline">BANGKOK EDITION</span>
          <span className="text-border-rule hidden md:inline">|</span>
          <span className="hidden md:inline">VOL. XXIV NO. 10</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
          <span className="font-medium text-ink-primary">All Dispatches Operational</span>
        </div>
      </div>

      {/* Main Masthead Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo with Monogram Seal */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-editorial bg-brand-indigo text-white flex items-center justify-center font-serif font-bold text-base shadow-sm ring-1 ring-brand-indigo/30 group-hover:bg-brand-indigo-hover transition-all group-hover:scale-102">
            RP
          </div>
          <div className="leading-tight">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-bold text-xl tracking-tight text-ink-primary group-hover:text-brand-indigo transition-colors">
                RETZPOST
              </span>
              <span className="text-[9px] font-mono uppercase bg-accent-terracotta/10 text-accent-terracotta px-1.5 py-0.2 rounded font-bold border border-accent-terracotta/20">
                Press
              </span>
            </div>
            <p className="text-[10px] font-mono text-ink-secondary tracking-wide hidden sm:block">
              Universal Publishing Engine
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-mono">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === '/docs' && pathname === '/guide');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-editorial transition-all ${
                  isActive
                    ? 'bg-paper-canvas text-brand-indigo font-bold border-2 border-border-rule shadow-2xs ring-1 ring-brand-indigo/10'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-canvas/70 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-indigo' : 'text-ink-secondary'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <LanguageToggle variant="compact" />
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href="/desk"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white font-semibold rounded-editorial shadow-xs transition-all active:scale-98"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('common.goToDashboard')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/70" />
              </Link>
              <UserProfileMenu variant="header-compact" />
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1 px-3 py-1.5 text-ink-primary hover:text-brand-indigo font-semibold rounded-editorial hover:bg-paper-subtle transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-ink-secondary" />
                <span>{t('common.signIn')}</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white font-bold rounded-editorial shadow-xs transition-all active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-ochre" />
                <span>{t('common.signUp')}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-paper-raised border-t-2 border-border-rule mt-auto pt-14 pb-10 text-ink-secondary text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border-rule/80">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-editorial bg-brand-indigo text-white flex items-center justify-center font-serif font-bold text-xs">
                RP
              </div>
              <span className="font-serif font-bold text-base text-ink-primary tracking-tight">
                RETZPOST
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-ink-secondary font-sans">
              แพลตฟอร์มกองบรรณาธิการดิจิทัลสำหรับครีเอเตอร์และทีมมีเดียยุคใหม่ ยิงโพสต์และคลิปวิดีโอสั้นพร้อมกันทุกแพลตฟอร์ม Facebook, Instagram, YouTube, TikTok, X, และ Lemon8
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Sticker name="approved-seal" size="xs" />
              <span className="text-[10px] text-ink-primary font-semibold">
                Verified Multi-Platform Dispatcher
              </span>
            </div>
          </div>

          {/* Col 2: Documentation & Help */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink-primary font-mono flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brand-indigo" />
              <span>คู่มือการใช้งาน</span>
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/docs#quickstart" className="hover:text-brand-indigo hover:underline transition-colors">
                  • เริ่มต้นใช้งานด่วน (Quickstart)
                </Link>
              </li>
              <li>
                <Link href="/docs#composer" className="hover:text-brand-indigo hover:underline transition-colors">
                  • ห้องเขียนข่าว (Universal Composer)
                </Link>
              </li>
              <li>
                <Link href="/docs#calendar" className="hover:text-brand-indigo hover:underline transition-colors">
                  • ปฏิทินและเวลานาทีทอง (Peak Slots)
                </Link>
              </li>
              <li>
                <Link href="/docs#roles" className="hover:text-brand-indigo hover:underline transition-colors">
                  • สิทธิ์ 5 ลำดับขั้น & การอนุมัติงาน
                </Link>
              </li>
              <li>
                <Link href="/docs#kpi" className="hover:text-brand-indigo hover:underline transition-colors">
                  • ระบบวัดผล KPI & AI Coaching
                </Link>
              </li>
              <li>
                <Link href="/docs#revoke" className="hover:text-brand-indigo hover:underline transition-colors">
                  • นโยบายการสั่งลบโพสต์ผ่าน API
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Governance */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink-primary font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-semantic-success" />
              <span>กฎหมายและความปลอดภัย</span>
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/privacy" className="hover:text-brand-indigo hover:underline transition-colors">
                  • นโยบายความเป็นส่วนตัว (PDPA / GDPR)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-indigo hover:underline transition-colors">
                  • ข้อกำหนดการให้บริการ (Terms of Service)
                </Link>
              </li>
              <li>
                <span className="text-ink-secondary/70">
                  • มาตรฐานการเข้ารหัส Token Vault AES-256
                </span>
              </li>
              <li>
                <span className="text-ink-secondary/70">
                  • ปฏิบัติตามข้อกำหนด Meta & YouTube API
                </span>
              </li>
              <li>
                <span className="text-ink-secondary/70">
                  • ติดต่อเจ้าหน้าที่ DPO: privacy@retzpost.com
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Security Seal & Status */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink-primary font-mono flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-accent-terracotta" />
              <span>ความปลอดภัยและความพร้อม</span>
            </h4>
            <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-ink-secondary font-mono">Gateway Status:</span>
                <span className="text-semantic-success font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-ping" />
                  100% Operational
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-ink-secondary font-mono">Token Vault:</span>
                <span className="text-brand-indigo font-bold flex items-center gap-1">
                  <span>AES-256 GCM</span>
                  <Lock className="w-3 h-3 text-brand-indigo" />
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-ink-secondary font-mono">Social Networks:</span>
                <span className="text-ink-primary font-bold">6 Platforms Active</span>
              </div>
            </div>
            <p className="text-[10px] text-ink-secondary/70 leading-tight font-sans">
              ข้อมูลบัญชีและเนื้อหาของท่านได้รับการคุ้มครองภายใต้กฎหมายคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink-secondary/80">
          <p>&copy; {new Date().getFullYear()} RetzPost SaaS Technologies Co., Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-ink-primary font-medium">
            <Link href="/docs" className="hover:text-brand-indigo hover:underline">คู่มือ</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-brand-indigo hover:underline">ความเป็นส่วนตัว</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-brand-indigo hover:underline">ข้อกำหนด</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-brand-indigo hover:underline">เข้าสู่ระบบ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
