/**
 * RETZPOST GLOBAL ACTIVE WORKSPACE SYNC ENGINE
 * 
 * Synchronizes the currently selected workspace/project across all app pages:
 * - /accounts (Connected Accounts & Channels)
 * - / (Dashboard & Performance Tracking)
 * - /calendar (Editorial Calendar)
 * - /create (Studio Dispatch Composer)
 * 
 * Persists in localStorage and broadcasts via custom window events for instant reactivity.
 */

export const WORKSPACE_STORAGE_KEY = 'retzpost_active_project_id';
export const WORKSPACE_CHANGE_EVENT = 'retzpost:workspace-change';

export interface WorkspaceMapping {
  standardId: string; // e.g. 'ws_capitalone'
  calendarId: string; // e.g. 'CAPITAL_ONE'
  name: string;
  nameTh?: string;
  nameEn?: string;
}

export const WORKSPACE_MAPPINGS: WorkspaceMapping[] = [
  {
    standardId: 'ALL',
    calendarId: 'ALL',
    name: 'Master Hub (รวมทุกบัญชี)',
    nameTh: 'Master Hub (รวมทุกบัญชี)',
    nameEn: 'Master Hub (All Channels)',
  },
  {
    standardId: 'ws_main',
    calendarId: 'MAIN_STUDIO',
    name: 'Main Studio (โปรเจกต์หลัก)',
    nameTh: 'Main Studio (โปรเจกต์หลัก)',
    nameEn: 'Main Studio (Flagship)',
  },
  {
    standardId: 'ws_creator',
    calendarId: 'CREATOR_HUB',
    name: 'Creator Hub (ครีเอเตอร์ / สตูดิโอ)',
    nameTh: 'Creator Hub (ครีเอเตอร์ / สตูดิโอ)',
    nameEn: 'Creator Hub (Studio)',
  },
  {
    standardId: 'ws_software',
    calendarId: 'SOFTWARE_DEV',
    name: 'Tech & Product Studio (SaaS & ซอฟต์แวร์)',
    nameTh: 'Tech & Product Studio (SaaS & ซอฟต์แวร์)',
    nameEn: 'Tech & Product Studio (SaaS)',
  },
  {
    standardId: 'ws_brand',
    calendarId: 'BRAND_LIFESTYLE',
    name: 'Lifestyle & Brand (ไลฟ์สไตล์ & แบรนด์)',
    nameTh: 'Lifestyle & Brand (ไลฟ์สไตล์ & แบรนด์)',
    nameEn: 'Lifestyle & Brand',
  },
  // Backward compatibility aliases
  {
    standardId: 'ws_capitalone',
    calendarId: 'MAIN_STUDIO',
    name: 'Main Studio (โปรเจกต์หลัก)',
    nameTh: 'Main Studio (โปรเจกต์หลัก)',
    nameEn: 'Main Studio (Flagship)',
  },
  {
    standardId: 'ws_acme',
    calendarId: 'CREATOR_HUB',
    name: 'Creator Hub (ครีเอเตอร์ / สตูดิโอ)',
    nameTh: 'Creator Hub (ครีเอเตอร์ / สตูดิโอ)',
    nameEn: 'Creator Hub (Studio)',
  },
  {
    standardId: 'ws_retzpost',
    calendarId: 'SOFTWARE_DEV',
    name: 'Tech & Product Studio (SaaS & ซอฟต์แวร์)',
    nameTh: 'Tech & Product Studio (SaaS & ซอฟต์แวร์)',
    nameEn: 'Tech & Product Studio (SaaS)',
  },
  {
    standardId: 'ws_coffee',
    calendarId: 'BRAND_LIFESTYLE',
    name: 'Lifestyle & Brand (ไลฟ์สไตล์ & แบรนด์)',
    nameTh: 'Lifestyle & Brand (ไลฟ์สไตล์ & แบรนด์)',
    nameEn: 'Lifestyle & Brand',
  },
];

export const PREDEFINED_WORKSPACES = WORKSPACE_MAPPINGS;

export function getWorkspaceDisplayName(
  ws: { name?: string; nameTh?: string; nameEn?: string } | null | undefined,
  locale: string = 'th'
): string {
  if (!ws) return '';
  if (locale === 'en') {
    return ws.nameEn || ws.name || '';
  }
  return ws.nameTh || ws.name || '';
}

export function getWorkspaceName(
  ws: { name?: string; nameTh?: string; nameEn?: string } | null | undefined,
  locale: string = 'th'
): string {
  return getWorkspaceDisplayName(ws, locale);
}

/**
 * Get active workspace ID (defaults to 'ALL' or stored value)
 */
export function getActiveWorkspaceId(): string {
  if (typeof window === 'undefined') return 'ALL';
  try {
    return window.localStorage.getItem(WORKSPACE_STORAGE_KEY) || 'ALL';
  } catch {
    return 'ALL';
  }
}

/**
 * Set active workspace ID and broadcast change to all listening pages
 */
export function setActiveWorkspaceId(workspaceId: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, workspaceId);
    window.dispatchEvent(
      new CustomEvent(WORKSPACE_CHANGE_EVENT, { detail: { workspaceId } })
    );
  } catch (err) {
    console.error('Failed to set active workspace:', err);
  }
}

/**
 * Subscribe to workspace change events
 */
export function subscribeToActiveWorkspace(callback: (workspaceId: string) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ workspaceId: string }>;
    if (customEvent.detail && customEvent.detail.workspaceId) {
      callback(customEvent.detail.workspaceId);
    }
  };

  window.addEventListener(WORKSPACE_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener(WORKSPACE_CHANGE_EVENT, handler);
  };
}

/**
 * Convert between standard ID (e.g., 'ws_capitalone') and calendar ID (e.g., 'CAPITAL_ONE')
 */
export function toCalendarWorkspaceId(standardId: string): string {
  const match = WORKSPACE_MAPPINGS.find(
    (m) => m.standardId === standardId || m.calendarId === standardId
  );
  return match ? match.calendarId : 'ALL';
}

export function toStandardWorkspaceId(calendarId: string): string {
  const match = WORKSPACE_MAPPINGS.find(
    (m) => m.calendarId === calendarId || m.standardId === calendarId
  );
  return match ? match.standardId : 'ALL';
}
