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
  ChevronDown,
  Check,
  Building2,
  Sparkles,
  Users,
  Shield
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  category: string;
  dotColor: string;
  channelCount: number;
}

export const WORKSPACES: WorkspaceItem[] = [
  { id: 'ws_capitalone', name: 'Capital One Real Estate', category: 'Enterprise Portfolio', dotColor: 'bg-accent-terracotta', channelCount: 6 },
  { id: 'ws_acme', name: 'Acme Creator Studio', category: 'Personal Brand', dotColor: 'bg-brand-indigo', channelCount: 4 },
  { id: 'ws_retzpost', name: 'RetzPost Software', category: 'SaaS Product', dotColor: 'bg-semantic-info', channelCount: 4 },
  { id: 'ws_coffee', name: 'Coffee Craft BKK', category: 'Client Cafe SME', dotColor: 'bg-semantic-success', channelCount: 3 },
];

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('ws_acme');
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('retzpost_active_workspace_id');
      if (saved && WORKSPACES.some((w) => w.id === saved)) {
        setActiveWorkspaceId(saved);
      }
      const handleSync = (e: Event) => {
        const custom = e as CustomEvent<string>;
        if (custom.detail && WORKSPACES.some((w) => w.id === custom.detail)) {
          setActiveWorkspaceId(custom.detail);
        }
      };
      window.addEventListener('retzpost:workspace-change', handleSync);
      return () => {
        window.removeEventListener('retzpost:workspace-change', handleSync);
      };
    }
  }, []);

  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
    setIsWorkspaceDropdownOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('retzpost_active_workspace_id', id);
      window.dispatchEvent(new CustomEvent('retzpost:workspace-change', { detail: id }));
    }
  };

  const activeWorkspace = WORKSPACES.find(w => w.id === activeWorkspaceId) || WORKSPACES[0];

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
          badge: { text: '2 Issues', bg: 'bg-accent-terracotta text-white' }
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
          badge: { text: `${activeWorkspace.channelCount} Live`, bg: 'bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/20' }
        },
        {
          label: 'Team & Permissions',
          href: '/settings/team',
          icon: Users,
          badge: { text: 'RBAC', bg: 'bg-semantic-info/15 text-semantic-info border border-semantic-info/20' }
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
          <div className="p-4 border-b border-border-rule relative">
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

            {/* Interactive Workspace Switcher Dropdown */}
            <div className="relative mt-3">
              <button
                type="button"
                onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
                className="w-full p-2 bg-paper-canvas border border-border-rule rounded-editorial flex items-center justify-between text-xs hover:border-brand-indigo/60 transition-colors group shadow-2xs text-left"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className={`w-2.5 h-2.5 rounded-full ${activeWorkspace.dotColor} shrink-0`} />
                  <div className="truncate">
                    <p className="font-semibold text-ink-primary text-xs leading-none truncate">
                      {activeWorkspace.name}
                    </p>
                    <p className="text-[9px] font-mono text-ink-secondary leading-none mt-0.5 truncate">
                      {activeWorkspace.category}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-ink-secondary group-hover:text-ink-primary shrink-0 transition-colors" />
              </button>

              {/* Dropdown Menu */}
              {isWorkspaceDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-paper-raised border border-border-strong rounded-editorial shadow-lg p-1.5 z-50 space-y-1">
                  <div className="px-2 py-1 text-[9px] font-mono uppercase text-ink-secondary font-bold">
                    Switch Workspace Project:
                  </div>

                  {WORKSPACES.map((ws) => (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => handleSelectWorkspace(ws.id)}
                      className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors text-xs ${
                        ws.id === activeWorkspaceId
                          ? 'bg-paper-canvas text-brand-indigo font-semibold shadow-2xs border border-border-rule'
                          : 'hover:bg-paper-subtle text-ink-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className={`w-2 h-2 rounded-full ${ws.dotColor} shrink-0`} />
                        <div className="truncate">
                          <p className="leading-tight truncate">{ws.name}</p>
                          <p className="text-[9px] font-mono text-ink-secondary">{ws.category} • {ws.channelCount} ch</p>
                        </div>
                      </div>
                      {ws.id === activeWorkspaceId && (
                        <Check className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
                      )}
                    </button>
                  ))}

                  <div className="pt-1 border-t border-border-rule">
                    <button
                      type="button"
                      onClick={() => {
                        alert('Create New Workspace feature: Ready for team collaboration setup.');
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-brand-indigo hover:underline text-left font-medium"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Create New Project...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PRIMARY ACTION CTA BUTTON */}
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
                {activeWorkspaceId === 'ws_capitalone' ? 'NC' : 'AR'}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-ink-primary text-xs leading-tight truncate">
                  {activeWorkspaceId === 'ws_capitalone' ? 'Nopparat C.' : 'Alex Rivera'}
                </p>
                <p className="text-[10px] text-ink-secondary font-mono truncate max-w-[120px]">
                  {activeWorkspace.name}
                </p>
              </div>
            </div>
            <Link
              href="/settings/team"
              className="text-[9px] font-mono text-brand-indigo hover:underline px-1.5 py-0.5 bg-brand-indigo/10 border border-brand-indigo/20 rounded font-semibold shrink-0"
              title="View Role & Permissions"
            >
              {activeWorkspaceId === 'ws_capitalone' ? 'Role: Mgr' : 'Role: Owner'}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 w-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
