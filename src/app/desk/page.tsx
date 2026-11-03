'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Masthead 
} from '@/components/ui/masthead';
import { 
  StatusTag 
} from '@/components/ui/status-tag';
import { 
  SmartFilterBar 
} from '@/components/ui/smart-filter-bar';
import { useTranslation } from '@/modules/i18n/i18n-context';
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
  Filter,
  Users,
  Target,
  ShieldCheck,
  Heart,
  Edit3,
  Save,
  RotateCcw,
  Wand2,
  Printer,
  Trash2
} from 'lucide-react';
import { 
  getEmployeeKPIs, 
  getDepartmentSummary, 
  EmployeeKPI,
  generateAiKpiCoaching,
  saveEmployeeKpiEvaluation,
  resetEmployeeKpiEvaluations
} from '@/modules/analytics/kpi-engine';
import { 
  getPostDiagnosis, 
  PostDiagnosisInsight 
} from '@/modules/analytics/ai-insights';
import { recordTeamTokenConsumption } from '@/modules/workspaces/team-roles';
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
  WebsiteLogo,
  XLogo,
  Lemon8Logo 
} from '@/components/ui/social-icons';
import { Sticker } from '@/components/ui/sticker';
import { 
  getActiveWorkspaceId, 
  setActiveWorkspaceId, 
  subscribeToActiveWorkspace 
} from '@/modules/workspaces/active-workspace';
import { 
  isMockDataCleared, 
  clearAllMockData, 
  loadSampleMockData, 
  subscribeToMockDataChange 
} from '@/modules/data/mock-data-manager';
import { EditorialEmptyState } from '@/components/ui/editorial-empty-state';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { getCurrentUser, subscribeToAuthChange } from '@/modules/auth/auth-service';
import { AuthUser } from '@/modules/auth/auth-types';

interface DispatchPlacement {
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK' | 'X' | 'LEMON8';
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
    btnColor: string;
  }[];
  websiteUrl?: string;
  websiteLabel?: string;
  websiteLabelEn?: string;
}

const SAMPLE_BATCHES: DispatchBatch[] = [
  {
    id: 'MP-BATCH-895',
    workspaceId: 'ws_main',
    workspaceName: 'Main Studio',
    title: 'Bangkok Gazette: Studio Suite Showcase',
    timestamp: 'Today 08:30 AM',
    status: 'PARTIALLY_PUBLISHED',
    websiteUrl: 'https://retzpost.io/showcase',
    lineContactUrl: 'https://line.me/ti/p/@retzpost',
    liveUrl: 'https://www.facebook.com/bangkokgazette/posts/991283',
    placements: [
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'FB Official Brand Album (6)', 
        badgeBg: 'bg-[#1877F2]', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.facebook.com/officialbrand/posts/991283'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'FEED', 
        label: 'IG Carousel (6)', 
        badgeBg: 'bg-brand-indigo', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/p/prime-skyview/'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'STORY', 
        label: 'IG Story 24h + Link', 
        badgeBg: 'bg-accent-terracotta', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/stories/brand.official/348910283/'
      },
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'Media Partner Page', 
        badgeBg: 'bg-accent-terracotta', 
        status: 'FAILED', 
        error: 'Token Expired (Code: 190)' 
      },
    ],
  },
  {
    id: 'MP-BATCH-892',
    workspaceId: 'ws_creator',
    workspaceName: 'Creator Hub',
    title: 'Behind the Scenes: Studio Redesign Tour',
    timestamp: 'Today 09:15 AM',
    status: 'PARTIALLY_PUBLISHED',
    websiteUrl: 'https://creatorhub.io/redesign-tour',
    liveUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ',
    placements: [
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'FB Page Album', 
        badgeBg: 'bg-[#1877F2]', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.facebook.com/creatorstudio/posts/89201'
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
        liveUrl: 'https://www.instagram.com/stories/creator_official/'
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
    workspaceId: 'ws_main',
    workspaceName: 'Main Studio',
    title: 'The Master Collection: Panoramic City View',
    timestamp: 'Yesterday 04:30 PM',
    status: 'PUBLISHED',
    websiteUrl: 'https://yourbrand.com/master-collection',
    liveUrl: 'https://www.facebook.com/officialbrand/posts/449102',
    placements: [
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'Global Partner Page', 
        badgeBg: 'bg-[#1877F2]', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.facebook.com/officialbrand/posts/449102'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'FEED', 
        label: 'IG Carousel (4)', 
        badgeBg: 'bg-brand-indigo', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/p/C1StudioDesk/'
      },
      { 
        platform: 'INSTAGRAM', 
        format: 'STORY', 
        label: 'IG Story 24h + Link', 
        badgeBg: 'bg-accent-terracotta', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.instagram.com/stories/brand.official/'
      },
      { 
        platform: 'FACEBOOK', 
        format: 'FEED', 
        label: 'Regional Channel', 
        badgeBg: 'bg-[#1877F2]', 
        status: 'PUBLISHED',
        liveUrl: 'https://www.facebook.com/regionalbrand/posts/110293'
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
    project: 'Creator Hub',
    format: 'Reel (00:58)',
    destination: '@creator_official (TikTok)',
    badgeColor: 'bg-ink-primary',
  },
  {
    time: 'Today 11:30 AM',
    title: 'Bangkok Gazette: Story Link Push',
    project: 'Main Studio',
    format: 'Story + Link Sticker',
    destination: '@brand.official (IG)',
    badgeColor: 'bg-accent-terracotta',
  },
  {
    time: 'Today 02:00 PM',
    title: 'Weekly Market Brief: Social Platform Algorithm Shifts in 2026',
    project: 'Tech & Product Studio',
    format: 'Carousel & Feed',
    destination: 'FB Page & IG Feed',
    badgeColor: 'bg-brand-indigo',
  },
  {
    time: 'Tomorrow 09:00 AM',
    title: '3 Hooks That Stop the Scroll in 2026',
    project: 'Creator Hub',
    format: 'Shorts • 00:45',
    destination: '@CreatorClips (YouTube)',
    badgeColor: 'bg-semantic-info',
  },
];

const CHANNEL_HEALTH = [
  {
    name: 'Official Brand (FB Page)',
    platform: 'Facebook',
    handle: 'officialbrand',
    status: 'HEALTHY',
    tokenExpiry: '38 days remaining',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
  },
  {
    name: 'Creator Hub (YouTube Shorts)',
    platform: 'YouTube',
    handle: '@CreatorStudioOfficial',
    status: 'HEALTHY',
    tokenExpiry: 'Google OAuth Active',
    avatarBg: 'bg-semantic-info',
    avatarText: 'YT',
  },
  {
    name: 'Creator Hub (Instagram Pro)',
    platform: 'Instagram',
    handle: '@creator_official',
    status: 'HEALTHY',
    tokenExpiry: 'Meta Token Valid',
    avatarBg: 'bg-brand-indigo',
    avatarText: 'IG',
  },
  {
    name: 'Media Partner (FB Page)',
    platform: 'Facebook',
    handle: 'partner.official',
    status: 'ATTENTION',
    tokenExpiry: 'Token Expired (Code: 190)',
    avatarBg: 'bg-accent-terracotta',
    avatarText: 'FB',
  },
  {
    name: 'Brand Showcase (Instagram Story)',
    platform: 'Instagram',
    handle: 'brand.showcase',
    status: 'WARNING',
    tokenExpiry: 'Aspect ratio mismatch (1:1 vs 9:16)',
    avatarBg: 'bg-accent-terracotta',
    avatarText: 'IG',
  },
  {
    name: 'Creator Hub (TikTok Creator)',
    platform: 'TikTok',
    handle: '@creator_official',
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
    title: 'Bangkok Gazette: Studio Suite Showcase',
    workspaceId: 'ws_main',
    workspaceName: 'Main Studio',
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
    rankBadge: 'RANK 1 • TOP PERFORMING CAMPAIGN',
    liveLinks: [
      {
        platform: 'FACEBOOK',
        format: 'FEED',
        label: 'FB Official Brand',
        url: 'https://www.facebook.com/officialbrand/posts/991283',
        btnColor: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'FEED',
        label: 'IG Carousel',
        url: 'https://www.instagram.com/p/prime-skyview/',
        btnColor: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'STORY',
        label: 'IG Story',
        url: 'https://www.instagram.com/stories/brand.official/348910283/',
        btnColor: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
      },
    ],
    websiteUrl: 'https://yourbrand.com/prime-skyview',
    websiteLabel: 'หน้าเว็บแคมเปญ',
    websiteLabelEn: 'Campaign Website',
  },
  {
    id: 'perf-2',
    batchId: 'MP-BATCH-890',
    title: 'The Master Collection: Panoramic City View',
    workspaceId: 'ws_main',
    workspaceName: 'Main Studio',
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
    rankBadge: 'RANK 2 • TOP LUXURY ENGAGEMENT',
    liveLinks: [
      {
        platform: 'FACEBOOK',
        format: 'FEED',
        label: 'Partner FB',
        url: 'https://www.facebook.com/partner/posts/449102',
        btnColor: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'FEED',
        label: 'IG Carousel',
        url: 'https://www.instagram.com/p/master-collection/',
        btnColor: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'STORY',
        label: 'IG Story',
        url: 'https://www.instagram.com/stories/brand.official/',
        btnColor: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
      },
    ],
    websiteUrl: 'https://yourbrand.com/master-collection',
    websiteLabel: 'หน้าเว็บแคมเปญ',
    websiteLabelEn: 'Campaign Website',
  },
  {
    id: 'perf-3',
    batchId: 'MP-BATCH-892',
    title: 'Behind the Scenes: Studio Redesign Tour',
    workspaceId: 'ws_creator',
    workspaceName: 'Creator Hub',
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
    rankBadge: 'RANK 3 • TOP VIDEO RETENTION',
    liveLinks: [
      {
        platform: 'YOUTUBE',
        format: 'REEL',
        label: 'YT Shorts',
        url: 'https://youtube.com/shorts/dQw4w9WgXcQ',
        btnColor: 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'FEED',
        label: 'IG Feed',
        url: 'https://www.instagram.com/p/example-carousel',
        btnColor: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'STORY',
        label: 'IG Story',
        url: 'https://www.instagram.com/stories/creator_official/',
        btnColor: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
      },
      {
        platform: 'FACEBOOK',
        format: 'FEED',
        label: 'FB Studio',
        url: 'https://www.facebook.com/creatorstudio/posts/89201',
        btnColor: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
      },
    ],
    websiteUrl: 'https://creatorhub.io/redesign-tour',
    websiteLabel: 'หน้าเว็บ Creator',
    websiteLabelEn: 'Creator Portal',
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
    rankBadge: 'RANK 4 • TOP B2B CONVERSION',
    liveLinks: [
      {
        platform: 'FACEBOOK',
        format: 'FEED',
        label: 'FB RetzPost',
        url: 'https://www.facebook.com/retzpost/posts/202610',
        btnColor: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'STORY',
        label: 'IG Story',
        url: 'https://www.instagram.com/stories/retzpost_app/',
        btnColor: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
      },
      {
        platform: 'YOUTUBE',
        format: 'REEL',
        label: 'YT Shorts',
        url: 'https://youtube.com/shorts/dQw4w9WgXcQ',
        btnColor: 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100',
      },
    ],
    websiteUrl: 'https://retzpost.io/whats-new',
    websiteLabel: 'หน้าเว็บ Changelog',
    websiteLabelEn: 'Changelog Page',
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
    rankBadge: 'RANK 5 • TOP COMMUNITY REACH',
    liveLinks: [
      {
        platform: 'FACEBOOK',
        format: 'FEED',
        label: 'FB Cafe',
        url: 'https://www.facebook.com/coffeecraftbkk/posts/33109',
        btnColor: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'FEED',
        label: 'IG Feed',
        url: 'https://www.instagram.com/p/coffeecraft/',
        btnColor: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
      },
      {
        platform: 'INSTAGRAM',
        format: 'STORY',
        label: 'IG Story',
        url: 'https://www.instagram.com/stories/coffeecraft.bkk/',
        btnColor: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
      },
    ],
    websiteUrl: 'https://coffeecraft.bkk/menu',
    websiteLabel: 'หน้าเมนูร้าน',
    websiteLabelEn: 'Store Menu',
  },
];

export default function HomePage() {
  const { t, locale } = useTranslation();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const unsub = subscribeToAuthChange((user) => setCurrentUser(user));
    return () => unsub();
  }, []);

  const [dashboardMode, setDashboardMode] = useState<'OPERATIONS' | 'TRACKING' | 'TEAM_KPI'>('OPERATIONS');
  const [workspaceFilter, setWorkspaceFilter] = useState<string>('ALL');
  const [batchTab, setBatchTab] = useState<'ALL' | 'MAIN_STUDIO' | 'CREATOR_HUB' | 'NEEDS_ATTENTION'>('ALL');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [selectedLiveBatch, setSelectedLiveBatch] = useState<DispatchBatch | null>(null);
  const [copiedLinkNotice, setCopiedLinkNotice] = useState<string | null>(null);

  // Revoke & Delete Post States
  const [revokeCandidateBatch, setRevokeCandidateBatch] = useState<DispatchBatch | null>(null);
  const [revokedBatchIds, setRevokedBatchIds] = useState<Record<string, boolean>>({});
  const [isApiDeleting, setIsApiDeleting] = useState<Record<string, boolean>>({});

  // Performance Tracking States
  const [performancePosts, setPerformancePosts] = useState<PostPerformanceData[]>(SAMPLE_PERFORMANCE_POSTS);
  const [trackingSort, setTrackingSort] = useState<'OVERALL' | 'VIEWS' | 'ENGAGEMENT' | 'CLICKS'>('OVERALL');
  const [trackingTimeframe, setTrackingTimeframe] = useState<'30D' | '7D' | 'ALL'>('30D');

  // Live Telemetry Sync States & Rate-Limit Cooldown
  const [isSyncingTelemetry, setIsSyncingTelemetry] = useState<boolean>(false);
  const [telemetryLastSynced, setTelemetryLastSynced] = useState<string | null>(null);
  const [telemetryCooldownRemaining, setTelemetryCooldownRemaining] = useState<number>(0);
  const [telemetryNotice, setTelemetryNotice] = useState<string | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (telemetryCooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setTelemetryCooldownRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [telemetryCooldownRemaining]);

  const handleManualTelemetrySync = async () => {
    if (isSyncingTelemetry || telemetryCooldownRemaining > 0) return;
    setIsSyncingTelemetry(true);
    setTelemetryNotice(null);

    try {
      const res = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspaceFilter,
          mockPosts: performancePosts.map((p) => ({
            id: p.id,
            title: p.title,
            views: p.views,
            likes: p.likes,
            comments: p.comments,
            shares: p.shares,
            linkClicks: p.linkClicks,
            platform: p.liveLinks[0]?.platform || 'FACEBOOK',
            publishedAt: new Date().toISOString(),
          })),
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setTelemetryCooldownRemaining(data.cooldownSecondsRemaining || 60);
        setTelemetryNotice(data.message || (locale === 'en' ? 'Rate Limit Protection: Please wait a moment' : 'ระบบป้องกัน Rate Limit: กรุณารอสักครู่'));
      } else if (res.ok && data.status === 'SUCCESS') {
        if (data.records && data.records.length > 0) {
          setPerformancePosts((prev) =>
            prev.map((post) => {
              const matched = data.records.find((r: any) => r.id === post.id);
              if (matched && matched.metrics) {
                return {
                  ...post,
                  views: matched.metrics.views,
                  likes: matched.metrics.likes,
                  comments: matched.metrics.comments,
                  shares: matched.metrics.shares,
                  linkClicks: matched.metrics.linkClicks,
                  ctr: matched.metrics.ctr || post.ctr,
                  engagementRate: matched.metrics.engagementRate || post.engagementRate,
                };
              }
              return post;
            })
          );
        }

        const timeLocale = locale === 'en' ? 'en-US' : 'th-TH';
        const timeStr = new Date().toLocaleTimeString(timeLocale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setTelemetryLastSynced(locale === 'en' ? `Last updated ${timeStr}` : `อัปเดตล่าสุด ${timeStr}`);
        setTelemetryCooldownRemaining(data.cooldownSecondsRemaining || 60);
        setTelemetryNotice(locale === 'en' ? 'Live telemetry synced successfully (-2 Master Tokens)' : 'ซิงค์ตัวเลขสถิติสดเรียบร้อยแล้ว (-2 Master Tokens)');

        // Deduct 2 tokens and record team log
        fetch('/api/billing/tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionKey: 'FORCE_SYNC_NOW',
            actorName: currentUser?.name || 'Staff Member',
            description: locale === 'en' ? `Fetch live telemetry (${workspaceFilter})` : `ดึงยอดวิวย้อนหลังสด (${workspaceFilter})`,
          }),
        }).catch(() => null);
        recordTeamTokenConsumption(currentUser?.email || 'admin@retzpost.com', 'FORCE_SYNC_NOW', locale === 'en' ? 'Live Telemetry Force Sync' : 'ดึงยอดวิวสดทันที', 2);
      } else {
        setTelemetryNotice(locale === 'en' ? 'Error fetching data. Please try again.' : 'เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง');
      }
    } catch {
      setTelemetryNotice(locale === 'en' ? 'Cannot connect to API at this time.' : 'ไม่สามารถเชื่อมต่อ API ได้ในขณะนี้');
    } finally {
      setIsSyncingTelemetry(false);
      setTimeout(() => setTelemetryNotice(null), 5000);
    }
  };

  // Employee KPI & AI Post Diagnosis States
  const [selectedEmployeeKpi, setSelectedEmployeeKpi] = useState<EmployeeKPI | null>(null);
  const [selectedPostDiagnosis, setSelectedPostDiagnosis] = useState<PostDiagnosisInsight | null>(null);
  const [kpiTimeframe, setKpiTimeframe] = useState<'THIS_MONTH' | 'LAST_MONTH' | 'Q3_2026'>('THIS_MONTH');
  const [kpiUpdateVersion, setKpiUpdateVersion] = useState<number>(0);
  const [isEditingKpiNotes, setIsEditingKpiNotes] = useState<boolean>(false);
  const [editStrengths, setEditStrengths] = useState<string>('');
  const [editCoachingNotes, setEditCoachingNotes] = useState<string>('');
  const [editFocusTags, setEditFocusTags] = useState<string[]>([]);
  const [isAiGeneratingCoaching, setIsAiGeneratingCoaching] = useState<boolean>(false);
  const [kpiEvaluationNotice, setKpiEvaluationNotice] = useState<string | null>(null);
  const [isEvaluationSlipOpen, setIsEvaluationSlipOpen] = useState<boolean>(false);
  const [isMockCleared, setIsMockCleared] = useState<boolean>(true);

  // Subscribe to mock data clean / demo toggle
  useEffect(() => {
    setIsMockCleared(isMockDataCleared());
    const unsub = subscribeToMockDataChange((cleared) => {
      setIsMockCleared(cleared);
    });
    return unsub;
  }, []);

  // Sync active workspace from shared engine and listen to changes
  useEffect(() => {
    const globalWs = getActiveWorkspaceId();
    if (globalWs && globalWs !== workspaceFilter) {
      setWorkspaceFilter(globalWs);
    }
    const unsubscribe = subscribeToActiveWorkspace((newWs) => {
      setWorkspaceFilter(newWs);
    });
    return unsubscribe;
  }, []);

  const handleSelectWorkspaceFilter = (wsId: string) => {
    setWorkspaceFilter(wsId);
    setActiveWorkspaceId(wsId);
  };

  // Tab persistence: read from URL query param ?tab= or localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam) {
        if (['kpi', 'team_kpi', 'team'].includes(tabParam.toLowerCase())) {
          setDashboardMode('TEAM_KPI');
        } else if (['performance', 'tracking'].includes(tabParam.toLowerCase())) {
          setDashboardMode('TRACKING');
        } else if (['operations', 'dispatch'].includes(tabParam.toLowerCase())) {
          setDashboardMode('OPERATIONS');
        }
      } else {
        const stored = window.localStorage.getItem('retzpost_active_dashboard_tab');
        if (stored && ['OPERATIONS', 'TRACKING', 'TEAM_KPI'].includes(stored)) {
          setDashboardMode(stored as any);
        }
      }
    } catch {}
  }, []);

  // Switch tab with URL search parameter & localStorage persistence
  const handleSwitchDashboardMode = (mode: 'OPERATIONS' | 'TRACKING' | 'TEAM_KPI') => {
    setDashboardMode(mode);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('retzpost_active_dashboard_tab', mode);
        const tabParam = mode === 'TEAM_KPI' ? 'kpi' : mode === 'TRACKING' ? 'performance' : 'operations';
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tabParam);
        window.history.replaceState(null, '', url.toString());
      } catch {}
    }
  };

  // Employee KPI Queries
  const employeeKpis = useMemo(() => {
    return getEmployeeKPIs(workspaceFilter);
  }, [workspaceFilter, kpiUpdateVersion, isMockCleared]);

  const departmentSummary = useMemo(() => {
    return getDepartmentSummary(workspaceFilter);
  }, [workspaceFilter, kpiUpdateVersion, isMockCleared]);

  const handleOpenEmployeeScorecard = (emp: EmployeeKPI) => {
    setSelectedEmployeeKpi(emp);
    setIsEditingKpiNotes(false);
    setEditStrengths(emp.strengthsTh);
    setEditCoachingNotes(emp.coachingNotesTh);
    setEditFocusTags(emp.focusTags || []);
  };

  const handleAiGenerateCoaching = () => {
    if (!selectedEmployeeKpi) return;
    setIsAiGeneratingCoaching(true);
    
    // Simulate brief AI inference time for delightful feedback
    setTimeout(() => {
      const result = generateAiKpiCoaching(selectedEmployeeKpi);
      setEditStrengths(locale === 'en' ? (result.strengthsEn || result.strengthsTh) : result.strengthsTh);
      setEditCoachingNotes(locale === 'en' ? (result.coachingNotesEn || result.coachingNotesTh) : result.coachingNotesTh);
      setEditFocusTags(result.focusTags);
      setIsEditingKpiNotes(true);
      setIsAiGeneratingCoaching(false);
      setKpiEvaluationNotice(locale === 'en' ? 'AI drafted strengths & coaching plan successfully (-10 Master Tokens)' : 'AI ร่างจุดเด่นและแผนโค้ชชิ่งให้เรียบร้อยแล้ว (-10 Master Tokens)');
      setTimeout(() => setKpiEvaluationNotice(null), 4000);

      // Deduct 10 tokens and record team log
      fetch('/api/billing/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionKey: 'AI_KPI_COACHING',
          actorName: currentUser?.name || 'Staff Member',
          description: locale === 'en' ? `AI Draft Coaching Plan: ${selectedEmployeeKpi.name}` : `AI ร่างแผนโค้ชชิ่ง: ${selectedEmployeeKpi.name}`,
        }),
      }).catch(() => null);
      recordTeamTokenConsumption(currentUser?.email || 'admin@retzpost.com', 'AI_KPI_COACHING', locale === 'en' ? 'AI Draft Team Coaching Plan' : 'AI ร่างแผนโค้ชชิ่งลูกทีม', 10);
    }, 500);
  };

  const handleSaveKpiEvaluation = () => {
    if (!selectedEmployeeKpi) return;
    saveEmployeeKpiEvaluation(
      selectedEmployeeKpi.memberId,
      editStrengths,
      editCoachingNotes,
      editFocusTags,
      false
    );

    const updatedEmp: EmployeeKPI = {
      ...selectedEmployeeKpi,
      strengthsTh: editStrengths,
      strengthsEn: editStrengths,
      coachingNotesTh: editCoachingNotes,
      coachingNotesEn: editCoachingNotes,
      focusTags: editFocusTags,
      lastEvaluatedAt: new Date().toISOString(),
      evaluatedBy: locale === 'en' ? 'Lead Editor' : 'หัวหน้างาน (Lead Editor)',
      evaluatedByEn: 'Lead Editor',
      isAiGenerated: false,
    };

    setSelectedEmployeeKpi(updatedEmp);
    setKpiUpdateVersion((v) => v + 1);
    setIsEditingKpiNotes(false);
    setKpiEvaluationNotice(locale === 'en' ? `Evaluation and coaching plan for "${selectedEmployeeKpi.name}" saved.` : `บันทึกการประเมินและแผนโค้ชชิ่งของ "${selectedEmployeeKpi.name}" เรียบร้อยแล้ว`);
    setTimeout(() => setKpiEvaluationNotice(null), 3500);
  };

  const handleResetKpis = () => {
    resetEmployeeKpiEvaluations();
    setKpiUpdateVersion((v) => v + 1);
    if (selectedEmployeeKpi) {
      const refreshed = getEmployeeKPIs(workspaceFilter).find(
        (e) => e.memberId === selectedEmployeeKpi.memberId
      );
      if (refreshed) {
        setSelectedEmployeeKpi(refreshed);
        setEditStrengths(refreshed.strengthsTh);
        setEditCoachingNotes(refreshed.coachingNotesTh);
        setEditFocusTags(refreshed.focusTags || []);
      }
    }
    setKpiEvaluationNotice(locale === 'en' ? 'Evaluation reset to standard defaults.' : 'คืนค่าการประเมินกลับสู่ค่ามาตรฐานเรียบร้อยแล้ว');
    setTimeout(() => setKpiEvaluationNotice(null), 3000);
  };

  const handleCopyLink = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkNotice(locale === 'en' ? `Copied link "${label}"` : `คัดลอกลิงก์ "${label}" แล้ว`);
    setTimeout(() => setCopiedLinkNotice(null), 2500);
  };

  // Filtered batches for Operational View
  const filteredBatches = useMemo(() => {
    if (isMockCleared) return [];
    return SAMPLE_BATCHES.filter((b) => {
      if (workspaceFilter !== 'ALL' && b.workspaceId !== workspaceFilter) return false;
      if (batchTab === 'MAIN_STUDIO') return b.workspaceId === 'ws_main' || b.workspaceId === 'ws_capitalone';
      if (batchTab === 'CREATOR_HUB') return b.workspaceId === 'ws_creator' || b.workspaceId === 'ws_acme';
      if (batchTab === 'NEEDS_ATTENTION') return ['PARTIALLY_PUBLISHED', 'FAILED_RETRYABLE', 'FAILED_FINAL'].includes(b.status);
      return true;
    });
  }, [isMockCleared, workspaceFilter, batchTab]);

  // Filtered & Sorted Performance Posts for Tracking View
  const filteredPerformancePosts = useMemo(() => {
    if (isMockCleared) return [];
    let posts = performancePosts.filter((p) => {
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
  }, [isMockCleared, workspaceFilter, trackingSort, performancePosts]);

  // Upcoming scheduled timeline items
  const timelineItems = useMemo(() => {
    if (isMockCleared) return [];
    return SCHEDULED_TIMELINE;
  }, [isMockCleared]);

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
        handle: 'Media Partner FB',
        storyTitle: 'Bangkok Gazette: Studio Suite Showcase',
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
        handle: 'brand.showcase',
        storyTitle: 'Bangkok Gazette: Studio Suite Showcase',
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
        handle: '@creator_official',
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
        handle: 'Bangkok Gazette Page',
        storyTitle: 'Bangkok Gazette: Studio Suite Showcase',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 08:30 AM',
        liveUrl: 'https://facebook.com/bangkokgazette/posts/991283',
      },
      {
        id: 'MP-JOB-1054',
        platform: 'INSTAGRAM',
        format: 'FEED_POST',
        handle: 'bangkok.gazette',
        storyTitle: 'Bangkok Gazette: Studio Suite Showcase',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 08:30 AM',
        liveUrl: 'https://instagram.com/p/bangkok-gazette',
      },
      {
        id: 'MP-JOB-1055',
        platform: 'FACEBOOK',
        format: 'FEED_POST',
        handle: 'Media Partner FB',
        storyTitle: 'Bangkok Gazette: Studio Suite Showcase',
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
        handle: 'Creator Studio Media',
        storyTitle: 'Behind the Scenes: Studio Redesign Tour',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 09:15 AM',
        liveUrl: 'https://facebook.com/creatorstudio/posts/89201',
      },
      {
        id: 'MP-JOB-1052',
        platform: 'INSTAGRAM',
        format: 'STORY',
        handle: '@creator_official',
        storyTitle: 'Omni-Format Publishing: Simultaneous Feed & Story',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: 'Today 09:00 AM',
        liveUrl: 'https://instagram.com/stories/creator_official',
      },
      {
        id: 'MP-JOB-1049',
        platform: 'YOUTUBE',
        format: 'VIDEO_REEL',
        handle: '@CreatorStudioOfficial',
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
    <main className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* EXECUTIVE MASTHEAD & QUICK CONTROLS */}
      <Masthead
        title={t('desk.pageTitle')}
        subtitle={t('desk.pageSubtitle')}
        folio={locale === 'th' ? 'โต๊ะทำงานส่วนกลาง / ศูนย์ควบคุมผู้บริหาร' : 'SYSTEM DESK / EXECUTIVE COMMAND'}
        editionDate={locale === 'th' ? 'ชุดเครื่องมือเผยแพร่มัลติแพลตฟอร์ม' : 'ALL-IN-ONE ENTERPRISE SUITE'}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {isMockCleared ? (
              <button
                type="button"
                onClick={() => {
                  loadSampleMockData();
                  setDownloadToast(locale === 'en' ? 'Loaded demo sample data for preview and testing.' : 'โหลดข้อมูลตัวอย่างสำหรับการพรีวิวและทดสอบระบบเรียบร้อยแล้ว');
                  setTimeout(() => setDownloadToast(null), 3500);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule text-xs font-sans font-medium rounded-editorial transition-colors shadow-2xs cursor-pointer"
                title={locale === 'en' ? 'Load sample dataset (Dispatches, Telemetry, KPIs) for preview' : 'โหลดชุดข้อมูลตัวอย่าง (Dispatches, Telemetry, KPIs) เพื่อพรีวิวการแสดงผล'}
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-ochre" />
                <span>{locale === 'th' ? 'โหลดข้อมูลตัวอย่าง (Demo)' : 'Load Demo Data'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  clearAllMockData();
                  setDownloadToast(locale === 'en' ? 'Cleared all mock data (Clean Slate / Zero Data).' : 'เคลียร์ข้อมูลจำลองทั้งหมดเรียบร้อยแล้ว (Clean Slate / Zero Data)');
                  setTimeout(() => setDownloadToast(null), 3500);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule text-xs font-sans font-medium rounded-editorial transition-colors shadow-2xs cursor-pointer"
                title={locale === 'en' ? 'Clear all mock data to restore system to zero state' : 'เคลียร์ข้อมูลจำลองทั้งหมด ให้ระบบกลับสู่ Zero State สำหรับใช้งานจริง'}
              >
                <RotateCcw className="w-3.5 h-3.5 text-ink-secondary" />
                <span>{locale === 'th' ? 'ล้างข้อมูลจำลอง (Clear All)' : 'Clear All Mock Data'}</span>
              </button>
            )}

            {!isMockCleared && (
              <button
                onClick={handleExportErrorLog}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule text-xs font-sans font-medium rounded-editorial transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-accent-terracotta" />
                <span>Export Error Log</span>
                <span className="px-1.5 py-0.2 rounded-full bg-accent-terracotta/15 text-accent-terracotta text-[9px] font-bold">
                  2
                </span>
              </button>
            )}
            <Link
              href="/landing"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule text-xs font-sans font-medium rounded-editorial transition-colors shadow-2xs"
              title={locale === 'en' ? 'View public Dream Press Landing Page' : 'เปิดดูหน้า Dream Press Landing Page สาธารณะ'}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
              <span>Dream Press Landing</span>
            </Link>
            <button
              onClick={handleExportAllJobs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule text-xs font-sans font-medium rounded-editorial transition-colors shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-brand-indigo" />
              <span>Export Dispatches</span>
            </button>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-indigo text-white text-xs font-sans font-semibold rounded-editorial hover:bg-brand-indigo-hover transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{locale === 'th' ? 'สร้างโพสต์ใหม่' : 'Compose Dispatch'}</span>
            </Link>
          </div>
        }
      />

      {/* TOAST DOWNLOAD NOTIFICATION */}
      {downloadToast && (
        <div className="bg-semantic-success/10 border border-semantic-success/30 text-semantic-success px-4 py-2.5 rounded-editorial flex items-center justify-between text-xs font-sans animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{downloadToast}</span>
          </div>
          <button onClick={() => setDownloadToast(null)} className="hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TRIPLE-MODE MASTER SWITCHER (OPERATIONS VS CONTENT TRACKING VS STAFF KPI) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-2 bg-paper-raised border border-border-rule rounded-card shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-paper-subtle rounded-editorial font-sans text-xs">
          <button
            onClick={() => handleSwitchDashboardMode('OPERATIONS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded transition-all font-semibold cursor-pointer ${
              dashboardMode === 'OPERATIONS'
                ? 'bg-paper-canvas text-brand-indigo shadow-xs border border-brand-indigo/30'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{t('desk.operationsTab')}</span>
          </button>

          <button
            onClick={() => handleSwitchDashboardMode('TRACKING')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded transition-all font-semibold cursor-pointer ${
              dashboardMode === 'TRACKING'
                ? 'bg-paper-canvas text-brand-indigo shadow-xs border border-brand-indigo/30'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-accent-terracotta" />
            <span>{t('desk.trackingTab')}</span>
          </button>

          <button
            onClick={() => handleSwitchDashboardMode('TEAM_KPI')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded transition-all font-semibold cursor-pointer ${
              dashboardMode === 'TEAM_KPI'
                ? 'bg-paper-canvas text-emerald-800 shadow-xs border border-emerald-500/40'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('desk.teamKpiTab')}</span>
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

      {/* WORKSPACE & PROJECT FILTER BAR (SMART HYBRID: ADAPTIVE PILLS + SEARCHABLE MORE DROPDOWN) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2.5 border-b border-border-rule text-xs">
        <SmartFilterBar
          label={
            <span className="text-[10px] font-mono uppercase font-bold text-ink-secondary flex items-center gap-1.5 mr-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-indigo" />
              <span>Workspace:</span>
            </span>
          }
          items={isMockCleared ? [
            { id: 'ALL', label: 'All Projects', count: '0 Channels', icon: <Building2 className="w-3 h-3 text-brand-indigo" /> }
          ] : [
            { id: 'ALL', label: 'All Projects', count: '17 Channels', icon: <Building2 className="w-3 h-3 text-brand-indigo" /> },
            { id: 'ws_main', label: 'Main Studio', count: 6, icon: <Sticker name="ws-software" size="xs" inline /> },
            { id: 'ws_creator', label: 'Creator Hub', count: 4, icon: <Sticker name="ws-creator" size="xs" inline /> },
            { id: 'ws_retzpost', label: 'Tech & Product Studio', count: 4, icon: <Sticker name="ws-software" size="xs" inline /> },
            { id: 'ws_coffee', label: 'Lifestyle & Brand', count: 3, icon: <Sticker name="ws-cafe" size="xs" inline /> },
            { id: 'ws_sukhumvit', label: 'Sukhumvit Creative Hub', count: 5, icon: <Sticker name="preset-skytrain" size="xs" inline /> },
            { id: 'ws_asoke', label: 'Asoke Media Center', count: 4, icon: <Sticker name="preset-villa" size="xs" inline /> },
            { id: 'ws_artisan', label: 'Artisan Craft Studio', count: 2, icon: <Sticker name="preset-croissant" size="xs" inline /> },
            { id: 'ws_city', label: 'Bangkok City Studio', count: 6, icon: <Sticker name="ws-software" size="xs" inline /> },
            { id: 'ws_nordic', label: 'Nordic Design Studio', count: 3, icon: <Sticker name="preset-castle" size="xs" inline /> },
          ]}
          selectedId={workspaceFilter}
          onSelect={(id) => handleSelectWorkspaceFilter(id)}
          maxVisiblePills={4}
          moreButtonText={locale === 'en' ? 'More Workspaces' : 'โปรเจกต์อื่นๆ'}
          searchPlaceholder={locale === 'en' ? 'Search workspaces...' : 'ค้นหาชื่อโปรเจกต์ หรือ Workspace...'}
        />

        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-ink-secondary shrink-0">
          <span className="w-2 h-2 rounded-full bg-semantic-success inline-block animate-pulse" />
          <span>Meta Graph & TikTok APIs Live (99.98% SLA)</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: OPERATIONAL & PUBLISHING DISPATCH DESK                            */}
      {/* ========================================================================= */}
      {dashboardMode === 'OPERATIONS' && (
        <div className="space-y-7 animate-in fade-in duration-200">
          {/* OPERATIONAL ALERT BANNER (Enterprise Warning - Hidden in Clean State) */}
          {!isMockCleared && (
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
                    Facebook Token expired on <span className="font-mono text-ink-primary font-medium">Media Partner FB</span> & Instagram Story ratio mismatch on <span className="font-mono text-ink-primary font-medium">brand.showcase</span>.
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
          )}

          {/* TOP ROW: 4 COMPREHENSIVE OPERATIONAL PULSE CARDS */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Metric 1: Channels */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Connected Channels</span>
                <div className={`w-2 h-2 rounded-full ${isMockCleared ? 'bg-ink-muted' : 'bg-semantic-success animate-pulse'}`} />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-ink-primary">
                  {isMockCleared ? 0 : 17}
                </p>
                <span className={`text-[10px] font-mono font-medium ${isMockCleared ? 'text-ink-secondary' : 'text-semantic-success'}`}>
                  {isMockCleared ? '0 Channels' : '4 Workspaces'}
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                {isMockCleared ? (locale === 'en' ? 'No accounts connected in workspace' : 'ยังไม่มีบัญชีเชื่อมต่อใน Workspace') : 'FB (7) • IG (5) • YT (3) • TT (2)'}
              </p>
            </div>

            {/* Metric 2: Monthly Publishing Velocity */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Monthly Placements</span>
                <TrendingUp className="w-3.5 h-3.5 text-brand-indigo" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-ink-primary">
                  {isMockCleared ? 0 : 74}
                </p>
                <span className="text-[10px] font-mono text-semantic-success font-semibold">
                  {isMockCleared ? '100% Ready' : '97.3% Clean'}
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                {isMockCleared ? (locale === 'en' ? 'Ready for new dispatches' : 'พร้อมสำหรับการปล่อยโพสต์ใหม่') : '33 Feeds • 26 Stories • 15 Reels'}
              </p>
            </div>

            {/* Metric 3: Upcoming Schedule */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Dispatch Horizon</span>
                <Clock className="w-3.5 h-3.5 text-semantic-info" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-ink-primary">
                  {timelineItems.length}
                </p>
                <span className="text-[10px] font-mono text-semantic-info font-medium">
                  {timelineItems.length > 0 ? 'Next: 09:15 AM' : 'No Tasks'}
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                {timelineItems.length > 0 ? 'Timezone: Asia/Bangkok' : (locale === 'en' ? 'Dispatch queue empty, ready for scheduling' : 'คิวงานว่าง พร้อมจัดตารางเวลาใหม่')}
              </p>
            </div>

            {/* Metric 4: Attention Required */}
            <div className={`p-4 rounded-card border shadow-2xs ${isMockCleared ? 'bg-paper-raised border-border-rule' : 'bg-paper-raised border-border-rule'}`}>
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Needs Attention</span>
                <AlertTriangle className={`w-3.5 h-3.5 ${isMockCleared ? 'text-ink-muted' : 'text-accent-terracotta'}`} />
              </div>
              <div className="flex items-baseline justify-between">
                <p className={`font-serif font-bold text-2xl ${isMockCleared ? 'text-ink-primary' : 'text-accent-terracotta'}`}>
                  {isMockCleared ? 0 : 2}
                </p>
                {isMockCleared ? (
                  <span className="text-[10px] font-mono text-semantic-success font-semibold">
                    All Systems OK
                  </span>
                ) : (
                  <Link 
                    href="/publishing/queue" 
                    className="text-[10px] font-mono text-accent-terracotta hover:underline font-semibold"
                  >
                    Export & Retry →
                  </Link>
                )}
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono truncate">
                {isMockCleared ? (locale === 'en' ? 'All systems normal, zero operational errors' : 'ระบบปกติ ไม่พบข้อผิดพลาดค้างท่อ') : 'FB Token Expired & IG Story Ratio'}
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
                      { id: 'MAIN_STUDIO', label: 'Main Studio' },
                      { id: 'CREATOR_HUB', label: 'Creator Hub' },
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
                    <EditorialEmptyState
                      stickerName="broadsheet-newspaper"
                      badgeText={isMockCleared ? (locale === 'en' ? 'Publishing Desk • Clean Slate' : 'Publishing Desk • Clean Slate') : (locale === 'en' ? 'Filter Empty' : 'Filter Empty')}
                      title={locale === 'en' ? 'No dispatch history yet (Operations Ledger Empty)' : 'ยังไม่มีประวัติการปล่อยโพสต์ (Operations Ledger Empty)'}
                      description={locale === 'en' ? 'The system is ready for your content. When you publish through the Universal Composer, platform statuses and progress will record here in real-time.' : 'ระบบพร้อมรับงานโพสต์ใหม่ของคุณ เมื่อคุณเผยแพร่โพสต์ผ่าน Universal Composer สถานะและความคืบหน้าของแต่ละแพลตฟอร์มจะบันทึกที่นี่แบบ Real-Time'}
                      tipText={locale === 'en' ? 'You can create multi-placement dispatches with live mobile previews immediately.' : 'คุณสามารถสร้างโพสต์แบบ Multi-Placement พร้อมระบบ Live Phone Preview ได้ทันที'}
                      actionLabel={locale === 'en' ? 'Create First Dispatch (Compose Dispatch)' : 'สร้างโพสต์แรก (Compose Dispatch)'}
                      actionHref="/create"
                      onDemoActionClick={isMockCleared ? () => loadSampleMockData() : undefined}
                    />
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
                            {revokedBatchIds[batch.id] ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-200 text-neutral-800 border border-neutral-300 flex items-center gap-1">
                                <Trash2 className="w-3 h-3 text-red-600" />
                                <span>{locale === 'en' ? 'REVOKED' : 'ถอนโพสต์แล้ว (REVOKED)'}</span>
                              </span>
                            ) : (
                              <StatusTag status={batch.status as any} />
                            )}
                            
                            <button
                              type="button"
                              onClick={() => setSelectedLiveBatch(batch)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-brand-indigo hover:text-white hover:bg-brand-indigo bg-paper-canvas border border-brand-indigo/30 rounded-editorial transition-all shadow-2xs cursor-pointer group"
                            >
                              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              <span>{locale === 'en' ? `View Live (${batch.placements.filter(p => p.liveUrl).length} Placements)` : `ดูโพสต์จริง (${batch.placements.filter(p => p.liveUrl).length} ช่องทาง)`}</span>
                            </button>

                            {!revokedBatchIds[batch.id] && (
                              <button
                                type="button"
                                onClick={() => setRevokeCandidateBatch(batch)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium text-red-700 hover:bg-red-50 bg-paper-canvas border border-red-200 rounded-editorial transition-colors cursor-pointer shadow-2xs"
                                title={locale === 'en' ? 'Revoke or delete dispatch from platforms and system' : 'สั่งลบหรือถอนโพสต์ออกจากระบบและแพลตฟอร์ม'}
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                                <span>{locale === 'en' ? 'Revoke Post' : 'ถอนโพสต์'}</span>
                              </button>
                            )}
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
                              <span>{locale === 'en' ? 'Live Web Destinations:' : 'แถบเปิดดูโพสต์จริงบนเว็บ (Live Web Destinations):'}</span>
                            </span>
                            <span className="text-ink-secondary text-[9px]">
                              {locale === 'en' ? 'Click to open live destination' : 'คลิกเพื่อเปิดหน้าจริงทันที'}
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
                                label={locale === 'en' ? 'Destination (Website)' : 'ลิงก์ปลายทาง (Website)'}
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
                    Showing {filteredBatches.length} of {isMockCleared ? 0 : SAMPLE_BATCHES.length} batches
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
                  {timelineItems.length === 0 ? (
                    <div className="p-8 text-center rounded-editorial bg-paper-canvas border border-dashed border-border-rule space-y-3">
                      <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-paper-raised border border-border-rule shadow-2xs">
                        <Sticker name="calendar-deadline" size="md" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-ink-primary">{locale === 'en' ? 'No scheduled dispatches in next 24h' : 'ไม่มีกำหนดการใน 24 ชม. ข้างหน้า'}</h4>
                        <p className="text-xs text-ink-secondary mt-0.5 font-sans">{locale === 'en' ? 'Queue is clear, ready for scheduling new dispatches.' : 'คิวงานว่าง พร้อมสำหรับจัดตารางปล่อยโพสต์ใหม่'}</p>
                      </div>
                      <Link
                        href="/calendar"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-editorial bg-paper-raised hover:bg-paper-subtle border border-border-rule text-xs font-mono text-brand-indigo font-semibold transition-colors"
                      >
                        <span>{locale === 'en' ? 'Open Calendar' : 'เปิดดูปฏิทินงาน (Calendar)'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    timelineItems.map((item, idx) => (
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
                  ))
                  )}
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
                      <span className="font-semibold text-brand-indigo">{isMockCleared ? '0% (0 jobs)' : '45% (33 jobs)'}</span>
                    </div>
                    <div className="w-full h-2 bg-paper-subtle rounded-full overflow-hidden">
                      <div className="h-full bg-brand-indigo rounded-full" style={{ width: isMockCleared ? '0%' : '45%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-mono text-[11px] mb-1">
                      <span className="text-ink-primary flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent-terracotta" />
                        24h Ephemeral Stories
                      </span>
                      <span className="font-semibold text-accent-terracotta">{isMockCleared ? '0% (0 jobs)' : '35% (26 jobs)'}</span>
                    </div>
                    <div className="w-full h-2 bg-paper-subtle rounded-full overflow-hidden">
                      <div className="h-full bg-accent-terracotta rounded-full" style={{ width: isMockCleared ? '0%' : '35%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-mono text-[11px] mb-1">
                      <span className="text-ink-primary flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-semantic-info" />
                        Reels, Shorts & Video
                      </span>
                      <span className="font-semibold text-semantic-info">{isMockCleared ? '0% (0 jobs)' : '20% (15 jobs)'}</span>
                    </div>
                    <div className="w-full h-2 bg-paper-subtle rounded-full overflow-hidden">
                      <div className="h-full bg-semantic-info rounded-full" style={{ width: isMockCleared ? '0%' : '20%' }} />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-ink-secondary font-mono pt-2 border-t border-border-rule leading-relaxed">
                  {isMockCleared ? (locale === 'en' ? 'No dispatches yet. Format mix metrics will display once publishing begins.' : 'ยังไม่มีการส่งกระจายโพสต์ สถิติการจัดสรรรูปแบบสื่อจะแสดงเมื่อเริ่มส่งงาน') : 'Omni-Format Synergy: 78% of image assets published simultaneously to both Feed and 24h Story.'}
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
                    Manage ({isMockCleared ? 0 : 17}) →
                  </Link>
                </div>

                {isMockCleared ? (
                  <div className="p-4 text-center rounded-editorial bg-paper-canvas border border-dashed border-border-rule space-y-2">
                    <p className="text-xs font-mono text-ink-secondary">{locale === 'en' ? 'No social accounts connected yet' : 'ยังไม่มีบัญชีโซเชียลที่เชื่อมต่อ'}</p>
                    <Link
                      href="/accounts"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-indigo text-white text-[11px] font-mono rounded font-semibold hover:bg-brand-indigo-hover transition-colors"
                    >
                      <span>{locale === 'en' ? '+ Connect First Channel' : '+ เชื่อมต่อช่องทางแรก'}</span>
                    </Link>
                  </div>
                ) : (
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
                )}
              </div>

              {/* Quick Launch & Templates Hub */}
              <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-border-rule">
                  <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold">
                    Quick Launch Studio
                  </span>
                  <span className="text-[9px] font-mono text-brand-indigo">1-Click</span>
                </div>

                <div className="space-y-2">
                  {isMockCleared ? (
                    <>
                      <Link
                        href="/create"
                        className="flex items-center justify-between p-2.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule rounded-editorial text-xs font-medium transition-colors group"
                      >
                        <div className="flex items-center gap-2 text-ink-primary">
                          <Plus className="w-4 h-4 text-brand-indigo group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="font-semibold block text-xs">{locale === 'en' ? 'Compose New Dispatch (Universal Composer)' : 'สร้างโพสต์ใหม่ (Universal Composer)'}</span>
                            <span className="text-[10px] font-mono text-ink-secondary">Feed, 24h Story, Reels 9:16</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-secondary group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      <Link
                        href="/calendar"
                        className="flex items-center justify-between p-2.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule rounded-editorial text-xs font-medium transition-colors group"
                      >
                        <div className="flex items-center gap-2 text-ink-primary">
                          <Calendar className="w-4 h-4 text-brand-indigo group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="font-semibold block text-xs">{locale === 'en' ? 'Open Content Calendar (Editorial Calendar)' : 'เปิดปฏิทินคอนเทนต์ (Editorial Calendar)'}</span>
                            <span className="text-[10px] font-mono text-ink-secondary">{locale === 'en' ? 'Check Bangkok Golden Peak Slots' : 'เช็ค Bangkok Golden Peak Slots'}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-secondary group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      <Link
                        href="/settings/team"
                        className="flex items-center justify-between p-2.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule rounded-editorial text-xs font-medium transition-colors group"
                      >
                        <div className="flex items-center gap-2 text-ink-primary">
                          <Users className="w-4 h-4 text-accent-terracotta group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="font-semibold block text-xs">{locale === 'en' ? 'Manage Team & 5-Tier RBAC' : 'จัดการทีมงาน & สิทธิ์ 5 ระดับ'}</span>
                            <span className="text-[10px] font-mono text-ink-secondary">Owner, Manager, Editor, Contributor</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-secondary group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/create"
                        className="flex items-center justify-between p-2.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule rounded-editorial text-xs font-medium transition-colors group"
                      >
                        <div className="flex items-center gap-2 text-ink-primary">
                          <Bookmark className="w-4 h-4 text-brand-indigo group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="font-semibold block text-xs">{locale === 'en' ? 'Prime Living & Spaces' : 'พรีเมียมสเปซ & ทำเลทอง (Prime Living)'}</span>
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
                            <span className="font-semibold block text-xs">{locale === 'en' ? 'AI Media Assets (8K Renders)' : 'คลังภาพสื่อ AI (8K Renders)'}</span>
                            <span className="text-[10px] font-mono text-ink-secondary">Studio Lighting, 4K Footage, Covers</span>
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
                            <span className="font-semibold block text-xs">Flash Sale 50% Campaign</span>
                            <span className="text-[10px] font-mono text-ink-secondary">Promo copy + CTA stickers</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-secondary group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Export & Audit Desk */}
              <div className="p-4 bg-paper-canvas border border-border-rule rounded-card space-y-2.5">
                <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold block">
                  Export & Audit Reports
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
                  TOTAL VIEWS & REACH
                </span>
                <TrendingUp className="w-3.5 h-3.5 text-semantic-success" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-ink-primary">
                  {isMockCleared ? '0' : <AnimatedCounter value={totalViews} />}
                </p>
                <span className="text-[10px] font-mono text-semantic-success font-semibold">
                  {isMockCleared ? '0.0%' : '+18.4% MoM'}
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                {isMockCleared ? (locale === 'en' ? 'No impression data yet' : 'ยังไม่มีข้อมูลการเข้าชม') : 'Across FB, IG, YouTube & TikTok'}
              </p>
            </div>

            {/* KPI 2: Total Engagements (Likes, Comments, Shares) */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  ENGAGEMENTS
                </span>
                <ThumbsUp className="w-3.5 h-3.5 text-brand-indigo" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-ink-primary">
                  {isMockCleared ? '0' : <AnimatedCounter value={totalLikes + totalComments + totalShares} />}
                </p>
                <span className="text-[10px] font-mono text-brand-indigo font-semibold">
                  {isMockCleared ? '0.0% Avg' : '9.8% Avg Rate'}
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                {isMockCleared ? '0 Likes • 0 Comms • 0 Shares' : `${totalLikes.toLocaleString()} Likes • ${totalComments} Comms • ${totalShares} Shares`}
              </p>
            </div>

            {/* KPI 3: Story Link Sticker Clicks (High Intent Traffic) */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  STORY LINK CLICKS
                </span>
                <MousePointerClick className="w-3.5 h-3.5 text-accent-terracotta" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-accent-terracotta">
                  {isMockCleared ? '0' : <AnimatedCounter value={totalLinkClicks} />}
                </p>
                <span className="text-[10px] font-mono text-accent-terracotta font-semibold">
                  {isMockCleared ? '0.0% CTR' : '5.4% Avg CTR'}
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                {isMockCleared ? (locale === 'en' ? 'No Story link traffic yet' : 'ยังไม่มีทราฟฟิกจากลิงก์สตอรี่') : 'Direct Web & Landing Page Leads'}
              </p>
            </div>

            {/* KPI 4: Top Performing Property / Campaign */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  TOP CONVERTING POST
                </span>
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-lg text-ink-primary truncate max-w-[160px]">
                  {isMockCleared ? '-' : 'Studio Showcase'}
                </p>
                <span className={`text-[10px] font-mono font-semibold ${isMockCleared ? 'text-ink-secondary' : 'text-semantic-success'}`}>
                  {isMockCleared ? 'No Data' : '890 Clicks'}
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono truncate">
                {isMockCleared ? (locale === 'en' ? 'No ranked content yet' : 'ยังไม่มีชิ้นงานที่ติดอันดับ') : 'Main Studio Brand Album + Story'}
              </p>
            </div>
          </section>

          {/* TRACKING CONTROLS & LEADERBOARD HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-paper-raised border border-border-rule rounded-card">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h2 className="font-serif font-bold text-base text-ink-primary">
                  {locale === 'en' ? 'Top Performing Posts Leaderboard' : 'จัดอันดับ "Top Performing Posts" โพสต์และคอนเทนต์ที่ผลตอบรับดีที่สุด'}
                </h2>
                {/* Live Telemetry Pulse Status Indicator */}
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-semantic-success/10 text-semantic-success border border-semantic-success/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse" />
                  {telemetryLastSynced || 'Telemetry Live Stream'}
                </span>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5 font-sans">
                {locale === 'en' ? 'Audience response analytics across Views, Engagements, and Story Link Clicks (Web Traffic)' : 'วิเคราะห์ผลตอบรับจริงจากคนดู (Views), ยอดการมีส่วนร่วม (Engagements) และคนคลิกลิงก์ Story (Web Traffic)'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {/* SMART SYNC NOW BUTTON (Quota protected & animated) */}
              <button
                type="button"
                onClick={handleManualTelemetrySync}
                disabled={isSyncingTelemetry || telemetryCooldownRemaining > 0}
                title={
                  telemetryCooldownRemaining > 0
                    ? (locale === 'en' ? `Rate Limit Protection: Please wait ${telemetryCooldownRemaining}s` : `ระบบป้องกัน Rate Limit / Social API Quota: กรุณารอ ${telemetryCooldownRemaining} วินาที`)
                    : (locale === 'en' ? 'Sync live views, likes and metrics from FB, IG, YouTube, TikTok now' : 'ซิงค์ยอดวิว ยอดไลก์ และสถิติล่าสุดจาก Facebook, Instagram, YouTube, TikTok ทันที')
                }
                className={`px-3 py-1.5 rounded-editorial flex items-center gap-1.5 transition-all shadow-2xs font-semibold text-xs border ${
                  telemetryCooldownRemaining > 0
                    ? 'bg-paper-canvas text-ink-muted border-border-rule cursor-not-allowed opacity-80'
                    : isSyncingTelemetry
                    ? 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/30 cursor-wait'
                    : 'bg-brand-indigo text-white hover:bg-brand-indigo/90 border-brand-indigo'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingTelemetry ? 'animate-spin' : ''}`} />
                <span>
                  {isSyncingTelemetry
                    ? (locale === 'en' ? 'Syncing...' : 'กำลังดึงสถิติ...')
                    : telemetryCooldownRemaining > 0
                    ? (locale === 'en' ? `Cooldown (${telemetryCooldownRemaining}s)` : `รอซิงค์ (${telemetryCooldownRemaining}s)`)
                    : (locale === 'en' ? 'Sync Live Telemetry' : 'อัปเดตสถิติตอนนี้ (Sync Now)')}
                </span>
              </button>

              <div className="flex items-center gap-1 bg-paper-canvas border border-border-rule rounded-editorial p-1">
                <span className="text-[10px] text-ink-muted pl-1">Sort:</span>
                {[
                  { id: 'OVERALL', label: locale === 'en' ? 'Overall' : 'อันดับรวม' },
                  { id: 'VIEWS', label: locale === 'en' ? 'Top Views' : 'คนดูสูงสุด' },
                  { id: 'ENGAGEMENT', label: locale === 'en' ? 'Top Engagement' : 'มีส่วนร่วมสูงสุด' },
                  { id: 'CLICKS', label: locale === 'en' ? 'Top Clicks' : 'คนคลิกลิงก์สูงสุด' },
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

          {/* TELEMETRY FEEDBACK BANNER */}
          {telemetryNotice && (
            <div className="p-3 bg-brand-indigo/10 border border-brand-indigo/20 rounded-editorial text-xs text-brand-indigo flex items-center justify-between animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-indigo shrink-0" />
                <span className="font-sans font-medium">{telemetryNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setTelemetryNotice(null)}
                className="text-ink-secondary hover:text-ink-primary p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TOP PERFORMING POSTS LEADERBOARD LIST */}
          <div className="space-y-4">
            {filteredPerformancePosts.length === 0 ? (
              <EditorialEmptyState
                stickerName="award-star-badge"
                badgeText={isMockCleared ? 'Telemetry Pulse • Zero Data' : 'Leaderboard Empty'}
                title={locale === 'en' ? 'No telemetry data yet (Content Telemetry Empty)' : 'ยังไม่มีข้อมูลสถิติและการมีส่วนร่วม (Content Telemetry Empty)'}
                description={locale === 'en' ? 'When you start publishing dispatches, telemetry webhooks from Meta Graph, YouTube Data API, and TikTok Content API will automatically aggregate Views, Engagements, and Clicks.' : 'เมื่อคุณเริ่มปล่อยโพสต์ ระบบจะเชื่อมโยง Telemetry Webhook จาก Meta Graph, YouTube Data API และ TikTok Content API เพื่อดึง Views, Engagements และ Clicks อัตโนมัติ'}
                tipText={locale === 'en' ? 'Connect social channels at /accounts to enable real-time telemetry.' : 'เชื่อมต่อบัญชีโซเชียลที่หน้า /accounts เพื่อเปิดรับการวัดผลแบบ Real-Time'}
                actionLabel={locale === 'en' ? 'Go to Accounts' : 'ไปที่หน้าเชื่อมต่อบัญชี (Accounts)'}
                actionHref="/accounts"
                onDemoActionClick={isMockCleared ? () => loadSampleMockData() : undefined}
              />
            ) : (
              filteredPerformancePosts.map((post) => (
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
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5">
                          <Sticker name={post.rank === 1 ? 'trophy-gold' : post.rank === 2 ? 'trophy-silver' : post.rank === 3 ? 'trophy-bronze' : 'award-ribbon'} size="xs" inline />
                          <span>{post.rankBadge.replace(/^[^\w]+/, '')}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-paper-subtle text-brand-indigo border border-border-rule font-semibold inline-flex items-center gap-1">
                          <Sticker name={post.workspaceId === 'ws_main' || post.workspaceId === 'ws_capitalone' ? 'ws-brand' : post.workspaceId === 'ws_creator' || post.workspaceId === 'ws_acme' ? 'ws-creator' : post.workspaceId === 'ws_retzpost' || post.workspaceId === 'ws_software' ? 'ws-software' : 'ws-brand'} size="xs" inline />
                          <span>{post.workspaceName}</span>
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

                  {/* High-level Engagement Badge + AI Diagnosis Trigger */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPostDiagnosis(getPostDiagnosis(post.id, post.title));
                        fetch('/api/billing/tokens', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            actionKey: 'AI_POST_DIAGNOSIS',
                            actorName: currentUser?.name || 'Staff Member',
                            description: locale === 'en' ? `AI Content Diagnosis: ${post.title.slice(0, 30)}` : `AI วิเคราะห์โพสต์ปัง: ${post.title.slice(0, 30)}`,
                          }),
                        }).catch(() => null);
                        recordTeamTokenConsumption(currentUser?.email || 'admin@retzpost.com', 'AI_POST_DIAGNOSIS', locale === 'en' ? 'AI Content Diagnosis' : 'AI วิเคราะห์โพสต์ปัง', 5);
                      }}
                      className="px-2.5 py-1 rounded bg-brand-indigo/10 hover:bg-brand-indigo hover:text-white border border-brand-indigo/30 text-brand-indigo font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                      title={locale === 'en' ? 'Analyze success drivers with AI: Why it performed (-5 Master Tokens)' : 'วิเคราะห์ปัจจัยความสำเร็จด้วย AI: ทำไมถึงได้ยอด (-5 Master Tokens)'}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-accent-terracotta" />
                      <span>{locale === 'en' ? 'AI Attribution Diagnosis' : 'ทำไมถึงปัง? (AI Diagnosis)'}</span>
                    </button>
                    <span className="px-2.5 py-1 rounded bg-semantic-success/10 border border-semantic-success/20 text-semantic-success font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-semantic-success text-semantic-success" />
                      <span>{post.engagementRate} Engagement Rate</span>
                    </span>
                  </div>
                </div>

                {/* 5-Column Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs pt-1">
                  <div className="p-2.5 bg-paper-canvas border border-border-rule rounded-editorial text-center">
                    <span className="text-[10px] text-ink-secondary flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3 text-ink-secondary" />
                      <span>{locale === 'en' ? 'Views' : 'คนดูทั้งหมด (Views)'}</span>
                    </span>
                    <span className="font-bold text-ink-primary text-sm block mt-0.5">
                      <AnimatedCounter value={post.views} />
                    </span>
                  </div>

                  <div className="p-2.5 bg-paper-canvas border border-border-rule rounded-editorial text-center">
                    <span className="text-[10px] text-ink-secondary flex items-center justify-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>{locale === 'en' ? 'Likes' : 'คนกดไลค์ (Likes)'}</span>
                    </span>
                    <span className="font-bold text-ink-primary text-sm block mt-0.5">
                      <AnimatedCounter value={post.likes} />
                    </span>
                  </div>

                  <div className="p-2.5 bg-paper-canvas border border-border-rule rounded-editorial text-center">
                    <span className="text-[10px] text-ink-secondary flex items-center justify-center gap-1">
                      <MessageSquare className="w-3 h-3 text-brand-indigo" />
                      <span>{locale === 'en' ? 'Comments' : 'คอมเมนต์ (Comments)'}</span>
                    </span>
                    <span className="font-bold text-ink-primary text-sm block mt-0.5">
                      <AnimatedCounter value={post.comments} />
                    </span>
                  </div>

                  <div className="p-2.5 bg-paper-canvas border border-border-rule rounded-editorial text-center">
                    <span className="text-[10px] text-ink-secondary flex items-center justify-center gap-1">
                      <Share2 className="w-3 h-3 text-semantic-info" />
                      <span>{locale === 'en' ? 'Shares' : 'แชร์ (Shares)'}</span>
                    </span>
                    <span className="font-bold text-ink-primary text-sm block mt-0.5">
                      <AnimatedCounter value={post.shares} />
                    </span>
                  </div>

                  <div className="p-2.5 bg-accent-terracotta/10 border border-accent-terracotta/30 rounded-editorial text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-accent-terracotta font-bold flex items-center justify-center gap-1">
                      <MousePointerClick className="w-3 h-3 text-accent-terracotta" />
                      <span>{locale === 'en' ? 'Story Link Clicks' : 'คลิกลิงก์ Story (Clicks)'}</span>
                    </span>
                    <span className="font-bold text-accent-terracotta text-sm block mt-0.5">
                      <AnimatedCounter value={post.linkClicks} /> Clicks ({post.ctr})
                    </span>
                  </div>
                </div>

                {/* DEDICATED DIRECT LIVE LINKS TRAY (กางออกมาให้เห็นครบ 100% ทันที) */}
                <div className="p-2.5 bg-paper-subtle/80 border border-border-rule rounded-editorial space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-ink-primary flex items-center gap-1.5 uppercase tracking-wider">
                      <Globe className="w-3 h-3 text-brand-indigo" />
                      <span>{locale === 'en' ? 'Live Social & Web Links:' : 'แถบเปิดดูโพสต์จริงบนเว็บ (Live Social & Web Links):'}</span>
                    </span>
                    <span className="text-ink-secondary text-[9px]">
                      {locale === 'en' ? 'Click to open live post' : 'คลิกเพื่อเปิดหน้าจริงทันที'}
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
                        label={locale === 'en' ? (post.websiteLabelEn || 'Target Destination (Website)') : (post.websiteLabel || 'ลิงก์ปลายทาง (Website)')}
                        url={post.websiteUrl}
                        onCopy={handleCopyLink}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          {/* FORMAT SYNERGY & CONVERSION DEEP-DIVE INSIGHT */}
          <div className="p-5 bg-gradient-to-r from-brand-indigo/5 via-accent-terracotta/5 to-transparent border border-border-rule rounded-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-indigo" />
                <h4 className="font-serif font-bold text-sm text-ink-primary">
                  {locale === 'en' ? 'Engagement & Conversion Insight: Synergy of 24h Story + Link Sticker' : 'กลยุทธ์สร้างยอดการมีส่วนร่วม (Engagement & Conversion Insight): พลังของ 24h Story + Link Sticker'}
                </h4>
              </div>
              <p className="text-xs text-ink-secondary max-w-2xl font-sans leading-relaxed">
                {locale === 'en' ? (
                <>Feed Album dispatches drive the highest brand awareness and viral sharing (Reach Leader), while <strong className="text-accent-terracotta">24h Stories with Interactive Link Stickers</strong> deliver <strong className="text-ink-primary">3.2x higher direct web clicks</strong> (890 vs 280 clicks). Always pair Feed and Story formats across marketing campaigns.</>
              ) : (
                <>โพสต์แบบ <strong className="text-ink-primary">Feed Album</strong> สร้างการรับรู้และการแชร์สูงสุด (Reach Leader) ในขณะที่ <strong className="text-accent-terracotta">24h Story พร้อม Interactive Link Sticker</strong> สร้างยอดคนคลิกเข้าหน้าเว็บเป้าหมายสูงกว่าถึง <strong className="text-ink-primary">3.2 เท่า</strong> (890 vs 280 clicks) ทำให้ควรจับคู่โพสต์ Feed และ Story ควบคู่กันเสมอในทุกแคมเปญ</>
              )}
              </p>
            </div>

            <Link
              href="/create"
              className="px-4 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold rounded-editorial shrink-0 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Create Dual-Format Campaign' : 'สร้างแคมเปญแบบคู่นี้ทันที'}</span>
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: STAFF & CREATOR KPI TELEMETRY                                    */}
      {/* ========================================================================= */}
      {dashboardMode === 'TEAM_KPI' && (
        <div className="space-y-7 animate-in fade-in duration-200">
          {/* HEADER ALERT & MOCK REGISTRY NOTICE */}
          <div className="p-4 bg-paper-raised border border-border-rule rounded-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-ink-primary">
                    {locale === 'en' ? 'Staff & Creator KPI Telemetry System' : 'ระบบวัดผล KPI ประสิทธิภาพทีมงานและครีเอเตอร์ (Staff & Creator KPI Telemetry)'}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold flex items-center gap-1">
                    <span>MOCK DATA / SIMULATION</span>
                  </span>
                </div>
                <p className="text-xs font-mono text-ink-secondary">
                  {locale === 'en' ? 'Track dispatch production volume (Target vs Actual), on-time adherence, first-pass approval rates, aggregate reach, and individual scorecards.' : 'ติดตามยอดการผลิตโพสต์ (Target vs Actual), ความตรงต่อเวลา, อัตราผ่านงานรอบแรก, ยอด Reach ที่ทำได้ และคะแนนประเมินรายบุคคล'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center font-mono text-xs">
              <div className="flex items-center gap-1 bg-paper-subtle border border-border-rule rounded-editorial p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setKpiTimeframe('THIS_MONTH')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    kpiTimeframe === 'THIS_MONTH'
                      ? 'bg-paper-canvas text-brand-indigo font-bold shadow-2xs'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {locale === 'en' ? 'This Month (Oct 2026)' : 'เดือนนี้ (ต.ค. 2026)'}
                </button>
                <button
                  type="button"
                  onClick={() => setKpiTimeframe('LAST_MONTH')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    kpiTimeframe === 'LAST_MONTH'
                      ? 'bg-paper-canvas text-brand-indigo font-bold shadow-2xs'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {locale === 'en' ? 'Sep 2026' : 'ก.ย. 2026'}
                </button>
                <button
                  type="button"
                  onClick={() => setKpiTimeframe('Q3_2026')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    kpiTimeframe === 'Q3_2026'
                      ? 'bg-paper-canvas text-brand-indigo font-bold shadow-2xs'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {locale === 'en' ? 'Q3 2026' : 'ไตรมาส 3'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDownloadToast(locale === 'en' ? '✓ Exported staff KPI scorecard to CSV.' : '✓ ส่งออกตารางประเมินผล KPI บุคลากรเป็นไฟล์ CSV เรียบร้อยแล้ว');
                  setTimeout(() => setDownloadToast(null), 3000);
                }}
                className="px-3 py-1.5 rounded-editorial bg-paper-canvas border border-border-rule hover:border-brand-indigo text-ink-primary font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-brand-indigo" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleResetKpis}
                title={locale === 'en' ? 'Reset evaluation to default mock values' : 'คืนค่าการประเมินเป็นค่าเริ่มต้นจำลอง'}
                className="px-2.5 py-1.5 rounded-editorial bg-paper-canvas border border-border-rule hover:border-brand-indigo text-ink-secondary hover:text-ink-primary font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{locale === 'en' ? 'Reset Defaults' : 'รีเซ็ตค่าเริ่มต้น'}</span>
              </button>
            </div>
          </div>

          {/* KPI EVALUATION NOTICE BANNER */}
          {kpiEvaluationNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-editorial text-xs font-mono flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{kpiEvaluationNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setKpiEvaluationNotice(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs px-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TOP 4 DEPARTMENT KPI PULSE METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Metric 1: Department Output */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  {locale === 'en' ? 'TOTAL DISPATCH OUTPUT' : 'ยอดผลิตโพสต์รวม (OUTPUT)'}
                </span>
                <Target className="w-3.5 h-3.5 text-brand-indigo" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-ink-primary">
                  {departmentSummary.totalActualPosts} / {departmentSummary.totalTargetPosts}
                </p>
                <span className="text-[10px] font-mono text-semantic-success font-semibold">
                  {departmentSummary.overallCompletionRate}% Target
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                {locale === 'en' ? `+${departmentSummary.totalActualPosts - departmentSummary.totalTargetPosts} posts over monthly target` : `+${departmentSummary.totalActualPosts - departmentSummary.totalTargetPosts} งาน เกินเป้าหมายประจำเดือน`}
              </p>
            </div>

            {/* Metric 2: On-Time Dispatch Adherence */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  {locale === 'en' ? 'ON-TIME PUBLISHING RATE' : 'ความตรงต่อเวลา (ON-TIME RATE)'}
                </span>
                <Clock className="w-3.5 h-3.5 text-semantic-success" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-ink-primary">
                  {departmentSummary.avgOnTime}%
                </p>
                <span className="text-[10px] font-mono text-semantic-success font-semibold">
                  Excellent
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                {locale === 'en' ? 'Dispatched within golden peak hours' : 'ปล่อยโพสต์ตรงตามเวลาทอง (Peak Hours)'}
              </p>
            </div>

            {/* Metric 3: Total Reach Delivered */}
            <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  {locale === 'en' ? 'AGGREGATE TEAM REACH' : 'ยอด REACH ที่ทีมสร้างได้'}
                </span>
                <TrendingUp className="w-3.5 h-3.5 text-accent-terracotta" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-2xl text-ink-primary">
                  {(departmentSummary.totalImpressions / 1000).toFixed(0)}K
                </p>
                <span className="text-[10px] font-mono text-accent-terracotta font-semibold">
                  {(departmentSummary.totalEngagements / 1000).toFixed(1)}K Engaged
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono">
                {locale === 'en' ? 'Generated across 4 core channels' : 'สร้างผลลัพธ์ผ่าน 4 ช่องทางหลัก'}
              </p>
            </div>

            {/* Metric 4: Top Performer */}
            <div className="bg-paper-raised p-4 rounded-card border border-emerald-300 shadow-2xs bg-gradient-to-br from-paper-raised to-emerald-50/40">
              <div className="flex items-center justify-between text-ink-secondary mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-800">
                  {locale === 'en' ? 'TOP PERFORMING CREATOR' : 'ครีเอเตอร์ยอดเยี่ยม'}
                </span>
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-serif font-bold text-lg text-ink-primary truncate max-w-[150px]">
                  {departmentSummary.topPerformer ? departmentSummary.topPerformer.name.split(' ')[0] : '-'}
                </p>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                  {departmentSummary.topPerformer ? `Score ${departmentSummary.topPerformer.overallKpiScore} (${departmentSummary.topPerformer.grade})` : 'Zero State'}
                </span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1 font-mono truncate">
                {departmentSummary.topPerformer ? (locale === 'en' ? (departmentSummary.topPerformer.roleEn || departmentSummary.topPerformer.roleTh) : departmentSummary.topPerformer.roleTh) : (locale === 'en' ? 'No performance data yet' : 'ยังไม่มีข้อมูลผลงาน')}
              </p>
            </div>
          </div>

          {/* STAFF KPI LEADERBOARD TABLE */}
          <div className="bg-paper-raised border border-border-rule rounded-card overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border-rule flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-ink-primary">
                  {locale === 'en' ? 'Individual KPI Scorecard & Attribution' : 'ตารางประเมินผล KPI รายบุคคล (Employee Scorecard & Post Attribution)'}
                </h4>
                <p className="text-[11px] font-mono text-ink-secondary">
                  {locale === 'en' ? `Showing ${employeeKpis.length} team members in selected workspace • Click a row to view dispatches and coaching notes` : `แสดง ${employeeKpis.length} บุคลากรใน Workspace ที่เลือก • คลิกที่แถวเพื่อดูงานโพสต์จริงและข้อเสนอแนะโค้ชชิ่ง`}
                </p>
              </div>
              <span className="text-[10px] font-mono text-ink-muted hidden sm:inline-block">
                Evaluation Cycle: Monthly (Q4-2026)
              </span>
            </div>

            {employeeKpis.length === 0 ? (
              <div className="p-8">
                <EditorialEmptyState
                  stickerName="bullseye"
                  badgeText={isMockCleared ? 'Team Scorecard • Clean State' : 'No Staff Found'}
                  title={locale === 'en' ? 'No employee KPI records yet' : 'ยังไม่มีบันทึกการประเมิน KPI บุคลากร'}
                  description={locale === 'en' ? 'The system calculates 4-dimensional KPIs (Output, Quality, Timeliness, Efficiency) and AI synthesizes individual coaching recommendations when teams create and approve dispatches.' : 'ระบบคำนวณ KPI 4 มิติ (Output, Quality, Timeliness, Efficiency) พร้อม AI สังเคราะห์ข้อเสนอแนะโค้ชชิ่งรายบุคคลเมื่อทีมเริ่มสร้างและอนุมัติงาน'}
                  tipText={locale === 'en' ? 'Start assigning and approving dispatches in queue, or load demo data to preview grade calculation and scorecard slips.' : 'เริ่มต้นมอบหมายงานและอนุมัติโพสต์ในคิวงาน หรือคลิกโหลดข้อมูลตัวอย่างเพื่อพรีวิวการคำนวณเกรดและ Scorecard Slip'}
                  actionLabel={locale === 'en' ? 'Go to Queue' : 'ไปที่คิวตรวจรับงาน (Queue)'}
                  actionHref="/publishing/queue"
                  onDemoActionClick={isMockCleared ? () => loadSampleMockData() : undefined}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-paper-subtle text-[11px] text-ink-secondary uppercase border-b border-border-rule">
                  <tr>
                    <th className="py-3 px-4 font-semibold">{locale === 'en' ? 'Rank & Employee' : 'อันดับ & พนักงาน'}</th>
                    <th className="py-3 px-4 font-semibold">{locale === 'en' ? 'Target vs Actual' : 'เป้าหมาย vs งานจริง'}</th>
                    <th className="py-3 px-4 font-semibold">{locale === 'en' ? 'On-Time Rate' : 'ความตรงต่อเวลา'}</th>
                    <th className="py-3 px-4 font-semibold">{locale === 'en' ? 'Reach Generated' : 'ยอด Reach ที่สร้างได้'}</th>
                    <th className="py-3 px-4 font-semibold">{locale === 'en' ? 'First-Pass' : 'ผ่านรอบแรก'}</th>
                    <th className="py-3 px-4 font-semibold">{locale === 'en' ? 'Grade & Score' : 'เกรด & คะแนนรวม'}</th>
                    <th className="py-3 px-4 font-semibold text-right">{locale === 'en' ? 'Evaluation' : 'การประเมิน'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-rule">
                  {employeeKpis.map((emp) => {
                    const isExceeding = emp.postsCompletionRate >= 100;
                    const gradeColor =
                      emp.grade === 'A+'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : emp.grade === 'A'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : emp.grade === 'B+'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-red-100 text-red-900 border-red-300';

                    return (
                      <tr 
                        key={emp.memberId}
                        onClick={() => handleOpenEmployeeScorecard(emp)}
                        className="hover:bg-paper-canvas/80 transition-colors cursor-pointer group"
                      >
                        {/* Member & Rank */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-paper-subtle text-ink-secondary text-[10px] font-bold flex items-center justify-center shrink-0 border border-border-rule">
                              #{emp.rank}
                            </span>
                            <div className={`w-8 h-8 rounded-full ${emp.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                              {emp.avatarText}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-serif font-bold text-sm text-ink-primary group-hover:text-brand-indigo transition-colors truncate">
                                  {emp.name}
                                </p>
                                {emp.focusTags?.[0] && (
                                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono bg-paper-canvas border border-border-rule text-ink-secondary">
                                    {emp.focusTags[0]}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-ink-secondary">
                                <span className="truncate">{locale === 'en' ? (emp.roleEn || emp.roleTh) : emp.roleTh}</span>
                                <span>•</span>
                                <span className="truncate">{emp.workspaceName}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Target vs Actual */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span>{emp.actualPosts} / {emp.targetPosts} {locale === 'en' ? 'posts' : 'โพสต์'}</span>
                              <span className={isExceeding ? 'text-semantic-success' : 'text-semantic-error'}>
                                {emp.postsCompletionRate}%
                              </span>
                            </div>
                            <div className="w-28 h-1.5 rounded-full bg-paper-subtle overflow-hidden border border-border-rule">
                              <div
                                className={`h-full rounded-full ${
                                  emp.postsCompletionRate >= 100
                                    ? 'bg-semantic-success'
                                    : emp.postsCompletionRate >= 80
                                    ? 'bg-amber-500'
                                    : 'bg-semantic-error'
                                }`}
                                style={{ width: `${Math.min(emp.postsCompletionRate, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* On-Time Rate */}
                        <td className="py-3.5 px-4 font-bold text-ink-primary">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-brand-indigo" />
                            <span>{emp.onTimePublishingRate}%</span>
                          </span>
                        </td>

                        {/* Total Reach & Engagements */}
                        <td className="py-3.5 px-4">
                          <span className="block font-bold text-ink-primary">
                            {(emp.totalImpressions / 1000).toFixed(1)}K Views
                          </span>
                          <span className="text-[10px] text-ink-secondary">
                            {(emp.totalEngagements / 1000).toFixed(1)}K Engaged ({emp.avgEngagementRate})
                          </span>
                        </td>

                        {/* First-pass approval */}
                        <td className="py-3.5 px-4 font-semibold text-ink-primary">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-semantic-success" />
                            <span>{emp.firstPassApprovalRate}%</span>
                          </span>
                        </td>

                        {/* Grade & Score */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${gradeColor}`}>
                              {locale === 'en' ? 'Grade' : 'เกรด'} {emp.grade}
                            </span>
                            <span className="font-serif font-bold text-sm text-ink-primary">
                              {emp.overallKpiScore}/100
                            </span>
                          </div>
                        </td>

                        {/* Action Drilldown */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEmployeeScorecard(emp);
                            }}
                            className="px-2.5 py-1.5 rounded-editorial bg-paper-canvas border border-border-rule hover:border-brand-indigo text-ink-primary text-xs font-semibold hover:text-brand-indigo transition-colors shadow-2xs cursor-pointer"
                          >
                            <span>{locale === 'en' ? 'View Scorecard' : 'ดู Scorecard'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      )}
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
                    {locale === 'en' ? 'Live Social Destinations' : 'เปิดดูโพสต์จริงบนเว็บ (Live Social Links)'}
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
                {locale === 'en' ? 'Published Social Destinations:' : 'ช่องทางโซเชียลที่เผยแพร่แล้ว (Published Destinations):'}
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
                      title={locale === 'en' ? 'Copy Link' : 'คัดลอกลิงก์'}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={plc.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>{locale === 'en' ? 'View Live' : 'เปิดดูโพสต์'}</span>
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
                        {locale === 'en' ? 'Target Destination / Landing Page:' : 'เว็บไซต์เป้าหมาย / Landing Page:'}
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
                      title={locale === 'en' ? 'Copy Link' : 'คัดลอกลิงก์'}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={selectedLiveBatch.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle text-brand-indigo border border-brand-indigo/30 rounded text-xs font-mono font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>{locale === 'en' ? 'View Page' : 'เปิดดูเว็บ'}</span>
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
                {locale === 'en' ? 'Close' : 'ปิด'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EMPLOYEE KPI SCORECARD & WORK DRILL-DOWN                           */}
      {/* ========================================================================= */}
      {selectedEmployeeKpi && (
        <div 
          onClick={() => setSelectedEmployeeKpi(null)}
          className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border border-border-rule rounded-card max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col cursor-default"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-border-rule bg-paper-canvas flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-full ${selectedEmployeeKpi.avatarBg} text-white font-bold text-base flex items-center justify-center shrink-0 shadow-md`}>
                  {selectedEmployeeKpi.avatarText}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-ink-primary">
                      {selectedEmployeeKpi.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {locale === 'en' ? 'Grade' : 'เกรด'} {selectedEmployeeKpi.grade} ({selectedEmployeeKpi.overallKpiScore}/100)
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-paper-subtle border border-border-rule text-ink-secondary">
                      MOCK KPI SCORECARD
                    </span>
                  </div>
                  <p className="text-xs font-mono text-ink-secondary mt-0.5">
                    {locale === 'en' ? (selectedEmployeeKpi.roleEn || selectedEmployeeKpi.roleTh) : selectedEmployeeKpi.roleTh} • {selectedEmployeeKpi.workspaceName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEmployeeKpi(null)}
                className="p-1.5 rounded-editorial border border-border-rule hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
                title={locale === 'en' ? 'Close window (ESC)' : 'ปิดหน้าต่าง (ESC)'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 font-mono text-xs">
              {/* 4 Score Dimensions Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
                  <span className="text-[10px] text-ink-secondary block uppercase">{locale === 'en' ? 'Target Output' : 'เป้าหมายงาน'}</span>
                  <p className="font-serif font-bold text-lg text-ink-primary">
                    {selectedEmployeeKpi.actualPosts} / {selectedEmployeeKpi.targetPosts}
                  </p>
                  <span className="text-[10px] text-semantic-success block font-bold">
                    {locale === 'en' ? `Achieved ${selectedEmployeeKpi.postsCompletionRate}%` : `สำเร็จ ${selectedEmployeeKpi.postsCompletionRate}%`}
                  </span>
                </div>

                <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
                  <span className="text-[10px] text-ink-secondary block uppercase">{locale === 'en' ? 'On-Time' : 'ตรงต่อเวลา'}</span>
                  <p className="font-serif font-bold text-lg text-ink-primary">
                    {selectedEmployeeKpi.onTimePublishingRate}%
                  </p>
                  <span className="text-[10px] text-semantic-success block font-bold">
                    On-Time Adherence
                  </span>
                </div>

                <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
                  <span className="text-[10px] text-ink-secondary block uppercase">{locale === 'en' ? 'First-Pass' : 'ผ่านงานรอบแรก'}</span>
                  <p className="font-serif font-bold text-lg text-ink-primary">
                    {selectedEmployeeKpi.firstPassApprovalRate}%
                  </p>
                  <span className="text-[10px] text-brand-indigo block font-bold">
                    First-Pass Quality
                  </span>
                </div>

                <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
                  <span className="text-[10px] text-ink-secondary block uppercase">{locale === 'en' ? 'Total Views' : 'ยอดคนดูรวม'}</span>
                  <p className="font-serif font-bold text-lg text-ink-primary">
                    {(selectedEmployeeKpi.totalImpressions / 1000).toFixed(0)}K
                  </p>
                  <span className="text-[10px] text-accent-terracotta block font-bold">
                    {selectedEmployeeKpi.avgEngagementRate} Avg ER
                  </span>
                </div>
              </div>

              {/* Strengths & Coaching Notes (Hybrid AI + Manager Evaluation) */}
              <div className="p-4 bg-paper-canvas border border-border-rule rounded-editorial space-y-3 font-sans">
                {/* Header Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border-rule">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-accent-terracotta" />
                      <span>{locale === 'en' ? 'Performance Evaluation & Coaching' : 'การประเมินผลงาน & โค้ชชิ่ง'}</span>
                    </span>
                    {selectedEmployeeKpi.evaluatedBy && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 font-medium">
                        {selectedEmployeeKpi.evaluatedBy}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAiGenerateCoaching}
                      disabled={isAiGeneratingCoaching}
                      className="px-2.5 py-1 rounded-editorial bg-gradient-to-r from-accent-terracotta/15 to-brand-indigo/15 hover:from-accent-terracotta/25 hover:to-brand-indigo/25 text-ink-primary border border-brand-indigo/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                      title={locale === 'en' ? 'Analyze on-time, approval rate, and volume to synthesize new evaluation' : 'วิเคราะห์ On-Time, Approval Rate, และ Volume เพื่อสังเคราะห์ข้อความใหม่'}
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-brand-indigo ${isAiGeneratingCoaching ? 'animate-spin' : ''}`} />
                      <span>{isAiGeneratingCoaching ? (locale === 'en' ? 'AI Synthesizing...' : 'AI กำลังประมวลผล...') : (locale === 'en' ? 'AI Synthesize' : 'สังเคราะห์ด้วย AI')}</span>
                    </button>

                    {!isEditingKpiNotes ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditStrengths(locale === 'en' ? (selectedEmployeeKpi.strengthsEn || selectedEmployeeKpi.strengthsTh) : selectedEmployeeKpi.strengthsTh);
                          setEditCoachingNotes(locale === 'en' ? (selectedEmployeeKpi.coachingNotesEn || selectedEmployeeKpi.coachingNotesTh) : selectedEmployeeKpi.coachingNotesTh);
                          setEditFocusTags(selectedEmployeeKpi.focusTags || []);
                          setIsEditingKpiNotes(true);
                        }}
                        className="px-2.5 py-1 rounded-editorial bg-paper-canvas border border-border-rule hover:border-brand-indigo text-ink-primary hover:text-brand-indigo text-xs font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{locale === 'en' ? 'Edit Notes' : 'แก้ไขโน้ต'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingKpiNotes(false);
                          setEditStrengths(locale === 'en' ? (selectedEmployeeKpi.strengthsEn || selectedEmployeeKpi.strengthsTh) : selectedEmployeeKpi.strengthsTh);
                          setEditCoachingNotes(locale === 'en' ? (selectedEmployeeKpi.coachingNotesEn || selectedEmployeeKpi.coachingNotesTh) : selectedEmployeeKpi.coachingNotesTh);
                          setEditFocusTags(selectedEmployeeKpi.focusTags || []);
                        }}
                        className="px-2.5 py-1 rounded-editorial bg-paper-canvas border border-border-rule hover:bg-paper-subtle text-ink-secondary text-xs font-mono transition-colors cursor-pointer"
                      >
                        {locale === 'en' ? 'Cancel' : 'ยกเลิก'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Focus Tags Chips */}
                {(isEditingKpiNotes ? editFocusTags : (selectedEmployeeKpi.focusTags || [])).length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(isEditingKpiNotes ? editFocusTags : (selectedEmployeeKpi.focusTags || [])).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-paper-subtle border border-border-rule text-ink-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Form or Display */}
                {isEditingKpiNotes ? (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <label className="font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span>{locale === 'en' ? 'Key Strengths & Growth Factors:' : 'จุดเด่น & ปัจจัยความสำเร็จ (Key Strengths):'}</span>
                        </label>
                        <span className="text-[10px] text-ink-muted">{editStrengths.length} {locale === 'en' ? 'chars' : 'ตัวอักษร'}</span>
                      </div>
                      <textarea
                        value={editStrengths}
                        onChange={(e) => setEditStrengths(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 bg-paper-canvas border border-brand-indigo/40 rounded-editorial text-xs text-ink-primary font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-indigo"
                        placeholder={locale === 'en' ? 'Specify key strengths, success factors, or standout achievements...' : 'ระบุจุดเด่น ปัจจัยความสำเร็จ หรือผลงานที่โดดเด่น...'}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <label className="font-bold text-brand-indigo flex items-center gap-1.5 uppercase">
                          <FileText className="w-4 h-4 text-brand-indigo" />
                          <span>{locale === 'en' ? 'Manager Coaching & Growth Recommendations:' : 'ข้อแนะนำจากหัวหน้างาน (Manager Coaching & Growth):'}</span>
                        </label>
                        <span className="text-[10px] text-ink-muted">{editCoachingNotes.length} {locale === 'en' ? 'chars' : 'ตัวอักษร'}</span>
                      </div>
                      <textarea
                        value={editCoachingNotes}
                        onChange={(e) => setEditCoachingNotes(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 bg-paper-canvas border border-brand-indigo/40 rounded-editorial text-xs text-ink-primary font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-indigo"
                        placeholder={locale === 'en' ? 'Specify actionable growth recommendations or development areas...' : 'ระบุคำแนะนำ แผนการเติบโต หรือจุดที่ต้องการให้พัฒนา...'}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border-rule">
                      <span className="text-[10px] text-ink-muted font-mono">
                        {locale === 'en' ? 'Click "AI Synthesize" anytime to regenerate tailored recommendations.' : 'กด "สังเคราะห์ด้วย AI" เพื่อให้ AI ช่วยร่างข้อความใหม่ได้ตลอดเวลา'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingKpiNotes(false);
                            setEditStrengths(locale === 'en' ? (selectedEmployeeKpi.strengthsEn || selectedEmployeeKpi.strengthsTh) : selectedEmployeeKpi.strengthsTh);
                            setEditCoachingNotes(locale === 'en' ? (selectedEmployeeKpi.coachingNotesEn || selectedEmployeeKpi.coachingNotesTh) : selectedEmployeeKpi.coachingNotesTh);
                            setEditFocusTags(selectedEmployeeKpi.focusTags || []);
                          }}
                          className="px-3 py-1.5 rounded-editorial bg-paper-subtle hover:bg-paper-canvas text-ink-secondary text-xs font-mono transition-colors cursor-pointer border border-border-rule"
                        >
                          {locale === 'en' ? 'Cancel' : 'ยกเลิก'}
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveKpiEvaluation}
                          className="px-4 py-1.5 rounded-editorial bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{locale === 'en' ? 'Save Evaluation' : 'บันทึกการประเมิน'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="font-mono text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>{locale === 'en' ? 'Key Strengths & Growth Factors:' : 'จุดเด่น & ปัจจัยความสำเร็จ (Key Strengths):'}</span>
                      </span>
                      <p className="text-xs text-ink-primary leading-relaxed pl-5">
                        {locale === 'en' ? (selectedEmployeeKpi.strengthsEn || selectedEmployeeKpi.strengthsTh) : selectedEmployeeKpi.strengthsTh}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-border-rule space-y-1">
                      <span className="font-mono text-xs font-bold text-brand-indigo flex items-center gap-1.5 uppercase">
                        <FileText className="w-4 h-4 text-brand-indigo" />
                        <span>{locale === 'en' ? 'Manager Coaching & Growth Recommendations:' : 'ข้อแนะนำจากหัวหน้างาน (Manager Coaching & Growth):'}</span>
                      </span>
                      <p className="text-xs text-ink-secondary leading-relaxed pl-5">
                        {locale === 'en' ? (selectedEmployeeKpi.coachingNotesEn || selectedEmployeeKpi.coachingNotesTh) : selectedEmployeeKpi.coachingNotesTh}
                      </p>
                    </div>

                    {selectedEmployeeKpi.lastEvaluatedAt && (
                      <p className="text-[10px] text-ink-muted font-mono pt-1">
                        {locale === 'en' ? 'Last recorded: ' : 'บันทึกล่าสุด: '}{new Date(selectedEmployeeKpi.lastEvaluatedAt).toLocaleString(locale === 'en' ? 'en-US' : 'th-TH')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Dispatches by this Employee */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ink-primary uppercase tracking-wider">
                    {locale === 'en' ? `Recent published dispatches (${selectedEmployeeKpi.recentPosts.length} latest):` : `ผลงานโพสต์ที่สร้างและเผยแพร่ (${selectedEmployeeKpi.recentPosts.length} รายการล่าสุด):`}
                  </span>
                  <span className="text-[10px] text-ink-muted">Recorded in audit ledger</span>
                </div>

                <div className="space-y-2">
                  {selectedEmployeeKpi.recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 bg-paper-canvas border border-border-rule rounded-editorial flex items-center justify-between gap-3 hover:border-brand-indigo/40 transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <SocialPlatformIcon platform={post.platform} size={15} />
                          <h4 className="font-serif font-bold text-xs text-ink-primary truncate">
                            {post.title}
                          </h4>
                        </div>
                        <p className="text-[10px] text-ink-secondary">
                          {locale === 'en' ? 'Published on: ' : 'เผยแพร่เมื่อ: '}{post.dateStr}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
                        <span className="text-ink-primary font-bold flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-ink-secondary" />
                          <span>{post.views.toLocaleString()}</span>
                        </span>
                        <span className="text-semantic-success font-bold flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-semantic-success" />
                          <span>{post.likes.toLocaleString()}</span>
                        </span>
                        <span className="text-brand-indigo font-bold flex items-center gap-1">
                          <Share2 className="w-3.5 h-3.5 text-brand-indigo" />
                          <span>{post.shares.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border-rule bg-paper-canvas flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <span className="text-[10px] text-ink-muted">
                {locale === 'en' ? 'Telemetry Weights: Productivity (40%) + Punctuality (30%) + Quality (30%)' : 'เกณฑ์การวัดผล: Productivity (40%) + Punctuality (30%) + Quality (30%)'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEvaluationSlipOpen(true)}
                  className="px-3 py-1.5 rounded-editorial bg-paper-canvas hover:bg-paper-subtle text-ink-primary border border-border-rule text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title={locale === 'en' ? 'Print scorecard and coaching plan for HR' : 'พิมพ์ใบคะแนนและแผนโค้ชชิ่งสำหรับ HR'}
                >
                  <Printer className="w-3.5 h-3.5 text-brand-indigo" />
                  <span>{locale === 'en' ? 'Print Slip' : 'พิมพ์ใบประเมิน (Slip)'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetKpis}
                  title={locale === 'en' ? 'Reset evaluation to default mock values' : 'คืนค่าผลประเมินเป็นค่าเริ่มต้นจำลอง'}
                  className="px-3 py-1.5 rounded-editorial bg-paper-subtle hover:bg-paper-canvas text-ink-secondary hover:text-ink-primary border border-border-rule text-xs cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{locale === 'en' ? 'Reset Defaults' : 'รีเซ็ตค่าเริ่มต้น'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEmployeeKpi(null)}
                  className="px-4 py-1.5 rounded-editorial bg-paper-raised hover:bg-paper-subtle text-ink-primary border border-border-rule cursor-pointer font-bold shadow-2xs transition-colors"
                >
                  {locale === 'en' ? 'Close Window' : 'ปิดหน้าต่าง'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL PRINTABLE EVALUATION SLIP                                  */}
      {/* ========================================================================= */}
      {isEvaluationSlipOpen && selectedEmployeeKpi && (
        <div 
          onClick={() => setIsEvaluationSlipOpen(false)}
          className="fixed inset-0 z-60 bg-ink-primary/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border-2 border-border-strong rounded-card max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col cursor-default"
          >
            {/* Top Slip Action Bar */}
            <div className="p-3.5 border-b border-border-rule bg-paper-canvas flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-brand-indigo" />
                <span className="font-serif font-bold text-sm text-ink-primary">
                  {locale === 'en' ? 'Official Evaluation Scorecard Slip & Coaching Directive' : 'ใบคะแนนประเมินผลงานและแผนโค้ชชิ่ง (Official Evaluation Slip)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const isEn = locale === 'en';
                    const textSummary = isEn
                      ? `[RETZPOST EMPLOYEE EVALUATION SLIP]
Employee: ${selectedEmployeeKpi.name} (${selectedEmployeeKpi.roleEn || selectedEmployeeKpi.roleTh})
Workspace: ${selectedEmployeeKpi.workspaceName}
Result: Grade ${selectedEmployeeKpi.grade} (${selectedEmployeeKpi.overallKpiScore}/100)
- Output: ${selectedEmployeeKpi.actualPosts}/${selectedEmployeeKpi.targetPosts} posts (${selectedEmployeeKpi.postsCompletionRate}%)
- On-Time: ${selectedEmployeeKpi.onTimePublishingRate}%
- First-Pass: ${selectedEmployeeKpi.firstPassApprovalRate}%
- Total Reach: ${(selectedEmployeeKpi.totalImpressions / 1000).toFixed(0)}K Views (${selectedEmployeeKpi.avgEngagementRate} ER)
Key Strengths:
${selectedEmployeeKpi.strengthsEn || selectedEmployeeKpi.strengthsTh}
Manager Coaching:
${selectedEmployeeKpi.coachingNotesEn || selectedEmployeeKpi.coachingNotesTh}
Evaluated by: ${selectedEmployeeKpi.evaluatedByEn || 'Lead Editor'}
Date: ${new Date().toLocaleDateString('en-US')}`
                      : `[RETZPOST EMPLOYEE EVALUATION SLIP]
พนักงาน: ${selectedEmployeeKpi.name} (${selectedEmployeeKpi.roleTh})
โปรเจกต์: ${selectedEmployeeKpi.workspaceName}
ผลการประเมิน: เกรด ${selectedEmployeeKpi.grade} (${selectedEmployeeKpi.overallKpiScore}/100)
- เป้าหมายงาน: ${selectedEmployeeKpi.actualPosts}/${selectedEmployeeKpi.targetPosts} โพสต์ (${selectedEmployeeKpi.postsCompletionRate}%)
- ความตรงต่อเวลา (On-Time): ${selectedEmployeeKpi.onTimePublishingRate}%
- ตรวจผ่านรอบแรก (First-Pass): ${selectedEmployeeKpi.firstPassApprovalRate}%
- ยอดการเข้าถึงรวม: ${(selectedEmployeeKpi.totalImpressions / 1000).toFixed(0)}K วิว (${selectedEmployeeKpi.avgEngagementRate} ER)
จุดเด่น (Key Strengths):
${selectedEmployeeKpi.strengthsTh}
ข้อแนะนำจากหัวหน้างาน (Manager Coaching):
${selectedEmployeeKpi.coachingNotesTh}
ประเมินโดย: ${selectedEmployeeKpi.evaluatedBy || 'หัวหน้างาน'}
ลงวันที่: ${new Date().toLocaleDateString('th-TH')}`;
                    navigator.clipboard.writeText(textSummary);
                    setDownloadToast(isEn ? '✓ Evaluation slip copied to clipboard.' : '✓ คัดลอกข้อความสรุปใบคะแนนประเมินเรียบร้อยแล้ว');
                    setTimeout(() => setDownloadToast(null), 3000);
                  }}
                  className="px-2.5 py-1 rounded-editorial bg-paper-canvas border border-border-rule hover:border-brand-indigo text-ink-primary text-xs font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3 h-3 text-ink-secondary" />
                  <span>{locale === 'en' ? 'Copy Summary' : 'คัดลอกข้อความ'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded-editorial bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3 h-3" />
                  <span>{locale === 'en' ? 'Print Slip' : 'พิมพ์ใบคะแนน'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEvaluationSlipOpen(false)}
                  className="p-1 rounded-editorial border border-border-rule hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slip Printable Body */}
            <div className="p-6 overflow-y-auto space-y-4 bg-paper-canvas font-mono text-xs">
              {/* Slip Header Banner */}
              <div className="text-center pb-4 border-b-2 border-dashed border-border-strong space-y-1">
                <p className="font-serif font-black text-lg tracking-wider text-ink-primary uppercase">
                  RETZPOST PUBLISHING DESK
                </p>
                <p className="text-[10px] tracking-widest text-ink-secondary uppercase">
                  OFFICIAL STAFF KPI EVALUATION & COACHING SLIP
                </p>
                <p className="text-[9px] text-ink-muted">
                  DOC-ID: EVL-{selectedEmployeeKpi.memberId.toUpperCase()}-{new Date().getFullYear()} • VERIFIED LEDGER
                </p>
              </div>

              {/* Employee Bio & Grade Pill */}
              <div className="flex items-center justify-between p-3 bg-paper-raised border border-border-rule rounded-editorial">
                <div>
                  <h4 className="font-serif font-bold text-base text-ink-primary">
                    {selectedEmployeeKpi.name}
                  </h4>
                  <p className="text-[11px] text-ink-secondary font-sans">
                    {locale === 'en' ? (selectedEmployeeKpi.roleEn || selectedEmployeeKpi.roleTh) : selectedEmployeeKpi.roleTh} • {selectedEmployeeKpi.workspaceName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 inline-block font-mono">
                    {locale === 'en' ? 'Grade' : 'เกรด'} {selectedEmployeeKpi.grade} ({selectedEmployeeKpi.overallKpiScore}/100)
                  </span>
                  <span className="text-[9px] text-ink-muted block mt-0.5">Rank #{selectedEmployeeKpi.rank} of {employeeKpis.length}</span>
                </div>
              </div>

              {/* 4 Dimension Score Table */}
              <div className="border border-border-rule rounded-editorial overflow-hidden bg-paper-raised">
                <div className="grid grid-cols-4 p-2 bg-paper-subtle text-[10px] font-bold text-ink-secondary border-b border-border-rule uppercase tracking-wider">
                  <span>{locale === 'en' ? 'Output' : 'เป้าหมาย (Output)'}</span>
                  <span>{locale === 'en' ? 'On-Time' : 'ตรงต่อเวลา (On-Time)'}</span>
                  <span>{locale === 'en' ? 'Quality' : 'ผ่านรอบแรก (Quality)'}</span>
                  <span>{locale === 'en' ? 'Reach' : 'การเข้าถึง (Reach)'}</span>
                </div>
                <div className="grid grid-cols-4 p-2.5 text-xs font-bold text-ink-primary">
                  <span>{selectedEmployeeKpi.actualPosts}/{selectedEmployeeKpi.targetPosts} ({selectedEmployeeKpi.postsCompletionRate}%)</span>
                  <span>{selectedEmployeeKpi.onTimePublishingRate}%</span>
                  <span>{selectedEmployeeKpi.firstPassApprovalRate}%</span>
                  <span>{(selectedEmployeeKpi.totalImpressions / 1000).toFixed(0)}K ({selectedEmployeeKpi.avgEngagementRate})</span>
                </div>
              </div>

              {/* Key Strengths */}
              <div className="p-3 bg-paper-raised border border-border-rule rounded-editorial space-y-1 font-sans">
                <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{locale === 'en' ? 'Key Strengths & Growth Factors:' : 'จุดเด่น & ปัจจัยความสำเร็จ (Key Strengths):'}</span>
                </span>
                <p className="text-xs text-ink-primary leading-relaxed pl-4">
                  {locale === 'en' ? (selectedEmployeeKpi.strengthsEn || selectedEmployeeKpi.strengthsTh) : selectedEmployeeKpi.strengthsTh}
                </p>
              </div>

              {/* Manager Coaching */}
              <div className="p-3 bg-paper-raised border border-border-rule rounded-editorial space-y-1 font-sans">
                <span className="text-[11px] font-mono font-bold text-brand-indigo uppercase flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-brand-indigo" />
                  <span>{locale === 'en' ? 'Manager Coaching & Growth Recommendations:' : 'ข้อแนะนำจากหัวหน้างาน (Manager Coaching & Growth):'}</span>
                </span>
                <p className="text-xs text-ink-secondary leading-relaxed pl-4">
                  {locale === 'en' ? (selectedEmployeeKpi.coachingNotesEn || selectedEmployeeKpi.coachingNotesTh) : selectedEmployeeKpi.coachingNotesTh}
                </p>
              </div>

              {/* Focus Tags */}
              {(selectedEmployeeKpi.focusTags || []).length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-ink-secondary">FOCUS TAGS:</span>
                  {(selectedEmployeeKpi.focusTags || []).map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] bg-paper-raised border border-border-rule text-ink-primary font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Signature Line Footer */}
              <div className="pt-4 border-t-2 border-dashed border-border-strong grid grid-cols-2 gap-4 text-[11px] text-ink-secondary">
                <div className="space-y-4">
                  <p>{locale === 'en' ? 'Evaluator: ' : 'ผู้ประเมิน: '}<strong>{locale === 'en' ? (selectedEmployeeKpi.evaluatedByEn || 'Lead Editor') : (selectedEmployeeKpi.evaluatedBy || 'หัวหน้างาน (Lead Editor)')}</strong></p>
                  <p className="text-[9px] text-ink-muted">{locale === 'en' ? 'Recorded via RetzPost Secure Ledger' : 'บันทึกผ่าน RetzPost Secure Ledger'}</p>
                </div>
                <div className="text-right space-y-3">
                  <div className="border-b border-border-strong w-44 ml-auto pt-4" />
                  <p className="text-[10px]">{locale === 'en' ? 'Manager Signature / Approving Authority' : 'ลายเซ็นหัวหน้างาน / ผู้มีอำนาจอนุมัติ'}</p>
                  <p className="text-[9px] text-ink-muted">{locale === 'en' ? 'Date: ' : 'วันที่: '}{new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'th-TH')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REVOKE / DELETE DISPATCH MODAL                                     */}
      {/* ========================================================================= */}
      {revokeCandidateBatch && (
        <div 
          onClick={() => setRevokeCandidateBatch(null)}
          className="fixed inset-0 z-60 bg-ink-primary/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border border-border-rule rounded-card max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col cursor-default font-mono text-xs"
          >
            {/* Header */}
            <div className="p-4 border-b border-border-rule bg-paper-canvas flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-ink-primary">
                    {locale === 'en' ? 'Revoke & Delete Dispatch' : 'ถอนโพสต์ / สั่งลบงานเผยแพร่ (Revoke & Delete Dispatch)'}
                  </h3>
                  <span className="text-[10px] text-ink-secondary block">
                    {revokeCandidateBatch.id} • {revokeCandidateBatch.title}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRevokeCandidateBatch(null)}
                className="p-1 rounded text-ink-secondary hover:text-ink-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3.5">
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-editorial text-[11px] leading-relaxed">
                {locale === 'en' ? (
                  <><strong>API Deletion Protocol:</strong> Facebook, YouTube, and X support 100% automated API deletion. For Instagram, TikTok, and Lemon8, platform security requires direct in-app removal.</>
                ) : (
                  <><strong>ข้อกำหนดการลบแยกตาม API:</strong> แพลตฟอร์ม Facebook, YouTube, และ X รองรับการสั่งลบผ่าน API ได้ 100% ส่วน Instagram, TikTok, และ Lemon8 เป็นข้อกำหนดความปลอดภัยของแพลตฟอร์มที่ต้องกดเปิดเข้าไปลบในแอปโดยตรง</>
                )}
              </div>

              {/* Channels List Breakdown */}
              <div className="space-y-2">
                <span className="font-bold text-ink-primary block uppercase tracking-wider text-[10px]">
                  {locale === 'en' ? `Deletion status per destination (${revokeCandidateBatch.placements.length} channels):` : `สถานะการลบในแต่ละช่องทาง (${revokeCandidateBatch.placements.length} รายการ):`}
                </span>

                {revokeCandidateBatch.placements.map((plc, idx) => {
                  const plat = plc.platform.toUpperCase();
                  const canApiDelete = ['FACEBOOK', 'YOUTUBE', 'X', 'TWITTER'].includes(plat);

                  return (
                    <div 
                      key={idx} 
                      className="p-2.5 bg-paper-canvas border border-border-rule rounded-editorial flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <SocialPlatformIcon platform={plc.platform} size={18} />
                        <div className="truncate">
                          <p className="font-bold text-xs text-ink-primary truncate">{plc.label}</p>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold inline-block ${
                            canApiDelete
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {canApiDelete ? 'API DELETE SUPPORTED' : 'MANUAL APP DELETION'}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {canApiDelete ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsApiDeleting(prev => ({ ...prev, [`${revokeCandidateBatch.id}_${idx}`]: true }));
                              setTimeout(() => {
                                setIsApiDeleting(prev => ({ ...prev, [`${revokeCandidateBatch.id}_${idx}`]: false }));
                                setDownloadToast(locale === 'en' ? `✓ Sent API DELETE for "${plc.label}". Dispatch removed from destination.` : `✓ ส่งคำสั่ง API DELETE สำหรับ "${plc.label}" สำเร็จ โพสต์ถูกลบออกจากระบบจริงแล้ว`);
                                setTimeout(() => setDownloadToast(null), 3000);
                              }, 600);
                            }}
                            disabled={isApiDeleting[`${revokeCandidateBatch.id}_${idx}`]}
                            className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs disabled:opacity-50 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{isApiDeleting[`${revokeCandidateBatch.id}_${idx}`] ? (locale === 'en' ? 'Deleting...' : 'กำลังลบ...') : (locale === 'en' ? 'Delete via API' : 'ลบผ่าน API')}</span>
                          </button>
                        ) : (
                          plc.liveUrl ? (
                            <a
                              href={plc.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded bg-paper-raised hover:bg-paper-subtle border border-border-rule text-brand-indigo hover:underline text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                            >
                              <span>{locale === 'en' ? 'Open App to Delete' : 'เปิดโพสต์เพื่อลบ'}</span>
                            </a>
                          ) : (
                            <span className="text-[10px] text-ink-muted">{locale === 'en' ? 'No Link' : 'ไม่มีลิงก์'}</span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-border-rule bg-paper-canvas flex items-center justify-between">
              <span className="text-[10px] text-ink-muted">Recorded into audit trail</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRevokeCandidateBatch(null)}
                  className="px-3 py-1.5 rounded-editorial bg-paper-subtle hover:bg-paper-canvas border border-border-rule text-ink-secondary hover:text-ink-primary cursor-pointer text-xs"
                >
                  {locale === 'en' ? 'Close Window' : 'ปิดหน้าต่าง'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRevokedBatchIds(prev => ({ ...prev, [revokeCandidateBatch.id]: true }));
                    setDownloadToast(locale === 'en' ? `✓ Recorded revocation of "${revokeCandidateBatch.title}" in RetzPost Ledger.` : `✓ บันทึกการถอนโพสต์ "${revokeCandidateBatch.title}" ใน RetzPost Ledger เรียบร้อยแล้ว`);
                    setTimeout(() => setDownloadToast(null), 3000);
                    setRevokeCandidateBatch(null);
                  }}
                  className="px-3.5 py-1.5 rounded-editorial bg-neutral-900 hover:bg-black text-white font-bold cursor-pointer text-xs shadow-xs"
                >
                  {locale === 'en' ? 'Confirm Full Revocation' : 'บันทึกสถานะถอนโพสต์ทั้งหมด'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AI POST PERFORMANCE DIAGNOSIS & ACTIONABLE PLAYBOOK                */}
      {/* ========================================================================= */}
      {selectedPostDiagnosis && (
        <div 
          onClick={() => setSelectedPostDiagnosis(null)}
          className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border border-border-rule rounded-card max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col cursor-default"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-border-rule bg-paper-canvas flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-accent-terracotta to-brand-indigo flex items-center justify-center text-white text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
                    AI Content Performance Diagnosis & Playbook
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    AI MOCK ENGINE
                  </span>
                </div>
                <p className="text-xs font-mono text-ink-secondary">
                  {locale === 'en' ? (
                <>AI performance diagnosis: <strong>&quot;Attribution Factors&quot;</strong> paired with an <strong>&quot;Actionable Playbook&quot;</strong> for upcoming campaigns</>
              ) : (
                <>วิเคราะห์ว่า <strong>&quot;ทำไมถึงดี หรือได้ยอด&quot;</strong> พร้อม <strong>&quot;แนวทางต่อยอด&quot;</strong> สำหรับแคมเปญถัดไป</>
              )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPostDiagnosis(null)}
                className="p-1.5 rounded-editorial border border-border-rule hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
                title={locale === 'en' ? 'Close window (ESC)' : 'ปิดหน้าต่าง (ESC)'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Target Post Header Banner */}
              <div className="p-4 rounded-editorial bg-paper-canvas border border-border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-ink-secondary">
                    <SocialPlatformIcon platform={selectedPostDiagnosis.platform} size={15} />
                    <span>{selectedPostDiagnosis.workspaceName}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-ink-primary">
                    {selectedPostDiagnosis.postTitle}
                  </h4>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-ink-secondary block">{locale === 'en' ? 'Total Views' : 'ยอดคนดู / วิว'}</span>
                    <span className="font-bold text-ink-primary">{selectedPostDiagnosis.views.toLocaleString()}</span>
                  </div>
                  <div className="text-right pl-3 border-l border-border-rule">
                    <span className="text-[10px] text-ink-secondary block">{locale === 'en' ? 'Success Score' : 'คะแนนความสำเร็จ'}</span>
                    <span className="font-bold text-semantic-success">{selectedPostDiagnosis.overallSuccessScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-4 bg-brand-indigo/5 border border-brand-indigo/20 rounded-editorial space-y-1.5">
                <span className="font-mono text-[11px] font-bold text-brand-indigo flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
                  <span>{locale === 'en' ? 'Executive AI Attribution Diagnosis:' : 'สรุปผลการวิเคราะห์ด้วย AI (Executive Diagnosis):'}</span>
                </span>
                <p className="text-xs font-sans text-ink-primary leading-relaxed">
                  {locale === 'en' ? (selectedPostDiagnosis.executiveSummaryEn || selectedPostDiagnosis.executiveSummaryTh) : selectedPostDiagnosis.executiveSummaryTh}
                </p>
              </div>

              {/* SECTION 1: ทำไมถึงดี หรือได้ยอด (ATTRIBUTION SUCCESS DRIVERS) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-border-rule pb-1.5">
                  <h4 className="font-mono text-xs font-bold text-ink-primary flex items-center gap-1.5 uppercase">
                    <span>{locale === 'en' ? 'Attribution Drivers: Why Did This Post Perform?' : 'ปัจจัยความสำเร็จ: ทำไมโพสต์นี้ถึงได้ยอด? (Attribution Drivers)'}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-semantic-success font-semibold">
                    {selectedPostDiagnosis.attributionDrivers.length} {locale === 'en' ? 'Core Drivers' : 'ปัจจัยหลัก'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedPostDiagnosis.attributionDrivers.map((driver, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1.5 hover:border-brand-indigo/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-paper-subtle border border-border-rule text-ink-secondary font-bold flex items-center gap-1">
                          <span>{driver.icon}</span>
                          <span>{locale === 'en' ? (driver.categoryLabelEn || driver.categoryLabelTh) : driver.categoryLabelTh}</span>
                        </span>
                        <span className="text-[9px] font-mono font-bold text-semantic-success">
                          Impact: {driver.impactScore}/100
                        </span>
                      </div>

                      <h5 className="font-serif font-bold text-xs text-ink-primary">
                        {locale === 'en' ? (driver.titleEn || driver.titleTh) : driver.titleTh}
                      </h5>

                      <p className="text-[11px] text-ink-secondary leading-relaxed font-sans">
                        {locale === 'en' ? (driver.descriptionEn || driver.descriptionTh) : driver.descriptionTh}
                      </p>

                      <div className="pt-1 border-t border-border-rule/60 text-[10px] font-mono text-brand-indigo font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-accent-terracotta shrink-0" />
                        <span>{driver.metricHighlight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: แนวทางต่อยอด (ACTIONABLE PLAYBOOK) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-border-rule pb-1.5">
                  <h4 className="font-mono text-xs font-bold text-ink-primary flex items-center gap-1.5 uppercase">
                    <span>{locale === 'en' ? 'Actionable Playbook & Next Optimization Steps' : 'แนวทางต่อยอดและแผนการดำเนินการถัดไป (Actionable Playbook)'}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-accent-terracotta font-semibold">
                    AI Recommended Playbook
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedPostDiagnosis.actionablePlaybook.map((play) => (
                    <div
                      key={play.step}
                      className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1 flex items-start gap-3 hover:border-accent-terracotta/40 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-accent-terracotta/15 text-accent-terracotta font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {play.step}
                      </div>
                      <div className="space-y-1 flex-1">
                        <h5 className="font-serif font-bold text-xs text-ink-primary">
                          {locale === 'en' ? (play.titleEn || play.titleTh) : play.titleTh}
                        </h5>
                        <p className="text-[11px] text-ink-secondary leading-relaxed font-sans">
                          {locale === 'en' ? (play.actionEn || play.actionTh) : play.actionTh}
                        </p>
                        <p className="text-[10px] font-mono text-semantic-success font-semibold">
                          {locale === 'en' ? '↳ Expected Outcome: ' + (play.expectedOutcomeEn || play.expectedOutcomeTh) : '↳ ผลลัพธ์ที่คาดการณ์: ' + play.expectedOutcomeTh}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border-rule bg-paper-canvas flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-ink-muted">
                {locale === 'en' ? 'Logged in docs/MOCKUP_REGISTRY.md for live Gemini 1.5 API routing' : 'บันทึกใน docs/MOCKUP_REGISTRY.md สำหรับสลับไปต่อกับ Live Gemini 1.5 API'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPostDiagnosis(null)}
                className="px-4 py-1.5 rounded-editorial bg-paper-subtle hover:bg-paper-canvas text-ink-primary border border-border-rule cursor-pointer"
              >
                {locale === 'en' ? 'Close Window' : 'ปิดหน้าต่าง'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
