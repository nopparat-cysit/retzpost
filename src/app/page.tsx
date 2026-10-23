'use client';

import React, { useState, useMemo } from 'react';
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
  Send,
  Copy,
  Globe,
  BarChart3,
  Eye,
  ThumbsUp,
  MessageSquare,
  MousePointerClick,
  Trophy,
  Award,
  Flame,
  Filter
} from 'lucide-react';
import { 
  generateErrorLogCsv, 
  generateAllDispatchesCsv, 
  downloadCsvFile,
  ExportableJob 
} from '@/modules/publishing/export-csv';
import { 
  SocialPlatformIcon, 
  SocialMediaLiveButton, 
  FacebookLogo, 
  InstagramLogo, 
  InstagramStoryLogo, 
  YouTubeLogo, 
  TikTokLogo, 
  LineLogo, 
  WebsiteLogo 
} from '@/components/ui/social-icons';

interface DispatchPlacement {
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK';
  format: 'FEED' | 'STORY' | 'REEL';
  label: string;
  badgeBg: string;
  status: 'PUBLISHED' | 'FAILED' | 'PENDING';
  liveUrl?: string;
  error?: string;
}

interface DispatchBatch {
  id: string;
  workspaceId: string;
  workspaceName: string;
  title: string;
  timestamp: string;
  status: 'PUBLISHED' | 'PARTIALLY_PUBLISHED' | 'SCHEDULED' | 'FAILED_RETRYABLE' | 'FAILED_FINAL';
  websiteUrl?: string;
  lineContactUrl?: string;
  placements: DispatchPlacement[];
  liveUrl?: string;
}

export interface PostPerformanceData {
  id: string;
  batchId: string;
  title: string;
  workspaceId: string;
  workspaceName: string;
  thumbnailUrl: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  linkClicks: number;
  ctr: string;
  engagementRate: string;
  rank: number;
  rankBadge: string;
  liveLinks: {
    platform: 'FACEBOOK' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK';
    format: 'FEED' | 'STORY' | 'REEL';
    label: string;
    url: string;
    emoji: string;
    btnColor: string;
  }[];
  websiteUrl?: string;
  websiteLabel?: string;
}

const SAMPLE_BATCHES: DispatchBatch[] = [
  {
    id: 'MP-BATCH-895',
    workspaceId: 'ws_capitalone',
    workspaceName: 'Capital One Real Estate',
    title: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
    timestamp: 'Today 08:30 AM',
    status: 'PARTIALLY_PUBLISHED',
    websiteUrl: 'https://capitalone.co.th/the-rich-rama9',
    lineContactUrl: 'https://line.me/ti/p/@capitalone',
    liveUrl: 'https://www.facebook.com/capitalonethailand/posts/991283',
    placements: [
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'FB Thailand Album (6)', 
        badgeBg: 'bg-[#1877F2]', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.facebook.com/capitalonethailand/posts/991283'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'FEED', 
        label: 'IG Carousel (6)', 
        badgeBg: 'bg-brand-indigo', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/p/C1RichRama9/'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'STORY', 
        label: 'IG Story 24h + Link', 
        badgeBg: 'bg-accent-terracotta', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/stories/capitalone.th/348910283/'
      },
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'Oknus FB Page', 
        badgeBg: 'bg-accent-terracotta', 
        status: 'FAILED', 
        error: 'Token Expired (Code: 190)' 
      },
    ],
  },
  {
    id: 'MP-BATCH-892',
    workspaceId: 'ws_acme',
    workspaceName: 'Acme Creator Studio',
    title: 'Behind the Scenes: Studio Redesign Tour',
    timestamp: 'Today 09:15 AM',
    status: 'PARTIALLY_PUBLISHED',
    websiteUrl: 'https://alexrivera.studio/redesign-tour',
    liveUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ',
    placements: [
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'FB Page Album', 
        badgeBg: 'bg-[#1877F2]', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.facebook.com/alexriverastudio/posts/89201'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'FEED', 
        label: 'IG Feed (3 Photos)', 
        badgeBg: 'bg-brand-indigo', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/p/example-carousel'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'STORY', 
        label: 'IG Story (24h)', 
        badgeBg: 'bg-accent-terracotta', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/stories/alexrivera_official/'
      },
      { 
        platform: 'YOUTUBE', 
        format: 'REEL', 
        label: 'YT Shorts (00:58)', 
        badgeBg: 'bg-semantic-info', 
        status: 'PUBLISHED',
        liveUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ'
      },
      { 
        platform: 'TIKTOK', 
        format: 'REEL', 
        label: 'TikTok Direct Post', 
        badgeBg: 'bg-accent-terracotta', 
        status: 'FAILED', 
        error: 'Rate limit 429' 
      },
    ],
  },
  {
    id: 'MP-BATCH-890',
    workspaceId: 'ws_capitalone',
    workspaceName: 'Capital One Real Estate',
    title: 'The Penthouse Collection: Private Pool & Panoramic View',
    timestamp: 'Yesterday 04:30 PM',
    status: 'PUBLISHED',
    websiteUrl: 'https://capitalone.co.th/penthouse-collection',
    liveUrl: 'https://www.facebook.com/kwluxurythailand/posts/449102',
    placements: [
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'KW Luxury Thailand', 
        badgeBg: 'bg-[#1877F2]', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.facebook.com/kwluxurythailand/posts/449102'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'FEED', 
        label: 'IG Carousel (4)', 
        badgeBg: 'bg-brand-indigo', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/p/C1PenthouseKW/'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'STORY', 
        label: 'IG Story 24h + Link', 
        badgeBg: 'bg-accent-terracotta', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/stories/kwcapitalone/'
      },
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'Capital One Taiwan', 
        badgeBg: 'bg-[#1877F2]', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.facebook.com/capitalonetaiwan/posts/110293'
      },
    ],
  },
  {
    id: 'MP-BATCH-888',
    workspaceId: 'ws_retzpost',
    workspaceName: 'RetzPost Software',
    title: 'Introducing Next-Gen Multi-Placement Publishing Studio',
    timestamp: 'Oct 22, 10:00 AM',
    status: 'PUBLISHED',
    websiteUrl: 'https://retzpost.io/whats-new',
    liveUrl: 'https://retzpost.io/whats-new',
    placements: [
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'Product Desk Page', 
        badgeBg: 'bg-[#1877F2]', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.facebook.com/retzpost/posts/202610'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'STORY', 
        label: 'Changelog Story', 
        badgeBg: 'bg-accent-terracotta', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/stories/retzpost_app/'
      },
      { 
        platform: 'YOUTUBE', 
        format: 'REEL', 
        label: 'YT Shorts (00:48)', 
        badgeBg: 'bg-semantic-info', 
        status: 'PUBLISHED',
        liveUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ'
      },
    ],
  },
  {
    id: 'MP-BATCH-885',
    workspaceId: 'ws_coffee',
    workspaceName: 'Coffee Craft BKK',
    title: 'Weekend Cold Brew Roasting & Bakery Specials',
    timestamp: 'Oct 21, 08:00 AM',
    status: 'PUBLISHED',
    websiteUrl: 'https://coffeecraft.bkk/menu',
    liveUrl: 'https://www.instagram.com/p/coffeecraft/',
    placements: [
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'Cafe Main Page', 
        badgeBg: 'bg-[#1877F2]', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.facebook.com/coffeecraftbkk/posts/33109'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'FEED', 
        label: 'Cafe IG Feed', 
        badgeBg: 'bg-brand-indigo', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/p/coffeecraft/'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'STORY', 
        label: 'Story + Location Tag', 
        badgeBg: 'bg-accent-terracotta', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/stories/coffeecraft.bkk/'
      },
    ],
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
    name: 'Capital One Thailand (FB Page)',
    platform: 'Facebook',
    handle: 'capitalonethailand',
    status: 'HEALTHY',
    tokenExpiry: '38 days remaining',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
  },
  {
    name: 'Alex Rivera Studio (YouTube Shorts)',
    platform: 'YouTube',
    handle: '@AlexRiveraStudio',
    status: 'HEALTHY',
    tokenExpiry: 'Google OAuth Active',
    avatarBg: 'bg-semantic-info',
    avatarText: 'YT',
  },
  {
    name: 'Alex Rivera (Instagram Pro)',
    platform: 'Instagram',
    handle: '@alexrivera_official',
    status: 'HEALTHY',
    tokenExpiry: 'Meta Token Valid',
    avatarBg: 'bg-brand-indigo',
    avatarText: 'IG',
  },
  {
    name: 'Oknus Real Estate (FB Page)',
    platform: 'Facebook',
    handle: 'oknus.realestate',
    status: 'ATTENTION',
    tokenExpiry: 'Token Expired (Code: 190)',
    avatarBg: 'bg-accent-terracotta',
    avatarText: 'FB',
  },
  {
    name: 'Thailand Prop C1 (Instagram Story)',
    platform: 'Instagram',
    handle: 'thailandprop.c1',
    status: 'WARNING',
    tokenExpiry: 'Aspect ratio mismatch (1:1 vs 9:16)',
    avatarBg: 'bg-accent-terracotta',
    avatarText: 'IG',
  },
  {
    name: 'Alex Rivera (TikTok Creator)',
    platform: 'TikTok',
    handle: '@alexrivera_official',
    status: 'HEALTHY',
    tokenExpiry: 'Rate Limit Cooldown Ended',
    avatarBg: 'bg-ink-primary',
    avatarText: 'TT',
  },
];

const SAMPLE_PERFORMANCE_POSTS: PostPerformanceData[] = [
  {
    id: 'perf-1',
    batchId: 'MP-BATCH-895',
    title: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
    workspaceId: 'ws_capitalone',
    workspaceName: 'Capital One Real Estate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    publishedAt: 'Today 08:30 AM',
    views: 68420,
    likes: 5240,
    comments: 342,
    shares: 1280,
    linkClicks: 890,
    ctr: '5.8%',
    engagementRate: '10.0%',
    rank: 1,
    rankBadge: '🏆 RANK 1 • BEST PERFORMING CONDO',
    liveLinks: [
      {
        platform: 'FACEBOOK',
        format: 'FEED',
        label: 'FB Thailand',
        url: 'https://www.facebook.com/capitalonethailand/posts/991283',
        emoji: '📘',
        btnColor: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'FEED',
        label: 'IG Carousel',
        url: 'https://www.instagram.com/p/C1RichRama9/',
        emoji: '📸',
        btnColor: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'STORY',
        label: 'IG Story',
        url: 'https://www.instagram.com/stories/capitalone.th/348910283/',
        emoji: '⚡',
        btnColor: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
      },
    ],
    websiteUrl: 'https://capitalone.co.th/the-rich-rama9',
    websiteLabel: 'หน้าเว็บโครงการ',
  },
  {
    id: 'perf-2',
    batchId: 'MP-BATCH-890',
    title: 'The Penthouse Collection: Private Pool & Panoramic View',
    workspaceId: 'ws_capitalone',
    workspaceName: 'Capital One Real Estate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
    publishedAt: 'Yesterday 04:30 PM',
    views: 54200,
    likes: 4180,
    comments: 215,
    shares: 940,
    linkClicks: 642,
    ctr: '6.1%',
    engagementRate: '9.8%',
    rank: 2,
    rankBadge: '🥈 RANK 2 • TOP LUXURY ENGAGEMENT',
    liveLinks: [
      {
        platform: 'FACEBOOK',
        format: 'FEED',
        label: 'KW Luxury FB',
        url: 'https://www.facebook.com/kwluxurythailand/posts/449102',
        emoji: '📘',
        btnColor: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'FEED',
        label: 'IG Carousel',
        url: 'https://www.instagram.com/p/C1PenthouseKW/',
        emoji: '📸',
        btnColor: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'STORY',
        label: 'IG Story',
        url: 'https://www.instagram.com/stories/kwcapitalone/',
        emoji: '⚡',
        btnColor: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
      },
    ],
    websiteUrl: 'https://capitalone.co.th/penthouse-collection',
    websiteLabel: 'หน้าเว็บโครงการ',
  },
  {
    id: 'perf-3',
    batchId: 'MP-BATCH-892',
    title: 'Behind the Scenes: Studio Redesign Tour',
    workspaceId: 'ws_acme',
    workspaceName: 'Acme Creator Studio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    publishedAt: 'Oct 22, 09:15 AM',
    views: 48920,
    likes: 3820,
    comments: 241,
    shares: 980,
    linkClicks: 420,
    ctr: '4.8%',
    engagementRate: '10.3%',
    rank: 3,
    rankBadge: '🥉 RANK 3 • TOP VIDEO RETENTION',
    liveLinks: [
      {
        platform: 'YOUTUBE',
        format: 'REEL',
        label: 'YT Shorts',
        url: 'https://youtube.com/shorts/dQw4w9WgXcQ',
        emoji: '🔴',
        btnColor: 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'FEED',
        label: 'IG Feed',
        url: 'https://www.instagram.com/p/example-carousel',
        emoji: '📸',
        btnColor: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'STORY',
        label: 'IG Story',
        url: 'https://www.instagram.com/stories/alexrivera_official/',
        emoji: '⚡',
        btnColor: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
      },
      {
        platform: 'FACEBOOK',
        format: 'FEED',
        label: 'FB Studio',
        url: 'https://www.facebook.com/alexriverastudio/posts/89201',
        emoji: '📘',
        btnColor: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
      },
    ],
    websiteUrl: 'https://alexrivera.studio/redesign-tour',
    websiteLabel: 'หน้าเว็บ Creator',
  },
  {
    id: 'perf-4',
    batchId: 'MP-BATCH-888',
    title: 'Introducing Next-Gen Multi-Placement Publishing Studio',
    workspaceId: 'ws_retzpost',
    workspaceName: 'RetzPost Software',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    publishedAt: 'Oct 22, 10:00 AM',
    views: 38200,
    likes: 2840,
    comments: 186,
    shares: 650,
    linkClicks: 780,
    ctr: '5.2%',
    engagementRate: '9.6%',
    rank: 4,
    rankBadge: '⚡ RANK 4 • TOP B2B CONVERSION',
    liveLinks: [
      {
        platform: 'FACEBOOK',
        format: 'FEED',
        label: 'FB RetzPost',
        url: 'https://www.facebook.com/retzpost/posts/202610',
        emoji: '📘',
        btnColor: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'STORY',
        label: 'IG Story',
        url: 'https://www.instagram.com/stories/retzpost_app/',
        emoji: '⚡',
        btnColor: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
      },
      {
        platform: 'YOUTUBE',
        format: 'REEL',
        label: 'YT Shorts',
        url: 'https://youtube.com/shorts/dQw4w9WgXcQ',
        emoji: '🔴',
        btnColor: 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100',
      },
    ],
    websiteUrl: 'https://retzpost.io/whats-new',
    websiteLabel: 'หน้าเว็บ Changelog',
  },
  {
    id: 'perf-5',
    batchId: 'MP-BATCH-885',
    title: 'Weekend Cold Brew Roasting & Bakery Specials',
    workspaceId: 'ws_coffee',
    workspaceName: 'Coffee Craft BKK',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    publishedAt: 'Oct 21, 08:00 AM',
    views: 18600,
    likes: 1420,
    comments: 98,
    shares: 210,
    linkClicks: 310,
    ctr: '4.1%',
    engagementRate: '9.3%',
    rank: 5,
    rankBadge: '☕ RANK 5 • TOP COMMUNITY REACH',
    liveLinks: [
      {
        platform: 'FACEBOOK',
        format: 'FEED',
        label: 'FB Cafe',
        url: 'https://www.facebook.com/coffeecraftbkk/posts/33109',
        emoji: '📘',
        btnColor: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'FEED',
        label: 'IG Feed',
        url: 'https://www.instagram.com/p/coffeecraft/',
        emoji: '📸',
        btnColor: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'STORY',
        label: 'IG Story',
        url: 'https://www.instagram.com/stories/coffeecraft.bkk/',
        emoji: '⚡',
        btnColor: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
      },
    ],
    websiteUrl: 'https://coffeecraft.bkk/menu',
    websiteLabel: 'หน้าเมนูร้าน',
  },
];

export default function HomePage() {
  const [dashboardMode, setDashboardMode] = useState<'OPERATIONS' | 'TRACKING'>('OPERATIONS');
  const [workspaceFilter, setWorkspaceFilter] = useState<'ALL' | 'ws_capitalone' | 'ws_acme' | 'ws_retzpost' | 'ws_coffee'>('ALL');
  const [batchTab, setBatchTab] = useState<'ALL' | 'CAPITAL_ONE' | 'ACME' | 'NEEDS_ATTENTION'>('ALL');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [selectedLiveBatch, setSelectedLiveBatch] = useState<DispatchBatch | null>(null);
  const [copiedLinkNotice, setCopiedLinkNotice] = useState<string | null>(null);

  // Performance Tracking States
  const [trackingSort, setTrackingSort] = useState<'OVERALL' | 'VIEWS' | 'ENGAGEMENT' | 'CLICKS'>('OVERALL');
  const [trackingTimeframe, setTrackingTimeframe] = useState<'30D' | '7D' | 'ALL'>('30D');

  const handleCopyLink = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkNotice(`คัดลอกลิงก์ "${label}" แล้ว`);
    setTimeout(() => setCopiedLinkNotice(null), 2500);
  };

  // Filtered batches for Operational View
  const filteredBatches = SAMPLE_BATCHES.filter((b) => {
    if (workspaceFilter !== 'ALL' && b.workspaceId !== workspaceFilter) return false;
    if (batchTab === 'CAPITAL_ONE') return b.workspaceId === 'ws_capitalone';
    if (batchTab === 'ACME') return b.workspaceId === 'ws_acme';
    if (batchTab === 'NEEDS_ATTENTION') return ['PARTIALLY_PUBLISHED', 'FAILED_RETRYABLE', 'FAILED_FINAL'].includes(b.status);
    return true;
  });

  // Filtered & Sorted Performance Posts for Tracking View
  const filteredPerformancePosts = useMemo(() => {
    let posts = SAMPLE_PERFORMANCE_POSTS.filter((p) => {
      if (workspaceFilter !== 'ALL' && p.workspaceId !== workspaceFilter) return false;
      return true;
    });

    if (trackingSort === 'VIEWS') {
      posts = [...posts].sort((a, b) => b.views - a.views);
    } else if (trackingSort === 'ENGAGEMENT') {
      posts = [...posts].sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares));
    } else if (trackingSort === 'CLICKS') {
      posts = [...posts].sort((a, b) => b.linkClicks - a.linkClicks);
    } else {
      posts = [...posts].sort((a, b) => a.rank - b.rank);
    }

    return posts;
  }, [workspaceFilter, trackingSort]);

  // Totals for Tracking
  const totalViews = useMemo(() => filteredPerformancePosts.reduce((acc, p) => acc + p.views, 0), [filteredPerformancePosts]);
  const totalLikes = useMemo(() => filteredPerformancePosts.reduce((acc, p) => acc + p.likes, 0), [filteredPerformancePosts]);
  const totalComments = useMemo(() => filteredPerformancePosts.reduce((acc, p) => acc + p.comments, 0), [filteredPerformancePosts]);
  const totalShares = useMemo(() => filteredPerformancePosts.reduce((acc, p) => acc + p.shares, 0), [filteredPerformancePosts]);
  const totalLinkClicks = useMemo(() => filteredPerformancePosts.reduce((acc, p) => acc + p.linkClicks, 0), [filteredPerformancePosts]);

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
    setDownloadToast(`Exported ${errorJobs.length} operational errors to ${filename}`);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const handleExportAllJobs = () => {
    const allJobs: ExportableJob[] = [
      {
        id: 'MP-JOB-1053',
        platform: 'FACEBOOK',
        format: 'FEED_POST',
        handle: 'Capital One Thailand',
        storyTitle: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 08:30 AM',
        liveUrl: 'https://facebook.com/capitalonethailand/posts/991283',
      },
      {
        id: 'MP-JOB-1054',
        platform: 'INSTAGRAM',
        format: 'FEED_POST',
        handle: 'capitalone.th',
        storyTitle: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 08:30 AM',
        liveUrl: 'https://instagram.com/p/C1RichRama9',
      },
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
        errorSafeMessage: 'Facebook Graph API OAuthException: Token expired (Code: 190)',
      },
      {
        id: 'MP-JOB-1051',
        platform: 'FACEBOOK',
        format: 'FEED_POST',
        handle: 'Alex Rivera Studio',
        storyTitle: 'Behind the Scenes: Studio Redesign Tour',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 09:15 AM',
        liveUrl: 'https://facebook.com/alexriverastudio/posts/89201',
      },
      {
        id: 'MP-JOB-1052',
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

  const handleExportPerformanceCsv = () => {
    const headers = ['Rank', 'Campaign Title', 'Workspace', 'Views', 'Likes', 'Comments', 'Shares', 'Story Link Clicks', 'CTR', 'Engagement Rate', 'Published Date'];
    const rows = filteredPerformancePosts.map((p) => [
      p.rank,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.workspaceName}"`,
      p.views,
      p.likes,
      p.comments,
      p.shares,
      p.linkClicks,
      `"${p.ctr}"`,
      `"${p.engagementRate}"`,
      `"${p.publishedAt}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsvFile(csvContent, `RetzPost_Performance_Tracking_${new Date().toISOString().slice(0, 10)}.csv`);
    setDownloadToast('Exported Performance & Engagement Tracking CSV successfully!');
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
            <button
              onClick={handleExportAllJobs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle text-ink-primary border border-border-rule text-xs font-mono font-medium rounded-editorial transition-colors shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-brand-indigo" />
              <span>Export Dispatches</span>
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

      {/* DUAL-MODE MASTER SWITCHER (OPERATIONS VS TRACKING TELEMETRY) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-paper-raised border border-border-rule rounded-card shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-paper-subtle rounded-editorial font-mono text-xs">
          <button
            onClick={() => setDashboardMode('OPERATIONS')}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-all font-semibold ${
              dashboardMode === 'OPERATIONS'
                ? 'bg-paper-canvas text-brand-indigo shadow-xs border border-brand-indigo/30'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>🎛️ Operations & Dispatch Ledger</span>
          </button>

          <button
            onClick={() => setDashboardMode('TRACKING')}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-all font-semibold ${
              dashboardMode === 'TRACKING'
                ? 'bg-paper-canvas text-brand-indigo shadow-xs border border-brand-indigo/30'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-accent-terracotta" />
            <span>📊 Performance & Tracking (คนดู • คนไลค์ • คลิกลิงก์)</span>
            <span className="px-1.5 py-0.2 rounded bg-accent-terracotta text-white text-[9px] font-bold">
              LIVE
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-ink-secondary pr-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
            <span>Telemetry Stream Active</span>
          </span>
          <span className="text-border-rule">|</span>
          <span className="text-[11px] text-ink-muted">Asia/Bangkok (UTC+7)</span>
        </div>
      </div>

      {/* WORKSPACE & PROJECT FILTER BAR (SHARED ACROSS BOTH MODES) */}
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

      {/* ========================================================================= */}
      {/* MODE 1: OPERATIONAL & PUBLISHING DISPATCH DESK                            */}
      {/* ========================================================================= */}
      {dashboardMode === 'OPERATIONS' && (
        <div className="space-y-7 animate-in fade-in duration-200">
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
                      <div key={batch.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
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

                          <div className="flex items-center gap-2 shrink-0">
                            <StatusTag status={batch.status as any} />
                            
                            <button
                              type="button"
                              onClick={() => setSelectedLiveBatch(batch)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-brand-indigo hover:text-white hover:bg-brand-indigo bg-paper-canvas border border-brand-indigo/30 rounded-editorial transition-all shadow-2xs cursor-pointer group"
                            >
                              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              <span>ดูโพสต์จริง ({batch.placements.filter(p => p.liveUrl).length} ช่องทาง)</span>
                            </button>
                          </div>
                        </div>

                        {/* Status Pills Breakdown */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {batch.placements.map((plc, idx) => {
                            const isFailed = plc.status === 'FAILED';
                            return (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium text-white flex items-center gap-1 ${
                                  isFailed ? 'bg-accent-terracotta' : plc.badgeBg
                                }`}
                              >
                                <span>{plc.label}</span>
                                {isFailed && (
                                  <span className="text-[8px] bg-white/20 px-1 rounded uppercase font-bold">
                                    Error
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>

                        {/* DIRECT LIVE SOCIAL & WEB LINKS TRAY (กางออกมาให้เห็นครบ 100% ทันทีใต้ทุกโพสต์) */}
                        <div className="mt-2 p-2.5 bg-paper-subtle/80 border border-border-rule rounded-editorial space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="font-bold text-ink-primary flex items-center gap-1.5 uppercase tracking-wider">
                              <Globe className="w-3 h-3 text-brand-indigo" />
                              <span>แถบเปิดดูโพสต์จริงบนเว็บ (Live Web Destinations):</span>
                            </span>
                            <span className="text-ink-secondary text-[9px]">
                              คลิกเพื่อเปิดหน้าจริงทันที ↗
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            {batch.placements
                              .filter((p) => p.liveUrl && p.status !== 'FAILED')
                              .map((plc, pIdx) => (
                                <SocialMediaLiveButton
                                  key={pIdx}
                                  platform={plc.platform}
                                  format={plc.format}
                                  label={plc.label}
                                  url={plc.liveUrl!}
                                  onCopy={handleCopyLink}
                                />
                              ))}

                            {batch.websiteUrl && (
                              <SocialMediaLiveButton
                                platform="WEBSITE"
                                label="หน้าเว็บโครงการ"
                                url={batch.websiteUrl}
                                onCopy={handleCopyLink}
                              />
                            )}
                          </div>
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
                        <SocialPlatformIcon platform={ch.platform} size={22} className="shrink-0" />
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: PERFORMANCE & AUDIENCE TRACKING TELEMETRY                         */}
      {/* ========================================================================= */}
      {dashboardMode === 'TRACKING' && (
        <div className="space-y-7 animate-in fade-in duration-200">
          {/* TRACKING PULSE SCORECARDS (Views, Engagement, Link Clicks, Best Property) */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* KPI 1: Total Reach & Views */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  👁️ TOTAL VIEWS & REACH
                </span>
                <TrendingUp className="w-3.5 h-3.5 text-semantic-success" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-ink-primary">
                  {totalViews.toLocaleString()}
                </p>
                <span className="text-[10px] font-mono text-semantic-success font-semibold">
                  +18.4% MoM
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                Across FB, IG, YouTube & TikTok
              </p>
            </div>

            {/* KPI 2: Total Engagements (Likes, Comments, Shares) */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  ❤️ ENGAGEMENTS
                </span>
                <ThumbsUp className="w-3.5 h-3.5 text-brand-indigo" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-ink-primary">
                  {(totalLikes + totalComments + totalShares).toLocaleString()}
                </p>
                <span className="text-[10px] font-mono text-brand-indigo font-semibold">
                  9.8% Avg Rate
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                {totalLikes.toLocaleString()} Likes • {totalComments} Comms • {totalShares} Shares
              </p>
            </div>

            {/* KPI 3: Story Link Sticker Clicks (High Intent Traffic) */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  ⚡ STORY LINK CLICKS
                </span>
                <MousePointerClick className="w-3.5 h-3.5 text-accent-terracotta" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-accent-terracotta">
                  {totalLinkClicks.toLocaleString()}
                </p>
                <span className="text-[10px] font-mono text-accent-terracotta font-semibold">
                  5.4% Avg CTR
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                Direct Web & Landing Page Leads
              </p>
            </div>

            {/* KPI 4: Top Performing Property / Campaign */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  🏆 TOP CONVERTING POST
                </span>
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-lg text-ink-primary truncate max-w-[160px]">
                  The Rich Rama 9
                </p>
                <span className="text-[10px] font-mono text-semantic-success font-semibold">
                  890 Clicks
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono truncate">
                Capital One Real Estate Album + Story
              </p>
            </div>
          </section>

          {/* TRACKING CONTROLS & LEADERBOARD HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-paper-raised border border-border-rule rounded-card">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h2 className="font-serif font-bold text-base text-ink-primary">
                  จัดอันดับ "Top Performing Posts" โพสต์คอนโดและแคมเปญที่ผลตอบรับดีที่สุด
                </h2>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5 font-sans">
                วิเคราะห์ผลตอบรับจริงจากคนดู (Views), ยอดการมีส่วนร่วม (Engagements) และคนคลิกลิงก์ Story (Web Traffic)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <div className="flex items-center gap-1 bg-paper-canvas border border-border-rule rounded-editorial p-1">
                <span className="text-[10px] text-ink-muted pl-1">Sort:</span>
                {[
                  { id: 'OVERALL', label: '🏆 อันดับรวม' },
                  { id: 'VIEWS', label: '👁️ คนดูสูงสุด' },
                  { id: 'ENGAGEMENT', label: '❤️ มีส่วนร่วมสูงสุด' },
                  { id: 'CLICKS', label: '⚡ คนคลิกลิงก์สูงสุด' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setTrackingSort(s.id as any)}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                      trackingSort === s.id
                        ? 'bg-brand-indigo text-white font-bold'
                        : 'text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleExportPerformanceCsv}
                className="px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-primary rounded-editorial flex items-center gap-1.5 transition-colors shadow-2xs font-semibold"
              >
                <Download className="w-3.5 h-3.5 text-brand-indigo" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* TOP PERFORMING POSTS LEADERBOARD LIST */}
          <div className="space-y-4">
            {filteredPerformancePosts.map((post) => (
              <div
                key={post.id}
                className="p-5 bg-paper-raised border border-border-rule rounded-card shadow-xs hover:border-brand-indigo transition-all space-y-3.5"
              >
                {/* Header: Rank + Title + Project */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-editorial bg-paper-subtle border border-border-rule overflow-hidden relative shrink-0">
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-white font-mono text-[9px] font-bold">
                        #{post.rank}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {post.rankBadge}
                        </span>
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-paper-subtle text-brand-indigo border border-border-rule font-semibold">
                          🏢 {post.workspaceName}
                        </span>
                        <span className="text-[10px] font-mono text-ink-secondary">
                          • {post.publishedAt}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-ink-primary">
                        {post.title}
                      </h3>
                    </div>
                  </div>

                  {/* High-level Engagement Badge */}
                  <div className="flex items-center gap-2 self-start lg:self-center font-mono text-xs">
                    <span className="px-2.5 py-1 rounded bg-semantic-success/10 border border-semantic-success/20 text-semantic-success font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-semantic-success text-semantic-success" />
                      <span>{post.engagementRate} Engagement Rate</span>
                    </span>
                  </div>
                </div>

                {/* 5-Column Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs pt-1">
                  <div className="p-2.5 bg-paper-canvas border border-border-rule rounded-editorial text-center">
                    <span className="text-[10px] text-ink-secondary block">👁️ คนดูทั้งหมด (Views)</span>
                    <span className="font-bold text-ink-primary text-sm">{post.views.toLocaleString()}</span>
                  </div>

                  <div className="p-2.5 bg-paper-canvas border border-border-rule rounded-editorial text-center">
                    <span className="text-[10px] text-ink-secondary block">❤️ คนกดไลค์ (Likes)</span>
                    <span className="font-bold text-ink-primary text-sm">{post.likes.toLocaleString()}</span>
                  </div>

                  <div className="p-2.5 bg-paper-canvas border border-border-rule rounded-editorial text-center">
                    <span className="text-[10px] text-ink-secondary block">💬 คอมเมนต์ (Comments)</span>
                    <span className="font-bold text-ink-primary text-sm">{post.comments}</span>
                  </div>

                  <div className="p-2.5 bg-paper-canvas border border-border-rule rounded-editorial text-center">
                    <span className="text-[10px] text-ink-secondary block">🔁 แชร์ (Shares)</span>
                    <span className="font-bold text-ink-primary text-sm">{post.shares}</span>
                  </div>

                  <div className="p-2.5 bg-accent-terracotta/10 border border-accent-terracotta/30 rounded-editorial text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-accent-terracotta font-bold block">⚡ คลิกลิงก์ Story (Clicks)</span>
                    <span className="font-bold text-accent-terracotta text-sm">{post.linkClicks} Clicks ({post.ctr})</span>
                  </div>
                </div>

                {/* DEDICATED DIRECT LIVE LINKS TRAY (กางออกมาให้เห็นครบ 100% ทันที) */}
                <div className="p-2.5 bg-paper-subtle/80 border border-border-rule rounded-editorial space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-ink-primary flex items-center gap-1.5 uppercase tracking-wider">
                      <Globe className="w-3 h-3 text-brand-indigo" />
                      <span>แถบเปิดดูโพสต์จริงบนเว็บ (Live Social & Web Links):</span>
                    </span>
                    <span className="text-ink-secondary text-[9px]">
                      คลิกเพื่อเปิดหน้าจริงทันที ↗
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {post.liveLinks.map((link, lIdx) => (
                      <SocialMediaLiveButton
                        key={lIdx}
                        platform={link.platform}
                        format={link.format}
                        label={link.label}
                        url={link.url}
                        onCopy={handleCopyLink}
                      />
                    ))}

                    {post.websiteUrl && (
                      <SocialMediaLiveButton
                        platform="WEBSITE"
                        label={post.websiteLabel || 'หน้าเว็บโครงการ'}
                        url={post.websiteUrl}
                        onCopy={handleCopyLink}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FORMAT SYNERGY & CONVERSION DEEP-DIVE INSIGHT */}
          <div className="p-5 bg-gradient-to-r from-brand-indigo/5 via-accent-terracotta/5 to-transparent border border-border-rule rounded-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-indigo" />
                <h4 className="font-serif font-bold text-sm text-ink-primary">
                  กลยุทธ์สร้างยอดขายคอนโด (Conversion Insight): พลังของ 24h Story + Link Sticker
                </h4>
              </div>
              <p className="text-xs text-ink-secondary max-w-2xl font-sans leading-relaxed">
                โพสต์แบบ <strong className="text-ink-primary">Feed Album</strong> สร้างการรับรู้และการแชร์สูงสุด (Reach Leader) ในขณะที่ <strong className="text-accent-terracotta">24h Story พร้อม Interactive Link Sticker</strong> สร้างยอดคนคลิกเข้าหน้าเว็บโครงการสูงกว่าถึง <strong className="text-ink-primary">3.2 เท่า</strong> (890 vs 280 clicks) ทำให้ควรจับคู่โพสต์ Feed และ Story ควบคู่กันเสมอในทุกแคมเปญ
              </p>
            </div>

            <Link
              href="/create"
              className="px-4 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold rounded-editorial shrink-0 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>สร้างแคมเปญแบบคู่นี้ทันที</span>
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIVE POSTS & WEB DIRECTORY MODAL                                          */}
      {/* ========================================================================= */}
      {selectedLiveBatch && (
        <div className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper-raised border border-border-rule rounded-card max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-base text-ink-primary">
                    เปิดดูโพสต์จริงบนเว็บ (Live Social Links)
                  </h3>
                  <span className="text-[10px] font-mono text-ink-secondary block">
                    {selectedLiveBatch.title} • {selectedLiveBatch.workspaceName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLiveBatch(null)}
                className="p-1 rounded text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {copiedLinkNotice && (
              <div className="p-2 bg-semantic-success/10 border border-semantic-success/30 text-semantic-success rounded-editorial text-xs font-mono flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{copiedLinkNotice}</span>
              </div>
            )}

            <div className="space-y-2.5 text-xs">
              <span className="text-[10px] font-mono uppercase text-ink-secondary block font-semibold">
                ช่องทางโซเชียลที่เผยแพร่แล้ว (Published Destinations):
              </span>

              {selectedLiveBatch.placements.filter((p) => p.liveUrl).map((plc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-paper-canvas border border-border-rule rounded-editorial flex items-center justify-between gap-3 hover:border-brand-indigo transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SocialPlatformIcon platform={plc.platform} format={plc.format} size={24} className="shrink-0" />
                    <div className="truncate">
                      <p className="font-medium text-ink-primary text-xs truncate">
                        {plc.label}
                      </p>
                      <span className="font-mono text-[10px] text-ink-secondary truncate block">
                        {plc.liveUrl}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(plc.liveUrl!, plc.label)}
                      className="p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle rounded border border-border-rule transition-colors cursor-pointer"
                      title="คัดลอกลิงก์"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={plc.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>เปิดดูโพสต์</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}

              {/* Website Project Landing Page */}
              {selectedLiveBatch.websiteUrl && (
                <div className="mt-3 p-3 bg-brand-indigo/5 border border-brand-indigo/20 rounded-editorial flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SocialPlatformIcon platform="WEBSITE" size={24} className="shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-brand-indigo font-bold block">
                        เว็บไซต์โครงการ / Landing Page:
                      </span>
                      <p className="font-mono text-xs text-ink-primary truncate font-semibold mt-0.5">
                        {selectedLiveBatch.websiteUrl}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(selectedLiveBatch.websiteUrl!, 'Landing Webpage')}
                      className="p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-paper-canvas rounded border border-border-rule transition-colors cursor-pointer"
                      title="คัดลอกลิงก์"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={selectedLiveBatch.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle text-brand-indigo border border-brand-indigo/30 rounded text-xs font-mono font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>เปิดดูเว็บ</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end border-t border-border-rule">
              <button
                type="button"
                onClick={() => setSelectedLiveBatch(null)}
                className="px-3 py-1.5 text-ink-secondary hover:text-ink-primary text-xs font-mono cursor-pointer"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
