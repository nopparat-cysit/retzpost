'use client';

import React, { useState } from 'react';
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
  Play,
  Copy,
  Globe
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
import { StatusTag } from '@/components/ui/status-tag';
import { 
  SocialPlatformIcon, 
  WebsiteLogo 
} from '@/components/ui/social-icons';

interface ContentChannel {
  platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
  status: string;
  detail?: string;
  liveUrl?: string;
}

interface ContentItem {
  id: string;
  workingTitle: string;
  status: 'DRAFT' | 'READY' | 'PUBLISHED' | 'PARTIALLY_PUBLISHED' | 'FAILED';
  assetId?: string;
  duration?: string;
  aspectRatio?: string;
  resolution?: string;
  sizeMb?: string;
  channels: ContentChannel[];
  dateText: string;
  actionLabel: string;
  actionHref: string;
  liveUrl?: string;
  websiteUrl?: string;
}

const DEFAULT_SAMPLE_ITEMS: ContentItem[] = [
  {
    id: 'sample-c1-rich-rama9',
    workingTitle: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
    status: 'PUBLISHED',
    assetId: 'C1-89501',
    duration: 'Photo Album',
    aspectRatio: '1:1 / 9:16',
    resolution: '1080x1080 / 1080x1920',
    sizeMb: '34.2 MB',
    channels: [
      { 
        platform: 'FACEBOOK', 
        status: 'PUBLISHED', 
        detail: 'Capital One Thailand Album (6)', 
        liveUrl: 'https://www.facebook.com/capitalonethailand/posts/991283' 
      },
      { 
        platform: 'INSTAGRAM', 
        status: 'PUBLISHED', 
        detail: 'IG Carousel & 24h Story', 
        liveUrl: 'https://www.instagram.com/p/C1RichRama9/' 
      },
    ],
    dateText: 'Today 08:30 AM',
    actionLabel: 'Edit Adaptations',
    actionHref: '/create?id=sample-c1-rich-rama9',
    liveUrl: 'https://www.facebook.com/capitalonethailand/posts/991283',
    websiteUrl: 'https://capitalone.co.th/the-rich-rama9',
  },
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
      { 
        platform: 'YOUTUBE', 
        status: 'PUBLISHED', 
        detail: 'Shorts: 09:15 AM', 
        liveUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ' 
      },
      { 
        platform: 'INSTAGRAM', 
        status: 'PUBLISHED', 
        detail: 'IG Feed & 24h Story', 
        liveUrl: 'https://www.instagram.com/p/example-carousel' 
      },
      { 
        platform: 'TIKTOK', 
        status: 'FAILED_RETRYABLE', 
        detail: 'Audio Limit Exceeded (46s)' 
      },
    ],
    dateText: 'Today 09:15 AM',
    actionLabel: 'Resolve & Retry',
    actionHref: '/create?id=sample-1',
    liveUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ',
    websiteUrl: 'https://alexrivera.studio/redesign-tour',
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
      { 
        platform: 'YOUTUBE', 
        status: 'PUBLISHED', 
        detail: '14.8k views', 
        liveUrl: 'https://youtu.be/dQw4w9WgXcQ' 
      },
      { 
        platform: 'FACEBOOK', 
        status: 'PUBLISHED', 
        detail: 'Page Video', 
        liveUrl: 'https://www.facebook.com/retzpost/posts/202610' 
      },
    ],
    dateText: '2 days ago',
    actionLabel: 'View Analytics',
    actionHref: '/content/sample-3',
    liveUrl: 'https://youtu.be/dQw4w9WgXcQ',
    websiteUrl: 'https://retzpost.io/whats-new',
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

  const filteredItems = items.filter((item) => {
    if (activeTab === 'PUBLISHED' && !['PUBLISHED', 'PARTIALLY_PUBLISHED'].includes(item.status)) return false;
    if (activeTab === 'SCHEDULED' && item.status !== 'READY') return false;
    if (activeTab === 'DRAFTS' && item.status !== 'DRAFT') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.workingTitle.toLowerCase().includes(q) || (item.assetId && item.assetId.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Masthead
        folio="ARCHIVE INDEX / DISPATCH LEDGER"
        editionDate="VOL. 24"
        title="Content Archive & Dispatches"
        subtitle="Curated master assets, multi-platform adaptations, and direct links to view live posts on social media."
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
              className={`px-3 py-1.5 rounded-editorial transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-paper-raised text-brand-indigo font-bold border border-border-rule shadow-xs'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
              }`}
            >
              {tab === 'ALL' ? `All Works (${items.length})` : tab}
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
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-paper-raised border border-border-rule rounded-editorial placeholder:text-ink-secondary focus:outline-none focus:border-brand-indigo font-mono"
          />
        </div>
      </div>

      {/* Editorial Ledger List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
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
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] font-mono text-ink-secondary">
                <span>{item.assetId}</span>
                <span>•</span>
                <span>{item.resolution}</span>
                <span>•</span>
                <span>{item.sizeMb}</span>
                <span>•</span>
                <span>{item.dateText}</span>
              </div>

              <h2 className="font-serif font-medium text-base text-ink-primary truncate">
                {item.workingTitle}
              </h2>

              {/* Channels with Direct Live Links */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {item.channels.map((ch, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 font-mono text-[11px] bg-paper-canvas px-2.5 py-1 rounded border border-border-rule shadow-2xs">
                    <SocialPlatformIcon platform={ch.platform} size={15} />
                    <span className="font-semibold text-ink-primary">{ch.platform}:</span>
                    <span className="text-ink-secondary">{ch.detail}</span>
                    {ch.liveUrl && (
                      <a
                        href={ch.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 text-brand-indigo hover:underline font-bold ml-1 cursor-pointer"
                        title={`เปิดดูโพสต์จริงบน ${ch.platform}`}
                      >
                        <span>Live</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                ))}

                {item.websiteUrl && (
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded border border-emerald-200 hover:underline font-medium cursor-pointer shadow-2xs"
                  >
                    <WebsiteLogo size={14} />
                    <span>เว็บโครงการ</span>
                    <ExternalLink className="w-2.5 h-2.5 text-emerald-700" />
                  </a>
                )}
              </div>
            </div>

            {/* Right Action & Status */}
            <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
              <StatusTag status={item.status} />

              {item.liveUrl ? (
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-indigo text-white hover:bg-brand-indigo-hover text-xs font-mono font-semibold rounded-editorial shadow-2xs transition-colors cursor-pointer"
                >
                  <span>เปิดดูโพสต์จริง</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link
                  href={item.actionHref}
                  className="px-3 py-1.5 bg-paper-subtle hover:bg-paper-canvas text-ink-primary text-xs font-medium rounded-editorial border border-border-rule transition-colors"
                >
                  {item.actionLabel}
                </Link>
              )}

              <button className="p-1.5 text-ink-secondary hover:text-ink-primary cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
