'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Settings, 
  Coins, 
  ShieldCheck, 
  ShieldAlert, 
  LogOut, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Sparkles, 
  ExternalLink,
  BookOpen,
  Receipt,
  UserCheck
} from 'lucide-react';
import { getCurrentUser, logoutUser, subscribeToAuthChange } from '@/modules/auth/auth-service';
import { AuthUser } from '@/modules/auth/auth-types';
import { useTranslation, LanguageToggle } from '@/modules/i18n/i18n-context';

export interface UserProfileMenuProps {
  variant?: 'sidebar-row' | 'header-compact' | 'pill';
  className?: string;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  variant = 'sidebar-row',
  className = '',
}) => {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync auth state
  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const unsub = subscribeToAuthChange((user) => setCurrentUser(user));
    return () => unsub();
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSignOut = () => {
    logoutUser();
    setIsOpen(false);
    router.push('/');
  };

  // If not logged in, show simple Sign In link
  if (!currentUser) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-editorial bg-brand-indigo/10 hover:bg-brand-indigo/20 text-brand-indigo text-xs font-mono font-bold transition-all"
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span>{t('common.signIn')}</span>
      </Link>
    );
  }

  const isSuperAdmin = 
    currentUser.role === 'Owner' || 
    currentUser.email === 'superadmin@retzpost.io' ||
    currentUser.email === 'losstary@gmail.com';

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* TRIGGER BUTTON: VARIANT 1 - SIDEBAR EXPANDED ROW */}
      {variant === 'sidebar-row' && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full pt-1 pb-1 px-1.5 rounded-card hover:bg-paper-subtle/80 flex items-center justify-between gap-2 transition-all text-left cursor-pointer group"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div
                className={`w-8 h-8 rounded-full ${
                  currentUser.avatarBg || 'bg-brand-indigo'
                } text-white flex items-center justify-center font-serif text-xs font-bold ring-2 ring-border-rule shadow-2xs`}
              >
                {currentUser.avatarText || 'RP'}
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-semantic-success border-2 border-paper-raised absolute -bottom-0.5 -right-0.5 animate-pulse" />
            </div>

            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-ink-primary text-xs truncate group-hover:text-brand-indigo transition-colors">
                  {currentUser.name}
                </p>
                <span className="px-1.5 py-0.2 rounded bg-brand-indigo/10 text-brand-indigo text-[9px] font-mono font-bold uppercase shrink-0">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary font-mono truncate mt-0.5">
                {currentUser.email}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-ink-secondary group-hover:text-ink-primary">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
      )}

      {/* TRIGGER BUTTON: VARIANT 2 - HEADER COMPACT PILL */}
      {variant !== 'sidebar-row' && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-editorial border border-border-rule hover:border-brand-indigo/40 bg-paper-raised shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div
            className={`w-6 h-6 rounded-full ${
              currentUser.avatarBg || 'bg-brand-indigo'
            } text-white flex items-center justify-center font-serif text-[10px] font-bold shadow-2xs`}
          >
            {currentUser.avatarText || 'RP'}
          </div>
          <span className="text-xs font-mono font-bold text-ink-primary hidden sm:inline max-w-[100px] truncate">
            {currentUser.name}
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-ink-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />}
        </button>
      )}

      {/* RICH EDITORIAL PROFILE DROPDOWN MENU */}
      {isOpen && (
        <div
          className={`absolute z-50 ${
            variant === 'sidebar-row'
              ? 'bottom-full left-0 mb-2 w-72'
              : 'top-full right-0 mt-2 w-72'
          } bg-paper-card border-2 border-brand-indigo/80 rounded-dialog shadow-xl p-3 text-xs space-y-3 font-sans animate-in fade-in duration-150`}
        >
          {/* Header Card Profile Summary */}
          <div className="p-3 bg-paper-raised rounded-card border border-border-rule/80 space-y-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${
                  currentUser.avatarBg || 'bg-brand-indigo'
                } text-white flex items-center justify-center font-serif text-sm font-bold ring-2 ring-brand-indigo/20 shadow-xs shrink-0`}
              >
                {currentUser.avatarText || 'RP'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-ink-primary text-xs truncate">
                    {currentUser.name}
                  </p>
                </div>
                <p className="text-[11px] text-ink-secondary font-mono truncate">
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="inline-block px-1.5 py-0.2 rounded bg-brand-indigo text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                  <span className="inline-block px-1.5 py-0.2 rounded bg-semantic-success-bg text-semantic-success text-[9px] font-mono font-bold">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Token Balance Pill */}
            <div className="pt-2 border-t border-border-rule/60 flex items-center justify-between text-[11px] font-mono">
              <span className="text-ink-secondary flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-accent-terracotta" />
                <span>Master Wallet:</span>
              </span>
              <span className="font-bold text-accent-terracotta bg-accent-terracotta/10 px-2 py-0.5 rounded">
                150 🪙
              </span>
            </div>
          </div>

          {/* Quick Links Menu */}
          <div className="space-y-1">
            <Link
              href="/settings/team"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-editorial hover:bg-paper-raised text-ink-primary hover:text-brand-indigo font-medium transition-colors"
            >
              <Users className="w-4 h-4 text-brand-indigo shrink-0" />
              <span>{locale === 'th' ? 'สิทธิ์ทีมงาน & ติดตามเหรียญ' : 'Team RBAC & Token Tracker'}</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-editorial hover:bg-paper-raised text-ink-primary hover:text-brand-indigo font-medium transition-colors"
            >
              <Settings className="w-4 h-4 text-brand-indigo shrink-0" />
              <span>{locale === 'th' ? 'ตั้งค่าพื้นที่ทำงาน & ธีม' : 'Workspace & Theme Settings'}</span>
            </Link>

            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-editorial hover:bg-paper-raised text-ink-primary hover:text-brand-indigo font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4 text-accent-ochre shrink-0" />
              <span>{locale === 'th' ? 'แผนราคา & เติมเหรียญ Press' : 'Pricing & Token Top-Up'}</span>
            </Link>

            {isSuperAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-editorial bg-purple-950/10 hover:bg-purple-950/20 text-purple-900 font-bold transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-purple-800 shrink-0" />
                <span>{locale === 'th' ? '🛡️ แผงควบคุม Super Admin' : '🛡️ Super Admin Console'}</span>
              </Link>
            )}

            <Link
              href="/docs"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-editorial hover:bg-paper-raised text-ink-secondary hover:text-ink-primary font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4 text-ink-secondary shrink-0" />
              <span>{locale === 'th' ? 'คู่มือการใช้งาน' : 'Documentation'}</span>
            </Link>
          </div>

          {/* Language Switcher Row inside Dropdown */}
          <div className="pt-2 border-t border-border-rule/80 flex items-center justify-between px-1">
            <span className="text-[10px] font-mono text-ink-secondary font-semibold uppercase">
              {locale === 'th' ? 'ภาษา' : 'Language'}
            </span>
            <LanguageToggle variant="compact" />
          </div>

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-border-rule/80">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-1.5 px-3 rounded-editorial text-semantic-error hover:bg-semantic-error-bg flex items-center justify-center gap-2 font-bold font-mono transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('common.signOut')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
