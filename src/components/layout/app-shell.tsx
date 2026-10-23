'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Library,
  PenSquare,
  ListOrdered,
  Calendar,
  Share2,
  Settings,
  Menu,
  X,
  Compass,
  Plus,
  ChevronDown,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      group: '01 — HOME',
      items: [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      ],
    },
    {
      group: '02 — PUBLISH',
      items: [
        { label: 'Content Library', href: '/content', icon: Library },
        { label: 'Universal Composer', href: '/create', icon: PenSquare },
        { 
          label: 'Publishing Queue', 
          href: '/publishing/queue', 
          icon: ListOrdered,
          badge: { text: '1 Retry', bg: 'bg-accent-terracotta text-white' }
        },
        { label: 'Editorial Calendar', href: '/calendar', icon: Calendar },
      ],
    },
    {
      group: '03 — WORKSPACE',
      items: [
        { 
          label: 'Connected Channels', 
          href: '/accounts', 
          icon: Share2,
          badge: { text: '10 Live', bg: 'bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/20' }
        },
        { label: 'Settings & Defaults', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper-canvas text-ink-primary">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-paper-raised border-b border-border-rule sticky top-0 z-30 shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg tracking-tight">MULTIPOST</span>
          <span className="text-[10px] font-mono text-brand-indigo uppercase px-1.5 py-0.5 bg-brand-indigo/10 rounded font-semibold">
            Press
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/create"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-indigo text-white text-xs font-semibold rounded-editorial shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Post</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-ink-secondary hover:text-ink-primary rounded-editorial border border-border-rule bg-paper-subtle"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Persistent Desktop Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block fixed inset-0 z-40 bg-paper-raised/95 backdrop-blur-md pt-16 md:pt-0' : 'hidden'
        } md:block w-full md:w-64 shrink-0 bg-paper-raised border-r border-border-rule flex flex-col justify-between md:sticky md:top-0 md:h-screen md:overflow-y-auto`}
      >
        <div>
          {/* Masthead Brand */}
          <div className="p-4 border-b border-border-rule">
            <Link href="/" className="block">
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-bold text-xl tracking-tight text-ink-primary">
                  MULTIPOST
                </span>
                <span className="text-[10px] font-mono text-brand-indigo font-semibold tracking-wider px-1.5 py-0.5 bg-brand-indigo/10 rounded">
                  v2.2 Studio
                </span>
              </div>
              <p className="text-[11px] font-sans text-ink-secondary mt-0.5">
                Universal Publishing Desk
              </p>
            </Link>

            {/* Workspace Selector */}
            <div className="mt-3 p-2 bg-paper-canvas border border-border-rule rounded-editorial flex items-center justify-between text-xs hover:border-border-strong cursor-pointer transition-colors group">
              <div className="flex items-center gap-2 truncate">
                <div className="w-2 h-2 rounded-full bg-semantic-success shrink-0" />
                <span className="font-medium truncate text-ink-primary text-[11px]">Acme Creator Studio</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-ink-secondary group-hover:text-ink-primary shrink-0 transition-colors" />
            </div>

            {/* PRIMARY ACTION CTA BUTTON (High-Visibility Speed Trigger) */}
            <Link
              href="/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold rounded-editorial shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Compose New Dispatch</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-5">
            {navItems.map((section) => (
              <div key={section.group}>
                <div className="px-3 mb-1 text-[9px] font-mono uppercase tracking-wider text-ink-secondary/80 font-bold">
                  {section.group}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-editorial text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-paper-canvas text-brand-indigo font-semibold shadow-2xs border border-border-rule'
                            : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-indigo' : 'text-ink-secondary'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge ? (
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold leading-none ${item.badge.bg}`}>
                            {item.badge.text}
                          </span>
                        ) : isActive ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo" />
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3.5 border-t border-border-rule text-xs bg-paper-subtle/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-indigo text-white flex items-center justify-center font-serif text-xs font-bold ring-1 ring-brand-indigo/30">
                AR
              </div>
              <div>
                <p className="font-semibold text-ink-primary text-xs leading-tight">Alex Rivera</p>
                <p className="text-[10px] text-ink-secondary font-mono">Managing Editor</p>
              </div>
            </div>
            <span className="text-[9px] font-mono text-semantic-success px-1.5 py-0.5 bg-semantic-success-bg border border-semantic-success/20 rounded font-semibold">
              Live
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
