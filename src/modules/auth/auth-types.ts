/**
 * RETZPOST AUTHENTICATION & IDENTITY SYSTEM TYPES
 */

export interface AuthUser {
  id: string;
  email: string; // e.g. user@gmail.com
  username: string; // e.g. @nopparat
  name: string; // Display name
  role: 'Owner' | 'Manager' | 'Lead Editor' | 'Creator' | 'Contributor';
  avatarBg: string;
  avatarText: string;
  activeWorkspaceId: string;
  createdAt: string;
}

export type OTPPurpose = 'REGISTER' | 'FORGOT_PASSWORD';

export interface OTPRecord {
  code: string;
  email: string;
  purpose: OTPPurpose;
  createdAt: number;
  expiresAt: number;
}

export interface EmailNotificationPayload {
  to: string;
  subject: string;
  code: string;
  purpose: OTPPurpose;
  timestamp: number;
  expiresInMinutes: number;
}

export interface RegisterInput {
  email: string; // gmail
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
}
