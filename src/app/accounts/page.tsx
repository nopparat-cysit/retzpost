'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  Building2,
  Check,
  X,
  Sliders,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Info
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
import { StatusTag } from '@/components/ui/status-tag';
import { 
  SocialPlatformIcon, 
  FacebookLogo, 
  InstagramLogo, 
  YouTubeLogo, 
  TikTokLogo 
} from '@/components/ui/social-icons';
import { SmartFilterBar } from '@/components/ui/smart-filter-bar';

interface MasterChannelAccount {
  id: string;
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK';
  displayName: string;
  handle: string;
  channelId: string;
  defaultWorkspaceId: string;
  defaultWorkspaceName: string;
  scopes: string[];
  expiresIn: string;
  capabilities: string;
  lastSynced: string;
}

const MASTER_ACCOUNTS: MasterChannelAccount[] = [
  // 1. Acme Creator Studio Endpoints
  {
    id: 'acc-ig-acme',
    platform: 'INSTAGRAM',
    displayName: 'Alex Rivera Studio',
    handle: '@alexrivera_official',
    channelId: 'ig_user_17841405',
    defaultWorkspaceId: 'ws_acme',
    defaultWorkspaceName: 'Acme Creator Studio',
    scopes: ['instagram_basic', 'instagram_content_publish'],
    expiresIn: '60-day Long-Lived Token (Auto-refreshed via Token Vault)',
    capabilities: 'Feed Photos • Carousels (Up to 10) • 24h Stories • Reels',
    lastSynced: '5 mins ago',
  },
  {
    id: 'acc-fb-acme',
    platform: 'FACEBOOK',
    displayName: 'Alex Rivera Media Studio',
    handle: 'FB Page: Alex Rivera Media Studio',
    channelId: 'fb_page_10928374',
    defaultWorkspaceId: 'ws_acme',
    defaultWorkspaceName: 'Acme Creator Studio',
    scopes: ['pages_show_list', 'pages_manage_posts'],
    expiresIn: 'Permanent Page Access Token (Encrypted)',
    capabilities: 'Page Timeline • Photo Albums • Text Status • Page Stories',
    lastSynced: '5 mins ago',
  },
  {
    id: 'acc-yt-acme',
    platform: 'YOUTUBE',
    displayName: 'Alex Rivera Studio (YouTube)',
    handle: '@AlexRiveraStudio',
    channelId: 'UC_x65aB891F_Live',
    defaultWorkspaceId: 'ws_acme',
    defaultWorkspaceName: 'Acme Creator Studio',
    scopes: ['youtube.upload', 'youtube.readonly'],
    expiresIn: 'Active Google OAuth Token',
    capabilities: 'YouTube Shorts (9:16) • Long-form Videos • Resumable',
    lastSynced: '10 mins ago',
  },
  {
    id: 'acc-tt-acme',
    platform: 'TIKTOK',
    displayName: 'Alex Rivera Official',
    handle: '@alexrivera_official',
    channelId: 'open_id_tt_8892',
    defaultWorkspaceId: 'ws_acme',
    defaultWorkspaceName: 'Acme Creator Studio',
    scopes: ['video.publish', 'user.info.basic'],
    expiresIn: 'Active TikTok Token',
    capabilities: 'Max Video Duration: 10m (600s) • Direct Post & Inbox',
    lastSynced: '1 hour ago',
  },

  // 2. Capital One Real Estate Endpoints
  {
    id: 'acc-fb-c1-th',
    platform: 'FACEBOOK',
    displayName: 'Capital One Real Estate Thailand',
    handle: 'FB Page: Capital One Thailand',
    channelId: 'fb_c1_main_9921',
    defaultWorkspaceId: 'ws_capitalone',
    defaultWorkspaceName: 'Capital One Real Estate',
    scopes: ['pages_show_list', 'pages_manage_posts'],
    expiresIn: 'Permanent Meta Page Token',
    capabilities: 'Property Listings • Photo Albums • Page Stories • Lead Forms',
    lastSynced: '12 mins ago',
  },
  {
    id: 'acc-ig-c1-main',
    platform: 'INSTAGRAM',
    displayName: 'Capital One Thailand Official',
    handle: '@capitalone.realestate',
    channelId: 'ig_c1_7718',
    defaultWorkspaceId: 'ws_capitalone',
    defaultWorkspaceName: 'Capital One Real Estate',
    scopes: ['instagram_basic', 'instagram_content_publish'],
    expiresIn: '60-day Auto-Refresh Token Vault',
    capabilities: 'Condo Carousel (10) • 24h Story Link Stickers • Luxury Reels',
    lastSynced: '15 mins ago',
  },
  {
    id: 'acc-fb-c1-kw',
    platform: 'FACEBOOK',
    displayName: 'KW Luxury Thailand (Partner Agency)',
    handle: 'FB Page: Keller Williams Luxury TH',
    channelId: 'fb_kw_lux_4412',
    defaultWorkspaceId: 'ws_capitalone',
    defaultWorkspaceName: 'Capital One Real Estate',
    scopes: ['pages_show_list', 'pages_manage_posts'],
    expiresIn: 'Permanent Meta Page Token',
    capabilities: 'Ultra-Luxury Penthouse Albums & Syndication',
    lastSynced: '25 mins ago',
  },

  // 3. RetzPost Software
  {
    id: 'acc-fb-retz',
    platform: 'FACEBOOK',
    displayName: 'RetzPost Software Page',
    handle: 'FB Page: RetzPost App',
    channelId: 'fb_retz_5512',
    defaultWorkspaceId: 'ws_retzpost',
    defaultWorkspaceName: 'RetzPost Software',
    scopes: ['pages_show_list', 'pages_manage_posts'],
    expiresIn: 'Permanent Token',
    capabilities: 'SaaS Product Changelogs & Tech Announcements',
    lastSynced: '2 hours ago',
  },

  // 4. Coffee Craft BKK
  {
    id: 'acc-ig-coffee',
    platform: 'INSTAGRAM',
    displayName: 'Coffee Craft BKK',
    handle: '@coffeecraft.bkk',
    channelId: 'ig_coffee_2219',
    defaultWorkspaceId: 'ws_coffee',
    defaultWorkspaceName: 'Coffee Craft BKK',
    scopes: ['instagram_basic', 'instagram_content_publish'],
    expiresIn: '60-day Auto-Refresh Token',
    capabilities: 'Cafe Stories with Location Stickers & Daily Special Reels',
    lastSynced: '3 hours ago',
  },
];

interface WorkspaceItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  selectedChannelIds: string[];
}

const INITIAL_PROJECTS: WorkspaceItem[] = [
  {
    id: 'ws_capitalone',
    name: 'Capital One Real Estate',
    category: 'อสังหาริมทรัพย์',
    icon: '🏢',
    selectedChannelIds: ['acc-fb-c1-th', 'acc-ig-c1-main', 'acc-fb-c1-kw'],
  },
  {
    id: 'ws_acme',
    name: 'Acme Creator Studio',
    category: 'ครีเอเตอร์ / สตูดิโอ',
    icon: '🎙️',
    selectedChannelIds: ['acc-ig-acme', 'acc-fb-acme', 'acc-yt-acme', 'acc-tt-acme'],
  },
  {
    id: 'ws_retzpost',
    name: 'RetzPost Software',
    category: 'SaaS & ซอฟต์แวร์',
    icon: '⚡',
    selectedChannelIds: ['acc-fb-retz'],
  },
  {
    id: 'ws_coffee',
    name: 'Coffee Craft BKK',
    category: 'คาเฟ่ & อาหาร',
    icon: '☕',
    selectedChannelIds: ['acc-ig-coffee'],
  },
];

export default function ConnectedAccountsPage() {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get('success');
  const errorMessage = searchParams.get('error');

  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>(INITIAL_PROJECTS);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('ALL');
  const [channelFilterMode, setChannelFilterMode] = useState<'ALL' | 'ACTIVE' | 'BYPASSED'>('ALL');

  // Channel selections map: { `${workspaceId}_${channelId}`: boolean }
  const [channelSelections, setChannelSelections] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const ws of INITIAL_PROJECTS) {
      for (const chId of ws.selectedChannelIds) {
        map[`${ws.id}_${chId}`] = true;
      }
    }
    return map;
  });

  // Modal: Create New Project & Pick Channels
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('อสังหาริมทรัพย์');
  const [newProjectSelectedChannels, setNewProjectSelectedChannels] = useState<Record<string, boolean>>({
    'acc-fb-c1-th': true,
    'acc-ig-c1-main': true,
  });

  // Feedback notice
  const [bypassFeedbackNotice, setBypassFeedbackNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setBypassFeedbackNotice(msg);
    setTimeout(() => setBypassFeedbackNotice(null), 4000);
  };

  // Toggle channel activation for a specific workspace
  const handleToggleChannelForWorkspace = (channelId: string, wsId: string) => {
    const key = `${wsId}_${channelId}`;
    const currentlyActive = channelSelections[key] ?? false;
    const nextState = !currentlyActive;

    setChannelSelections((prev) => ({
      ...prev,
      [key]: nextState,
    }));

    if (nextState) {
      showNotice(`✓ เปิดใช้งานช่องทางในโปรเจกต์นี้แล้ว (พร้อมรับคิวโพสต์)`);
    } else {
      showNotice(`🛡️ ปิดใช้งานช่องทางนี้แล้ว: ระบบจะไม่ยุ่ง ไม่ยิง API ข้ามไป และไม่เกิด Error 100%`);
    }
  };

  // Handle Create New Project
  const handleCreateNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newWsId = `ws_proj_${Date.now()}`;
    const chosenChannelIds = Object.keys(newProjectSelectedChannels).filter(
      (id) => newProjectSelectedChannels[id]
    );

    const newProject: WorkspaceItem = {
      id: newWsId,
      name: newProjectName.trim(),
      category: newProjectCategory,
      icon: newProjectCategory === 'อสังหาริมทรัพย์' ? '🏢' : newProjectCategory === 'ครีเอเตอร์' ? '🎙️' : '⚡',
      selectedChannelIds: chosenChannelIds,
    };

    setWorkspaces((prev) => [...prev, newProject]);

    // Save channel permissions
    setChannelSelections((prev) => {
      const updated = { ...prev };
      for (const chId of chosenChannelIds) {
        updated[`${newWsId}_${chId}`] = true;
      }
      return updated;
    });

    setSelectedWorkspaceId(newWsId);
    setIsNewProjectModalOpen(false);
    setNewProjectName('');
    showNotice(`✓ สร้างโปรเจกต์ "${newProject.name}" เรียบร้อยแล้ว (เปิดใช้งานเฉพาะ ${chosenChannelIds.length} ช่องทางที่เลือก ช่องอื่นข้าม API 100%)`);
  };

  // Active workspace object
  const activeWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  // Filtered accounts list
  const filteredAccounts = useMemo(() => {
    return MASTER_ACCOUNTS.filter((acc) => {
      if (selectedWorkspaceId === 'ALL') {
        return true;
      }

      // Check if channel is chosen for active workspace
      const key = `${selectedWorkspaceId}_${acc.id}`;
      const isEnabled = channelSelections[key] ?? false;

      if (channelFilterMode === 'ACTIVE') return isEnabled;
      if (channelFilterMode === 'BYPASSED') return !isEnabled;
      return true;
    });
  }, [selectedWorkspaceId, channelSelections, channelFilterMode]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Masthead
        folio="WORKSPACE DIRECTORY / AUTH MATRIX"
        editionDate="MULTI-FORMAT ENDPOINTS"
        title="Connected Channels & Health"
        subtitle="Manage authorized publication endpoints across Instagram, Facebook, YouTube, and TikTok."
      />

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-semantic-success/10 border border-semantic-success/20 rounded-card flex items-center gap-3 text-xs text-semantic-success font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-semantic-error/10 border border-semantic-error/20 rounded-card flex items-center gap-3 text-xs text-semantic-error font-medium animate-in fade-in">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {bypassFeedbackNotice && (
        <div className="p-3.5 bg-paper-canvas border-l-4 border-brand-indigo rounded-editorial shadow-xs flex items-center justify-between text-xs font-mono text-ink-primary animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-brand-indigo shrink-0" />
            <span>{bypassFeedbackNotice}</span>
          </div>
          <button onClick={() => setBypassFeedbackNotice(null)} className="text-ink-secondary hover:text-ink-primary">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ZERO-TOUCH API BYPASS POLICY BANNER */}
      <div className="p-4 bg-paper-raised border border-border-rule rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-brand-indigo/10 rounded-editorial text-brand-indigo shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif font-bold text-sm text-ink-primary">
                🛡️ Zero-Touch API Bypass Guarantee (ระบบข้ามอัตโนมัติ ไม่ยิง API ไม่เกิด Error)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded font-bold">
                Zero Error Policy
              </span>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed font-sans">
              แพลตฟอร์มหรือเพจไหนที่ <strong>ไม่ได้ติ๊กเลือก</strong> ในโปรเจกต์ ระบบจะไม่ยุ่ง ไม่ทำการเชื่อมต่อ ไม่ส่ง API Request ข้ามไป และไม่เกิด Error ใดๆ ทั้งสิ้น หน้าเขียนโพสต์และคิวจะสะอาดเฉพาะช่องทางที่เปิดใช้งานจริงเท่านั้น
            </p>
          </div>
        </div>

        <div className="shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-3.5 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ สร้าง Project ใหม่ (เลือกช่องทาง)</span>
          </button>
        </div>
      </div>

      {/* WORKSPACE DIRECTORY & SCOPED FILTER BAR */}
      <div className="p-4 bg-paper-raised border border-border-rule rounded-card space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-rule pb-2.5">
          <div className="flex items-center gap-2 font-mono text-xs text-ink-primary font-bold">
            <Building2 className="w-4 h-4 text-brand-indigo" />
            <span>เลือกโปรเจกต์ที่ต้องการจัดการช่องทาง (Workspace Channel Matrix):</span>
          </div>
          <span className="text-[11px] font-mono text-ink-secondary">
            {selectedWorkspaceId === 'ALL'
              ? '🌐 แสดงบัญชีทั้งหมดในระบบ (Master Directory)'
              : `🏢 โปรเจกต์: ${activeWorkspace?.name} (${activeWorkspace?.category})`}
          </span>
        </div>

        {/* Workspace Smart Filter Bar */}
        <SmartFilterBar
          items={[
            { id: 'ALL', label: '🌐 Master Directory (บัญชีทั้งหมด)', count: MASTER_ACCOUNTS.length },
            ...workspaces.map((ws) => ({
              id: ws.id,
              label: `${ws.icon} ${ws.name}`,
              count: `${ws.selectedChannelIds.length} ช่องทาง`,
            })),
          ]}
          selectedId={selectedWorkspaceId}
          onSelect={(id) => setSelectedWorkspaceId(id)}
          maxVisiblePills={5}
          moreButtonText="โปรเจกต์อื่นๆ"
          searchPlaceholder="🔍 ค้นหาโปรเจกต์ / Workspace..."
        />

        {/* Channel Filter Pills (เมื่อเลือก Workspace แล้ว) */}
        {selectedWorkspaceId !== 'ALL' && (
          <div className="flex items-center gap-2 pt-1 font-mono text-xs">
            <span className="text-[10px] text-ink-secondary uppercase">แสดง:</span>
            {[
              { id: 'ALL', label: 'ทั้งหมด' },
              { id: 'ACTIVE', label: '✓ เปิดใช้งานในโปรเจกต์นี้' },
              { id: 'BYPASSED', label: '⚪ ไม่ได้ใช้ (Bypassed ข้าม API)' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setChannelFilterMode(f.id as any)}
                className={`px-2.5 py-0.5 rounded text-[11px] border transition-colors cursor-pointer ${
                  channelFilterMode === f.id
                    ? 'bg-paper-canvas text-brand-indigo border-brand-indigo font-bold shadow-2xs'
                    : 'bg-paper-subtle text-ink-secondary border-border-rule hover:text-ink-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE ENDPOINTS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-ink-primary flex items-center gap-2">
            <span>Authorized Endpoints & Channels</span>
            <span className="px-2 py-0.5 rounded-full bg-paper-subtle border border-border-rule text-xs font-mono font-bold text-ink-secondary">
              {filteredAccounts.length} บัญชี
            </span>
          </h2>
          <span className="text-[11px] font-mono text-ink-muted hidden sm:inline-block">
            Envelope Encryption AES-256-GCM Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAccounts.map((acc) => {
            // Check if active for current workspace
            const currentWsId = selectedWorkspaceId === 'ALL' ? acc.defaultWorkspaceId : selectedWorkspaceId;
            const key = `${currentWsId}_${acc.id}`;
            const isEnabledInCurrentWs = channelSelections[key] ?? (selectedWorkspaceId === 'ALL' ? true : false);

            return (
              <div
                key={acc.id}
                className={`border rounded-card p-5 space-y-4 transition-all shadow-xs ${
                  isEnabledInCurrentWs
                    ? 'bg-paper-raised border-border-rule hover:border-brand-indigo/60'
                    : 'bg-paper-subtle/50 border-border-rule/80 opacity-75'
                }`}
              >
                {/* Header: Platform Logo + Name + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-editorial flex items-center justify-center p-2 bg-paper-canvas border border-border-rule shrink-0 shadow-2xs">
                      {acc.platform === 'INSTAGRAM' && <InstagramLogo size={24} />}
                      {acc.platform === 'FACEBOOK' && <FacebookLogo size={24} />}
                      {acc.platform === 'YOUTUBE' && <YouTubeLogo size={24} />}
                      {acc.platform === 'TIKTOK' && <TikTokLogo size={24} />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif font-bold text-sm text-ink-primary truncate">
                          {acc.displayName}
                        </h3>
                      </div>
                      <p className="text-xs font-mono text-ink-secondary truncate">{acc.handle}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {isEnabledInCurrentWs ? (
                      <span className="px-2 py-1 rounded bg-semantic-success/15 text-semantic-success text-[10px] font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-ping" />
                        <span>CONNECTED</span>
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-paper-subtle border border-border-rule text-ink-muted text-[10px] font-mono font-bold">
                        ⚪ BYPASSED / ข้าม
                      </span>
                    )}
                  </div>
                </div>

                {/* ZERO-TOUCH BYPASS TOGGLE / CHECKBOX */}
                <div className={`p-3 rounded-editorial border text-xs font-mono flex items-center justify-between gap-3 ${
                  isEnabledInCurrentWs
                    ? 'bg-paper-canvas border-brand-indigo/30'
                    : 'bg-paper-subtle border-border-rule'
                }`}>
                  <label className="flex items-center gap-2 cursor-pointer select-none min-w-0">
                    <input
                      type="checkbox"
                      checked={isEnabledInCurrentWs}
                      onChange={() => handleToggleChannelForWorkspace(acc.id, currentWsId)}
                      className="w-4 h-4 rounded text-brand-indigo border-border-rule focus:ring-brand-indigo cursor-pointer"
                    />
                    <span className="font-bold text-ink-primary truncate">
                      {isEnabledInCurrentWs
                        ? `เปิดใช้งานใน ${activeWorkspace?.name || acc.defaultWorkspaceName}`
                        : `ปิดใช้งานใน ${activeWorkspace?.name || acc.defaultWorkspaceName} (ข้าม API)`}
                    </span>
                  </label>

                  <span className={`text-[10px] shrink-0 font-bold ${
                    isEnabledInCurrentWs ? 'text-semantic-success' : 'text-ink-muted'
                  }`}>
                    {isEnabledInCurrentWs ? '✓ พร้อมรับคิวโพสต์' : '🛡️ ระบบจะไม่ยุ่ง 100%'}
                  </span>
                </div>

                {/* Capabilities & Token Health */}
                <div className="space-y-1.5 p-3 bg-paper-canvas rounded-editorial text-[11px] font-mono text-ink-secondary border border-border-rule">
                  <div>
                    <span className="text-ink-primary font-semibold">Capabilities: </span>
                    <span className="text-brand-indigo font-medium">{acc.capabilities}</span>
                  </div>
                  <div>
                    <span className="text-ink-primary font-semibold">Token Health: </span>
                    <span>{acc.expiresIn}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border-rule text-xs">
                  <span className="text-[10px] font-mono text-ink-secondary">Synced {acc.lastSynced}</span>
                  <a
                    href={`/api/connections/${acc.platform === 'INSTAGRAM' || acc.platform === 'FACEBOOK' ? 'meta' : acc.platform.toLowerCase()}/start`}
                    className="px-3 py-1.5 bg-paper-subtle hover:bg-paper-canvas text-ink-primary font-medium rounded-editorial border border-border-rule transition-colors inline-flex items-center gap-1.5 text-xs font-mono"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-ink-secondary" />
                    <span>Re-authenticate</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONNECT ADDITIONAL PLATFORMS SECTION */}
      <div className="p-6 bg-paper-raised border border-border-rule rounded-card space-y-4">
        <div>
          <h2 className="font-serif font-bold text-base text-ink-primary mb-1">
            Connect Additional Publication Endpoints (เพิ่มการเชื่อมต่อบัญชีใหม่)
          </h2>
          <p className="text-xs text-ink-secondary max-w-xl font-sans">
            เชื่อมต่อ Facebook Pages, Instagram Professional, YouTube Channels, หรือ TikTok Profiles เพิ่มเติมเข้ามายัง Master Hub
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/connections/meta/start"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white text-xs font-mono font-semibold rounded-editorial hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Connect Meta (Facebook & Instagram)</span>
          </a>

          <a
            href="/api/connections/youtube/start"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF0000] text-white text-xs font-mono font-semibold rounded-editorial hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Connect YouTube Channel</span>
          </a>

          <a
            href="/api/connections/tiktok/start"
            className="inline-flex items-center gap-2 px-4 py-2 bg-ink-primary text-white text-xs font-mono font-semibold rounded-editorial hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Connect TikTok Account</span>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW PROJECT & SELECT CHANNELS                               */}
      {/* ========================================================================= */}
      {isNewProjectModalOpen && (
        <div 
          onClick={() => setIsNewProjectModalOpen(false)}
          className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border border-border-rule rounded-card max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-rule shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-ink-primary">
                    สร้าง Project ใหม่ พร้อมติ๊กเลือกช่องทาง
                  </h3>
                  <p className="text-[11px] font-mono text-ink-secondary">
                    เลือกเฉพาะช่องทางและเพจที่โปรเจกต์นี้ใช้งานจริง (ช่องที่ไม่เลือกจะ Bypass 100%)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1 rounded-editorial border border-border-rule hover:bg-paper-subtle text-ink-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateNewProject} className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
              {/* Project Name */}
              <div>
                <label className="block font-mono text-[11px] uppercase text-ink-secondary mb-1">
                  ชื่อโปรเจกต์ (Project Name) *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="เช่น: Whizdom Luxury Suites, Acme Podcast..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-serif text-sm text-ink-primary placeholder:text-ink-muted focus:outline-hidden focus:border-brand-indigo"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-mono text-[11px] uppercase text-ink-secondary mb-1">
                  ประเภทธุรกิจ / หมวดหมู่
                </label>
                <select
                  value={newProjectCategory}
                  onChange={(e) => setNewProjectCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary focus:outline-hidden focus:border-brand-indigo"
                >
                  <option value="อสังหาริมทรัพย์">🏢 อสังหาริมทรัพย์ (Real Estate Agency)</option>
                  <option value="ครีเอเตอร์">🎙️ ครีเอเตอร์ / สตูดิโอมีเดีย (Creator Media)</option>
                  <option value="SaaS & ซอฟต์แวร์">⚡ ซอฟต์แวร์ / ดิจิทัลโปรดักต์ (SaaS)</option>
                  <option value="คาเฟ่ & อาหาร">☕ คาเฟ่ & ไลฟ์สไตล์ (Food & Beverage)</option>
                  <option value="อีคอมเมิร์ซ">🛍️ แบรนด์สินค้า & อีคอมเมิร์ซ (E-Commerce)</option>
                </select>
              </div>

              {/* Channel Checkbox Directory */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-[11px] uppercase text-ink-secondary font-bold">
                    ติ๊กเลือกช่องทางที่ต้องการเปิดใช้งานในโปรเจกต์นี้:
                  </label>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        const allSelected: Record<string, boolean> = {};
                        MASTER_ACCOUNTS.forEach((a) => (allSelected[a.id] = true));
                        setNewProjectSelectedChannels(allSelected);
                      }}
                      className="text-brand-indigo hover:underline cursor-pointer"
                    >
                      เลือกทั้งหมด
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => setNewProjectSelectedChannels({})}
                      className="text-ink-muted hover:text-ink-primary cursor-pointer"
                    >
                      ล้างทั้งหมด
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-paper-canvas border border-border-rule rounded-editorial space-y-2 max-h-48 overflow-y-auto">
                  {MASTER_ACCOUNTS.map((acc) => {
                    const isChecked = newProjectSelectedChannels[acc.id] ?? false;

                    return (
                      <label
                        key={acc.id}
                        className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-brand-indigo/5 border-brand-indigo/30'
                            : 'bg-paper-subtle/50 border-border-rule/60 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              setNewProjectSelectedChannels((prev) => ({
                                ...prev,
                                [acc.id]: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 rounded text-brand-indigo border-border-rule focus:ring-brand-indigo cursor-pointer"
                          />
                          <SocialPlatformIcon platform={acc.platform} size={16} />
                          <div className="min-w-0">
                            <p className="font-serif font-bold text-xs text-ink-primary truncate">
                              {acc.displayName}
                            </p>
                            <p className="text-[10px] font-mono text-ink-secondary truncate">
                              {acc.handle}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isChecked
                            ? 'bg-semantic-success/15 text-semantic-success font-bold'
                            : 'bg-paper-subtle text-ink-muted'
                        }`}>
                          {isChecked ? 'เปิดใช้' : 'ข้าม API'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Zero Error Guarantee Notice */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-editorial text-[11px] font-mono text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>การันตีความปลอดภัย:</strong> ช่องทางที่ไม่ได้ติ๊ก ระบบจะไม่ยุ่ง ไม่ยิง API ข้ามไป และไม่เกิด Error ใดๆ ทั้งสิ้น (Zero-Touch Bypass)
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-border-rule flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 border border-border-rule rounded-editorial font-mono text-ink-secondary hover:text-ink-primary cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial font-mono font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  สร้างโปรเจกต์และเปิดใช้งาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
