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
  ChevronUp,
  Tag,
  Share2,
  Edit3,
  BookmarkPlus,
  RotateCcw,
  Building2,
  Sliders
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';

type MediaTypeMode = 'PHOTOS' | 'VIDEO' | 'TEXT_ONLY';

export interface ProjectWorkspace {
  id: string;
  name: string;
  category: string;
  badgeColor: string;
}

export interface DestinationAccount {
  id: string;
  workspaceId: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK' | 'THREADS' | 'TWITTER';
  platformGroup: 'Instagram' | 'Facebook' | 'YouTube' | 'TikTok' | 'Other';
  name: string;
  handle: string;
  badge: string;
  avatarBg: string;
  avatarText: string;
  capabilities: {
    feed: { supported: boolean; label: string };
    story: { supported: boolean; label: string };
    reel: { supported: boolean; label: string };
  };
}

export interface PresetRecipe {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  icon: string;
  targetPlacements: Record<string, boolean>;
}

// -------------------------------------------------------------
// WORKSPACES DATASET
// -------------------------------------------------------------
const WORKSPACES_DATA: ProjectWorkspace[] = [
  { id: 'ws_acme', name: 'Acme Creator Studio', category: 'Personal Brand', badgeColor: 'bg-brand-indigo' },
  { id: 'ws_retzpost', name: 'RetzPost Software', category: 'SaaS Product', badgeColor: 'bg-semantic-info' },
  { id: 'ws_coffee', name: 'Coffee Craft BKK', category: 'Client Cafe SME', badgeColor: 'bg-semantic-success' },
];

// -------------------------------------------------------------
// CHANNELS SCOPED PER WORKSPACE (Strict Isolation)
// -------------------------------------------------------------
const CHANNELS_BY_WORKSPACE: DestinationAccount[] = [
  // 1. Acme Creator Studio Channels (Personal Brand)
  {
    id: 'acme_ig',
    workspaceId: 'ws_acme',
    platform: 'INSTAGRAM',
    platformGroup: 'Instagram',
    name: 'Alex Rivera (Personal)',
    handle: '@alexrivera_official',
    badge: 'Creator IG',
    avatarBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    avatarText: 'IG',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'acme_fb',
    workspaceId: 'ws_acme',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'Alex Rivera Media Studio',
    handle: 'Alex Rivera Studio Page',
    badge: 'Creator FB',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'acme_yt',
    workspaceId: 'ws_acme',
    platform: 'YOUTUBE',
    platformGroup: 'YouTube',
    name: 'Alex Rivera Studio (Main)',
    handle: '@AlexRiveraStudio',
    badge: 'Shorts/Long',
    avatarBg: 'bg-[#FF0000]',
    avatarText: 'YT',
    capabilities: {
      feed: { supported: false, label: '—' },
      story: { supported: false, label: '—' },
      reel: { supported: true, label: 'Shorts' },
    },
  },
  {
    id: 'acme_tt',
    workspaceId: 'ws_acme',
    platform: 'TIKTOK',
    platformGroup: 'TikTok',
    name: 'Alex Rivera Official',
    handle: '@alexrivera_official',
    badge: 'TikTok Creator',
    avatarBg: 'bg-ink-primary',
    avatarText: 'TT',
    capabilities: {
      feed: { supported: true, label: 'Photos' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Video' },
    },
  },

  // 2. Coffee Craft BKK Channels (Client Cafe SME)
  {
    id: 'coffee_fb',
    workspaceId: 'ws_coffee',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'Coffee Craft Bangkok (Main)',
    handle: 'Coffee Craft Cafe & Roasters',
    badge: 'Official Page',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'coffee_ig',
    workspaceId: 'ws_coffee',
    platform: 'INSTAGRAM',
    platformGroup: 'Instagram',
    name: 'Coffee Craft BKK',
    handle: '@coffeecraft.bkk',
    badge: 'Cafe IG',
    avatarBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    avatarText: 'IG',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'coffee_tt',
    workspaceId: 'ws_coffee',
    platform: 'TIKTOK',
    platformGroup: 'TikTok',
    name: 'Coffee Craft Thailand',
    handle: '@coffeecraft_th',
    badge: 'Cafe TikTok',
    avatarBg: 'bg-ink-primary',
    avatarText: 'TT',
    capabilities: {
      feed: { supported: true, label: 'Photos' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Video' },
    },
  },

  // 3. RetzPost Software Channels (SaaS Product)
  {
    id: 'retz_fb',
    workspaceId: 'ws_retzpost',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'RetzPost Software Page',
    handle: 'RetzPost Product Desk',
    badge: 'SaaS Official',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'retz_ig',
    workspaceId: 'ws_retzpost',
    platform: 'INSTAGRAM',
    platformGroup: 'Instagram',
    name: 'RetzPost HQ',
    handle: '@retzpost_app',
    badge: 'SaaS IG',
    avatarBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    avatarText: 'IG',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'retz_yt',
    workspaceId: 'ws_retzpost',
    platform: 'YOUTUBE',
    platformGroup: 'YouTube',
    name: 'RetzPost Tutorials & Clips',
    handle: '@RetzPostClips',
    badge: 'SaaS Shorts',
    avatarBg: 'bg-[#FF0000]',
    avatarText: 'YT',
    capabilities: {
      feed: { supported: false, label: '—' },
      story: { supported: false, label: '—' },
      reel: { supported: true, label: 'Shorts' },
    },
  },
  {
    id: 'retz_th',
    workspaceId: 'ws_retzpost',
    platform: 'THREADS',
    platformGroup: 'Other',
    name: 'RetzPost on Threads',
    handle: '@retzpost_app',
    badge: 'Threads',
    avatarBg: 'bg-black',
    avatarText: 'TH',
    capabilities: {
      feed: { supported: true, label: 'Post' },
      story: { supported: false, label: '—' },
      reel: { supported: false, label: '—' },
    },
  },
  {
    id: 'retz_x',
    workspaceId: 'ws_retzpost',
    platform: 'TWITTER',
    platformGroup: 'Other',
    name: 'RetzPost App on X',
    handle: '@retzpost',
    badge: 'Twitter/X',
    avatarBg: 'bg-[#0f1419]',
    avatarText: '𝕏',
    capabilities: {
      feed: { supported: true, label: 'Tweet' },
      story: { supported: false, label: '—' },
      reel: { supported: false, label: '—' },
    },
  },
];

// -------------------------------------------------------------
// PRESETS DATASET SCOPED PER WORKSPACE
// -------------------------------------------------------------
const INITIAL_PRESETS_BY_WORKSPACE: Record<string, PresetRecipe[]> = {
  ws_acme: [
    {
      id: 'pre_acme_daily',
      workspaceId: 'ws_acme',
      title: 'Daily Creator Combo',
      description: 'IG Feed + IG Story + FB Page Feed',
      icon: '✨',
      targetPlacements: {
        'acme_ig_feed': true,
        'acme_ig_story': true,
        'acme_fb_feed': true,
      },
    },
    {
      id: 'pre_acme_viral',
      workspaceId: 'ws_acme',
      title: 'Viral Shorts Blast',
      description: 'YT Shorts + TikTok + IG Reels',
      icon: '🎬',
      targetPlacements: {
        'acme_yt_reel': true,
        'acme_tt_reel': true,
        'acme_ig_reel': true,
      },
    },
  ],
  ws_coffee: [
    {
      id: 'pre_coffee_morning',
      workspaceId: 'ws_coffee',
      title: 'Morning Cafe Vibe',
      description: 'IG Story (with Map Sticker) + FB Page Feed',
      icon: '☕',
      targetPlacements: {
        'coffee_ig_story': true,
        'coffee_fb_feed': true,
      },
    },
    {
      id: 'pre_coffee_promo',
      workspaceId: 'ws_coffee',
      title: 'Weekend Promo Album',
      description: 'FB Photo Album + IG Feed Carousel',
      icon: '🥐',
      targetPlacements: {
        'coffee_fb_feed': true,
        'coffee_ig_feed': true,
      },
    },
  ],
  ws_retzpost: [
    {
      id: 'pre_retz_release',
      workspaceId: 'ws_retzpost',
      title: 'Product Changelog Release',
      description: 'FB Page + Threads + X Tweet',
      icon: '🚀',
      targetPlacements: {
        'retz_fb_feed': true,
        'retz_th_feed': true,
        'retz_x_feed': true,
      },
    },
    {
      id: 'pre_retz_demo',
      workspaceId: 'ws_retzpost',
      title: 'Feature Demo Shorts',
      description: 'YT Shorts + IG Reel',
      icon: '📱',
      targetPlacements: {
        'retz_yt_reel': true,
        'retz_ig_reel': true,
      },
    },
  ],
};

export default function CreatePostPage() {
  // Active Project Workspace Context
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('ws_acme');
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);

  // Custom Presets State (Editable / Saveable)
  const [customPresetsMap, setCustomPresetsMap] = useState<Record<string, PresetRecipe[]>>(INITIAL_PRESETS_BY_WORKSPACE);
  const [isSavePresetModalOpen, setIsSavePresetModalOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  // Mobile/Tablet Tab Switcher for narrow screens
  const [mobileTab, setMobileTab] = useState<'DESTINATIONS' | 'CANVAS' | 'PROOF'>('CANVAS');

  // Master Media Ingestion Mode
  const [mediaMode, setMediaMode] = useState<MediaTypeMode>('PHOTOS');

  // Search & Filter State for Channels (Column 1)
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
    'acme_ig_feed': true,
    'acme_ig_story': true,
    'acme_fb_feed': true,
  });

  // Content Fields (Column 2)
  const [workingTitle, setWorkingTitle] = useState('Omni-Format Publishing: Simultaneous Feed, Story & Reels');
  const [sharedCaption, setSharedCaption] = useState(
    'Architecture over aesthetics. In this issue we break down our modular publishing pipeline designed for simultaneous Feed Posts, 24h Stories, and Reels/Shorts.\n\nSwipe to explore the full stack diagrams.'
  );
  const [sharedTags, setSharedTags] = useState('architecture, publishing, tech, design-system');
  const [storyLinkUrl, setStoryLinkUrl] = useState('https://retzpost.com/announcement');

  // Preview Mode in Right Rail (Column 3)
  const [previewTab, setPreviewTab] = useState<'FEED' | 'STORY' | 'REEL'>('FEED');

  // Cadence
  const [publishMode, setPublishMode] = useState<'NOW' | 'SCHEDULED'>('NOW');
  const [scheduledDate, setScheduledDate] = useState('2026-10-24');
  const [scheduledTime, setScheduledTime] = useState('09:15');

  // Active Workspace Entity
  const activeWorkspace = WORKSPACES_DATA.find(w => w.id === activeWorkspaceId) || WORKSPACES_DATA[0];

  // Active Channels Filtered by Workspace
  const workspaceChannels = useMemo(() => {
    return CHANNELS_BY_WORKSPACE.filter(ch => ch.workspaceId === activeWorkspaceId);
  }, [activeWorkspaceId]);

  // Active Custom Presets for this Workspace
  const activePresets = customPresetsMap[activeWorkspaceId] || [];

  // Switch Workspace Handler
  const handleSwitchWorkspace = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
    setIsWorkspaceMenuOpen(false);
    setSearchQuery('');
    setSelectedGroupFilter('ALL');

    // Automatically load default preset or first preset of that workspace
    const presets = customPresetsMap[workspaceId] || [];
    if (presets.length > 0) {
      setPlacements(presets[0].targetPlacements);
    } else {
      setPlacements({});
    }
  };

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
    if (!val.eligible) return;

    const key = `${accountId}_${format}`;
    setPlacements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 1-Click Card Row Toggle: Activates primary format
  const toggleAccountPrimary = (account: DestinationAccount) => {
    // If account has active placements, turn all off
    const isAnyActive = ['feed', 'story', 'reel'].some(f => placements[`${account.id}_${f}`]);
    if (isAnyActive) {
      setPlacements(prev => {
        const next = { ...prev };
        delete next[`${account.id}_feed`];
        delete next[`${account.id}_story`];
        delete next[`${account.id}_reel`];
        return next;
      });
      return;
    }

    // Otherwise, turn on preferred format based on mediaMode
    let preferredFormat: 'feed' | 'story' | 'reel' = 'feed';
    if (mediaMode === 'VIDEO' && account.capabilities.reel.supported) {
      preferredFormat = 'reel';
    } else if (account.capabilities.feed.supported) {
      preferredFormat = 'feed';
    } else if (account.capabilities.reel.supported) {
      preferredFormat = 'reel';
    }

    const val = getFormatValidation(preferredFormat, account);
    if (val.eligible) {
      setPlacements(prev => ({ ...prev, [`${account.id}_${preferredFormat}`]: true }));
    }
  };

  // 1-Click Preset Activation
  const applyPreset = (recipe: PresetRecipe) => {
    // Merge only eligible placements for current media mode
    const newPlacements: Record<string, boolean> = {};
    Object.entries(recipe.targetPlacements).forEach(([key, val]) => {
      if (!val) return;
      const [accId, format] = key.split('_') as [string, 'feed' | 'story' | 'reel'];
      const acc = workspaceChannels.find(a => a.id === accId);
      if (acc && getFormatValidation(format, acc).eligible) {
        newPlacements[key] = true;
      }
    });
    setPlacements(newPlacements);
  };

  // Universal Smart Presets
  const applyUniversalPreset = (type: 'REELS' | 'STORIES' | 'FEEDS' | 'ALL' | 'CLEAR') => {
    if (type === 'CLEAR') {
      setPlacements({});
      return;
    }

    const next: Record<string, boolean> = {};
    workspaceChannels.forEach(acc => {
      if ((type === 'REELS' || type === 'ALL') && getFormatValidation('reel', acc).eligible) {
        next[`${acc.id}_reel`] = true;
      }
      if ((type === 'STORIES' || type === 'ALL') && getFormatValidation('story', acc).eligible) {
        next[`${acc.id}_story`] = true;
      }
      if ((type === 'FEEDS' || type === 'ALL') && getFormatValidation('feed', acc).eligible) {
        next[`${acc.id}_feed`] = true;
      }
    });
    setPlacements(next);
  };

  // Save Current Selection as Project Recipe
  const handleSaveCurrentAsPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const newRecipe: PresetRecipe = {
      id: `pre_${Date.now()}`,
      workspaceId: activeWorkspaceId,
      title: newPresetName.trim(),
      description: `${Object.values(placements).filter(Boolean).length} destinations selected`,
      icon: '⭐',
      targetPlacements: { ...placements },
    };

    setCustomPresetsMap(prev => ({
      ...prev,
      [activeWorkspaceId]: [...(prev[activeWorkspaceId] || []), newRecipe],
    }));

    setNewPresetName('');
    setIsSavePresetModalOpen(false);
  };

  // Filtered Accounts by search & group
  const filteredAccounts = useMemo(() => {
    return workspaceChannels.filter((acc) => {
      const matchesGroup = selectedGroupFilter === 'ALL' || acc.platformGroup === selectedGroupFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || acc.name.toLowerCase().includes(q) || acc.handle.toLowerCase().includes(q) || acc.badge.toLowerCase().includes(q);
      return matchesGroup && matchesSearch;
    });
  }, [workspaceChannels, searchQuery, selectedGroupFilter]);

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
    const acc = workspaceChannels.find((a) => a.id === accId);
    if (!acc) return false;
    return getFormatValidation(format, acc).eligible;
  }).length;

  const isAnyStoryActive = workspaceChannels.some((acc) => {
    const val = getFormatValidation('story', acc);
    return val.eligible && placements[`${acc.id}_story`];
  });

  return (
    <div className="max-w-[1520px] mx-auto px-4 md:px-6 py-6 space-y-5">
      {/* Masthead Header */}
      <Masthead
        folio="STUDIO DESK / 3-COLUMN WORKBENCH"
        editionDate="MULTI-PROJECT & PRESETS READY"
        title="Universal Content Studio"
        subtitle="Publish seamlessly across multiple projects. 1-click presets adapt instantly to your project's channels."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-brand-indigo font-semibold px-2.5 py-1 bg-brand-indigo/10 rounded-editorial border border-brand-indigo/20">
              {totalActivePlacements} Active Placements
            </span>
          </div>
        }
      />

      {/* MOBILE / TABLET RESPONSIVE TAB SWITCHER */}
      <div className="xl:hidden flex items-center p-1 bg-paper-raised border border-border-rule rounded-editorial text-xs">
        <button
          type="button"
          onClick={() => setMobileTab('DESTINATIONS')}
          className={`flex-1 py-2 text-center font-mono font-medium rounded transition-colors ${
            mobileTab === 'DESTINATIONS'
              ? 'bg-brand-indigo text-white font-semibold shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          🎯 Destinations ({totalActivePlacements})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('CANVAS')}
          className={`flex-1 py-2 text-center font-mono font-medium rounded transition-colors ${
            mobileTab === 'CANVAS'
              ? 'bg-brand-indigo text-white font-semibold shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          ✍️ Creative Canvas
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('PROOF')}
          className={`flex-1 py-2 text-center font-mono font-medium rounded transition-colors ${
            mobileTab === 'PROOF'
              ? 'bg-brand-indigo text-white font-semibold shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          📱 Live Proof
        </button>
      </div>

      {/* 3-COLUMN STUDIO DESK WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================================= */}
        {/* COLUMN 1: DESTINATIONS & PROJECT-SCOPED PRESETS (30% on xl)               */}
        {/* ========================================================================= */}
        <aside
          className={`lg:col-span-5 xl:col-span-3 bg-paper-raised border border-border-rule rounded-card p-4 shadow-xs space-y-3.5 ${
            mobileTab !== 'DESTINATIONS' ? 'hidden xl:block' : 'block'
          }`}
        >
          {/* Top Bar: Workspace Project Selector + Clear All */}
          <div className="space-y-2 pb-2.5 border-b border-border-rule">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold">
                Active Project Workspace:
              </span>
              <button
                type="button"
                onClick={() => applyUniversalPreset('CLEAR')}
                className="text-[10px] font-mono text-accent-terracotta hover:underline font-semibold flex items-center gap-1"
                title="Deselect all channels"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Clear All (0)</span>
              </button>
            </div>

            {/* In-Studio Workspace Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                className="w-full p-2 bg-paper-canvas border border-border-rule rounded-editorial flex items-center justify-between text-xs hover:border-brand-indigo/60 transition-colors shadow-2xs group text-left"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className={`w-2.5 h-2.5 rounded-full ${activeWorkspace.badgeColor} shrink-0`} />
                  <div className="truncate">
                    <p className="font-semibold text-xs text-ink-primary leading-tight truncate">
                      {activeWorkspace.name}
                    </p>
                    <p className="text-[9px] font-mono text-ink-secondary leading-none mt-0.5 truncate">
                      {activeWorkspace.category} • {workspaceChannels.length} channels
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-ink-secondary group-hover:text-ink-primary shrink-0 transition-colors" />
              </button>

              {/* Dropdown Options */}
              {isWorkspaceMenuOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-paper-raised border border-border-strong rounded-editorial shadow-lg p-1.5 z-40 space-y-1">
                  <div className="px-2 py-0.5 text-[9px] font-mono uppercase text-ink-secondary font-bold">
                    Switch Active Project:
                  </div>
                  {WORKSPACES_DATA.map(ws => (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => handleSwitchWorkspace(ws.id)}
                      className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors text-xs ${
                        ws.id === activeWorkspaceId
                          ? 'bg-paper-canvas text-brand-indigo font-semibold shadow-2xs border border-border-rule'
                          : 'hover:bg-paper-subtle text-ink-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className={`w-2 h-2 rounded-full ${ws.badgeColor} shrink-0`} />
                        <div className="truncate">
                          <p className="leading-tight truncate">{ws.name}</p>
                          <p className="text-[9px] font-mono text-ink-secondary">{ws.category}</p>
                        </div>
                      </div>
                      {ws.id === activeWorkspaceId && (
                        <Check className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PROJECT-SCOPED PRESETS & RECIPES BAR */}
          <div className="p-2.5 bg-paper-subtle rounded-editorial border border-border-rule space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-ink-secondary uppercase font-bold tracking-wider">
                1-Click Project Presets:
              </span>
              <button
                type="button"
                onClick={() => setIsSavePresetModalOpen(true)}
                disabled={totalActivePlacements === 0}
                className={`text-[9px] font-mono flex items-center gap-1 font-semibold ${
                  totalActivePlacements > 0
                    ? 'text-brand-indigo hover:underline cursor-pointer'
                    : 'text-ink-secondary/40 cursor-not-allowed'
                }`}
              >
                <BookmarkPlus className="w-2.5 h-2.5" />
                <span>+ Save Preset</span>
              </button>
            </div>

            {/* Level 1: Universal Smart Buttons */}
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => applyUniversalPreset('FEEDS')}
                className="py-1 px-1 rounded text-[10px] font-mono font-semibold bg-brand-indigo text-white hover:bg-brand-indigo-hover transition-colors shadow-2xs text-center truncate"
                title="Select all Feed placements in this workspace"
              >
                📰 All Feeds
              </button>
              <button
                type="button"
                disabled={mediaMode === 'TEXT_ONLY'}
                onClick={() => applyUniversalPreset('STORIES')}
                className={`py-1 px-1 rounded text-[10px] font-mono font-semibold transition-colors shadow-2xs text-center truncate ${
                  mediaMode !== 'TEXT_ONLY'
                    ? 'bg-accent-terracotta text-white hover:opacity-90'
                    : 'bg-paper-canvas text-ink-secondary/40 border border-border-rule cursor-not-allowed'
                }`}
                title="Select all Stories in this workspace"
              >
                📱 All Stories
              </button>
              <button
                type="button"
                disabled={mediaMode !== 'VIDEO'}
                onClick={() => applyUniversalPreset('REELS')}
                className={`py-1 px-1 rounded text-[10px] font-mono font-semibold transition-colors shadow-2xs text-center truncate ${
                  mediaMode === 'VIDEO'
                    ? 'bg-semantic-info text-white hover:opacity-90'
                    : 'bg-paper-canvas text-ink-secondary/40 border border-border-rule cursor-not-allowed'
                }`}
                title="Select all Reels/Shorts in this workspace"
              >
                🎬 All Reels
              </button>
            </div>

            {/* Level 2: Project-Specific Custom Recipes */}
            {activePresets.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-border-rule/60">
                <span className="text-[8px] font-mono text-ink-secondary uppercase block font-semibold">
                  Saved for {activeWorkspace.name}:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activePresets.map((recipe) => (
                    <button
                      key={recipe.id}
                      type="button"
                      onClick={() => applyPreset(recipe)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-primary transition-colors flex items-center gap-1 shadow-2xs text-left"
                      title={recipe.description}
                    >
                      <span>{recipe.icon}</span>
                      <span className="font-medium truncate max-w-[120px]">{recipe.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal for Saving New Custom Preset */}
          {isSavePresetModalOpen && (
            <div className="p-2.5 bg-paper-canvas border border-brand-indigo/40 rounded-editorial shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase">
                  Save {totalActivePlacements} Selected as Preset
                </span>
                <button
                  type="button"
                  onClick={() => setIsSavePresetModalOpen(false)}
                  className="text-ink-secondary hover:text-ink-primary"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSaveCurrentAsPreset} className="space-y-2">
                <input
                  type="text"
                  placeholder="e.g. Daily Promo Combo..."
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  autoFocus
                  className="w-full px-2 py-1 text-xs bg-paper-subtle border border-border-rule rounded font-mono focus:outline-none focus:border-brand-indigo"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsSavePresetModalOpen(false)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono text-ink-secondary hover:bg-paper-subtle"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-brand-indigo text-white font-semibold"
                  >
                    Save Recipe
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-ink-secondary absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder={`Search ${workspaceChannels.length} channels...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-[11px] bg-paper-canvas border border-border-rule rounded-editorial font-mono text-ink-primary placeholder:text-ink-secondary/50 focus:outline-none focus:border-brand-indigo"
            />
          </div>

          {/* Platform Filter Chips */}
          <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
            {(['ALL', 'Instagram', 'Facebook', 'YouTube', 'TikTok'] as const).map((grp) => {
              const count = grp === 'ALL' 
                ? workspaceChannels.length 
                : workspaceChannels.filter(a => a.platformGroup === grp).length;
              if (grp !== 'ALL' && count === 0) return null; // Hide platform tabs with 0 channels in this workspace
              
              return (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setSelectedGroupFilter(grp)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    selectedGroupFilter === grp
                      ? 'bg-ink-primary text-white font-semibold'
                      : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                  }`}
                >
                  {grp === 'ALL' ? 'All' : grp} ({count})
                </button>
              );
            })}
          </div>

          {/* Scrollable Channel List Scoped to Active Project with 1-Click Card Activation */}
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto pr-1 space-y-3">
            {Array.from(groupedAccounts.entries()).map(([groupName, accounts]) => (
              <div key={groupName} className="space-y-1">
                {/* Group Subheader */}
                <div className="flex items-center justify-between text-[10px] font-mono pb-0.5 border-b border-border-rule/70">
                  <span className="font-bold text-ink-primary uppercase tracking-wider">
                    {groupName} ({accounts.length})
                  </span>
                </div>

                {/* Individual Channel Cards */}
                <div className="space-y-1.5">
                  {accounts.map((acc) => {
                    const feedVal = getFormatValidation('feed', acc);
                    const storyVal = getFormatValidation('story', acc);
                    const reelVal = getFormatValidation('reel', acc);

                    const isFeedActive = feedVal.eligible && placements[`${acc.id}_feed`];
                    const isStoryActive = storyVal.eligible && placements[`${acc.id}_story`];
                    const isReelActive = reelVal.eligible && placements[`${acc.id}_reel`];

                    const isAnyActive = isFeedActive || isStoryActive || isReelActive;

                    return (
                      <div
                        key={acc.id}
                        className={`p-2 rounded-editorial border transition-all ${
                          isAnyActive
                            ? 'bg-paper-canvas border-brand-indigo/40 shadow-2xs ring-1 ring-brand-indigo/10'
                            : 'bg-paper-subtle/30 border-border-rule opacity-75 hover:opacity-100'
                        }`}
                      >
                        {/* 1-Click Account Row Header: Clicking toggles primary format */}
                        <div 
                          onClick={() => toggleAccountPrimary(acc)}
                          className="flex items-center gap-2 mb-1.5 cursor-pointer group"
                          title="Click to toggle channel"
                        >
                          <div className={`w-5 h-5 rounded-editorial ${acc.avatarBg} text-white flex items-center justify-center font-bold text-[9px] shrink-0`}>
                            {acc.avatarText}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-xs text-ink-primary leading-tight truncate group-hover:text-brand-indigo transition-colors">
                              {acc.name}
                            </p>
                            <p className="text-[9px] font-mono text-ink-secondary truncate">
                              {acc.handle}
                            </p>
                          </div>
                          <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-paper-subtle border border-border-rule text-ink-secondary shrink-0">
                            {acc.badge}
                          </span>
                        </div>

                        {/* Format Pills Row */}
                        <div className="flex items-center gap-1 justify-end">
                          {/* Feed Pill */}
                          {acc.capabilities.feed.supported ? (
                            feedVal.eligible ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlacement(acc.id, 'feed', acc);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                                  isFeedActive
                                    ? 'bg-brand-indigo text-white font-semibold shadow-2xs'
                                    : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                                }`}
                              >
                                {isFeedActive ? '✓ Feed' : '+ Feed'}
                              </button>
                            ) : (
                              <span 
                                title={feedVal.reason}
                                className="inline-flex items-center gap-1 text-[9px] font-mono text-ink-secondary/50 bg-paper-subtle px-1.5 py-0.5 rounded cursor-not-allowed"
                              >
                                <Lock className="w-2.5 h-2.5" />
                                <span>No Pic</span>
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] font-mono text-ink-secondary/30 px-1">—</span>
                          )}

                          {/* Story Pill */}
                          {acc.capabilities.story.supported ? (
                            storyVal.eligible ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlacement(acc.id, 'story', acc);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                                  isStoryActive
                                    ? 'bg-accent-terracotta text-white font-semibold shadow-2xs'
                                    : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                                }`}
                              >
                                {isStoryActive ? '✓ Story' : '+ Story'}
                              </button>
                            ) : (
                              <span 
                                title={storyVal.reason}
                                className="inline-flex items-center gap-1 text-[9px] font-mono text-ink-secondary/50 bg-paper-subtle px-1.5 py-0.5 rounded cursor-not-allowed"
                              >
                                <Lock className="w-2.5 h-2.5" />
                                <span>No Media</span>
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] font-mono text-ink-secondary/30 px-1">—</span>
                          )}

                          {/* Reel / Shorts Pill */}
                          {acc.capabilities.reel.supported ? (
                            reelVal.eligible ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlacement(acc.id, 'reel', acc);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                                  isReelActive
                                    ? 'bg-semantic-info text-white font-semibold shadow-2xs'
                                    : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                                }`}
                              >
                                {isReelActive ? `✓ ${acc.capabilities.reel.label}` : `+ ${acc.capabilities.reel.label}`}
                              </button>
                            ) : (
                              <span 
                                title={reelVal.reason}
                                className="inline-flex items-center gap-1 text-[9px] font-mono text-ink-secondary/50 bg-paper-subtle px-1.5 py-0.5 rounded cursor-not-allowed"
                              >
                                <Lock className="w-2.5 h-2.5" />
                                <span>Video Req.</span>
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] font-mono text-ink-secondary/30 px-1">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* COLUMN 2: THE CREATIVE CANVAS (42% on xl / unified media + narrative)     */}
        {/* ========================================================================= */}
        <main
          className={`lg:col-span-7 xl:col-span-5 space-y-4 ${
            mobileTab !== 'CANVAS' ? 'hidden xl:block' : 'block'
          }`}
        >
          {/* MEDIA INGESTION DOCK (Top of Canvas) */}
          <div className="bg-paper-raised border border-border-rule rounded-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-rule">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-brand-indigo" />
                <h2 className="font-serif font-medium text-sm text-ink-primary">
                  Master Visual & Media
                </h2>
              </div>
              <span className="text-[10px] font-mono text-ink-secondary">
                Auto-adapts to Carousel & 9:16
              </span>
            </div>

            {/* Media Mode Tabs */}
            <div className="flex items-center gap-1 p-1 bg-paper-subtle border border-border-rule rounded-editorial text-xs">
              <button
                type="button"
                onClick={() => {
                  setMediaMode('PHOTOS');
                  if (previewTab === 'REEL') setPreviewTab('FEED');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors text-[11px] font-medium ${
                  mediaMode === 'PHOTOS'
                    ? 'bg-paper-canvas text-brand-indigo shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photos ({images.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaMode('VIDEO');
                  setPreviewTab('REEL');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors text-[11px] font-medium ${
                  mediaMode === 'VIDEO'
                    ? 'bg-paper-canvas text-semantic-info shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Video Reel (9:16)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaMode('TEXT_ONLY');
                  setPreviewTab('FEED');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors text-[11px] font-medium ${
                  mediaMode === 'TEXT_ONLY'
                    ? 'bg-paper-canvas text-ink-primary shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Text Only</span>
              </button>
            </div>

            {/* Photos Gallery */}
            {mediaMode === 'PHOTOS' && (
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative aspect-square bg-paper-subtle border border-border-rule rounded-editorial p-2 flex flex-col justify-between group overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-4 h-4 rounded-full bg-brand-indigo text-white flex items-center justify-center font-mono text-[9px] font-bold">
                        {idx + 1}
                      </span>
                      <button
                        onClick={() => setImages(images.filter((i) => i.id !== img.id))}
                        className="p-1 text-ink-secondary hover:text-semantic-error opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-center my-auto">
                      <ImageIcon className="w-5 h-5 text-brand-indigo mx-auto opacity-70 mb-0.5" />
                      <p className="text-[9px] font-mono text-ink-secondary truncate">{img.name}</p>
                    </div>
                    <span className="text-[8px] font-mono text-ink-secondary">{img.size}</span>
                  </div>
                ))}

                {images.length < 10 && (
                  <div className="aspect-square border-2 border-dashed border-border-rule rounded-editorial flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:border-brand-indigo/60 transition-colors bg-paper-canvas/40">
                    <Plus className="w-4 h-4 text-brand-indigo mb-0.5" />
                    <span className="text-[11px] font-serif font-medium text-ink-primary">Add Photo</span>
                    <span className="text-[9px] font-mono text-ink-secondary">JPG, PNG</span>
                  </div>
                )}
              </div>
            )}

            {/* Video Card */}
            {mediaMode === 'VIDEO' && (
              <div className="p-3 bg-paper-canvas border border-border-rule rounded-editorial flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-editorial bg-semantic-info/10 text-semantic-info flex items-center justify-center shrink-0 border border-semantic-info/20">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-ink-primary font-mono truncate max-w-[200px]">
                      {videoAsset.name}
                    </h3>
                    <p className="text-[10px] font-mono text-semantic-success mt-0.5">
                      {videoAsset.resolution} • {videoAsset.duration}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-semantic-success/10 text-semantic-success text-[9px] font-mono font-semibold">
                  ✓ Validated
                </span>
              </div>
            )}

            {/* Text Only Indicator */}
            {mediaMode === 'TEXT_ONLY' && (
              <p className="text-[11px] text-ink-secondary italic font-serif">
                Text status mode: Eligible for Facebook timeline, Threads, and X/Twitter. (Story and Reels locked in Destinations rail).
              </p>
            )}
          </div>

          {/* NARRATIVE & COPY BOX */}
          <div className="bg-paper-raised border border-border-rule rounded-card p-4 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border-rule">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-brand-indigo" />
                <h2 className="font-serif font-medium text-sm text-ink-primary">
                  Caption & Narrative
                </h2>
              </div>
              <span className="text-[10px] font-mono text-ink-secondary">
                {sharedCaption.length} chars
              </span>
            </div>

            {/* Working Title / Headline */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1">
                Headline / Project Title (Optional)
              </label>
              <input
                type="text"
                value={workingTitle}
                onChange={(e) => setWorkingTitle(e.target.value)}
                placeholder="Give your dispatch a memorable title..."
                className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-medium text-xs focus:outline-none focus:border-brand-indigo"
              />
            </div>

            {/* Main Caption Box */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1">
                Post Caption / Body Text
              </label>
              <textarea
                rows={5}
                value={sharedCaption}
                onChange={(e) => setSharedCaption(e.target.value)}
                placeholder="Write your story, caption, or thoughts here..."
                className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary text-xs focus:outline-none focus:border-brand-indigo leading-relaxed font-sans"
              />
            </div>

            {/* Hashtags Input */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Tag className="w-3 h-3 text-ink-secondary" />
                <label className="text-[10px] font-mono uppercase text-ink-secondary">
                  Hashtags
                </label>
              </div>
              <input
                type="text"
                value={sharedTags}
                onChange={(e) => setSharedTags(e.target.value)}
                placeholder="comma, separated, tags"
                className="w-full px-3 py-1.5 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono text-xs focus:outline-none focus:border-brand-indigo"
              />
            </div>

            {/* CONTEXTUAL STORY LINK STICKER */}
            {isAnyStoryActive && (
              <div className="pt-3 border-t border-border-rule/80">
                <div className="flex items-center gap-1.5 mb-1">
                  <Link2 className="w-3.5 h-3.5 text-accent-terracotta" />
                  <label className="text-[10px] font-mono uppercase font-semibold text-accent-terracotta">
                    Story Interactive Link Sticker (Instagram & Facebook Stories)
                  </label>
                </div>
                <input
                  type="url"
                  value={storyLinkUrl}
                  onChange={(e) => setStoryLinkUrl(e.target.value)}
                  placeholder="https://yourbrand.com/special-offer"
                  className="w-full px-3 py-2 bg-paper-canvas border border-accent-terracotta/40 rounded-editorial font-mono text-ink-primary focus:outline-none focus:border-accent-terracotta text-xs"
                />
                <p className="text-[10px] text-ink-secondary mt-1">
                  Renders as a direct clickable sticker inside 24h vertical Story screens.
                </p>
              </div>
            )}
          </div>

          {/* PUBLISHING CADENCE & TIMING */}
          <div className="bg-paper-raised border border-border-rule rounded-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-rule">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-indigo" />
                <h2 className="font-serif font-medium text-sm text-ink-primary">
                  Publishing Cadence
                </h2>
              </div>
              <span className="text-[10px] font-mono text-ink-secondary">Asia/Bangkok (UTC+7)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPublishMode('NOW')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-editorial border transition-colors ${
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
                className={`flex-1 py-1.5 text-xs font-medium rounded-editorial border transition-colors ${
                  publishMode === 'SCHEDULED'
                    ? 'bg-brand-indigo text-white border-brand-indigo font-semibold shadow-2xs'
                    : 'bg-paper-subtle text-ink-secondary border-border-rule hover:text-ink-primary'
                }`}
              >
                Schedule Dispatch
              </button>
            </div>

            {publishMode === 'SCHEDULED' && (
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1">Target Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs focus:outline-none focus:border-brand-indigo"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1">Target Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs focus:outline-none focus:border-brand-indigo"
                  />
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ========================================================================= */}
        {/* COLUMN 3: LIVE PROOF & MASTER DISPATCH (28% on xl / sticky rail)          */}
        {/* ========================================================================= */}
        <section
          className={`lg:col-span-12 xl:col-span-4 bg-paper-raised border border-border-rule rounded-card p-4 shadow-xs space-y-4 xl:sticky xl:top-6 ${
            mobileTab !== 'PROOF' ? 'hidden xl:block' : 'block'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-border-rule">
            <span className="font-mono text-xs font-bold text-brand-indigo">Live Proof & Dispatch</span>
            <span className="text-[10px] font-mono text-semantic-success flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready</span>
            </span>
          </div>

          {/* Format Switcher Tabs */}
          <div className="flex items-center p-1 bg-paper-subtle border border-border-rule rounded-editorial text-xs">
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
              <span>Reels</span>
            </button>
          </div>

          {/* TAB 1: FEED PREVIEW */}
          {previewTab === 'FEED' && (
            <div className="bg-paper-canvas border border-border-rule rounded-editorial overflow-hidden shadow-2xs">
              <div className="p-2.5 flex items-center justify-between border-b border-border-rule/60">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-brand-indigo text-white flex items-center justify-center text-[9px] font-bold">
                    AR
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-primary leading-none truncate max-w-[150px]">
                      {workspaceChannels[0]?.handle || '@channel'}
                    </p>
                    <p className="text-[8px] font-mono text-ink-secondary">
                      Feed Post • {mediaMode === 'PHOTOS' ? `Carousel (${images.length})` : mediaMode === 'VIDEO' ? 'Video Post' : 'Text'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-ink-secondary">•••</span>
              </div>

              <div className="aspect-[4/3] bg-paper-subtle relative flex items-center justify-center border-b border-border-rule/60">
                {mediaMode === 'PHOTOS' && (
                  <>
                    <ImageIcon className="w-8 h-8 text-brand-indigo/40" />
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.2 rounded-full bg-ink-primary/75 text-white font-mono text-[9px]">
                      1/{images.length}
                    </span>
                  </>
                )}
                {mediaMode === 'VIDEO' && (
                  <div className="text-center">
                    <Film className="w-8 h-8 text-semantic-info/60 mx-auto mb-1" />
                    <span className="text-[9px] font-mono text-ink-secondary">{videoAsset.duration} • 1080p</span>
                  </div>
                )}
                {mediaMode === 'TEXT_ONLY' && (
                  <div className="p-3 text-center">
                    <p className="font-serif italic text-xs text-ink-primary line-clamp-3">
                      &quot;{sharedCaption}&quot;
                    </p>
                  </div>
                )}
              </div>

              <div className="px-2.5 pt-2 pb-1 flex items-center justify-between text-ink-secondary">
                <div className="flex items-center gap-2.5">
                  <Heart className="w-3.5 h-3.5 hover:text-semantic-error cursor-pointer" />
                  <MessageCircle className="w-3.5 h-3.5 cursor-pointer" />
                  <Send className="w-3.5 h-3.5 cursor-pointer" />
                </div>
                <Bookmark className="w-3.5 h-3.5 cursor-pointer" />
              </div>

              <div className="p-2.5 pt-1 text-xs">
                <p className="font-semibold text-ink-primary text-xs mb-0.5 line-clamp-1">
                  {workingTitle}
                </p>
                <p className="text-ink-secondary text-[10px] line-clamp-2 leading-relaxed">
                  <span className="font-semibold text-ink-primary mr-1">{workspaceChannels[0]?.handle || '@channel'}</span>
                  {sharedCaption}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: STORY PREVIEW (9:16 VERTICAL PHONE) */}
          {previewTab === 'STORY' && (
            <div className="w-full max-w-[210px] mx-auto aspect-[9/16] bg-gradient-to-b from-[#2a2d3e] to-[#12131a] rounded-[20px] p-2.5 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-border-rule">
              <div>
                <div className="flex gap-1 mb-1.5">
                  <div className="h-0.5 flex-1 bg-white rounded-full"></div>
                  <div className="h-0.5 flex-1 bg-white/40 rounded-full"></div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-accent-terracotta text-white flex items-center justify-center text-[7px] font-bold ring-1 ring-white">
                    AR
                  </div>
                  <span className="text-[9px] font-semibold text-white/90 truncate max-w-[110px]">
                    {workspaceChannels[0]?.handle || '@channel'}
                  </span>
                  <span className="text-[8px] text-white/50">24h</span>
                </div>
              </div>

              <div className="my-auto text-center px-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-1.5 backdrop-blur-xs">
                  {mediaMode === 'VIDEO' ? <Film className="w-5 h-5 text-white/80" /> : <ImageIcon className="w-5 h-5 text-white/80" />}
                </div>
                <p className="text-[10px] font-medium text-white/90 line-clamp-2">
                  {workingTitle}
                </p>
              </div>

              <div className="space-y-1.5">
                {storyLinkUrl ? (
                  <div className="mx-auto w-fit px-2.5 py-0.5 bg-white text-ink-primary rounded-full shadow-lg flex items-center gap-1">
                    <Link2 className="w-2.5 h-2.5 text-brand-indigo" />
                    <span className="text-[9px] font-mono font-bold uppercase truncate max-w-[100px]">
                      {storyLinkUrl.replace(/^https?:\/\//, '')}
                    </span>
                    <ExternalLink className="w-2 h-2 opacity-60" />
                  </div>
                ) : (
                  <div className="text-center text-[8px] font-mono text-white/40">
                    (No Link Sticker Added)
                  </div>
                )}

                <div className="h-6 rounded-full border border-white/20 px-2 flex items-center justify-between text-[9px] text-white/40 bg-black/20">
                  <span>Send message...</span>
                  <Heart className="w-3 h-3 text-white/50" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REELS / SHORTS PREVIEW */}
          {previewTab === 'REEL' && (
            <div className="w-full max-w-[210px] mx-auto aspect-[9/16] bg-black rounded-[20px] p-2.5 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-border-rule">
              <div className="flex items-center justify-between text-[9px]">
                <span className="font-semibold text-white/90">Reels / Shorts</span>
                <span className="font-mono text-semantic-info">00:48</span>
              </div>

              {mediaMode === 'VIDEO' ? (
                <div className="my-auto text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-semantic-info/20 flex items-center justify-center mb-1.5 border border-semantic-info/40">
                    <Film className="w-5 h-5 text-semantic-info" />
                  </div>
                  <span className="text-[9px] font-mono text-white/80 bg-black/50 px-1.5 py-0.2 rounded">
                    1080x1920 (9:16)
                  </span>
                </div>
              ) : (
                <div className="my-auto text-center p-2 bg-white/5 rounded-editorial border border-white/10">
                  <Lock className="w-4 h-4 text-semantic-warning mx-auto mb-1" />
                  <p className="text-[9px] text-white/80 font-mono">
                    Reels require video asset.
                  </p>
                </div>
              )}

              <div className="flex items-end justify-between">
                <div className="space-y-0.5 max-w-[120px]">
                  <p className="text-[10px] font-bold line-clamp-1">{workspaceChannels[0]?.handle || '@channel'}</p>
                  <p className="text-[9px] text-white/80 line-clamp-2">{workingTitle}</p>
                </div>
                <div className="flex flex-col items-center gap-2 text-white/90">
                  <Heart className="w-3.5 h-3.5" />
                  <MessageCircle className="w-3.5 h-3.5" />
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )}

          {/* Active Destinations Breakdown */}
          <div className="p-2.5 bg-paper-subtle rounded-editorial border border-border-rule text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-ink-secondary uppercase block font-semibold">
                Destinations in {activeWorkspace.name} ({totalActivePlacements})
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {workspaceChannels.map((acc) => (
                <React.Fragment key={acc.id}>
                  {getFormatValidation('feed', acc).eligible && placements[`${acc.id}_feed`] && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-brand-indigo text-white font-medium">
                      {acc.name} Feed
                    </span>
                  )}
                  {getFormatValidation('story', acc).eligible && placements[`${acc.id}_story`] && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-accent-terracotta text-white font-medium">
                      {acc.name} Story
                    </span>
                  )}
                  {getFormatValidation('reel', acc).eligible && placements[`${acc.id}_reel`] && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-semantic-info text-white font-medium">
                      {acc.name} {acc.capabilities.reel.label}
                    </span>
                  )}
                </React.Fragment>
              ))}

              {totalActivePlacements === 0 && (
                <span className="text-[9px] font-mono text-ink-secondary italic">
                  No destinations selected. Enable channels on the left or click a Preset.
                </span>
              )}
            </div>
          </div>

          {/* Master Primary Action Button */}
          <button
            disabled={totalActivePlacements === 0}
            className={`w-full py-2.5 px-4 text-xs font-semibold rounded-editorial flex items-center justify-center gap-2 shadow-xs transition-all ${
              totalActivePlacements > 0
                ? 'bg-brand-indigo hover:bg-brand-indigo-hover text-white cursor-pointer active:scale-[0.98]'
                : 'bg-paper-subtle text-ink-secondary border border-border-rule cursor-not-allowed opacity-60'
            }`}
          >
            <span>
              {publishMode === 'NOW'
                ? `Publish to ${totalActivePlacements} Destinations`
                : `Schedule Dispatch (${totalActivePlacements} Destinations)`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

      </div>
    </div>
  );
}
