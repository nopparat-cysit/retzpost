'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Sliders,
  SlidersHorizontal,
  Lightbulb,
  X,
  Copy,
  FolderOpen,
  ThumbsUp,
  ThumbsDown,
  Play,
  Music,
  Disc,
  Shuffle
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
import { useTranslation } from '@/modules/i18n/i18n-context';
import { getCurrentUser } from '@/modules/auth/auth-service';
import { Sticker } from '@/components/ui/sticker';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { CustomTimePicker } from '@/components/ui/custom-time-picker';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import { 
  FacebookLogo, 
  InstagramLogo, 
  YouTubeLogo, 
  TikTokLogo, 
  SocialPlatformIcon 
} from '@/components/ui/social-icons';
import { WorkspaceRole, hasPermission } from '@/modules/workspaces/team-roles';
import { 
  isMockDataCleared, 
  subscribeToMockDataChange, 
  loadSampleMockData, 
  clearAllMockData 
} from '@/modules/data/mock-data-manager';

type MediaTypeMode = 'PHOTOS' | 'VIDEO' | 'VIDEO_LANDSCAPE' | 'TEXT_ONLY';

export interface ProjectWorkspace {
  id: string;
  name: string;
  category: string;
  badgeColor: string;
}

export interface DestinationAccount {
  id: string;
  workspaceId: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK' | 'THREADS' | 'TWITTER' | 'X' | 'LEMON8';
  platformGroup: 'Instagram' | 'Facebook' | 'YouTube' | 'TikTok' | 'X' | 'Lemon8' | 'Other';
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
  { id: 'ws_main', name: 'Main Studio', category: 'Enterprise Portfolio', badgeColor: 'bg-accent-terracotta' },
  { id: 'ws_creator', name: 'Creator Hub', category: 'Creator Brand', badgeColor: 'bg-brand-indigo' },
  { id: 'ws_software', name: 'Tech & Product Studio', category: 'SaaS Product', badgeColor: 'bg-semantic-info' },
  { id: 'ws_brand', name: 'Lifestyle & Brand', category: 'Brand & Retail', badgeColor: 'bg-semantic-success' },
  // Backward compatibility aliases
  { id: 'ws_capitalone', name: 'Main Studio', category: 'Enterprise Portfolio', badgeColor: 'bg-accent-terracotta' },
  { id: 'ws_acme', name: 'Creator Hub', category: 'Creator Brand', badgeColor: 'bg-brand-indigo' },
];

// -------------------------------------------------------------
// CHANNELS SCOPED PER WORKSPACE (Strict Isolation)
// -------------------------------------------------------------
const CHANNELS_BY_WORKSPACE: DestinationAccount[] = [
  // 1. Creator Hub Channels
  {
    id: 'acme_ig',
    workspaceId: 'ws_acme',
    platform: 'INSTAGRAM',
    platformGroup: 'Instagram',
    name: 'Creator Profile (Instagram)',
    handle: '@creator.official',
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
    name: 'Creator Studio Media Page',
    handle: 'FB Page: Creator Studio',
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
    name: 'Official YouTube Channel',
    handle: '@CreatorStudioOfficial',
    badge: 'Shorts/Long',
    avatarBg: 'bg-[#FF0000]',
    avatarText: 'YT',
    capabilities: {
      feed: { supported: true, label: 'Full Video (16:9)' },
      story: { supported: false, label: '—' },
      reel: { supported: true, label: 'Shorts (9:16)' },
    },
  },
  {
    id: 'acme_tt',
    workspaceId: 'ws_acme',
    platform: 'TIKTOK',
    platformGroup: 'TikTok',
    name: 'Official TikTok Creator',
    handle: '@creator_official',
    badge: 'TikTok Creator',
    avatarBg: 'bg-ink-primary',
    avatarText: 'TT',
    capabilities: {
      feed: { supported: true, label: 'Photos' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Video' },
    },
  },
  {
    id: 'acme_x',
    workspaceId: 'ws_acme',
    platform: 'X',
    platformGroup: 'X',
    name: 'Creator X Channel (@CreatorStudio)',
    handle: '@CreatorStudio',
    badge: 'Creator X',
    avatarBg: 'bg-black',
    avatarText: '𝕏',
    capabilities: {
      feed: { supported: true, label: 'Post' },
      story: { supported: false, label: '—' },
      reel: { supported: false, label: '—' },
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
  {
    id: 'coffee_lemon8',
    workspaceId: 'ws_coffee',
    platform: 'LEMON8',
    platformGroup: 'Lemon8',
    name: 'Coffee Craft BKK (Lemon8)',
    handle: '@coffeecraft.bkk',
    badge: 'Cafe Lemon8',
    avatarBg: 'bg-[#FFEB00] text-black',
    avatarText: 'L8',
    capabilities: {
      feed: { supported: true, label: 'Post' },
      story: { supported: false, label: '—' },
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
      feed: { supported: true, label: 'Full Video (16:9)' },
      story: { supported: false, label: '—' },
      reel: { supported: true, label: 'Shorts (9:16)' },
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
    platform: 'X',
    platformGroup: 'X',
    name: 'RetzPost App on X',
    handle: '@retzpost',
    badge: 'Official X',
    avatarBg: 'bg-[#0f1419]',
    avatarText: '𝕏',
    capabilities: {
      feed: { supported: true, label: 'Tweet' },
      story: { supported: false, label: '—' },
      reel: { supported: false, label: '—' },
    },
  },

  // 4. Main Studio Brand Channels (Enterprise Portfolio)
  {
    id: 'c1_fb_th',
    workspaceId: 'ws_capitalone',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'Official Brand Page',
    handle: 'FB Page: Official Brand',
    badge: 'Main Page',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'c1_fb_tw',
    workspaceId: 'ws_capitalone',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'Regional Brand Channel',
    handle: 'FB Page: Regional Brand',
    badge: 'Regional FB',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: false, label: '—' },
    },
  },
  {
    id: 'c1_fb_global_lux',
    workspaceId: 'ws_capitalone',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'Global Media Partner',
    handle: 'FB Page: Global Partner',
    badge: 'Partner FB',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'c1_fb_partner',
    workspaceId: 'ws_capitalone',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'Media Partner Channel',
    handle: 'FB Page: Media Partner',
    badge: 'Partner FB',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'c1_ig_main',
    workspaceId: 'ws_capitalone',
    platform: 'INSTAGRAM',
    platformGroup: 'Instagram',
    name: 'Official Brand IG',
    handle: '@brand.official',
    badge: 'Official IG',
    avatarBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    avatarText: 'IG',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'c1_ig_prop',
    workspaceId: 'ws_capitalone',
    platform: 'INSTAGRAM',
    platformGroup: 'Instagram',
    name: 'Brand Showcase IG',
    handle: '@brand.showcase',
    badge: 'Showcase IG',
    avatarBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    avatarText: 'IG',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'c1_x',
    workspaceId: 'ws_capitalone',
    platform: 'X',
    platformGroup: 'X',
    name: 'Official Brand X (@BrandOfficial)',
    handle: '@BrandOfficial',
    badge: 'Official X',
    avatarBg: 'bg-black',
    avatarText: '𝕏',
    capabilities: {
      feed: { supported: true, label: 'Tweet' },
      story: { supported: false, label: '—' },
      reel: { supported: false, label: '—' },
    },
  },
  {
    id: 'c1_lemon8',
    workspaceId: 'ws_capitalone',
    platform: 'LEMON8',
    platformGroup: 'Lemon8',
    name: 'Lifestyle & Living (Lemon8)',
    handle: '@lifestyle_living',
    badge: 'Lemon8 Creator',
    avatarBg: 'bg-[#FFEB00] text-black',
    avatarText: 'L8',
    capabilities: {
      feed: { supported: true, label: 'Post' },
      story: { supported: false, label: '—' },
      reel: { supported: true, label: 'Video' },
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
      icon: 'sparkle-ai',
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
      icon: 'camera-reel',
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
      icon: 'ws-cafe',
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
      icon: 'preset-croissant',
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
      icon: 'paper-rocket',
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
      icon: 'preset-mobile',
      targetPlacements: {
        'retz_yt_reel': true,
        'retz_ig_reel': true,
      },
    },
  ],
  ws_capitalone: [
    {
      id: 'pre_c1_luxury_launch',
      workspaceId: 'ws_capitalone',
      title: 'Omni-Brand Campaign Launch',
      description: 'FB Official + Global Partner + Main IG Feed & Story',
      icon: 'sparkle-ai',
      targetPlacements: {
        'c1_fb_th_feed': true,
        'c1_fb_global_lux_feed': true,
        'c1_ig_main_feed': true,
        'c1_ig_main_story': true,
        'c1_ig_prop_story': true,
      },
    },
    {
      id: 'pre_c1_all_stories',
      workspaceId: 'ws_capitalone',
      title: 'Daily Brand 24h Stories',
      description: 'All Official IG & FB Stories with Link Sticker',
      icon: 'format-story',
      targetPlacements: {
        'c1_fb_th_story': true,
        'c1_fb_global_lux_story': true,
        'c1_ig_main_story': true,
        'c1_ig_prop_story': true,
      },
    },
    {
      id: 'pre_c1_all_feeds',
      workspaceId: 'ws_capitalone',
      title: 'Universal Brand Feed Push',
      description: 'Dispatches feed album to all main and partner channels',
      icon: 'herald-trumpet',
      targetPlacements: {
        'c1_fb_th_feed': true,
        'c1_fb_tw_feed': true,
        'c1_fb_global_lux_feed': true,
        'c1_fb_partner_feed': true,
        'c1_ig_main_feed': true,
      },
    },
  ],
};

const AI_MEDIA_LIBRARY_ASSETS = [
  {
    id: 'ai-asset-1',
    name: 'prime_skyview_living_room_concept.jpg',
    size: '4.2 MB',
    category: 'Real Estate Interior',
    description: 'Ultra-modern Bangkok luxury condo living room, double-height ceiling, floor-to-ceiling glass window with sunset skyline view.',
  },
  {
    id: 'ai-asset-2',
    name: 'sukhumvit_sky_pool_architectural_render.jpg',
    size: '5.1 MB',
    category: 'Architecture / Exterior',
    description: 'Rooftop infinity swimming pool at twilight on 45th floor in Bangkok, cinematic ambient lighting, ultra-luxury aesthetic.',
  },
  {
    id: 'ai-asset-3',
    name: 'studio_master_editing_suite.jpg',
    size: '3.9 MB',
    category: 'Studio Suite',
    description: 'High-end production suite with multi-monitor color grading desk, acoustic wall paneling, cinematic softbox lighting.',
  },
  {
    id: 'ai-asset-4',
    name: 'creator_studio_desk_setup_v2.png',
    size: '2.8 MB',
    category: 'Tech / Studio',
    description: 'Ergonomic creator workstation with mechanical keyboard, curved monitor showing editorial timeline, warm tungsten desk lamp.',
  },
];

export default function CreatePostPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [realAccounts, setRealAccounts] = useState<DestinationAccount[]>([]);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  // Active Project Workspace Context
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const user = getCurrentUser();
      if (user?.activeWorkspaceId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.activeWorkspaceId)) {
        return user.activeWorkspaceId;
      }
      const saved = localStorage.getItem('retzpost_active_project_id');
      if (saved && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(saved)) {
        return saved;
      }
    }
    return '';
  });
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
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<'ALL' | 'Instagram' | 'Facebook' | 'YouTube' | 'TikTok' | 'X' | 'Lemon8' | 'Other'>('ALL');

  // Collapsible state per platform group in Column 1 (Destinations Accordion)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Mock Data Clean / Demo Mode State
  const [isMockCleared, setIsMockCleared] = useState<boolean>(true);

  // Sample Photos (Demo Mode)
  const SAMPLE_PHOTOS = useMemo(() => [
    { id: 'img-1', name: 'editorial_hero_cover_01.jpg', size: '3.8 MB' },
    { id: 'img-2', name: 'diagram_architecture_flow_02.png', size: '2.4 MB' },
  ], []);

  // Sample Video (Demo Mode)
  const SAMPLE_VIDEO = useMemo(() => ({
    name: 'teaser_multi_format_architecture_9x16.mp4',
    size: '42.6 MB',
    duration: '00:48',
    resolution: '1080x1920 (9:16 Vertical)',
  }), []);

  // Sample Placements (Demo Mode)
  const SAMPLE_PLACEMENTS: Record<string, boolean> = useMemo(() => ({
    'acme_ig_feed': true,
    'acme_ig_story': true,
    'acme_fb_feed': true,
  }), []);

  const SAMPLE_WORKING_TITLE = 'Omni-Format Publishing: Simultaneous Feed, Story & Reels';
  const SAMPLE_SHARED_CAPTION = 'Architecture over aesthetics. In this issue we break down our modular publishing pipeline designed for simultaneous Feed Posts, 24h Stories, and Reels/Shorts.\n\nSwipe to explore the full stack diagrams.';
  const SAMPLE_SHARED_TAGS = 'architecture, publishing, tech, design-system';
  const SAMPLE_STORY_LINK_URL = 'https://retzpost.com/announcement';

  // Sample Photos
  const [images, setImages] = useState<Array<{ id: string; name: string; size: string }>>(() =>
    isMockDataCleared() ? [] : [
      { id: 'img-1', name: 'editorial_hero_cover_01.jpg', size: '3.8 MB' },
      { id: 'img-2', name: 'diagram_architecture_flow_02.png', size: '2.4 MB' },
    ]
  );

  // Sample Video
  const [videoAsset, setVideoAsset] = useState<{
    name: string;
    size: string;
    duration: string;
    resolution: string;
  } | null>(() =>
    isMockDataCleared() ? null : {
      name: 'teaser_multi_format_architecture_9x16.mp4',
      size: '42.6 MB',
      duration: '00:48',
      resolution: '1080x1920 (9:16 Vertical)',
    }
  );

  // Placements State Dictionary: [accountId_format]: boolean
  const [placements, setPlacements] = useState<Record<string, boolean>>(() =>
    isMockDataCleared() ? {} : ({
      'acme_ig_feed': true,
      'acme_ig_story': true,
      'acme_fb_feed': true,
    } as Record<string, boolean>)
  );

  // Content Fields (Column 2)
  const [workingTitle, setWorkingTitle] = useState(() =>
    isMockDataCleared() ? '' : 'Omni-Format Publishing: Simultaneous Feed, Story & Reels'
  );
  const [sharedCaption, setSharedCaption] = useState(() =>
    isMockDataCleared() ? '' : 'Architecture over aesthetics. In this issue we break down our modular publishing pipeline designed for simultaneous Feed Posts, 24h Stories, and Reels/Shorts.\n\nSwipe to explore the full stack diagrams.'
  );
  const [sharedTags, setSharedTags] = useState(() =>
    isMockDataCleared() ? '' : 'architecture, publishing, tech, design-system'
  );
  const [storyLinkUrl, setStoryLinkUrl] = useState(() =>
    isMockDataCleared() ? '' : 'https://retzpost.com/announcement'
  );

  // YouTube Full Video Specific Settings
  const [customThumbnail, setCustomThumbnail] = useState<{ id: string; name: string; size: string } | null>(null);
  const [youtubeVisibility, setYoutubeVisibility] = useState<'PUBLIC' | 'UNLISTED' | 'PRIVATE'>('PUBLIC');
  const [youtubeCategory, setYoutubeCategory] = useState<string>('HOUSING');

  // Sync with Global Mock Data Clean / Demo Switcher
  useEffect(() => {
    const cleared = isMockDataCleared();
    setIsMockCleared(cleared);

    const unsubscribe = subscribeToMockDataChange((newCleared) => {
      setIsMockCleared(newCleared);
      if (newCleared) {
        setImages([]);
        setVideoAsset(null);
        setCustomThumbnail(null);
        setPlacements({});
        setWorkingTitle('');
        setSharedCaption('');
        setSharedTags('');
        setStoryLinkUrl('');
      } else {
        setImages(SAMPLE_PHOTOS);
        setVideoAsset(SAMPLE_VIDEO);
        setPlacements(SAMPLE_PLACEMENTS);
        setWorkingTitle(SAMPLE_WORKING_TITLE);
        setSharedCaption(SAMPLE_SHARED_CAPTION);
        setSharedTags(SAMPLE_SHARED_TAGS);
        setStoryLinkUrl(SAMPLE_STORY_LINK_URL);
      }
    });

    return unsubscribe;
  }, [SAMPLE_PHOTOS, SAMPLE_VIDEO, SAMPLE_PLACEMENTS]);

  // Auto-Save Draft & Recovery Engine
  const [lastSavedDraftTime, setLastSavedDraftTime] = useState<string | null>(null);
  const [draftRestoredNotice, setDraftRestoredNotice] = useState<boolean>(false);

  // Safe-Zone Guide Overlay for 9:16 Formats
  const [showSafeZone, setShowSafeZone] = useState<boolean>(false);

  // Active Role State (RBAC Permissions)
  const [currentRole, setCurrentRole] = useState<WorkspaceRole>('MANAGER');
  const [submittedForApprovalNotice, setSubmittedForApprovalNotice] = useState<string | null>(null);

  // AI Media Hub Modal State
  const [isAiMediaModalOpen, setIsAiMediaModalOpen] = useState(false);

  const handleInsertAiMedia = (asset: { id: string; name: string; size: string }) => {
    setImages((prev) => [
      ...prev,
      { id: `ai-${Date.now()}`, name: asset.name, size: asset.size },
    ]);
    setIsAiMediaModalOpen(false);
    if (mediaMode !== 'PHOTOS') {
      setMediaMode('PHOTOS');
    }
  };

  // Preview Mode in Right Rail (Column 3): Multi-Platform & Multi-Format Live Proof
  const [previewPlatform, setPreviewPlatform] = useState<'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK'>('INSTAGRAM');
  const [previewTab, setPreviewTab] = useState<'FEED' | 'STORY' | 'REEL'>('FEED');

  // Cadence
  const [publishMode, setPublishMode] = useState<'NOW' | 'SCHEDULED'>('NOW');
  const [scheduledDate, setScheduledDate] = useState('2026-10-24');
  const [scheduledTime, setScheduledTime] = useState('09:15');

  // Active Workspace Entity
  const activeWorkspace = useMemo(() => {
    const matched = WORKSPACES_DATA.find((w) => w.id === activeWorkspaceId);
    if (matched) return matched;
    const user = typeof window !== 'undefined' ? getCurrentUser() : null;
    return {
      id: activeWorkspaceId || 'my-studio',
      name: user?.name ? `${user.name} Studio` : 'My Studio',
      category: 'Workspace',
      badgeColor: 'bg-brand-indigo',
    };
  }, [activeWorkspaceId]);

  const targetWsId =
    activeWorkspaceId &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activeWorkspaceId)
      ? activeWorkspaceId
      : (typeof window !== 'undefined' ? getCurrentUser()?.activeWorkspaceId : '') || '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('retzpost_draft_ws_acme');
      localStorage.removeItem('retzpost_draft_ws_creator');
      localStorage.removeItem('retzpost_draft_ws_main');
      localStorage.removeItem('retzpost_draft_ws_brand');

      const user = getCurrentUser();
      if (
        user?.activeWorkspaceId &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.activeWorkspaceId)
      ) {
        setActiveWorkspaceId(user.activeWorkspaceId);
      }
    }
  }, []);

  useEffect(() => {
    async function loadRealAccounts() {
      try {
        const res = await fetch(`/api/connections/accounts?workspaceId=${targetWsId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.accounts) && data.accounts.length > 0) {
            const mapped: DestinationAccount[] = data.accounts.map((acc: any) => {
              const platform = acc.platform as 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK';
              let platformGroup: DestinationAccount['platformGroup'] = 'Other';
              if (platform === 'INSTAGRAM') platformGroup = 'Instagram';
              else if (platform === 'FACEBOOK') platformGroup = 'Facebook';
              else if (platform === 'YOUTUBE') platformGroup = 'YouTube';
              else if (platform === 'TIKTOK') platformGroup = 'TikTok';

              const avatarBg =
                platform === 'INSTAGRAM'
                  ? 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]'
                  : platform === 'FACEBOOK'
                  ? 'bg-[#1877F2]'
                  : platform === 'YOUTUBE'
                  ? 'bg-[#FF0000]'
                  : 'bg-ink-primary';

              const avatarText =
                platform === 'INSTAGRAM'
                  ? 'IG'
                  : platform === 'FACEBOOK'
                  ? 'FB'
                  : platform === 'YOUTUBE'
                  ? 'YT'
                  : 'TT';

              return {
                id: acc.id,
                workspaceId: acc.workspaceId,
                platform,
                platformGroup,
                name: acc.displayName,
                handle: acc.handle,
                badge: platform === 'YOUTUBE' ? 'Shorts/Long' : `${platformGroup} Page`,
                avatarBg,
                avatarText,
                capabilities: {
                  feed: { supported: true, label: platform === 'YOUTUBE' ? 'Full Video (16:9)' : 'Feed' },
                  story: { supported: platform === 'FACEBOOK' || platform === 'INSTAGRAM', label: platform === 'FACEBOOK' || platform === 'INSTAGRAM' ? 'Story' : '—' },
                  reel: { supported: true, label: platform === 'YOUTUBE' ? 'Shorts (9:16)' : 'Reel' },
                },
              };
            });
            setRealAccounts(mapped);

            setPlacements((prev) => {
              const next = { ...prev };
              const hasAny = Object.values(next).some(Boolean);
              if (!hasAny) {
                mapped.forEach((acc) => {
                  next[`${acc.id}_feed`] = true;
                });
              }
              return next;
            });
          } else {
            setRealAccounts([]);
          }
        }
      } catch (err) {
        console.error('Failed to load real accounts for composer:', err);
      }
    }
    loadRealAccounts();
  }, [targetWsId]);

  // Active Channels Filtered by Workspace
  const workspaceChannels = useMemo(() => {
    return realAccounts;
  }, [realAccounts]);

  const handlePublishDispatch = async () => {
    const activeAccountIds = Array.from(
      new Set(
        Object.entries(placements)
          .filter(([key, val]) => {
            if (!val) return false;
            const [accId, format] = key.split('_') as [string, 'feed' | 'story' | 'reel'];
            const acc = workspaceChannels.find((a) => a.id === accId);
            if (!acc) return false;
            return getFormatValidation(format, acc).eligible;
          })
          .map(([key]) => key.split('_')[0])
      )
    );

    if (activeAccountIds.length === 0) {
      alert(locale === 'th' ? 'กรุณาเลือกช่องทางปลายทางอย่างน้อย 1 ช่องทาง' : 'Please select at least one target channel');
      return;
    }

    if (!workingTitle.trim()) {
      alert(locale === 'th' ? 'กรุณาระบุหัวข้อเรื่องก่อนดำเนินการเผยแพร่' : 'Please provide a story title before publishing');
      return;
    }

    setIsPublishing(true);
    try {
      // 1. Create content draft
      const contentRes = await fetch('/api/contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: targetWsId,
          workingTitle: workingTitle.trim(),
          sharedCaption: sharedCaption.trim() || undefined,
          sharedTags: sharedTags ? sharedTags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        }),
      });

      if (!contentRes.ok) {
        const err = await contentRes.json().catch(() => ({}));
        throw new Error(err.message || err.error || 'Failed to create content');
      }

      const { content } = await contentRes.json();

      // 2. Prepare scheduled date if in SCHEDULED mode
      let scheduledForUtc: string | null = null;
      if (publishMode === 'SCHEDULED') {
        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}:00+07:00`);
        scheduledForUtc = scheduledDateTime.toISOString();
      }

      // 3. Create publish batch
      const batchRes = await fetch('/api/publish-batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: targetWsId,
          contentId: content.id,
          targetAccountIds: activeAccountIds,
          mode: publishMode === 'NOW' ? 'PUBLISH_NOW' : 'SCHEDULED',
          scheduledForUtc,
        }),
      });

      if (!batchRes.ok) {
        const err = await batchRes.json().catch(() => ({}));
        throw new Error(err.message || err.error || 'Failed to dispatch publish batch');
      }

      // 4. Navigate to queue
      router.push('/publishing/queue');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(locale === 'th' ? `เกิดข้อผิดพลาดในการเผยแพร่: ${msg}` : `Dispatch error: ${msg}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Active Account for Live Proof Preview (Graceful fallback to workspace-branded account if not connected)
  const previewAccount = useMemo(() => {
    const matched = workspaceChannels.find((ch) => ch.platform === previewPlatform);
    if (matched) return matched;
    const cleanHandle = activeWorkspace.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const fallbacks: Record<string, DestinationAccount> = {
      INSTAGRAM: {
        id: `mock_ig_${activeWorkspaceId}`,
        workspaceId: activeWorkspaceId,
        platform: 'INSTAGRAM',
        platformGroup: 'Instagram',
        name: `${activeWorkspace.name}`,
        handle: `@${cleanHandle}_official`,
        badge: 'Instagram',
        avatarBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
        avatarText: 'IG',
        capabilities: { feed: { supported: true, label: 'Feed' }, story: { supported: true, label: 'Story' }, reel: { supported: true, label: 'Reel' } },
      },
      FACEBOOK: {
        id: `mock_fb_${activeWorkspaceId}`,
        workspaceId: activeWorkspaceId,
        platform: 'FACEBOOK',
        platformGroup: 'Facebook',
        name: `${activeWorkspace.name} Page`,
        handle: `${activeWorkspace.name} Official`,
        badge: 'Facebook Page',
        avatarBg: 'bg-[#1877F2]',
        avatarText: 'FB',
        capabilities: { feed: { supported: true, label: 'Feed' }, story: { supported: true, label: 'Story' }, reel: { supported: true, label: 'Reel' } },
      },
      YOUTUBE: {
        id: `mock_yt_${activeWorkspaceId}`,
        workspaceId: activeWorkspaceId,
        platform: 'YOUTUBE',
        platformGroup: 'YouTube',
        name: `${activeWorkspace.name} Studio`,
        handle: `@${cleanHandle}Studio`,
        badge: 'YouTube Channel',
        avatarBg: 'bg-[#FF0000]',
        avatarText: 'YT',
        capabilities: { feed: { supported: true, label: 'Full Video (16:9)' }, story: { supported: false, label: '—' }, reel: { supported: true, label: 'Shorts (9:16)' } },
      },
      TIKTOK: {
        id: `mock_tt_${activeWorkspaceId}`,
        workspaceId: activeWorkspaceId,
        platform: 'TIKTOK',
        platformGroup: 'TikTok',
        name: `${activeWorkspace.name}`,
        handle: `@${cleanHandle}`,
        badge: 'TikTok',
        avatarBg: 'bg-ink-primary',
        avatarText: 'TT',
        capabilities: { feed: { supported: true, label: 'Photos' }, story: { supported: true, label: 'Story' }, reel: { supported: true, label: 'Video' } },
      },
    };
    return fallbacks[previewPlatform] || workspaceChannels[0];
  }, [workspaceChannels, previewPlatform, activeWorkspaceId, activeWorkspace.name]);

  // Available platforms strictly filtered by current mediaMode (Unmatched platforms are hidden)
  const availablePreviewPlatforms = useMemo(() => {
    switch (mediaMode) {
      case 'VIDEO_LANDSCAPE':
        // Full Video 16:9: Only YouTube and Facebook Video support 16:9 widescreen
        return ['YOUTUBE', 'FACEBOOK'] as const;
      case 'PHOTOS':
        // Photos Carousel: Instagram, Facebook, TikTok (YouTube Studio API does not support photo posts)
        return ['INSTAGRAM', 'FACEBOOK', 'TIKTOK'] as const;
      case 'TEXT_ONLY':
        // Text Only: Only Facebook supports text status updates without media
        return ['FACEBOOK'] as const;
      case 'VIDEO':
      default:
        // Shorts 9:16: All 4 platforms support vertical reels/shorts
        return ['INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'TIKTOK'] as const;
    }
  }, [mediaMode]);

  // Available format sub-pills adapted dynamically per platform AND current mediaMode
  const platformFormats = useMemo(() => {
    const formats: { id: 'FEED' | 'STORY' | 'REEL'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [];

    if (previewPlatform === 'YOUTUBE') {
      if (mediaMode === 'VIDEO_LANDSCAPE') {
        formats.push({ id: 'FEED', label: 'Full Video (16:9)', icon: LayoutGrid });
      } else if (mediaMode === 'VIDEO') {
        formats.push({ id: 'REEL', label: 'Shorts (9:16)', icon: Film });
      }
    } else if (previewPlatform === 'FACEBOOK') {
      if (mediaMode === 'VIDEO_LANDSCAPE') {
        formats.push({ id: 'FEED', label: 'Video Feed (16:9)', icon: LayoutGrid });
      } else if (mediaMode === 'VIDEO') {
        formats.push({ id: 'REEL', label: 'Reels (9:16)', icon: Film });
        formats.push({ id: 'STORY', label: 'Story (24h)', icon: Smartphone });
      } else if (mediaMode === 'PHOTOS') {
        formats.push({ id: 'FEED', label: 'Photo Post', icon: LayoutGrid });
        formats.push({ id: 'STORY', label: 'Story (24h)', icon: Smartphone });
      } else if (mediaMode === 'TEXT_ONLY') {
        formats.push({ id: 'FEED', label: 'Page Post', icon: LayoutGrid });
      }
    } else if (previewPlatform === 'INSTAGRAM') {
      if (mediaMode === 'VIDEO') {
        formats.push({ id: 'REEL', label: 'Reels (9:16)', icon: Film });
        formats.push({ id: 'STORY', label: 'Story (24h)', icon: Smartphone });
      } else if (mediaMode === 'PHOTOS') {
        formats.push({ id: 'FEED', label: 'Feed Carousel', icon: LayoutGrid });
        formats.push({ id: 'STORY', label: 'Story (24h)', icon: Smartphone });
      }
    } else if (previewPlatform === 'TIKTOK') {
      if (mediaMode === 'VIDEO') {
        formats.push({ id: 'REEL', label: 'Video (9:16)', icon: Film });
        formats.push({ id: 'STORY', label: 'Story', icon: Smartphone });
      } else if (mediaMode === 'PHOTOS') {
        formats.push({ id: 'FEED', label: 'Photo Slide', icon: LayoutGrid });
        formats.push({ id: 'STORY', label: 'Story', icon: Smartphone });
      }
    }

    return formats;
  }, [previewPlatform, mediaMode]);

  const handleSelectPreviewPlatform = (plat: 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK') => {
    setPreviewPlatform(plat);
    // Find valid format for this platform under current mediaMode
    let nextTab: 'FEED' | 'STORY' | 'REEL' = 'FEED';
    if (plat === 'YOUTUBE') {
      nextTab = mediaMode === 'VIDEO_LANDSCAPE' ? 'FEED' : 'REEL';
    } else if (mediaMode === 'VIDEO') {
      nextTab = 'REEL';
    } else {
      nextTab = 'FEED';
    }
    setPreviewTab(nextTab);
  };

  // Keep previewPlatform & previewTab synchronized whenever mediaMode changes
  useEffect(() => {
    if (!availablePreviewPlatforms.includes(previewPlatform as any)) {
      const nextPlat = availablePreviewPlatforms[0] || 'FACEBOOK';
      setPreviewPlatform(nextPlat);
    }
  }, [availablePreviewPlatforms, previewPlatform]);

  useEffect(() => {
    const validTabIds = platformFormats.map((f) => f.id);
    if (validTabIds.length > 0 && !validTabIds.includes(previewTab)) {
      setPreviewTab(validTabIds[0]);
    }
  }, [platformFormats, previewTab]);

  // Active Custom Presets for this Workspace
  const activePresets = customPresetsMap[activeWorkspaceId] || [];

  // Listen to Global Workspace changes from AppShell Sidebar and other pages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('retzpost_active_project_id') || localStorage.getItem('retzpost_active_workspace_id');
      if (saved && WORKSPACES_DATA.some(w => w.id === saved)) {
        handleSwitchWorkspace(saved, false);
      }
      const handleWorkspaceSync = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        const incomingId = typeof customEvent.detail === 'object' && customEvent.detail !== null
          ? customEvent.detail.workspaceId
          : customEvent.detail;
        if (incomingId && WORKSPACES_DATA.some(w => w.id === incomingId)) {
          handleSwitchWorkspace(incomingId, false);
        }
      };
      window.addEventListener('retzpost:workspace-change', handleWorkspaceSync);
      return () => {
        window.removeEventListener('retzpost:workspace-change', handleWorkspaceSync);
      };
    }
  }, []);

  // Switch Workspace Handler
  const handleSwitchWorkspace = (workspaceId: string, broadcast = true) => {
    setActiveWorkspaceId(workspaceId);
    setIsWorkspaceMenuOpen(false);
    setSearchQuery('');
    setSelectedGroupFilter('ALL');

    if (broadcast && typeof window !== 'undefined') {
      localStorage.setItem('retzpost_active_project_id', workspaceId);
      localStorage.setItem('retzpost_active_workspace_id', workspaceId);
      window.dispatchEvent(new CustomEvent('retzpost:workspace-change', { detail: { workspaceId } }));
    }

    // Automatically load default preset or first preset of that workspace
    const presets = customPresetsMap[workspaceId] || [];
    if (presets.length > 0) {
      setPlacements(presets[0].targetPlacements);
    } else {
      setPlacements({});
    }
  };

  // Auto-Save Draft: Load saved draft on workspace change or initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activeWorkspaceId)) {
        setDraftRestoredNotice(false);
        return;
      }
      const draftKey = `retzpost_draft_${activeWorkspaceId}`;
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.workingTitle) setWorkingTitle(parsed.workingTitle);
          if (parsed.sharedCaption) setSharedCaption(parsed.sharedCaption);
          if (parsed.storyLinkUrl !== undefined) setStoryLinkUrl(parsed.storyLinkUrl);
          if (parsed.sharedTags !== undefined) setSharedTags(parsed.sharedTags);
          if (parsed.mediaMode) setMediaMode(parsed.mediaMode);
          if (parsed.placements) setPlacements(parsed.placements);
          if (parsed.savedAt) setLastSavedDraftTime(parsed.savedAt);
          setDraftRestoredNotice(true);
        } catch (e) {
          console.error('Failed to parse draft from localStorage', e);
        }
      } else {
        setDraftRestoredNotice(false);
      }
    }
  }, [activeWorkspaceId]);

  // Auto-Save Draft: Debounced save when user edits fields
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activeWorkspaceId)) return;
    const timer = setTimeout(() => {
      const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const draftKey = `retzpost_draft_${activeWorkspaceId}`;
      const payload = {
        workingTitle,
        sharedCaption,
        storyLinkUrl,
        sharedTags,
        mediaMode,
        placements,
        savedAt: nowStr
      };
      localStorage.setItem(draftKey, JSON.stringify(payload));
      setLastSavedDraftTime(nowStr);
    }, 600);
    return () => clearTimeout(timer);
  }, [workingTitle, sharedCaption, storyLinkUrl, sharedTags, mediaMode, placements, activeWorkspaceId]);

  const handleClearDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`retzpost_draft_${activeWorkspaceId}`);
      localStorage.removeItem('retzpost_draft_ws_acme');
      localStorage.removeItem('retzpost_draft_ws_creator');
      localStorage.removeItem('retzpost_draft_ws_main');
      localStorage.removeItem('retzpost_draft_ws_brand');
    }
    setWorkingTitle('');
    setSharedCaption('');
    setStoryLinkUrl('');
    setSharedTags('');
    setLastSavedDraftTime(null);
    setDraftRestoredNotice(false);
  };

  // Master Media Mode Switcher with Auto-Sync & Incompatible Placements Auto-Cleaning
  const handleSwitchMediaMode = (newMode: MediaTypeMode) => {
    setMediaMode(newMode);

    // 1. Determine compatible platform & format for Live Proof preview
    let targetPlatform: 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK' = 'INSTAGRAM';
    let targetTab: 'FEED' | 'STORY' | 'REEL' = 'FEED';

    if (newMode === 'VIDEO_LANDSCAPE') {
      targetPlatform = 'YOUTUBE';
      targetTab = 'FEED';
    } else if (newMode === 'VIDEO') {
      targetPlatform = previewPlatform === 'YOUTUBE' ? 'YOUTUBE' : (previewPlatform || 'INSTAGRAM');
      targetTab = 'REEL';
    } else if (newMode === 'PHOTOS') {
      targetPlatform = previewPlatform === 'YOUTUBE' ? 'INSTAGRAM' : (previewPlatform || 'INSTAGRAM');
      targetTab = 'FEED';
    } else if (newMode === 'TEXT_ONLY') {
      targetPlatform = 'FACEBOOK';
      targetTab = 'FEED';
    }

    setPreviewPlatform(targetPlatform);
    setPreviewTab(targetTab);

    // 2. Auto-Clean incompatible placements & Auto-select primary for new mode
    setPlacements((prev) => {
      const next: Record<string, boolean> = {};
      let hasValid = false;

      Object.entries(prev).forEach(([key, val]) => {
        if (!val) return;
        const [accId, format] = key.split('_') as [string, 'feed' | 'story' | 'reel'];
        const acc = workspaceChannels.find((a) => a.id === accId);
        if (acc) {
          let isEligible = true;
          if (format === 'reel' && newMode !== 'VIDEO') isEligible = false;
          if (format === 'story' && (newMode === 'TEXT_ONLY' || newMode === 'VIDEO_LANDSCAPE')) isEligible = false;
          if (format === 'feed') {
            if (newMode === 'TEXT_ONLY' && acc.platform !== 'FACEBOOK') isEligible = false;
            if (newMode === 'VIDEO_LANDSCAPE' && acc.platform !== 'YOUTUBE' && acc.platform !== 'FACEBOOK') isEligible = false;
            if (acc.platform === 'YOUTUBE' && newMode !== 'VIDEO_LANDSCAPE') isEligible = false;
            if (acc.platform === 'TIKTOK' && (newMode === 'VIDEO' || newMode === 'VIDEO_LANDSCAPE')) isEligible = false;
          }
          if (isEligible) {
            next[key] = true;
            hasValid = true;
          }
        }
      });

      // If no valid placements remained, auto-select primary channel for this mode
      if (!hasValid) {
        if (newMode === 'VIDEO_LANDSCAPE') {
          const ytAcc = workspaceChannels.find((c) => c.platform === 'YOUTUBE');
          if (ytAcc) next[`${ytAcc.id}_feed`] = true;
        } else if (newMode === 'VIDEO') {
          const firstReel = workspaceChannels.find((c) => c.capabilities.reel.supported);
          if (firstReel) next[`${firstReel.id}_reel`] = true;
        } else if (newMode === 'PHOTOS') {
          const firstFeed = workspaceChannels.find((c) => c.platform !== 'YOUTUBE' && c.capabilities.feed.supported);
          if (firstFeed) next[`${firstFeed.id}_feed`] = true;
        } else if (newMode === 'TEXT_ONLY') {
          const fbAcc = workspaceChannels.find((c) => c.platform === 'FACEBOOK');
          if (fbAcc) next[`${fbAcc.id}_feed`] = true;
        }
      }

      return next;
    });
  };

  // Smart Validation Helper
  const getFormatValidation = (format: 'feed' | 'story' | 'reel', account: DestinationAccount) => {
    const capability = account.capabilities[format];
    if (!capability || !capability.supported) {
      return { eligible: false, reason: 'Platform API does not support this format' };
    }

    if (format === 'reel') {
      if (mediaMode === 'VIDEO_LANDSCAPE') {
        return { eligible: false, reason: locale === 'en' ? 'Shorts/Reels require 9:16 vertical video (switch tab to Shorts/Reels)' : 'Shorts/Reels ต้องการวิดีโอแนวตั้ง 9:16 (สลับแท็บเป็น Shorts/Reels)' };
      }
      if (mediaMode !== 'VIDEO') {
        return { eligible: false, reason: locale === 'en' ? 'Requires 9:16 vertical MP4/MOV video file' : 'ต้องการไฟล์วิดีโอ MP4/MOV แนวตั้ง 9:16' };
      }
      return { eligible: true };
    }

    if (format === 'story') {
      if (mediaMode === 'TEXT_ONLY') {
        return { eligible: false, reason: locale === 'en' ? '24h Stories require image or video media' : '24h Stories ต้องการรูปภาพหรือวิดีโอ' };
      }
      if (mediaMode === 'VIDEO_LANDSCAPE') {
        return { eligible: false, reason: locale === 'en' ? '24h Stories require 9:16 vertical image or video' : '24h Stories ต้องการรูปภาพหรือวิดีโอแนวตั้ง 9:16' };
      }
      return { eligible: true };
    }

    if (format === 'feed') {
      if (mediaMode === 'TEXT_ONLY' && account.platform === 'INSTAGRAM') {
        return { eligible: false, reason: locale === 'en' ? 'Instagram Feed requires image or video media' : 'Instagram Feed ต้องการรูปภาพหรือวิดีโอ' };
      }
      if (mediaMode === 'TEXT_ONLY' && (account.platform === 'YOUTUBE' || account.platform === 'TIKTOK')) {
        return { eligible: false, reason: locale === 'en' ? 'Requires image or video media' : 'ต้องการรูปภาพหรือวิดีโอ' };
      }
      if (mediaMode === 'VIDEO_LANDSCAPE') {
        if (account.platform === 'INSTAGRAM' || account.platform === 'TIKTOK') {
          return { eligible: false, reason: locale === 'en' ? 'Full Video 16:9 Landscape is only supported on YouTube and Facebook Video (Instagram and TikTok require 9:16 vertical)' : 'Full Video 16:9 แนวนอน รองรับเฉพาะ YouTube และ Facebook Video (Instagram และ TikTok รองรับเฉพาะแนวตั้ง 9:16)' };
        }
      }
      if (account.platform === 'TIKTOK') {
        if (mediaMode === 'VIDEO' || mediaMode === 'VIDEO_LANDSCAPE') {
          return { eligible: false, reason: locale === 'en' ? 'TikTok Feed is designed for Photo Slides (for video use TikTok Video/Reel 9:16)' : 'TikTok Feed ออกแบบสำหรับ Photo Slide (วิดีโอให้ใช้ TikTok Video/Reel 9:16)' };
        }
      }
      if (account.platform === 'YOUTUBE') {
        if (mediaMode === 'PHOTOS') {
          return { eligible: false, reason: locale === 'en' ? 'YouTube Studio API does not support single/album photo dispatches' : 'YouTube Studio API ไม่รองรับการโพสต์รูปภาพเดี่ยว/อัลบั้ม' };
        }
        if (mediaMode !== 'VIDEO_LANDSCAPE') {
          return { eligible: false, reason: locale === 'en' ? 'YouTube Video requires 16:9 Full Video' : 'YouTube Video ต้องการ Full Video (16:9)' };
        }
      }
      return { eligible: true };
    }

    return { eligible: true };
  };

  // Two-Way Sync to Live Proof Preview
  const syncPreviewToAccount = (account: DestinationAccount, format: 'feed' | 'story' | 'reel') => {
    if (availablePreviewPlatforms.includes(account.platform as any)) {
      setPreviewPlatform(account.platform as any);
      if (account.platform === 'YOUTUBE') {
        setPreviewTab(mediaMode === 'VIDEO_LANDSCAPE' ? 'FEED' : 'REEL');
      } else if (format === 'reel') {
        setPreviewTab('REEL');
      } else if (format === 'story') {
        setPreviewTab('STORY');
      } else {
        setPreviewTab('FEED');
      }
    }
  };

  // Toggle Single Placement with Realtime Preview Sync
  const togglePlacement = (accountId: string, format: 'feed' | 'story' | 'reel', account: DestinationAccount) => {
    const val = getFormatValidation(format, account);
    if (!val.eligible) return;

    const key = `${accountId}_${format}`;
    const nextVal = !placements[key];
    setPlacements((prev) => ({ ...prev, [key]: nextVal }));

    if (nextVal) {
      syncPreviewToAccount(account, format);
    }
  };

  // 1-Click Card Row Toggle: Activates primary format with Realtime Preview Sync
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
    if (mediaMode === 'VIDEO_LANDSCAPE') {
      preferredFormat = 'feed';
    } else if (mediaMode === 'VIDEO' && account.capabilities.reel.supported) {
      preferredFormat = 'reel';
    } else if (account.capabilities.feed.supported) {
      preferredFormat = 'feed';
    } else if (account.capabilities.reel.supported) {
      preferredFormat = 'reel';
    }

    const val = getFormatValidation(preferredFormat, account);
    if (val.eligible) {
      setPlacements(prev => ({ ...prev, [`${account.id}_${preferredFormat}`]: true }));
      syncPreviewToAccount(account, preferredFormat);
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
      icon: 'award-star',
      targetPlacements: { ...placements },
    };

    setCustomPresetsMap(prev => ({
      ...prev,
      [activeWorkspaceId]: [...(prev[activeWorkspaceId] || []), newRecipe],
    }));

    setNewPresetName('');
    setIsSavePresetModalOpen(false);
  };

  // Toggle to hide incompatible channels for current mediaMode (Defaults to true for clean matching)
  const [hideIncompatibleChannels, setHideIncompatibleChannels] = useState<boolean>(true);

  // Helper to check if an account has any eligible format under current mediaMode
  const isAccountCompatibleWithMedia = useCallback((acc: DestinationAccount) => {
    return (
      getFormatValidation('feed', acc).eligible ||
      getFormatValidation('story', acc).eligible ||
      getFormatValidation('reel', acc).eligible
    );
  }, [mediaMode]);

  // Filtered Accounts by search & group
  const filteredAccounts = useMemo(() => {
    return workspaceChannels.filter((acc) => {
      const matchesGroup = selectedGroupFilter === 'ALL' || acc.platformGroup === selectedGroupFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || acc.name.toLowerCase().includes(q) || acc.handle.toLowerCase().includes(q) || acc.badge.toLowerCase().includes(q);
      return matchesGroup && matchesSearch;
    });
  }, [workspaceChannels, searchQuery, selectedGroupFilter]);

  // Separate accounts into compatible and incompatible for current mediaMode
  const { compatibleAccounts, incompatibleAccounts } = useMemo(() => {
    const comp: DestinationAccount[] = [];
    const incomp: DestinationAccount[] = [];
    filteredAccounts.forEach((acc) => {
      if (isAccountCompatibleWithMedia(acc)) {
        comp.push(acc);
      } else {
        incomp.push(acc);
      }
    });
    return { compatibleAccounts: comp, incompatibleAccounts: incomp };
  }, [filteredAccounts, isAccountCompatibleWithMedia]);

  // Group accounts by platformGroup for presentation (dynamically hides incompatible channels when toggled)
  const groupedAccounts = useMemo(() => {
    const map = new Map<string, DestinationAccount[]>();
    const accountsToGroup = hideIncompatibleChannels ? compatibleAccounts : filteredAccounts;
    accountsToGroup.forEach((acc) => {
      const list = map.get(acc.platformGroup) || [];
      list.push(acc);
      map.set(acc.platformGroup, list);
    });
    return map;
  }, [compatibleAccounts, filteredAccounts, hideIncompatibleChannels]);

  // Check if all platform groups are currently collapsed
  const isAllGroupsCollapsed = useMemo(() => {
    const keys = Array.from(groupedAccounts.keys());
    if (keys.length === 0) return false;
    return keys.every((k) => collapsedGroups[k] === true);
  }, [groupedAccounts, collapsedGroups]);

  const toggleAllGroups = () => {
    if (isAllGroupsCollapsed) {
      setCollapsedGroups({});
    } else {
      const all: Record<string, boolean> = {};
      Array.from(groupedAccounts.keys()).forEach((k) => {
        all[k] = true;
      });
      setCollapsedGroups(all);
    }
  };

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

  // Safe-Zone Guide Overlay Component for 9:16 Video / Reels / Shorts / TikTok / Story
  const SafeZoneOverlay = () => (
    <div className="absolute inset-0 z-30 pointer-events-none rounded-[20px] overflow-hidden border border-semantic-warning/60 animate-in fade-in duration-150">
      {/* Top Safe Margin (15%) */}
      <div className="absolute top-0 left-0 right-0 h-[15%] bg-semantic-warning/15 border-b border-dashed border-semantic-warning/70 flex items-center justify-center">
        <span className="text-[7px] font-mono text-semantic-warning font-bold bg-black/85 px-1.5 py-0.5 rounded shadow">
          Profile & Status Bar (15%)
        </span>
      </div>
      {/* Bottom Safe Margin (25%) */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-semantic-warning/15 border-t border-dashed border-semantic-warning/70 flex items-center justify-center">
        <span className="text-[7px] font-mono text-semantic-warning font-bold bg-black/85 px-1.5 py-0.5 rounded shadow">
          Caption & Sound Marquee (25%)
        </span>
      </div>
      {/* Right Safe Margin (18%) */}
      <div className="absolute top-[15%] bottom-[25%] right-0 w-[18%] bg-semantic-warning/15 border-l border-dashed border-semantic-warning/70 flex items-center justify-center">
        <span className="text-[6px] font-mono text-semantic-warning font-bold rotate-90 whitespace-nowrap bg-black/85 px-1 rounded shadow">
          Action Rail (18%)
        </span>
      </div>
      {/* Center 1:1 IG Grid Preview Box */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square border border-semantic-info/60 pointer-events-none flex items-start justify-end p-1">
        <span className="text-[6px] font-mono text-semantic-info font-bold bg-black/85 px-1 rounded shadow">
          1:1 Feed Grid
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Masthead Header */}
      <Masthead
        folio={locale === 'th' ? 'แท่นพิมพ์สตูดิโอ / โต๊ะประพันธ์ 3 คอลัมน์' : 'STUDIO DESK / 3-COLUMN WORKBENCH'}
        editionDate={locale === 'th' ? 'รองรับหลายโครงการและพรีเซ็ตพร้อมใช้งาน' : 'MULTI-PROJECT & PRESETS READY'}
        title={t('create.pageTitle')}
        subtitle={t('create.pageSubtitle')}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Identity & Role Tester */}
            <div className="flex items-center gap-2 px-2.5 py-1 bg-paper-raised border border-border-rule rounded-editorial text-xs shadow-2xs">
              <div className="w-5 h-5 rounded-full bg-brand-indigo/15 text-brand-indigo flex items-center justify-center font-bold text-[9px] shrink-0 border border-brand-indigo/30">
                NC
              </div>
              <span className="text-ink-secondary text-[11px] font-sans">
                {locale === 'th' ? 'บทบาท:' : 'Role:'}
              </span>

              <CustomDropdown
                options={[
                  { 
                    value: 'OWNER', 
                    label: locale === 'en' ? 'Owner (Full Access)' : 'Owner (เจ้าของ)', 
                    icon: <Sticker name="role-owner" size="xs" />,
                    badge: 'Owner', 
                    badgeColor: 'bg-brand-indigo/15 text-brand-indigo' 
                  },
                  { 
                    value: 'MANAGER', 
                    label: locale === 'en' ? 'Manager (Direct Publish)' : 'Manager (ยิงสด)', 
                    icon: <Sticker name="role-manager" size="xs" />,
                    badge: 'Manager', 
                    badgeColor: 'bg-semantic-info/15 text-semantic-info' 
                  },
                  { 
                    value: 'EDITOR', 
                    label: locale === 'en' ? 'Editor (Direct Publish)' : 'Editor (ยิงสด)', 
                    icon: <Sticker name="role-editor" size="xs" />,
                    badge: 'Editor', 
                    badgeColor: 'bg-brand-indigo/15 text-brand-indigo' 
                  },
                  { 
                    value: 'CONTRIBUTOR', 
                    label: locale === 'en' ? 'Contributor (Approval Flow)' : 'Contributor (รออนุมัติ)', 
                    icon: <Sticker name="role-contributor" size="xs" />,
                    badge: 'Approval', 
                    badgeColor: 'bg-accent-terracotta/15 text-accent-terracotta' 
                  },
                  { 
                    value: 'VIEWER', 
                    label: locale === 'en' ? 'Viewer (Read-Only)' : 'Viewer (อ่านอย่างเดียว)', 
                    icon: <Sticker name="role-viewer" size="xs" />,
                    badge: 'Read-only', 
                    badgeColor: 'bg-paper-subtle text-ink-secondary' 
                  },
                ]}
                value={currentRole}
                onChange={(val) => setCurrentRole(val as WorkspaceRole)}
                size="sm"
                fullWidth={false}
                className="w-52"
              />

              <Link
                href="/settings/team"
                className="text-[10px] font-mono text-brand-indigo hover:underline font-semibold ml-0.5"
                title={locale === 'en' ? 'Manage Team RBAC' : 'จัดการสิทธิ์ทีม'}
              >
                {locale === 'en' ? 'Team →' : 'ทีม →'}
              </Link>
            </div>

            <span className="text-xs font-mono text-brand-indigo font-semibold px-2.5 py-1.5 bg-brand-indigo/10 rounded-editorial border border-brand-indigo/20">
              {totalActivePlacements} Active Placements
            </span>
          </div>
        }
      />

      {/* APPROVAL SUBMITTED TOAST NOTIFICATION */}
      {submittedForApprovalNotice && (
        <div className="p-3 bg-semantic-success/10 border border-semantic-success/30 text-semantic-success rounded-editorial text-xs font-mono flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{submittedForApprovalNotice}</span>
          </div>
          <button onClick={() => setSubmittedForApprovalNotice(null)} className="hover:opacity-75 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MOBILE / TABLET RESPONSIVE TAB SWITCHER */}
      <div className="xl:hidden flex items-center p-1 bg-paper-raised border border-border-rule rounded-editorial text-xs">
        <button
          type="button"
          onClick={() => setMobileTab('DESTINATIONS')}
          className={`flex-1 py-2 text-center font-mono font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === 'DESTINATIONS'
              ? 'bg-brand-indigo text-white font-semibold shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Destinations ({totalActivePlacements})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('CANVAS')}
          className={`flex-1 py-2 text-center font-mono font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === 'CANVAS'
              ? 'bg-brand-indigo text-white font-semibold shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Creative Canvas</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('PROOF')}
          className={`flex-1 py-2 text-center font-mono font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === 'PROOF'
              ? 'bg-brand-indigo text-white font-semibold shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Live Proof</span>
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
          {/* Column 1 Clean Header: Target Channels + Project Pill Badge + Clear */}
          <div className="flex items-center justify-between pb-2.5 border-b border-border-rule">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold font-sans text-ink-primary shrink-0 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-indigo" />
                <span>Target Channels</span>
              </span>

              {/* Compact Project Switcher Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-brand-indigo/10 hover:bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/20 transition-colors cursor-pointer truncate max-w-[170px]"
                  title={locale === 'en' ? 'Click to switch workspace' : 'คลิกเพื่อสลับโปรเจกต์'}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeWorkspace.badgeColor} shrink-0`} />
                  <span className="truncate">{activeWorkspace.name}</span>
                  <ChevronDown className="w-2.5 h-2.5 opacity-60 shrink-0" />
                </button>

                {/* Compact Popover if user clicks the pill */}
                {isWorkspaceMenuOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-60 bg-paper-raised border border-border-strong rounded-editorial shadow-lg p-1.5 z-40 space-y-1">
                    <div className="px-2 py-0.5 text-[9px] font-mono uppercase text-ink-secondary font-bold">
                      Switch Project:
                    </div>
                    {WORKSPACES_DATA.map((ws) => (
                      <button
                        key={ws.id}
                        type="button"
                        onClick={() => handleSwitchWorkspace(ws.id)}
                        className={`w-full flex items-center justify-between p-1.5 rounded text-left transition-colors text-xs ${
                          ws.id === activeWorkspaceId
                            ? 'bg-paper-canvas text-brand-indigo font-semibold shadow-2xs border border-border-rule'
                            : 'hover:bg-paper-subtle text-ink-primary'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className={`w-2 h-2 rounded-full ${ws.badgeColor} shrink-0`} />
                          <div className="truncate">
                            <p className="leading-tight truncate text-[11px]">{ws.name}</p>
                            <p className="text-[9px] font-mono text-ink-secondary">{ws.category}</p>
                          </div>
                        </div>
                        {ws.id === activeWorkspaceId && (
                          <Check className="w-3 h-3 text-brand-indigo shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => applyUniversalPreset('CLEAR')}
              className="text-[10px] font-mono text-ink-secondary hover:text-accent-terracotta hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
              title="Deselect all channels"
            >
              <RotateCcw className="w-2.5 h-2.5 text-accent-terracotta" />
              <span>Clear</span>
            </button>
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
                <span>Save Preset</span>
              </button>
            </div>

            {/* Level 1: Universal Smart Buttons */}
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => applyUniversalPreset('FEEDS')}
                className="py-1 px-1 rounded text-[10px] font-mono font-semibold bg-brand-indigo text-white hover:bg-brand-indigo-hover transition-colors shadow-2xs text-center truncate flex items-center justify-center gap-1"
                title="Select all Feed placements in this workspace"
              >
                <LayoutGrid className="w-3 h-3 shrink-0" />
                <span>{mediaMode === 'VIDEO_LANDSCAPE' ? 'Full Videos' : 'All Feeds'}</span>
              </button>
              <button
                type="button"
                disabled={mediaMode === 'TEXT_ONLY' || mediaMode === 'VIDEO_LANDSCAPE'}
                onClick={() => applyUniversalPreset('STORIES')}
                className={`py-1 px-1 rounded text-[10px] font-mono font-semibold transition-colors shadow-2xs text-center truncate flex items-center justify-center gap-1 ${
                  mediaMode !== 'TEXT_ONLY' && mediaMode !== 'VIDEO_LANDSCAPE'
                    ? 'bg-accent-terracotta text-white hover:opacity-90'
                    : 'bg-paper-canvas text-ink-secondary/40 border border-border-rule cursor-not-allowed'
                }`}
                title="Select all Stories in this workspace"
              >
                <Smartphone className="w-3 h-3 shrink-0" />
                <span>All Stories</span>
              </button>
              <button
                type="button"
                disabled={mediaMode !== 'VIDEO'}
                onClick={() => applyUniversalPreset('REELS')}
                className={`py-1 px-1 rounded text-[10px] font-mono font-semibold transition-colors shadow-2xs text-center truncate flex items-center justify-center gap-1 ${
                  mediaMode === 'VIDEO'
                    ? 'bg-semantic-info text-white hover:opacity-90'
                    : 'bg-paper-canvas text-ink-secondary/40 border border-border-rule cursor-not-allowed'
                }`}
                title="Select all Reels/Shorts in this workspace"
              >
                <Film className="w-3 h-3 shrink-0" />
                <span>All Reels</span>
              </button>
            </div>

            {/* Level 2: Project-Specific Custom Recipes */}
            {activePresets.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-border-rule/60">
                <span className="text-[8px] font-mono text-ink-secondary uppercase block font-semibold">
                  Custom Recipes:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activePresets.map((recipe) => (
                    <button
                      key={recipe.id}
                      type="button"
                      onClick={() => applyPreset(recipe)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-primary transition-colors flex items-center gap-1.5 shadow-2xs text-left"
                      title={recipe.description}
                    >
                      <Sticker name={recipe.icon} size="xs" inline />
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
            {(['ALL', 'Instagram', 'Facebook', 'YouTube', 'TikTok', 'X', 'Lemon8'] as const).map((grp) => {
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

          {/* Quick Header: Channel Count & Collapse/Expand All Toggle */}
          <div className="flex items-center justify-between text-[10px] font-mono text-ink-secondary px-0.5 pt-0.5">
            <span>
              {locale === 'en' ? `Target Channels (${compatibleAccounts.length}/${filteredAccounts.length})` : `ช่องทางพร้อมโพสต์ (${compatibleAccounts.length}/${filteredAccounts.length})`}
            </span>
            <div className="flex items-center gap-2">
              {incompatibleAccounts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setHideIncompatibleChannels(!hideIncompatibleChannels)}
                  className="text-brand-indigo hover:underline font-semibold cursor-pointer transition-colors"
                >
                  {hideIncompatibleChannels ? (locale === 'en' ? 'Show All' : 'แสดงทั้งหมด') : (locale === 'en' ? 'Hide Incompatible' : 'ซ่อนที่ไม่รองรับ')}
                </button>
              )}
              {groupedAccounts.size > 1 && (
                <button
                  type="button"
                  onClick={toggleAllGroups}
                  className="text-brand-indigo hover:underline font-semibold cursor-pointer flex items-center gap-0.5 transition-colors"
                  title={isAllGroupsCollapsed ? (locale === 'en' ? 'Expand All' : 'กางทุกแพลตฟอร์ม') : (locale === 'en' ? 'Collapse All' : 'พับทุกแพลตฟอร์ม')}
                >
                  <span>{isAllGroupsCollapsed ? (locale === 'en' ? '▾ Expand All' : '▾ กางทั้งหมด') : (locale === 'en' ? '▴ Collapse All' : '▴ พับทั้งหมด')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Channel List Scoped to Active Project with 1-Click Card Activation */}
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto pr-1 space-y-3">
            {groupedAccounts.size === 0 ? (
              <div className="p-6 text-center rounded-editorial bg-paper-canvas border border-dashed border-border-rule space-y-3">
                <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-paper-raised border border-border-rule shadow-2xs">
                  <Sticker name="vault-keyhole" size="md" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-xs text-ink-primary">
                    {locale === 'en' ? 'No channels connected for this workspace' : 'ยังไม่มีช่องทางสำหรับโปรเจกต์นี้'}
                  </h4>
                  <p className="text-[11px] text-ink-secondary leading-snug">
                    {locale === 'en' ? 'Connect Facebook, Instagram, TikTok, or YouTube to start distributing dispatches.' : 'เปิดใช้งานหรือเชื่อมต่อเพจ Facebook, Instagram, TikTok หรือ YouTube เพื่อเริ่มกระจายโพสต์'}
                  </p>
                </div>
                <Link
                  href="/accounts"
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-editorial bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-mono font-semibold transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{locale === 'en' ? 'Configure in /accounts' : 'ตั้งค่าช่องทางใน /accounts'}</span>
                </Link>
              </div>
            ) : (
              Array.from(groupedAccounts.entries()).map(([groupName, accounts]) => {
              const isCollapsed = collapsedGroups[groupName] === true;
              const activeCountInGroup = accounts.reduce((accCount, acc) => {
                const isFeed = placements[`${acc.id}_feed`];
                const isStory = placements[`${acc.id}_story`];
                const isReel = placements[`${acc.id}_reel`];
                return accCount + (isFeed ? 1 : 0) + (isStory ? 1 : 0) + (isReel ? 1 : 0);
              }, 0);

              return (
                <div key={groupName} className="space-y-1">
                  {/* Collapsible Group Header Button */}
                  <button
                    type="button"
                    onClick={() => toggleGroupCollapse(groupName)}
                    className="w-full flex items-center justify-between text-[10px] font-mono py-1 px-1 rounded hover:bg-paper-canvas border-b border-border-rule/80 transition-colors group/hdr cursor-pointer text-left"
                    title={isCollapsed ? (locale === 'en' ? `Expand ${groupName}` : `คลิกเพื่อกาง ${groupName}`) : (locale === 'en' ? `Collapse ${groupName}` : `คลิกเพื่อพับ ${groupName}`)}
                  >
                    <div className="flex items-center gap-1.5">
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-ink-secondary group-hover/hdr:text-brand-indigo transition-transform duration-200 ${
                          isCollapsed ? '-rotate-90' : ''
                        }`}
                      />
                      <span className="font-bold text-ink-primary uppercase tracking-wider group-hover/hdr:text-brand-indigo transition-colors">
                        {groupName}
                      </span>
                      <span className="text-[9px] text-ink-secondary">
                        ({accounts.length})
                      </span>
                    </div>

                    {/* Active Placements Badge in this group */}
                    {activeCountInGroup > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-brand-indigo/15 text-brand-indigo font-bold text-[9px] border border-brand-indigo/20">
                        {activeCountInGroup} Active
                      </span>
                    )}
                  </button>

                  {/* Individual Channel Cards (Visible when not collapsed) */}
                  {!isCollapsed && (
                    <div className="space-y-1.5 pt-0.5 animate-in fade-in duration-150">
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
                  )}
                </div>
              );
            })
            )}

            {/* Incompatible Channels Collapsible Summary Box */}
            {incompatibleAccounts.length > 0 && (
              <div className="p-2.5 rounded-editorial bg-paper-canvas border border-dashed border-border-rule/80 space-y-1.5 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-ink-secondary flex items-center gap-1.5 font-semibold">
                    <Lock className="w-3 h-3 text-ink-secondary" />
                    <span>
                      {locale === 'en' ? `Incompatible Channels${mediaMode === 'VIDEO_LANDSCAPE' ? ' (16:9 Landscape)' : mediaMode === 'PHOTOS' ? ' (Photos)' : mediaMode === 'TEXT_ONLY' ? ' (Text-Only)' : ''} (${incompatibleAccounts.length})` : `ช่องทางที่ไม่รองรับ${mediaMode === 'VIDEO_LANDSCAPE' ? ' 16:9 แนวนอน' : mediaMode === 'PHOTOS' ? 'ภาพเดี่ยว' : mediaMode === 'TEXT_ONLY' ? 'ข้อความล้วน' : ''} (${incompatibleAccounts.length})`}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setHideIncompatibleChannels(!hideIncompatibleChannels)}
                    className="text-[9px] font-mono text-brand-indigo hover:underline font-semibold cursor-pointer"
                  >
                    {hideIncompatibleChannels ? (locale === 'en' ? '▸ Show' : '▸ แสดงรายการ') : (locale === 'en' ? '▾ Hide' : '▾ ซ่อน')}
                  </button>
                </div>
                <p className="text-[9px] text-ink-secondary leading-snug">
                  {mediaMode === 'VIDEO_LANDSCAPE'
                    ? (locale === 'en' ? 'Instagram and TikTok require 9:16 vertical video (16:9 Landscape not supported)' : 'Instagram และ TikTok ต้องการวิดีโอแนวตั้ง 9:16 (ไม่รองรับ Full Video 16:9 แนวนอน)')
                    : mediaMode === 'PHOTOS'
                    ? (locale === 'en' ? 'YouTube Studio API does not support photo albums' : 'YouTube Studio API ไม่มีระบบโพสต์ภาพเดี่ยว/อัลบั้ม')
                    : mediaMode === 'TEXT_ONLY'
                    ? (locale === 'en' ? 'Instagram, TikTok, and YouTube require media assets' : 'Instagram, TikTok และ YouTube ต้องมีไฟล์มีเดียประกอบ')
                    : (locale === 'en' ? 'These channels do not match current media format' : 'ช่องทางเหล่านี้ไม่มีรูปแบบที่ตรงกับมีเดียปัจจุบัน')}
                </p>
                {!hideIncompatibleChannels && (
                  <div className="space-y-1 pt-1.5 border-t border-border-rule/60">
                    {incompatibleAccounts.map((acc) => (
                      <div key={acc.id} className="p-1.5 rounded bg-paper-subtle/60 text-[10px] text-ink-secondary flex items-center justify-between opacity-60">
                        <span className="truncate">{acc.name} ({acc.badge})</span>
                        <span className="font-mono text-[9px] text-accent-terracotta">{locale === 'en' ? 'Locked' : 'ล็อก'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-paper-subtle border border-border-rule rounded-editorial text-xs">
              <button
                type="button"
                onClick={() => handleSwitchMediaMode('PHOTOS')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors text-[11px] font-medium cursor-pointer ${
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
                onClick={() => handleSwitchMediaMode('VIDEO')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors text-[11px] font-medium cursor-pointer ${
                  mediaMode === 'VIDEO'
                    ? 'bg-paper-canvas text-semantic-info shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Shorts (9:16)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMediaMode('VIDEO_LANDSCAPE')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors text-[11px] font-medium cursor-pointer ${
                  mediaMode === 'VIDEO_LANDSCAPE'
                    ? 'bg-paper-canvas text-[#FF0000] shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <YouTubeLogo size={14} className="shrink-0" />
                <span>Full Video (16:9 YT)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMediaMode('TEXT_ONLY')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded transition-colors text-[11px] font-medium cursor-pointer ${
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

                {/* AI Media Hub Button */}
                <button
                  type="button"
                  onClick={() => setIsAiMediaModalOpen(true)}
                  className="aspect-square border-2 border-dashed border-brand-indigo/40 rounded-editorial flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:border-brand-indigo hover:bg-brand-indigo/5 transition-colors bg-paper-canvas/30 group"
                >
                  <Sparkles className="w-4 h-4 text-brand-indigo mb-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-serif font-medium text-brand-indigo">{locale === 'en' ? 'AI Media Hub' : 'เลือกจากคลัง AI'}</span>
                  <span className="text-[9px] font-mono text-ink-secondary">AI Assets Hub</span>
                </button>
              </div>
            )}

            {/* Video Card (Vertical 9:16) */}
            {mediaMode === 'VIDEO' && (
              videoAsset ? (
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
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-semantic-success/10 text-semantic-success text-[9px] font-mono font-semibold">
                      ✓ Validated
                    </span>
                    <button
                      type="button"
                      onClick={() => setVideoAsset(null)}
                      className="p-1 text-ink-secondary hover:text-accent-terracotta transition-colors"
                      title={locale === 'en' ? 'Remove Video' : 'ลบวิดีโอ'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border-rule rounded-editorial p-6 text-center bg-paper-canvas hover:border-brand-indigo/50 transition-colors">
                  <Film className="w-8 h-8 mx-auto text-brand-indigo/50 mb-2" />
                  <p className="text-xs font-semibold text-ink-primary">
                    {locale === 'en' ? 'Click or drag video file (MP4/MOV) here' : 'คลิกหรือลากไฟล์วิดีโอ มาวางที่นี่'}
                  </p>
                  <p className="text-[10px] font-mono text-ink-secondary mt-1">
                    {locale === 'en' ? 'Supports 9:16 vertical ratio (Reels/Shorts/TikTok) up to 1080x1920' : 'รองรับอัตราส่วน 9:16 (Reels/Shorts/TikTok) ความละเอียดสูงสุด 1080x1920'}
                  </p>
                </div>
              )
            )}

            {/* YouTube Full Video / Landscape 16:9 Card */}
            {mediaMode === 'VIDEO_LANDSCAPE' && (
              <div className="space-y-3">
                {videoAsset ? (
                  <div className="p-3 bg-paper-canvas border border-[#FF0000]/30 rounded-editorial flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-editorial bg-[#FF0000]/10 text-[#FF0000] flex items-center justify-center shrink-0 border border-[#FF0000]/20">
                        <Play className="w-5 h-5 fill-[#FF0000]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 bg-[#FF0000] text-white text-[9px] font-mono font-bold rounded">16:9 YT</span>
                          <h3 className="font-semibold text-xs text-ink-primary font-mono truncate max-w-[240px]">
                            {videoAsset.name}
                          </h3>
                        </div>
                        <p className="text-[10px] font-mono text-semantic-success mt-0.5">
                          {videoAsset.resolution} • {locale === 'en' ? 'Duration ' : 'ความยาว '}{videoAsset.duration} • 16:9 Landscape
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-semantic-success/10 text-semantic-success text-[9px] font-mono font-semibold">
                        ✓ 4K Ready
                      </span>
                      <button
                        type="button"
                        onClick={() => setVideoAsset(null)}
                        className="p-1 text-ink-secondary hover:text-accent-terracotta transition-colors"
                        title={locale === 'en' ? 'Remove Video' : 'ลบวิดีโอ'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setVideoAsset({
                        name: `${activeWorkspace.name.toLowerCase().replace(/\s+/g, '-')}-full-presentation-4k.mp4`,
                        size: '342 MB',
                        resolution: '3840x2160 (4K UHD 16:9)',
                        duration: '14:28'
                      });
                    }}
                    className="border-2 border-dashed border-[#FF0000]/40 rounded-editorial p-6 text-center bg-paper-canvas hover:border-[#FF0000] hover:bg-[#FF0000]/5 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#FF0000]/10 text-[#FF0000] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <Play className="w-6 h-6 fill-[#FF0000] ml-0.5" />
                    </div>
                    <p className="text-xs font-semibold text-ink-primary">
                      {locale === 'en' ? 'Click or drag 16:9 Landscape video (YouTube Full Video / FB Watch)' : 'คลิกหรือลากไฟล์วิดีโอแนวนอน 16:9 Landscape (YouTube Full Video / FB Watch)'}
                    </p>
                    <p className="text-[10px] font-mono text-ink-secondary mt-1">
                      {locale === 'en' ? 'Supports MP4, MOV, WebM • 1080p, 2K, 4K UHD • Unlimited length (YouTube API max 128GB)' : 'รองรับ MP4, MOV, WebM • 1080p, 2K, 4K UHD • ไม่จำกัดความยาว (YouTube API สูงสุด 128GB)'}
                    </p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#FF0000]/10 text-[#FF0000] font-mono text-[9px] font-semibold border border-[#FF0000]/20">
                      {locale === 'en' ? '+ Choose 16:9 Video File' : '+ คลิกเพื่อเลือกไฟล์วิดีโอ 16:9'}
                    </span>
                  </div>
                )}

                {/* Custom 16:9 Thumbnail Section */}
                <div className="p-3 bg-paper-subtle border border-border-rule rounded-editorial space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-brand-indigo" />
                      <span className="text-xs font-semibold text-ink-primary">
                        {locale === 'en' ? 'Custom Thumbnail (16:9)' : 'ภาพปกคลิปวิดีโอ (Custom Thumbnail 16:9)'}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-ink-secondary">
                      {locale === 'en' ? 'Recommended: 1280 × 720 px (16:9), under 2MB' : 'แนะนำ 1280 × 720 px (16:9) ไม่เกิน 2MB'}
                    </span>
                  </div>

                  {customThumbnail ? (
                    <div className="flex items-center justify-between p-2 bg-paper-canvas rounded border border-border-rule">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-7 bg-brand-indigo/10 rounded flex items-center justify-center text-[8px] font-mono text-brand-indigo font-bold border border-brand-indigo/20 overflow-hidden">
                          {locale === 'en' ? '16:9 Cover' : '16:9 ปก'}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-ink-primary font-mono">{customThumbnail.name}</p>
                          <p className="text-[9px] font-mono text-ink-secondary">{customThumbnail.size} • 1280x720 JPG</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCustomThumbnail(null)}
                        className="text-ink-secondary hover:text-accent-terracotta p-1"
                        title={locale === 'en' ? 'Remove thumbnail' : 'ลบภาพปก'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomThumbnail({ id: 'thumb-1', name: 'yt-thumbnail-cover-16-9.jpg', size: '480 KB' })}
                        className="py-2 px-3 border border-dashed border-border-rule hover:border-brand-indigo rounded text-center text-xs bg-paper-canvas transition-colors group flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-brand-indigo group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-medium text-ink-primary">{locale === 'en' ? 'Upload 16:9 Thumbnail' : 'อัปโหลดภาพปก 16:9'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomThumbnail({ id: 'thumb-ai', name: 'ai-generated-youtube-hero.jpg', size: '620 KB' })}
                        className="py-2 px-3 border border-brand-indigo/40 hover:border-brand-indigo rounded text-center text-xs bg-brand-indigo/5 text-brand-indigo transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">{locale === 'en' ? 'Auto-Extract Frame (AI)' : 'สุ่มตัดปกจากวิดีโอ'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* YouTube Settings (Visibility & Category) */}
                <div className="p-3 bg-paper-subtle border border-border-rule rounded-editorial space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <SocialPlatformIcon platform="YOUTUBE" size={14} />
                    <span className="text-xs font-semibold text-ink-primary">
                      {locale === 'en' ? 'YouTube Settings (Metadata & Privacy)' : 'การตั้งค่าช่อง YouTube (YouTube Metadata & Privacy)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-mono text-ink-secondary uppercase block mb-1 font-semibold">
                        {locale === 'en' ? 'Visibility:' : 'ระดับการมองเห็น:'}
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['PUBLIC', 'UNLISTED', 'PRIVATE'] as const).map((vis) => (
                          <button
                            key={vis}
                            type="button"
                            onClick={() => setYoutubeVisibility(vis)}
                            className={`py-1 px-1.5 rounded text-[10px] font-mono font-medium border transition-colors ${
                              youtubeVisibility === vis
                                ? 'bg-[#FF0000] text-white border-[#FF0000] font-bold shadow-2xs'
                                : 'bg-paper-canvas text-ink-secondary border-border-rule hover:text-ink-primary'
                            }`}
                          >
                            {vis === 'PUBLIC' ? 'Public' : vis === 'UNLISTED' ? 'Unlisted' : 'Private'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-ink-secondary uppercase block mb-1 font-semibold">
                        {locale === 'en' ? 'Category:' : 'หมวดหมู่วิดีโอ:'}
                      </label>
                      <select
                        value={youtubeCategory}
                        onChange={(e) => setYoutubeCategory(e.target.value)}
                        className="w-full text-xs font-mono bg-paper-canvas border border-border-rule rounded p-1.5 text-ink-primary focus:outline-none focus:border-brand-indigo"
                      >
                        <option value="HOUSING">22 - Real Estate & Housing</option>
                        <option value="PEOPLE_BLOGS">22 - People & Blogs</option>
                        <option value="TECH">28 - Science & Technology</option>
                        <option value="EDUCATION">27 - Education</option>
                        <option value="ENTERTAINMENT">24 - Entertainment</option>
                        <option value="BUSINESS">25 - News & Politics / Business</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-border-rule/60 text-[10px] text-ink-secondary font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-semantic-success"></span>
                    <span>{locale === 'en' ? 'COPPA: Not Made for Kids' : 'COPPA: ไม่ได้สร้างมาเพื่อเด็กโดยเฉพาะ'}</span>
                  </div>
                </div>
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
              <div className="flex items-center gap-2">
                {lastSavedDraftTime && (
                  <span className="text-[10px] font-mono text-semantic-success flex items-center gap-1 font-medium bg-semantic-success/10 px-2 py-0.5 rounded border border-semantic-success/30">
                    <Check className="w-3 h-3 text-semantic-success shrink-0" />
                    <span>{locale === 'en' ? 'Auto-Saved' : 'บันทึกอัตโนมัติ'}</span>
                    <span className="text-ink-secondary">({lastSavedDraftTime})</span>
                  </span>
                )}
                <span className="text-[10px] font-mono text-ink-secondary">
                  {sharedCaption.length} chars
                </span>
              </div>
            </div>

            {draftRestoredNotice && (
              <div className="p-2.5 bg-brand-indigo/10 border border-brand-indigo/30 rounded-editorial flex items-center justify-between text-xs text-brand-indigo">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
                  <span>{locale === 'en' ? <>Restored latest draft for <strong>{activeWorkspace.name}</strong></> : <>กู้คืนแบบร่างล่าสุดของ <strong>{activeWorkspace.name}</strong> อัตโนมัติแล้ว</>}</span>
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    className="text-[10px] font-mono text-ink-secondary hover:text-semantic-error underline cursor-pointer"
                  >
                    {locale === 'en' ? 'Reset Draft' : 'ล้างแบบร่าง'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftRestoredNotice(false)}
                    className="text-ink-secondary hover:text-ink-primary text-xs cursor-pointer"
                    title={locale === 'en' ? 'Dismiss notice' : 'ปิดข้อความแจ้งเตือน'}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div>
                  <CustomDatePicker
                    label={locale === 'en' ? 'Target Date (Publishing Date)' : 'Target Date (วันที่ต้องการเผยแพร่)'}
                    value={scheduledDate}
                    onChange={(d) => setScheduledDate(d)}
                    placeholder={locale === 'en' ? 'Select date...' : 'เลือกวันที่...'}
                    size="sm"
                    showPresets={true}
                    markedDates={{
                      '2026-10-24': { isPeak: true },
                      '2026-10-25': { isPeak: true },
                      '2026-10-31': { isPeak: true },
                    }}
                  />
                </div>
                <div>
                  <CustomTimePicker
                    label={locale === 'en' ? 'Target Time (Publishing Time)' : 'Target Time (เวลาที่ต้องการเผยแพร่)'}
                    value={scheduledTime}
                    onChange={(t) => setScheduledTime(t)}
                    placeholder={locale === 'en' ? 'Select time...' : 'เลือกเวลา...'}
                    size="sm"
                    showPeakSlots={true}
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
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-indigo">Live Proof & Dispatch</span>
              {(previewTab === 'STORY' || previewTab === 'REEL') && (
                <button
                  type="button"
                  onClick={() => setShowSafeZone(!showSafeZone)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono border transition-all flex items-center gap-1 cursor-pointer ${
                    showSafeZone
                      ? 'bg-semantic-warning/20 text-semantic-warning border-semantic-warning/60 font-bold shadow-2xs'
                      : 'bg-paper-canvas text-ink-secondary hover:text-ink-primary border-border-rule/80'
                  }`}
                  title={locale === 'en' ? 'Toggle 9:16 Safe Zone Guidelines (Top 15%, Bottom 25%, Right 18%, IG Grid 1:1)' : 'Toggle 9:16 Safe Zone Guidelines (ขอบบน 15%, ขอบล่าง 25%, เสาขวา 18% และ IG Grid 1:1)'}
                >
                  <ShieldCheck className="w-3 h-3 text-semantic-warning" />
                  <span>Safe Zone</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${showSafeZone ? 'bg-semantic-warning animate-pulse' : 'bg-ink-muted'}`} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo font-bold border border-brand-indigo/20">
                {mediaMode === 'VIDEO_LANDSCAPE' ? '16:9 Landscape' : mediaMode === 'VIDEO' ? '9:16 Vertical' : mediaMode === 'PHOTOS' ? 'Photos' : 'Text'}
              </span>
              <span className="text-[10px] font-mono text-semantic-success flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready</span>
              </span>
            </div>
          </div>

          {/* Clean Multi-Platform & Multi-Format Selector Dock */}
          <div className="bg-paper-subtle border border-border-rule rounded-editorial p-1.5 space-y-1.5 shadow-2xs">
            {/* Tier 1: Platform Pills (Clean & Compact strictly matching mediaMode) */}
            <div className={`grid gap-1 p-0.5 bg-paper-canvas/80 border border-border-rule/60 rounded-md ${
              availablePreviewPlatforms.length === 1 ? 'grid-cols-1' :
              availablePreviewPlatforms.length === 2 ? 'grid-cols-2' :
              availablePreviewPlatforms.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
            }`}>
              {availablePreviewPlatforms.map((plat) => {
                const isActive = previewPlatform === plat;
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => handleSelectPreviewPlatform(plat)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-paper-raised text-ink-primary shadow-xs ring-1 ring-border-rule font-bold'
                        : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-raised/50'
                    }`}
                    title={locale === 'en' ? `Switch preview to ${plat}` : `สลับไปพรีวิว ${plat}`}
                  >
                    {plat === 'INSTAGRAM' && <InstagramLogo size={14} className="shrink-0" />}
                    {plat === 'FACEBOOK' && <FacebookLogo size={14} className="shrink-0" />}
                    {plat === 'YOUTUBE' && <YouTubeLogo size={14} className="shrink-0" />}
                    {plat === 'TIKTOK' && <TikTokLogo size={14} className="shrink-0" />}
                    <span className="truncate">
                      {plat === 'INSTAGRAM' ? 'IG' : plat === 'FACEBOOK' ? 'FB' : plat === 'YOUTUBE' ? 'YT' : 'TikTok'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tier 2: Dynamic Format Sub-Pills for Active Platform */}
            <div className="flex items-center gap-1">
              {platformFormats.map((fmt) => {
                const isFormatActive = previewTab === fmt.id;
                const FmtIcon = fmt.icon;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setPreviewTab(fmt.id)}
                    className={`flex-1 flex items-center justify-center gap-1 py-1 px-1.5 text-[10px] font-medium rounded transition-all cursor-pointer ${
                      isFormatActive
                        ? 'bg-brand-indigo text-white font-semibold shadow-2xs'
                        : 'bg-paper-canvas text-ink-secondary hover:text-ink-primary border border-border-rule/60'
                    }`}
                  >
                    <FmtIcon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 1. INSTAGRAM PREVIEWS                                                     */}
          {/* ========================================================================= */}
          {previewPlatform === 'INSTAGRAM' && (
            <>
              {/* IG FEED */}
              {previewTab === 'FEED' && (
                <div className="bg-paper-canvas border border-border-rule rounded-editorial overflow-hidden shadow-2xs">
                  <div className="p-2.5 flex items-center justify-between border-b border-border-rule/60">
                    <div className="flex items-center gap-2">
                      <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]">
                        <div className="w-5 h-5 rounded-full bg-paper-canvas flex items-center justify-center text-[8px] font-bold text-ink-primary">
                          {previewAccount.avatarText || 'IG'}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ink-primary leading-none truncate max-w-[150px]">
                          {previewAccount.handle || '@channel'}
                        </p>
                        <p className="text-[8px] font-mono text-ink-secondary">
                          Instagram Feed • {mediaMode === 'PHOTOS' ? `Carousel (${images.length})` : mediaMode === 'VIDEO' ? 'Video Post' : 'Text'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-ink-secondary">•••</span>
                  </div>

                  <div className="aspect-[4/3] bg-paper-subtle relative flex items-center justify-center border-b border-border-rule/60">
                    {mediaMode === 'PHOTOS' && (
                      images.length > 0 ? (
                        <>
                          <ImageIcon className="w-8 h-8 text-brand-indigo/40" />
                          <span className="absolute bottom-2 right-2 px-1.5 py-0.2 rounded-full bg-ink-primary/75 text-white font-mono text-[9px]">
                            1/{images.length}
                          </span>
                        </>
                      ) : (
                        <div className="text-center p-3 text-ink-secondary/60">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40 text-brand-indigo" />
                          <span className="text-[10px] font-mono">{locale === 'en' ? 'No image yet' : 'ยังไม่มีรูปภาพ'}</span>
                        </div>
                      )
                    )}
                    {mediaMode === 'VIDEO' && (
                      <div className="text-center">
                        <div className="w-10 h-10 mx-auto rounded-full bg-black/40 flex items-center justify-center mb-1">
                          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </div>
                        <span className="text-[9px] font-mono text-ink-secondary">{videoAsset?.duration || '00:00'} • 1080p</span>
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
                    <p className="text-[10px] font-semibold text-ink-primary mb-1">
                      Liked by <span className="font-bold">retz.creator</span> and 1,284 others
                    </p>
                    <p className="font-semibold text-ink-primary text-xs mb-0.5 line-clamp-1">
                      {workingTitle}
                    </p>
                    <p className="text-ink-secondary text-[10px] line-clamp-2 leading-relaxed">
                      <span className="font-semibold text-ink-primary mr-1">{previewAccount.handle}</span>
                      {sharedCaption}
                    </p>
                    <p className="text-[8px] font-mono text-ink-secondary/70 mt-1 uppercase">
                      2 HOURS AGO
                    </p>
                  </div>
                </div>
              )}

              {/* IG STORY */}
              {previewTab === 'STORY' && (
                <div className="w-full max-w-[210px] mx-auto aspect-[9/16] bg-gradient-to-b from-[#2a2d3e] to-[#12131a] rounded-[20px] p-2.5 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-border-rule">
                  {showSafeZone && <SafeZoneOverlay />}
                  <div>
                    <div className="flex gap-1 mb-1.5">
                      <div className="h-0.5 flex-1 bg-white rounded-full"></div>
                      <div className="h-0.5 flex-1 bg-white/40 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#F58529] to-[#DD2A7B] text-white flex items-center justify-center text-[7px] font-bold ring-1 ring-white">
                          {previewAccount.avatarText || 'IG'}
                        </div>
                        <span className="text-[9px] font-semibold text-white/90 truncate max-w-[100px]">
                          {previewAccount.handle}
                        </span>
                        <span className="text-[8px] text-white/50">24h</span>
                      </div>
                      <X className="w-3 h-3 text-white/60" />
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

              {/* IG REELS */}
              {previewTab === 'REEL' && (
                <div className="w-full max-w-[210px] mx-auto aspect-[9/16] bg-black rounded-[20px] p-2.5 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-border-rule">
                  {showSafeZone && <SafeZoneOverlay />}
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="font-semibold text-white/90">Reels</span>
                    <Camera className="w-3 h-3 text-white/70" />
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
                      <ImageIcon className="w-4 h-4 text-white/40 mx-auto mb-1" />
                      <p className="text-[8px] text-white/70 font-mono">
                        Reels preview simulates 9:16 vertical video
                      </p>
                    </div>
                  )}

                  <div className="flex items-end justify-between">
                    <div className="space-y-1 max-w-[125px]">
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#F58529] to-[#DD2A7B] text-[7px] font-bold flex items-center justify-center">
                          {previewAccount.avatarText || 'IG'}
                        </div>
                        <p className="text-[9px] font-bold line-clamp-1">{previewAccount.handle}</p>
                      </div>
                      <p className="text-[8px] text-white/80 line-clamp-2">{workingTitle}</p>
                      <div className="flex items-center gap-1 text-[7px] text-white/60">
                        <Music className="w-2 h-2" />
                        <span className="truncate">Original audio • {previewAccount.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-white/90">
                      <div className="flex flex-col items-center">
                        <Heart className="w-3.5 h-3.5" />
                        <span className="text-[7px]">28K</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-[7px]">312</span>
                      </div>
                      <Send className="w-3.5 h-3.5" />
                      <Bookmark className="w-3.5 h-3.5" />
                      <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center bg-black/60">
                        <Disc className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '4s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* 2. FACEBOOK PREVIEWS                                                      */}
          {/* ========================================================================= */}
          {previewPlatform === 'FACEBOOK' && (
            <>
              {/* FB FEED */}
              {previewTab === 'FEED' && (
                <div className="bg-paper-canvas border border-border-rule rounded-editorial overflow-hidden shadow-2xs text-ink-primary">
                  <div className="p-2.5 flex items-center justify-between border-b border-border-rule/60">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[10px] font-bold">
                        f
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-ink-primary leading-none truncate max-w-[130px]">
                            {previewAccount.name}
                          </p>
                          <CheckCircle2 className="w-3 h-3 text-[#1877F2] shrink-0" />
                        </div>
                        <p className="text-[8px] font-mono text-ink-secondary mt-0.5">
                          Just now • Public
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-ink-secondary">•••</span>
                  </div>

                  <div className="p-2.5 pt-2 text-xs space-y-1">
                    <p className="font-semibold text-ink-primary text-xs line-clamp-1">
                      {workingTitle}
                    </p>
                    <p className="text-ink-secondary text-[11px] line-clamp-3 leading-relaxed">
                      {sharedCaption}
                    </p>
                  </div>

                  {/* Media or Link Preview Box */}
                  {mediaMode === 'PHOTOS' ? (
                    <div className="aspect-[16/9] bg-paper-subtle relative flex items-center justify-center border-y border-border-rule/60">
                      {images.length > 0 ? (
                        <>
                          <ImageIcon className="w-8 h-8 text-[#1877F2]/40" />
                          <span className="absolute bottom-2 right-2 px-1.5 py-0.2 rounded bg-ink-primary/75 text-white font-mono text-[9px]">
                            {images.length} photos
                          </span>
                        </>
                      ) : (
                        <div className="text-center p-3 text-ink-secondary/60">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40 text-[#1877F2]" />
                          <span className="text-[10px] font-mono">{locale === 'en' ? 'No image yet' : 'ยังไม่มีรูปภาพ'}</span>
                        </div>
                      )}
                    </div>
                  ) : (mediaMode === 'VIDEO' || mediaMode === 'VIDEO_LANDSCAPE') ? (
                    <div className="aspect-[16/9] bg-ink-primary text-white relative flex items-center justify-center border-y border-border-rule/60">
                      <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.2 rounded bg-black/80 font-mono text-[9px]">
                        {videoAsset?.duration || (mediaMode === 'VIDEO_LANDSCAPE' ? '14:28' : '00:45')}
                      </span>
                      {mediaMode === 'VIDEO_LANDSCAPE' && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.2 rounded bg-black/80 font-mono text-[8px] text-white/90">
                          16:9 Landscape Video
                        </span>
                      )}
                    </div>
                  ) : storyLinkUrl ? (
                    <div className="border-y border-border-rule/60 bg-paper-subtle p-2 flex items-center gap-2">
                      <div className="w-12 h-12 rounded bg-paper-canvas border border-border-rule flex items-center justify-center shrink-0">
                        <ExternalLink className="w-5 h-5 text-[#1877F2]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[8px] font-mono uppercase text-ink-secondary block truncate">
                          {storyLinkUrl.replace(/^https?:\/\//, '').split('/')[0]}
                        </span>
                        <p className="text-xs font-bold text-ink-primary truncate">{workingTitle}</p>
                        <p className="text-[9px] text-ink-secondary line-clamp-1">Official publication link preview</p>
                      </div>
                    </div>
                  ) : null}

                  {/* FB Reactions */}
                  <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] text-ink-secondary border-b border-border-rule/40">
                    <div className="flex items-center gap-1">
                      <span className="flex -space-x-1">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
                          <ThumbsUp className="w-2 h-2 fill-white text-white" />
                        </span>
                        <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center">
                          <Heart className="w-2 h-2 fill-white text-white" />
                        </span>
                      </span>
                      <span className="font-mono text-[9px] ml-1">142</span>
                    </div>
                    <span className="font-mono text-[9px]">28 comments • 6 shares</span>
                  </div>

                  {/* FB Action Buttons */}
                  <div className="grid grid-cols-3 p-1 text-ink-secondary text-[11px] font-medium">
                    <button type="button" className="flex items-center justify-center gap-1 py-1 hover:bg-paper-subtle rounded transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Like</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-1 py-1 hover:bg-paper-subtle rounded transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Comment</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-1 py-1 hover:bg-paper-subtle rounded transition-colors">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              )}

              {/* FB STORY */}
              {previewTab === 'STORY' && (
                <div className="w-full max-w-[210px] mx-auto aspect-[9/16] bg-gradient-to-b from-[#1877F2] via-[#0d47a1] to-black rounded-[20px] p-2.5 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-border-rule">
                  {showSafeZone && <SafeZoneOverlay />}
                  <div>
                    <div className="flex gap-1 mb-1.5">
                      <div className="h-0.5 flex-1 bg-white rounded-full"></div>
                      <div className="h-0.5 flex-1 bg-white/40 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-white text-[#1877F2] flex items-center justify-center text-[8px] font-bold ring-1 ring-white">
                          f
                        </div>
                        <span className="text-[9px] font-semibold text-white/90 truncate max-w-[100px]">
                          {previewAccount.name}
                        </span>
                        <span className="text-[8px] text-white/50">Story</span>
                      </div>
                      <X className="w-3 h-3 text-white/60" />
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
                    <div className="h-6 rounded-full border border-white/20 px-2 flex items-center justify-between text-[9px] text-white/40 bg-black/20">
                      <span>Reply to {previewAccount.name}...</span>
                      <div className="flex items-center gap-1.5 text-white/70">
                        <ThumbsUp className="w-2.5 h-2.5" />
                        <Heart className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FB REELS */}
              {previewTab === 'REEL' && (
                <div className="w-full max-w-[210px] mx-auto aspect-[9/16] bg-black rounded-[20px] p-2.5 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-border-rule">
                  {showSafeZone && <SafeZoneOverlay />}
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="font-semibold text-white/90 flex items-center gap-1">
                      <FacebookLogo size={12} />
                      <span>Facebook Reels</span>
                    </span>
                    <span className="text-[8px] font-mono text-white/60">00:30</span>
                  </div>

                  <div className="my-auto text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#1877F2]/20 flex items-center justify-center mb-1.5 border border-[#1877F2]/40">
                      <Film className="w-5 h-5 text-[#1877F2]" />
                    </div>
                    <span className="text-[9px] font-mono text-white/80 bg-black/50 px-1.5 py-0.2 rounded">
                      Facebook 9:16 Video
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="space-y-1 max-w-[125px]">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold line-clamp-1">{previewAccount.name}</span>
                        <button type="button" className="px-1.5 py-0.2 rounded bg-[#1877F2] text-white text-[7px] font-bold">
                          Follow
                        </button>
                      </div>
                      <p className="text-[8px] text-white/80 line-clamp-2">{workingTitle}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-white/90">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <MessageCircle className="w-3.5 h-3.5" />
                      <Share2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* 3. YOUTUBE PREVIEWS                                                       */}
          {/* ========================================================================= */}
          {previewPlatform === 'YOUTUBE' && (
            <>
              {/* YOUTUBE SHORTS */}
              {previewTab === 'REEL' && (
                <div className="w-full max-w-[210px] mx-auto aspect-[9/16] bg-black rounded-[20px] p-2.5 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-border-rule">
                  {showSafeZone && <SafeZoneOverlay />}
                  <div className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-1">
                      <YouTubeLogo size={14} />
                      <span className="font-bold text-white tracking-tight">Shorts</span>
                    </div>
                    <Search className="w-3 h-3 text-white/70" />
                  </div>

                  <div className="my-auto text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#FF0000]/20 flex items-center justify-center mb-1.5 border border-[#FF0000]/40">
                      <Play className="w-5 h-5 text-[#FF0000] fill-[#FF0000] ml-0.5" />
                    </div>
                    <span className="text-[9px] font-mono text-white/80 bg-black/50 px-1.5 py-0.2 rounded">
                      YouTube Shorts (9:16)
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="space-y-1 max-w-[125px]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-[7px] font-bold">
                          YT
                        </div>
                        <p className="text-[9px] font-bold truncate max-w-[65px]">{previewAccount.name}</p>
                        <span className="px-1.5 py-0.2 rounded-full bg-[#FF0000] text-white text-[7px] font-bold uppercase shrink-0">
                          Subscribe
                        </span>
                      </div>
                      <p className="text-[8px] text-white/90 line-clamp-2">{workingTitle}</p>
                      <div className="flex items-center gap-1 text-[7px] text-white/60">
                        <Music className="w-2 h-2" />
                        <span className="truncate">Original Sound • {previewAccount.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-white/90">
                      <div className="flex flex-col items-center">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-[7px]">18K</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span className="text-[7px]">Dislike</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-[7px]">420</span>
                      </div>
                      <Share2 className="w-3.5 h-3.5" />
                      <div className="w-4 h-4 rounded bg-paper-canvas/20 border border-white/30 flex items-center justify-center">
                        <Shuffle className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* YOUTUBE VIDEO FEED */}
              {previewTab === 'FEED' && (
                <div className="bg-paper-canvas border border-border-rule rounded-editorial overflow-hidden shadow-2xs text-ink-primary">
                  <div className="aspect-[16/9] bg-black text-white relative flex items-center justify-center overflow-hidden">
                    {/* Thumbnail preview tag if present */}
                    {customThumbnail ? (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-white/90 absolute top-2 left-2 bg-black/70 px-1.5 py-0.5 rounded border border-white/20 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-white/80" />
                          <span>{locale === 'en' ? 'Cover: ' : 'ปก: '}{customThumbnail.name}</span>
                        </span>
                      </div>
                    ) : null}

                    <div className="w-12 h-12 rounded-full bg-[#FF0000] flex items-center justify-center shadow-lg relative z-10">
                      <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                    </div>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/90 font-mono text-[9px] font-bold z-10">
                      {videoAsset?.duration || '14:28'}
                    </span>
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#FF0000] text-white font-mono text-[8px] font-bold z-10 uppercase">
                      {youtubeVisibility}
                    </span>
                  </div>

                  <div className="p-2.5 flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                      YT
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-ink-primary line-clamp-2 leading-tight">
                        {workingTitle || 'Untitled Video Title'}
                      </p>
                      <p className="text-[10px] text-ink-secondary mt-0.5 flex items-center gap-1">
                        <span>{previewAccount.name}</span>
                        <CheckCircle2 className="w-2.5 h-2.5 text-ink-secondary" />
                      </p>
                      <div className="flex items-center gap-2 text-[9px] font-mono text-ink-secondary mt-0.5">
                        <span>16:9 Landscape Video</span>
                        <span>•</span>
                        <span className="text-brand-indigo font-semibold">{youtubeCategory}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-2.5 pb-2.5">
                    <div className="p-2 bg-paper-subtle rounded text-[10px] text-ink-secondary line-clamp-2">
                      {sharedCaption || 'No description provided.'}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* 4. TIKTOK PREVIEWS                                                        */}
          {/* ========================================================================= */}
          {previewPlatform === 'TIKTOK' && (
            <>
              {/* TIKTOK 9:16 VIDEO */}
              {previewTab === 'REEL' && (
                <div className="w-full max-w-[210px] mx-auto aspect-[9/16] bg-black rounded-[20px] p-2.5 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-border-rule">
                  {showSafeZone && <SafeZoneOverlay />}
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="w-4"></div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-[9px]">Following</span>
                      <span className="font-bold text-white text-[10px] border-b-2 border-white pb-0.5">For You</span>
                    </div>
                    <Search className="w-3.5 h-3.5 text-white/80" />
                  </div>

                  {mediaMode === 'VIDEO' ? (
                    <div className="my-auto text-center">
                      <div className="w-10 h-10 mx-auto rounded-full bg-paper-canvas/20 flex items-center justify-center mb-1.5 border border-white/30">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </div>
                      <span className="text-[9px] font-mono text-white/80 bg-black/50 px-1.5 py-0.2 rounded">
                        TikTok 9:16 Feed
                      </span>
                    </div>
                  ) : (
                    <div className="my-auto text-center p-2 bg-white/5 rounded-editorial border border-white/10">
                      <TikTokLogo size={20} className="mx-auto mb-1 opacity-80" />
                      <p className="text-[8px] text-white/70 font-mono">
                        TikTok vertical immersion preview
                      </p>
                    </div>
                  )}

                  <div className="flex items-end justify-between">
                    <div className="space-y-1 max-w-[125px]">
                      <p className="text-[10px] font-bold text-white leading-tight">
                        @{previewAccount.handle.replace(/^@/, '')}
                      </p>
                      <p className="text-[8px] text-white/90 line-clamp-2 leading-relaxed">
                        {workingTitle} {sharedCaption}
                      </p>
                      <p className="text-[8px] font-semibold text-semantic-info">
                        #fyp #foryou #retzpost
                      </p>
                      <div className="flex items-center gap-1 text-[7px] text-white/80">
                        <Music className="w-2 h-2 shrink-0 animate-pulse" />
                        <span className="truncate">original sound - {previewAccount.name}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 text-white">
                      <div className="relative">
                        <div className="w-6 h-6 rounded-full bg-paper-canvas text-ink-primary font-bold text-[8px] flex items-center justify-center ring-1 ring-white">
                          {previewAccount.avatarText || 'TT'}
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FE2C55] text-white flex items-center justify-center text-[7px] font-bold">
                          +
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Heart className="w-3.5 h-3.5 fill-[#FE2C55] text-[#FE2C55]" />
                        <span className="text-[7px]">54K</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <MessageCircle className="w-3.5 h-3.5 fill-white/20 text-white" />
                        <span className="text-[7px]">1.4K</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Bookmark className="w-3.5 h-3.5 fill-semantic-warning text-semantic-warning" />
                        <span className="text-[7px]">6.2K</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Share2 className="w-3.5 h-3.5 fill-white text-white" />
                        <span className="text-[7px]">890</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-ink-primary border border-white/60 flex items-center justify-center">
                        <Disc className="w-3 h-3 text-white/80 animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TIKTOK PHOTO SLIDE */}
              {previewTab === 'FEED' && (
                <div className="w-full max-w-[210px] mx-auto aspect-[9/16] bg-black rounded-[20px] p-2.5 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-border-rule">
                  {showSafeZone && <SafeZoneOverlay />}
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="font-semibold text-white/90">TikTok Photo Mode</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-white/20 font-mono text-[8px]">
                      1/{images.length || 1}
                    </span>
                  </div>

                  <div className="my-auto text-center p-2 bg-paper-canvas/10 rounded-editorial border border-white/10">
                    <Camera className="w-6 h-6 text-white/70 mx-auto mb-1" />
                    <p className="text-[9px] text-white font-medium">{workingTitle}</p>
                    <p className="text-[7px] text-white/50 font-mono mt-0.5">Swipe to explore photo carousel</p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="space-y-1 max-w-[125px]">
                      <p className="text-[10px] font-bold text-white">
                        @{previewAccount.handle.replace(/^@/, '')}
                      </p>
                      <p className="text-[8px] text-white/90 line-clamp-2">
                        {sharedCaption}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Heart className="w-3.5 h-3.5" />
                      <MessageCircle className="w-3.5 h-3.5" />
                      <Share2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* TIKTOK STORY */}
              {previewTab === 'STORY' && (
                <div className="w-full max-w-[210px] mx-auto aspect-[9/16] bg-gradient-to-b from-[#010101] via-[#161823] to-[#010101] rounded-[20px] p-2.5 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-border-rule">
                  {showSafeZone && <SafeZoneOverlay />}
                  <div>
                    <div className="h-0.5 w-full bg-semantic-info rounded-full mb-1.5"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#25F4EE] text-black flex items-center justify-center text-[7px] font-bold">
                          TT
                        </div>
                        <span className="text-[9px] font-semibold text-white/90 truncate max-w-[100px]">
                          {previewAccount.handle}
                        </span>
                        <span className="text-[7px] px-1 py-0.2 rounded bg-semantic-info/30 text-semantic-info font-bold">Story</span>
                      </div>
                      <X className="w-3 h-3 text-white/60" />
                    </div>
                  </div>

                  <div className="my-auto text-center px-2">
                    <p className="text-[10px] font-medium text-white/90 line-clamp-2">
                      {workingTitle}
                    </p>
                  </div>

                  <div className="h-6 rounded-full border border-white/20 px-2 flex items-center justify-between text-[9px] text-white/40 bg-black/30">
                    <span>Quick reaction...</span>
                    <div className="flex items-center gap-1.5 text-white/70">
                      <ThumbsUp className="w-2.5 h-2.5 hover:text-white transition-colors" />
                      <Heart className="w-2.5 h-2.5 hover:text-white transition-colors" />
                      <Sparkles className="w-2.5 h-2.5 hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Active Destinations Breakdown */}
          <div className="p-2.5 bg-paper-subtle rounded-editorial border border-border-rule text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-ink-secondary uppercase block font-semibold">
                Active Destinations ({totalActivePlacements})
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

          {/* Master Primary Action Button (Adaptive to RBAC Role) */}
          {currentRole === 'CONTRIBUTOR' ? (
            <div className="space-y-1.5">
              <button
                type="button"
                disabled={totalActivePlacements === 0}
                onClick={() => {
                  setSubmittedForApprovalNotice(locale === 'en' ? `Submitted "${workingTitle}" for Manager review (Pending Review).` : `ส่งโพสต์ "${workingTitle}" ให้ Manager ตรวจสอบและอนุมัติเรียบร้อยแล้ว`);
                  setTimeout(() => setSubmittedForApprovalNotice(null), 4500);
                }}
                className={`w-full py-2.5 px-4 text-xs font-semibold rounded-editorial flex items-center justify-center gap-2 shadow-xs transition-all ${
                  totalActivePlacements > 0
                    ? 'bg-accent-terracotta hover:bg-accent-terracotta/90 text-white cursor-pointer active:scale-[0.98]'
                    : 'bg-paper-subtle text-ink-secondary border border-border-rule cursor-not-allowed opacity-60'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {locale === 'en' ? `Submit for Approval (${totalActivePlacements} Placements)` : `ส่งให้ Manager อนุมัติ (${totalActivePlacements} Placements)`}
                </span>
              </button>
              <p className="text-[10px] text-accent-terracotta font-sans text-center leading-tight flex items-center justify-center gap-1.5">
                <Sticker name="guarded-shield" size="xs" inline />
                <span>{locale === 'en' ? 'Contributor Role: Manager approval required prior to live dispatch.' : 'บทบาท Contributor: ต้องผ่านการอนุมัติก่อนยิงขึ้นช่องทางจริง'}</span>
              </p>
            </div>
          ) : currentRole === 'VIEWER' ? (
            <div className="space-y-1.5">
              <div className="w-full py-2.5 px-4 text-xs font-semibold rounded-editorial flex items-center justify-center gap-2 bg-paper-subtle border border-border-rule text-ink-secondary cursor-not-allowed">
                <Lock className="w-4 h-4" />
                <span>{locale === 'en' ? 'Reviewer / Client Mode (Read-Only)' : 'โหมดผู้ตรวจงาน / ลูกค้า'}</span>
              </div>
              <p className="text-[10px] text-ink-secondary font-sans text-center leading-tight">
                {locale === 'en' ? 'Preview Live Phone Mockup and schedule only' : 'สามารถดู Live Phone Mockup และกำหนดการได้เท่านั้น'}
              </p>
            </div>
          ) : (
            <button
              type="button"
              disabled={totalActivePlacements === 0 || isPublishing}
              onClick={handlePublishDispatch}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-editorial flex items-center justify-center gap-2 shadow-xs transition-all ${
                totalActivePlacements > 0 && !isPublishing
                  ? 'bg-brand-indigo hover:bg-brand-indigo-hover text-white cursor-pointer active:scale-[0.98]'
                  : 'bg-paper-subtle text-ink-secondary border border-border-rule cursor-not-allowed opacity-60'
              }`}
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{locale === 'th' ? 'กำลังส่งข้อมูลการเผยแพร่...' : 'Dispatching to Queue...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {publishMode === 'NOW'
                      ? (locale === 'th'
                          ? `เผยแพร่ไปยัง ${totalActivePlacements} ช่องทาง`
                          : `Publish to ${totalActivePlacements} Destinations`)
                      : (locale === 'th'
                          ? `กำหนดเวลาเผยแพร่ (${totalActivePlacements} ช่องทาง)`
                          : `Schedule Dispatch (${totalActivePlacements} Destinations)`)}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </section>

      </div>


            {/* ========================================================================= */}
      {/* MODAL 3: AI MEDIA ASSET HUB (Boss's System Feature Upgrade)               */}
      {/* ========================================================================= */}
      {isAiMediaModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper-raised border border-border-rule rounded-card max-w-2xl w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border-rule shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-base text-ink-primary">
                    {locale === 'en' ? 'AI Media Asset Hub' : 'คลังภาพสื่อ AI (AI Media Asset Hub)'}
                  </h3>
                  <span className="text-[10px] font-mono text-ink-secondary block">
                    {locale === 'en' ? 'Select studio images and 8K AI graphic assets ready for deployment.' : 'เลือกรูปภาพสตูดิโอและมีเดียกราฟิกระดับ 8K ที่พร้อมใช้งาน'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiMediaModalOpen(false)}
                className="p-1 rounded text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
              {AI_MEDIA_LIBRARY_ASSETS.map((asset) => (
                <div
                  key={asset.id}
                  className="p-3 bg-paper-canvas border border-border-rule rounded-editorial hover:border-brand-indigo transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-brand-indigo/10 text-brand-indigo font-semibold">
                        {asset.category}
                      </span>
                      <span className="text-[9px] font-mono text-ink-secondary">
                        {asset.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <ImageIcon className="w-4 h-4 text-brand-indigo shrink-0" />
                      <h4 className="font-mono text-xs font-semibold text-ink-primary truncate">
                        {asset.name}
                      </h4>
                    </div>
                    <p className="text-[11px] font-sans text-ink-secondary leading-relaxed line-clamp-3">
                      {asset.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInsertAiMedia(asset)}
                    className="w-full mt-2 py-1.5 px-3 bg-paper-raised hover:bg-brand-indigo hover:text-white text-ink-primary border border-border-rule rounded text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{locale === 'en' ? 'Insert into Post' : 'เลือกภาพนี้เข้าโพสต์'}</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border-rule shrink-0">
              <span className="text-[10px] font-mono text-ink-secondary">
                Auto-optimized for 1:1 Carousel & 9:16 Full Screen Story
              </span>
              <button
                type="button"
                onClick={() => setIsAiMediaModalOpen(false)}
                className="px-3 py-1.5 bg-paper-subtle hover:bg-paper-canvas text-ink-primary border border-border-rule rounded-editorial text-xs font-mono cursor-pointer"
              >
                {locale === 'en' ? 'Close' : 'ปิด'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE / TABLET FLOATING THUMB-ZONE ACTION DOCK (Ergonomic UX for Mobile Users) */}
      <div className="xl:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-ink-primary/95 text-white backdrop-blur-md rounded-full shadow-2xl p-1.5 flex items-center gap-1 border border-white/20 text-xs">
        <button
          type="button"
          onClick={() => {
            setMobileTab('DESTINATIONS');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
            mobileTab === 'DESTINATIONS'
              ? 'bg-brand-indigo text-white font-bold shadow-xs'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <span>{locale === 'en' ? '1. Channels' : '1. จุดหมาย'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-bold">
            {totalActivePlacements}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMobileTab('CANVAS');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
            mobileTab === 'CANVAS'
              ? 'bg-brand-indigo text-white font-bold shadow-xs'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <span>{locale === 'en' ? '2. Compose' : '2. เขียนงาน'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMobileTab('PROOF');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
            mobileTab === 'PROOF'
              ? 'bg-brand-indigo text-white font-bold shadow-xs'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <span>{locale === 'en' ? '3. Live Proof' : '3. พรีวิวสด'}</span>
          <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
        </button>
      </div>
    </div>
  );
}
