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
        { label: 'Create Post', href: '/create', icon: PenSquare },
        { label: 'Publishing Queue', href: '/publishing/queue', icon: ListOrdered },
        { label: 'Calendar', href: '/calendar', icon: Calendar },
      ],
    },
    {
      group: '03 — WORKSPACE',
      items: [
        { label: 'Connected Accounts', href: '/accounts', icon: Share2 },
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper-canvas text-ink-primary">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-paper-raised border-b border-border-rule">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg tracking-tight">MULTIPOST</span>
          <span className="text-[10px] font-mono text-ink-secondary uppercase px-1.5 py-0.5 bg-paper-subtle rounded">
            Press
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-ink-secondary hover:text-ink-primary"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Persistent Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 shrink-0 bg-paper-raised border-r border-border-rule flex flex-col justify-between`}
      >
        <div>
          {/* Masthead Brand */}
          <div className="p-5 border-b border-border-rule">
            <Link href="/" className="block">
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-bold text-xl tracking-tight text-ink-primary">
                  MULTIPOST
                </span>
                <span className="text-[10px] font-mono text-brand-indigo font-semibold tracking-wider">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] font-sans text-ink-secondary mt-0.5">
                Digital Press & Distribution Engine
              </p>
            </Link>

            {/* Workspace Indicator */}
            <div className="mt-4 p-2 bg-paper-subtle rounded-editorial flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <div className="w-2 h-2 rounded-full bg-semantic-success" />
                <span className="font-medium truncate">Acme Creator Studio</span>
              </div>
              <span className="text-[10px] font-mono text-ink-secondary">PR-2026</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-6">
            {navItems.map((section) => (
              <div key={section.group}>
                <div className="px-3 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-ink-secondary font-semibold">
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
                            ? 'bg-paper-canvas text-brand-indigo font-semibold shadow-xs'
                            : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-brand-indigo' : 'text-ink-secondary'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-border-rule text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-indigo text-white flex items-center justify-center font-serif text-xs font-bold">
              AR
            </div>
            <div>
              <p className="font-medium text-ink-primary leading-tight">Alex Rivera</p>
              <p className="text-[10px] text-ink-secondary">Managing Editor</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-semantic-success px-1.5 py-0.5 bg-semantic-success-bg rounded">
            Live
          </span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
