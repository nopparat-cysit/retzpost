'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon, 
  Plus, 
  Filter, 
  ExternalLink,
  Flame,
  Search,
  Sparkles,
  TrendingUp,
  LayoutGrid,
  CalendarDays,
  List,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Copy,
  Check,
  X,
  Smartphone,
  Link2,
  CheckCircle2,
  ArrowRight,
  Layers,
  Building2,
  SlidersHorizontal,
  RefreshCw,
  Zap,
  Globe,
  Radio,
  BarChart3
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
import { SmartFilterBar } from '@/components/ui/smart-filter-bar';
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

export type PostFormat = 'FEED_POST' | 'STORY' | 'VIDEO_REEL';
export type PlatformType = 'FACEBOOK' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK';
export type WorkspaceType = 'ALL' | 'CAPITAL_ONE' | 'ACME_CREATOR' | 'RETZPOST' | 'COFFEE_CRAFT';
export type ViewMode = 'MONTH' | 'WEEK' | 'AGENDA';

export interface CalendarEventItem {
  id: string;
  dayOfMonth: number;
  dateStr: string; // YYYY-MM-DD
  timeStr: string;
  hour: number; // e.g. 8.5 for 08:30
  title: string;
  platform: PlatformType;
  format: PostFormat;
  workspace: 'CAPITAL_ONE' | 'ACME_CREATOR' | 'RETZPOST' | 'COFFEE_CRAFT';
  workspaceName: string;
  handle: string;
  durationOrPhotos: string;
  status: 'SCHEDULED' | 'PUBLISHED' | 'DRAFT';
  caption: string;
  liveUrl?: string;
  websiteUrl?: string;
  storyLinkUrl?: string;
  storyLinkText?: string;
  previewImage?: string;
  isPeakHour?: boolean;
  peakLabel?: string;
  metrics?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    clicks?: number;
    engagementRate: string;
  };
  aiForecast?: {
    predictedReach: string;
    peakMatchScore: number;
    synergyScore: string;
  };
}

const WORKSPACE_CONFIG: Record<string, { name: string; icon: string; color: string }> = {
  CAPITAL_ONE: { name: 'Capital One Real Estate', icon: '🏢', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  ACME_CREATOR: { name: 'Acme Creator Studio', icon: '🎙️', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  RETZPOST: { name: 'RetzPost Software', icon: '⚡', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  COFFEE_CRAFT: { name: 'Coffee Craft BKK', icon: '☕', color: 'bg-amber-50 text-amber-800 border-amber-200' },
};

const SAMPLE_EVENTS: CalendarEventItem[] = [
  {
    id: 'ev-c1-1',
    dayOfMonth: 24,
    dateStr: '2026-10-24',
    timeStr: '08:30 AM',
    hour: 8.5,
    title: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
    platform: 'FACEBOOK',
    format: 'FEED_POST',
    workspace: 'CAPITAL_ONE',
    workspaceName: 'Capital One Real Estate',
    handle: 'Capital One Thailand',
    durationOrPhotos: 'Album (6 Photos)',
    status: 'PUBLISHED',
    caption: '🏙️ ยูนิตพิเศษ The Rich Rama 9-Srinakarin ห้องมุม 2 ห้องนอน วิวเมือง 270 องศา ใกล้ MRT ศรีกรีฑา 0 เมตร พร้อมข้อเสนอสุดเอ็กซ์คลูซีฟสำหรับผู้ลงทะเบียนสัปดาห์นี้เท่านั้น! #TheRichRama9 #LuxuryCondo #CapitalOne',
    liveUrl: 'https://www.facebook.com/capitalonethailand/posts/991283',
    websiteUrl: 'https://capitalone.co.th/the-rich-rama9',
    previewImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    isPeakHour: true,
    peakLabel: 'Morning Executive Peak 🔥',
    metrics: {
      views: 14820,
      likes: 1240,
      comments: 86,
      shares: 412,
      clicks: 890,
      engagementRate: '5.2%',
    },
  },
  {
    id: 'ev-c1-2',
    dayOfMonth: 24,
    dateStr: '2026-10-24',
    timeStr: '08:45 AM',
    hour: 8.75,
    title: 'Walkthrough: The Rich Rama 9 Penthouse Flash',
    platform: 'INSTAGRAM',
    format: 'STORY',
    workspace: 'CAPITAL_ONE',
    workspaceName: 'Capital One Real Estate',
    handle: '@capitalone.th',
    durationOrPhotos: '24h Story + Link Sticker',
    status: 'PUBLISHED',
    caption: '✨ Swipe up to explore the 360° virtual tour of The Rich Rama 9 Penthouse Suite. Only 2 units remaining!',
    liveUrl: 'https://www.instagram.com/stories/capitalone.th/348910283/',
    websiteUrl: 'https://capitalone.co.th/the-rich-rama9',
    storyLinkUrl: 'https://capitalone.co.th/the-rich-rama9-vip',
    storyLinkText: 'Book VIP Private Viewing',
    previewImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
    isPeakHour: true,
    peakLabel: 'Morning Executive Peak 🔥',
    metrics: {
      views: 9420,
      likes: 830,
      comments: 34,
      shares: 198,
      clicks: 642,
      engagementRate: '7.1%',
    },
  },
  {
    id: 'ev-acme-1',
    dayOfMonth: 24,
    dateStr: '2026-10-24',
    timeStr: '09:00 AM',
    hour: 9.0,
    title: '3 Hooks That Stop the Scroll in 2026',
    platform: 'INSTAGRAM',
    format: 'FEED_POST',
    workspace: 'ACME_CREATOR',
    workspaceName: 'Acme Creator Studio',
    handle: '@alexrivera_official',
    durationOrPhotos: '3-Slide Carousel',
    status: 'SCHEDULED',
    caption: 'Stop losing 80% of your audience in the first 2 seconds. Here are 3 counter-intuitive retention hooks we tested across 4M views this month: 1) Negative curiosity 2) The contrast frame 3) The instant proof. Save this post! #CreatorEconomy #VideoHooks #Retention',
    previewImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop&q=80',
    isPeakHour: true,
    peakLabel: 'Weekend Morning Creator Peak 🔥',
    aiForecast: {
      predictedReach: '32,000 - 45,000',
      peakMatchScore: 98,
      synergyScore: '+28% Feed & Reel Pairing',
    },
  },
  {
    id: 'ev-acme-2',
    dayOfMonth: 24,
    dateStr: '2026-10-24',
    timeStr: '09:00 AM',
    hour: 9.0,
    title: '3 Hooks That Stop the Scroll in 2026 (Shorts Cut)',
    platform: 'YOUTUBE',
    format: 'VIDEO_REEL',
    workspace: 'ACME_CREATOR',
    workspaceName: 'Acme Creator Studio',
    handle: '@AlexRiveraStudio',
    durationOrPhotos: '00:45 (9:16)',
    status: 'SCHEDULED',
    caption: 'How to hook viewers in 1.8 seconds flat. Full breakdown on Alex Rivera Studio! #Shorts #CreatorTips',
    previewImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    isPeakHour: true,
    peakLabel: 'Weekend Morning Creator Peak 🔥',
    aiForecast: {
      predictedReach: '60,000 - 90,000',
      peakMatchScore: 96,
      synergyScore: 'Cross-platform Syndicate',
    },
  },
  {
    id: 'ev-acme-3',
    dayOfMonth: 24,
    dateStr: '2026-10-24',
    timeStr: '10:30 AM',
    hour: 10.5,
    title: 'Live Workshop Behind the Scenes Flash',
    platform: 'INSTAGRAM',
    format: 'STORY',
    workspace: 'ACME_CREATOR',
    workspaceName: 'Acme Creator Studio',
    handle: '@alexrivera_official',
    durationOrPhotos: '24h Story + Link Sticker',
    status: 'SCHEDULED',
    caption: 'Pre-show soundcheck for the Masterclass! Tap the sticker to claim one of the 15 remaining live workshop passes 🎙️👇',
    storyLinkUrl: 'https://acmestudio.io/masterclass-live',
    storyLinkText: 'Get Workshop Pass',
    previewImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    aiForecast: {
      predictedReach: '12,000 - 18,000',
      peakMatchScore: 91,
      synergyScore: 'Story Link Conversion Optimized',
    },
  },
  {
    id: 'ev-c1-3',
    dayOfMonth: 24,
    dateStr: '2026-10-24',
    timeStr: '19:30 PM',
    hour: 19.5,
    title: 'Capital One Weekend Property Tour Invitation',
    platform: 'FACEBOOK',
    format: 'FEED_POST',
    workspace: 'CAPITAL_ONE',
    workspaceName: 'Capital One Real Estate',
    handle: 'Capital One Thailand',
    durationOrPhotos: 'Album (4 Photos)',
    status: 'SCHEDULED',
    caption: 'เปิดบ้านวันหยุดสุดสัปดาห์! สัมผัสประสบการณ์จริงใจกลางพระราม 9 ร่วมจิบกาแฟพิเศษและรับโปรโมชั่นลดสูงสุด 500,000 บาทเฉพาะสัปดาห์นี้ #CapitalOne #BangkokProperty',
    websiteUrl: 'https://capitalone.co.th/events/weekend-tour',
    previewImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    isPeakHour: true,
    peakLabel: 'Evening Prime Window 🔥',
    aiForecast: {
      predictedReach: '18,500 - 26,000',
      peakMatchScore: 97,
      synergyScore: 'Prime Feed Engagement',
    },
  },
  {
    id: 'ev-coffee-1',
    dayOfMonth: 25,
    dateStr: '2026-10-25',
    timeStr: '10:00 AM',
    hour: 10.0,
    title: 'Sunday Coffee Cupping Masterclass',
    platform: 'INSTAGRAM',
    format: 'STORY',
    workspace: 'COFFEE_CRAFT',
    workspaceName: 'Coffee Craft BKK',
    handle: '@coffeecraft.bkk',
    durationOrPhotos: '24h Story + Link Sticker',
    status: 'SCHEDULED',
    caption: 'เมล็ดกาแฟล็อตใหม่จากแม่จันใต้ คั่วระดับ Light Roast พร้อมเสิร์ฟแล้ววันนี้ที่หน้าร้านทองหล่อ! กดลิงก์เพื่อสั่ง Delivery ได้เลย ☕',
    storyLinkUrl: 'https://lineman.line.me/coffeecraft',
    storyLinkText: 'Order via LINE MAN',
    previewImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    isPeakHour: true,
    peakLabel: 'Sunday Brunch Wave 🔥',
    aiForecast: {
      predictedReach: '8,500 - 12,000',
      peakMatchScore: 94,
      synergyScore: 'Direct Delivery Conversion',
    },
  },
  {
    id: 'ev-c1-4',
    dayOfMonth: 25,
    dateStr: '2026-10-25',
    timeStr: '18:00 PM',
    hour: 18.0,
    title: 'Sunday Evening Review: Real Estate ROI in Rama 9',
    platform: 'YOUTUBE',
    format: 'VIDEO_REEL',
    workspace: 'CAPITAL_ONE',
    workspaceName: 'Capital One Real Estate',
    handle: 'Capital One Thailand',
    durationOrPhotos: '00:59 (9:16)',
    status: 'SCHEDULED',
    caption: 'วิเคราะห์ผลตอบแทนคอนโดมิเนียมทำเลพระราม 9 ปี 2026 คุ้มค่าไหมกับการลงทุนระยะยาว? สรุปเข้าใจง่ายใน 1 นาที! #CapitalOne #RealEstateInvestment',
    previewImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    aiForecast: {
      predictedReach: '22,000 - 35,000',
      peakMatchScore: 93,
      synergyScore: 'High Intent Investors',
    },
  },
  {
    id: 'ev-acme-4',
    dayOfMonth: 26,
    dateStr: '2026-10-26',
    timeStr: '14:30 PM',
    hour: 14.5,
    title: 'Behind the Scenes: Editing Workflow V2',
    platform: 'FACEBOOK',
    format: 'FEED_POST',
    workspace: 'ACME_CREATOR',
    workspaceName: 'Acme Creator Studio',
    handle: 'Alex Rivera Studio',
    durationOrPhotos: 'Album (4 Photos)',
    status: 'SCHEDULED',
    caption: 'From rough cut to multi-format distribution in under 20 minutes. Here is how our modern post-production desk runs in 2026. #PostProduction #VideoEditing #RetzPost',
    previewImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=80',
    aiForecast: {
      predictedReach: '15,000 - 24,000',
      peakMatchScore: 89,
      synergyScore: 'B2B Creator Audience',
    },
  },
  {
    id: 'ev-retz-1',
    dayOfMonth: 27,
    dateStr: '2026-10-27',
    timeStr: '09:00 AM',
    hour: 9.0,
    title: 'RetzPost Team Collaboration & Role Management Launch',
    platform: 'FACEBOOK',
    format: 'FEED_POST',
    workspace: 'RETZPOST',
    workspaceName: 'RetzPost Software',
    handle: 'RetzPost Official',
    durationOrPhotos: 'Album (3 Photos)',
    status: 'SCHEDULED',
    caption: '🚀 Announcing 5-Tier RBAC & Workspace Collaboration for RetzPost! Seamlessly invite Editors, Contributors, and Managers with granular channel credentials. Try it now! #RetzPost #SaaS #ProductUpdate',
    websiteUrl: 'https://retzpost.com/changelog/team-collaboration',
    previewImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    isPeakHour: true,
    peakLabel: 'Morning Tech News Peak 🔥',
    aiForecast: {
      predictedReach: '40,000 - 65,000',
      peakMatchScore: 99,
      synergyScore: 'Product Launch Surge',
    },
  },
  {
    id: 'ev-retz-2',
    dayOfMonth: 27,
    dateStr: '2026-10-27',
    timeStr: '12:30 PM',
    hour: 12.5,
    title: 'RetzPost Instant Preview Demo',
    platform: 'INSTAGRAM',
    format: 'STORY',
    workspace: 'RETZPOST',
    workspaceName: 'RetzPost Software',
    handle: '@retzpost.app',
    durationOrPhotos: '24h Story + Link Sticker',
    status: 'SCHEDULED',
    caption: 'See how your feed, story, and reel look before publishing in real-time. Link below! 👇',
    storyLinkUrl: 'https://retzpost.com/demo',
    storyLinkText: 'Try Interactive Demo',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    isPeakHour: true,
    peakLabel: 'Lunch Rush Window 🔥',
    aiForecast: {
      predictedReach: '14,000 - 20,000',
      peakMatchScore: 95,
      synergyScore: 'High Click-Through Conversion',
    },
  },
  {
    id: 'ev-c1-5',
    dayOfMonth: 28,
    dateStr: '2026-10-28',
    timeStr: '10:00 AM',
    hour: 10.0,
    title: 'The Rich Rama 9 Unit 12B Virtual Tour',
    platform: 'YOUTUBE',
    format: 'VIDEO_REEL',
    workspace: 'CAPITAL_ONE',
    workspaceName: 'Capital One Real Estate',
    handle: 'Capital One Thailand',
    durationOrPhotos: '00:48 (9:16)',
    status: 'SCHEDULED',
    caption: 'ชมยูนิต 12B ตกแต่งสไตล์ Modern Luxury พร้อมเฟอร์นิเจอร์นำเข้าทั้งห้อง ลงทะเบียนรับชมห้องจริงได้ที่ลิงก์ในไบโอ #TheRichRama9 #VirtualTour',
    previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    aiForecast: {
      predictedReach: '25,000 - 38,000',
      peakMatchScore: 92,
      synergyScore: 'Visual Property Showcase',
    },
  },
  {
    id: 'ev-acme-5',
    dayOfMonth: 22,
    dateStr: '2026-10-22',
    timeStr: '09:15 AM',
    hour: 9.25,
    title: 'Studio Redesign Tour Master Cut',
    platform: 'YOUTUBE',
    format: 'VIDEO_REEL',
    workspace: 'ACME_CREATOR',
    workspaceName: 'Acme Creator Studio',
    handle: '@AlexRiveraStudio',
    durationOrPhotos: '00:58 (9:16)',
    status: 'PUBLISHED',
    caption: 'Our $45,000 desk & lighting overhaul is finished. Here is the full breakdown of acoustic panels, monitor arms, and color grading displays! #StudioTour #AlexRivera',
    liveUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ',
    previewImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    isPeakHour: true,
    peakLabel: 'Morning Peak 🔥',
    metrics: {
      views: 48920,
      likes: 3820,
      comments: 241,
      shares: 980,
      engagementRate: '8.4%',
    },
  },
  {
    id: 'ev-coffee-2',
    dayOfMonth: 21,
    dateStr: '2026-10-21',
    timeStr: '14:00 PM',
    hour: 14.0,
    title: 'Single Origin Pour-over Masterclass Highlight',
    platform: 'INSTAGRAM',
    format: 'FEED_POST',
    workspace: 'COFFEE_CRAFT',
    workspaceName: 'Coffee Craft BKK',
    handle: '@coffeecraft.bkk',
    durationOrPhotos: 'Photo Album (5)',
    status: 'PUBLISHED',
    caption: 'บรรยากาศเวิร์กชอปดริปกาแฟเมื่อวันเสาร์ที่ผ่านมา สนุกสนานและได้ชิมกาแฟจาก 6 แหล่งปลูกทั่วโลก ขอบคุณทุกท่านที่มาร่วมสนุกกันครับ ☕ #CoffeeCraftBKK #SpecialtyCoffee',
    liveUrl: 'https://www.instagram.com/p/C1CoffeeCraftSingle/',
    previewImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    metrics: {
      views: 6420,
      likes: 712,
      comments: 48,
      shares: 114,
      engagementRate: '6.1%',
    },
  },
  {
    id: 'ev-retz-3',
    dayOfMonth: 23,
    dateStr: '2026-10-23',
    timeStr: '19:30 PM',
    hour: 19.5,
    title: 'RetzPost 2.0 Feature Release: Multi-format Orchestrator',
    platform: 'FACEBOOK',
    format: 'FEED_POST',
    workspace: 'RETZPOST',
    workspaceName: 'RetzPost Software',
    handle: 'RetzPost Official',
    durationOrPhotos: 'Infographic + Album (4)',
    status: 'PUBLISHED',
    caption: 'Orchestrating Feed Posts, 24h Stories with Link Stickers, and 9:16 Video Reels in a single editorial timeline. See what is new in RetzPost 2.0! #SocialMediaTech #RetzPost2',
    liveUrl: 'https://www.facebook.com/retzpost/posts/882190',
    websiteUrl: 'https://retzpost.com/features/orchestrator',
    previewImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    metrics: {
      views: 21400,
      likes: 1840,
      comments: 112,
      shares: 530,
      clicks: 1240,
      engagementRate: '5.8%',
    },
  },
  {
    id: 'ev-acme-6',
    dayOfMonth: 29,
    dateStr: '2026-10-29',
    timeStr: '15:00 PM',
    hour: 15.0,
    title: 'Acme Studio Lighting Gear Comparison',
    platform: 'YOUTUBE',
    format: 'VIDEO_REEL',
    workspace: 'ACME_CREATOR',
    workspaceName: 'Acme Creator Studio',
    handle: '@AlexRiveraStudio',
    durationOrPhotos: '00:52 (9:16)',
    status: 'SCHEDULED',
    caption: 'Aputure vs Godox: Which light setup gives you cinema-grade skin tones for under $500? Watch before you buy! #Filmmaking #LightingTips',
    previewImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    aiForecast: {
      predictedReach: '30,000 - 45,000',
      peakMatchScore: 91,
      synergyScore: 'Tech Gear Engagement',
    },
  },
  {
    id: 'ev-retz-4',
    dayOfMonth: 30,
    dateStr: '2026-10-30',
    timeStr: '19:00 PM',
    hour: 19.0,
    title: 'Friday Feature Highlight: CSV Dispatch & Error Export',
    platform: 'FACEBOOK',
    format: 'FEED_POST',
    workspace: 'RETZPOST',
    workspaceName: 'RetzPost Software',
    handle: 'RetzPost Official',
    durationOrPhotos: 'Single Image Graphic',
    status: 'SCHEDULED',
    caption: 'Need compliance-grade audit logs? RetzPost now exports comprehensive CSV reports for all dispatches, token refreshes, and provider API payloads. #AuditReady #RetzPost',
    previewImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    aiForecast: {
      predictedReach: '16,000 - 22,000',
      peakMatchScore: 93,
      synergyScore: 'B2B Compliance High Intent',
    },
  },
  {
    id: 'ev-coffee-3',
    dayOfMonth: 31,
    dateStr: '2026-10-31',
    timeStr: '18:00 PM',
    hour: 18.0,
    title: 'Halloween Midnight Roast Limited Drop',
    platform: 'INSTAGRAM',
    format: 'FEED_POST',
    workspace: 'COFFEE_CRAFT',
    workspaceName: 'Coffee Craft BKK',
    handle: '@coffeecraft.bkk',
    durationOrPhotos: 'Album (4)',
    status: 'SCHEDULED',
    caption: '🎃 สเปเชียลเบลนด์เฉพาะค่ำคืนฮาโลวีน กลิ่น Dark Chocolate, Roasted Almond และ Spiced Plum มีจำนวนจำกัดเพียง 50 ถุงเท่านั้น! #HalloweenSpecial #CoffeeCraftBKK',
    previewImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    aiForecast: {
      predictedReach: '11,000 - 16,000',
      peakMatchScore: 96,
      synergyScore: 'Seasonal Holiday Rush',
    },
  },
];

export default function EditorialCalendarPage() {
  const [events, setEvents] = useState<CalendarEventItem[]>(SAMPLE_EVENTS);
  const [viewMode, setViewMode] = useState<ViewMode>('MONTH');
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceType>('ALL');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | PlatformType>('ALL');
  const [formatFilter, setFormatFilter] = useState<'ALL' | PostFormat>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'PUBLISHED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiPeakTimes, setShowAiPeakTimes] = useState(true);
  const [currentMonthStr, setCurrentMonthStr] = useState('October 2026');
  
  // Slide-Over Event Inspector State
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'MOBILE' | 'DATA'>('MOBILE');

  // Quick Schedule Modal State
  const [quickScheduleModal, setQuickScheduleModal] = useState<{
    isOpen: boolean;
    day: number;
    timeStr: string;
    workspace: 'CAPITAL_ONE' | 'ACME_CREATOR' | 'RETZPOST' | 'COFFEE_CRAFT';
  } | null>(null);

  // New post form state for Quick Scheduler
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPlatform, setQuickPlatform] = useState<PlatformType>('FACEBOOK');
  const [quickFormat, setQuickFormat] = useState<PostFormat>('FEED_POST');
  const [quickLinkSticker, setQuickLinkSticker] = useState('');

  // Reschedule inline state inside inspector
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Inline expanded days state in Month view (แก้ปัญหาปุ่ม more)
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});

  // Day dispatches list modal state
  const [dayModal, setDayModal] = useState<{ day: number; dateStr: string; events: CalendarEventItem[] } | null>(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
        setDayModal(null);
        setQuickScheduleModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when modal/drawer is open
  useEffect(() => {
    if (selectedEvent || dayModal || quickScheduleModal?.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedEvent, dayModal, quickScheduleModal]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Days calculation for October 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingBlanks = Array.from({ length: 3 }, (_, i) => i); // Mon, Tue, Wed blank before Thu Oct 1

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchWorkspace = selectedWorkspace === 'ALL' || ev.workspace === selectedWorkspace;
      const matchPlatform = platformFilter === 'ALL' || ev.platform === platformFilter;
      const matchFormat = formatFilter === 'ALL' || ev.format === formatFilter;
      const matchStatus = statusFilter === 'ALL' || ev.status === statusFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.workspaceName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchWorkspace && matchPlatform && matchFormat && matchStatus && matchSearch;
    });
  }, [events, selectedWorkspace, platformFilter, formatFilter, statusFilter, searchQuery]);

  // KPI Calculations
  const totalEventsCount = filteredEvents.length;
  const publishedCount = filteredEvents.filter((e) => e.status === 'PUBLISHED').length;
  const scheduledCount = filteredEvents.filter((e) => e.status === 'SCHEDULED').length;
  const feedCount = filteredEvents.filter((e) => e.format === 'FEED_POST').length;
  const storyCount = filteredEvents.filter((e) => e.format === 'STORY').length;
  const reelCount = filteredEvents.filter((e) => e.format === 'VIDEO_REEL').length;

  // Handle Event Selection
  const handleOpenEventInspector = (ev: CalendarEventItem) => {
    setSelectedEvent(ev);
    setRescheduleDate(ev.dateStr);
    setRescheduleTime(ev.timeStr);
  };

  // Handle Rescheduling
  const handleSaveReschedule = () => {
    if (!selectedEvent) return;
    const day = parseInt(rescheduleDate.split('-')[2], 10) || selectedEvent.dayOfMonth;
    const updated = events.map((item) => {
      if (item.id === selectedEvent.id) {
        return {
          ...item,
          dateStr: rescheduleDate,
          dayOfMonth: day,
          timeStr: rescheduleTime,
        };
      }
      return item;
    });
    setEvents(updated);
    setSelectedEvent({
      ...selectedEvent,
      dateStr: rescheduleDate,
      dayOfMonth: day,
      timeStr: rescheduleTime,
    });
    showToast(`✓ เลื่อนกำหนดการเผยแพร่เป็น "${rescheduleDate} @ ${rescheduleTime}" เรียบร้อยแล้ว`);
  };

  // Handle Quick Schedule Submit
  const handleQuickScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickScheduleModal || !quickTitle.trim()) return;

    const newId = `ev-new-${Date.now()}`;
    const newEvent: CalendarEventItem = {
      id: newId,
      dayOfMonth: quickScheduleModal.day,
      dateStr: `2026-10-${String(quickScheduleModal.day).padStart(2, '0')}`,
      timeStr: quickScheduleModal.timeStr,
      hour: 10.0,
      title: quickTitle,
      platform: quickPlatform,
      format: quickFormat,
      workspace: quickScheduleModal.workspace,
      workspaceName: WORKSPACE_CONFIG[quickScheduleModal.workspace].name,
      handle: quickScheduleModal.workspace === 'CAPITAL_ONE' ? 'Capital One Thailand' : quickScheduleModal.workspace === 'RETZPOST' ? 'RetzPost Official' : '@alexrivera_official',
      durationOrPhotos: quickFormat === 'STORY' ? '24h Story + Link Sticker' : quickFormat === 'VIDEO_REEL' ? '00:45 (9:16)' : 'Feed Album',
      status: 'SCHEDULED',
      caption: `${quickTitle} — Scheduled via Calendar Quick Dispatch Desk.`,
      storyLinkUrl: quickFormat === 'STORY' && quickLinkSticker.trim() ? quickLinkSticker : undefined,
      storyLinkText: quickFormat === 'STORY' ? 'Learn More' : undefined,
      isPeakHour: true,
      peakLabel: 'Optimized Dispatch 🔥',
      aiForecast: {
        predictedReach: '15,000 - 25,000',
        peakMatchScore: 95,
        synergyScore: 'Fast Cadence Synergized',
      },
    };

    setEvents([newEvent, ...events]);
    setQuickScheduleModal(null);
    setQuickTitle('');
    setQuickLinkSticker('');
    showToast(`✓ เพิ่มโพสต์ใหม่ "${quickTitle}" ลงในปฏิทินวันที่ ${newEvent.dateStr} เรียบร้อย!`);
  };

  // Helper for platform styling
  const getPlatformBadge = (plat: PlatformType) => {
    switch (plat) {
      case 'FACEBOOK':
        return { name: 'Facebook', color: 'bg-[#1877F2] text-white', dot: 'bg-[#1877F2]' };
      case 'INSTAGRAM':
        return { name: 'Instagram', color: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white', dot: 'bg-[#DD2A7B]' };
      case 'YOUTUBE':
        return { name: 'YouTube', color: 'bg-[#FF0000] text-white', dot: 'bg-[#FF0000]' };
      case 'TIKTOK':
        return { name: 'TikTok', color: 'bg-[#000000] text-cyan-400 border border-cyan-500/30', dot: 'bg-[#00F2FE]' };
    }
  };

  const getFormatBadge = (fmt: PostFormat) => {
    switch (fmt) {
      case 'FEED_POST':
        return { label: 'Feed', color: 'bg-brand-indigo text-white' };
      case 'STORY':
        return { label: 'Story 24h', color: 'bg-accent-terracotta text-white' };
      case 'VIDEO_REEL':
        return { label: 'Reel 9:16', color: 'bg-semantic-info text-white' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-ink-primary text-paper-canvas text-xs font-mono rounded-editorial shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-semantic-success" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Masthead */}
      <Masthead
        folio="EDITORIAL CADENCE & INTELLIGENT DISPATCH DESK"
        editionDate="OCTOBER 2026 • ASIA/BANGKOK (UTC+7)"
        title="Editorial Calendar & Cadence"
        subtitle="Unified multi-workspace calendar for Feed Posts, 24h Stories with Link Stickers, and 9:16 Video Releases across Meta, YouTube, and TikTok."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-indigo text-white text-xs font-semibold rounded-editorial hover:bg-brand-indigo-hover transition-all shadow-xs active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Studio Desk</span>
            </Link>
            <button
              onClick={() => {
                setQuickScheduleModal({
                  isOpen: true,
                  day: 24,
                  timeStr: '09:00 AM',
                  workspace: selectedWorkspace === 'ALL' ? 'CAPITAL_ONE' : selectedWorkspace,
                });
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-paper-raised border border-border-rule text-ink-primary text-xs font-semibold rounded-editorial hover:bg-paper-subtle transition-all shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-accent-terracotta" />
              <span>Quick Dispatch</span>
            </button>
          </div>
        }
      />

      {/* Top Cadence KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-paper-raised border border-border-rule rounded-card shadow-xs">
          <div className="flex items-center justify-between text-ink-secondary text-[11px] font-mono mb-1">
            <span>TOTAL DISPATCHES</span>
            <CalendarDays className="w-3.5 h-3.5 text-brand-indigo" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-ink-primary">{totalEventsCount}</span>
            <span className="text-[11px] font-mono text-semantic-success">
              {publishedCount} Live • {scheduledCount} Queued
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-paper-raised border border-border-rule rounded-card shadow-xs">
          <div className="flex items-center justify-between text-ink-secondary text-[11px] font-mono mb-1">
            <span>ESTIMATED REACH</span>
            <TrendingUp className="w-3.5 h-3.5 text-semantic-success" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-ink-primary">185.4K</span>
            <span className="text-[11px] font-mono text-ink-secondary">+24% vs last mo</span>
          </div>
        </div>

        <div className="p-3.5 bg-paper-raised border border-border-rule rounded-card shadow-xs">
          <div className="flex items-center justify-between text-ink-secondary text-[11px] font-mono mb-1">
            <span>FORMAT MIX RATIO</span>
            <Layers className="w-3.5 h-3.5 text-accent-terracotta" />
          </div>
          <div className="flex items-center gap-2 font-mono text-xs mt-1">
            <span className="px-1.5 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-bold">{feedCount} Feed</span>
            <span className="px-1.5 py-0.5 rounded bg-accent-terracotta/10 text-accent-terracotta font-bold">{storyCount} Story</span>
            <span className="px-1.5 py-0.5 rounded bg-semantic-info/10 text-semantic-info font-bold">{reelCount} Reel</span>
          </div>
        </div>

        <div className="p-3.5 bg-paper-raised border border-border-rule rounded-card shadow-xs">
          <div className="flex items-center justify-between text-ink-secondary text-[11px] font-mono mb-1">
            <span>AI PEAK ACCURACY</span>
            <Flame className="w-3.5 h-3.5 text-accent-terracotta" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-accent-terracotta">94%</span>
            <span className="text-[11px] font-mono text-ink-secondary">Prime Window Match</span>
          </div>
        </div>
      </div>

      {/* AI Peak Engagement Heatmap Ribbon */}
      <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-accent-terracotta/5 to-transparent border border-accent-terracotta/20 rounded-card flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-terracotta/15 flex items-center justify-center text-accent-terracotta shrink-0">
            <Flame className="w-4 h-4 fill-accent-terracotta text-accent-terracotta" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-ink-primary text-sm">AI Peak Audience Engagement Windows</span>
              <span className="px-1.5 py-0.2 rounded bg-accent-terracotta text-white font-mono text-[9px] uppercase font-bold">
                Live Algorithm
              </span>
            </div>
            <p className="text-ink-secondary text-[11px]">
              Bangkok Audience Peak: <strong className="text-ink-primary">08:30 - 09:30 AM</strong> (Exec & Real Estate Feed) •{' '}
              <strong className="text-ink-primary">11:30 AM - 13:00 PM</strong> (Lunch Story Swipes) •{' '}
              <strong className="text-ink-primary">19:30 - 21:30 PM</strong> (Prime Evening Reels).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
          <button
            onClick={() => setShowAiPeakTimes(!showAiPeakTimes)}
            className={`px-3 py-1.5 rounded-editorial border transition-colors flex items-center gap-1.5 ${
              showAiPeakTimes
                ? 'bg-accent-terracotta text-white border-accent-terracotta font-bold'
                : 'bg-paper-raised text-ink-secondary border-border-rule hover:text-ink-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showAiPeakTimes ? 'Highlighting Peak Hours' : 'Show Peak Hours'}</span>
          </button>
        </div>
      </div>

      {/* Workspace Filter Bar (Smart Hybrid: Top Active Pills + Searchable More Dropdown) */}
      <div className="pb-2 border-b border-border-rule">
        <SmartFilterBar
          label={
            <span className="text-[10px] font-mono uppercase font-bold text-ink-secondary flex items-center gap-1.5 mr-1.5">
              <Globe className="w-3.5 h-3.5 text-brand-indigo" />
              <span>Workspace:</span>
            </span>
          }
          items={[
            { id: 'ALL', label: 'All Workspaces', count: events.length, icon: <span>🌐</span> },
            ...(['CAPITAL_ONE', 'ACME_CREATOR', 'RETZPOST', 'COFFEE_CRAFT'] as const).map((wsKey) => ({
              id: wsKey,
              label: WORKSPACE_CONFIG[wsKey].name,
              count: events.filter((e) => e.workspace === wsKey).length,
              icon: <span>{WORKSPACE_CONFIG[wsKey].icon}</span>,
            })),
          ]}
          selectedId={selectedWorkspace}
          onSelect={(id) => setSelectedWorkspace(id as any)}
          maxVisiblePills={4}
          moreButtonText="โครงการอื่นๆ"
          searchPlaceholder="🔍 ค้นหา Workspace..."
        />
      </div>

      {/* Control Toolbar: Navigation, View Modes & Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 bg-paper-raised border border-border-rule rounded-card text-xs">
        {/* Left: Date Navigation & Timezone */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 border border-border-rule rounded-editorial bg-paper-canvas p-1 shadow-2xs">
            <button
              onClick={() => showToast('← Previous Month Loaded')}
              className="p-1 hover:bg-paper-subtle rounded text-ink-secondary hover:text-ink-primary transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-serif font-bold text-sm px-2 text-ink-primary tracking-tight">
              {currentMonthStr}
            </span>
            <button
              onClick={() => showToast('Next Month Loaded →')}
              className="p-1 hover:bg-paper-subtle rounded text-ink-secondary hover:text-ink-primary transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => showToast('Returned to Today (Oct 24, 2026)')}
            className="px-2.5 py-1.5 border border-border-rule rounded-editorial font-mono text-[11px] text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle transition-colors"
          >
            Today
          </button>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-secondary border-l border-border-rule pl-3">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
            <span>Asia/Bangkok (UTC+7)</span>
          </div>
        </div>

        {/* Center: Search Box */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search campaigns, captions, handles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-paper-canvas border border-border-rule rounded-editorial text-xs font-mono text-ink-primary placeholder:text-ink-muted focus:outline-hidden focus:border-brand-indigo"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Right: View Modes & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-0.5 border border-border-rule rounded-editorial p-0.5 bg-paper-subtle font-mono text-[11px]">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                viewMode === 'MONTH'
                  ? 'bg-paper-canvas text-brand-indigo font-bold shadow-2xs'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              onClick={() => setViewMode('WEEK')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                viewMode === 'WEEK'
                  ? 'bg-paper-canvas text-brand-indigo font-bold shadow-2xs'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Week</span>
            </button>
            <button
              onClick={() => setViewMode('AGENDA')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                viewMode === 'AGENDA'
                  ? 'bg-paper-canvas text-brand-indigo font-bold shadow-2xs'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Ledger</span>
            </button>
          </div>

          {/* Format Filter */}
          <div className="flex items-center gap-0.5 border border-border-rule rounded-editorial p-0.5 bg-paper-subtle font-mono text-[11px]">
            {(['ALL', 'FEED_POST', 'STORY', 'VIDEO_REEL'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatFilter(fmt)}
                className={`px-2 py-1 rounded transition-colors ${
                  formatFilter === fmt
                    ? 'bg-paper-canvas text-brand-indigo font-bold shadow-2xs'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {fmt === 'ALL' ? 'All' : fmt === 'FEED_POST' ? 'Feed' : fmt === 'STORY' ? 'Story' : 'Reel'}
              </button>
            ))}
          </div>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="px-2 py-1 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-[11px] text-ink-primary focus:outline-hidden focus:border-brand-indigo"
          >
            <option value="ALL">All Channels</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="YOUTUBE">YouTube</option>
            <option value="TIKTOK">TikTok</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2 py-1 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-[11px] text-ink-primary focus:outline-hidden focus:border-brand-indigo"
          >
            <option value="ALL">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published Live</option>
          </select>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      {viewMode === 'MONTH' && (
        <div className="bg-paper-raised border border-border-rule rounded-card overflow-hidden shadow-xs">
          {/* Weekday Table Header */}
          <div className="grid grid-cols-7 border-b border-border-rule bg-paper-subtle font-mono text-[11px] text-ink-secondary uppercase text-center py-2.5">
            <span>Monday</span>
            <span>Tuesday</span>
            <span>Wednesday</span>
            <span>Thursday</span>
            <span>Friday</span>
            <span>Saturday</span>
            <span>Sunday</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-border-rule">
            {leadingBlanks.map((b) => (
              <div key={`blank-${b}`} className="min-h-[140px] bg-paper-canvas/30 p-2 text-ink-muted/40 font-mono text-[10px]" />
            ))}

            {daysInMonth.map((day) => {
              const dayEvents = filteredEvents.filter((e) => e.dayOfMonth === day);
              const isToday = day === 24;
              const hasPeakTime = showAiPeakTimes && (day === 24 || day === 25 || day === 27);

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-[145px] p-2 transition-all group relative flex flex-col justify-between ${
                    isToday ? 'bg-brand-indigo/5' : 'hover:bg-paper-subtle/30'
                  }`}
                >
                  <div>
                    {/* Date Cell Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-serif text-sm font-semibold transition-all ${
                            isToday
                              ? 'w-6 h-6 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs shadow-xs font-bold'
                              : 'text-ink-primary'
                          }`}
                        >
                          {day}
                        </span>
                        {isToday && (
                          <span className="font-mono text-[9px] uppercase font-bold text-brand-indigo tracking-tight">
                            TODAY
                          </span>
                        )}
                        {hasPeakTime && (
                          <span
                            title="AI High Engagement Window Detected"
                            className="flex items-center text-[9px] font-mono font-bold text-accent-terracotta"
                          >
                            <Flame className="w-3 h-3 fill-accent-terracotta" />
                          </span>
                        )}
                      </div>

                      {/* Quick Add Button on Hover */}
                      <div className="flex items-center gap-1">
                        {dayEvents.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDayModal({
                                day,
                                dateStr: `2026-10-${String(day).padStart(2, '0')}`,
                                events: dayEvents,
                              });
                            }}
                            title={`คลิกเพื่อดูรายการโพสต์ทั้ง ${dayEvents.length} รายการของวันที่ ${day}`}
                            className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-paper-subtle hover:bg-brand-indigo hover:text-white border border-border-rule text-ink-secondary transition-colors cursor-pointer"
                          >
                            {dayEvents.length}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setQuickScheduleModal({
                              isOpen: true,
                              day,
                              timeStr: '09:00 AM',
                              workspace: selectedWorkspace === 'ALL' ? 'CAPITAL_ONE' : selectedWorkspace,
                            });
                          }}
                          title={`Schedule post on Oct ${day}`}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded bg-brand-indigo text-white hover:bg-brand-indigo-hover transition-opacity cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Events List for this Day with inline expansion & more button */}
                    {(() => {
                      const isExpanded = expandedDays[day] ?? false;
                      const displayedEvents = isExpanded ? dayEvents : dayEvents.slice(0, 3);

                      return (
                        <div className="space-y-1.5">
                          {displayedEvents.map((ev) => {
                            const plat = getPlatformBadge(ev.platform);
                            const fmt = getFormatBadge(ev.format);
                            const isLive = ev.status === 'PUBLISHED';

                            return (
                              <div
                                key={ev.id}
                                onClick={() => handleOpenEventInspector(ev)}
                                className="p-1.5 rounded-editorial bg-paper-canvas border border-border-rule hover:border-brand-indigo hover:shadow-xs cursor-pointer transition-all text-[10px] group/card relative"
                              >
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-mono font-bold text-ink-secondary flex items-center gap-1.5">
                                    <SocialPlatformIcon platform={ev.platform} format={ev.format} size={13} />
                                    <span>{ev.timeStr}</span>
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className={`px-1 py-0.2 rounded text-[8px] font-mono font-bold uppercase ${fmt.color}`}>
                                      {fmt.label}
                                    </span>
                                    {isLive && (
                                      <span className="flex items-center gap-0.5 text-[8px] font-mono font-bold text-semantic-success">
                                        <span className="w-1 h-1 rounded-full bg-semantic-success animate-ping" />
                                        <span>LIVE</span>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p className="font-serif font-medium text-ink-primary line-clamp-1 leading-snug group-hover/card:text-brand-indigo">
                                  {ev.title}
                                </p>

                                <div className="flex items-center justify-between text-[8px] font-mono text-ink-secondary mt-0.5">
                                  <span className="truncate max-w-[85px]">{WORKSPACE_CONFIG[ev.workspace]?.icon} {ev.handle}</span>
                                  {ev.storyLinkUrl && (
                                    <span className="text-accent-terracotta flex items-center gap-0.5" title="Story Link Sticker Attached">
                                      <Link2 className="w-2.5 h-2.5" />
                                    </span>
                                  )}
                                  {ev.liveUrl && (
                                    <span className="text-brand-indigo font-bold flex items-center gap-0.5">
                                      <span>View</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {dayEvents.length > 3 && (
                            <div className="flex items-center gap-1 pt-0.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
                                }}
                                className="flex-1 text-center py-1 px-1 rounded bg-brand-indigo/5 hover:bg-brand-indigo/15 text-[9px] font-mono text-brand-indigo font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                title={isExpanded ? 'ย่อรายการโพสต์ลง' : `กางดูโพสต์ทั้งหมดอีก ${dayEvents.length - 3} รายการ`}
                              >
                                {isExpanded ? (
                                  <span>▴ ย่อลง</span>
                                ) : (
                                  <span>+ {dayEvents.length - 3} more</span>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDayModal({
                                    day,
                                    dateStr: `2026-10-${String(day).padStart(2, '0')}`,
                                    events: dayEvents,
                                  });
                                }}
                                title="เปิดดูรายการสรุปทั้งหมดของวันนี้ในหน้าต่างแยก"
                                className="p-1 rounded bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-secondary hover:text-brand-indigo text-[9px] font-mono cursor-pointer"
                              >
                                <List className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEKLY TIME-GRID HORIZON VIEW */}
      {viewMode === 'WEEK' && (
        <div className="bg-paper-raised border border-border-rule rounded-card overflow-hidden shadow-xs">
          <div className="p-3 bg-paper-subtle border-b border-border-rule flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-ink-primary">Week of October 19 – October 25, 2026</span>
              <span className="px-2 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-mono text-[10px] font-bold">
                7 Days Timeline
              </span>
            </div>
            <div className="text-[11px] font-mono text-ink-secondary">
              Click any hour slot to schedule at that time
            </div>
          </div>

          <div className="grid grid-cols-8 divide-x divide-border-rule min-w-[800px] overflow-x-auto">
            {/* Time Slot column */}
            <div className="divide-y divide-border-rule font-mono text-[10px] text-ink-muted bg-paper-subtle/50 text-center">
              <div className="h-10 flex items-center justify-center font-bold text-ink-secondary">Time (UTC+7)</div>
              {['08:00 AM', '10:00 AM', '12:00 PM', '14:00 PM', '16:00 PM', '18:00 PM', '20:00 PM'].map((t) => (
                <div key={t} className="h-28 flex items-center justify-center p-1">
                  <span>{t}</span>
                </div>
              ))}
            </div>

            {/* 7 Days: Mon 19 to Sun 25 */}
            {[
              { day: 19, name: 'Mon 19' },
              { day: 20, name: 'Tue 20' },
              { day: 21, name: 'Wed 21' },
              { day: 22, name: 'Thu 22' },
              { day: 23, name: 'Fri 23' },
              { day: 24, name: 'Sat 24 (Today)', isToday: true },
              { day: 25, name: 'Sun 25' },
            ].map((col) => {
              const dayEvents = filteredEvents.filter((e) => e.dayOfMonth === col.day);

              return (
                <div key={col.day} className={`divide-y divide-border-rule ${col.isToday ? 'bg-brand-indigo/5' : ''}`}>
                  {/* Column Header */}
                  <div
                    className={`h-10 px-2 flex items-center justify-between font-mono text-[11px] ${
                      col.isToday ? 'bg-brand-indigo text-white font-bold' : 'bg-paper-subtle text-ink-primary'
                    }`}
                  >
                    <span>{col.name}</span>
                    {dayEvents.length > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${col.isToday ? 'bg-white text-brand-indigo' : 'bg-paper-raised text-ink-secondary border border-border-rule'}`}>
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Hourly buckets */}
                  {[8, 10, 12, 14, 16, 18, 20].map((hourSlot) => {
                    const slotEvents = dayEvents.filter((e) => e.hour >= hourSlot && e.hour < hourSlot + 2);
                    const isPeak = showAiPeakTimes && (hourSlot === 8 || hourSlot === 12 || hourSlot === 18);

                    return (
                      <div
                        key={hourSlot}
                        onClick={() => {
                          if (slotEvents.length === 0) {
                            setQuickScheduleModal({
                              isOpen: true,
                              day: col.day,
                              timeStr: `${String(hourSlot).padStart(2, '0')}:00 ${hourSlot < 12 ? 'AM' : 'PM'}`,
                              workspace: selectedWorkspace === 'ALL' ? 'CAPITAL_ONE' : selectedWorkspace,
                            });
                          }
                        }}
                        className={`h-28 p-1.5 transition-colors relative group/slot cursor-pointer flex flex-col gap-1 overflow-y-auto ${
                          slotEvents.length === 0 ? 'hover:bg-brand-indigo/10' : ''
                        }`}
                      >
                        {isPeak && slotEvents.length === 0 && (
                          <div className="absolute top-1 right-1 opacity-25 group-hover/slot:opacity-80">
                            <Flame className="w-3 h-3 text-accent-terracotta" />
                          </div>
                        )}

                        {slotEvents.length === 0 && (
                          <div className="h-full flex items-center justify-center opacity-0 group-hover/slot:opacity-100 font-mono text-[9px] text-brand-indigo">
                            + Quick Slot
                          </div>
                        )}

                        {slotEvents.map((ev) => {
                          const plat = getPlatformBadge(ev.platform);
                          const fmt = getFormatBadge(ev.format);

                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEventInspector(ev);
                              }}
                              className="p-1 rounded bg-paper-canvas border border-border-rule hover:border-brand-indigo text-[9px] shadow-2xs cursor-pointer group/card"
                            >
                              <div className="flex items-center justify-between font-mono">
                                <span className="font-bold text-ink-primary flex items-center gap-1.5">
                                  <SocialPlatformIcon platform={ev.platform} format={ev.format} size={12} />
                                  <span>{ev.timeStr}</span>
                                </span>
                                <span className={`px-1 py-0.2 rounded text-[7px] font-bold ${fmt.color}`}>
                                  {fmt.label}
                                </span>
                              </div>
                              <p className="font-serif font-medium text-ink-primary line-clamp-1 mt-0.5">
                                {ev.title}
                              </p>
                              <div className="flex items-center justify-between text-[8px] font-mono text-ink-secondary mt-0.5">
                                <span>{WORKSPACE_CONFIG[ev.workspace]?.icon}</span>
                                {ev.status === 'PUBLISHED' ? (
                                  <span className="text-semantic-success font-bold">LIVE ↗</span>
                                ) : (
                                  <span>{ev.aiForecast?.peakMatchScore ? `🔥 ${ev.aiForecast.peakMatchScore}%` : 'Queued'}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AGENDA / CADENCE LEDGER VIEW */}
      {viewMode === 'AGENDA' && (
        <div className="space-y-4">
          <div className="p-3 bg-paper-raised border border-border-rule rounded-card flex items-center justify-between text-xs">
            <span className="font-mono text-ink-secondary">
              Showing <strong className="text-ink-primary">{filteredEvents.length}</strong> dispatches across {selectedWorkspace === 'ALL' ? 'all workspaces' : WORKSPACE_CONFIG[selectedWorkspace].name}
            </span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-semantic-success">● {publishedCount} Published</span>
              <span className="text-ink-secondary">•</span>
              <span className="text-brand-indigo">⏳ {scheduledCount} Scheduled</span>
            </div>
          </div>

          <div className="space-y-3">
            {filteredEvents.map((ev) => {
              const plat = getPlatformBadge(ev.platform);
              const fmt = getFormatBadge(ev.format);
              const ws = WORKSPACE_CONFIG[ev.workspace];
              const isLive = ev.status === 'PUBLISHED';

              return (
                <div
                  key={ev.id}
                  onClick={() => handleOpenEventInspector(ev)}
                  className="p-4 bg-paper-raised border border-border-rule rounded-card hover:border-brand-indigo transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                >
                  {/* Left: Thumbnail & Timing */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-editorial bg-paper-subtle border border-border-rule overflow-hidden relative shrink-0 flex items-center justify-center">
                      {ev.previewImage ? (
                        <img src={ev.previewImage} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <CalendarIcon className="w-6 h-6 text-ink-muted" />
                      )}
                      <span className={`absolute bottom-1 right-1 px-1 py-0.2 rounded text-[7px] font-mono font-bold ${fmt.color}`}>
                        {fmt.label}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="font-bold text-ink-primary flex items-center gap-1.5">
                          <SocialPlatformIcon platform={ev.platform} format={ev.format} size={15} />
                          <span>{ev.dateStr} @ {ev.timeStr}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${ws.color}`}>
                          {ws.icon} {ws.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-border-rule bg-paper-canvas flex items-center gap-1">
                          <SocialPlatformIcon platform={ev.platform} format={ev.format} size={14} />
                          <span>{plat.name}</span>
                        </span>
                        {ev.isPeakHour && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3 fill-amber-600 text-amber-600" />
                            <span>{ev.peakLabel || 'Peak Window'}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-base text-ink-primary group-hover:text-brand-indigo transition-colors">
                        {ev.title}
                      </h4>

                      <p className="text-xs text-ink-secondary line-clamp-2 max-w-2xl font-sans">
                        {ev.caption}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-ink-muted pt-1">
                        <span>Handle: {ev.handle}</span>
                        <span>•</span>
                        <span>Spec: {ev.durationOrPhotos}</span>
                        {ev.storyLinkUrl && (
                          <>
                            <span>•</span>
                            <span className="text-accent-terracotta flex items-center gap-1">
                              <Link2 className="w-3 h-3" />
                              <span>Sticker: {ev.storyLinkText || ev.storyLinkUrl}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Metrics / Prediction & Action Links */}
                  <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border-rule">
                    {isLive && ev.metrics ? (
                      <div className="text-right font-mono text-xs">
                        <div className="text-semantic-success font-bold flex items-center gap-1 justify-end">
                          <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-ping" />
                          <span>LIVE TELEMETRY</span>
                        </div>
                        <div className="text-ink-primary font-bold text-sm">
                          {ev.metrics.views.toLocaleString()} views
                        </div>
                        <div className="text-[10px] text-ink-secondary">
                          {ev.metrics.likes} likes • {ev.metrics.shares} shares • {ev.metrics.engagementRate} CTR
                        </div>
                      </div>
                    ) : (
                      <div className="text-right font-mono text-xs">
                        <div className="text-brand-indigo font-bold flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          <span>SCHEDULED</span>
                        </div>
                        <div className="text-ink-primary font-bold">
                          {ev.aiForecast?.predictedReach || '15K - 25K'} Reach
                        </div>
                        <div className="text-[10px] text-accent-terracotta font-bold">
                          🔥 {ev.aiForecast?.peakMatchScore || 95}% Peak Match
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {ev.liveUrl ? (
                        <a
                          href={ev.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Open live post on social web"
                          className="px-3 py-1.5 bg-paper-canvas border border-border-rule hover:border-brand-indigo text-brand-indigo rounded-editorial text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <span>Live ↗</span>
                        </a>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEventInspector(ev);
                          }}
                          className="px-3 py-1.5 bg-paper-canvas border border-border-rule hover:border-brand-indigo text-ink-primary rounded-editorial text-xs font-mono flex items-center gap-1.5 transition-colors"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3 text-ink-muted" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SLIDE-OVER EVENT INSPECTOR & RESCHEDULER DRAWER */}
      {selectedEvent && (
        <div 
          onClick={() => setSelectedEvent(null)}
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-paper-canvas border-l border-border-rule h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 cursor-default"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-border-rule bg-paper-raised flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${WORKSPACE_CONFIG[selectedEvent.workspace].color}`}>
                    {WORKSPACE_CONFIG[selectedEvent.workspace].icon} {WORKSPACE_CONFIG[selectedEvent.workspace].name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-border-rule bg-paper-canvas flex items-center gap-1.5 shadow-2xs">
                    <SocialPlatformIcon platform={selectedEvent.platform} format={selectedEvent.format} size={15} />
                    <span>{getPlatformBadge(selectedEvent.platform).name}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${getFormatBadge(selectedEvent.format).color}`}>
                    {getFormatBadge(selectedEvent.format).label}
                  </span>
                  {selectedEvent.status === 'PUBLISHED' ? (
                    <span className="px-2 py-0.5 rounded bg-semantic-success/15 text-semantic-success text-[10px] font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-ping" />
                      <span>LIVE ON WEB</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-brand-indigo/15 text-brand-indigo text-[10px] font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>SCHEDULED</span>
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl font-bold text-ink-primary leading-tight">
                  {selectedEvent.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-ink-muted border border-border-rule px-1.5 py-0.5 rounded hidden sm:inline-block">
                  ESC
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 rounded-editorial border border-border-rule hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
                  title="ปิดหน้าต่าง (ESC หรือคลิกพื้นที่ด้านนอก)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Preview Mode Switcher */}
              <div className="flex items-center justify-between border-b border-border-rule pb-3">
                <div className="font-mono text-xs font-bold text-ink-secondary uppercase tracking-wider">
                  Post Visual & Technical Spec
                </div>
                <div className="flex items-center gap-1 bg-paper-subtle border border-border-rule rounded-editorial p-0.5 font-mono text-[11px]">
                  <button
                    onClick={() => setPreviewDeviceMode('MOBILE')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                      previewDeviceMode === 'MOBILE'
                        ? 'bg-paper-canvas text-brand-indigo font-bold shadow-2xs'
                        : 'text-ink-secondary'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Phone Mockup</span>
                  </button>
                  <button
                    onClick={() => setPreviewDeviceMode('DATA')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                      previewDeviceMode === 'DATA'
                        ? 'bg-paper-canvas text-brand-indigo font-bold shadow-2xs'
                        : 'text-ink-secondary'
                    }`}
                  >
                    <BarChart3 className="w-3 h-3" />
                    <span>Telemetry & Spec</span>
                  </button>
                </div>
              </div>

              {/* Mobile Mockup Preview */}
              {previewDeviceMode === 'MOBILE' ? (
                <div className="flex justify-center py-2">
                  <div className="w-[300px] rounded-[32px] border-4 border-ink-primary/80 bg-black p-2.5 shadow-xl text-white font-sans relative overflow-hidden">
                    {/* Phone Notch */}
                    <div className="w-24 h-4 bg-ink-primary/90 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-ink-muted/30" />
                    </div>

                    {/* Phone Header */}
                    <div className="flex items-center justify-between px-2 mb-2 text-[10px] text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-indigo to-accent-terracotta flex items-center justify-center text-[9px] font-bold">
                          {selectedEvent.handle.charAt(1) || 'R'}
                        </div>
                        <span className="font-semibold text-white truncate max-w-[120px]">{selectedEvent.handle}</span>
                      </div>
                      <span className="text-[9px] text-gray-400">{selectedEvent.timeStr}</span>
                    </div>

                    {/* Post Format Canvas */}
                    {selectedEvent.format === 'STORY' ? (
                      /* 9:16 Vertical Story Mockup with Link Sticker */
                      <div className="w-full aspect-[9/16] rounded-2xl bg-gradient-to-b from-gray-900 via-neutral-900 to-black relative flex flex-col justify-between p-3 overflow-hidden border border-white/10">
                        {selectedEvent.previewImage && (
                          <img
                            src={selectedEvent.previewImage}
                            alt="Story Preview"
                            className="absolute inset-0 w-full h-full object-cover opacity-65"
                          />
                        )}
                        <div className="relative z-10 space-y-1">
                          <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-white" />
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-mono text-white">
                            24h Ephemeral Story
                          </span>
                        </div>

                        {/* Interactive Link Sticker */}
                        {selectedEvent.storyLinkUrl && (
                          <div className="relative z-10 self-center my-auto animate-bounce duration-1000">
                            <a
                              href={selectedEvent.storyLinkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 rounded-full bg-white text-ink-primary font-bold text-xs shadow-lg flex items-center gap-1.5 border border-white/50 hover:scale-105 transition-transform"
                            >
                              <Link2 className="w-3.5 h-3.5 text-accent-terracotta" />
                              <span className="truncate max-w-[160px]">
                                {selectedEvent.storyLinkText || 'Visit Destination Link'}
                              </span>
                            </a>
                          </div>
                        )}

                        <div className="relative z-10 bg-black/70 backdrop-blur-md p-2 rounded-xl text-[10px] text-gray-200">
                          <p className="line-clamp-2">{selectedEvent.caption}</p>
                        </div>
                      </div>
                    ) : (
                      /* Feed Post / Reel Mockup */
                      <div className="space-y-2">
                        <div className="w-full aspect-square rounded-xl bg-neutral-900 overflow-hidden relative border border-white/10">
                          {selectedEvent.previewImage ? (
                            <img
                              src={selectedEvent.previewImage}
                              alt="Feed Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-mono text-xs">
                              Media Asset Canvas
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 font-mono text-[9px]">
                            {selectedEvent.durationOrPhotos}
                          </div>
                        </div>

                        <div className="px-1 text-[10px] space-y-1">
                          <p className="text-gray-200 line-clamp-3">
                            <strong className="text-white mr-1">{selectedEvent.handle}</strong>
                            {selectedEvent.caption}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Data & Telemetry Spec */
                <div className="space-y-4 font-mono text-xs">
                  {selectedEvent.status === 'PUBLISHED' && selectedEvent.metrics ? (
                    <div className="p-4 bg-paper-raised border border-semantic-success/30 rounded-card space-y-3">
                      <div className="flex items-center justify-between text-semantic-success font-bold text-[11px]">
                        <span>REAL-TIME AUDIENCE TELEMETRY</span>
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-ink-primary">
                        <div className="p-2 rounded bg-paper-canvas border border-border-rule">
                          <span className="text-[10px] text-ink-secondary block">Impressions / Views</span>
                          <span className="text-base font-bold">{selectedEvent.metrics.views.toLocaleString()}</span>
                        </div>
                        <div className="p-2 rounded bg-paper-canvas border border-border-rule">
                          <span className="text-[10px] text-ink-secondary block">Likes / Reactions</span>
                          <span className="text-base font-bold">{selectedEvent.metrics.likes.toLocaleString()}</span>
                        </div>
                        <div className="p-2 rounded bg-paper-canvas border border-border-rule">
                          <span className="text-[10px] text-ink-secondary block">Comments / Replies</span>
                          <span className="text-base font-bold">{selectedEvent.metrics.comments}</span>
                        </div>
                        <div className="p-2 rounded bg-paper-canvas border border-border-rule">
                          <span className="text-[10px] text-ink-secondary block">Shares / Reposts</span>
                          <span className="text-base font-bold">{selectedEvent.metrics.shares}</span>
                        </div>
                      </div>
                      {selectedEvent.metrics.clicks && (
                        <div className="p-2 rounded bg-semantic-success/10 border border-semantic-success/20 flex items-center justify-between text-semantic-success font-bold text-[11px]">
                          <span>Link Sticker Clicks:</span>
                          <span>{selectedEvent.metrics.clicks} Clicks ({selectedEvent.metrics.engagementRate} CTR)</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-paper-raised border border-border-rule rounded-card space-y-3">
                      <div className="flex items-center justify-between text-brand-indigo font-bold text-[11px]">
                        <span>AI PREDICTIVE CADENCE AUDIT</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded bg-paper-canvas border border-border-rule">
                          <span className="text-ink-secondary">Predicted Impressions:</span>
                          <span className="font-bold text-ink-primary">{selectedEvent.aiForecast?.predictedReach || '20K - 35K'}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-paper-canvas border border-border-rule">
                          <span className="text-ink-secondary">Peak Hour Window Match:</span>
                          <span className="font-bold text-accent-terracotta">🔥 {selectedEvent.aiForecast?.peakMatchScore || 95}% Match</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-paper-canvas border border-border-rule">
                          <span className="text-ink-secondary">Cross-Format Synergy:</span>
                          <span className="font-bold text-brand-indigo">{selectedEvent.aiForecast?.synergyScore || 'Standard Syndication'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Direct Live Links Directory */}
                  <div className="p-4 bg-paper-raised border border-border-rule rounded-card space-y-2">
                    <span className="font-bold text-ink-primary text-[11px] block">LIVE WEB DESTINATIONS & URLS</span>
                    {selectedEvent.liveUrl ? (
                      <a
                        href={selectedEvent.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded bg-paper-canvas border border-brand-indigo/40 hover:border-brand-indigo text-brand-indigo font-bold flex items-center justify-between transition-colors shadow-2xs"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <SocialPlatformIcon platform={selectedEvent.platform} format={selectedEvent.format} size={18} />
                          <span className="truncate">{selectedEvent.liveUrl}</span>
                        </span>
                        <span className="text-[10px] shrink-0 font-mono">Open Live ↗</span>
                      </a>
                    ) : (
                      <div className="text-[11px] text-ink-muted italic">
                        Post is scheduled. Live URL will be provisioned by provider adapter upon release.
                      </div>
                    )}

                    {selectedEvent.websiteUrl && (
                      <a
                        href={selectedEvent.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded bg-paper-canvas border border-emerald-300 hover:border-emerald-500 text-emerald-900 font-bold flex items-center justify-between transition-colors shadow-2xs"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <WebsiteLogo size={18} />
                          <span className="truncate">{selectedEvent.websiteUrl}</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 shrink-0 font-mono">Landing Page ↗</span>
                      </a>
                    )}

                    {selectedEvent.storyLinkUrl && (
                      <a
                        href={selectedEvent.storyLinkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded bg-paper-canvas border border-accent-terracotta/40 hover:border-accent-terracotta text-accent-terracotta font-bold flex items-center justify-between transition-colors shadow-2xs"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <InstagramStoryLogo size={18} />
                          <span className="truncate">Sticker: {selectedEvent.storyLinkUrl}</span>
                        </span>
                        <span className="text-[10px] shrink-0">Test Sticker ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Caption Box & Copy Action */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ink-secondary">POST CAPTION & HASHTAGS</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedEvent.caption);
                      showToast('✓ คัดลอกแคปชันลงในคลิปบอร์ดแล้ว!');
                    }}
                    className="flex items-center gap-1 font-mono text-[11px] text-brand-indigo hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Caption</span>
                  </button>
                </div>
                <div className="p-3 bg-paper-raised border border-border-rule rounded-editorial text-xs font-sans text-ink-primary leading-relaxed whitespace-pre-wrap">
                  {selectedEvent.caption}
                </div>
              </div>

              {/* Interactive Rescheduler Form */}
              <div className="p-4 bg-paper-subtle border border-border-rule rounded-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ink-primary flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-indigo" />
                    <span>Reschedule Dispatch Date & Time</span>
                  </span>
                  <span className="font-mono text-[10px] text-ink-secondary">Timezone: Asia/Bangkok</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-ink-secondary mb-1">Date</label>
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary focus:outline-hidden focus:border-brand-indigo"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-ink-secondary mb-1">Time</label>
                    <input
                      type="text"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      placeholder="e.g. 09:30 AM"
                      className="w-full px-2.5 py-1.5 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary focus:outline-hidden focus:border-brand-indigo"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveReschedule}
                  className="w-full py-2 bg-brand-indigo text-white font-mono text-xs font-semibold rounded-editorial hover:bg-brand-indigo-hover transition-colors shadow-2xs"
                >
                  Save Schedule Change
                </button>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-border-rule bg-paper-raised flex items-center justify-between">
              <Link
                href={`/create?id=${selectedEvent.id}`}
                className="px-4 py-2 bg-paper-canvas border border-border-rule hover:border-brand-indigo text-ink-primary text-xs font-semibold rounded-editorial transition-colors flex items-center gap-1.5"
              >
                <span>Edit in Studio Desk</span>
                <ArrowRight className="w-3.5 h-3.5 text-ink-secondary" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast(`✓ ทำซ้ำโพสต์ "${selectedEvent.title}" เรียบร้อยแล้ว`);
                    setSelectedEvent(null);
                  }}
                  className="px-3 py-2 bg-paper-subtle border border-border-rule hover:bg-paper-canvas text-ink-secondary hover:text-ink-primary text-xs font-mono rounded-editorial transition-colors"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    const filtered = events.filter((e) => e.id !== selectedEvent.id);
                    setEvents(filtered);
                    setSelectedEvent(null);
                    showToast(`✓ ลบโพสต์ออกจากปฏิทินแล้ว`);
                  }}
                  className="px-3 py-2 text-semantic-error hover:bg-semantic-error/10 text-xs font-mono rounded-editorial transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DAY DISPATCHES OVERVIEW MODAL (เมื่อกดปุ่ม +more หรือตัวเลขวัน) */}
      {dayModal && (
        <div 
          onClick={() => setDayModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-paper-canvas border border-border-rule rounded-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col cursor-default"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-border-rule bg-paper-raised flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-ink-primary">
                      October {dayModal.day}, 2026 Dispatches
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono text-[11px] font-bold">
                      {dayModal.events.length} Posts
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-ink-secondary">
                    กำหนดการและประวัติการเผยแพร่ประจำวัน
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const dayToSchedule = dayModal.day;
                    setDayModal(null);
                    setQuickScheduleModal({
                      isOpen: true,
                      day: dayToSchedule,
                      timeStr: '09:00 AM',
                      workspace: selectedWorkspace === 'ALL' ? 'CAPITAL_ONE' : selectedWorkspace,
                    });
                  }}
                  className="px-2.5 py-1.5 rounded-editorial bg-brand-indigo/10 hover:bg-brand-indigo/20 text-brand-indigo font-mono text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Post</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDayModal(null)}
                  className="p-1.5 rounded-editorial border border-border-rule hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
                  title="ปิดหน้าต่าง (ESC หรือคลิกพื้นที่ด้านนอก)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: List of all events on this day */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1 divide-y divide-border-rule/60">
              {dayModal.events.map((ev) => {
                const plat = getPlatformBadge(ev.platform);
                const fmt = getFormatBadge(ev.format);
                const isLive = ev.status === 'PUBLISHED';

                return (
                  <div 
                    key={ev.id} 
                    className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group/item hover:bg-paper-subtle/50 p-2 rounded-editorial transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Thumbnail or platform avatar */}
                      <div className="w-14 h-14 rounded-editorial bg-neutral-900 border border-border-rule overflow-hidden shrink-0 relative">
                        {ev.previewImage ? (
                          <img
                            src={ev.previewImage}
                            alt={ev.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-paper-subtle text-ink-muted">
                            <SocialPlatformIcon platform={ev.platform} format={ev.format} size={20} />
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/70 rounded p-0.5">
                          <SocialPlatformIcon platform={ev.platform} format={ev.format} size={11} />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="font-mono text-xs font-bold text-ink-primary flex items-center gap-1">
                            <Clock className="w-3 h-3 text-ink-secondary" />
                            <span>{ev.timeStr}</span>
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${fmt.color}`}>
                            {fmt.label}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${WORKSPACE_CONFIG[ev.workspace].color}`}>
                            {WORKSPACE_CONFIG[ev.workspace].icon} {WORKSPACE_CONFIG[ev.workspace].name}
                          </span>
                          {isLive ? (
                            <span className="px-1.5 py-0.2 rounded bg-semantic-success/15 text-semantic-success text-[9px] font-mono font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-ping" />
                              <span>LIVE</span>
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded bg-brand-indigo/15 text-brand-indigo text-[9px] font-mono font-bold">
                              SCHEDULED
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif font-bold text-sm text-ink-primary truncate">
                          {ev.title}
                        </h4>

                        <p className="text-[11px] text-ink-secondary line-clamp-1 mt-0.5 font-sans">
                          {ev.caption}
                        </p>

                        {/* Live links and Sticker hints */}
                        <div className="flex flex-wrap items-center gap-2 mt-1 font-mono text-[10px]">
                          {ev.liveUrl && (
                            <a
                              href={ev.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-brand-indigo font-bold hover:underline flex items-center gap-0.5"
                            >
                              <span>View live on {plat.name}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          {ev.storyLinkUrl && (
                            <span className="text-accent-terracotta flex items-center gap-0.5">
                              <Link2 className="w-2.5 h-2.5" />
                              <span>Sticker: {ev.storyLinkText || 'Attached'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => {
                          setDayModal(null);
                          handleOpenEventInspector(ev);
                        }}
                        className="px-3 py-1.5 rounded-editorial bg-paper-canvas border border-border-rule hover:border-brand-indigo hover:text-brand-indigo font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>Inspect & Edit</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border-rule bg-paper-raised flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-ink-secondary">
                กดปุ่ม <strong>Inspect & Edit</strong> เพื่อเปิดดู Mockup มือถือ หรือเปลี่ยนเวลาเผยแพร่
              </span>
              <button
                type="button"
                onClick={() => setDayModal(null)}
                className="px-4 py-1.5 rounded-editorial border border-border-rule bg-paper-canvas hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary font-mono text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK SCHEDULE MODAL */}
      {quickScheduleModal?.isOpen && (
        <div 
          onClick={() => setQuickScheduleModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-paper-canvas border border-border-rule rounded-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 cursor-default"
          >
            <div className="p-5 border-b border-border-rule bg-paper-raised flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-ink-primary">
                    Quick Dispatch Scheduler
                  </h3>
                  <p className="text-[11px] font-mono text-ink-secondary">
                    Scheduling for: October {quickScheduleModal.day}, 2026 @ {quickScheduleModal.timeStr}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickScheduleModal(null)}
                className="p-1 rounded-editorial border border-border-rule hover:bg-paper-subtle text-ink-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickScheduleSubmit} className="p-5 space-y-4 text-xs">
              {/* Workspace Selector */}
              <div>
                <label className="block font-mono text-[11px] text-ink-secondary mb-1">Target Workspace</label>
                <select
                  value={quickScheduleModal.workspace}
                  onChange={(e) =>
                    setQuickScheduleModal({
                      ...quickScheduleModal,
                      workspace: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary focus:outline-hidden focus:border-brand-indigo"
                >
                  <option value="CAPITAL_ONE">🏢 Capital One Real Estate</option>
                  <option value="ACME_CREATOR">🎙️ Acme Creator Studio</option>
                  <option value="RETZPOST">⚡ RetzPost Software</option>
                  <option value="COFFEE_CRAFT">☕ Coffee Craft BKK</option>
                </select>
              </div>

              {/* Title Input */}
              <div>
                <label className="block font-mono text-[11px] text-ink-secondary mb-1">Working Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Rich Rama 9 Penthouse Walkthrough"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-serif text-sm text-ink-primary placeholder:text-ink-muted focus:outline-hidden focus:border-brand-indigo"
                />
              </div>

              {/* Platform & Format Grid */}
              <div className="space-y-3">
                <div>
                  <label className="block font-mono text-[11px] text-ink-secondary mb-1.5">
                    Channel Platform (เลือกเฉพาะช่องทางที่ต้องการใช้ในโพสต์นี้)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'FACEBOOK', label: 'Facebook' },
                      { id: 'INSTAGRAM', label: 'Instagram' },
                      { id: 'YOUTUBE', label: 'YouTube' },
                      { id: 'TIKTOK', label: 'TikTok' },
                    ].map((p) => {
                      const isSelected = quickPlatform === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setQuickPlatform(p.id as any)}
                          className={`flex items-center gap-2 p-2 rounded-editorial border text-xs font-mono transition-all ${
                            isSelected
                              ? 'bg-paper-canvas border-brand-indigo font-bold text-brand-indigo shadow-xs ring-1 ring-brand-indigo/30'
                              : 'bg-paper-subtle/80 border-border-rule text-ink-secondary hover:text-ink-primary hover:bg-paper-canvas'
                          }`}
                        >
                          <SocialPlatformIcon platform={p.id} size={16} />
                          <span className="truncate">{p.label}</span>
                          {isSelected && <Check className="w-3 h-3 ml-auto text-brand-indigo shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-ink-secondary mb-1">Post Format</label>
                  <select
                    value={quickFormat}
                    onChange={(e) => setQuickFormat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary focus:outline-hidden focus:border-brand-indigo"
                  >
                    <option value="FEED_POST">Feed Post / Photo Album</option>
                    <option value="STORY">24h Ephemeral Story (รองรับ Link Sticker)</option>
                    <option value="VIDEO_REEL">Video Reel / Shorts (9:16)</option>
                  </select>
                </div>
              </div>

              {/* Story Link Sticker (Only if format is Story) */}
              {quickFormat === 'STORY' && (
                <div className="p-3 bg-accent-terracotta/5 border border-accent-terracotta/20 rounded-editorial space-y-1">
                  <label className="block font-mono text-[10px] font-bold text-accent-terracotta flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    <span>Story Interactive Link Sticker Destination URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://capitalone.co.th/the-rich-rama9"
                    value={quickLinkSticker}
                    onChange={(e) => setQuickLinkSticker(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary focus:outline-hidden focus:border-accent-terracotta"
                  />
                  <span className="text-[10px] text-ink-muted font-mono block">
                    Sticker will be placed at coordinates (0.5, 0.7) on Instagram & Facebook Stories.
                  </span>
                </div>
              )}

              {/* Time quick buttons */}
              <div>
                <label className="block font-mono text-[10px] text-ink-secondary mb-1.5">
                  Suggested Peak Time Slots (UTC+7)
                </label>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                  {[
                    { label: '08:30 AM 🔥 Morning', time: '08:30 AM' },
                    { label: '11:45 AM 🔥 Lunch', time: '11:45 AM' },
                    { label: '19:30 PM 🔥 Evening Prime', time: '19:30 PM' },
                  ].map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      onClick={() =>
                        setQuickScheduleModal({
                          ...quickScheduleModal,
                          timeStr: s.time,
                        })
                      }
                      className={`px-2.5 py-1 rounded-editorial border transition-colors ${
                        quickScheduleModal.timeStr === s.time
                          ? 'bg-accent-terracotta text-white border-accent-terracotta font-bold'
                          : 'bg-paper-raised text-ink-secondary border-border-rule hover:text-ink-primary'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit / Cancel */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-rule">
                <button
                  type="button"
                  onClick={() => setQuickScheduleModal(null)}
                  className="px-4 py-2 border border-border-rule rounded-editorial font-mono text-ink-secondary hover:text-ink-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial font-semibold transition-colors shadow-xs"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
