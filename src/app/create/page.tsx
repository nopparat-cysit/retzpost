'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Film, 
  Camera, 
  FileText,
  Video, 
  Image as ImageIcon,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  Smartphone,
  LayoutGrid,
  Link2,
  Lock,
  Info,
  Search,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';

type MediaTypeMode = 'PHOTOS' | 'VIDEO' | 'TEXT_ONLY';

interface DestinationAccount {
  id: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK' | 'THREADS' | 'TWITTER';
  platformGroup: 'Instagram' | 'Facebook' | 'YouTube' | 'TikTok' | 'Other';
  name: string;
  handle: string;
  badge: string; // e.g., 'Personal', 'Brand Studio', 'Clips & Shorts', 'Community'
  avatarBg: string;
  avatarText: string;
  capabilities: {
    feed: { supported: boolean; label: string };
    story: { supported: boolean; label: string };
    reel: { supported: boolean; label: string };
  };
}

// Multi-Channel Dataset: Demonstrates multiple channels per platform
const CONNECTED_ACCOUNTS: DestinationAccount[] = [
  // 1. Instagram: 2 Accounts
  {
    id: 'ig_personal',
    platform: 'INSTAGRAM',
    platformGroup: 'Instagram',
    name: 'Alex Rivera (Personal)',
    handle: '@alexrivera_official',
    badge: 'Personal',
    avatarBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    avatarText: 'IG',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'ig_brand',
    platform: 'INSTAGRAM',
    platformGroup: 'Instagram',
    name: 'RetzPost HQ (Brand Studio)',
    handle: '@retzpost_app',
    badge: 'Brand Studio',
    avatarBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    avatarText: 'IG',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },

  // 2. Facebook: 3 Pages
  {
    id: 'fb_personal',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'Alex Rivera Media Studio',
    handle: 'Alex Rivera Studio',
    badge: 'Creator Page',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'fb_brand',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'RetzPost Official Page',
    handle: 'RetzPost Multi-Publishing',
    badge: 'Product Page',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'fb_community',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'Tech & Creator Thailand',
    handle: 'Tech Creators Club TH',
    badge: 'Community Page',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },

  // 3. YouTube: 2 Channels
  {
    id: 'yt_main',
    platform: 'YOUTUBE',
    platformGroup: 'YouTube',
    name: 'Alex Rivera Studio (Main)',
    handle: '@AlexRiveraStudio',
    badge: 'Main Channel',
    avatarBg: 'bg-[#FF0000]',
    avatarText: 'YT',
    capabilities: {
      feed: { supported: false, label: '—' },
      story: { supported: false, label: '—' },
      reel: { supported: true, label: 'Shorts' },
    },
  },
  {
    id: 'yt_shorts',
    platform: 'YOUTUBE',
    platformGroup: 'YouTube',
    name: 'Alex Clips & Highlights',
    handle: '@AlexClips',
    badge: 'Clips & Shorts',
    avatarBg: 'bg-[#FF0000]',
    avatarText: 'YT',
    capabilities: {
      feed: { supported: false, label: '—' },
      story: { supported: false, label: '—' },
      reel: { supported: true, label: 'Shorts' },
    },
  },

  // 4. TikTok: 2 Accounts
  {
    id: 'tt_personal',
    platform: 'TIKTOK',
    platformGroup: 'TikTok',
    name: 'Alex Rivera (Personal)',
    handle: '@alexrivera_official',
    badge: 'Personal',
    avatarBg: 'bg-ink-primary',
    avatarText: 'TT',
    capabilities: {
      feed: { supported: true, label: 'Photos' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Video' },
    },
  },
  {
    id: 'tt_brand',
    platform: 'TIKTOK',
    platformGroup: 'TikTok',
    name: 'RetzPost Quick Tips',
    handle: '@retzpost_clips',
    badge: 'Brand Clips',
    avatarBg: 'bg-ink-primary',
    avatarText: 'TT',
    capabilities: {
      feed: { supported: true, label: 'Photos' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Video' },
    },
  },

  // 5. Threads & X: 2 Accounts
  {
    id: 'th_personal',
    platform: 'THREADS',
    platformGroup: 'Other',
    name: 'Alex Rivera on Threads',
    handle: '@alexrivera',
    badge: 'Personal',
    avatarBg: 'bg-black',
    avatarText: 'TH',
    capabilities: {
      feed: { supported: true, label: 'Post' },
      story: { supported: false, label: '—' },
      reel: { supported: false, label: '—' },
    },
  },
  {
    id: 'x_personal',
    platform: 'TWITTER',
    platformGroup: 'Other',
    name: 'Alex Rivera on X',
    handle: '@alexrivera',
    badge: 'Personal',
    avatarBg: 'bg-[#0f1419]',
    avatarText: '𝕏',
    capabilities: {
      feed: { supported: true, label: 'Tweet' },
      story: { supported: false, label: '—' },
      reel: { supported: false, label: '—' },
    },
  },
];

export default function CreatePostPage() {
  // Master Media Ingestion Mode
  const [mediaMode, setMediaMode] = useState<MediaTypeMode>('PHOTOS');

  // Search & Filter State for Channels
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<'ALL' | 'Instagram' | 'Facebook' | 'YouTube' | 'TikTok' | 'Other'>('ALL');

  // Sample Photos
  const [images, setImages] = useState<Array<{ id: string; name: string; size: string }>>([
    { id: 'img-1', name: 'editorial_hero_cover_01.jpg', size: '3.8 MB' },
    { id: 'img-2', name: 'diagram_architecture_flow_02.png', size: '2.4 MB' },
  ]);

  // Sample Video
  const [videoAsset, setVideoAsset] = useState({
    name: 'teaser_multi_format_architecture_9x16.mp4',
    size: '42.6 MB',
    duration: '00:48',
    resolution: '1080x1920 (9:16 Vertical)',
  });

  // Placements State Dictionary: [accountId_format]: boolean
  const [placements, setPlacements] = useState<Record<string, boolean>>({
    'ig_personal_feed': true,
    'ig_personal_story': true,
    'ig_brand_feed': false,
    'fb_personal_feed': true,
    'fb_brand_feed': true,
    'fb_brand_story': false,
    'fb_community_feed': false,
    'yt_main_reel': false,
    'yt_shorts_reel': false,
    'tt_personal_feed': false,
    'tt_brand_feed': false,
    'th_personal_feed': false,
    'x_personal_feed': false,
  });

  // Content Fields
  const [workingTitle, setWorkingTitle] = useState('Omni-Format Publishing: Simultaneous Feed, Story & Reels');
  const [sharedCaption, setSharedCaption] = useState(
    'Architecture over aesthetics. In this issue we break down our modular publishing pipeline designed for simultaneous Feed Posts, 24h Stories, and Reels/Shorts.\n\nSwipe to explore the full stack diagrams.'
  );
  const [sharedTags, setSharedTags] = useState('architecture, publishing, tech, design-system');
  const [storyLinkUrl, setStoryLinkUrl] = useState('https://retzpost.com/announcement');

  // Preview Mode in Right Rail
  const [previewTab, setPreviewTab] = useState<'FEED' | 'STORY' | 'REEL'>('FEED');

  // Cadence
  const [publishMode, setPublishMode] = useState<'NOW' | 'SCHEDULED'>('NOW');
  const [scheduledDate, setScheduledDate] = useState('2026-10-24');
  const [scheduledTime, setScheduledTime] = useState('09:15');

  // Smart Validation Helper
  const getFormatValidation = (format: 'feed' | 'story' | 'reel', account: DestinationAccount) => {
    const capability = account.capabilities[format];
    if (!capability.supported) {
      return { eligible: false, reason: 'Platform API does not support this format' };
    }

    if (format === 'reel') {
      if (mediaMode !== 'VIDEO') {
        return { eligible: false, reason: 'Requires MP4/MOV video asset (9:16 vertical)' };
      }
      return { eligible: true };
    }

    if (format === 'story') {
      if (mediaMode === 'TEXT_ONLY') {
        return { eligible: false, reason: '24h Stories require visual photo or video' };
      }
      return { eligible: true };
    }

    if (format === 'feed') {
      if (mediaMode === 'TEXT_ONLY' && account.platform === 'INSTAGRAM') {
        return { eligible: false, reason: 'Instagram feed requires image or video' };
      }
      return { eligible: true };
    }

    return { eligible: true };
  };

  // Toggle Single Placement
  const togglePlacement = (accountId: string, format: 'feed' | 'story' | 'reel', account: DestinationAccount) => {
    const val = getFormatValidation(format, account);
    if (!val.eligible) return; // Block invalid action

    const key = `${accountId}_${format}`;
    setPlacements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Bulk Column Toggles with Smart Validation
  const toggleAllForFormat = (format: 'feed' | 'story' | 'reel') => {
    const eligibleAccounts = filteredAccounts.filter(
      (acc) => getFormatValidation(format, acc).eligible
    );
    if (eligibleAccounts.length === 0) return;

    const areAllSelected = eligibleAccounts.every(
      (acc) => placements[`${acc.id}_${format}`]
    );

    setPlacements((prev) => {
      const next = { ...prev };
      eligibleAccounts.forEach((acc) => {
        next[`${acc.id}_${format}`] = !areAllSelected;
      });
      return next;
    });
  };

  // Toggle All Valid Placements for an Entire Platform Group (e.g., all 3 Facebook Pages)
  const togglePlatformGroup = (group: string) => {
    const groupAccounts = CONNECTED_ACCOUNTS.filter((acc) => acc.platformGroup === group);
    
    // Check if all eligible placements in this group are currently selected
    let allSelected = true;
    groupAccounts.forEach((acc) => {
      (['feed', 'story', 'reel'] as const).forEach((fmt) => {
        if (getFormatValidation(fmt, acc).eligible && !placements[`${acc.id}_${fmt}`]) {
          allSelected = false;
        }
      });
    });

    setPlacements((prev) => {
      const next = { ...prev };
      groupAccounts.forEach((acc) => {
        (['feed', 'story', 'reel'] as const).forEach((fmt) => {
          if (getFormatValidation(fmt, acc).eligible) {
            next[`${acc.id}_${fmt}`] = !allSelected;
          }
        });
      });
      return next;
    });
  };

  // Filtered Accounts by search & group
  const filteredAccounts = useMemo(() => {
    return CONNECTED_ACCOUNTS.filter((acc) => {
      const matchesGroup = selectedGroupFilter === 'ALL' || acc.platformGroup === selectedGroupFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || acc.name.toLowerCase().includes(q) || acc.handle.toLowerCase().includes(q) || acc.badge.toLowerCase().includes(q);
      return matchesGroup && matchesSearch;
    });
  }, [searchQuery, selectedGroupFilter]);

  // Group accounts by platformGroup for presentation
  const groupedAccounts = useMemo(() => {
    const map = new Map<string, DestinationAccount[]>();
    filteredAccounts.forEach((acc) => {
      const list = map.get(acc.platformGroup) || [];
      list.push(acc);
      map.set(acc.platformGroup, list);
    });
    return map;
  }, [filteredAccounts]);

  // Active counts
  const totalActivePlacements = Object.entries(placements).filter(([key, val]) => {
    if (!val) return false;
    const [accId, format] = key.split('_') as [string, 'feed' | 'story' | 'reel'];
    const acc = CONNECTED_ACCOUNTS.find((a) => a.id === accId);
    if (!acc) return false;
    return getFormatValidation(format, acc).eligible;
  }).length;

  const isAnyStoryActive = CONNECTED_ACCOUNTS.some((acc) => {
    const val = getFormatValidation('story', acc);
    return val.eligible && placements[`${acc.id}_story`];
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="COMPOSER / DISPATCH DESK"
        editionDate="MULTI-PLACEMENT STUDIO"
        title="Universal Content Composer"
        subtitle="Manage multiple channels per platform. Publish simultaneously across Feed, Stories, and Reels with smart validation."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-brand-indigo font-semibold px-2.5 py-1 bg-brand-indigo/10 rounded-editorial border border-brand-indigo/20">
              {totalActivePlacements} Active Placements
            </span>
          </div>
        }
      />

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Main Form) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 01: MASTER MEDIA INTAKE & SMART TYPE SWITCHER */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 01]</span>
                <h2 className="font-serif font-medium text-base text-ink-primary">
                  Master Media Asset & Validation Ingestion
                </h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">
                Auto-validates destinations
              </span>
            </div>

            {/* Media Type Selector Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-paper-subtle border border-border-rule rounded-editorial mb-4">
              <button
                type="button"
                onClick={() => {
                  setMediaMode('PHOTOS');
                  if (previewTab === 'REEL') setPreviewTab('FEED');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded transition-colors ${
                  mediaMode === 'PHOTOS'
                    ? 'bg-paper-canvas text-brand-indigo shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photos / Carousel ({images.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaMode('VIDEO');
                  setPreviewTab('REEL');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded transition-colors ${
                  mediaMode === 'VIDEO'
                    ? 'bg-paper-canvas text-semantic-info shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Vertical Video / Reel (9:16)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaMode('TEXT_ONLY');
                  setPreviewTab('FEED');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded transition-colors ${
                  mediaMode === 'TEXT_ONLY'
                    ? 'bg-paper-canvas text-ink-primary shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Text Status Only</span>
              </button>
            </div>

            {/* MODE A: PHOTOS GALLERY */}
            {mediaMode === 'PHOTOS' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className="relative aspect-square bg-paper-subtle border border-border-rule rounded-editorial p-2 flex flex-col justify-between group overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-5 h-5 rounded-full bg-brand-indigo text-white flex items-center justify-center font-mono text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <button
                          onClick={() => setImages(images.filter((i) => i.id !== img.id))}
                          className="p-1 text-ink-secondary hover:text-semantic-error opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-center my-auto">
                        <ImageIcon className="w-6 h-6 text-brand-indigo mx-auto opacity-70 mb-1" />
                        <p className="text-[10px] font-mono text-ink-secondary truncate">{img.name}</p>
                      </div>
                      <span className="text-[9px] font-mono text-ink-secondary">{img.size}</span>
                    </div>
                  ))}

                  {images.length < 10 && (
                    <div className="aspect-square border-2 border-dashed border-border-rule rounded-editorial flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-brand-indigo/60 transition-colors bg-paper-canvas/40">
                      <Plus className="w-5 h-5 text-brand-indigo mb-1" />
                      <span className="text-xs font-serif font-medium text-ink-primary">Add Visual</span>
                      <span className="text-[10px] font-mono text-ink-secondary">JPG, PNG (Carousel)</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-mono text-brand-indigo">
                  ✓ Photo carousel validated for Feed & Stories (Reels column disabled below).
                </p>
              </div>
            )}

            {/* MODE B: VIDEO ASSET */}
            {mediaMode === 'VIDEO' && (
              <div className="p-4 bg-paper-canvas border border-border-rule rounded-editorial flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-editorial bg-semantic-info/10 text-semantic-info flex items-center justify-center shrink-0 border border-semantic-info/20">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-ink-primary font-mono">{videoAsset.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-ink-secondary mt-0.5">
                      <span className="text-semantic-success font-semibold">{videoAsset.resolution}</span>
                      <span>•</span>
                      <span>{videoAsset.duration}</span>
                      <span>•</span>
                      <span>{videoAsset.size}</span>
                    </div>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded bg-semantic-success/10 text-semantic-success border border-semantic-success/20 text-[10px] font-mono font-semibold">
                  ✓ Ready for Reels & Shorts
                </div>
              </div>
            )}

            {/* MODE C: TEXT STATUS */}
            {mediaMode === 'TEXT_ONLY' && (
              <div className="p-4 bg-paper-canvas border border-border-rule rounded-editorial flex items-center gap-3">
                <div className="w-10 h-10 rounded-editorial bg-paper-subtle text-ink-secondary flex items-center justify-center shrink-0 border border-border-rule">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-ink-primary">Text-Only Status Dispatch</h3>
                  <p className="text-[11px] text-ink-secondary">
                    Eligible for Facebook Page status, Threads, and X/Twitter. (Visual Story & Reels disabled).
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 02: OMNI-PLACEMENT MATRIX WITH MULTI-CHANNEL SCALING */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 02]</span>
                <h2 className="font-serif font-medium text-base text-ink-primary">
                  Multi-Channel Placement Matrix ({CONNECTED_ACCOUNTS.length} Connected Channels)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">
                Multiple accounts per platform supported
              </span>
            </div>

            {/* Search & Platform Filter Tabs */}
            <div className="space-y-2.5 mb-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-ink-secondary absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter channels by name, handle, or badge (e.g. 'Personal', 'Brand', '@AlexClips')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-paper-canvas border border-border-rule rounded-editorial font-mono text-ink-primary placeholder:text-ink-secondary/50 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              {/* Platform Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {(['ALL', 'Instagram', 'Facebook', 'YouTube', 'TikTok', 'Other'] as const).map((grp) => {
                  const count = grp === 'ALL' 
                    ? CONNECTED_ACCOUNTS.length 
                    : CONNECTED_ACCOUNTS.filter(a => a.platformGroup === grp).length;
                  
                  return (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setSelectedGroupFilter(grp)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        selectedGroupFilter === grp
                          ? 'bg-ink-primary text-white font-semibold'
                          : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                      }`}
                    >
                      {grp === 'ALL' ? 'All Channels' : grp} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Column Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-paper-subtle rounded-editorial border border-border-rule mb-3 text-xs">
              <span className="text-[11px] font-mono text-ink-secondary font-medium">
                Quick Column Selectors:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleAllForFormat('feed')}
                  className="px-2.5 py-1 rounded text-[11px] font-mono font-semibold bg-brand-indigo text-white hover:bg-brand-indigo-hover transition-colors shadow-2xs"
                >
                  ⚡ Toggle All Feed
                </button>

                <button
                  type="button"
                  disabled={mediaMode === 'TEXT_ONLY'}
                  onClick={() => toggleAllForFormat('story')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-colors shadow-2xs ${
                    mediaMode !== 'TEXT_ONLY'
                      ? 'bg-accent-terracotta text-white hover:opacity-90'
                      : 'bg-paper-canvas text-ink-secondary/40 border border-border-rule cursor-not-allowed'
                  }`}
                >
                  ⚡ Toggle All Stories
                </button>

                <button
                  type="button"
                  disabled={mediaMode !== 'VIDEO'}
                  onClick={() => toggleAllForFormat('reel')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-colors shadow-2xs ${
                    mediaMode === 'VIDEO'
                      ? 'bg-semantic-info text-white hover:opacity-90'
                      : 'bg-paper-canvas text-ink-secondary/40 border border-border-rule cursor-not-allowed'
                  }`}
                >
                  ⚡ Toggle All Reels
                </button>
              </div>
            </div>

            {/* Matrix Table with Platform Groupings */}
            <div className="overflow-x-auto border border-border-rule rounded-editorial bg-paper-canvas">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-rule bg-paper-subtle/80 text-[11px] font-mono text-ink-secondary">
                    <th className="py-2.5 px-3.5 font-semibold">Channel / Page / Account</th>
                    <th className="py-2.5 px-3 text-center font-semibold">📰 Feed Post</th>
                    <th className="py-2.5 px-3 text-center font-semibold">📱 24h Story</th>
                    <th className="py-2.5 px-3 text-center font-semibold">🎬 Reel / Shorts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-rule text-xs">
                  {Array.from(groupedAccounts.entries()).map(([groupName, accounts]) => (
                    <React.Fragment key={groupName}>
                      {/* Platform Group Subheader with Quick Group Toggle */}
                      <tr className="bg-paper-subtle/60 border-t-2 border-border-rule/80">
                        <td colSpan={4} className="py-2 px-3.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-ink-primary uppercase tracking-wider">
                                {groupName}
                              </span>
                              <span className="text-[10px] font-mono text-ink-secondary bg-paper-canvas px-1.5 py-0.2 rounded border border-border-rule">
                                {accounts.length} {accounts.length > 1 ? 'Channels' : 'Channel'}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => togglePlatformGroup(groupName)}
                              className="text-[10px] font-mono text-brand-indigo hover:underline flex items-center gap-1 font-semibold"
                            >
                              <span>⚡ Toggle All {groupName}</span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Accounts inside this Group */}
                      {accounts.map((acc) => {
                        const feedVal = getFormatValidation('feed', acc);
                        const storyVal = getFormatValidation('story', acc);
                        const reelVal = getFormatValidation('reel', acc);

                        const isFeedActive = feedVal.eligible && placements[`${acc.id}_feed`];
                        const isStoryActive = storyVal.eligible && placements[`${acc.id}_story`];
                        const isReelActive = reelVal.eligible && placements[`${acc.id}_reel`];

                        const isAnyActive = isFeedActive || isStoryActive || isReelActive;

                        return (
                          <tr 
                            key={acc.id} 
                            className={`transition-colors ${
                              isAnyActive ? 'bg-paper-canvas' : 'bg-paper-subtle/20 opacity-70'
                            } hover:bg-paper-subtle/40`}
                          >
                            {/* Channel Details */}
                            <td className="py-2.5 px-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-editorial ${acc.avatarBg} text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-2xs`}>
                                  {acc.avatarText}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-semibold text-xs text-ink-primary leading-tight">{acc.name}</p>
                                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-paper-subtle border border-border-rule text-ink-secondary">
                                      {acc.badge}
                                    </span>
                                  </div>
                                  <p className="text-[10px] font-mono text-ink-secondary">{acc.handle}</p>
                                </div>
                              </div>
                            </td>

                            {/* Column 1: Feed */}
                            <td className="py-2.5 px-3 text-center">
                              {acc.capabilities.feed.supported ? (
                                feedVal.eligible ? (
                                  <button
                                    type="button"
                                    onClick={() => togglePlacement(acc.id, 'feed', acc)}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                                      isFeedActive
                                        ? 'bg-brand-indigo text-white shadow-2xs font-semibold'
                                        : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                                    }`}
                                  >
                                    {isFeedActive ? `✓ ${acc.capabilities.feed.label}` : `+ ${acc.capabilities.feed.label}`}
                                  </button>
                                ) : (
                                  <span 
                                    title={feedVal.reason}
                                    className="inline-flex items-center gap-1 text-[10px] font-mono text-ink-secondary/50 bg-paper-subtle px-2 py-0.5 rounded cursor-not-allowed"
                                  >
                                    <Lock className="w-2.5 h-2.5" />
                                    <span>No Photo</span>
                                  </span>
                                )
                              ) : (
                                <span className="text-[11px] font-mono text-ink-secondary/40">—</span>
                              )}
                            </td>

                            {/* Column 2: Story */}
                            <td className="py-2.5 px-3 text-center">
                              {acc.capabilities.story.supported ? (
                                storyVal.eligible ? (
                                  <button
                                    type="button"
                                    onClick={() => togglePlacement(acc.id, 'story', acc)}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                                      isStoryActive
                                        ? 'bg-accent-terracotta text-white shadow-2xs font-semibold'
                                        : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                                    }`}
                                  >
                                    {isStoryActive ? `✓ ${acc.capabilities.story.label}` : `+ ${acc.capabilities.story.label}`}
                                  </button>
                                ) : (
                                  <span 
                                    title={storyVal.reason}
                                    className="inline-flex items-center gap-1 text-[10px] font-mono text-ink-secondary/50 bg-paper-subtle px-2 py-0.5 rounded cursor-not-allowed"
                                  >
                                    <Lock className="w-2.5 h-2.5" />
                                    <span>No Media</span>
                                  </span>
                                )
                              ) : (
                                <span className="text-[11px] font-mono text-ink-secondary/40">—</span>
                              )}
                            </td>

                            {/* Column 3: Reels & Shorts */}
                            <td className="py-2.5 px-3 text-center">
                              {acc.capabilities.reel.supported ? (
                                reelVal.eligible ? (
                                  <button
                                    type="button"
                                    onClick={() => togglePlacement(acc.id, 'reel', acc)}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                                      isReelActive
                                        ? 'bg-semantic-info text-white shadow-2xs font-semibold'
                                        : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                                    }`}
                                  >
                                    {isReelActive ? `✓ ${acc.capabilities.reel.label}` : `+ ${acc.capabilities.reel.label}`}
                                  </button>
                                ) : (
                                  <span 
                                    title={reelVal.reason}
                                    className="inline-flex items-center gap-1 text-[10px] font-mono text-ink-secondary/50 bg-paper-subtle px-2 py-0.5 rounded cursor-not-allowed"
                                  >
                                    <Lock className="w-2.5 h-2.5" />
                                    <span>Video Req.</span>
                                  </span>
                                )
                              ) : (
                                <span className="text-[11px] font-mono text-ink-secondary/40">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}

                  {filteredAccounts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs font-mono text-ink-secondary">
                        No channels match &quot;{searchQuery}&quot;. Try clearing your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-[10px] font-mono text-ink-secondary mt-2 flex items-center gap-1.5">
              <Info className="w-3 h-3 text-brand-indigo shrink-0" />
              <span>
                Select specific channels individually, or use &quot;Toggle All [Platform]&quot; to control multiple pages simultaneously.
              </span>
            </p>
          </section>

          {/* SECTION 03: POST COPY & NARRATIVE */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 03]</span>
                <h2 className="font-serif font-medium text-base text-ink-primary">Post Copy & Narrative</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">
                {sharedCaption.length} characters
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                  Master Headline / Working Title
                </label>
                <input
                  type="text"
                  value={workingTitle}
                  onChange={(e) => setWorkingTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-medium focus:outline-none focus:border-brand-indigo"
                  placeholder="e.g. Product Launch: Universal Publishing Release"
                />
              </div>

              <div>
                <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                  Master Caption / Copy
                </label>
                <textarea
                  rows={4}
                  value={sharedCaption}
                  onChange={(e) => setSharedCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary focus:outline-none focus:border-brand-indigo leading-relaxed font-sans"
                  placeholder="Compose your post text here..."
                />
              </div>

              <div>
                <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={sharedTags}
                  onChange={(e) => setSharedTags(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono focus:outline-none focus:border-brand-indigo"
                  placeholder="comma separated tags"
                />
              </div>

              {/* Contextual Story Link Field */}
              {isAnyStoryActive && (
                <div className="pt-3 border-t border-border-rule/80">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Link2 className="w-3.5 h-3.5 text-accent-terracotta" />
                    <label className="text-[11px] font-mono uppercase font-semibold text-accent-terracotta">
                      Story Interactive Link Sticker (Instagram & Facebook Stories)
                    </label>
                  </div>
                  <input
                    type="url"
                    value={storyLinkUrl}
                    onChange={(e) => setStoryLinkUrl(e.target.value)}
                    placeholder="https://yourbrand.com/landing-page"
                    className="w-full px-3 py-2 bg-paper-canvas border border-accent-terracotta/40 rounded-editorial font-mono text-ink-primary focus:outline-none focus:border-accent-terracotta text-xs"
                  />
                  <p className="text-[10px] text-ink-secondary mt-1">
                    Direct tap link sticker rendered on your 24h vertical Story screen.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 04: CADENCE */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 04]</span>
                <h2 className="font-serif font-medium text-base text-ink-primary">Publishing Cadence</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">Timezone: Asia/Bangkok (UTC+7)</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPublishMode('NOW')}
                className={`flex-1 py-2 text-xs font-medium rounded-editorial border transition-colors ${
                  publishMode === 'NOW'
                    ? 'bg-brand-indigo text-white border-brand-indigo font-semibold shadow-2xs'
                    : 'bg-paper-subtle text-ink-secondary border-border-rule hover:text-ink-primary'
                }`}
              >
                Publish Immediately
              </button>
              <button
                type="button"
                onClick={() => setPublishMode('SCHEDULED')}
                className={`flex-1 py-2 text-xs font-medium rounded-editorial border transition-colors ${
                  publishMode === 'SCHEDULED'
                    ? 'bg-brand-indigo text-white border-brand-indigo font-semibold shadow-2xs'
                    : 'bg-paper-subtle text-ink-secondary border-border-rule hover:text-ink-primary'
                }`}
              >
                Schedule Dispatch
              </button>
            </div>

            {publishMode === 'SCHEDULED' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">Target Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono focus:outline-none focus:border-brand-indigo"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">Target Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono focus:outline-none focus:border-brand-indigo"
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Pre-Flight Review & Live Multi-Format Preview */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-rule">
              <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 05] Pre-Flight Desk</span>
              <span className="text-[10px] font-mono text-semantic-success flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validation Passed</span>
              </span>
            </div>

            {/* Preview Switcher Tabs */}
            <div className="flex items-center p-1 bg-paper-subtle border border-border-rule rounded-editorial mb-4">
              <button
                type="button"
                onClick={() => setPreviewTab('FEED')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded transition-colors ${
                  previewTab === 'FEED'
                    ? 'bg-paper-canvas text-brand-indigo shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Feed</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('STORY')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded transition-colors ${
                  previewTab === 'STORY'
                    ? 'bg-paper-canvas text-accent-terracotta shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Story</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('REEL')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded transition-colors ${
                  previewTab === 'REEL'
                    ? 'bg-paper-canvas text-semantic-info shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Reels/Shorts</span>
              </button>
            </div>

            {/* TAB 1: FEED POST PREVIEW */}
            {previewTab === 'FEED' && (
              <div className="bg-paper-canvas border border-border-rule rounded-editorial overflow-hidden mb-4 shadow-2xs">
                <div className="p-3 flex items-center justify-between border-b border-border-rule/60">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-indigo text-white flex items-center justify-center text-[10px] font-bold">
                      AR
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-ink-primary leading-none">alexrivera_official</p>
                      <p className="text-[9px] font-mono text-ink-secondary">
                        {mediaMode === 'PHOTOS' ? `Feed Post • Carousel (${images.length})` : mediaMode === 'VIDEO' ? 'Video Feed Post' : 'Text Status'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-ink-secondary">•••</span>
                </div>

                <div className="aspect-[4/3] bg-paper-subtle relative flex items-center justify-center border-b border-border-rule/60">
                  {mediaMode === 'PHOTOS' && (
                    <>
                      <ImageIcon className="w-10 h-10 text-brand-indigo/40" />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-ink-primary/75 text-white font-mono text-[9px]">
                        1/{images.length}
                      </span>
                    </>
                  )}
                  {mediaMode === 'VIDEO' && (
                    <div className="text-center">
                      <Film className="w-10 h-10 text-semantic-info/60 mx-auto mb-1" />
                      <span className="text-[10px] font-mono text-ink-secondary">{videoAsset.duration} • 1080p</span>
                    </div>
                  )}
                  {mediaMode === 'TEXT_ONLY' && (
                    <div className="p-4 text-center">
                      <p className="font-serif italic text-sm text-ink-primary line-clamp-3">
                        &quot;{sharedCaption}&quot;
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-3 pt-2 pb-1 flex items-center justify-between text-ink-secondary">
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 hover:text-semantic-error cursor-pointer" />
                    <MessageCircle className="w-4 h-4 cursor-pointer" />
                    <Send className="w-4 h-4 cursor-pointer" />
                  </div>
                  <Bookmark className="w-4 h-4 cursor-pointer" />
                </div>

                <div className="p-3 pt-1 text-xs">
                  <p className="font-semibold text-ink-primary text-xs mb-1 line-clamp-1">
                    {workingTitle}
                  </p>
                  <p className="text-ink-secondary text-[11px] line-clamp-2 leading-relaxed">
                    <span className="font-semibold text-ink-primary mr-1">alexrivera_official</span>
                    {sharedCaption}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: STORY PREVIEW (9:16 VERTICAL PHONE MOCK) */}
            {previewTab === 'STORY' && (
              <div className="w-full max-w-[240px] mx-auto aspect-[9/16] bg-gradient-to-b from-[#2a2d3e] to-[#12131a] rounded-[24px] p-3 text-white flex flex-col justify-between shadow-md relative overflow-hidden mb-4 border border-border-rule">
                <div>
                  <div className="flex gap-1 mb-2">
                    <div className="h-0.5 flex-1 bg-white rounded-full"></div>
                    <div className="h-0.5 flex-1 bg-white/40 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent-terracotta text-white flex items-center justify-center text-[8px] font-bold ring-1 ring-white">
                      AR
                    </div>
                    <span className="text-[10px] font-semibold text-white/90">alexrivera_official</span>
                    <span className="text-[9px] text-white/50">24h</span>
                  </div>
                </div>

                <div className="my-auto text-center px-2">
                  <div className="w-14 h-14 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-2 backdrop-blur-xs">
                    {mediaMode === 'VIDEO' ? <Film className="w-7 h-7 text-white/80" /> : <ImageIcon className="w-7 h-7 text-white/80" />}
                  </div>
                  <p className="text-[11px] font-medium text-white/90 line-clamp-2">
                    {workingTitle}
                  </p>
                </div>

                <div className="space-y-2">
                  {storyLinkUrl ? (
                    <div className="mx-auto w-fit px-3 py-1 bg-white text-ink-primary rounded-full shadow-lg flex items-center gap-1.5">
                      <Link2 className="w-3 h-3 text-brand-indigo" />
                      <span className="text-[10px] font-mono font-bold uppercase truncate max-w-[120px]">
                        {storyLinkUrl.replace(/^https?:\/\//, '')}
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </div>
                  ) : (
                    <div className="text-center text-[9px] font-mono text-white/40">
                      (No Link Sticker Added)
                    </div>
                  )}

                  <div className="h-7 rounded-full border border-white/20 px-3 flex items-center justify-between text-[10px] text-white/40 bg-black/20">
                    <span>Send message...</span>
                    <Heart className="w-3.5 h-3.5 text-white/50" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: REELS / SHORTS PREVIEW */}
            {previewTab === 'REEL' && (
              <div className="w-full max-w-[240px] mx-auto aspect-[9/16] bg-black rounded-[24px] p-3 text-white flex flex-col justify-between shadow-md relative overflow-hidden mb-4 border border-border-rule">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-white/90">Reels / Shorts</span>
                  <span className="font-mono text-semantic-info">00:48</span>
                </div>

                {mediaMode === 'VIDEO' ? (
                  <div className="my-auto text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-semantic-info/20 flex items-center justify-center mb-2 border border-semantic-info/40">
                      <Film className="w-7 h-7 text-semantic-info" />
                    </div>
                    <span className="text-[10px] font-mono text-white/80 bg-black/50 px-2 py-0.5 rounded">
                      1080x1920 (9:16)
                    </span>
                  </div>
                ) : (
                  <div className="my-auto text-center p-3 bg-white/5 rounded-editorial border border-white/10">
                    <Lock className="w-5 h-5 text-semantic-warning mx-auto mb-1" />
                    <p className="text-[10px] text-white/80 font-mono">
                      Reels require video asset. Currently in {mediaMode} mode.
                    </p>
                  </div>
                )}

                <div className="flex items-end justify-between">
                  <div className="space-y-1 max-w-[140px]">
                    <p className="text-[11px] font-bold line-clamp-1">@alexrivera_official</p>
                    <p className="text-[10px] text-white/80 line-clamp-2">{workingTitle}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2.5 text-white/90">
                    <Heart className="w-4 h-4" />
                    <MessageCircle className="w-4 h-4" />
                    <Send className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}

            {/* Distribution Summary breakdown */}
            <div className="p-3 bg-paper-subtle rounded-editorial mb-4 border border-border-rule text-xs space-y-2">
              <span className="text-[10px] font-mono text-ink-secondary uppercase block font-semibold">
                Validated Dispatch Destinations ({totalActivePlacements})
              </span>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {CONNECTED_ACCOUNTS.map((acc) => (
                  <React.Fragment key={acc.id}>
                    {getFormatValidation('feed', acc).eligible && placements[`${acc.id}_feed`] && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-indigo text-white font-medium">
                        {acc.name} Feed
                      </span>
                    )}
                    {getFormatValidation('story', acc).eligible && placements[`${acc.id}_story`] && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent-terracotta text-white font-medium">
                        {acc.name} Story
                      </span>
                    )}
                    {getFormatValidation('reel', acc).eligible && placements[`${acc.id}_reel`] && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-semantic-info text-white font-medium">
                        {acc.name} {acc.capabilities.reel.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}

                {totalActivePlacements === 0 && (
                  <span className="text-[10px] font-mono text-ink-secondary italic">
                    No destinations selected. Check the matrix table.
                  </span>
                )}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              disabled={totalActivePlacements === 0}
              className={`w-full py-3 px-4 text-xs font-semibold rounded-editorial flex items-center justify-center gap-2 shadow-xs transition-all ${
                totalActivePlacements > 0
                  ? 'bg-brand-indigo hover:bg-brand-indigo-hover text-white cursor-pointer'
                  : 'bg-paper-subtle text-ink-secondary border border-border-rule cursor-not-allowed opacity-60'
              }`}
            >
              <span>
                {publishMode === 'NOW'
                  ? `Publish to ${totalActivePlacements} Validated Destinations`
                  : `Schedule Dispatch (${totalActivePlacements} Destinations)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
