'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert,
  CheckCircle2, 
  Clock, 
  Trash2, 
  Mail, 
  Search, 
  Sliders, 
  Check, 
  X, 
  Building2, 
  Eye, 
  Send, 
  Lock, 
  Unlock,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Coins
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
import { useTranslation } from '@/modules/i18n/i18n-context';
import { Sticker } from '@/components/ui/sticker';
import { getCurrentUser, subscribeToAuthChange } from '@/modules/auth/auth-service';
import { AuthUser } from '@/modules/auth/auth-types';
import { 
  isMockDataCleared, 
  loadSampleMockData, 
  clearAllMockData, 
  subscribeToMockDataChange 
} from '@/modules/data/mock-data-manager';
import { EditorialEmptyState } from '@/components/ui/editorial-empty-state';
import { 
  WorkspaceRole, 
  PermissionKey, 
  RoleDefinition, 
  ROLE_DEFINITIONS, 
  ALL_PERMISSIONS, 
  TeamMember, 
  getInitialTeamMembers, 
  saveTeamMembers, 
  inviteTeamMember, 
  hasPermission 
} from '@/modules/workspaces/team-roles';

export default function TeamSettingsPage() {
  const { t, locale } = useTranslation();
  const [members, setMembers] = useState<TeamMember[]>(() => getInitialTeamMembers());
  const [selectedWorkspace, setSelectedWorkspace] = useState<'ALL' | 'ws_capitalone' | 'ws_acme' | 'ws_retzpost' | 'ws_coffee'>('ALL');
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'MATRIX' | 'SIMULATOR' | 'TOKEN_TRACKER'>('MEMBERS');
  const [selectedMemberForLogs, setSelectedMemberForLogs] = useState<TeamMember | null>(null);
  const [editingLimitMemberId, setEditingLimitMemberId] = useState<string | null>(null);
  const [newLimitValue, setNewLimitValue] = useState<string>('100');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | WorkspaceRole>('ALL');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isMockCleared, setIsMockCleared] = useState<boolean>(true);

  React.useEffect(() => {
    setCurrentUser(getCurrentUser());
    setIsMockCleared(isMockDataCleared());
    setMembers(getInitialTeamMembers());

    const unsubAuth = subscribeToAuthChange((user) => {
      setCurrentUser(user);
    });
    const unsubMock = subscribeToMockDataChange((cleared) => {
      setIsMockCleared(cleared);
      setMembers(getInitialTeamMembers());
    });

    return () => {
      unsubAuth();
      unsubMock();
    };
  }, []);

  // Modal States
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>('EDITOR');
  const [inviteWorkspaceId, setInviteWorkspaceId] = useState('ws_capitalone');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Role Simulator State
  const [simulatedRole, setSimulatedRole] = useState<WorkspaceRole>('MANAGER');

  // Filtered members
  const filteredMembers = members.filter((m) => {
    if (selectedWorkspace !== 'ALL' && m.workspaceId !== selectedWorkspace) return false;
    if (roleFilter !== 'ALL' && m.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRoleChange = (memberId: string, newRole: WorkspaceRole) => {
    const updated = members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m));
    setMembers(updated);
    saveTeamMembers(updated);
    setNotificationToast(locale === 'en' ? `Updated member role to "${ROLE_DEFINITIONS[newRole].labelEn || newRole}".` : `อัปเดตบทบาทของสมาชิกเป็น "${ROLE_DEFINITIONS[newRole].label.split(' ')[1]}" เรียบร้อยแล้ว`);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (confirm(locale === 'en' ? `Are you sure you want to remove "${memberName}" from this workspace?` : `คุณต้องการลบ "${memberName}" ออกจากโปรเจกต์นี้หรือไม่?`)) {
      const updated = members.filter((m) => m.id !== memberId);
      setMembers(updated);
      saveTeamMembers(updated);
      setNotificationToast(locale === 'en' ? `Removed "${memberName}" from workspace.` : `ลบ "${memberName}" ออกจากโปรเจกต์แล้ว`);
      setTimeout(() => setNotificationToast(null), 3500);
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newMbr = inviteTeamMember(inviteName.trim(), inviteEmail.trim(), inviteRole, inviteWorkspaceId);
    setMembers(getInitialTeamMembers());
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    setNotificationToast(locale === 'en' ? `Invitation sent to "${newMbr.email}" as ${ROLE_DEFINITIONS[inviteRole].labelEn || inviteRole}!` : `ส่งคำเชิญไปยัง "${newMbr.email}" ในบทบาท ${ROLE_DEFINITIONS[inviteRole].label.split(' ')[1]} สำเร็จแล้ว!`);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const activeWorkspaceName =
    selectedWorkspace === 'ws_capitalone'
      ? 'Main Studio'
      : selectedWorkspace === 'ws_acme'
      ? 'Creator Hub'
      : selectedWorkspace === 'ws_retzpost'
      ? 'Tech & Product Studio'
      : selectedWorkspace === 'ws_coffee'
      ? 'Lifestyle & Brand'
      : 'All Projects';

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* MASTHEAD */}
      <Masthead
        folio={locale === 'th' ? 'การกำกับดูแลพื้นที่ทำงาน & สิทธิ์การเข้าถึง' : 'WORKSPACE GOVERNANCE & ACCESS CONTROL'}
        editionDate={locale === 'th' ? 'ระบบจัดการบทบาท RBAC V2.4' : 'RBAC V2.4 ENGINE'}
        title={t('team.pageTitle')}
        subtitle={t('team.pageSubtitle')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-indigo text-white text-xs font-semibold rounded-editorial hover:bg-brand-indigo-hover transition-colors shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('team.inviteMember')}</span>
            </button>
          </div>
        }
      />

      {/* TOAST FEEDBACK */}
      {notificationToast && (
        <div className="bg-semantic-success/10 border border-semantic-success/30 text-semantic-success px-4 py-2.5 rounded-editorial flex items-center justify-between text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notificationToast}</span>
          </div>
          <button onClick={() => setNotificationToast(null)} className="hover:opacity-75 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SESSION IDENTITY BANNER */}
      <div className="p-3.5 bg-paper-raised border border-border-rule rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${currentUser?.avatarBg || (isMockCleared ? 'bg-ink-secondary/20 text-ink-primary' : 'bg-brand-indigo text-white')} flex items-center justify-center font-serif text-sm font-bold border border-border-rule`}>
            {currentUser?.avatarText || (isMockCleared ? 'GU' : 'NC')}
          </div>
          <div>
            <p className="text-xs text-ink-primary font-medium">
              {locale === 'en' ? (
                <>Working in <span className="font-semibold text-brand-indigo">{isMockCleared ? 'Main Workspace' : activeWorkspaceName}</span> as <span className="font-bold text-semantic-info">{currentUser?.role || (isMockCleared ? 'Guest' : 'Manager')}</span></>
              ) : (
                <>ทำงานในทีม <span className="font-semibold text-brand-indigo">{isMockCleared ? 'Main Workspace' : activeWorkspaceName}</span> ในบทบาท{' '}<span className="font-bold text-semantic-info">{currentUser?.role || (isMockCleared ? 'ผู้ใช้งานทั่วไป' : 'ผู้จัดการ')}</span></>
              )}
            </p>
            <p className="text-[10px] font-mono text-ink-secondary mt-0.5">
              {currentUser?.email || (isMockCleared ? (locale === 'en' ? 'Sign in to access post approval flows and team management' : 'เข้าสู่ระบบเพื่อรับสิทธิ์การอนุมัติโพสต์และจัดการทีม') : (locale === 'en' ? 'Your permissions: Approve team posts • Invite members • Dispatch across all channels' : 'คุณมีสิทธิ์: อนุมัติโพสต์ทีม • เชิญสมาชิก • ยิงโพสต์ทุกช่องทาง'))}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
          <span className="text-[10px] font-mono text-ink-secondary">RBAC Enforced</span>
        </div>
      </div>

      {/* WORKSPACE SELECTION TABS */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border-rule text-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono uppercase font-bold text-ink-secondary flex items-center gap-1">
            <Building2 className="w-3 h-3 text-brand-indigo" />
            <span>{locale === 'en' ? 'Workspace:' : 'โปรเจกต์:'}</span>
          </span>
          {[
            ...(isMockCleared ? [
              { id: 'ALL' as const, label: locale === 'en' ? `All Workspaces (${filteredMembers.length})` : `ภาพรวมทั้งหมด (${filteredMembers.length} คน)`, sticker: null },
            ] : [
              { id: 'ws_capitalone' as const, label: locale === 'en' ? 'Main Studio (5 members)' : 'Main Studio (5 คน)', sticker: 'ws-software' },
              { id: 'ws_acme' as const, label: locale === 'en' ? 'Creator Hub (3 members)' : 'Creator Hub (3 คน)', sticker: 'ws-creator' },
              { id: 'ALL' as const, label: locale === 'en' ? 'All Workspaces (All Members)' : 'ภาพรวมทั้งหมด', sticker: null },
            ]),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedWorkspace(tab.id as any)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                selectedWorkspace === tab.id
                  ? 'bg-brand-indigo text-white font-semibold shadow-2xs'
                  : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
              }`}
            >
              {tab.sticker && <Sticker name={tab.sticker} size="xs" inline />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TOP ROW: 4 GOVERNANCE METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-ink-secondary block font-semibold mb-1">
            {locale === 'en' ? 'Total Workspace Members' : 'สมาชิกทั้งหมดในโปรเจกต์'}
          </span>
          <p className="font-serif font-bold text-2xl text-ink-primary">{filteredMembers.length}</p>
          <p className="text-[10px] text-ink-secondary font-mono mt-1">
            {filteredMembers.filter((m) => m.status === 'ACTIVE').length} {locale === 'en' ? 'Active' : 'ใช้งานจริง'} • {filteredMembers.filter((m) => m.status === 'INVITED').length} {locale === 'en' ? 'Invited' : 'รอรับคำเชิญ'}
          </p>
        </div>

        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-ink-secondary block font-semibold mb-1">
            {locale === 'en' ? 'Executives & Admins' : 'สิทธิ์ระดับผู้บริหาร'}
          </span>
          <p className="font-serif font-bold text-2xl text-semantic-info">
            {filteredMembers.filter((m) => ['OWNER', 'MANAGER'].includes(m.role)).length}
          </p>
          <p className="text-[10px] text-ink-secondary font-mono mt-1">
            {locale === 'en' ? 'Owner & Managers (Approval Authority)' : 'Owner & Managers (สิทธิ์อนุมัติ)'}
          </p>
        </div>

        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-ink-secondary block font-semibold mb-1">
            {locale === 'en' ? 'Content Creators' : 'ทีมผลิตคอนเทนต์'}
          </span>
          <p className="font-serif font-bold text-2xl text-semantic-success">
            {filteredMembers.filter((m) => ['EDITOR', 'CONTRIBUTOR'].includes(m.role)).length}
          </p>
          <p className="text-[10px] text-ink-secondary font-mono mt-1">
            Editors & Junior Contributors
          </p>
        </div>

        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-ink-secondary block font-semibold mb-1">
            {locale === 'en' ? 'Client Reviewers' : 'ผู้ตรวจงานภายนอก'}
          </span>
          <p className="font-serif font-bold text-2xl text-ink-secondary">
            {filteredMembers.filter((m) => m.role === 'VIEWER').length}
          </p>
          <p className="text-[10px] text-ink-secondary font-mono mt-1">
            {locale === 'en' ? 'Read-Only (Calendar & Preview)' : 'Read-Only (ดูปฏิทิน & พรีวิว)'}
          </p>
        </div>
      </div>

      {/* VIEW TABS: MEMBERS vs MATRIX vs SIMULATOR */}
      <div className="flex items-center gap-1 bg-paper-subtle p-1 rounded-editorial border border-border-rule text-xs font-mono max-w-fit">
        <button
          onClick={() => setActiveTab('MEMBERS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors cursor-pointer ${
            activeTab === 'MEMBERS'
              ? 'bg-paper-canvas text-brand-indigo font-bold shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{locale === 'en' ? `Members & Role Access (${filteredMembers.length})` : `รายชื่อสมาชิกและการแบ่งสิทธิ์ (${filteredMembers.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('MATRIX')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors cursor-pointer ${
            activeTab === 'MATRIX'
              ? 'bg-paper-canvas text-brand-indigo font-bold shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{locale === 'en' ? 'Permissions Matrix' : 'ตารางแจกแจงสิทธิ์ 5 ระดับ'}</span>
        </button>

        <button
          onClick={() => setActiveTab('SIMULATOR')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors cursor-pointer ${
            activeTab === 'SIMULATOR'
              ? 'bg-paper-canvas text-brand-indigo font-bold shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{locale === 'en' ? 'Role Simulator' : 'จำลองมุมมองสิทธิ์'}</span>
        </button>

        <button
          onClick={() => setActiveTab('TOKEN_TRACKER')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors cursor-pointer ${
            activeTab === 'TOKEN_TRACKER'
              ? 'bg-paper-canvas text-accent-terracotta font-bold shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-accent-terracotta" />
          <span>{locale === 'en' ? '🪙 Team Token Tracker' : '🪙 ติดตามการใช้ Token ลูกทีม'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MEMBERS LIST & ROLE CHANGER                                        */}
      {/* ========================================================================= */}
      {activeTab === 'MEMBERS' && (
        <div className="bg-paper-raised border border-border-rule rounded-card overflow-hidden shadow-xs space-y-4 p-5">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-rule text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-ink-secondary absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={locale === 'en' ? 'Search members by name or email...' : 'ค้นหาชื่อหรืออีเมลสมาชิก...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-paper-canvas border border-border-rule rounded-editorial text-xs font-mono text-ink-primary focus:outline-none focus:border-brand-indigo"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">{locale === 'en' ? 'Filter Role:' : 'กรองบทบาท:'}</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-paper-canvas border border-border-rule rounded text-xs font-mono text-ink-primary focus:outline-none focus:border-brand-indigo cursor-pointer"
              >
                <option value="ALL">{locale === 'en' ? 'All Roles' : 'ทุกบทบาท'}</option>
                <option value="OWNER">{locale === 'en' ? 'Owner' : 'Owner (เจ้าของ)'}</option>
                <option value="MANAGER">{locale === 'en' ? 'Manager' : 'Manager (ผู้จัดการ)'}</option>
                <option value="EDITOR">{locale === 'en' ? 'Editor' : 'Editor (ครีเอเตอร์)'}</option>
                <option value="CONTRIBUTOR">{locale === 'en' ? 'Contributor' : 'Contributor (รออนุมัติ)'}</option>
                <option value="VIEWER">{locale === 'en' ? 'Viewer' : 'Viewer (ผู้ตรวจงาน)'}</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          {filteredMembers.length === 0 ? (
            <EditorialEmptyState
              stickerName="role-manager"
              badgeText={isMockCleared ? "Team & RBAC • Clean State" : "Filter Empty"}
              title={locale === 'en' ? 'No members in this workspace yet' : 'ยังไม่มีสมาชิกในโปรเจกต์นี้'}
              description={locale === 'en' ? 'Invite team members to collaborate, assign roles, and manage approval workflows (5-Level RBAC)' : 'เชิญสมาชิกในทีมเพื่อร่วมวางแผน กำหนดสิทธิ์ และดูแลขั้นตอนการอนุมัติโพสต์'}
              tipText={locale === 'en' ? 'Each role has specific permissions: Owner (Full control), Manager (Post approval), Editor (Direct dispatch), Contributor (Submit for review), Viewer (Read only)' : 'แต่ละบทบาทมีสิทธิ์จำเพาะ: Owner (คุมระบบ), Manager (อนุมัติโพสต์), Editor (ยิงตรง), Contributor (ส่งตรวจ), Viewer (ตรวจดู)'}
              actionLabel={locale === 'en' ? '+ Invite First Member' : '+ เชิญสมาชิกคนแรก'}
              onActionClick={() => setIsInviteModalOpen(true)}
              demoActionLabel={isMockCleared ? (locale === 'en' ? 'Load Demo Team' : 'โหลดตัวอย่างทีม') : undefined}
              onDemoActionClick={isMockCleared ? () => loadSampleMockData() : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-paper-subtle border-b border-border-rule font-mono text-[10px] text-ink-secondary uppercase">
                  <tr>
                    <th className="py-3 px-4">{locale === 'en' ? 'Member (User)' : 'สมาชิก'}</th>
                    <th className="py-3 px-4">{locale === 'en' ? 'Role & Permissions (Assigned Role)' : 'บทบาทและสิทธิ์'}</th>
                    <th className="py-3 px-4">{locale === 'en' ? 'Status' : 'สถานะ'}</th>
                    <th className="py-3 px-4">{locale === 'en' ? 'Joined At' : 'เข้าร่วมเมื่อ'}</th>
                    <th className="py-3 px-4 text-right">{locale === 'en' ? 'Actions' : 'การจัดการ'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-rule">
                  {filteredMembers.map((mbr) => {
                    const roleDef = ROLE_DEFINITIONS[mbr.role];

                    return (
                      <tr key={mbr.id} className="hover:bg-paper-subtle/40 transition-colors">
                        {/* Member Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${mbr.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-border-rule`}>
                              {mbr.avatarText}
                            </div>
                            <div>
                              <p className="font-semibold text-ink-primary text-xs leading-tight">
                                {mbr.name}
                              </p>
                              <span className="text-[10px] font-mono text-ink-secondary block mt-0.5">
                                {mbr.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role Selector */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <Sticker name={roleDef.stickerName || `role-${mbr.role.toLowerCase()}`} size="xs" inline />
                            <select
                              value={mbr.role}
                              onChange={(e) => handleRoleChange(mbr.id, e.target.value as WorkspaceRole)}
                              disabled={mbr.role === 'OWNER'}
                              className={`px-2 py-1 rounded text-[11px] font-mono font-semibold border focus:outline-none transition-colors cursor-pointer ${
                                mbr.role === 'OWNER'
                                  ? 'bg-brand-indigo text-white border-brand-indigo cursor-not-allowed opacity-90'
                                  : mbr.role === 'MANAGER'
                                  ? 'bg-semantic-info/10 text-semantic-info border-semantic-info/30 hover:bg-semantic-info/20'
                                  : mbr.role === 'EDITOR'
                                  ? 'bg-semantic-success/10 text-semantic-success border-semantic-success/30 hover:bg-semantic-success/20'
                                  : mbr.role === 'CONTRIBUTOR'
                                  ? 'bg-accent-terracotta/10 text-accent-terracotta border-accent-terracotta/30 hover:bg-accent-terracotta/20'
                                  : 'bg-paper-canvas text-ink-secondary border-border-rule hover:border-brand-indigo'
                              }`}
                            >
                              <option value="OWNER" disabled>{locale === 'en' ? 'Owner (Project Owner)' : 'Owner (เจ้าของโปรเจกต์)'}</option>
                              <option value="MANAGER">{locale === 'en' ? 'Manager (Team Manager)' : 'Manager (ผู้จัดการทีม)'}</option>
                              <option value="EDITOR">{locale === 'en' ? 'Editor (Direct Dispatch)' : 'Editor (ครีเอเตอร์ยิงตรง)'}</option>
                              <option value="CONTRIBUTOR">{locale === 'en' ? 'Contributor (Requires Approval)' : 'Contributor (รออนุมัติ)'}</option>
                              <option value="VIEWER">{locale === 'en' ? 'Viewer (Reviewer/Client)' : 'Viewer (ผู้ตรวจงาน/ลูกค้า)'}</option>
                            </select>
                          </div>
                          <span className="text-[10px] text-ink-secondary font-sans block mt-1 line-clamp-1">
                            {locale === 'en' ? (roleDef.descriptionEn || roleDef.descriptionTh) : roleDef.descriptionTh}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {mbr.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-semantic-success/10 text-semantic-success font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-semantic-success" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-semantic-warning/15 text-semantic-warning font-semibold">
                              <Clock className="w-3 h-3" />
                              <span>Pending Invite</span>
                            </span>
                          )}
                        </td>

                        {/* Joined Date & Token Consumption */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-ink-secondary">
                          <span>{mbr.joinedAt}</span>
                          <span className="text-[10px] block text-accent-terracotta font-bold mt-0.5">
                            🪙 {mbr.tokensUsedThisMonth || 0} {locale === 'en' ? 'Tokens this month' : 'Tokens ใช้เดือนนี้'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          {mbr.role !== 'OWNER' && (
                            <button
                              onClick={() => handleRemoveMember(mbr.id, mbr.name)}
                              className="p-1.5 text-ink-secondary hover:text-accent-terracotta hover:bg-accent-terracotta/10 rounded transition-colors cursor-pointer"
                              title={locale === 'en' ? 'Remove from workspace' : 'ลบออกจากโปรเจกต์'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GRANULAR PERMISSIONS MATRIX                                        */}
      {/* ========================================================================= */}
      {activeTab === 'MATRIX' && (
        <div className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-border-rule">
            <h3 className="font-serif font-medium text-base text-ink-primary">
              {locale === 'en' ? 'Granular Role Permissions Matrix' : 'ตารางเปรียบเทียบสิทธิ์ตามบทบาท'}
            </h3>
            <p className="text-xs text-ink-secondary font-sans mt-0.5">
              {locale === 'en' ? 'Detailed breakdown of 10 permissions for governance, post error prevention, and workspace security.' : 'แจกแจงสิทธิ์ 10 ประการเพื่อความโปร่งใส ป้องกันการยิงโพสต์ผิดพลาด และรักษาความปลอดภัยของบัญชีโซเชียลองค์กร'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-border-rule">
              <thead className="bg-paper-subtle font-mono text-[10px] text-ink-secondary uppercase">
                <tr>
                  <th className="py-3 px-4 border-r border-border-rule min-w-[220px]">
                    {locale === 'en' ? 'Feature / Permission' : 'ฟังก์ชัน / สิทธิ์การใช้งาน'}
                  </th>
                  <th className="py-2.5 px-3 text-center border-r border-border-rule bg-brand-indigo/5 text-brand-indigo font-bold">
                    <div className="flex items-center justify-center gap-1.5">
                      <Sticker name="role-owner" size="xs" inline />
                      <span>Owner</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-center border-r border-border-rule bg-semantic-info/5 text-semantic-info font-bold">
                    <div className="flex items-center justify-center gap-1.5">
                      <Sticker name="role-manager" size="xs" inline />
                      <span>Manager</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-center border-r border-border-rule bg-semantic-success/5 text-semantic-success font-bold">
                    <div className="flex items-center justify-center gap-1.5">
                      <Sticker name="role-editor" size="xs" inline />
                      <span>Editor</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-center border-r border-border-rule bg-accent-terracotta/5 text-accent-terracotta font-bold">
                    <div className="flex items-center justify-center gap-1.5">
                      <Sticker name="role-contributor" size="xs" inline />
                      <span>Contributor</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-center text-ink-secondary font-bold">
                    <div className="flex items-center justify-center gap-1.5">
                      <Sticker name="role-viewer" size="xs" inline />
                      <span>Viewer</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-rule">
                {ALL_PERMISSIONS.map((perm) => (
                  <tr key={perm.key} className="hover:bg-paper-subtle/50 transition-colors">
                    <td className="py-3 px-4 border-r border-border-rule">
                      <p className="font-medium text-ink-primary text-xs">{locale === 'en' ? perm.labelEn : perm.labelTh}</p>
                      <span className="text-[10px] font-mono text-ink-secondary">{locale === 'en' ? perm.labelTh : perm.labelEn}</span>
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-3 text-center border-r border-border-rule">
                      <span className="text-semantic-success font-bold text-base">✓</span>
                    </td>

                    {/* Manager */}
                    <td className="py-3 px-3 text-center border-r border-border-rule">
                      {hasPermission('MANAGER', perm.key) ? (
                        <span className="text-semantic-success font-bold text-base">✓</span>
                      ) : (
                        <span className="text-accent-terracotta font-bold text-sm">✕</span>
                      )}
                    </td>

                    {/* Editor */}
                    <td className="py-3 px-3 text-center border-r border-border-rule">
                      {hasPermission('EDITOR', perm.key) ? (
                        <span className="text-semantic-success font-bold text-base">✓</span>
                      ) : (
                        <span className="text-accent-terracotta font-bold text-sm">✕</span>
                      )}
                    </td>

                    {/* Contributor */}
                    <td className="py-3 px-3 text-center border-r border-border-rule">
                      {perm.key === 'PUBLISH_DISPATCH_DIRECT' ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-accent-terracotta/15 text-accent-terracotta font-semibold" title={locale === 'en' ? 'Must be approved by Manager' : 'ต้องส่งให้ Manager ตรวจก่อน'}>
                          {locale === 'en' ? 'Needs Review' : 'รออนุมัติ'}
                        </span>
                      ) : hasPermission('CONTRIBUTOR', perm.key) ? (
                        <span className="text-semantic-success font-bold text-base">✓</span>
                      ) : (
                        <span className="text-accent-terracotta font-bold text-sm">✕</span>
                      )}
                    </td>

                    {/* Viewer */}
                    <td className="py-3 px-3 text-center">
                      {hasPermission('VIEWER', perm.key) ? (
                        <span className="text-semantic-success font-bold text-base">✓</span>
                      ) : (
                        <span className="text-accent-terracotta font-bold text-sm">✕</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ROLE SIMULATOR & APPROVAL PREVIEW                                  */}
      {/* ========================================================================= */}
      {activeTab === 'SIMULATOR' && (
        <div className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-5">
          <div className="pb-3 border-b border-border-rule">
            <h3 className="font-serif font-medium text-base text-ink-primary">
              {locale === 'en' ? 'Live Role Experience Simulator' : 'จำลองประสบการณ์ผู้ใช้ตามบทบาท'}
            </h3>
            <p className="text-xs text-ink-secondary font-sans mt-0.5">
              {locale === 'en' ? 'Simulate how Studio Desk (/create) interface and actions adapt dynamically per team role.' : 'ทดสอบดูว่าเมื่อสมาชิกแต่ละคนเข้าสู่ Studio Desk (`/create`) หน้าจอและปุ่มดำเนินการจะปรับเปลี่ยนอย่างไร'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold text-ink-secondary">{locale === 'en' ? 'Select Role to Simulate:' : 'เลือกบทบาทจำลอง:'}</span>
            {(['MANAGER', 'EDITOR', 'CONTRIBUTOR', 'VIEWER'] as WorkspaceRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setSimulatedRole(role)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  simulatedRole === role
                    ? 'bg-brand-indigo text-white font-semibold shadow-2xs'
                    : 'bg-paper-canvas text-ink-secondary hover:text-ink-primary border border-border-rule'
                }`}
              >
                <Sticker name={ROLE_DEFINITIONS[role].stickerName} size="xs" inline />
                <span>
                  {locale === 'en' ? (role === 'MANAGER' ? 'Manager' : role === 'EDITOR' ? 'Editor' : role === 'CONTRIBUTOR' ? 'Contributor' : 'Viewer (Client)') : (role === 'MANAGER' ? 'Manager (ผู้จัดการ)' : role === 'EDITOR' ? 'Editor (ครีเอเตอร์)' : role === 'CONTRIBUTOR' ? 'Contributor (รออนุมัติ)' : 'Viewer (ลูกค้า)')}
                </span>
              </button>
            ))}
          </div>

          {/* Simulator Visual Box */}
          <div className="p-4 bg-paper-canvas border-2 border-dashed border-brand-indigo/30 rounded-editorial space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-rule/80">
              <span className="font-mono text-xs font-bold text-brand-indigo">
                [STUDIO CANVAS ACTION BUTTON SIMULATION]
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                simulatedRole === 'CONTRIBUTOR' ? 'bg-accent-terracotta text-white' : 'bg-brand-indigo text-white'
              }`}>
                Active Role: {simulatedRole}
              </span>
            </div>

            <div className="p-4 bg-paper-raised border border-border-rule rounded-card max-w-md mx-auto space-y-3 text-center">
              <p className="text-xs font-serif text-ink-primary font-medium">
                {locale === 'en' ? 'Campaign Masterclass Showcase (3 destinations: FB Thailand, IG Feed, IG Story)' : 'แคมเปญ Masterclass Showcase (3 ปลายทาง: FB Thailand, IG Feed, IG Story)'}
              </p>

              {simulatedRole === 'CONTRIBUTOR' ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-2.5 px-4 bg-accent-terracotta text-white font-mono font-semibold text-xs rounded-editorial shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{locale === 'en' ? 'Submit for Manager Approval' : 'ส่งให้ผู้จัดการตรวจสอบ'}</span>
                  </button>
                  <p className="text-[10px] text-accent-terracotta font-sans leading-relaxed">
                    {locale === 'en' ? '⚠️ Your account is a Contributor and cannot publish directly. To prevent accidental dispatches, posts are sent to the Manager Queue for approval.' : '⚠️ บัญชีคุณเป็น Contributor ไม่สามารถยิงโพสต์ตรงได้ เพื่อป้องกันการโพสต์ข้อมูลผิดพลาด โพสต์จะถูกส่งไปยัง Manager Queue ให้หัวหน้ากดอนุมัติก่อนขึ้นจริง'}
                  </p>
                </div>
              ) : simulatedRole === 'VIEWER' ? (
                <div className="space-y-2">
                  <div className="py-2.5 px-4 bg-paper-subtle border border-border-rule text-ink-secondary font-mono text-xs rounded-editorial flex items-center justify-center gap-2 cursor-not-allowed">
                    <Lock className="w-4 h-4" />
                    <span>{locale === 'en' ? 'Client Reviewer Mode (Read-Only)' : 'โหมดผู้ตรวจงาน'}</span>
                  </div>
                  <p className="text-[10px] text-ink-secondary font-sans">
                    {locale === 'en' ? 'You have read-only access to view Phone Mockups and Editorial Calendar. Editing and publishing are restricted.' : 'คุณมีสิทธิ์เปิดดู Phone Mockup และปฏิทินเท่านั้น ไม่สามารถทำการแก้ไขหรือยิงโพสต์ได้'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-2.5 px-4 bg-brand-indigo text-white font-mono font-semibold text-xs rounded-editorial shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{locale === 'en' ? 'Instant Multi-Dispatch (3 Channels)' : 'เผยแพร่ทันที 3 ช่องทาง'}</span>
                  </button>
                  <p className="text-[10px] text-semantic-success font-sans leading-relaxed">
                    {locale === 'en' ? `✓ You hold ${simulatedRole} permissions and can dispatch posts directly via the engine.` : `✓ คุณถือสิทธิ์ ${simulatedRole} สามารถยิงโพสต์เข้าสู่ระบบ Dispatch Engine ได้โดยตรงทันที`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TEAM TOKEN USAGE TRACKER                                           */}
      {/* ========================================================================= */}
      {activeTab === 'TOKEN_TRACKER' && (
        <div className="space-y-6">
          {/* Top Token Governance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-paper-raised border border-border-rule rounded-card p-4 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold">
                {locale === 'en' ? 'Master Token Pool' : 'Master Wallet กองกลาง'}
              </span>
              <p className="font-serif font-black text-2xl text-accent-terracotta mt-1">
                600 🪙
              </p>
              <p className="text-[10px] text-ink-secondary mt-0.5">
                {locale === 'en' ? 'Central owner pool shared across workspaces' : 'กระเป๋าแม่ของเจ้าของ ใช้ได้ทุก Workspace'}
              </p>
            </div>

            <div className="bg-paper-raised border border-border-rule rounded-card p-4 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold">
                {locale === 'en' ? 'Team Tokens Consumed (Month)' : 'ยอดที่ลูกทีมใช้เดือนนี้'}
              </span>
              <p className="font-serif font-black text-2xl text-brand-indigo mt-1">
                {members.reduce((sum, m) => sum + (m.tokensUsedThisMonth || 0), 0)} 🪙
              </p>
              <p className="text-[10px] text-ink-secondary mt-0.5">
                {locale === 'en' ? `Across ${members.length} members in all workspaces` : `รวม ${members.length} สมาชิกในทุกโปรเจกต์`}
              </p>
            </div>

            <div className="bg-paper-raised border border-border-rule rounded-card p-4 shadow-2xs">
              <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold">
                {locale === 'en' ? 'Budget Cap Policy' : 'นโยบายคุมงบ'}
              </span>
              <p className="font-serif font-black text-2xl text-semantic-success mt-1">
                Active Guard
              </p>
              <p className="text-[10px] text-ink-secondary mt-0.5">
                {locale === 'en' ? 'Per-member quota to avoid unintended token usage' : 'จำกัดเพดานต่อคน ป้องกันลูกน้องกดผลาญเหรียญ'}
              </p>
            </div>
          </div>

          {/* Member Usage Table */}
          <div className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <div>
                <h3 className="font-serif font-medium text-base text-ink-primary">
                  {locale === 'en' ? 'Individual Token Ledger' : 'การบริโภค Token รายบุคคล'}
                </h3>
                <p className="text-xs text-ink-secondary mt-0.5">
                  {locale === 'en' ? 'Real-time telemetry of member token consumption with monthly limit caps.' : 'ติดตามแบบเรียลไทม์ว่าใครใช้ Token ทำอะไร พร้อมตั้งเพดานการใช้สูงสุดต่อเดือน'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-paper-subtle/60 border-b border-border-rule text-[10px] font-mono uppercase text-ink-secondary">
                  <tr>
                    <th className="py-2.5 px-3">{locale === 'en' ? 'Member & Role' : 'สมาชิก & บทบาท'}</th>
                    <th className="py-2.5 px-3">{locale === 'en' ? 'Tokens (This Month)' : 'การใช้เหรียญเดือนนี้'}</th>
                    <th className="py-2.5 px-3">{locale === 'en' ? 'Monthly Cap' : 'เพดานต่อเดือน'}</th>
                    <th className="py-2.5 px-3">{locale === 'en' ? 'Recent Activity' : 'ประวัติกิจกรรมล่าสุด'}</th>
                    <th className="py-2.5 px-3 text-right">{locale === 'en' ? 'Actions' : 'การจัดการ'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-rule/60">
                  {members.map((mbr) => {
                    const used = mbr.tokensUsedThisMonth || 0;
                    const limit = mbr.monthlyTokenLimit;
                    const percent = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;

                    return (
                      <tr key={mbr.id} className="hover:bg-paper-canvas/50">
                        {/* Member Info */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full ${mbr.avatarBg} text-white flex items-center justify-center font-serif text-[11px] font-bold shrink-0`}>
                              {mbr.avatarText}
                            </div>
                            <div>
                              <p className="font-bold text-ink-primary text-xs">{mbr.name}</p>
                              <p className="text-[10px] font-mono text-ink-secondary">{mbr.email}</p>
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-brand-indigo/10 text-brand-indigo font-semibold mt-0.5 inline-block">
                                {mbr.role}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Token Consumption & Progress Bar */}
                        <td className="py-3 px-3">
                          <div className="space-y-1 w-36">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="font-bold text-accent-terracotta">{used} 🪙</span>
                              <span className="text-ink-secondary text-[10px]">
                                {limit ? `/ ${limit} 🪙` : (locale === 'en' ? '(Unlimited)' : '(ไม่จำกัด)')}
                              </span>
                            </div>
                            {limit && (
                              <div className="w-full h-1.5 rounded-full bg-paper-subtle overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    percent > 80 ? 'bg-semantic-error' : percent > 50 ? 'bg-semantic-warning' : 'bg-brand-indigo'
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Monthly Cap Setting */}
                        <td className="py-3 px-3">
                          {editingLimitMemberId === mbr.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={newLimitValue}
                                onChange={(e) => setNewLimitValue(e.target.value)}
                                className="w-16 px-1.5 py-1 text-xs font-mono rounded border border-border-rule bg-paper-canvas"
                                placeholder="100"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const val = parseInt(newLimitValue, 10);
                                  const updated = members.map((m) =>
                                    m.id === mbr.id ? { ...m, monthlyTokenLimit: isNaN(val) ? null : val } : m
                                  );
                                  setMembers(updated);
                                  saveTeamMembers(updated);
                                  setEditingLimitMemberId(null);
                                }}
                                className="px-2 py-1 rounded bg-brand-indigo text-white text-[10px] font-mono font-bold"
                              >
                                {locale === 'en' ? 'Save' : 'บันทึก'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingLimitMemberId(null)}
                                className="text-[10px] text-ink-secondary hover:text-ink-primary"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">
                                {limit !== null ? `${limit} 🪙/${locale === 'en' ? 'mo' : 'ด.'}` : (locale === 'en' ? 'Unlimited (Pool)' : 'ไม่จำกัด')}
                              </span>
                              {mbr.role !== 'OWNER' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingLimitMemberId(mbr.id);
                                    setNewLimitValue(limit ? String(limit) : '100');
                                  }}
                                  className="text-[10px] font-mono text-brand-indigo underline hover:text-brand-indigo-hover"
                                >
                                  {locale === 'en' ? 'Edit' : 'แก้ไข'}
                                </button>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Recent Activity Badges */}
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {mbr.tokenLogs && mbr.tokenLogs.length > 0 ? (
                              mbr.tokenLogs.slice(0, 2).map((log) => (
                                <span
                                  key={log.id}
                                  className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-paper-subtle border border-border-rule text-ink-secondary"
                                >
                                  {(locale === 'en' ? log.actionLabelEn || log.actionLabelTh : log.actionLabelTh)}: {log.tokens} 🪙
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-ink-muted font-mono">{locale === 'en' ? '- No usage yet -' : '- ยังไม่มีการใช้ -'}</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedMemberForLogs(mbr)}
                            className="py-1 px-2.5 rounded bg-brand-indigo/10 text-brand-indigo hover:bg-brand-indigo/20 text-[10px] font-mono font-bold transition-colors"
                          >
                            {locale === 'en' ? `View Logs (${mbr.tokenLogs?.length || 0})` : `ดูบันทึก Log (${mbr.tokenLogs?.length || 0})`}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MEMBER TOKEN LOGS */}
      {selectedMemberForLogs && (
        <div className="fixed inset-0 z-50 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper-raised border border-border-rule rounded-card max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <div>
                <h3 className="font-serif font-bold text-base text-ink-primary">
                  {locale === 'en' ? `Token History for ${selectedMemberForLogs.name}` : `ประวัติการใช้ Token ของ ${selectedMemberForLogs.name}`}
                </h3>
                <p className="text-[11px] font-mono text-ink-secondary">
                  {selectedMemberForLogs.email} • {locale === 'en' ? `Total ${selectedMemberForLogs.tokensUsedThisMonth} 🪙` : `รวม ${selectedMemberForLogs.tokensUsedThisMonth} 🪙`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMemberForLogs(null)}
                className="p-1 rounded text-ink-secondary hover:text-ink-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {selectedMemberForLogs.tokenLogs && selectedMemberForLogs.tokenLogs.length > 0 ? (
                selectedMemberForLogs.tokenLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded border border-border-rule bg-paper-canvas flex items-center justify-between text-xs font-mono">
                    <div>
                      <p className="font-bold text-ink-primary">{locale === 'en' ? (log.actionLabelEn || log.actionLabelTh) : log.actionLabelTh}</p>
                      <p className="text-[10px] text-ink-secondary">{log.workspaceName} • {locale === 'en' ? (log.timestampEn || log.timestamp) : log.timestamp}</p>
                    </div>
                    <span className="font-bold text-accent-terracotta">-{log.tokens} 🪙</span>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-ink-muted font-mono">{locale === 'en' ? 'No token usage history for this month' : 'ไม่มีประวัติการใช้ Token ในเดือนนี้'}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedMemberForLogs(null)}
              className="w-full py-2 bg-brand-indigo text-white text-xs font-mono font-bold rounded"
            >
              {locale === 'en' ? 'Close Window' : 'ปิดหน้าต่าง'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INVITE NEW MEMBER                                                  */}
      {/* ========================================================================= */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper-raised border border-border-rule rounded-card max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-brand-indigo" />
                <h3 className="font-serif font-medium text-base text-ink-primary">
                  {locale === 'en' ? 'Invite New Member to Workspace' : 'เชิญสมาชิกใหม่เข้าสู่โปรเจกต์'}
                </h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1">
                  {locale === 'en' ? 'Full Name' : 'ชื่อ - นามสกุล'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={locale === 'en' ? 'e.g. Alex Morgan' : 'เช่น: วรวิทย์ เกียรติสกุล'}
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-medium focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1">
                  {locale === 'en' ? 'Email Address' : 'อีเมลสำหรับส่งคำเชิญ'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="editor@retzpost.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1">
                  {locale === 'en' ? 'Assign Workspace' : 'กำหนดโปรเจกต์'}
                </label>
                <select
                  value={inviteWorkspaceId}
                  onChange={(e) => setInviteWorkspaceId(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono focus:outline-none focus:border-brand-indigo cursor-pointer"
                >
                  <option value="ws_capitalone">Main Studio (Enterprise)</option>
                  <option value="ws_acme">Creator Hub (Creator Brand)</option>
                  <option value="ws_retzpost">Tech & Product Studio (SaaS)</option>
                  <option value="ws_coffee">Lifestyle & Brand (Retail)</option>
                </select>
              </div>

              {/* Role Selection Cards */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1.5">
                  {locale === 'en' ? 'Assign Role & Permissions' : 'เลือกระดับสิทธิ์และบทบาท'}
                </label>
                <div className="space-y-2">
                  {(['MANAGER', 'EDITOR', 'CONTRIBUTOR', 'VIEWER'] as WorkspaceRole[]).map((r) => {
                    const def = ROLE_DEFINITIONS[r];
                    const isSelected = inviteRole === r;

                    return (
                      <label
                        key={r}
                        onClick={() => setInviteRole(r)}
                        className={`p-2.5 rounded-editorial border flex items-start justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-paper-canvas border-brand-indigo shadow-xs'
                            : 'bg-paper-subtle/50 border-border-rule hover:border-brand-indigo/40'
                        }`}
                      >
                        <div className="space-y-0.5 pr-2">
                          <span className="font-semibold text-xs text-ink-primary flex items-center gap-1.5">
                            <Sticker name={def.stickerName} size="xs" inline />
                            <span>{locale === 'en' ? (def.labelEn || def.label) : def.label}</span>
                          </span>
                          <span className="text-[11px] text-ink-secondary block font-sans leading-tight">
                            {locale === 'en' ? (def.descriptionEn || def.descriptionTh) : def.descriptionTh}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="inviteRole"
                          checked={isSelected}
                          onChange={() => setInviteRole(r)}
                          className="mt-1 text-brand-indigo focus:ring-brand-indigo"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-rule">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-1.5 text-ink-secondary hover:text-ink-primary text-xs font-mono cursor-pointer"
                >
                  {locale === 'en' ? 'Cancel' : 'ยกเลิก'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial text-xs font-mono font-semibold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{locale === 'en' ? 'Send Workspace Invitation' : 'ส่งคำเชิญเข้าร่วมโปรเจกต์'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
