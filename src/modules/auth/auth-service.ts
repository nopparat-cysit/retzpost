/**
 * RETZPOST AUTHENTICATION SERVICE
 * 
 * Manages user accounts, session state, credential validation,
 * password hashing/storage simulation, and integration with the AppShell.
 */

import { AuthUser, RegisterInput, AuthResponse } from './auth-types';

export const AUTH_SESSION_KEY = 'retzpost_auth_session';
export const REGISTERED_USERS_KEY = 'retzpost_registered_users';
export const AUTH_CHANGE_EVENT = 'retzpost:auth-state-change';

interface StoredAccount {
  user: AuthUser;
  passwordHash: string; // Plaintext or simulated hash for local-first testing
}

// Default Seed Accounts
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    user: {
      id: 'usr_superadmin',
      email: 'superadmin@retzpost.io',
      username: 'superadmin',
      name: 'Super Admin',
      role: 'Owner',
      avatarBg: 'bg-purple-900',
      avatarText: 'SA',
      activeWorkspaceId: 'ws_main',
      createdAt: '2026-01-01T00:00:00Z',
    },
    passwordHash: 'SuperAdmin2026!',
  },
  {
    user: {
      id: 'usr_manager',
      email: 'demo.manager@gmail.com',
      username: 'demomanager',
      name: 'Demo Manager',
      role: 'Manager',
      avatarBg: 'bg-brand-indigo',
      avatarText: 'DM',
      activeWorkspaceId: 'ws_main',
      createdAt: '2026-01-15T09:00:00Z',
    },
    passwordHash: 'Password123!',
  },
  {
    user: {
      id: 'usr_owner',
      email: 'demo.owner@gmail.com',
      username: 'demoowner',
      name: 'Demo Owner',
      role: 'Owner',
      avatarBg: 'bg-accent-terracotta',
      avatarText: 'DO',
      activeWorkspaceId: 'ws_creator',
      createdAt: '2026-02-01T10:30:00Z',
    },
    passwordHash: 'Password123!',
  },
];

let memoryAccounts: StoredAccount[] = [...DEFAULT_ACCOUNTS];
let memorySession: AuthUser | null = null;

export function resetMemoryAccounts(): void {
  memoryAccounts = [...DEFAULT_ACCOUNTS];
  memorySession = null;
}

/**
 * Get all accounts from localStorage, initializing with defaults if empty
 */
export function getStoredAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return memoryAccounts;
  try {
    const raw = window.localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) {
      window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return memoryAccounts;
  }
}

/**
 * Save accounts to localStorage
 */
function saveStoredAccounts(accounts: StoredAccount[]): void {
  memoryAccounts = accounts;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save accounts:', err);
  }
}

/**
 * Get the currently logged-in user
 */
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return memorySession;
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    return memorySession;
  } catch {
    return memorySession;
  }
}

/**
 * Set active user session and broadcast change
 */
export function setCurrentUser(user: AuthUser | null): void {
  memorySession = user;
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_SESSION_KEY);
    }
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { user } }));
  } catch (err) {
    console.error('Failed to set current user session:', err);
  }
}

/**
 * Subscribe to auth session changes
 */
export function subscribeToAuthChange(callback: (user: AuthUser | null) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ user: AuthUser | null }>;
    callback(customEvent.detail ? customEvent.detail.user : null);
  };

  window.addEventListener(AUTH_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  };
}

/**
 * Log in using Gmail or Username
 */
export function loginUser(identifier: string, password: string, locale?: string): AuthResponse {
  const accounts = getStoredAccounts();
  const cleanId = identifier.trim().toLowerCase();

  const found = accounts.find(
    (acc) =>
      acc.user.email.toLowerCase() === cleanId ||
      acc.user.username.toLowerCase() === cleanId.replace(/^@/, '')
  );

  if (!found) {
    return {
      success: false,
      message: locale === 'en' ? 'User account or email not found. Please check again or register.' : 'ไม่พบบัญชีผู้ใช้งานหรืออีเมลนี้ในระบบ กรุณาตรวจสอบอีกครั้งหรือกดสมัครสมาชิก',
      messageEn: 'User account or email not found. Please check again or register.',
    };
  }

  if (found.passwordHash !== password) {
    return {
      success: false,
      message: locale === 'en' ? 'Invalid password. Please try again or click "Forgot Password".' : 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง หรือคลิก "ลืมรหัสผ่าน"',
      messageEn: 'Invalid password. Please try again or click "Forgot Password".',
    };
  }

  // Set session
  setCurrentUser(found.user);

  return {
    success: true,
    message: locale === 'en' ? `Welcome back, ${found.user.name}!` : `ยินดีต้อนรับกลับ, ${found.user.name}!`,
    messageEn: `Welcome back, ${found.user.name}!`,
    user: found.user,
  };
}

/**
 * Register a new user
 */
export function registerUser(input: RegisterInput, locale?: string): AuthResponse {
  const accounts = getStoredAccounts();
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanUsername = input.username.trim().replace(/^@/, '').toLowerCase();

  // Validate unique email
  if (accounts.some((acc) => acc.user.email.toLowerCase() === cleanEmail)) {
    return {
      success: false,
      message: locale === 'en' ? 'This email is already registered. Please sign in or use another email.' : 'อีเมล Gmail นี้ถูกใช้สมัครสมาชิกไปแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ',
      messageEn: 'This email is already registered. Please sign in or use another email.',
    };
  }

  // Validate unique username
  if (accounts.some((acc) => acc.user.username.toLowerCase() === cleanUsername)) {
    return {
      success: false,
      message: locale === 'en' ? `Username @${cleanUsername} is already taken. Please choose another.` : `ชื่อผู้ใช้ @${cleanUsername} มีผู้อื่นใช้แล้ว กรุณาเลือกชื่อผู้ใช้อื่น`,
      messageEn: `Username @${cleanUsername} is already taken. Please choose another.`,
    };
  }

  // Create Initials
  const displayUsername = input.username.trim().replace(/^@/, '');
  const avatarText = displayUsername.slice(0, 2).toUpperCase();

  const newUser: AuthUser = {
    id: `usr_${Date.now()}`,
    email: cleanEmail,
    username: cleanUsername,
    name: displayUsername,
    role: 'Creator',
    avatarBg: 'bg-brand-indigo',
    avatarText,
    activeWorkspaceId: 'ws_capitalone',
    createdAt: new Date().toISOString(),
  };

  accounts.push({
    user: newUser,
    passwordHash: input.password,
  });

  saveStoredAccounts(accounts);
  setCurrentUser(newUser);

  return {
    success: true,
    message: locale === 'en' ? 'User account created and signed in successfully.' : 'สร้างบัญชีผู้ใช้ใหม่และเข้าสู่ระบบเรียบร้อยแล้ว',
    messageEn: 'User account created and signed in successfully.',
    user: newUser,
  };
}

/**
 * Reset password for a registered email
 */
export function resetUserPassword(
  email: string,
  newPassword: string,
  locale?: string
): { success: boolean; message: string; messageEn?: string } {
  const accounts = getStoredAccounts();
  const cleanEmail = email.trim().toLowerCase();

  const index = accounts.findIndex((acc) => acc.user.email.toLowerCase() === cleanEmail);

  if (index === -1) {
    return {
      success: false,
      message: locale === 'en' ? 'No account associated with this email.' : 'ไม่พบบัญชีที่ผูกกับอีเมลนี้ในระบบ',
      messageEn: 'No account associated with this email.',
    };
  }

  accounts[index].passwordHash = newPassword;
  saveStoredAccounts(accounts);

  return {
    success: true,
    message: 'เปลี่ยนรหัสผ่านใหม่เรียบร้อยแล้ว สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที',
  };
}

/**
 * Check if an email is registered
 */
export function isEmailRegistered(email: string): boolean {
  const accounts = getStoredAccounts();
  const cleanEmail = email.trim().toLowerCase();
  return accounts.some((acc) => acc.user.email.toLowerCase() === cleanEmail);
}

/**
 * Log out current session
 */
export function logoutUser(): void {
  setCurrentUser(null);
}
