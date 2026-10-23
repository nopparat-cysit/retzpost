import { describe, it, expect } from 'vitest';
import { 
  ROLE_DEFINITIONS, 
  hasPermission, 
  ALL_PERMISSIONS, 
  WorkspaceRole,
  inviteTeamMember,
  INITIAL_TEAM_MEMBERS 
} from './team-roles';

describe('Team & RBAC Permissions Engine', () => {
  it('defines all 5 hierarchical roles properly', () => {
    const roles: WorkspaceRole[] = ['OWNER', 'MANAGER', 'EDITOR', 'CONTRIBUTOR', 'VIEWER'];
    for (const r of roles) {
      expect(ROLE_DEFINITIONS[r]).toBeDefined();
      expect(ROLE_DEFINITIONS[r].allowedPermissions.length).toBeGreaterThan(0);
    }
  });

  it('correctly grants Owner all permissions', () => {
    for (const p of ALL_PERMISSIONS) {
      expect(hasPermission('OWNER', p.key)).toBe(true);
    }
  });

  it('prevents Manager from deleting workspace while granting team invite', () => {
    expect(hasPermission('MANAGER', 'WORKSPACE_SETTINGS_DELETE')).toBe(false);
    expect(hasPermission('MANAGER', 'INVITE_MANAGE_MEMBERS')).toBe(true);
    expect(hasPermission('MANAGER', 'PUBLISH_DISPATCH_DIRECT')).toBe(true);
    expect(hasPermission('MANAGER', 'APPROVE_DISPATCH')).toBe(true);
  });

  it('prevents Editor from managing team or connecting accounts while allowing direct publish', () => {
    expect(hasPermission('EDITOR', 'INVITE_MANAGE_MEMBERS')).toBe(false);
    expect(hasPermission('EDITOR', 'CONNECT_DISCONNECT_ACCOUNTS')).toBe(false);
    expect(hasPermission('EDITOR', 'PUBLISH_DISPATCH_DIRECT')).toBe(true);
    expect(hasPermission('EDITOR', 'CREATE_EDIT_DRAFT')).toBe(true);
  });

  it('enforces approval workflow on Contributor by disallowing direct publish', () => {
    expect(hasPermission('CONTRIBUTOR', 'PUBLISH_DISPATCH_DIRECT')).toBe(false);
    expect(hasPermission('CONTRIBUTOR', 'APPROVE_DISPATCH')).toBe(false);
    expect(hasPermission('CONTRIBUTOR', 'CREATE_EDIT_DRAFT')).toBe(true);
    expect(hasPermission('CONTRIBUTOR', 'USE_TEMPLATES_AI_HUB')).toBe(true);
  });

  it('restricts Viewer to read-only permissions', () => {
    expect(hasPermission('VIEWER', 'VIEW_ANALYTICS_CALENDAR')).toBe(true);
    expect(hasPermission('VIEWER', 'CREATE_EDIT_DRAFT')).toBe(false);
    expect(hasPermission('VIEWER', 'PUBLISH_DISPATCH_DIRECT')).toBe(false);
  });

  it('invites a new team member and computes initials', () => {
    const invited = inviteTeamMember('Kittisak Promthep', 'kittisak@capitalone.co.th', 'EDITOR', 'ws_capitalone');
    expect(invited.id).toBeDefined();
    expect(invited.name).toBe('Kittisak Promthep');
    expect(invited.avatarText).toBe('KP');
    expect(invited.status).toBe('INVITED');
    expect(invited.role).toBe('EDITOR');
  });
});
