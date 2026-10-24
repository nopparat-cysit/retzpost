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
  ExternalLink
} from 'lucide-react';
import { Sticker } from '@/components/ui/sticker';
import { getCurrentUser } from '@/modules/auth/auth-service';
import { AuthUser } from '@/modules/auth/auth-types';

export const PublicHeader: React.FC = () => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const navLinks = [
    { href: '/docs', label: 'คู่มือใช้งาน (Docs & Guide)', icon: BookOpen },
    { href: '/privacy', label: 'นโยบายความเป็นส่วนตัว (Privacy Policy)', icon: ShieldCheck },
    { href: '/terms', label: 'ข้อกำหนดการให้บริการ (Terms)', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper-raised/95 backdrop-blur-md border-b border-border-rule shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-editorial bg-brand-indigo text-white flex items-center justify-center font-serif font-bold text-sm shadow-2xs group-hover:bg-brand-indigo-hover transition-colors">
            RP
          </div>
          <div className="leading-none">
            <span className="font-serif font-bold text-xl tracking-tight text-ink-primary">
              MULTIPOST
            </span>
            <span className="text-[10px] font-mono uppercase text-accent-terracotta ml-1.5 font-bold tracking-wider">
              Dream Press
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === '/docs' && pathname === '/guide');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-editorial transition-colors ${
                  isActive
                    ? 'bg-paper-canvas text-brand-indigo font-bold border border-border-rule shadow-2xs'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {currentUser ? (
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white font-semibold rounded-editorial shadow-2xs transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>ไปยังแดชบอร์ด ({currentUser.name})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1 px-3 py-1.5 text-ink-primary hover:text-brand-indigo font-semibold rounded-editorial hover:bg-paper-subtle transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบ</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1 px-3.5 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white font-bold rounded-editorial shadow-2xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>สมัครสมาชิก</span>
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
    <footer className="bg-paper-raised border-t border-border-rule mt-auto py-10 text-ink-secondary text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border-rule/60">
          <div className="flex items-center gap-2">
            <Sticker name="approved-seal" size="xs" />
            <span className="font-serif font-bold text-sm text-ink-primary">
              MULTIPOST (RetzPost) — Dream Press Publishing Desk
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <Link href="/docs" className="hover:text-brand-indigo underline underline-offset-2 transition-colors">
              📖 คู่มือการใช้งาน (Docs & Guide)
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-brand-indigo underline underline-offset-2 transition-colors">
              🔒 นโยบายความเป็นส่วนตัว (Privacy Policy)
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-brand-indigo underline underline-offset-2 transition-colors">
              📜 ข้อกำหนดการให้บริการ (Terms of Service)
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-brand-indigo underline underline-offset-2 transition-colors">
              🔑 เข้าสู่ระบบ
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-ink-secondary/70">
          <p>&copy; {new Date().getFullYear()} RetzPost SaaS Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Enterprise-Grade Multi-Social Dispatch Engine</span>
            <span>•</span>
            <span className="text-semantic-success font-semibold">Security Verified ✓</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
