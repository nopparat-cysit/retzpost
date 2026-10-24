'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  Building2,
  Check,
  X,
  Sliders,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Info,
  MoreHorizontal,
  Copy,
  Trash2,
  Activity,
  Search,
  ChevronDown,
  Globe,
  Radio,
  Zap,
  Layers,
  ArrowRight,
  LayoutGrid,
  List,
  Settings,
  Edit3,
  SlidersHorizontal
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
import { Sticker } from '@/components/ui/sticker';
import { 
  SocialPlatformIcon, 
  FacebookLogo, 
  InstagramLogo, 
  YouTubeLogo, 
  TikTokLogo 
} from '@/components/ui/social-icons';

export interface MasterChannelAccount {
  id: string;
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK';
  displayName: string;
  handle: string;
  channelId: string;
  defaultWorkspaceId: string;
  defaultWorkspaceName: string;
  scopes: string[];
  expiresIn: string;
  capabilities: string;
  lastSynced: string;
  url?: string;
}

const INITIAL_MASTER_ACCOUNTS: MasterChannelAccount[] = [
  // 1. Facebook Pages (4 Pages)
  {
    id: 'acc-fb-c1-th',
    platform: 'FACEBOOK',
    displayName: 'Capital One Real Estate Thailand',
    handle: 'FB Page: Capital One Thailand',
    channelId: 'fb_c1_main_9921',
    defaultWorkspaceId: 'ws_capitalone',
    defaultWorkspaceName: 'Capital One Real Estate',
    scopes: ['pages_show_list', 'pages_manage_posts'],
    expiresIn: 'Permanent Meta Page Token',
    capabilities: 'Property Listings • Photo Albums • Page Stories • Lead Forms',
    lastSynced: '12 mins ago',
    url: 'https://www.facebook.com/capitalonethailand',
  },
  {
    id: 'acc-fb-c1-kw',
    platform: 'FACEBOOK',
    displayName: 'KW Luxury Thailand (Partner Agency)',
    handle: 'FB Page: Keller Williams Luxury TH',
    channelId: 'fb_kw_lux_4412',
    defaultWorkspaceId: 'ws_capitalone',
    defaultWorkspaceName: 'Capital One Real Estate',
    scopes: ['pages_show_list', 'pages_manage_posts'],
    expiresIn: 'Permanent Meta Page Token',
    capabilities: 'Ultra-Luxury Penthouse Albums & Syndication',
    lastSynced: '25 mins ago',
    url: 'https://www.facebook.com/kwluxurythailand',
  },
  {
    id: 'acc-fb-acme',
    platform: 'FACEBOOK',
    displayName: 'Alex Rivera Media Studio',
    handle: 'FB Page: Alex Rivera Media Studio',
    channelId: 'fb_page_10928374',
    defaultWorkspaceId: 'ws_acme',
    defaultWorkspaceName: 'Acme Creator Studio',
    scopes: ['pages_show_list', 'pages_manage_posts'],
    expiresIn: 'Permanent Page Access Token (Encrypted)',
    capabilities: 'Page Timeline • Photo Albums • Text Status • Page Stories',
    lastSynced: '5 mins ago',
    url: 'https://www.facebook.com/alexriveramedia',
  },
  {
    id: 'acc-fb-retz',
    platform: 'FACEBOOK',
    displayName: 'RetzPost Software Page',
    handle: 'FB Page: RetzPost App',
    channelId: 'fb_retz_5512',
    defaultWorkspaceId: 'ws_retzpost',
    defaultWorkspaceName: 'RetzPost Software',
    scopes: ['pages_show_list', 'pages_manage_posts'],
    expiresIn: 'Permanent Token',
    capabilities: 'SaaS Product Changelogs & Tech Announcements',
    lastSynced: '2 hours ago',
    url: 'https://www.facebook.com/retzpost',
  },

  // 2. Instagram Accounts (3 Accounts)
  {
    id: 'acc-ig-c1-main',
    platform: 'INSTAGRAM',
    displayName: 'Capital One Thailand Official',
    handle: '@capitalone.realestate',
    channelId: 'ig_c1_7718',
    defaultWorkspaceId: 'ws_capitalone',
    defaultWorkspaceName: 'Capital One Real Estate',
    scopes: ['instagram_basic', 'instagram_content_publish'],
    expiresIn: '60-day Auto-Refresh Token Vault',
    capabilities: 'Condo Carousel (10) • 24h Story Link Stickers • Luxury Reels',
    lastSynced: '15 mins ago',
    url: 'https://www.instagram.com/capitalone.realestate',
  },
  {
    id: 'acc-ig-acme',
    platform: 'INSTAGRAM',
    displayName: 'Alex Rivera Studio',
    handle: '@alexrivera_official',
    channelId: 'ig_user_17841405',
    defaultWorkspaceId: 'ws_acme',
    defaultWorkspaceName: 'Acme Creator Studio',
    scopes: ['instagram_basic', 'instagram_content_publish'],
    expiresIn: '60-day Long-Lived Token (Auto-refreshed via Token Vault)',
    capabilities: 'Feed Photos • Carousels (Up to 10) • 24h Stories • Reels',
    lastSynced: '5 mins ago',
    url: 'https://www.instagram.com/alexrivera_official',
  },
  {
    id: 'acc-ig-coffee',
    platform: 'INSTAGRAM',
    displayName: 'Coffee Craft BKK',
    handle: '@coffeecraft.bkk',
    channelId: 'ig_coffee_2219',
    defaultWorkspaceId: 'ws_coffee',
    defaultWorkspaceName: 'Coffee Craft BKK',
    scopes: ['instagram_basic', 'instagram_content_publish'],
    expiresIn: '60-day Auto-Refresh Token',
    capabilities: 'Cafe Stories with Location Stickers & Daily Special Reels',
    lastSynced: '3 hours ago',
    url: 'https://www.instagram.com/coffeecraft.bkk',
  },

  // 3. TikTok Accounts (1 Profile)
  {
    id: 'acc-tt-acme',
    platform: 'TIKTOK',
    displayName: 'Alex Rivera Official',
    handle: '@alexrivera_official',
    channelId: 'open_id_tt_8892',
    defaultWorkspaceId: 'ws_acme',
    defaultWorkspaceName: 'Acme Creator Studio',
    scopes: ['video.publish', 'user.info.basic'],
    expiresIn: 'Active TikTok Token',
    capabilities: 'Max Video Duration: 10m (600s) • Direct Post & Inbox',
    lastSynced: '1 hour ago',
    url: 'https://www.tiktok.com/@alexrivera_official',
  },

  // 4. YouTube Channels (1 Channel)
  {
    id: 'acc-yt-acme',
    platform: 'YOUTUBE',
    displayName: 'Alex Rivera Studio (YouTube)',
    handle: '@AlexRiveraStudio',
    channelId: 'UC_x65aB891F_Live',
    defaultWorkspaceId: 'ws_acme',
    defaultWorkspaceName: 'Acme Creator Studio',
    scopes: ['youtube.upload', 'youtube.readonly'],
    expiresIn: 'Active Google OAuth Token',
    capabilities: 'YouTube Shorts (9:16) • Long-form Videos • Resumable',
    lastSynced: '10 mins ago',
    url: 'https://www.youtube.com/@AlexRiveraStudio',
  },
];

export interface WorkspaceItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  selectedChannelIds: string[];
}

const INITIAL_PROJECTS: WorkspaceItem[] = [
  {
    id: 'ws_capitalone',
    name: 'Capital One Real Estate',
    category: 'อสังหาริมทรัพย์',
    icon: 'ws-realestate',
    selectedChannelIds: ['acc-fb-c1-th', 'acc-ig-c1-main', 'acc-fb-c1-kw'],
  },
  {
    id: 'ws_acme',
    name: 'Acme Creator Studio',
    category: 'ครีเอเตอร์ / สตูดิโอ',
    icon: 'ws-creator',
    selectedChannelIds: ['acc-ig-acme', 'acc-fb-acme', 'acc-yt-acme', 'acc-tt-acme'],
  },
  {
    id: 'ws_retzpost',
    name: 'RetzPost Software',
    category: 'SaaS & ซอฟต์แวร์',
    icon: 'ws-software',
    selectedChannelIds: ['acc-fb-retz'],
  },
  {
    id: 'ws_coffee',
    name: 'Coffee Craft BKK',
    category: 'คาเฟ่ & อาหาร',
    icon: 'ws-cafe',
    selectedChannelIds: ['acc-ig-coffee'],
  },
];

interface PlatformConfig {
  id: 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE';
  name: string;
  subtitle: string;
  addButtonText: string;
  badgeColor: string;
  icon: (size?: number) => React.ReactNode;
}

const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    id: 'FACEBOOK',
    name: 'Facebook',
    subtitle: 'Meta Pages • Feed & Stories Endpoints',
    addButtonText: 'เพิ่มเพจ Facebook',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
    icon: (size = 20) => <FacebookLogo size={size} />,
  },
  {
    id: 'INSTAGRAM',
    name: 'Instagram',
    subtitle: 'Instagram Professional • Carousels, Stories & Reels',
    addButtonText: 'เพิ่มบัญชี IG',
    badgeColor: 'bg-pink-100 text-pink-900 border-pink-200',
    icon: (size = 20) => <InstagramLogo size={size} />,
  },
  {
    id: 'TIKTOK',
    name: 'TikTok',
    subtitle: 'TikTok for Business • Direct Video Publishing (9:16)',
    addButtonText: 'เพิ่มบัญชี TikTok',
    badgeColor: 'bg-stone-100 text-stone-900 border-stone-300',
    icon: (size = 20) => <TikTokLogo size={size} />,
  },
  {
    id: 'YOUTUBE',
    name: 'YouTube',
    subtitle: 'Google OAuth • Shorts & Long-Form Publishing',
    addButtonText: 'เพิ่มช่อง YouTube',
    badgeColor: 'bg-red-100 text-red-900 border-red-200',
    icon: (size = 20) => <YouTubeLogo size={size} />,
  },
];



export default function ConnectedAccountsPage() {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get('success');
  const errorMessage = searchParams.get('error');

  // Accounts & Workspaces state
  const [accounts, setAccounts] = useState<MasterChannelAccount[]>(INITIAL_MASTER_ACCOUNTS);
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>(INITIAL_PROJECTS);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewLayout, setViewLayout] = useState<'GRID' | 'LIST'>('GRID');
  const [channelFilterMode, setChannelFilterMode] = useState<'ALL' | 'ACTIVE' | 'BYPASSED'>('ALL');

  // Dropdown states
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const projectDropdownRef = useRef<HTMLDivElement>(null);

  // Channel selections map: { `${workspaceId}_${channelId}`: boolean }
  const [channelSelections, setChannelSelections] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const ws of INITIAL_PROJECTS) {
      for (const chId of ws.selectedChannelIds) {
        map[`${ws.id}_${chId}`] = true;
      }
    }
    return map;
  });

  // Modal: Connect New Page / Channel (+)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState<'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE'>('FACEBOOK');
  const [newPageName, setNewPageName] = useState('');
  const [newPageHandle, setNewPageHandle] = useState('');

  // Modal: Test API Diagnostic
  const [testApiAccount, setTestApiAccount] = useState<MasterChannelAccount | null>(null);

  // Modal: Disconnect Confirmation
  const [disconnectCandidate, setDisconnectCandidate] = useState<MasterChannelAccount | null>(null);

  // Modal: Create New Project
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectSelectedChannels, setNewProjectSelectedChannels] = useState<Record<string, boolean>>({
    'acc-fb-c1-th': true,
    'acc-ig-c1-main': true,
  });

  // Modal: Manage & Map Project Channels (Comprehensive Project Matrix)
  const [isManageProjectModalOpen, setIsManageProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string>('ws_capitalone');
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectChannels, setEditProjectChannels] = useState<Record<string, boolean>>({});

  // Modal: Quick Assign Channel to Project
  const [assignCandidate, setAssignCandidate] = useState<MasterChannelAccount | null>(null);
  const [assignTargetWsId, setAssignTargetWsId] = useState<string>('ws_capitalone');

  // Toast / Feedback Notice
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(e.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Active workspace object
  const activeWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  // Active count calculations for current scope
  const currentProjectActiveCount = useMemo(() => {
    if (selectedWorkspaceId === 'ALL') return accounts.length;
    return accounts.filter((a) => channelSelections[`${selectedWorkspaceId}_${a.id}`] ?? false).length;
  }, [selectedWorkspaceId, accounts, channelSelections]);

  const currentProjectBypassedCount = useMemo(() => {
    if (selectedWorkspaceId === 'ALL') return 0;
    return accounts.length - currentProjectActiveCount;
  }, [selectedWorkspaceId, accounts, currentProjectActiveCount]);

  // Filter accounts by search query AND workspace selection AND filter mode
  const displayedAccounts = useMemo(() => {
    let list = accounts;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (acc) =>
          acc.displayName.toLowerCase().includes(q) ||
          acc.handle.toLowerCase().includes(q) ||
          acc.channelId.toLowerCase().includes(q)
      );
    }

    if (selectedWorkspaceId !== 'ALL') {
      if (channelFilterMode === 'ACTIVE') {
        list = list.filter((acc) => channelSelections[`${selectedWorkspaceId}_${acc.id}`] ?? false);
      } else if (channelFilterMode === 'BYPASSED') {
        list = list.filter((acc) => !(channelSelections[`${selectedWorkspaceId}_${acc.id}`] ?? false));
      }
    }

    return list;
  }, [accounts, searchQuery, selectedWorkspaceId, channelFilterMode, channelSelections]);

  // Toggle channel enablement for workspace (Zero-Touch API Bypass)
  const handleToggleChannelForWorkspace = (channelId: string, wsId?: string) => {
    const targetWsId = wsId || (selectedWorkspaceId === 'ALL' ? 'ws_capitalone' : selectedWorkspaceId);
    const key = `${targetWsId}_${channelId}`;
    const willEnable = !(channelSelections[key] ?? false);

    setChannelSelections((prev) => ({
      ...prev,
      [key]: willEnable,
    }));

    const targetAccount = accounts.find((a) => a.id === channelId);
    const targetWs = workspaces.find((w) => w.id === targetWsId);

    if (willEnable) {
      showToast(`✓ เปิดใช้งาน "${targetAccount?.displayName}" ใน ${targetWs?.name} แล้ว (พร้อมรับคิวโพสต์)`);
    } else {
      showToast(`🛡️ ปิดใช้งาน "${targetAccount?.displayName}" ใน ${targetWs?.name} (ระบบจะข้าม API ไม่เกิด Error 100%)`);
    }
  };

  // Open Manage Project Modal
  const handleOpenManageProjectModal = (wsId: string) => {
    const target = workspaces.find((w) => w.id === wsId) || workspaces[0];
    if (!target) return;

    setEditingProjectId(target.id);
    setEditProjectName(target.name);

    const channelMap: Record<string, boolean> = {};
    accounts.forEach((acc) => {
      channelMap[acc.id] = channelSelections[`${target.id}_${acc.id}`] ?? false;
    });
    setEditProjectChannels(channelMap);
    setIsManageProjectModalOpen(true);
  };

  // Switch editing project inside Manage Project Modal
  const handleSwitchEditingProjectInModal = (wsId: string) => {
    const target = workspaces.find((w) => w.id === wsId);
    if (!target) return;

    setEditingProjectId(target.id);
    setEditProjectName(target.name);

    const channelMap: Record<string, boolean> = {};
    accounts.forEach((acc) => {
      channelMap[acc.id] = channelSelections[`${target.id}_${acc.id}`] ?? false;
    });
    setEditProjectChannels(channelMap);
  };

  // Save changes in Manage Project Modal
  const handleSaveManageProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProjectName.trim()) return;

    const chosenChannelIds = Object.keys(editProjectChannels).filter((id) => editProjectChannels[id]);

    // Update workspaces list
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === editingProjectId
          ? {
              ...ws,
              name: editProjectName.trim(),
              selectedChannelIds: chosenChannelIds,
            }
          : ws
      )
    );

    // Update channel selections
    setChannelSelections((prev) => {
      const updated = { ...prev };
      accounts.forEach((acc) => {
        updated[`${editingProjectId}_${acc.id}`] = editProjectChannels[acc.id] ?? false;
      });
      return updated;
    });

    setIsManageProjectModalOpen(false);
    showToast(`✓ บันทึกการตั้งค่าโปรเจกต์ "${editProjectName}" และแมป ${chosenChannelIds.length} ช่องทางสำเร็จ`);
  };

  // Delete project
  const handleDeleteProject = (wsId: string) => {
    if (workspaces.length <= 1) {
      alert('ไม่สามารถลบโปรเจกต์สุดท้ายในระบบได้ ต้องมีอย่างน้อย 1 โปรเจกต์');
      return;
    }
    const target = workspaces.find((w) => w.id === wsId);
    if (!confirm(`คุณต้องการลบโปรเจกต์ "${target?.name}" ออกจากระบบหรือไม่? ช่องทางต่างๆ จะยังคงอยู่ใน Master Hub`)) {
      return;
    }

    setWorkspaces((prev) => prev.filter((w) => w.id !== wsId));
    if (selectedWorkspaceId === wsId) {
      setSelectedWorkspaceId('ALL');
    }
    setIsManageProjectModalOpen(false);
    showToast(`✓ ลบโปรเจกต์ "${target?.name}" เรียบร้อยแล้ว`);
  };

  // Re-authenticate / Refresh Token
  const handleReauth = (acc: MasterChannelAccount) => {
    setAccounts((prev) =>
      prev.map((item) =>
        item.id === acc.id ? { ...item, lastSynced: 'Just now' } : item
      )
    );
    setOpenDropdownId(null);
    showToast(`✓ รีเฟรช Access Token สำหรับ "${acc.displayName}" สำเร็จ (Token Vault ปลอดภัย)`);
  };

  // Copy Channel ID
  const handleCopyId = (acc: MasterChannelAccount) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(acc.channelId);
    }
    setOpenDropdownId(null);
    showToast(`✓ คัดลอก Channel ID: "${acc.channelId}" แล้ว`);
  };

  // Disconnect Channel
  const handleConfirmDisconnect = () => {
    if (!disconnectCandidate) return;
    const id = disconnectCandidate.id;
    const name = disconnectCandidate.displayName;

    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setDisconnectCandidate(null);
    setOpenDropdownId(null);
    showToast(`✓ ตัดการเชื่อมต่อช่องทาง "${name}" เรียบร้อยแล้ว`);
  };

  // Quick Assign Channel to Project submit
  const handleAssignChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignCandidate) return;

    const targetWs = workspaces.find((w) => w.id === assignTargetWsId);
    if (!targetWs) return;

    // Update account's default workspace
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === assignCandidate.id
          ? { ...a, defaultWorkspaceId: targetWs.id, defaultWorkspaceName: targetWs.name }
          : a
      )
    );

    // Enable in target workspace
    setChannelSelections((prev) => ({
      ...prev,
      [`${targetWs.id}_${assignCandidate.id}`]: true,
    }));

    setAssignCandidate(null);
    showToast(`✓ กำหนดช่องทาง "${assignCandidate.displayName}" ให้โปรเจกต์ "${targetWs.name}" เรียบร้อยแล้ว`);
  };

  // Connect New Page / Channel submit
  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim()) return;

    const newId = `acc-${connectPlatform.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newAccount: MasterChannelAccount = {
      id: newId,
      platform: connectPlatform,
      displayName: newPageName.trim(),
      handle: newPageHandle.trim() || `@${newPageName.toLowerCase().replace(/\s+/g, '')}`,
      channelId: `${connectPlatform.toLowerCase()}_${Date.now().toString().slice(-6)}`,
      defaultWorkspaceId: selectedWorkspaceId === 'ALL' ? 'ws_capitalone' : selectedWorkspaceId,
      defaultWorkspaceName: activeWorkspace ? activeWorkspace.name : 'Capital One Real Estate',
      scopes: connectPlatform === 'FACEBOOK' ? ['pages_show_list', 'pages_manage_posts'] : ['content_publish'],
      expiresIn: 'Permanent Access Token (Active)',
      capabilities:
        connectPlatform === 'FACEBOOK'
          ? 'Page Timeline • Feed Albums • Stories'
          : connectPlatform === 'INSTAGRAM'
          ? 'Feed Carousel • Stories • Reels'
          : connectPlatform === 'TIKTOK'
          ? 'Vertical Video (9:16) • Direct Post'
          : 'Shorts & Long Videos',
      lastSynced: 'Just now',
      url: '#',
    };

    setAccounts((prev) => [newAccount, ...prev]);

    // Enable in current workspace
    const wsId = selectedWorkspaceId === 'ALL' ? 'ws_capitalone' : selectedWorkspaceId;
    setChannelSelections((prev) => ({
      ...prev,
      [`${wsId}_${newId}`]: true,
    }));

    setIsConnectModalOpen(false);
    setNewPageName('');
    setNewPageHandle('');
    showToast(`✓ เชื่อมต่อช่องทางใหม่ "${newAccount.displayName}" เข้าสู่ระบบเรียบร้อยแล้ว`);
  };

  // Open Connect Modal for a specific platform
  const handleOpenConnect = (platform: 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE') => {
    setConnectPlatform(platform);
    setNewPageName('');
    setNewPageHandle('');
    setIsConnectModalOpen(true);
  };

  // Handle Create New Project
  const handleCreateNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newWsId = `ws_proj_${Date.now()}`;
    const chosenChannelIds = Object.keys(newProjectSelectedChannels).filter(
      (id) => newProjectSelectedChannels[id]
    );

    const newProject: WorkspaceItem = {
      id: newWsId,
      name: newProjectName.trim(),
      category: 'ทั่วไป',
      icon: 'ws-software',
      selectedChannelIds: chosenChannelIds,
    };

    setWorkspaces((prev) => [...prev, newProject]);

    // Save channel permissions
    setChannelSelections((prev) => {
      const updated = { ...prev };
      for (const chId of chosenChannelIds) {
        updated[`${newWsId}_${chId}`] = true;
      }
      return updated;
    });

    setSelectedWorkspaceId(newWsId);
    setIsNewProjectModalOpen(false);
    setNewProjectName('');
    showToast(`✓ สร้างโปรเจกต์ "${newProject.name}" เรียบร้อยแล้ว (เปิดใช้งาน ${chosenChannelIds.length} ช่องทาง)`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Masthead Header */}
      <Masthead
        folio="PROJECT DIRECTORY / INTEGRATION MATRIX"
        editionDate="MULTI-WORKSPACE & CHANNELS"
        title="Connected Channels & Project Hub"
        subtitle="Manage publication endpoints and map them into Projects with Zero-Touch API safety and flexible routing."
      />

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-semantic-success/10 border border-semantic-success/20 rounded-card flex items-center gap-3 text-xs text-semantic-success font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-semantic-error/10 border border-semantic-error/20 rounded-card flex items-center gap-3 text-xs text-semantic-error font-medium animate-in fade-in">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {feedbackNotice && (
        <div className="p-3.5 bg-paper-canvas border-l-4 border-brand-indigo rounded-editorial shadow-xs flex items-center justify-between text-xs font-mono text-ink-primary animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-brand-indigo shrink-0" />
            <span>{feedbackNotice}</span>
          </div>
          <button onClick={() => setFeedbackNotice(null)} className="text-ink-secondary hover:text-ink-primary cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROJECT COMMAND BAR & INTELLIGENCE HEADER (Comprehensive, Clean UX/UI)    */}
      {/* ========================================================================= */}
      <div className="bg-paper-raised border border-border-rule rounded-card p-4 shadow-xs space-y-3.5">
        {/* Top Row: Smart Project Selector Dropdown + Live Scope Metadata + Project Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          {/* Left: Project Selector Dropdown + Metadata */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Interactive Project Switcher Dropdown */}
            <div className="relative" ref={projectDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="px-3.5 py-2 bg-paper-canvas border border-border-rule rounded-editorial flex items-center gap-2.5 hover:border-brand-indigo/60 transition-colors shadow-2xs cursor-pointer group text-left"
              >
                {selectedWorkspaceId === 'ALL' ? (
                  <div className="w-5 h-5 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <Sticker name={activeWorkspace?.icon || 'ws-software'} size="xs" inline />
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-xs sm:text-sm text-ink-primary">
                      {selectedWorkspaceId === 'ALL' ? 'Master Hub (รวมทุกบัญชี)' : activeWorkspace?.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-ink-secondary group-hover:text-ink-primary transition-transform duration-150 shrink-0" />
                  </div>
                  <p className="text-[10px] font-mono text-ink-secondary">
                    {selectedWorkspaceId === 'ALL'
                      ? `${accounts.length} ช่องทางในระบบ • สรุปภาพรวม`
                      : `${currentProjectActiveCount} ช่องทางที่เปิดใช้งาน`}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProjectDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 bg-paper-raised border border-border-strong rounded-editorial shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs font-mono space-y-1">
                  <div className="px-2 py-1 text-[9px] uppercase text-ink-secondary font-bold">
                    สลับขอบเขตโปรเจกต์ (Select Project Scope):
                  </div>

                  {/* Master Hub Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWorkspaceId('ALL');
                      setIsProjectDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors cursor-pointer ${
                      selectedWorkspaceId === 'ALL'
                        ? 'bg-paper-canvas text-brand-indigo font-bold border border-brand-indigo/20 shadow-2xs'
                        : 'hover:bg-paper-subtle text-ink-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center shrink-0">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold leading-tight truncate">Master Hub (รวมทุกบัญชี)</p>
                        <p className="text-[10px] text-ink-secondary">ทุกช่องทาง ({accounts.length} endpoints)</p>
                      </div>
                    </div>
                    {selectedWorkspaceId === 'ALL' && <Check className="w-3.5 h-3.5 text-brand-indigo shrink-0" />}
                  </button>

                  {/* Project Items */}
                  {workspaces.map((ws) => {
                    const isSelected = selectedWorkspaceId === ws.id;
                    const wsCount = accounts.filter(
                      (a) => channelSelections[`${ws.id}_${a.id}`]
                    ).length;

                    return (
                      <button
                        key={ws.id}
                        type="button"
                        onClick={() => {
                          setSelectedWorkspaceId(ws.id);
                          setIsProjectDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-paper-canvas text-brand-indigo font-bold border border-brand-indigo/20 shadow-2xs'
                            : 'hover:bg-paper-subtle text-ink-primary'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Sticker name={ws.icon} size="xs" inline />
                          <div className="truncate">
                            <p className="font-semibold leading-tight truncate">{ws.name}</p>
                            <p className="text-[10px] text-ink-secondary">{wsCount} ช่องทางเปิดใช้งาน</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-indigo shrink-0" />}
                      </button>
                    );
                  })}

                  <div className="pt-1 border-t border-border-rule space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProjectDropdownOpen(false);
                        handleOpenManageProjectModal(selectedWorkspaceId === 'ALL' ? workspaces[0]?.id : selectedWorkspaceId);
                      }}
                      className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary text-left cursor-pointer text-[11px]"
                    >
                      <Sliders className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
                      <span>จัดการโปรเจกต์ & แมปช่องทาง...</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProjectDropdownOpen(false);
                        setIsNewProjectModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-paper-subtle text-brand-indigo text-left cursor-pointer font-semibold text-[11px]"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" />
                      <span>สร้างโปรเจกต์ใหม่...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Context Metadata Pill */}
            {selectedWorkspaceId !== 'ALL' && activeWorkspace && (
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-paper-canvas border border-border-rule text-ink-secondary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse" />
                  <span>{currentProjectActiveCount} จาก {accounts.length} ช่องทางเปิดใช้</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Zero-Touch: {currentProjectBypassedCount} ช่องทางถูกข้าม 100%</span>
                </span>
              </div>
            )}
          </div>

          {/* Right: Quick Project Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
            {selectedWorkspaceId !== 'ALL' && (
              <button
                type="button"
                onClick={() => handleOpenManageProjectModal(selectedWorkspaceId)}
                className="px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule rounded-editorial text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer text-ink-primary shadow-2xs"
                title="แก้ไขชื่อ หมวดหมู่ และติ๊กแมปช่องทางของโปรเจกต์นี้"
              >
                <Sliders className="w-3.5 h-3.5 text-brand-indigo" />
                <span>แมปช่องทางโปรเจกต์</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(true)}
              className="px-3 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>สร้าง Project ใหม่</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Scope Filter (All vs Active vs Bypassed) + Search + Layout Switcher */}
        <div className="pt-2.5 border-t border-border-rule flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
          {/* Filter Pills when Project selected */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[10px] uppercase text-ink-secondary mr-1 font-bold shrink-0">แสดง:</span>
            {[
              { id: 'ALL', label: `ทั้งหมด (${accounts.length})` },
              ...(selectedWorkspaceId !== 'ALL' ? [
                { id: 'ACTIVE', label: `✓ เปิดใน ${activeWorkspace?.name} (${currentProjectActiveCount})` },
                { id: 'BYPASSED', label: `⚪ ข้าม API (${currentProjectBypassedCount})` },
              ] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setChannelFilterMode(tab.id as any)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  channelFilterMode === tab.id
                    ? 'bg-brand-indigo text-white font-bold shadow-2xs'
                    : 'bg-paper-canvas text-ink-secondary border border-border-rule hover:text-ink-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Side: View Layout (Grid 2x2 vs List) + Channel Search Input */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between md:justify-end">
            {/* View Mode Toggle: Grid 2x2 vs List */}
            <div className="flex items-center p-0.5 bg-paper-canvas border border-border-rule rounded-editorial shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewLayout('GRID')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewLayout === 'GRID'
                    ? 'bg-brand-indigo text-white font-bold shadow-2xs'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
                title="มุมมองแบบตาราง 2x2 (Grid 2x2 View)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid 2×2</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('LIST')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewLayout === 'LIST'
                    ? 'bg-brand-indigo text-white font-bold shadow-2xs'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
                title="มุมมองแบบรายการยาว (Full-width List View)"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {/* Channel Search Input */}
            <div className="relative w-full sm:w-56 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาเพจ หรือแฮนเดิล..."
                className="w-full pl-8 pr-7 py-1.5 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary placeholder:text-ink-secondary/60 focus:outline-hidden focus:border-brand-indigo"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink-primary cursor-pointer p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PLATFORM GROUPED SECTIONS (User Requested Layout: Grid 2x2 or List)       */}
      {/* ========================================================================= */}
      <div className={
        viewLayout === 'GRID'
          ? 'grid grid-cols-1 xl:grid-cols-2 gap-5 items-start'
          : 'space-y-6'
      }>
        {PLATFORM_CONFIGS.map((platform) => {
          const platformAccounts = displayedAccounts.filter((a) => a.platform === platform.id);
          const totalInPlatform = accounts.filter((a) => a.platform === platform.id).length;

          return (
            <div
              key={platform.id}
              className="bg-paper-raised border border-border-rule rounded-card shadow-xs relative"
            >
              {/* Platform Header */}
              <div className="p-4 bg-paper-canvas/70 border-b border-border-rule rounded-t-card flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-editorial flex items-center justify-center bg-paper-raised border border-border-rule shadow-2xs shrink-0">
                    {platform.icon(22)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif font-bold text-base text-ink-primary">
                        {platform.name}
                      </h2>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${platform.badgeColor}`}>
                        {totalInPlatform} {platform.id === 'YOUTUBE' ? 'Channels' : 'Pages'}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-ink-secondary">
                      {platform.subtitle}
                    </p>
                  </div>
                </div>

                {/* Add Page Button (+) */}
                <button
                  type="button"
                  onClick={() => handleOpenConnect(platform.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial text-xs font-mono font-semibold transition-colors shadow-2xs cursor-pointer shrink-0 active:scale-95"
                  title={`เชื่อมต่อ ${platform.name} เพิ่มเติม`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{platform.addButtonText}</span>
                </button>
              </div>

              {/* Pages / Channels List */}
              {platformAccounts.length === 0 ? (
                <div className="p-6 text-center space-y-2 bg-paper-canvas/30 rounded-b-card">
                  <p className="text-xs font-mono text-ink-secondary">
                    {searchQuery
                      ? `ไม่พบบัญชี ${platform.name} ที่ตรงกับคำค้นหา "${searchQuery}"`
                      : channelFilterMode !== 'ALL'
                      ? `ไม่มีบัญชี ${platform.name} ในสถานะที่เลือก (${channelFilterMode})`
                      : `ยังไม่มีบัญชี ${platform.name} เชื่อมต่ออยู่ในระบบ`}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenConnect(platform.id)}
                    className="text-xs font-mono text-brand-indigo hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>คลิกเพื่อเชื่อมต่อ {platform.name} ตอนนี้</span>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-border-rule/60">
                  {platformAccounts.map((acc, accIdx) => {
                    const currentWsId = selectedWorkspaceId === 'ALL' ? acc.defaultWorkspaceId : selectedWorkspaceId;
                    const key = `${currentWsId}_${acc.id}`;
                    const isEnabledInCurrentWs = channelSelections[key] ?? (selectedWorkspaceId === 'ALL' ? true : false);
                    const defaultWsObj = workspaces.find((w) => w.id === acc.defaultWorkspaceId);
                    const isNearBottom = accIdx >= Math.max(1, platformAccounts.length - 2);

                    return (
                      <div
                        key={acc.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 transition-colors gap-3 last:rounded-b-card ${
                          openDropdownId === acc.id ? 'z-30 relative ring-1 ring-brand-indigo/30 bg-paper-canvas/60' : ''
                        } ${
                          isEnabledInCurrentWs
                            ? 'bg-paper-raised hover:bg-paper-canvas/40'
                            : 'bg-paper-subtle/30 hover:bg-paper-subtle/50 opacity-80'
                        }`}
                      >
                        {/* Left: Avatar + Display Name + Handle + ID + Format Badges */}
                        <div className="flex items-start sm:items-center gap-3 min-w-0">
                          {/* Channel Avatar with Platform Sub-badge */}
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full bg-paper-subtle border border-border-rule flex items-center justify-center font-bold font-serif text-sm text-brand-indigo shadow-2xs">
                              {acc.displayName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-paper-raised p-0.5 rounded-full shadow-2xs border border-border-rule">
                              <SocialPlatformIcon platform={acc.platform} size={13} />
                            </div>
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-serif font-bold text-sm text-ink-primary truncate">
                                {acc.displayName}
                              </h3>
                              <span className="text-[10px] font-mono text-ink-muted">
                                ID: {acc.channelId}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-ink-secondary">
                              <span className="text-brand-indigo font-medium truncate">
                                {acc.handle}
                              </span>
                              <span>•</span>
                              <span className="text-[10px] text-ink-muted">
                                Synced {acc.lastSynced}
                              </span>
                            </div>

                            {/* Format & Capability Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              {acc.capabilities.split('•').slice(0, 3).map((cap, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-paper-canvas border border-border-rule text-ink-secondary"
                                >
                                  {cap.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Workspace Badge + Active/Bypass Switch + (...) Menu */}
                        <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-center shrink-0">
                          {/* Workspace Project Assignment Pill */}
                          <div className={`${
                            viewLayout === 'GRID' ? 'hidden 2xl:flex' : 'hidden md:flex'
                          } items-center gap-1.5 px-2.5 py-1 rounded bg-paper-canvas border border-border-rule text-xs font-mono shadow-2xs`}>
                            <Sticker name={defaultWsObj?.icon || 'ws-software'} size="xs" inline />
                            <span className="text-[11px] text-ink-secondary font-medium truncate max-w-[140px]">
                              {defaultWsObj?.name || acc.defaultWorkspaceName}
                            </span>
                          </div>

                          {/* Zero-Touch Bypass Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => handleToggleChannelForWorkspace(acc.id, currentWsId)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                              isEnabledInCurrentWs
                                ? 'bg-semantic-success/15 text-semantic-success border-semantic-success/30 hover:bg-semantic-success/25'
                                : 'bg-paper-subtle text-ink-muted border-border-rule hover:bg-paper-canvas'
                            }`}
                            title={
                              isEnabledInCurrentWs
                                ? `คลิกเพื่อปิดใช้งานใน ${selectedWorkspaceId === 'ALL' ? defaultWsObj?.name : activeWorkspace?.name} (Bypass ข้าม API ไม่เกิด Error)`
                                : `คลิกเพื่อเปิดใช้งานใน ${selectedWorkspaceId === 'ALL' ? defaultWsObj?.name : activeWorkspace?.name}`
                            }
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isEnabledInCurrentWs ? 'bg-semantic-success animate-pulse' : 'bg-ink-muted'
                            }`} />
                            <span>
                              {selectedWorkspaceId !== 'ALL'
                                ? isEnabledInCurrentWs ? 'Active' : 'Bypassed'
                                : isEnabledInCurrentWs ? 'พร้อมใช้งาน' : 'ข้าม API'}
                            </span>
                          </button>

                          {/* Action Menu (...) */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setOpenDropdownId(openDropdownId === acc.id ? null : acc.id)}
                              className="w-8 h-8 rounded-editorial border border-border-rule hover:border-brand-indigo/60 bg-paper-canvas hover:bg-paper-subtle flex items-center justify-center text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer shadow-2xs"
                              title="ตัวเลือกเพิ่มเติม (...)"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Dropdown Popover */}
                            {openDropdownId === acc.id && (
                              <div
                                ref={dropdownRef}
                                className={`absolute right-0 ${
                                  isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                } w-56 bg-paper-raised border border-border-strong rounded-editorial shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs font-mono space-y-0.5`}
                              >
                                <div className="px-2 py-1 text-[9px] font-mono uppercase text-ink-secondary font-bold border-b border-border-rule mb-1 flex items-center justify-between">
                                  <span>{acc.platform} OPTIONS</span>
                                  <span className="text-[8px] text-brand-indigo truncate max-w-[100px]">{defaultWsObj?.name}</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleReauth(acc)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-paper-subtle text-ink-primary text-left transition-colors cursor-pointer"
                                >
                                  <RefreshCw className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
                                  <span>รีเฟรช Token (Sync)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setTestApiAccount(acc);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-paper-subtle text-ink-primary text-left transition-colors cursor-pointer"
                                >
                                  <Activity className="w-3.5 h-3.5 text-semantic-info shrink-0" />
                                  <span>ทดสอบ API Connection</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setAssignCandidate(acc);
                                    setAssignTargetWsId(acc.defaultWorkspaceId);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-paper-subtle text-ink-primary text-left transition-colors cursor-pointer"
                                >
                                  <Building2 className="w-3.5 h-3.5 text-accent-terracotta shrink-0" />
                                  <span>กำหนดโปรเจกต์หลัก...</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCopyId(acc)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-paper-subtle text-ink-primary text-left transition-colors cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5 text-ink-secondary shrink-0" />
                                  <span>คัดลอก Channel ID</span>
                                </button>

                                {acc.url && (
                                  <a
                                    href={acc.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => setOpenDropdownId(null)}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-paper-subtle text-ink-primary text-left transition-colors cursor-pointer"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 text-ink-secondary shrink-0" />
                                    <span>เปิดดูหน้าเพจจริง ↗</span>
                                  </a>
                                )}

                                <div className="pt-1 border-t border-border-rule">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDisconnectCandidate(acc);
                                      setOpenDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-semantic-error/10 text-semantic-error text-left transition-colors cursor-pointer font-semibold"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                    <span>ยกเลิกการเชื่อมต่อ</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
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

      {/* ========================================================================= */}
      {/* MODAL 1: CONNECT NEW PAGE / CHANNEL (+)                                   */}
      {/* ========================================================================= */}
      {isConnectModalOpen && (
        <div
          onClick={() => setIsConnectModalOpen(false)}
          className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border border-border-rule rounded-card max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 cursor-default"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-paper-canvas border border-border-rule flex items-center justify-center shadow-2xs">
                  <SocialPlatformIcon platform={connectPlatform} size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-ink-primary">
                    เชื่อมต่อ {connectPlatform === 'FACEBOOK' ? 'Facebook Page' : connectPlatform === 'INSTAGRAM' ? 'Instagram Account' : connectPlatform === 'TIKTOK' ? 'TikTok Account' : 'YouTube Channel'} ใหม่
                  </h3>
                  <p className="text-[11px] font-mono text-ink-secondary">
                    ดึง Endpoint เข้าสู่ Master Hub พร้อมเชื่อมต่อ Token Vault
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConnectModalOpen(false)}
                className="p-1 rounded text-ink-secondary hover:text-ink-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Preset Selector */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold block">
                เลือกเพจตัวอย่างจาก Meta/Google ที่ตรวจพบ:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                {connectPlatform === 'FACEBOOK' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setNewPageName('The Rich Sathorn-Taksin');
                        setNewPageHandle('FB Page: The Rich Sathorn');
                      }}
                      className="p-2 text-left rounded bg-paper-canvas border border-border-rule hover:border-brand-indigo/60 transition-colors"
                    >
                      <p className="font-bold text-ink-primary text-xs truncate">The Rich Sathorn</p>
                      <p className="text-[9px] text-ink-muted">Ready to import</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewPageName('Capital One Phuket Villas');
                        setNewPageHandle('FB Page: Capital One Phuket');
                      }}
                      className="p-2 text-left rounded bg-paper-canvas border border-border-rule hover:border-brand-indigo/60 transition-colors"
                    >
                      <p className="font-bold text-ink-primary text-xs truncate">Phuket Luxury Villas</p>
                      <p className="text-[9px] text-ink-muted">Ready to import</p>
                    </button>
                  </>
                ) : connectPlatform === 'INSTAGRAM' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setNewPageName('The Penthouse Studio BKK');
                        setNewPageHandle('@penthouse.bkk');
                      }}
                      className="p-2 text-left rounded bg-paper-canvas border border-border-rule hover:border-brand-indigo/60 transition-colors"
                    >
                      <p className="font-bold text-ink-primary text-xs truncate">Penthouse Studio</p>
                      <p className="text-[9px] text-ink-muted">Business IG Account</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewPageName('RetzPost Creators Hub');
                        setNewPageHandle('@retzpost.creators');
                      }}
                      className="p-2 text-left rounded bg-paper-canvas border border-border-rule hover:border-brand-indigo/60 transition-colors"
                    >
                      <p className="font-bold text-ink-primary text-xs truncate">Creators Hub</p>
                      <p className="text-[9px] text-ink-muted">Creator IG Account</p>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setNewPageName('RetzPost Official Media');
                        setNewPageHandle('@retzpost_media');
                      }}
                      className="col-span-2 p-2 text-left rounded bg-paper-canvas border border-border-rule hover:border-brand-indigo/60 transition-colors"
                    >
                      <p className="font-bold text-ink-primary text-xs">RetzPost Official Studio</p>
                      <p className="text-[9px] text-ink-muted">Verified Enterprise Channel</p>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleConnectSubmit} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-[11px] uppercase text-ink-secondary mb-1">
                  ชื่อเพจ / ช่องทาง (Display Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น: The Rich Rama 9 Luxury Club"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-sans text-xs text-ink-primary focus:outline-hidden focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-ink-secondary mb-1">
                  แฮนเดิล / Username (Handle)
                </label>
                <input
                  type="text"
                  placeholder="เช่น: @therichrama9_official"
                  value={newPageHandle}
                  onChange={(e) => setNewPageHandle(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs text-ink-primary focus:outline-hidden focus:border-brand-indigo"
                />
              </div>

              <div className="p-3 bg-brand-indigo/5 border border-brand-indigo/20 rounded-editorial text-[11px] text-ink-secondary leading-relaxed">
                ระบบจะสร้าง Long-Lived Token และจัดเก็บใน Token Vault พร้อมสิทธิ์ในการโพสต์รูปภาพ, วิดีโอ, และ Story แบบอัตโนมัติ
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-rule">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-3.5 py-2 border border-border-rule rounded-editorial text-ink-secondary hover:text-ink-primary cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  ยืนยันและเชื่อมต่อ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MANAGE & MAP PROJECT CHANNELS (Comprehensive Project Matrix)     */}
      {/* ========================================================================= */}
      {isManageProjectModalOpen && (
        <div
          onClick={() => setIsManageProjectModalOpen(false)}
          className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border border-border-rule rounded-card max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-rule shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-ink-primary">
                    จัดการโปรเจกต์ & แมปช่องทาง (Project Channel Matrix)
                  </h3>
                  <p className="text-[11px] font-mono text-ink-secondary">
                    เลือกช่องทางที่อนุญาตให้โพสต์ในโปรเจกต์นี้ (ช่องทางที่เหลือจะถูกข้าม API 100%)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManageProjectModalOpen(false)}
                className="p-1 rounded-editorial border border-border-rule hover:bg-paper-subtle text-ink-secondary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Project Selector Dropdown (อิงตาม project ที่ active) */}
            <div className="p-3 bg-paper-canvas border border-border-rule rounded-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Sliders className="w-4 h-4 text-brand-indigo shrink-0" />
                <label htmlFor="modal-project-selector" className="font-mono text-xs font-bold text-ink-primary uppercase shrink-0">
                  เลือกโปรเจกต์:
                </label>
              </div>
              <div className="relative flex-1 sm:max-w-xs">
                <select
                  id="modal-project-selector"
                  value={editingProjectId}
                  onChange={(e) => handleSwitchEditingProjectInModal(e.target.value)}
                  className="w-full px-3 py-1.5 bg-paper-raised border border-border-rule rounded-editorial font-serif text-xs font-bold text-brand-indigo focus:outline-hidden focus:border-brand-indigo cursor-pointer shadow-2xs"
                >
                  {workspaces.map((ws) => {
                    const wsCount = accounts.filter((a) => channelSelections[`${ws.id}_${a.id}`]).length;
                    return (
                      <option key={ws.id} value={ws.id}>
                        {ws.name} ({wsCount} ช่องทาง)
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveManageProject} className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs font-mono">
              {/* Project Name */}
              <div>
                <label className="block text-[11px] uppercase text-ink-secondary font-bold mb-1">
                  ชื่อโปรเจกต์ (Project Name) *
                </label>
                <input
                  type="text"
                  required
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-serif text-xs font-bold text-ink-primary focus:outline-hidden focus:border-brand-indigo shadow-2xs"
                />
              </div>

              {/* Channel Mapping Matrix Checklist */}
              <div className="space-y-2 pt-2 border-t border-border-rule">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] uppercase text-ink-secondary font-bold">
                      ติ๊กเลือกช่องทางที่เปิดใช้งานในโปรเจกต์นี้:
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      {Object.values(editProjectChannels).filter(Boolean).length} จาก {accounts.length} ช่องทางเปิดใช้งาน
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        const allSelected: Record<string, boolean> = {};
                        accounts.forEach((a) => (allSelected[a.id] = true));
                        setEditProjectChannels(allSelected);
                      }}
                      className="text-brand-indigo hover:underline cursor-pointer"
                    >
                      เลือกทั้งหมด
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => setEditProjectChannels({})}
                      className="text-ink-muted hover:text-ink-primary cursor-pointer"
                    >
                      ล้างทั้งหมด
                    </button>
                  </div>
                </div>

                {/* Grouped channels list by platform */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {PLATFORM_CONFIGS.map((platform) => {
                    const chs = accounts.filter((a) => a.platform === platform.id);
                    if (chs.length === 0) return null;

                    return (
                      <div key={platform.id} className="p-2.5 bg-paper-canvas border border-border-rule rounded-editorial space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink-secondary uppercase">
                          <SocialPlatformIcon platform={platform.id} size={14} />
                          <span>{platform.name} ({chs.length})</span>
                        </div>

                        <div className="space-y-1">
                          {chs.map((acc) => {
                            const isChecked = editProjectChannels[acc.id] ?? false;
                            return (
                              <label
                                key={acc.id}
                                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'bg-brand-indigo/5 border-brand-indigo/30'
                                    : 'bg-paper-raised/60 border-border-rule opacity-60 hover:opacity-100'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) =>
                                      setEditProjectChannels((prev) => ({
                                        ...prev,
                                        [acc.id]: e.target.checked,
                                      }))
                                    }
                                    className="w-4 h-4 rounded text-brand-indigo border-border-rule focus:ring-brand-indigo cursor-pointer shrink-0"
                                  />
                                  <div className="truncate">
                                    <p className="font-bold text-ink-primary text-xs truncate">
                                      {acc.displayName}
                                    </p>
                                    <p className="text-[10px] text-ink-secondary truncate">
                                      {acc.handle}
                                    </p>
                                  </div>
                                </div>

                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                                  isChecked
                                    ? 'bg-semantic-success/15 text-semantic-success font-bold'
                                    : 'bg-paper-subtle text-ink-muted'
                                }`}>
                                  {isChecked ? 'Active' : 'Bypass'}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zero-Touch API Safety Callout */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-editorial text-[11px] text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero-Touch Bypass:</strong> ช่องทางที่ไม่ได้ติ๊กเลือกจะถูกกันออกจากการทำงานของระบบอย่างสิ้นเชิง ทำให้หน้าเขียนโพสต์และคิวทำงานสะอาด ไม่มี Error ข้ามโปรเจกต์
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-border-rule flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => handleDeleteProject(editingProjectId)}
                  className="px-3 py-1.5 text-semantic-error hover:bg-semantic-error/10 rounded-editorial transition-colors cursor-pointer text-xs"
                >
                  ลบโปรเจกต์นี้
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsManageProjectModalOpen(false)}
                    className="px-3.5 py-1.5 border border-border-rule rounded-editorial text-ink-secondary hover:text-ink-primary cursor-pointer text-xs"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial font-semibold cursor-pointer shadow-xs transition-colors text-xs"
                  >
                    บันทึกและปรับใช้
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: QUICK ASSIGN CHANNEL TO PROJECT                                  */}
      {/* ========================================================================= */}
      {assignCandidate && (
        <div
          onClick={() => setAssignCandidate(null)}
          className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border border-border-rule rounded-card max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-ink-primary">
                    กำหนดโปรเจกต์หลัก
                  </h3>
                  <p className="text-[11px] font-mono text-ink-secondary">
                    {assignCandidate.displayName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssignCandidate(null)}
                className="p-1 rounded text-ink-secondary hover:text-ink-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignChannelSubmit} className="space-y-3.5 text-xs font-mono">
              <span className="text-[11px] uppercase text-ink-secondary block font-bold">
                เลือกโปรเจกต์หลักที่ต้องการผูกช่องทางนี้:
              </span>

              <div className="space-y-1.5">
                {workspaces.map((ws) => (
                  <label
                    key={ws.id}
                    className={`flex items-center justify-between p-2.5 rounded border cursor-pointer transition-colors ${
                      assignTargetWsId === ws.id
                        ? 'bg-brand-indigo/10 border-brand-indigo ring-1 ring-brand-indigo/30'
                        : 'bg-paper-canvas border-border-rule hover:bg-paper-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <input
                        type="radio"
                        name="target_ws"
                        value={ws.id}
                        checked={assignTargetWsId === ws.id}
                        onChange={() => setAssignTargetWsId(ws.id)}
                        className="text-brand-indigo focus:ring-brand-indigo cursor-pointer"
                      />
                      <Sticker name={ws.icon} size="xs" inline />
                      <div className="truncate">
                        <p className="font-bold text-ink-primary truncate">{ws.name}</p>
                        <p className="text-[10px] text-ink-secondary">{ws.category}</p>
                      </div>
                    </div>
                    {assignTargetWsId === ws.id && <Check className="w-3.5 h-3.5 text-brand-indigo shrink-0" />}
                  </label>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-rule">
                <button
                  type="button"
                  onClick={() => setAssignCandidate(null)}
                  className="px-3.5 py-1.5 border border-border-rule rounded-editorial text-ink-secondary hover:text-ink-primary cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  บันทึกการผูกโปรเจกต์
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: TEST API CONNECTION DIAGNOSTIC                                   */}
      {/* ========================================================================= */}
      {testApiAccount && (
        <div
          onClick={() => setTestApiAccount(null)}
          className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border border-border-rule rounded-card max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-semantic-info/10 text-semantic-info flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-ink-primary">
                    ผลการทดสอบ API Connection
                  </h3>
                  <p className="text-[11px] font-mono text-ink-secondary">
                    {testApiAccount.displayName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTestApiAccount(null)}
                className="p-1 rounded text-ink-secondary hover:text-ink-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 bg-semantic-success/10 border border-semantic-success/30 rounded-editorial text-semantic-success space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ping Status: 200 OK</span>
                  </span>
                  <span>Latency: 42ms</span>
                </div>
                <p className="text-[11px] text-ink-secondary">
                  Meta Graph API / Endpoints ตอบสนองปกติ พร้อมส่งข้อมูลไปยังฟีดทันที
                </p>
              </div>

              <div className="p-3 bg-paper-canvas border border-border-rule rounded-editorial space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Target Platform:</span>
                  <span className="font-bold text-ink-primary">{testApiAccount.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Channel ID:</span>
                  <span className="font-mono text-ink-primary">{testApiAccount.channelId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Token Vault Health:</span>
                  <span className="text-semantic-success font-semibold">{testApiAccount.expiresIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Encryption:</span>
                  <span className="text-brand-indigo font-semibold">AES-256-GCM Envelope Verified</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-border-rule">
              <button
                type="button"
                onClick={() => setTestApiAccount(null)}
                className="px-4 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial font-mono text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DISCONNECT CHANNEL CONFIRMATION                                  */}
      {/* ========================================================================= */}
      {disconnectCandidate && (
        <div
          onClick={() => setDisconnectCandidate(null)}
          className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border border-border-rule rounded-card max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 cursor-default"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-border-rule text-semantic-error">
              <div className="w-9 h-9 rounded-full bg-semantic-error/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-semantic-error" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-ink-primary">
                  ยืนยันการตัดการเชื่อมต่อ
                </h3>
                <p className="text-[11px] font-mono text-ink-secondary">
                  {disconnectCandidate.displayName}
                </p>
              </div>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed font-sans">
              คุณต้องการตัดการเชื่อมต่อเพจ <strong>{disconnectCandidate.displayName}</strong> ออกจากระบบ RetzPost ใช่หรือไม่? บัญชีนี้จะไม่สามารถรับคิวหรือยิงโพสต์อัตโนมัติได้จนกว่าจะเชื่อมต่อใหม่
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-rule text-xs font-mono">
              <button
                type="button"
                onClick={() => setDisconnectCandidate(null)}
                className="px-3.5 py-2 border border-border-rule rounded-editorial text-ink-secondary hover:text-ink-primary cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDisconnect}
                className="px-4 py-2 bg-semantic-error hover:bg-semantic-error/90 text-white rounded-editorial font-semibold cursor-pointer shadow-xs transition-colors"
              >
                ตัดการเชื่อมต่อทันที
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: CREATE NEW PROJECT & SELECT CHANNELS                             */}
      {/* ========================================================================= */}
      {isNewProjectModalOpen && (
        <div 
          onClick={() => setIsNewProjectModalOpen(false)}
          className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-paper-raised border border-border-rule rounded-card max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-rule shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-ink-primary">
                    สร้าง Project ใหม่ พร้อมติ๊กเลือกช่องทาง
                  </h3>
                  <p className="text-[11px] font-mono text-ink-secondary">
                    เลือกเฉพาะช่องทางและเพจที่โปรเจกต์นี้ใช้งานจริง (ช่องที่ไม่เลือกจะ Bypass 100%)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1 rounded-editorial border border-border-rule hover:bg-paper-subtle text-ink-secondary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateNewProject} className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
              {/* Project Name */}
              <div>
                <label className="block font-mono text-[11px] uppercase text-ink-secondary mb-1">
                  ชื่อโปรเจกต์ (Project Name) *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="เช่น: Whizdom Luxury Suites, Acme Podcast..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-serif text-sm text-ink-primary placeholder:text-ink-muted focus:outline-hidden focus:border-brand-indigo"
                />
              </div>



              {/* Channel Checkbox Directory */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-[11px] uppercase text-ink-secondary font-bold">
                    ติ๊กเลือกช่องทางที่ต้องการเปิดใช้งานในโปรเจกต์นี้:
                  </label>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        const allSelected: Record<string, boolean> = {};
                        accounts.forEach((a) => (allSelected[a.id] = true));
                        setNewProjectSelectedChannels(allSelected);
                      }}
                      className="text-brand-indigo hover:underline cursor-pointer"
                    >
                      เลือกทั้งหมด
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => setNewProjectSelectedChannels({})}
                      className="text-ink-muted hover:text-ink-primary cursor-pointer"
                    >
                      ล้างทั้งหมด
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-paper-canvas border border-border-rule rounded-editorial space-y-2 max-h-48 overflow-y-auto">
                  {accounts.map((acc) => {
                    const isChecked = newProjectSelectedChannels[acc.id] ?? false;

                    return (
                      <label
                        key={acc.id}
                        className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-brand-indigo/5 border-brand-indigo/30'
                            : 'bg-paper-subtle/50 border-border-rule/60 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              setNewProjectSelectedChannels((prev) => ({
                                ...prev,
                                [acc.id]: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 rounded text-brand-indigo border-border-rule focus:ring-brand-indigo cursor-pointer"
                          />
                          <SocialPlatformIcon platform={acc.platform} size={16} />
                          <div className="min-w-0">
                            <p className="font-serif font-bold text-xs text-ink-primary truncate">
                              {acc.displayName}
                            </p>
                            <p className="text-[10px] font-mono text-ink-secondary truncate">
                              {acc.handle}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isChecked
                            ? 'bg-semantic-success/15 text-semantic-success font-bold'
                            : 'bg-paper-subtle text-ink-muted'
                        }`}>
                          {isChecked ? 'เปิดใช้' : 'ข้าม API'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Zero Error Guarantee Notice */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-editorial text-[11px] font-mono text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>การันตีความปลอดภัย:</strong> ช่องทางที่ไม่ได้ติ๊ก ระบบจะไม่ยุ่ง ไม่ยิง API ข้ามไป และไม่เกิด Error ใดๆ ทั้งสิ้น (Zero-Touch Bypass)
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-border-rule flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 border border-border-rule rounded-editorial font-mono text-ink-secondary hover:text-ink-primary cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial font-mono font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  สร้างโปรเจกต์และเปิดใช้งาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
