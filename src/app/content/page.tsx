'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Video, 
  ExternalLink, 
  MoreVertical, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Play
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
import { StatusTag } from '@/components/ui/status-tag';

interface ContentItem {
  id: string;
  workingTitle: string;
  status: 'DRAFT' | 'READY' | 'PUBLISHED' | 'PARTIALLY_PUBLISHED' | 'FAILED';
  assetId?: string;
  duration?: string;
  aspectRatio?: string;
  resolution?: string;
  sizeMb?: string;
  channels: {
    platform: 'YOUTUBE' | 'TIKTOK';
    status: string;
    detail?: string;
  }[];
  dateText: string;
  actionLabel: string;
  actionHref: string;
}

const DEFAULT_SAMPLE_ITEMS: ContentItem[] = [
  {
    id: 'sample-1',
    workingTitle: 'Behind the Scenes: Studio Redesign Tour',
    status: 'PARTIALLY_PUBLISHED',
    assetId: 'MP-89209',
    duration: '00:58',
    aspectRatio: '9:16',
    resolution: '1080x1920',
    sizeMb: '69.2 MB',
    channels: [
      { platform: 'YOUTUBE', status: 'PUBLISHED', detail: 'Shorts: 09:15 AM' },
      { platform: 'TIKTOK', status: 'FAILED_RETRYABLE', detail: 'Audio Limit Exceeded (46s)' },
    ],
    dateText: 'Today 09:15 AM',
    actionLabel: 'Resolve & Retry',
    actionHref: '/create?id=sample-1',
  },
  {
    id: 'sample-2',
    workingTitle: '3 Hooks That Stop the Scroll in 2026',
    status: 'READY',
    assetId: 'MP-88174',
    duration: '00:45',
    aspectRatio: '9:16',
    resolution: '1080x1920',
    sizeMb: '38.4 MB',
    channels: [
      { platform: 'YOUTUBE', status: 'SCHEDULED', detail: 'Tomorrow 09:00 AM' },
      { platform: 'TIKTOK', status: 'SCHEDULED', detail: 'Tomorrow 09:00 AM' },
    ],
    dateText: 'Tomorrow 09:00 AM',
    actionLabel: 'Edit Cadence',
    actionHref: '/create?id=sample-2',
  },
  {
    id: 'sample-3',
    workingTitle: 'SaaS Launch Breakdown — Zero to $100k ARR',
    status: 'PUBLISHED',
    assetId: 'MP-87902',
    duration: '04:12',
    aspectRatio: '16:9',
    resolution: '1920x1080',
    sizeMb: '142 MB',
    channels: [
      { platform: 'YOUTUBE', status: 'PUBLISHED', detail: '14.8k views' },
    ],
    dateText: '2 days ago',
    actionLabel: 'View Analytics',
    actionHref: '/content/sample-3',
  },
  {
    id: 'sample-4',
    workingTitle: 'Q4 Product Roadmap Livestream Announcement',
    status: 'DRAFT',
    assetId: 'MP-86390',
    duration: '00:30',
    aspectRatio: '9:16',
    resolution: '1080x1920',
    sizeMb: '24 MB',
    channels: [],
    dateText: 'Edited 3h ago',
    actionLabel: 'Complete Post',
    actionHref: '/create?id=sample-4',
  },
];

export default function ContentLibraryPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PUBLISHED' | 'SCHEDULED' | 'DRAFTS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ContentItem[]>(DEFAULT_SAMPLE_ITEMS);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="ARCHIVE INDEX / DISPATCH LEDGER"
        editionDate="VOL. 24"
        title="Content Archive & Dispatches"
        subtitle="Curated master video assets, multi-platform adaptations, and synchronized syndication records."
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-indigo text-white text-xs font-semibold rounded-editorial hover:bg-brand-indigo-hover transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </Link>
          </div>
        }
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 p-3 bg-paper-raised border border-border-rule rounded-card text-xs">
        <div>
          <span className="text-ink-secondary text-[10px] uppercase font-mono">Total Works</span>
          <p className="font-serif font-bold text-lg text-ink-primary">24</p>
        </div>
        <div>
          <span className="text-ink-secondary text-[10px] uppercase font-mono">Synchronized</span>
          <p className="font-serif font-bold text-lg text-semantic-success">18</p>
        </div>
        <div>
          <span className="text-ink-secondary text-[10px] uppercase font-mono">Scheduled</span>
          <p className="font-serif font-bold text-lg text-brand-indigo">4</p>
        </div>
        <div>
          <span className="text-ink-secondary text-[10px] uppercase font-mono">In Pipeline</span>
          <p className="font-serif font-bold text-lg text-ink-primary">1</p>
        </div>
        <div>
          <span className="text-ink-secondary text-[10px] uppercase font-mono text-semantic-warning">
            Attention Needed
          </span>
          <p className="font-serif font-bold text-lg text-semantic-warning">1 Failure</p>
        </div>
      </div>

      {/* Tab Filter & Search Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-5 pb-3 border-b border-border-rule">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          {(['ALL', 'PUBLISHED', 'SCHEDULED', 'DRAFTS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-editorial transition-colors ${
                activeTab === tab
                  ? 'bg-paper-raised text-brand-indigo font-bold border border-border-rule shadow-xs'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
              }`}
            >
              {tab === 'ALL' ? 'All Works (24)' : tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-ink-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search headlines, asset IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-paper-raised border border-border-rule rounded-editorial placeholder:text-ink-secondary focus:outline-none focus:border-brand-indigo"
          />
        </div>
      </div>

      {/* Editorial Ledger List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-paper-raised border border-border-rule rounded-card p-4 hover:border-brand-indigo/40 transition-colors flex flex-col md:flex-row items-start md:items-center gap-4"
          >
            {/* Thumbnail Mock / Player Box */}
            <div className="relative w-28 h-20 bg-paper-subtle border border-border-rule rounded-editorial shrink-0 flex items-center justify-center overflow-hidden group">
              <div className="w-8 h-8 rounded-full bg-paper-raised/80 flex items-center justify-center shadow-xs">
                <Play className="w-4 h-4 text-ink-primary ml-0.5" />
              </div>
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-ink-primary/80 text-white text-[9px] font-mono rounded">
                {item.duration || '00:00'}
              </span>
              <span className="absolute top-1 left-1 px-1 py-0.5 bg-paper-raised/90 text-ink-primary text-[9px] font-mono rounded">
                {item.aspectRatio || '9:16'}
              </span>
            </div>

            {/* Middle Info & Channels */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-mono text-ink-secondary mb-1">
                <span>{item.assetId}</span>
                <span>•</span>
                <span>{item.resolution}</span>
                <span>•</span>
                <span>{item.sizeMb}</span>
              </div>

              <h2 className="font-serif font-medium text-base text-ink-primary truncate mb-2">
                {item.workingTitle}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                {item.channels.map((ch, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 font-mono text-[11px] text-ink-secondary">
                    <span className="font-semibold text-ink-primary">{ch.platform}:</span>
                    <span>{ch.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Action & Status */}
            <div className="flex items-center gap-3 self-end md:self-center shrink-0">
              <StatusTag status={item.status} />

              <Link
                href={item.actionHref}
                className="px-3 py-1.5 bg-paper-subtle hover:bg-paper-canvas text-ink-primary text-xs font-medium rounded-editorial border border-border-rule transition-colors"
              >
                {item.actionLabel}
              </Link>

              <button className="p-1.5 text-ink-secondary hover:text-ink-primary">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
