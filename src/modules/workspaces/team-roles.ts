export type WorkspaceRole = 'OWNER' | 'MANAGER' | 'EDITOR' | 'CONTRIBUTOR' | 'VIEWER';

export type PermissionKey =
  | 'PUBLISH_DISPATCH_DIRECT'
  | 'APPROVE_DISPATCH'
  | 'CREATE_EDIT_DRAFT'
  | 'USE_TEMPLATES_AI_HUB'
  | 'MANAGE_PRESETS_TEMPLATES'
  | 'CONNECT_DISCONNECT_ACCOUNTS'
  | 'INVITE_MANAGE_MEMBERS'
  | 'EXPORT_ERROR_LOG_CSV'
  | 'VIEW_ANALYTICS_CALENDAR'
  | 'WORKSPACE_SETTINGS_DELETE';

export interface RoleDefinition {
  id: WorkspaceRole;
  label: string;
  badgeBg: string;
  badgeTextColor: string;
  descriptionTh: string;
  descriptionEn: string;
  allowedPermissions: PermissionKey[];
}

export const ROLE_DEFINITIONS: Record<WorkspaceRole, RoleDefinition> = {
  OWNER: {
    id: 'OWNER',
    label: '👑 เจ้าของโปรเจกต์ (Workspace Owner)',
    badgeBg: 'bg-brand-indigo',
    badgeTextColor: 'text-white',
    descriptionTh: 'ถือสิทธิ์สูงสุด 100%: จัดการสมาชิก, บัญชีโซเชียล, เครดิต/บิลลิ่ง, ลบหรือแก้ไขโปรเจกต์',
    descriptionEn: 'Full root authority: member access, account connections, billing, workspace deletion.',
    allowedPermissions: [
      'PUBLISH_DISPATCH_DIRECT',
      'APPROVE_DISPATCH',
      'CREATE_EDIT_DRAFT',
      'USE_TEMPLATES_AI_HUB',
      'MANAGE_PRESETS_TEMPLATES',
      'CONNECT_DISCONNECT_ACCOUNTS',
      'INVITE_MANAGE_MEMBERS',
      'EXPORT_ERROR_LOG_CSV',
      'VIEW_ANALYTICS_CALENDAR',
      'WORKSPACE_SETTINGS_DELETE',
    ],
  },
  MANAGER: {
    id: 'MANAGER',
    label: '⭐ ผู้จัดการ (Team Manager)',
    badgeBg: 'bg-semantic-info',
    badgeTextColor: 'text-white',
    descriptionTh: 'จัดการทีม, อนุมัติโพสต์ของ Contributor, ยิงโพสต์ได้ทุกช่องทาง, ดูแล Token และ Presets ประจำโปรเจกต์',
    descriptionEn: 'Team management, post approvals, full multi-format publishing, and token monitoring.',
    allowedPermissions: [
      'PUBLISH_DISPATCH_DIRECT',
      'APPROVE_DISPATCH',
      'CREATE_EDIT_DRAFT',
      'USE_TEMPLATES_AI_HUB',
      'MANAGE_PRESETS_TEMPLATES',
      'CONNECT_DISCONNECT_ACCOUNTS',
      'INVITE_MANAGE_MEMBERS',
      'EXPORT_ERROR_LOG_CSV',
      'VIEW_ANALYTICS_CALENDAR',
    ],
  },
  EDITOR: {
    id: 'EDITOR',
    label: '✍️ ครีเอเตอร์ / บรรณาธิการ (Editor & Creator)',
    badgeBg: 'bg-semantic-success',
    badgeTextColor: 'text-white',
    descriptionTh: 'สร้างและยิงโพสต์ได้โดยตรง (Feed, Story, Reels), ใช้งานเทมเพลตและคลัง AI, ส่งออกประวัติ Error ได้',
    descriptionEn: 'Direct creator: compose and dispatch posts directly to Feed, Story & Reels without prior approval.',
    allowedPermissions: [
      'PUBLISH_DISPATCH_DIRECT',
      'CREATE_EDIT_DRAFT',
      'USE_TEMPLATES_AI_HUB',
      'MANAGE_PRESETS_TEMPLATES',
      'EXPORT_ERROR_LOG_CSV',
      'VIEW_ANALYTICS_CALENDAR',
    ],
  },
  CONTRIBUTOR: {
    id: 'CONTRIBUTOR',
    label: '👀 ผู้ช่วยเขียน / รออนุมัติ (Contributor - Needs Approval)',
    badgeBg: 'bg-accent-terracotta',
    badgeTextColor: 'text-white',
    descriptionTh: 'เขียนแบบร่าง, เลือกรูปและเทมเพลตได้ แต่ยิงโพสต์ตรงไม่ได้ ต้องส่งให้ Manager อนุมัติก่อน (Approval Flow)',
    descriptionEn: 'Draft creator: can draft copy & attach media, but requires Manager approval before dispatch.',
    allowedPermissions: [
      'CREATE_EDIT_DRAFT',
      'USE_TEMPLATES_AI_HUB',
      'VIEW_ANALYTICS_CALENDAR',
    ],
  },
  VIEWER: {
    id: 'VIEWER',
    label: '🔍 ผู้ตรวจงาน / ลูกค้าภายนอก (Client Viewer - Read Only)',
    badgeBg: 'bg-paper-subtle border border-border-rule',
    badgeTextColor: 'text-ink-secondary',
    descriptionTh: 'ดูภาพรวม Dashboard, ปฏิทินคอนเทนต์, และพรีวิวเสมือนจริงบนมือถือได้เท่านั้น ไม่สามารถแก้ไขหรือโพสต์ได้',
    descriptionEn: 'Read-only access: view calendar, live dispatches, and smartphone mockups for client sign-off.',
    allowedPermissions: [
      'VIEW_ANALYTICS_CALENDAR',
    ],
  },
};

export const ALL_PERMISSIONS: Array<{ key: PermissionKey; labelTh: string; labelEn: string; category: string }> = [
  { key: 'PUBLISH_DISPATCH_DIRECT', labelTh: 'ยิงโพสต์ได้ทันที (Feed, Story, Reels)', labelEn: 'Direct Multi-Format Publishing', category: 'Publishing' },
  { key: 'APPROVE_DISPATCH', labelTh: 'อนุมัติโพสต์ของทีม (Post Approval)', labelEn: 'Approve Pending Dispatches', category: 'Publishing' },
  { key: 'CREATE_EDIT_DRAFT', labelTh: 'เขียนและแก้ไขเนื้อหา / แบบร่าง', labelEn: 'Compose & Edit Drafts', category: 'Content' },
  { key: 'USE_TEMPLATES_AI_HUB', labelTh: 'ใช้งานเทมเพลต & คลังภาพ AI', labelEn: 'Use Templates & AI Hub', category: 'Content' },
  { key: 'MANAGE_PRESETS_TEMPLATES', labelTh: 'บันทึกและจัดการ Presets & Templates', labelEn: 'Manage Presets & Templates', category: 'Content' },
  { key: 'CONNECT_DISCONNECT_ACCOUNTS', labelTh: 'เชื่อมต่อ / ถอดถอนบัญชีโซเชียล (OAuth)', labelEn: 'Manage Social Account Tokens', category: 'Security' },
  { key: 'INVITE_MANAGE_MEMBERS', labelTh: 'เชิญสมาชิก & ปรับเปลี่ยนระดับสิทธิ์', labelEn: 'Invite & Manage Team Roles', category: 'Administration' },
  { key: 'EXPORT_ERROR_LOG_CSV', labelTh: 'ส่งออกรายงาน Error Log & Telemetry CSV', labelEn: 'Export Error Log & Reports', category: 'Audit' },
  { key: 'VIEW_ANALYTICS_CALENDAR', labelTh: 'ดู Dashboard, ปฏิทิน & Live Phone Mockup', labelEn: 'View Analytics & Calendar', category: 'Read-Only' },
  { key: 'WORKSPACE_SETTINGS_DELETE', labelTh: 'ตั้งค่าระบบ & ลบโปรเจกต์', labelEn: 'Workspace Root Configuration', category: 'Administration' },
];

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  workspaceId: string;
  avatarBg: string;
  avatarText: string;
  status: 'ACTIVE' | 'INVITED';
  joinedAt: string;
  lastActiveAt: string;
}

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  // 1. Capital One Real Estate Team
  {
    id: 'mbr-c1-1',
    name: 'Nopparat C.',
    email: 'nopparat@capitalone.co.th',
    role: 'OWNER',
    workspaceId: 'ws_capitalone',
    avatarBg: 'bg-brand-indigo',
    avatarText: 'NC',
    status: 'ACTIVE',
    joinedAt: 'Jan 2026',
    lastActiveAt: 'Just now',
  },
  {
    id: 'mbr-c1-2',
    name: 'Somchai P. (หัวหน้า)',
    email: 'somchai.mgr@capitalone.co.th',
    role: 'MANAGER',
    workspaceId: 'ws_capitalone',
    avatarBg: 'bg-semantic-info',
    avatarText: 'SP',
    status: 'ACTIVE',
    joinedAt: 'Feb 2026',
    lastActiveAt: '10 mins ago',
  },
  {
    id: 'mbr-c1-3',
    name: 'Narumon K.',
    email: 'narumon.mkt@capitalone.co.th',
    role: 'EDITOR',
    workspaceId: 'ws_capitalone',
    avatarBg: 'bg-semantic-success',
    avatarText: 'NK',
    status: 'ACTIVE',
    joinedAt: 'Mar 2026',
    lastActiveAt: '1 hour ago',
  },
  {
    id: 'mbr-c1-4',
    name: 'Anan T.',
    email: 'anan.copy@capitalone.co.th',
    role: 'CONTRIBUTOR',
    workspaceId: 'ws_capitalone',
    avatarBg: 'bg-accent-terracotta',
    avatarText: 'AT',
    status: 'ACTIVE',
    joinedAt: 'Apr 2026',
    lastActiveAt: '3 hours ago',
  },
  {
    id: 'mbr-c1-5',
    name: 'The Rich Rama 9 Investor Client',
    email: 'investor@therichrama9.com',
    role: 'VIEWER',
    workspaceId: 'ws_capitalone',
    avatarBg: 'bg-ink-secondary',
    avatarText: 'RR',
    status: 'INVITED',
    joinedAt: 'Yesterday',
    lastActiveAt: 'Pending sign-in',
  },

  // 2. Acme Creator Studio Team
  {
    id: 'mbr-acme-1',
    name: 'Alex Rivera',
    email: 'alex@alexrivera.studio',
    role: 'OWNER',
    workspaceId: 'ws_acme',
    avatarBg: 'bg-brand-indigo',
    avatarText: 'AR',
    status: 'ACTIVE',
    joinedAt: 'Dec 2025',
    lastActiveAt: 'Just now',
  },
  {
    id: 'mbr-acme-2',
    name: 'Sarah Chen',
    email: 'sarah@alexrivera.studio',
    role: 'MANAGER',
    workspaceId: 'ws_acme',
    avatarBg: 'bg-semantic-info',
    avatarText: 'SC',
    status: 'ACTIVE',
    joinedAt: 'Jan 2026',
    lastActiveAt: '25 mins ago',
  },
  {
    id: 'mbr-acme-3',
    name: 'Dave Miller',
    email: 'dave.video@alexrivera.studio',
    role: 'EDITOR',
    workspaceId: 'ws_acme',
    avatarBg: 'bg-semantic-success',
    avatarText: 'DM',
    status: 'ACTIVE',
    joinedAt: 'Feb 2026',
    lastActiveAt: 'Yesterday',
  },
];

export function hasPermission(role: WorkspaceRole, permission: PermissionKey): boolean {
  const def = ROLE_DEFINITIONS[role];
  if (!def) return false;
  return def.allowedPermissions.includes(permission);
}

export function getInitialTeamMembers(): TeamMember[] {
  if (typeof window === 'undefined') return INITIAL_TEAM_MEMBERS;
  try {
    const saved = localStorage.getItem('retzpost_team_members');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }
  return INITIAL_TEAM_MEMBERS;
}

export function saveTeamMembers(members: TeamMember[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('retzpost_team_members', JSON.stringify(members));
  } catch {
    // quota exceeded or private mode
  }
}

export function inviteTeamMember(
  name: string,
  email: string,
  role: WorkspaceRole,
  workspaceId: string
): TeamMember {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'TM';

  let avatarBg = 'bg-brand-indigo';
  if (role === 'MANAGER') avatarBg = 'bg-semantic-info';
  if (role === 'EDITOR') avatarBg = 'bg-semantic-success';
  if (role === 'CONTRIBUTOR') avatarBg = 'bg-accent-terracotta';
  if (role === 'VIEWER') avatarBg = 'bg-ink-secondary';

  const newMember: TeamMember = {
    id: `mbr-inv-${Date.now()}`,
    name,
    email,
    role,
    workspaceId,
    avatarBg,
    avatarText: initials,
    status: 'INVITED',
    joinedAt: 'Just invited',
    lastActiveAt: 'Pending acceptance',
  };

  if (typeof window !== 'undefined') {
    const current = getInitialTeamMembers();
    const updated = [newMember, ...current];
    saveTeamMembers(updated);
  }

  return newMember;
}
