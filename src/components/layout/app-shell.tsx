'use client';

import React, { useState, useEffect } from 'react';
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
  Plus,
  Check,
  Building2,
  Sparkles,
  Users,
  Shield,
  LogOut,
  BookOpen,
  ShieldAlert,
} from 'lucide-react';
import { Sticker } from '@/components/ui/sticker';
import { getCurrentUser, logoutUser, subscribeToAuthChange } from '@/modules/auth/auth-service';
import { AuthUser } from '@/modules/auth/auth-types';
import { useTranslation, LanguageToggle } from '@/modules/i18n/i18n-context';
import { UserProfileMenu } from '@/components/layout/user-profile-menu';
import { ThemeSelector } from '@/components/layout/theme-selector';
import { HelpGuideMenu } from '@/components/layout/help-guide-menu';
import { NotificationMenu } from '@/components/layout/notification-menu';
import { 
  isMockDataCleared, 
  subscribeToMockDataChange 
} from '@/modules/data/mock-data-manager';

interface AppShellProps {
  children: React.ReactNode;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  category: string;
  dotColor: string;
  channelCount: number;
  stickerName: string;
}

export const DEFAULT_CLEAN_WORKSPACE: WorkspaceItem = {
  id: 'ws_default',
  name: 'Main Workspace',
  category: 'General Space',
  dotColor: 'bg-brand-indigo',
  channelCount: 0,
  stickerName: 'ws-software',
};

export const DEMO_WORKSPACES: WorkspaceItem[] = [
  { id: 'ws_main', name: 'Main Studio', category: 'Enterprise Portfolio', dotColor: 'bg-accent-terracotta', channelCount: 6, stickerName: 'ws-software' },
  { id: 'ws_creator', name: 'Creator Hub', category: 'Creator Brand', dotColor: 'bg-brand-indigo', channelCount: 4, stickerName: 'ws-creator' },
  { id: 'ws_software', name: 'Tech & Product Studio', category: 'SaaS Product', dotColor: 'bg-semantic-info', channelCount: 4, stickerName: 'ws-software' },
  { id: 'ws_brand', name: 'Lifestyle & Brand', category: 'Brand & Retail', dotColor: 'bg-semantic-success', channelCount: 3, stickerName: 'ws-cafe' },
];

export const WORKSPACES: WorkspaceItem[] = DEMO_WORKSPACES;

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('ws_main');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isMockCleared, setIsMockCleared] = useState<boolean>(true);

  // Dynamic Workspace Billing & Token info
  const [tokenBalance, setTokenBalance] = useState<number>(50);
  const [planTier, setPlanTier] = useState<string>('STARTER');

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setIsMockCleared(isMockDataCleared());

    const unsubscribe = subscribeToAuthChange((user) => {
      setCurrentUser(user);
    });
    const unsubMock = subscribeToMockDataChange((cleared) => {
      setIsMockCleared(cleared);
    });

    // Fetch workspace settings & token balance
    fetch('/api/workspaces/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setTokenBalance(data.settings.tokenBalance ?? 50);
          setPlanTier(data.settings.planTier || 'STARTER');
        }
      })
      .catch(() => null);

    return () => {
      unsubscribe();
      unsubMock();
    };
  }, []);

  const currentWorkspaces = isMockCleared ? [DEFAULT_CLEAN_WORKSPACE] : DEMO_WORKSPACES;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('retzpost_theme_preset');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
      const saved = localStorage.getItem('retzpost_active_workspace_id');
      if (saved && currentWorkspaces.some((w) => w.id === saved)) {
        setActiveWorkspaceId(saved);
      }
      const handleSync = (e: Event) => {
        const custom = e as CustomEvent<string>;
        if (custom.detail && currentWorkspaces.some((w) => w.id === custom.detail)) {
          setActiveWorkspaceId(custom.detail);
        }
      };
      window.addEventListener('retzpost:workspace-change', handleSync);
      return () => window.removeEventListener('retzpost:workspace-change', handleSync);
    }
  }, [currentWorkspaces]);

  const { t, locale } = useTranslation();
  const activeWorkspace = currentWorkspaces.find((w) => w.id === activeWorkspaceId) || currentWorkspaces[0];

  const navItems = [
    {
      group: t('nav.deskGroup'),
      items: [
        { label: t('nav.overview'), href: '/desk', icon: LayoutDashboard },
        { label: t('nav.pricing'), href: '/pricing', icon: Sparkles },
      ],
    },
    {
      group: t('nav.publishGroup'),
      items: [
        { label: t('nav.contentLibrary'), href: '/content', icon: Library },
        { label: t('nav.composer'), href: '/create', icon: PenSquare },
        { 
          label: t('nav.publishingQueue'), 
          href: '/publishing/queue', 
          icon: ListOrdered,
          badge: isMockCleared ? undefined : { text: '2 Issues', bg: 'bg-accent-terracotta text-white' }
        },
        { label: t('nav.calendar'), href: '/calendar', icon: Calendar },
      ],
    },
    {
      group: t('nav.workspaceGroup'),
      items: [
        { 
          label: t('nav.connectedChannels'), 
          href: '/accounts', 
          icon: Share2,
          badge: isMockCleared 
            ? { text: '0 Live', bg: 'bg-paper-canvas text-ink-secondary border border-border-rule' }
            : { text: `${activeWorkspace.channelCount} Live`, bg: 'bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/20' }
        },
        {
          label: t('nav.teamPermissions'),
          href: '/settings/team',
          icon: Users,
          badge: { text: 'RBAC', bg: 'bg-semantic-info/15 text-semantic-info border border-semantic-info/20' }
        },
        { label: t('nav.settings'), href: '/settings', icon: Settings },
        { label: t('nav.docs'), href: '/docs', icon: BookOpen },
      ],
    },
  ];

  const isPublicRoute = 
    pathname === '/' ||
    pathname === '/landing' ||
    pathname === '/login' || 
    pathname === '/register' || 
    pathname === '/forgot-password' ||
    pathname === '/pricing' ||
    pathname === '/checkout' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/docs') ||
    pathname.startsWith('/guide') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms');

  if (isPublicRoute) {
    return <div className="min-h-screen bg-paper-canvas text-ink-primary">{children}</div>;
  }

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row bg-paper-canvas text-ink-primary">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-paper-raised border-b border-border-rule sticky top-0 z-30 shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg tracking-tight">RETZPOST</span>
          <span className="text-[11px] font-mono text-brand-indigo uppercase px-1.5 py-0.5 bg-brand-indigo/10 rounded font-semibold">
            Press
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <LanguageToggle variant="compact" />
          <UserProfileMenu variant="header-compact" />
          <Link
            href="/create"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-indigo text-white text-xs font-semibold rounded-editorial shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{locale === 'th' ? 'สร้าง' : 'New'}</span>
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
        } md:block w-full md:w-64 shrink-0 bg-paper-raised border-r border-border-rule flex flex-col justify-between md:sticky md:top-0 md:h-screen`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Masthead Brand */}
          <div className="p-4 border-b border-border-rule relative">
            <Link href="/" className="block">
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-bold text-xl tracking-tight text-ink-primary">
                  RETZPOST
                </span>
                <span className="text-[11px] font-mono text-brand-indigo font-bold tracking-wider px-1.5 py-0.5 bg-brand-indigo/10 rounded">
                  v2.2 Studio
                </span>
              </div>
              <p className="text-xs font-sans text-ink-secondary mt-0.5">
                {locale === 'th' ? 'แท่นพิมพ์ข่าวสารอเนกประสงค์' : 'Universal Publishing Desk'}
              </p>
            </Link>

            {/* PRIMARY ACTION CTA BUTTON */}
            <Link
              href="/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold rounded-editorial shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>{locale === 'th' ? 'สร้างโพสต์ใหม่' : 'Compose Dispatch'}</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-5 pb-8">
            {navItems.map((section) => (
              <div key={section.group}>
                <div className="px-3 mb-1 text-[11px] font-mono uppercase tracking-wider text-ink-secondary/90 font-bold">
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
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold leading-none ${item.badge.bg}`}>
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
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 w-full md:h-screen md:overflow-y-auto flex flex-col relative">
        {/* Desktop Editorial Topbar Header */}
        <header className="hidden md:flex h-12 shrink-0 items-center justify-between px-6 border-b border-border-rule/80 bg-paper-raised/95 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
          {/* Left: Active Workspace Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${activeWorkspace.dotColor}`} />
              <span className="font-serif font-bold text-sm text-ink-primary">
                {activeWorkspace.name}
              </span>
              <span className="text-[10px] font-mono text-ink-secondary bg-paper-subtle px-1.5 py-0.5 rounded border border-border-rule">
                {activeWorkspace.category}
              </span>
            </div>
            <span className="text-border-rule">•</span>
            <span className="text-[11px] font-mono text-ink-secondary">
              {tokenBalance} 🪙 Tokens ({planTier})
            </span>
          </div>

          {/* Right: Topbar Utility Controls */}
          <div className="flex items-center gap-2">
            {/* 1. Theme Selector */}
            <ThemeSelector />

            {/* 2. Language Switcher */}
            <LanguageToggle variant="compact" />

            {/* 3. Help & Guide Menu (?) */}
            <HelpGuideMenu />

            {/* 4. Notification Menu */}
            <NotificationMenu />

            {/* 5. Settings Quick Link */}
            <Link
              href="/settings"
              className="w-8 h-8 rounded-editorial border border-border-rule bg-paper-raised hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary flex items-center justify-center shadow-2xs transition-all cursor-pointer"
              title={locale === 'th' ? 'การตั้งค่าระบบ' : 'Settings'}
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* 6. User Profile Dropdown */}
            <div className="ml-1 pl-2 border-l border-border-rule/70">
              <UserProfileMenu variant="header-compact" />
            </div>
          </div>
        </header>

        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
