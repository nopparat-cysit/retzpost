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
  ExternalLink
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
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
  const [members, setMembers] = useState<TeamMember[]>(() => getInitialTeamMembers());
  const [selectedWorkspace, setSelectedWorkspace] = useState<'ALL' | 'ws_capitalone' | 'ws_acme' | 'ws_retzpost' | 'ws_coffee'>('ws_capitalone');
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'MATRIX' | 'SIMULATOR'>('MEMBERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | WorkspaceRole>('ALL');

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
    setNotificationToast(`อัปเดตบทบาทของสมาชิกเป็น "${ROLE_DEFINITIONS[newRole].label.split(' ')[1]}" เรียบร้อยแล้ว`);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (confirm(`คุณต้องการลบ "${memberName}" ออกจากโปรเจกต์นี้หรือไม่?`)) {
      const updated = members.filter((m) => m.id !== memberId);
      setMembers(updated);
      saveTeamMembers(updated);
      setNotificationToast(`ลบ "${memberName}" ออกจากโปรเจกต์แล้ว`);
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
    setNotificationToast(`ส่งคำเชิญไปยัง "${newMbr.email}" ในบทบาท ${ROLE_DEFINITIONS[inviteRole].label.split(' ')[1]} สำเร็จแล้ว!`);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const activeWorkspaceName =
    selectedWorkspace === 'ws_capitalone'
      ? 'Capital One Real Estate'
      : selectedWorkspace === 'ws_acme'
      ? 'Acme Creator Studio'
      : selectedWorkspace === 'ws_retzpost'
      ? 'RetzPost Software'
      : selectedWorkspace === 'ws_coffee'
      ? 'Coffee Craft BKK'
      : 'All Projects';

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* MASTHEAD */}
      <Masthead
        folio="WORKSPACE GOVERNANCE & ACCESS CONTROL"
        editionDate="RBAC V2.4 ENGINE"
        title="Team Members & Project Permissions"
        subtitle="Invite team members, assign granular roles (Owner, Manager, Editor, Contributor, Client Viewer), and govern multi-platform publishing authority."
        actions={
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-indigo text-white text-xs font-semibold rounded-editorial hover:bg-brand-indigo-hover transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ เชิญสมาชิกเข้าโปรเจกต์</span>
          </button>
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

      {/* SESSION IDENTITY BANNER (Mirroring Boss's Screen Context) */}
      <div className="p-3.5 bg-paper-raised border border-border-rule rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-semantic-info/15 text-semantic-info flex items-center justify-center font-serif text-sm font-bold border border-semantic-info/20">
            NC
          </div>
          <div>
            <p className="text-xs text-ink-primary font-medium">
              ทำงานในทีม <span className="font-semibold text-brand-indigo">{activeWorkspaceName}</span> ในบทบาท{' '}
              <span className="font-bold text-semantic-info">ผู้จัดการ (Manager)</span> — ข้อมูลและเครดิตเป็นของทีม
            </p>
            <p className="text-[10px] font-mono text-ink-secondary mt-0.5">
              คุณมีสิทธิ์: อนุมัติโพสต์ทีม • เชิญสมาชิก • ยิงโพสต์ทุกช่องทาง (Feed, Story, Reels) • จัดการ Presets
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
            <span>โปรเจกต์:</span>
          </span>
          {[
            { id: 'ws_capitalone', label: '🏢 Capital One Real Estate (5 คน)' },
            { id: 'ws_acme', label: '🎙️ Acme Creator Studio (3 คน)' },
            { id: 'ALL', label: 'ภาพรวมทั้งหมด (All Members)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedWorkspace(tab.id as any)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                selectedWorkspace === tab.id
                  ? 'bg-brand-indigo text-white font-semibold shadow-2xs'
                  : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TOP ROW: 4 GOVERNANCE METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-ink-secondary block font-semibold mb-1">
            สมาชิกทั้งหมดในโปรเจกต์
          </span>
          <p className="font-serif font-bold text-2xl text-ink-primary">{filteredMembers.length}</p>
          <p className="text-[10px] text-ink-secondary font-mono mt-1">
            {filteredMembers.filter((m) => m.status === 'ACTIVE').length} ใช้งานจริง • {filteredMembers.filter((m) => m.status === 'INVITED').length} รอรับคำเชิญ
          </p>
        </div>

        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-ink-secondary block font-semibold mb-1">
            สิทธิ์ระดับผู้บริหาร (Admins)
          </span>
          <p className="font-serif font-bold text-2xl text-semantic-info">
            {filteredMembers.filter((m) => ['OWNER', 'MANAGER'].includes(m.role)).length}
          </p>
          <p className="text-[10px] text-ink-secondary font-mono mt-1">
            Owner & Managers (สิทธิ์อนุมัติ)
          </p>
        </div>

        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-ink-secondary block font-semibold mb-1">
            ทีมผลิตคอนเทนต์ (Creators)
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
            ผู้ตรวจงานภายนอก (Clients)
          </span>
          <p className="font-serif font-bold text-2xl text-ink-secondary">
            {filteredMembers.filter((m) => m.role === 'VIEWER').length}
          </p>
          <p className="text-[10px] text-ink-secondary font-mono mt-1">
            Read-Only (ดูปฏิทิน & พรีวิว)
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
          <span>รายชื่อสมาชิกและการแบ่งสิทธิ์ ({filteredMembers.length})</span>
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
          <span>ตารางแจกแจงสิทธิ์ 5 ระดับ (Permissions Matrix)</span>
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
          <span>จำลองมุมมองสิทธิ์ (Role Simulator)</span>
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
                placeholder="ค้นหาชื่อหรืออีเมลสมาชิก..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-paper-canvas border border-border-rule rounded-editorial text-xs font-mono text-ink-primary focus:outline-none focus:border-brand-indigo"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">กรองบทบาท:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-paper-canvas border border-border-rule rounded text-xs font-mono text-ink-primary focus:outline-none focus:border-brand-indigo cursor-pointer"
              >
                <option value="ALL">ทุกบทบาท (All Roles)</option>
                <option value="OWNER">Owner (เจ้าของ)</option>
                <option value="MANAGER">Manager (ผู้จัดการ)</option>
                <option value="EDITOR">Editor (ครีเอเตอร์)</option>
                <option value="CONTRIBUTOR">Contributor (รออนุมัติ)</option>
                <option value="VIEWER">Viewer (ผู้ตรวจงาน)</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper-subtle border-b border-border-rule font-mono text-[10px] text-ink-secondary uppercase">
                <tr>
                  <th className="py-3 px-4">สมาชิก (User)</th>
                  <th className="py-3 px-4">บทบาทและสิทธิ์ (Assigned Role)</th>
                  <th className="py-3 px-4">สถานะ (Status)</th>
                  <th className="py-3 px-4">เข้าร่วมเมื่อ</th>
                  <th className="py-3 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-rule">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ink-secondary font-mono text-xs">
                      ไม่พบสมาชิกที่ตรงกับเงื่อนไขการค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((mbr) => {
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
                          <div className="flex items-center gap-2">
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
                              <option value="OWNER" disabled>👑 Owner (เจ้าของโปรเจกต์)</option>
                              <option value="MANAGER">⭐ Manager (ผู้จัดการทีม)</option>
                              <option value="EDITOR">✍️ Editor (ครีเอเตอร์ยิงตรง)</option>
                              <option value="CONTRIBUTOR">👀 Contributor (รออนุมัติ)</option>
                              <option value="VIEWER">🔍 Viewer (ผู้ตรวจงาน/ลูกค้า)</option>
                            </select>
                          </div>
                          <span className="text-[10px] text-ink-secondary font-sans block mt-1 line-clamp-1">
                            {roleDef.descriptionTh}
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

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-ink-secondary">
                          <span>{mbr.joinedAt}</span>
                          <span className="text-[9px] block text-ink-secondary/70">
                            Active: {mbr.lastActiveAt}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          {mbr.role !== 'OWNER' && (
                            <button
                              onClick={() => handleRemoveMember(mbr.id, mbr.name)}
                              className="p-1.5 text-ink-secondary hover:text-accent-terracotta hover:bg-accent-terracotta/10 rounded transition-colors cursor-pointer"
                              title="ลบออกจากโปรเจกต์"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GRANULAR PERMISSIONS MATRIX                                        */}
      {/* ========================================================================= */}
      {activeTab === 'MATRIX' && (
        <div className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-border-rule">
            <h3 className="font-serif font-medium text-base text-ink-primary">
              ตารางเปรียบเทียบสิทธิ์ตามบทบาท (Granular Role Permissions Matrix)
            </h3>
            <p className="text-xs text-ink-secondary font-sans mt-0.5">
              แจกแจงสิทธิ์ 10 ประการเพื่อความโปร่งใส ป้องกันการยิงโพสต์ผิดพลาด และรักษาความปลอดภัยของบัญชีโซเชียลองค์กร
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-border-rule">
              <thead className="bg-paper-subtle font-mono text-[10px] text-ink-secondary uppercase">
                <tr>
                  <th className="py-3 px-4 border-r border-border-rule min-w-[220px]">
                    ฟังก์ชัน / สิทธิ์การใช้งาน
                  </th>
                  <th className="py-3 px-3 text-center border-r border-border-rule bg-brand-indigo/5 text-brand-indigo font-bold">
                    👑 Owner
                  </th>
                  <th className="py-3 px-3 text-center border-r border-border-rule bg-semantic-info/5 text-semantic-info font-bold">
                    ⭐ Manager
                  </th>
                  <th className="py-3 px-3 text-center border-r border-border-rule bg-semantic-success/5 text-semantic-success font-bold">
                    ✍️ Editor
                  </th>
                  <th className="py-3 px-3 text-center border-r border-border-rule bg-accent-terracotta/5 text-accent-terracotta font-bold">
                    👀 Contributor
                  </th>
                  <th className="py-3 px-3 text-center text-ink-secondary">
                    🔍 Viewer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-rule">
                {ALL_PERMISSIONS.map((perm) => (
                  <tr key={perm.key} className="hover:bg-paper-subtle/50 transition-colors">
                    <td className="py-3 px-4 border-r border-border-rule">
                      <p className="font-medium text-ink-primary text-xs">{perm.labelTh}</p>
                      <span className="text-[10px] font-mono text-ink-secondary">{perm.labelEn}</span>
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
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-accent-terracotta/15 text-accent-terracotta font-semibold" title="ต้องส่งให้ Manager ตรวจก่อน">
                          รออนุมัติ
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
              จำลองประสบการณ์ผู้ใช้ตามบทบาท (Live Role Experience Simulator)
            </h3>
            <p className="text-xs text-ink-secondary font-sans mt-0.5">
              ทดสอบดูว่าเมื่อสมาชิกแต่ละคนเข้าสู่ Studio Desk (`/create`) หน้าจอและปุ่มดำเนินการจะปรับเปลี่ยนอย่างไร
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold text-ink-secondary">เลือกบทบาทจำลอง:</span>
            {(['MANAGER', 'EDITOR', 'CONTRIBUTOR', 'VIEWER'] as WorkspaceRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setSimulatedRole(role)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                  simulatedRole === role
                    ? 'bg-brand-indigo text-white font-semibold shadow-2xs'
                    : 'bg-paper-canvas text-ink-secondary hover:text-ink-primary border border-border-rule'
                }`}
              >
                {role === 'MANAGER' ? '⭐ Manager (ผู้จัดการ)' : role === 'EDITOR' ? '✍️ Editor (ครีเอเตอร์)' : role === 'CONTRIBUTOR' ? '👀 Contributor (รออนุมัติ)' : '🔍 Viewer (ลูกค้า)'}
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
                คอนโด Rich Rama 9-Srinakarin (3 ปลายทาง: FB Thailand, IG Feed, IG Story)
              </p>

              {simulatedRole === 'CONTRIBUTOR' ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-2.5 px-4 bg-accent-terracotta text-white font-mono font-semibold text-xs rounded-editorial shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>ส่งให้ผู้จัดการตรวจสอบ (Submit for Manager Approval)</span>
                  </button>
                  <p className="text-[10px] text-accent-terracotta font-sans leading-relaxed">
                    ⚠️ บัญชีคุณเป็น Contributor ไม่สามารถยิงโพสต์ตรงได้ เพื่อป้องกันการโพสต์ข้อมูลผิดพลาด โพสต์จะถูกส่งไปยัง Manager Queue ให้หัวหน้ากดอนุมัติก่อนขึ้นจริง
                  </p>
                </div>
              ) : simulatedRole === 'VIEWER' ? (
                <div className="space-y-2">
                  <div className="py-2.5 px-4 bg-paper-subtle border border-border-rule text-ink-secondary font-mono text-xs rounded-editorial flex items-center justify-center gap-2 cursor-not-allowed">
                    <Lock className="w-4 h-4" />
                    <span>โหมดผู้ตรวจงาน (Read-Only Mode)</span>
                  </div>
                  <p className="text-[10px] text-ink-secondary font-sans">
                    คุณมีสิทธิ์เปิดดู Phone Mockup และปฏิทินเท่านั้น ไม่สามารถทำการแก้ไขหรือยิงโพสต์ได้
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-2.5 px-4 bg-brand-indigo text-white font-mono font-semibold text-xs rounded-editorial shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>เผยแพร่ทันที 3 ช่องทาง (Instant Multi-Dispatch)</span>
                  </button>
                  <p className="text-[10px] text-semantic-success font-sans leading-relaxed">
                    ✓ คุณถือสิทธิ์ {simulatedRole} สามารถยิงโพสต์เข้าสู่ระบบ Dispatch Engine ได้โดยตรงทันที
                  </p>
                </div>
              )}
            </div>
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
                  เชิญสมาชิกใหม่เข้าสู่โปรเจกต์
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
                  ชื่อ - นามสกุล (Full Name)
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น: วรวิทย์ เกียรติสกุล"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-medium focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1">
                  อีเมลสำหรับส่งคำเชิญ (Email Address)
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@capitalone.co.th"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1">
                  กำหนดโปรเจกต์ (Assign Workspace)
                </label>
                <select
                  value={inviteWorkspaceId}
                  onChange={(e) => setInviteWorkspaceId(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono focus:outline-none focus:border-brand-indigo cursor-pointer"
                >
                  <option value="ws_capitalone">🏢 Capital One Real Estate (Enterprise)</option>
                  <option value="ws_acme">🎙️ Acme Creator Studio (Personal Brand)</option>
                  <option value="ws_retzpost">⚡ RetzPost Software (SaaS)</option>
                  <option value="ws_coffee">☕ Coffee Craft BKK (SME Cafe)</option>
                </select>
              </div>

              {/* Role Selection Cards */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-ink-secondary mb-1.5">
                  เลือกระดับสิทธิ์และบทบาท (Assign Role & Permissions)
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
                          <span className="font-semibold text-xs text-ink-primary block">
                            {def.label}
                          </span>
                          <span className="text-[11px] text-ink-secondary block font-sans leading-tight">
                            {def.descriptionTh}
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
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial text-xs font-mono font-semibold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>ส่งคำเชิญเข้าร่วมโปรเจกต์</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
