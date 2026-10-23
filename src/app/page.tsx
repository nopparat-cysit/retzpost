'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Masthead 
} from '@/components/ui/masthead';
import { 
  StatusTag 
} from '@/components/ui/status-tag';
import { 
  ArrowRight, 
  Plus, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  Calendar, 
  Library, 
  Film, 
  Camera, 
  TrendingUp, 
  ExternalLink,
  RefreshCw,
  Sparkles,
  Download,
  FileSpreadsheet,
  ShieldAlert,
  Building2,
  Activity,
  FileText,
  ChevronRight,
  Bookmark,
  Check,
  X,
  Sliders,
  Send
} from 'lucide-react';
import { 
  generateErrorLogCsv, 
  generateAllDispatchesCsv, 
  downloadCsvFile,
  ExportableJob 
} from '@/modules/publishing/export-csv';

interface DispatchBatch {
  id: string;
  workspaceId: string;
  workspaceName: string;
  title: string;
  timestamp: string;
  status: 'PUBLISHED' | 'PARTIALLY_PUBLISHED' | 'SCHEDULED' | 'FAILED_RETRYABLE' | 'FAILED_FINAL';
  placements: Array<{
    platform: 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK';
    format: 'FEED' | 'STORY' | 'REEL';
    label: string;
    badgeBg: string;
    status: 'PUBLISHED' | 'FAILED' | 'PENDING';
    error?: string;
  }>;
  liveUrl?: string;
}

const SAMPLE_BATCHES: DispatchBatch[] = [
  {
    id: 'MP-BATCH-895',
    workspaceId: 'ws_capitalone',
    workspaceName: 'Capital One Real Estate',
    title: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
    timestamp: 'Today 08:30 AM',
    status: 'PARTIALLY_PUBLISHED',
    placements: [
      { platform: 'FACEBOOK', format: 'FEED', label: 'FB Thailand Album (6)', badgeBg: 'bg-[#1877F2]', status: 'PUBLISHED' },
      { platform: 'INSTAGRAM', format: 'FEED', label: 'IG Carousel (6)', badgeBg: 'bg-brand-indigo', status: 'PUBLISHED' },
      { platform: 'FACEBOOK', format: 'FEED', label: 'Oknus FB Page', badgeBg: 'bg-accent-terracotta', status: 'FAILED', error: 'Token Expired (Code: 190)' },
      { platform: 'INSTAGRAM', format: 'STORY', label: 'IG Story 24h + Link', badgeBg: 'bg-accent-terracotta', status: 'FAILED', error: 'Aspect Ratio 1:1 vs 9:16' },
    ],
    liveUrl: 'https://facebook.com/capitalonethailand/posts/991283',
  },
  {
    id: 'MP-BATCH-892',
    workspaceId: 'ws_acme',
    workspaceName: 'Acme Creator Studio',
    title: 'Behind the Scenes: Studio Redesign Tour',
    timestamp: 'Today 09:15 AM',
    status: 'PARTIALLY_PUBLISHED',
    placements: [
      { platform: 'INSTAGRAM', format: 'FEED', label: 'IG Feed (3 Photos)', badgeBg: 'bg-brand-indigo', status: 'PUBLISHED' },
      { platform: 'INSTAGRAM', format: 'STORY', label: 'IG Story (24h)', badgeBg: 'bg-accent-terracotta', status: 'PUBLISHED' },
      { platform: 'FACEBOOK', format: 'FEED', label: 'FB Page Album', badgeBg: 'bg-[#1877F2]', status: 'PUBLISHED' },
      { platform: 'YOUTUBE', format: 'REEL', label: 'YT Shorts (00:58)', badgeBg: 'bg-semantic-info', status: 'PUBLISHED' },
      { platform: 'TIKTOK', format: 'REEL', label: 'TikTok Direct Post', badgeBg: 'bg-accent-terracotta', status: 'FAILED', error: 'Rate limit 429' },
    ],
    liveUrl: 'https://instagram.com/p/example-carousel',
  },
  {
    id: 'MP-BATCH-890',
    workspaceId: 'ws_capitalone',
    workspaceName: 'Capital One Real Estate',
    title: 'The Penthouse Collection: Private Pool & Panoramic View',
    timestamp: 'Yesterday 04:30 PM',
    status: 'PUBLISHED',
    placements: [
      { platform: 'FACEBOOK', format: 'FEED', label: 'KW Luxury Thailand', badgeBg: 'bg-[#1877F2]', status: 'PUBLISHED' },
      { platform: 'FACEBOOK', format: 'FEED', label: 'Capital One Taiwan', badgeBg: 'bg-[#1877F2]', status: 'PUBLISHED' },
      { platform: 'INSTAGRAM', format: 'STORY', label: 'IG Story 24h + Link', badgeBg: 'bg-accent-terracotta', status: 'PUBLISHED' },
      { platform: 'INSTAGRAM', format: 'FEED', label: 'IG Carousel (4)', badgeBg: 'bg-brand-indigo', status: 'PUBLISHED' },
    ],
    liveUrl: 'https://instagram.com/p/C1RichRama9',
  },
  {
    id: 'MP-BATCH-888',
    workspaceId: 'ws_retzpost',
    workspaceName: 'RetzPost Software',
    title: 'Introducing Next-Gen Multi-Placement Publishing Studio',
    timestamp: 'Oct 22, 10:00 AM',
    status: 'PUBLISHED',
    placements: [
      { platform: 'FACEBOOK', format: 'FEED', label: 'Product Desk Page', badgeBg: 'bg-[#1877F2]', status: 'PUBLISHED' },
      { platform: 'YOUTUBE', format: 'REEL', label: 'YT Shorts (00:48)', badgeBg: 'bg-semantic-info', status: 'PUBLISHED' },
      { platform: 'INSTAGRAM', format: 'STORY', label: 'Changelog Story', badgeBg: 'bg-accent-terracotta', status: 'PUBLISHED' },
    ],
    liveUrl: 'https://retzpost.io/whats-new',
  },
  {
    id: 'MP-BATCH-885',
    workspaceId: 'ws_coffee',
    workspaceName: 'Coffee Craft BKK',
    title: 'Weekend Cold Brew Roasting & Bakery Specials',
    timestamp: 'Oct 21, 08:00 AM',
    status: 'PUBLISHED',
    placements: [
      { platform: 'FACEBOOK', format: 'FEED', label: 'Cafe Main Page', badgeBg: 'bg-[#1877F2]', status: 'PUBLISHED' },
      { platform: 'INSTAGRAM', format: 'FEED', label: 'Cafe IG Feed', badgeBg: 'bg-brand-indigo', status: 'PUBLISHED' },
      { platform: 'INSTAGRAM', format: 'STORY', label: 'Story + Location Tag', badgeBg: 'bg-accent-terracotta', status: 'PUBLISHED' },
    ],
    liveUrl: 'https://instagram.com/p/coffeecraft',
  },
];

const SCHEDULED_TIMELINE = [
  {
    time: 'Today 09:15 AM',
    title: 'Behind the Scenes: Studio Redesign Tour (TikTok Retry)',
    project: 'Acme Creator Studio',
    format: 'Reel (00:58)',
    destination: '@alexrivera_official (TikTok)',
    badgeColor: 'bg-ink-primary',
  },
  {
    time: 'Today 11:30 AM',
    title: 'The Rich Rama 9 Luxury 2-Bed Unit: Story Link Push',
    project: 'Capital One Real Estate',
    format: 'Story + Link Sticker',
    destination: '@thailandprop.c1 (IG)',
    badgeColor: 'bg-accent-terracotta',
  },
  {
    time: 'Today 02:00 PM',
    title: 'Weekly Market Brief: Social Platform Algorithm Shifts in 2026',
    project: 'RetzPost Software',
    format: 'Carousel & Feed',
    destination: 'FB Page & IG Feed',
    badgeColor: 'bg-brand-indigo',
  },
  {
    time: 'Tomorrow 09:00 AM',
    title: '3 Hooks That Stop the Scroll in 2026',
    project: 'Acme Creator Studio',
    format: 'Shorts • 00:45',
    destination: '@AlexClips (YouTube)',
    badgeColor: 'bg-semantic-info',
  },
];

const CHANNEL_HEALTH = [
  {
    name: 'Capital One Thailand (Main)',
    platform: 'Facebook',
    handle: 'Capital One Real Estate Thailand',
    status: 'HEALTHY',
    tokenExpiry: '58 days remaining',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
  },
  {
    name: 'KW Luxury Thailand',
    platform: 'Facebook',
    handle: 'Keller Williams Luxury Thailand',
    status: 'HEALTHY',
    tokenExpiry: '58 days remaining',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
  },
  {
    name: 'Oknus Real Estate',
    platform: 'Facebook',
    handle: 'Oknus Real Estate Agency',
    status: 'ATTENTION',
    tokenExpiry: 'Token Expired (Code: 190)',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
  },
  {
    name: 'Capital One IG Official',
    platform: 'Instagram',
    handle: '@capitalonerealestate',
    status: 'HEALTHY',
    tokenExpiry: '58 days remaining',
    avatarBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    avatarText: 'IG',
  },
  {
    name: 'Thailand Prop C1',
    platform: 'Instagram',
    handle: '@thailandprop.c1',
    status: 'WARNING',
    tokenExpiry: 'Media Aspect Ratio Fault',
    avatarBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    avatarText: 'IG',
  },
  {
    name: 'Alex Rivera Studio',
    platform: 'YouTube',
    handle: '@AlexRiveraStudio',
    status: 'HEALTHY',
    tokenExpiry: 'OAuth Token Active',
    avatarBg: 'bg-[#FF0000]',
    avatarText: 'YT',
  },
  {
    name: 'Alex Rivera TikTok',
    platform: 'TikTok',
    handle: '@alexrivera_official',
    status: 'HEALTHY',
    tokenExpiry: 'Rate Limit Cooldown Ended',
    avatarBg: 'bg-ink-primary',
    avatarText: 'TT',
  },
];

export default function HomePage() {
  const [workspaceFilter, setWorkspaceFilter] = useState<'ALL' | 'ws_capitalone' | 'ws_acme' | 'ws_retzpost' | 'ws_coffee'>('ALL');
  const [batchTab, setBatchTab] = useState<'ALL' | 'CAPITAL_ONE' | 'ACME' | 'NEEDS_ATTENTION'>('ALL');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Filtered batches
  const filteredBatches = SAMPLE_BATCHES.filter((b) => {
    if (workspaceFilter !== 'ALL' && b.workspaceId !== workspaceFilter) return false;
    if (batchTab === 'CAPITAL_ONE') return b.workspaceId === 'ws_capitalone';
    if (batchTab === 'ACME') return b.workspaceId === 'ws_acme';
    if (batchTab === 'NEEDS_ATTENTION') return ['PARTIALLY_PUBLISHED', 'FAILED_RETRYABLE', 'FAILED_FINAL'].includes(b.status);
    return true;
  });

  const handleExportErrorLog = () => {
    const errorJobs: ExportableJob[] = [
      {
        id: 'MP-JOB-1055',
        platform: 'FACEBOOK',
        format: 'FEED_POST',
        handle: 'Oknus Real Estate',
        storyTitle: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
        status: 'FAILED_FINAL',
        attemptCount: 4,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 08:30 AM',
        errorSafeMessage: 'Facebook Graph API OAuthException: Token expired (Code: 190, Subcode: 463). Re-authentication required.',
      },
      {
        id: 'MP-JOB-1056',
        platform: 'INSTAGRAM',
        format: 'STORY',
        handle: 'thailandprop.c1',
        storyTitle: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
        status: 'FAILED_RETRYABLE',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 08:30 AM',
        errorSafeMessage: 'Meta Media Upload API: Invalid aspect ratio for Story sticker. Media was 1:1 instead of vertical 9:16.',
      },
      {
        id: 'MP-JOB-1050',
        platform: 'TIKTOK',
        format: 'VIDEO_REEL',
        handle: '@alexrivera_official',
        storyTitle: 'Behind the Scenes: Studio Redesign Tour',
        status: 'FAILED_RETRYABLE',
        attemptCount: 2,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 09:16 AM',
        errorSafeMessage: 'TikTok returned rate limit 429. Scheduled auto-retry in 5 minutes.',
      },
    ];

    const csv = generateErrorLogCsv(errorJobs);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `RetzPost_Error_Log_${dateStr}.csv`;
    downloadCsvFile(csv, filename);
    setDownloadToast(`Exported 3 error audit records to ${filename}`);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const handleExportAllJobs = () => {
    const allJobs: ExportableJob[] = [
      {
        id: 'MP-JOB-1057',
        platform: 'FACEBOOK',
        format: 'FEED_POST',
        handle: 'Capital One Real Estate Thailand',
        storyTitle: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 08:30 AM',
        liveUrl: 'https://facebook.com/capitalonethailand/posts/991283',
      },
      {
        id: 'MP-JOB-1058',
        platform: 'INSTAGRAM',
        format: 'FEED_POST',
        handle: 'capitalonerealestate',
        storyTitle: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 08:30 AM',
        liveUrl: 'https://instagram.com/p/C1RichRama9',
      },
      {
        id: 'MP-JOB-1053',
        platform: 'INSTAGRAM',
        format: 'FEED_POST',
        handle: '@alexrivera_official',
        storyTitle: 'Omni-Format Publishing: Simultaneous Feed & Story',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 09:00 AM',
        liveUrl: 'https://instagram.com/p/example-carousel',
      },
      {
        id: 'MP-JOB-1054',
        platform: 'INSTAGRAM',
        format: 'STORY',
        handle: '@alexrivera_official',
        storyTitle: 'Omni-Format Publishing: Simultaneous Feed & Story',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 09:00 AM',
        liveUrl: 'https://instagram.com/stories/alexrivera_official',
      },
      {
        id: 'MP-JOB-1049',
        platform: 'YOUTUBE',
        format: 'VIDEO_REEL',
        handle: '@AlexRiveraStudio',
        storyTitle: 'Behind the Scenes: Studio Redesign Tour',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 09:15 AM',
        liveUrl: 'https://youtu.be/dQw4w9WgXcQ',
      },
    ];

    const csv = generateAllDispatchesCsv(allJobs);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `RetzPost_Monthly_Telemetry_${dateStr}.csv`;
    downloadCsvFile(csv, filename);
    setDownloadToast(`Exported all 74 monthly dispatch records to ${filename}`);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 space-y-7">
      {/* EXECUTIVE MASTHEAD & QUICK CONTROLS */}
      <Masthead
        title="Editorial Command & Publishing Desk"
        subtitle="Centralized Operations: Upload once. Adapt and publish everywhere across Feed Posts, 24h Stories, and Reels/Shorts."
        folio="SYSTEM DESK / EXECUTIVE COMMAND"
        editionDate="ALL-IN-ONE ENTERPRISE SUITE"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportErrorLog}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-terracotta/10 hover:bg-accent-terracotta/20 text-accent-terracotta border border-accent-terracotta/30 text-xs font-mono font-medium rounded-editorial transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Error Log</span>
              <span className="w-4 h-4 rounded-full bg-accent-terracotta text-white flex items-center justify-center text-[9px] font-bold">
                2
              </span>
            </button>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-indigo text-white text-xs font-semibold rounded-editorial hover:bg-brand-indigo-hover transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Compose Dispatch</span>
            </Link>
          </div>
        }
      />

      {/* TOAST DOWNLOAD NOTIFICATION */}
      {downloadToast && (
        <div className="bg-semantic-success/10 border border-semantic-success/30 text-semantic-success px-4 py-2.5 rounded-editorial flex items-center justify-between text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{downloadToast}</span>
          </div>
          <button onClick={() => setDownloadToast(null)} className="hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* OPERATIONAL ALERT BANNER (Enterprise Warning) */}
      <div className="bg-paper-raised border-l-4 border-accent-terracotta p-4 rounded-card border-r border-t border-b border-border-rule shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-terracotta/10 text-accent-terracotta flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-medium text-sm text-ink-primary">
                2 Dispatches Require Operational Attention
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent-terracotta/15 text-accent-terracotta font-semibold">
                Action Needed
              </span>
            </div>
            <p className="text-xs text-ink-secondary mt-0.5 font-sans leading-relaxed">
              Facebook Token expired on <span className="font-mono text-ink-primary font-medium">Oknus Real Estate</span> & Instagram Story ratio mismatch on <span className="font-mono text-ink-primary font-medium">thailandprop.c1</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={handleExportErrorLog}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle text-accent-terracotta border border-accent-terracotta/40 rounded-editorial text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
          <Link
            href="/publishing/queue"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-accent-terracotta text-white hover:bg-accent-terracotta/90 rounded-editorial text-xs font-mono font-semibold transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resolve in Queue</span>
          </Link>
        </div>
      </div>

      {/* WORKSPACE & PROJECT FILTER BAR */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border-rule text-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono uppercase font-bold text-ink-secondary flex items-center gap-1">
            <Building2 className="w-3 h-3 text-brand-indigo" />
            <span>Workspace:</span>
          </span>
          {[
            { id: 'ALL', label: 'All Projects (17 Channels)' },
            { id: 'ws_capitalone', label: 'Capital One Real Estate (6)' },
            { id: 'ws_acme', label: 'Acme Studio (4)' },
            { id: 'ws_retzpost', label: 'RetzPost Software (4)' },
            { id: 'ws_coffee', label: 'Coffee Craft (3)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setWorkspaceFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                workspaceFilter === tab.id
                  ? 'bg-brand-indigo text-white font-semibold shadow-2xs'
                  : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-ink-secondary">
          <span className="w-2 h-2 rounded-full bg-semantic-success inline-block animate-pulse" />
          <span>Meta Graph & TikTok APIs Live (99.98% SLA)</span>
        </div>
      </div>

      {/* TOP ROW: 4 COMPREHENSIVE OPERATIONAL PULSE CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Channels */}
        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <div className="flex items-center justify-between text-ink-secondary mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Connected Channels</span>
            <div className="w-2 h-2 rounded-full bg-semantic-success" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-serif font-bold text-2xl text-ink-primary">17</p>
            <span className="text-[10px] font-mono text-semantic-success font-medium">4 Workspaces</span>
          </div>
          <p className="text-[10px] text-ink-secondary mt-1 font-mono">
            FB (7) • IG (5) • YT (3) • TT (2)
          </p>
        </div>

        {/* Metric 2: Monthly Publishing Velocity */}
        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <div className="flex items-center justify-between text-ink-secondary mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Monthly Placements</span>
            <TrendingUp className="w-3.5 h-3.5 text-brand-indigo" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-serif font-bold text-2xl text-ink-primary">74</p>
            <span className="text-[10px] font-mono text-semantic-success font-semibold">97.3% Clean</span>
          </div>
          <p className="text-[10px] text-ink-secondary mt-1 font-mono">
            33 Feeds • 26 Stories • 15 Reels
          </p>
        </div>

        {/* Metric 3: Upcoming Schedule */}
        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <div className="flex items-center justify-between text-ink-secondary mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Dispatch Horizon</span>
            <Clock className="w-3.5 h-3.5 text-semantic-info" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-serif font-bold text-2xl text-ink-primary">4</p>
            <span className="text-[10px] font-mono text-semantic-info font-medium">Next: 09:15 AM</span>
          </div>
          <p className="text-[10px] text-ink-secondary mt-1 font-mono">
            Timezone: Asia/Bangkok
          </p>
        </div>

        {/* Metric 4: Attention Required */}
        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <div className="flex items-center justify-between text-ink-secondary mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Needs Attention</span>
            <AlertTriangle className="w-3.5 h-3.5 text-accent-terracotta" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-serif font-bold text-2xl text-accent-terracotta">2</p>
            <Link 
              href="/publishing/queue" 
              className="text-[10px] font-mono text-accent-terracotta hover:underline font-semibold"
            >
              Export & Retry →
            </Link>
          </div>
          <p className="text-[10px] text-ink-secondary mt-1 font-mono truncate">
            FB Token Expired & IG Story Ratio
          </p>
        </div>
      </section>

      {/* 2-COLUMN MAIN BODY: RECENT DISPATCHES + FORMAT MIX & HEALTH */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Multi-Format Dispatches (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Publication Batches Card */}
          <div className="bg-paper-raised p-5 rounded-card border border-border-rule shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-rule">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[TELEMETRY LEDGER]</span>
                <h2 className="font-serif font-medium text-base text-ink-primary">
                  Multi-Placement Publication Batches
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'CAPITAL_ONE', label: 'Capital One' },
                  { id: 'ACME', label: 'Acme' },
                  { id: 'NEEDS_ATTENTION', label: 'Attention' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setBatchTab(t.id as any)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      batchTab === t.id
                        ? 'bg-paper-canvas text-brand-indigo font-bold border border-brand-indigo/30'
                        : 'text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border-rule">
              {filteredBatches.length === 0 ? (
                <p className="py-6 text-center text-xs font-mono text-ink-secondary">
                  No publication batches found for this filter.
                </p>
              ) : (
                filteredBatches.map((batch) => (
                  <div key={batch.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-medium text-sm text-ink-primary">
                            {batch.title}
                          </h3>
                          <span className="text-[10px] font-mono text-ink-secondary">
                            {batch.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono font-medium text-brand-indigo">
                            {batch.workspaceName}
                          </span>
                          <span className="text-[10px] text-ink-secondary font-mono">•</span>
                          <span className="text-[10px] text-ink-secondary font-mono">
                            {batch.timestamp}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <StatusTag status={batch.status as any} />
                        {batch.liveUrl ? (
                          <a
                            href={batch.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-brand-indigo hover:text-brand-indigo-hover hover:underline bg-paper-canvas border border-border-rule rounded-editorial"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <Link
                            href="/publishing/queue"
                            className="px-2.5 py-1 text-xs font-mono text-ink-primary hover:bg-paper-canvas bg-paper-subtle border border-border-rule rounded-editorial"
                          >
                            Inspect
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Placements Breakdown Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {batch.placements.map((plc, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium text-white flex items-center gap-1 ${
                            plc.status === 'FAILED' ? 'bg-accent-terracotta' : plc.badgeBg
                          }`}
                        >
                          <span>{plc.label}</span>
                          {plc.status === 'FAILED' && (
                            <span className="text-[8px] bg-white/20 px-1 rounded uppercase font-bold">
                              Error
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-border-rule flex items-center justify-between text-xs font-mono">
              <span className="text-ink-secondary text-[11px]">
                Showing {filteredBatches.length} of {SAMPLE_BATCHES.length} batches
              </span>
              <Link
                href="/publishing/queue"
                className="text-brand-indigo hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View Full Queue & Telemetry</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Scheduled Editorial Timeline & Mini Calendar */}
          <div className="bg-paper-raised p-5 rounded-card border border-border-rule shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-indigo" />
                <h2 className="font-serif font-medium text-base text-ink-primary">
                  Upcoming Dispatch Horizon (Schedule)
                </h2>
              </div>
              <Link
                href="/calendar"
                className="text-xs font-mono text-brand-indigo hover:underline font-medium flex items-center gap-1"
              >
                <span>Full Editorial Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {SCHEDULED_TIMELINE.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-paper-canvas border border-border-rule rounded-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-brand-indigo/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-brand-indigo">
                        {item.time}
                      </span>
                      <span className="text-[10px] font-mono text-ink-secondary bg-paper-subtle px-1.5 py-0.2 rounded border border-border-rule">
                        {item.project}
                      </span>
                    </div>
                    <p className="font-serif text-ink-primary text-xs font-medium">
                      {item.title}
                    </p>
                    <span className="text-[10px] font-mono text-ink-secondary block">
                      Target: {item.destination}
                    </span>
                  </div>

                  <div className="shrink-0 self-start sm:self-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono text-white font-medium ${item.badgeColor}`}>
                      {item.format}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Format Mix, Channel Health & Shortcuts (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Format Analytics Mix */}
          <div className="bg-paper-raised p-5 rounded-card border border-border-rule shadow-xs space-y-4">
            <div className="pb-2 border-b border-border-rule">
              <span className="font-mono text-xs font-bold text-brand-indigo">[FORMAT ANALYTICS]</span>
              <h2 className="font-serif font-medium text-sm text-ink-primary mt-0.5">
                Multi-Placement Distribution Mix
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-ink-primary flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-indigo" />
                    Feed Posts & Carousels
                  </span>
                  <span className="font-semibold text-brand-indigo">45% (33 jobs)</span>
                </div>
                <div className="w-full h-2 bg-paper-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-brand-indigo rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-ink-primary flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-terracotta" />
                    24h Ephemeral Stories
                  </span>
                  <span className="font-semibold text-accent-terracotta">35% (26 jobs)</span>
                </div>
                <div className="w-full h-2 bg-paper-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-accent-terracotta rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-ink-primary flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-semantic-info" />
                    Reels, Shorts & Video
                  </span>
                  <span className="font-semibold text-semantic-info">20% (15 jobs)</span>
                </div>
                <div className="w-full h-2 bg-paper-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-semantic-info rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-ink-secondary font-mono pt-2 border-t border-border-rule leading-relaxed">
              💡 Omni-Format Synergy: 78% of image assets published simultaneously to both Feed and 24h Story.
            </p>
          </div>

          {/* Channel Health Matrix */}
          <div className="bg-paper-raised p-5 rounded-card border border-border-rule shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border-rule">
              <div>
                <span className="font-mono text-xs font-bold text-brand-indigo">[AUTHENTICATION]</span>
                <h2 className="font-serif font-medium text-sm text-ink-primary mt-0.5">
                  Channel Token Health
                </h2>
              </div>
              <Link
                href="/accounts"
                className="text-[11px] font-mono text-brand-indigo hover:underline font-semibold"
              >
                Manage (17) →
              </Link>
            </div>

            <div className="space-y-2">
              {CHANNEL_HEALTH.slice(0, 5).map((ch, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-paper-canvas border border-border-rule rounded-editorial flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white shrink-0 ${ch.avatarBg}`}>
                      {ch.avatarText}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-mono font-medium text-ink-primary truncate">
                        {ch.name}
                      </p>
                      <span className="text-[9px] font-mono text-ink-secondary block truncate">
                        {ch.handle}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {ch.status === 'HEALTHY' && (
                      <span className="text-[9px] font-mono text-semantic-success flex items-center gap-1 justify-end font-semibold">
                        <Check className="w-2.5 h-2.5" />
                        <span>Valid</span>
                      </span>
                    )}
                    {ch.status === 'ATTENTION' && (
                      <Link
                        href="/accounts"
                        className="text-[9px] font-mono text-accent-terracotta font-bold hover:underline block"
                      >
                        Re-auth!
                      </Link>
                    )}
                    {ch.status === 'WARNING' && (
                      <span className="text-[9px] font-mono text-semantic-warning font-semibold block">
                        Aspect Error
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Launch & Templates Hub */}
          <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-border-rule">
              <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold">
                ⚡ Quick Launch Studio
              </span>
              <span className="text-[9px] font-mono text-brand-indigo">1-Click</span>
            </div>

            <div className="space-y-2">
              <Link
                href="/create"
                className="flex items-center justify-between p-2.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule rounded-editorial text-xs font-medium transition-colors group"
              >
                <div className="flex items-center gap-2 text-ink-primary">
                  <Bookmark className="w-4 h-4 text-brand-indigo group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-semibold block text-xs">🏢 คอนโดหรูติด BTS (Capital One)</span>
                    <span className="text-[10px] font-mono text-ink-secondary">Pre-filled specs & Story link</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-ink-secondary group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/create"
                className="flex items-center justify-between p-2.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule rounded-editorial text-xs font-medium transition-colors group"
              >
                <div className="flex items-center gap-2 text-ink-primary">
                  <Sparkles className="w-4 h-4 text-brand-indigo group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-semibold block text-xs">✨ คลังภาพสื่อ AI (8K Renders)</span>
                    <span className="text-[10px] font-mono text-ink-secondary">Rama 9, Sky Pool, Penthouse</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-ink-secondary group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/create"
                className="flex items-center justify-between p-2.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule rounded-editorial text-xs font-medium transition-colors group"
              >
                <div className="flex items-center gap-2 text-ink-primary">
                  <Share2 className="w-4 h-4 text-accent-terracotta group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-semibold block text-xs">⚡ Flash Sale 50% Campaign</span>
                    <span className="text-[10px] font-mono text-ink-secondary">Promo copy + CTA stickers</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-ink-secondary group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Export & Audit Desk */}
          <div className="p-4 bg-paper-canvas border border-border-rule rounded-card space-y-2.5">
            <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold block">
              📊 Export & Audit Reports
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportErrorLog}
                className="p-2 bg-paper-raised hover:bg-accent-terracotta/10 text-accent-terracotta border border-accent-terracotta/30 rounded text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Error Log CSV</span>
              </button>
              <button
                type="button"
                onClick={handleExportAllJobs}
                className="p-2 bg-paper-raised hover:bg-paper-subtle text-ink-primary border border-border-rule rounded text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3 h-3 text-ink-secondary" />
                <span>All Dispatches</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
