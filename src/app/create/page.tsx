'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Disc
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
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
import { 
  PostTemplate, 
  TemplateCategory,
  CATEGORY_LABELS,
  BUILT_IN_TEMPLATES, 
  getInitialTemplates, 
  createTemplate,
  updateTemplate,
  duplicateTemplate,
  deleteTemplate,
  resetTemplatesToDefault,
  saveCustomTemplate, 
  deleteCustomTemplate 
} from '@/modules/publishing/templates';
import { WorkspaceRole, hasPermission } from '@/modules/workspaces/team-roles';

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
  { id: 'ws_capitalone', name: 'Capital One Real Estate', category: 'Enterprise Portfolio', badgeColor: 'bg-accent-terracotta' },
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

  // 4. Capital One Real Estate Channels (Enterprise Portfolio)
  {
    id: 'c1_fb_th',
    workspaceId: 'ws_capitalone',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'Capital One Thailand',
    handle: 'Capital One Real Estate Thailand',
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
    name: 'Capital One Taiwan',
    handle: 'Capital One Real Estate - Taiwan',
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
    id: 'c1_fb_kw_lux',
    workspaceId: 'ws_capitalone',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'KW Luxury Thailand',
    handle: 'Keller Williams Luxury Thailand',
    badge: 'Luxury FB',
    avatarBg: 'bg-[#1877F2]',
    avatarText: 'FB',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
    },
  },
  {
    id: 'c1_fb_oknus',
    workspaceId: 'ws_capitalone',
    platform: 'FACEBOOK',
    platformGroup: 'Facebook',
    name: 'Oknus Real Estate',
    handle: 'Oknus Real Estate Agency',
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
    name: 'Capital One IG',
    handle: '@capitalonerealestate',
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
    name: 'Thailand Prop C1',
    handle: '@thailandprop.c1',
    badge: 'Property IG',
    avatarBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    avatarText: 'IG',
    capabilities: {
      feed: { supported: true, label: 'Feed' },
      story: { supported: true, label: 'Story' },
      reel: { supported: true, label: 'Reel' },
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
      title: 'Bangkok Luxury Condo Launch',
      description: 'FB Thailand + KW Luxury + capitalonerealestate Feed & Story',
      icon: 'ws-realestate',
      targetPlacements: {
        'c1_fb_th_feed': true,
        'c1_fb_kw_lux_feed': true,
        'c1_ig_main_feed': true,
        'c1_ig_main_story': true,
        'c1_ig_prop_story': true,
      },
    },
    {
      id: 'pre_c1_all_stories',
      workspaceId: 'ws_capitalone',
      title: 'Daily Property 24h Stories',
      description: 'All Capital One IG & FB Stories with Link Sticker',
      icon: 'format-story',
      targetPlacements: {
        'c1_fb_th_story': true,
        'c1_fb_kw_lux_story': true,
        'c1_ig_main_story': true,
        'c1_ig_prop_story': true,
      },
    },
    {
      id: 'pre_c1_all_feeds',
      workspaceId: 'ws_capitalone',
      title: 'Universal C1 Feed Push',
      description: 'Dispatches feed album to all Thai & partner agencies',
      icon: 'herald-trumpet',
      targetPlacements: {
        'c1_fb_th_feed': true,
        'c1_fb_tw_feed': true,
        'c1_fb_kw_lux_feed': true,
        'c1_fb_oknus_feed': true,
        'c1_ig_main_feed': true,
      },
    },
  ],
};

const AI_MEDIA_LIBRARY_ASSETS = [
  {
    id: 'ai-asset-1',
    name: 'the_rich_rama9_living_room_concept.jpg',
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
    name: 'penthouse_marble_dining_suite.jpg',
    size: '3.9 MB',
    category: 'Luxury Suite',
    description: 'Private duplex penthouse dining room with Italian Calacatta marble table, contemporary chandelier, city lights bokeh.',
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

  // Collapsible state per platform group in Column 1 (Destinations Accordion)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

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

  // Auto-Save Draft & Recovery Engine
  const [lastSavedDraftTime, setLastSavedDraftTime] = useState<string | null>(null);
  const [draftRestoredNotice, setDraftRestoredNotice] = useState<boolean>(false);

  // Safe-Zone Guide Overlay for 9:16 Formats
  const [showSafeZone, setShowSafeZone] = useState<boolean>(false);

  // Post Text Templates State (Column 2)
  const [templates, setTemplates] = useState<PostTemplate[]>(() => getInitialTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
  const [isManageTemplatesModalOpen, setIsManageTemplatesModalOpen] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [templateAppliedNotice, setTemplateAppliedNotice] = useState<string | null>(null);
  const [previousContentState, setPreviousContentState] = useState<{
    title: string;
    caption: string;
    tags: string;
    storyLink: string;
  } | null>(null);

  // Template CRUD & Modal View State
  const [templateModalMode, setTemplateModalMode] = useState<'LIST' | 'FORM'>('LIST');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [formTplName, setFormTplName] = useState('');
  const [formTplCategory, setFormTplCategory] = useState<TemplateCategory>('CUSTOM');
  const [formTplTitle, setFormTplTitle] = useState('');
  const [formTplCaption, setFormTplCaption] = useState('');
  const [formTplTags, setFormTplTags] = useState('');
  const [formTplStoryLink, setFormTplStoryLink] = useState('');

  // Search, Filter, Expand & Confirm states in Template Manager
  const [tplSearchQuery, setTplSearchQuery] = useState('');
  const [tplCategoryFilter, setTplCategoryFilter] = useState<'ALL' | string>('ALL');
  const [expandedTplIds, setExpandedTplIds] = useState<Record<string, boolean>>({});
  const [deleteConfirmTplId, setDeleteConfirmTplId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Active Role State (RBAC Permissions)
  const [currentRole, setCurrentRole] = useState<WorkspaceRole>('MANAGER');
  const [submittedForApprovalNotice, setSubmittedForApprovalNotice] = useState<string | null>(null);

  // AI Media Hub Modal State
  const [isAiMediaModalOpen, setIsAiMediaModalOpen] = useState(false);

  const handleApplyTemplate = (tpl: PostTemplate) => {
    setPreviousContentState({
      title: workingTitle,
      caption: sharedCaption,
      tags: sharedTags,
      storyLink: storyLinkUrl,
    });
    setWorkingTitle(tpl.title);
    setSharedCaption(tpl.caption);
    setSharedTags(tpl.tags);
    if (tpl.storyLink) {
      setStoryLinkUrl(tpl.storyLink);
    }
    setSelectedTemplateId(tpl.id);
    setTemplateAppliedNotice(`นำเทมเพลต "${tpl.name}" ไปใช้แล้ว`);
    setTimeout(() => setTemplateAppliedNotice(null), 4000);
  };

  const handleUndoTemplate = () => {
    if (previousContentState) {
      setWorkingTitle(previousContentState.title);
      setSharedCaption(previousContentState.caption);
      setSharedTags(previousContentState.tags);
      setStoryLinkUrl(previousContentState.storyLink);
      setPreviousContentState(null);
      setTemplateAppliedNotice('ย้อนกลับข้อความเดิมเรียบร้อยแล้ว');
      setTimeout(() => setTemplateAppliedNotice(null), 3000);
    }
  };

  const handleSaveCustomTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim()) return;
    const created = saveCustomTemplate({
      name: newTemplateTitle.trim(),
      title: workingTitle,
      caption: sharedCaption,
      tags: sharedTags,
      storyLink: storyLinkUrl,
    });
    setTemplates(getInitialTemplates());
    setIsSaveTemplateModalOpen(false);
    setNewTemplateTitle('');
    setTemplateAppliedNotice(`บันทึกเทมเพลต "${created.name}" เรียบร้อยแล้ว`);
    setTimeout(() => setTemplateAppliedNotice(null), 4000);
  };

  const handleDeleteCustomTemplate = (id: string) => {
    deleteTemplate(id);
    setTemplates(getInitialTemplates());
    if (selectedTemplateId === id) setSelectedTemplateId('');
  };

  // Open Create Form in Modal
  const handleOpenCreateTemplate = (prefillFromEditor = false) => {
    setEditingTemplateId(null);
    if (prefillFromEditor) {
      setFormTplName(workingTitle ? `📝 ${workingTitle.slice(0, 32)}` : 'เทมเพลตจากร่างปัจจุบัน');
      setFormTplCategory('CUSTOM');
      setFormTplTitle(workingTitle);
      setFormTplCaption(sharedCaption);
      setFormTplTags(sharedTags);
      setFormTplStoryLink(storyLinkUrl);
    } else {
      setFormTplName('');
      setFormTplCategory('CUSTOM');
      setFormTplTitle('');
      setFormTplCaption('');
      setFormTplTags('');
      setFormTplStoryLink('');
    }
    setTemplateModalMode('FORM');
  };

  // Open Edit Form in Modal
  const handleOpenEditTemplate = (tpl: PostTemplate) => {
    setEditingTemplateId(tpl.id);
    setFormTplName(tpl.name);
    setFormTplCategory(tpl.category);
    setFormTplTitle(tpl.title);
    setFormTplCaption(tpl.caption);
    setFormTplTags(tpl.tags);
    setFormTplStoryLink(tpl.storyLink || '');
    setTemplateModalMode('FORM');
  };

  // Prefill Form with current editor contents
  const handlePrefillFormFromEditor = () => {
    setFormTplTitle(workingTitle);
    setFormTplCaption(sharedCaption);
    setFormTplTags(sharedTags);
    setFormTplStoryLink(storyLinkUrl);
    if (!formTplName) {
      setFormTplName(workingTitle ? `📝 ${workingTitle.slice(0, 32)}` : 'เทมเพลตจากร่างปัจจุบัน');
    }
    setTemplateAppliedNotice('✓ ดึงข้อความจากหน้าเขียนโพสต์มาใส่ในฟอร์มแล้ว');
    setTimeout(() => setTemplateAppliedNotice(null), 3000);
  };

  // Save (Create or Update) Form submission
  const handleSaveTemplateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTplName.trim()) return;

    if (editingTemplateId) {
      // UPDATE
      const updated = updateTemplate(editingTemplateId, {
        name: formTplName.trim(),
        category: formTplCategory,
        title: formTplTitle.trim(),
        caption: formTplCaption.trim(),
        tags: formTplTags.trim(),
        storyLink: formTplStoryLink.trim() || undefined,
      });
      setTemplates(getInitialTemplates());
      setTemplateModalMode('LIST');
      setEditingTemplateId(null);
      setTemplateAppliedNotice(`✓ อัปเดตเทมเพลต "${formTplName.trim()}" เรียบร้อยแล้ว`);
      setTimeout(() => setTemplateAppliedNotice(null), 4000);
    } else {
      // CREATE
      const created = createTemplate({
        name: formTplName.trim(),
        category: formTplCategory,
        title: formTplTitle.trim(),
        caption: formTplCaption.trim(),
        tags: formTplTags.trim(),
        storyLink: formTplStoryLink.trim() || undefined,
      });
      setTemplates(getInitialTemplates());
      setTemplateModalMode('LIST');
      setTemplateAppliedNotice(`✓ สร้างเทมเพลตใหม่ "${created.name}" เรียบร้อยแล้ว`);
      setTimeout(() => setTemplateAppliedNotice(null), 4000);
    }
  };

  // Duplicate template
  const handleDuplicateTemplate = (id: string) => {
    const cloned = duplicateTemplate(id);
    if (cloned) {
      setTemplates(getInitialTemplates());
      setTemplateAppliedNotice(`✓ คัดลอกเทมเพลต "${cloned.name}" เรียบร้อยแล้ว`);
      setTimeout(() => setTemplateAppliedNotice(null), 4000);
    }
  };

  // Delete template
  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(id);
    setTemplates(getInitialTemplates());
    if (selectedTemplateId === id) setSelectedTemplateId('');
    setDeleteConfirmTplId(null);
    setTemplateAppliedNotice('✓ ลบเทมเพลตออกจากคลังแล้ว');
    setTimeout(() => setTemplateAppliedNotice(null), 4000);
  };

  // Reset all templates to defaults
  const handleResetTemplates = () => {
    const defaults = resetTemplatesToDefault();
    setTemplates(defaults);
    setResetConfirmOpen(false);
    setTemplateAppliedNotice('✓ รีเซ็ตคลังเทมเพลตกลับเป็นค่าเริ่มต้นของระบบแล้ว');
    setTimeout(() => setTemplateAppliedNotice(null), 4000);
  };

  // Filtered Templates for Manager Modal
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchCategory =
        tplCategoryFilter === 'ALL' ||
        (tplCategoryFilter === 'CUSTOM' && (tpl.category === 'CUSTOM' || !tpl.isBuiltIn)) ||
        tpl.category === tplCategoryFilter;

      const q = tplSearchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.title.toLowerCase().includes(q) ||
        tpl.caption.toLowerCase().includes(q) ||
        tpl.tags.toLowerCase().includes(q) ||
        tpl.categoryLabel.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [templates, tplCategoryFilter, tplSearchQuery]);

  // Category counts
  const templateCategoryCounts = useMemo(() => {
    return {
      ALL: templates.length,
      CUSTOM: templates.filter((t) => t.category === 'CUSTOM' || !t.isBuiltIn).length,
      REAL_ESTATE: templates.filter((t) => t.category === 'REAL_ESTATE').length,
      PROMOTION: templates.filter((t) => t.category === 'PROMOTION').length,
      PRODUCT_LAUNCH: templates.filter((t) => t.category === 'PRODUCT_LAUNCH').length,
      INSIGHTS: templates.filter((t) => t.category === 'INSIGHTS').length,
    };
  }, [templates]);

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
  const activeWorkspace = WORKSPACES_DATA.find(w => w.id === activeWorkspaceId) || WORKSPACES_DATA[0];

  // Active Channels Filtered by Workspace
  const workspaceChannels = useMemo(() => {
    return CHANNELS_BY_WORKSPACE.filter(ch => ch.workspaceId === activeWorkspaceId);
  }, [activeWorkspaceId]);

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
        capabilities: { feed: { supported: true, label: 'Community' }, story: { supported: false, label: '—' }, reel: { supported: true, label: 'Shorts' } },
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

  // Available format sub-pills adapted dynamically per platform
  const platformFormats = useMemo(() => {
    const map: Record<'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK', { id: 'FEED' | 'STORY' | 'REEL'; label: string; icon: React.ComponentType<{ className?: string }> }[]> = {
      INSTAGRAM: [
        { id: 'FEED', label: 'Feed Post', icon: LayoutGrid },
        { id: 'STORY', label: 'Story (24h)', icon: Smartphone },
        { id: 'REEL', label: 'Reels (9:16)', icon: Film },
      ],
      FACEBOOK: [
        { id: 'FEED', label: 'Page Post', icon: LayoutGrid },
        { id: 'STORY', label: 'Story (24h)', icon: Smartphone },
        { id: 'REEL', label: 'Reels (9:16)', icon: Film },
      ],
      YOUTUBE: [
        { id: 'REEL', label: 'Shorts (9:16)', icon: Film },
        { id: 'FEED', label: 'Video Feed', icon: LayoutGrid },
      ],
      TIKTOK: [
        { id: 'REEL', label: 'Video (9:16)', icon: Film },
        { id: 'FEED', label: 'Photo Slide', icon: LayoutGrid },
        { id: 'STORY', label: 'Story', icon: Smartphone },
      ],
    };
    return map[previewPlatform];
  }, [previewPlatform]);

  const handleSelectPreviewPlatform = (plat: 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK') => {
    setPreviewPlatform(plat);
    const validFormats = {
      INSTAGRAM: ['FEED', 'STORY', 'REEL'],
      FACEBOOK: ['FEED', 'STORY', 'REEL'],
      YOUTUBE: ['REEL', 'FEED'],
      TIKTOK: ['REEL', 'FEED', 'STORY'],
    }[plat];
    if (!validFormats.includes(previewTab)) {
      setPreviewTab(validFormats[0] as 'FEED' | 'STORY' | 'REEL');
    }
  };

  // Active Custom Presets for this Workspace
  const activePresets = customPresetsMap[activeWorkspaceId] || [];

  // Listen to Global Workspace changes from AppShell Sidebar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('retzpost_active_workspace_id');
      if (saved && WORKSPACES_DATA.some(w => w.id === saved)) {
        handleSwitchWorkspace(saved, false);
      }
      const handleWorkspaceSync = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        if (customEvent.detail && WORKSPACES_DATA.some(w => w.id === customEvent.detail)) {
          handleSwitchWorkspace(customEvent.detail, false);
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
      localStorage.setItem('retzpost_active_workspace_id', workspaceId);
      window.dispatchEvent(new CustomEvent('retzpost:workspace-change', { detail: workspaceId }));
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
    }
    setWorkingTitle('Omni-Format Publishing: Simultaneous Feed, Story & Reels');
    setSharedCaption('Architecture over aesthetics. In this issue we break down our modular publishing pipeline designed for simultaneous Feed Posts, 24h Stories, and Reels/Shorts.\n\nSwipe to explore the full stack diagrams.');
    setStoryLinkUrl('https://retzpost.com/announcement');
    setSharedTags('architecture, publishing, tech, design-system');
    setLastSavedDraftTime(null);
    setDraftRestoredNotice(false);
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
          ⚠️ Profile & Status Bar (15%)
        </span>
      </div>
      {/* Bottom Safe Margin (25%) */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-semantic-warning/15 border-t border-dashed border-semantic-warning/70 flex items-center justify-center">
        <span className="text-[7px] font-mono text-semantic-warning font-bold bg-black/85 px-1.5 py-0.5 rounded shadow">
          ⚠️ Caption & Sound Marquee (25%)
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
        folio="STUDIO DESK / 3-COLUMN WORKBENCH"
        editionDate="MULTI-PROJECT & PRESETS READY"
        title="Universal Content Studio"
        subtitle="Publish seamlessly across multiple projects. 1-click presets adapt instantly to your project's channels."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Identity & Role Tester */}
            <div className="flex items-center gap-2 px-2.5 py-1 bg-paper-raised border border-border-rule rounded-editorial text-xs shadow-2xs">
              <div className="w-5 h-5 rounded-full bg-brand-indigo/15 text-brand-indigo flex items-center justify-center font-bold text-[9px] shrink-0 border border-brand-indigo/30">
                NC
              </div>
              <span className="text-ink-secondary text-[11px] font-sans">
                บทบาท:
              </span>

              <CustomDropdown
                options={[
                  { 
                    value: 'OWNER', 
                    label: 'Owner (เจ้าของ)', 
                    icon: <Sticker name="role-owner" size="xs" />,
                    badge: 'Owner', 
                    badgeColor: 'bg-brand-indigo/15 text-brand-indigo' 
                  },
                  { 
                    value: 'MANAGER', 
                    label: 'Manager (ยิงสด)', 
                    icon: <Sticker name="role-manager" size="xs" />,
                    badge: 'Manager', 
                    badgeColor: 'bg-semantic-info/15 text-semantic-info' 
                  },
                  { 
                    value: 'EDITOR', 
                    label: 'Editor (ยิงสด)', 
                    icon: <Sticker name="role-editor" size="xs" />,
                    badge: 'Editor', 
                    badgeColor: 'bg-brand-indigo/15 text-brand-indigo' 
                  },
                  { 
                    value: 'CONTRIBUTOR', 
                    label: 'Contributor (รออนุมัติ)', 
                    icon: <Sticker name="role-contributor" size="xs" />,
                    badge: 'Approval', 
                    badgeColor: 'bg-accent-terracotta/15 text-accent-terracotta' 
                  },
                  { 
                    value: 'VIEWER', 
                    label: 'Viewer (อ่านอย่างเดียว)', 
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
                title="จัดการสิทธิ์ทีม"
              >
                ทีม →
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
                  title="คลิกเพื่อสลับโปรเจกต์"
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
                <span>All Feeds</span>
              </button>
              <button
                type="button"
                disabled={mediaMode === 'TEXT_ONLY'}
                onClick={() => applyUniversalPreset('STORIES')}
                className={`py-1 px-1 rounded text-[10px] font-mono font-semibold transition-colors shadow-2xs text-center truncate flex items-center justify-center gap-1 ${
                  mediaMode !== 'TEXT_ONLY'
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

          {/* Quick Header: Channel Count & Collapse/Expand All Toggle */}
          <div className="flex items-center justify-between text-[10px] font-mono text-ink-secondary px-0.5 pt-0.5">
            <span>ช่องทางตามแพลตฟอร์ม ({filteredAccounts.length})</span>
            {groupedAccounts.size > 1 && (
              <button
                type="button"
                onClick={toggleAllGroups}
                className="text-brand-indigo hover:underline font-semibold cursor-pointer flex items-center gap-0.5 transition-colors"
                title={isAllGroupsCollapsed ? 'กางทุกแพลตฟอร์ม' : 'พับทุกแพลตฟอร์ม'}
              >
                <span>{isAllGroupsCollapsed ? '▾ กางทั้งหมด' : '▴ พับทั้งหมด'}</span>
              </button>
            )}
          </div>

          {/* Scrollable Channel List Scoped to Active Project with 1-Click Card Activation */}
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto pr-1 space-y-3">
            {Array.from(groupedAccounts.entries()).map(([groupName, accounts]) => {
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
                    title={isCollapsed ? `คลิกเพื่อกาง ${groupName}` : `คลิกเพื่อพับ ${groupName}`}
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
            })}
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

                {/* AI Media Hub Button */}
                <button
                  type="button"
                  onClick={() => setIsAiMediaModalOpen(true)}
                  className="aspect-square border-2 border-dashed border-brand-indigo/40 rounded-editorial flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:border-brand-indigo hover:bg-brand-indigo/5 transition-colors bg-paper-canvas/30 group"
                >
                  <Sparkles className="w-4 h-4 text-brand-indigo mb-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-serif font-medium text-brand-indigo">เลือกจากคลัง AI</span>
                  <span className="text-[9px] font-mono text-ink-secondary">AI Assets Hub</span>
                </button>
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
              <div className="flex items-center gap-2">
                {lastSavedDraftTime && (
                  <span className="text-[10px] font-mono text-semantic-success flex items-center gap-1 font-medium bg-semantic-success/10 px-2 py-0.5 rounded border border-semantic-success/30">
                    <Check className="w-3 h-3 text-semantic-success shrink-0" />
                    <span>บันทึกอัตโนมัติ</span>
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
                  <span>กู้คืนแบบร่างล่าสุดของ <strong>{activeWorkspace.name}</strong> อัตโนมัติแล้ว</span>
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    className="text-[10px] font-mono text-ink-secondary hover:text-semantic-error underline cursor-pointer"
                  >
                    ล้างแบบร่าง (Reset)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftRestoredNotice(false)}
                    className="text-ink-secondary hover:text-ink-primary text-xs cursor-pointer"
                    title="ปิดข้อความแจ้งเตือน"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* TEMPLATE PICKER & ACTIONS BAR (Boss's System Upgrade) */}
            <div className="p-3 bg-paper-canvas border border-border-rule rounded-editorial space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-ink-secondary shrink-0 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-brand-indigo shrink-0" />
                    <span>ใช้เทมเพลต:</span>
                  </span>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => {
                      const found = templates.find((t) => t.id === e.target.value);
                      if (found) handleApplyTemplate(found);
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-paper-raised border border-border-rule rounded text-xs font-mono text-ink-primary focus:outline-none focus:border-brand-indigo cursor-pointer"
                  >
                    <option value="">-- เลือกเทมเพลตข้อความสำเร็จรูป --</option>
                    {['REAL_ESTATE', 'PROMOTION', 'PRODUCT_LAUNCH', 'INSIGHTS', 'CUSTOM'].map((cat) => {
                      const catTemplates = templates.filter((t) => t.category === cat);
                      if (catTemplates.length === 0) return null;
                      const label =
                        cat === 'REAL_ESTATE'
                          ? 'อสังหาริมทรัพย์ (Capital One Deals)'
                          : cat === 'PROMOTION'
                          ? 'โปรโมชั่น (Flash Deals)'
                          : cat === 'PRODUCT_LAUNCH'
                          ? 'เปิดตัวสินค้า (Tech Launch)'
                          : cat === 'INSIGHTS'
                          ? 'บทวิเคราะห์ & บทความ (Insights)'
                          : 'เทมเพลตของฉัน (Custom Saved)';
                      return (
                        <optgroup key={cat} label={label}>
                          {catTemplates.map((tpl) => (
                            <option key={tpl.id} value={tpl.id}>
                              {tpl.name}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setIsSaveTemplateModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-brand-indigo hover:bg-brand-indigo/10 rounded border border-brand-indigo/30 transition-colors cursor-pointer"
                  >
                    <BookmarkPlus className="w-3 h-3" />
                    <span>บันทึกเทมเพลต</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsManageTemplatesModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle rounded border border-border-rule transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>จัดการ</span>
                  </button>
                </div>
              </div>

              {/* QUICK TEMPLATE PILLS */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[9px] font-mono uppercase text-ink-secondary">ด่วน:</span>
                {templates.slice(0, 4).map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors border cursor-pointer ${
                      selectedTemplateId === tpl.id
                        ? 'bg-brand-indigo text-white border-brand-indigo font-semibold'
                        : 'bg-paper-raised text-ink-secondary hover:text-ink-primary border-border-rule hover:border-brand-indigo/40'
                    }`}
                  >
                    {tpl.name.split(' ')[0]} {tpl.name.split(' ')[1] || ''}
                  </button>
                ))}
              </div>
            </div>

            {/* TEMPLATE APPLIED NOTIFICATION BANNER */}
            {templateAppliedNotice && (
              <div className="p-2.5 bg-brand-indigo/5 border border-brand-indigo/30 rounded-editorial flex items-center justify-between text-xs font-mono text-brand-indigo animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-indigo shrink-0" />
                  <span className="truncate">{templateAppliedNotice}</span>
                </div>
                {previousContentState && (
                  <button
                    type="button"
                    onClick={handleUndoTemplate}
                    className="inline-flex items-center gap-1 text-[11px] text-accent-terracotta hover:underline font-semibold ml-2 shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Undo</span>
                  </button>
                )}
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
                    label="Target Date (วันที่ต้องการเผยแพร่)"
                    value={scheduledDate}
                    onChange={(d) => setScheduledDate(d)}
                    placeholder="เลือกวันที่..."
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
                    label="Target Time (เวลาที่ต้องการเผยแพร่)"
                    value={scheduledTime}
                    onChange={(t) => setScheduledTime(t)}
                    placeholder="เลือกเวลา..."
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
                  title="Toggle 9:16 Safe Zone Guidelines (ขอบบน 15%, ขอบล่าง 25%, เสาขวา 18% และ IG Grid 1:1)"
                >
                  <span>⛶ Safe Zone</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${showSafeZone ? 'bg-semantic-warning animate-pulse' : 'bg-ink-muted'}`} />
                </button>
              )}
            </div>
            <span className="text-[10px] font-mono text-semantic-success flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready</span>
            </span>
          </div>

          {/* Clean Multi-Platform & Multi-Format Selector Dock */}
          <div className="bg-paper-subtle border border-border-rule rounded-editorial p-1.5 space-y-1.5 shadow-2xs">
            {/* Tier 1: Platform Pills (Clean & Compact) */}
            <div className="grid grid-cols-4 gap-1 p-0.5 bg-paper-canvas/80 border border-border-rule/60 rounded-md">
              {(['INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'TIKTOK'] as const).map((plat) => {
                const isActive = previewPlatform === plat;
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => handleSelectPreviewPlatform(plat)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-1 rounded text-[11px] font-semibold transition-all ${
                      isActive
                        ? 'bg-paper-raised text-ink-primary shadow-xs ring-1 ring-border-rule font-bold'
                        : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-raised/50'
                    }`}
                    title={`Switch to ${plat} Preview`}
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
                    className={`flex-1 flex items-center justify-center gap-1 py-1 px-1.5 text-[10px] font-medium rounded transition-all ${
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
                      <>
                        <ImageIcon className="w-8 h-8 text-brand-indigo/40" />
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.2 rounded-full bg-ink-primary/75 text-white font-mono text-[9px]">
                          1/{images.length}
                        </span>
                      </>
                    )}
                    {mediaMode === 'VIDEO' && (
                      <div className="text-center">
                        <div className="w-10 h-10 mx-auto rounded-full bg-black/40 flex items-center justify-center mb-1">
                          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </div>
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
                          Just now • 🌐 Public
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
                      <ImageIcon className="w-8 h-8 text-[#1877F2]/40" />
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.2 rounded bg-ink-primary/75 text-white font-mono text-[9px]">
                        {images.length} photos
                      </span>
                    </div>
                  ) : mediaMode === 'VIDEO' ? (
                    <div className="aspect-[16/9] bg-ink-primary text-white relative flex items-center justify-center border-y border-border-rule/60">
                      <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.2 rounded bg-black/80 font-mono text-[9px]">
                        {videoAsset.duration}
                      </span>
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
                        <span className="w-3.5 h-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[7px]">👍</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[7px]">❤️</span>
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
                      <div className="flex items-center gap-1 text-[10px]">
                        <span>👍</span>
                        <span>❤️</span>
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
                        <span className="text-[6px] font-bold">🔀</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* YOUTUBE VIDEO FEED */}
              {previewTab === 'FEED' && (
                <div className="bg-paper-canvas border border-border-rule rounded-editorial overflow-hidden shadow-2xs text-ink-primary">
                  <div className="aspect-[16/9] bg-black text-white relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#FF0000] flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                    </div>
                    <span className="absolute bottom-2 right-2 px-1 py-0.2 rounded bg-black/90 font-mono text-[9px] font-bold">
                      {videoAsset.duration || '04:15'}
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
                      <p className="text-[9px] font-mono text-ink-secondary">
                        24K views • 3 hours ago
                      </p>
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
                    <div className="flex items-center gap-1 text-[9px]">
                      <span>🔥</span>
                      <span>😂</span>
                      <span>🥰</span>
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
                  setSubmittedForApprovalNotice(`ส่งโพสต์ "${workingTitle}" ให้ Manager ตรวจสอบและอนุมัติเรียบร้อยแล้ว (Pending Review)`);
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
                  ส่งให้ Manager อนุมัติ ({totalActivePlacements} Placements)
                </span>
              </button>
              <p className="text-[10px] text-accent-terracotta font-sans text-center leading-tight flex items-center justify-center gap-1.5">
                <Sticker name="guarded-shield" size="xs" inline />
                <span>บทบาท Contributor: ต้องผ่านการอนุมัติก่อนยิงขึ้นช่องทางจริง</span>
              </p>
            </div>
          ) : currentRole === 'VIEWER' ? (
            <div className="space-y-1.5">
              <div className="w-full py-2.5 px-4 text-xs font-semibold rounded-editorial flex items-center justify-center gap-2 bg-paper-subtle border border-border-rule text-ink-secondary cursor-not-allowed">
                <Lock className="w-4 h-4" />
                <span>โหมดผู้ตรวจงาน / ลูกค้า (Read-Only)</span>
              </div>
              <p className="text-[10px] text-ink-secondary font-sans text-center leading-tight">
                สามารถดู Live Phone Mockup และกำหนดการได้เท่านั้น
              </p>
            </div>
          ) : (
            <button
              type="button"
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
          )}
        </section>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SAVE AS CUSTOM TEMPLATE                                          */}
      {/* ========================================================================= */}
      {isSaveTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper-raised border border-border-rule rounded-card max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <div className="flex items-center gap-2">
                <BookmarkPlus className="w-4 h-4 text-brand-indigo" />
                <h3 className="font-serif font-medium text-base text-ink-primary">
                  บันทึกเป็นเทมเพลตใหม่
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSaveTemplateModalOpen(false)}
                className="p-1 rounded text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomTemplate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1">
                  ชื่อเทมเพลต (Template Name)
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="เช่น: คอนโด Rich Rama 9 โพสต์ด่วน..."
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono text-xs focus:outline-none focus:border-brand-indigo"
                />
              </div>

              {/* Preview of current draft payload */}
              <div className="p-3 bg-paper-canvas border border-border-rule rounded-editorial space-y-1.5 text-xs">
                <span className="text-[9px] font-mono uppercase text-ink-secondary block font-semibold">
                  เนื้อหาที่จะถูกบันทึก:
                </span>
                <p className="font-medium text-ink-primary truncate text-xs flex items-center gap-1.5">
                  <Sticker name="sticky-pushpin" size="xs" inline />
                  <span className="truncate">{workingTitle || 'Untitled Post'}</span>
                </p>
                <p className="text-ink-secondary line-clamp-3 text-[11px] leading-relaxed">
                  {sharedCaption}
                </p>
                {storyLinkUrl && (
                  <p className="font-mono text-[10px] text-accent-terracotta truncate flex items-center gap-1.5">
                    <Link2 className="w-3 h-3 text-accent-terracotta shrink-0" />
                    <span className="truncate">{storyLinkUrl}</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-rule">
                <button
                  type="button"
                  onClick={() => setIsSaveTemplateModalOpen(false)}
                  className="px-3 py-1.5 text-ink-secondary hover:text-ink-primary text-xs font-mono cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial text-xs font-mono font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  บันทึกเทมเพลต
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MANAGE TEMPLATES (FULL CRUD: Create • Read • Update • Delete)   */}
      {/* ========================================================================= */}
      {isManageTemplatesModalOpen && (
        <div 
          onClick={() => {
            setIsManageTemplatesModalOpen(false);
            setTemplateModalMode('LIST');
            setEditingTemplateId(null);
            setDeleteConfirmTplId(null);
            setResetConfirmOpen(false);
          }}
          className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border border-border-rule rounded-card max-w-2xl sm:max-w-3xl w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col cursor-default"
          >
            {/* VIEW 1: TEMPLATE LIST VIEW */}
            {templateModalMode === 'LIST' ? (
              <>
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-3 border-b border-border-rule shrink-0 gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-indigo/10 flex items-center justify-center text-brand-indigo shrink-0">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
                          คลังเทมเพลตข้อความทั้งหมด ({templates.length})
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo text-[10px] font-mono font-bold">
                          Full CRUD
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-ink-secondary block">
                        เทมเพลตระบบ & เทมเพลตที่คุณบันทึกไว้ (สร้าง • ค้นหา • แก้ไข • คัดลอก • ลบ)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenCreateTemplate(false)}
                      className="px-3 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>สร้างเทมเพลตใหม่</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsManageTemplatesModalOpen(false)}
                      className="p-1.5 rounded-editorial border border-border-rule hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
                      title="ปิดหน้าต่าง"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reset Confirmation Banner */}
                {resetConfirmOpen && (
                  <div className="p-3 bg-accent-terracotta/10 border border-accent-terracotta/30 rounded-editorial flex items-center justify-between text-xs font-mono text-ink-primary animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-accent-terracotta shrink-0" />
                      <span>ต้องการรีเซ็ตคลังเทมเพลตกลับเป็นค่าเริ่มต้น 5 รายการของระบบหรือไม่?</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetTemplates}
                        className="px-2.5 py-1 bg-accent-terracotta text-white rounded text-xs font-bold hover:bg-accent-terracotta/90 cursor-pointer"
                      >
                        ยืนยันรีเซ็ต
                      </button>
                      <button
                        type="button"
                        onClick={() => setResetConfirmOpen(false)}
                        className="px-2.5 py-1 border border-border-rule text-ink-secondary hover:text-ink-primary rounded text-xs cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                )}

                {/* Search & Category Filter Toolbar */}
                <div className="space-y-2 shrink-0">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                    <input
                      type="text"
                      value={tplSearchQuery}
                      onChange={(e) => setTplSearchQuery(e.target.value)}
                      placeholder="ค้นหาตามชื่อเทมเพลต, เนื้อหาแคปชัน, แฮชแท็ก หรือหมวดหมู่..."
                      className="w-full pl-9 pr-8 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary placeholder:text-ink-muted focus:outline-hidden focus:border-brand-indigo"
                    />
                    {tplSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setTplSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none">
                    {[
                      { id: 'ALL', label: 'ทั้งหมด', sticker: null, count: templateCategoryCounts.ALL },
                      { id: 'CUSTOM', label: 'ของฉัน', sticker: 'award-star-badge', count: templateCategoryCounts.CUSTOM },
                      { id: 'REAL_ESTATE', label: 'อสังหาริมทรัพย์', sticker: 'ws-realestate', count: templateCategoryCounts.REAL_ESTATE },
                      { id: 'PROMOTION', label: 'โปรโมชั่น', sticker: 'viral-flame', count: templateCategoryCounts.PROMOTION },
                      { id: 'PRODUCT_LAUNCH', label: 'เปิดตัวสินค้า', sticker: 'paper-airplane', count: templateCategoryCounts.PRODUCT_LAUNCH },
                      { id: 'INSIGHTS', label: 'บทวิเคราะห์', sticker: 'growth-chart', count: templateCategoryCounts.INSIGHTS },
                    ].map((tab) => {
                      const isActive = tplCategoryFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setTplCategoryFilter(tab.id)}
                          className={`px-2.5 py-1 rounded-full border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-brand-indigo text-white border-brand-indigo font-bold shadow-2xs'
                              : 'bg-paper-canvas text-ink-secondary border-border-rule hover:border-brand-indigo/40 hover:text-ink-primary'
                          }`}
                        >
                          {tab.sticker && <Sticker name={tab.sticker} size="xs" inline />}
                          <span>{tab.label}</span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                            isActive ? 'bg-white/20 text-white' : 'bg-paper-subtle text-ink-muted'
                          }`}>
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Template Cards List */}
                <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
                  {filteredTemplates.length === 0 ? (
                    <div className="py-12 text-center space-y-3 bg-paper-canvas border border-border-rule rounded-editorial p-6">
                      <div className="w-10 h-10 rounded-full bg-paper-subtle border border-border-rule flex items-center justify-center mx-auto text-ink-muted">
                        <Search className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-sm text-ink-primary">
                          ไม่พบเทมเพลตที่ตรงกับเงื่อนไขการค้นหา
                        </p>
                        <p className="text-xs font-mono text-ink-muted mt-1">
                          ลองปรับคำค้นหา หรือสร้างเทมเพลตใหม่สำหรับแคมเปญนี้
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleOpenCreateTemplate(false);
                          if (tplSearchQuery) setFormTplName(tplSearchQuery);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-indigo text-white rounded-editorial font-mono text-xs font-semibold hover:bg-brand-indigo-hover transition-colors shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>สร้างเทมเพลตใหม่ด้วยชื่อนี้</span>
                      </button>
                    </div>
                  ) : (
                    filteredTemplates.map((tpl) => {
                      const isExpanded = expandedTplIds[tpl.id] ?? false;

                      // Category badge style
                      const categoryBadgeColor =
                        tpl.category === 'REAL_ESTATE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : tpl.category === 'PROMOTION'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : tpl.category === 'PRODUCT_LAUNCH'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : tpl.category === 'INSIGHTS'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20';

                      return (
                        <div
                          key={tpl.id}
                          className="p-3.5 bg-paper-canvas border border-border-rule rounded-editorial hover:border-brand-indigo/40 hover:shadow-xs transition-all space-y-2 group/card"
                        >
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-serif font-bold text-ink-primary text-sm group-hover/card:text-brand-indigo transition-colors">
                                {tpl.name}
                              </h4>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${categoryBadgeColor}`}>
                                {tpl.categoryLabel}
                              </span>
                              {tpl.isBuiltIn ? (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-paper-subtle border border-border-rule text-ink-secondary">
                                  System Default
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-brand-indigo/15 text-brand-indigo font-bold border border-brand-indigo/20">
                                  Custom Saved
                                </span>
                              )}
                            </div>

                            {/* Card Actions: Apply, Edit, Duplicate, Delete */}
                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                              {/* Apply Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  handleApplyTemplate(tpl);
                                  setIsManageTemplatesModalOpen(false);
                                }}
                                className="px-2.5 py-1 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded text-[11px] font-mono font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                                title="นำเทมเพลตนี้ไปใส่ใน Studio Desk"
                              >
                                <span>นำไปใช้</span>
                              </button>

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditTemplate(tpl)}
                                className="px-2 py-1 bg-paper-raised hover:bg-paper-subtle text-ink-secondary hover:text-brand-indigo border border-border-rule rounded text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1"
                                title="แก้ไขชื่อ หมวดหมู่ หรือเนื้อหาเทมเพลตนี้"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span className="hidden sm:inline">แก้ไข</span>
                              </button>

                              {/* Duplicate Button */}
                              <button
                                type="button"
                                onClick={() => handleDuplicateTemplate(tpl.id)}
                                className="p-1 bg-paper-raised hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule rounded transition-colors cursor-pointer"
                                title="คัดลอกเป็นเทมเพลตใหม่"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button with Inline Confirm */}
                              {deleteConfirmTplId === tpl.id ? (
                                <div className="flex items-center gap-1 bg-semantic-error/10 border border-semantic-error/30 rounded p-0.5 animate-in fade-in">
                                  <span className="text-[10px] font-mono text-semantic-error px-1 font-bold">
                                    ลบ?
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTemplate(tpl.id)}
                                    className="px-1.5 py-0.5 rounded bg-semantic-error text-white text-[10px] font-mono font-bold hover:bg-semantic-error/90 cursor-pointer"
                                  >
                                    ยืนยัน
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmTplId(null)}
                                    className="px-1.5 py-0.5 rounded border border-border-rule text-[10px] font-mono text-ink-secondary hover:text-ink-primary cursor-pointer"
                                  >
                                    ยกเลิก
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmTplId(tpl.id)}
                                  className="p-1 text-ink-secondary hover:text-semantic-error border border-border-rule hover:border-semantic-error/40 rounded transition-colors cursor-pointer"
                                  title="ลบเทมเพลตนี้ออกจากคลัง"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Caption Preview / Full Text */}
                          <div className="bg-paper-subtle/60 border border-border-rule/80 rounded p-2.5 space-y-1.5">
                            {isExpanded ? (
                              <div className="space-y-2 text-xs font-sans text-ink-primary animate-in fade-in">
                                {tpl.title && (
                                  <div className="font-serif font-bold text-ink-primary border-b border-border-rule/60 pb-1 flex items-center gap-1.5">
                                    <span className="text-[10px] font-mono text-ink-secondary uppercase">หัวข้อ:</span>
                                    <span>{tpl.title}</span>
                                  </div>
                                )}
                                <p className="leading-relaxed whitespace-pre-wrap font-sans text-xs">
                                  {tpl.caption}
                                </p>
                                {(tpl.tags || tpl.storyLink) && (
                                  <div className="pt-1.5 border-t border-border-rule/60 flex flex-wrap items-center gap-3 font-mono text-[10px] text-ink-secondary">
                                    {tpl.tags && (
                                      <span className="flex items-center gap-1 text-ink-secondary">
                                        <Tag className="w-3 h-3 text-ink-muted" />
                                        <span>{tpl.tags}</span>
                                      </span>
                                    )}
                                    {tpl.storyLink && (
                                      <span className="flex items-center gap-1 text-accent-terracotta font-medium">
                                        <Link2 className="w-3 h-3" />
                                        <span className="truncate max-w-[220px]">{tpl.storyLink}</span>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-[11px] font-sans text-ink-secondary line-clamp-2 leading-relaxed">
                                {tpl.caption}
                              </p>
                            )}

                            {/* Expand/Collapse Toggle Button */}
                            <div className="flex items-center justify-between pt-0.5 text-[10px] font-mono">
                              <button
                                type="button"
                                onClick={() => setExpandedTplIds((prev) => ({ ...prev, [tpl.id]: !prev[tpl.id] }))}
                                className="text-brand-indigo hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                              >
                                {isExpanded ? (
                                  <>
                                    <span>ย่อข้อความลง</span>
                                    <ChevronUp className="w-3 h-3" />
                                  </>
                                ) : (
                                  <>
                                    <span>ดูข้อความเต็ม & รายละเอียด</span>
                                    <ChevronDown className="w-3 h-3" />
                                  </>
                                )}
                              </button>
                              {tpl.storyLink && !isExpanded && (
                                <span className="text-accent-terracotta flex items-center gap-1">
                                  <Link2 className="w-2.5 h-2.5" />
                                  <span>Story Link ติดมาด้วย</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Modal Footer */}
                <div className="pt-3 border-t border-border-rule flex items-center justify-between shrink-0 text-xs font-mono">
                  <div className="flex items-center gap-3 text-ink-secondary">
                    <span className="flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-accent-warm inline" />
                      <span>นำไปใช้เพื่อแทนที่ข้อความ หรือกด</span>
                      <Edit3 className="w-3.5 h-3.5 inline text-ink-primary" />
                      <span>เพื่อแก้ไข</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setResetConfirmOpen(true)}
                      className="text-ink-muted hover:text-ink-primary underline transition-colors cursor-pointer"
                    >
                      รีเซ็ตค่าเริ่มต้นระบบ
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsManageTemplatesModalOpen(false)}
                    className="px-4 py-1.5 bg-paper-subtle hover:bg-paper-canvas text-ink-primary border border-border-rule rounded-editorial font-mono text-xs cursor-pointer transition-colors"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </>
            ) : (
              /* VIEW 2: CREATE / EDIT FORM VIEW */
              <form onSubmit={handleSaveTemplateForm} className="space-y-4 flex flex-col flex-1 overflow-hidden">
                {/* Form Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border-rule shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-indigo/10 flex items-center justify-center text-brand-indigo shrink-0">
                      {editingTemplateId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
                        {editingTemplateId ? 'แก้ไขเทมเพลตข้อความ' : 'สร้างเทมเพลตใหม่'}
                      </h3>
                      <p className="text-[11px] font-mono text-ink-secondary">
                        {editingTemplateId
                          ? 'ปรับปรุงข้อความและรายละเอียดเทมเพลตเพื่อบันทึกซ้ำ'
                          : 'สร้างเทมเพลตสำหรับใช้งานซ้ำในแคมเปญต่างๆ'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrefillFormFromEditor}
                      className="px-2.5 py-1.5 bg-paper-subtle hover:bg-paper-canvas border border-border-rule text-brand-indigo font-mono text-xs rounded-editorial transition-colors flex items-center gap-1 cursor-pointer"
                      title="คัดลอกหัวข้อและแคปชันปัจจุบันจาก Studio Desk มาใส่ในฟอร์ม"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>ดึงจากร่างปัจจุบัน</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTemplateModalMode('LIST');
                        setEditingTemplateId(null);
                      }}
                      className="px-2.5 py-1.5 text-ink-secondary hover:text-ink-primary font-mono text-xs cursor-pointer"
                    >
                      ← กลับไปรายการ
                    </button>
                  </div>
                </div>

                {/* Form Inputs Container */}
                <div className="overflow-y-auto space-y-3.5 pr-1 flex-1 text-xs">
                  {/* Row 1: Template Name & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-mono text-[11px] uppercase text-ink-secondary mb-1">
                        ชื่อเทมเพลต (Template Display Name) *
                      </label>
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="เช่น: คอนโดหรูติด BTS (Capital One Deal)"
                        value={formTplName}
                        onChange={(e) => setFormTplName(e.target.value)}
                        className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-serif text-sm text-ink-primary placeholder:text-ink-muted focus:outline-hidden focus:border-brand-indigo"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] uppercase text-ink-secondary mb-1">
                        หมวดหมู่ (Category)
                      </label>
                      <select
                        value={formTplCategory}
                        onChange={(e) => setFormTplCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary focus:outline-hidden focus:border-brand-indigo cursor-pointer"
                      >
                        <option value="REAL_ESTATE">อสังหาริมทรัพย์</option>
                        <option value="PROMOTION">โปรโมชั่น / Flash Sale</option>
                        <option value="PRODUCT_LAUNCH">เปิดตัวสินค้า / Tech</option>
                        <option value="INSIGHTS">บทวิเคราะห์ & บทความ</option>
                        <option value="CUSTOM">เทมเพลตของฉัน (Custom)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Working Title */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-ink-secondary mb-1">
                      หัวข้อแคมเปญ / โพสต์ (Campaign Working Title)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น: [HOT DEAL] ขาย/ให้เช่าคอนโดหรูใจกลางสุขุมวิท พร้อมเข้าอยู่"
                      value={formTplTitle}
                      onChange={(e) => setFormTplTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-sans text-xs text-ink-primary placeholder:text-ink-muted focus:outline-hidden focus:border-brand-indigo"
                    />
                  </div>

                  {/* Row 3: Caption TextArea */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-mono text-[11px] uppercase text-ink-secondary">
                        เนื้อหาแคปชันโพสต์ (Post Caption & Copy) *
                      </label>
                      <span className="font-mono text-[10px] text-ink-muted">
                        {formTplCaption.length} ตัวอักษร
                      </span>
                    </div>
                    <textarea
                      required
                      rows={7}
                      placeholder="พิมพ์หรือวางเนื้อหาข้อความ รายละเอียด จุดเด่น การติดต่อ และ Call-to-action ของเทมเพลตนี้..."
                      value={formTplCaption}
                      onChange={(e) => setFormTplCaption(e.target.value)}
                      className="w-full p-3 bg-paper-canvas border border-border-rule rounded-editorial font-sans text-xs text-ink-primary placeholder:text-ink-muted focus:outline-hidden focus:border-brand-indigo leading-relaxed whitespace-pre-wrap"
                    />
                  </div>

                  {/* Row 4: Tags & Story Link Sticker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] uppercase text-ink-secondary mb-1 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>แฮชแท็ก (Tags)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น: คอนโดติดbts, อสังหาหรู, CapitalOne"
                        value={formTplTags}
                        onChange={(e) => setFormTplTags(e.target.value)}
                        className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary placeholder:text-ink-muted focus:outline-hidden focus:border-brand-indigo"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] uppercase text-ink-secondary mb-1 flex items-center gap-1">
                        <Link2 className="w-3 h-3 text-accent-terracotta" />
                        <span>Story Link Sticker / Landing URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://capitalone.co.th/hot-deal"
                        value={formTplStoryLink}
                        onChange={(e) => setFormTplStoryLink(e.target.value)}
                        className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary placeholder:text-ink-muted focus:outline-hidden focus:border-accent-terracotta"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Footer Actions */}
                <div className="pt-3 border-t border-border-rule flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setTemplateModalMode('LIST');
                      setEditingTemplateId(null);
                    }}
                    className="px-4 py-2 border border-border-rule rounded-editorial text-xs font-mono text-ink-secondary hover:text-ink-primary cursor-pointer transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial text-xs font-mono font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingTemplateId ? 'บันทึกการแก้ไข' : 'บันทึกเทมเพลตใหม่'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
                    คลังภาพสื่อ AI (AI Media Asset Hub)
                  </h3>
                  <span className="text-[10px] font-mono text-ink-secondary block">
                    เลือกรูปภาพเรนเดอร์สถาปัตยกรรมและอสังหาริมทรัพย์ระดับ 8K ที่พร้อมใช้งาน
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
                    <span>เลือกภาพนี้เข้าโพสต์</span>
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
                ปิด
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
          <span>1. จุดหมาย</span>
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
          <span>2. เขียนงาน</span>
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
          <span>3. พรีวิวสด</span>
          <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
        </button>
      </div>
    </div>
  );
}
