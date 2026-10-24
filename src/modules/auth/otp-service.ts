/**
 * RETZPOST EMAIL OTP VERIFICATION SERVICE
 * 
 * Generates, verifies, and dispatches simulated email verification OTP codes (6 digits).
 * Features 60-second cooldown, 5-minute expiry, and reactive broadcast for UI Email preview.
 */

import { OTPPurpose, OTPRecord, EmailNotificationPayload } from './auth-types';

const OTP_STORAGE_KEY = 'retzpost_active_otps';
export const EMAIL_NOTIFICATION_EVENT = 'retzpost:email-sent';

let memoryOtpStore: Record<string, OTPRecord> = {};

export function clearMemoryOtps(): void {
  memoryOtpStore = {};
}

/**
 * Generate a 6-digit numeric OTP code
 */
export function generateRandomOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Retrieve all currently pending OTPs from localStorage or in-memory fallback
 */
function getStoredOtps(): Record<string, OTPRecord> {
  if (typeof window === 'undefined') return memoryOtpStore;
  try {
    const raw = window.localStorage.getItem(OTP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : memoryOtpStore;
  } catch {
    return memoryOtpStore;
  }
}

/**
 * Save OTP map to localStorage and in-memory fallback
 */
function saveStoredOtps(otps: Record<string, OTPRecord>): void {
  memoryOtpStore = otps;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otps));
  } catch (err) {
    console.error('Failed to save OTP records:', err);
  }
}

/**
 * Generate and dispatch an OTP for an email address
 */
export function sendEmailOtp(
  email: string,
  purpose: OTPPurpose
): { success: boolean; code: string; message: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const code = generateRandomOtpCode();
  const now = Date.now();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes valid

  const otps = getStoredOtps();
  const key = `${normalizedEmail}_${purpose}`;

  otps[key] = {
    code,
    email: normalizedEmail,
    purpose,
    createdAt: now,
    expiresAt,
  };

  saveStoredOtps(otps);

  // Dispatch simulated email event to window for instant in-app notification & auto-fill preview
  if (typeof window !== 'undefined') {
    const payload: EmailNotificationPayload = {
      to: normalizedEmail,
      subject:
        purpose === 'REGISTER'
          ? `[RetzPost Security] รหัส OTP ยืนยันการสมัครสมาชิก: ${code}`
          : `[RetzPost Security] รหัส OTP กู้คืนรหัสผ่านของคุณ: ${code}`,
      code,
      purpose,
      timestamp: now,
      expiresInMinutes: 5,
    };

    window.dispatchEvent(
      new CustomEvent(EMAIL_NOTIFICATION_EVENT, { detail: payload })
    );

    // Also store last sent email for persistent toast display across fast renders
    window.sessionStorage.setItem('retzpost_last_email_otp', JSON.stringify(payload));
  }

  return {
    success: true,
    code,
    message: `ส่งรหัส OTP 6 หลักไปยัง ${normalizedEmail} สำเร็จแล้ว`,
  };
}

/**
 * Verify if the entered OTP is correct and unexpired
 */
export function verifyEmailOtp(
  email: string,
  code: string,
  purpose: OTPPurpose
): { valid: boolean; message: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const enteredCode = code.trim();
  const otps = getStoredOtps();
  const key = `${normalizedEmail}_${purpose}`;
  const record = otps[key];

  if (!record) {
    return {
      valid: false,
      message: 'ไม่พบรหัส OTP สำหรับอีเมลนี้ กรุณากดขอรหัส OTP ใหม่อีกครั้ง',
    };
  }

  if (Date.now() > record.expiresAt) {
    // Delete expired record
    delete otps[key];
    saveStoredOtps(otps);
    return {
      valid: false,
      message: 'รหัส OTP หมดอายุแล้ว (เกิน 5 นาที) กรุณากดขอรหัสใหม่',
    };
  }

  if (record.code !== enteredCode) {
    return {
      valid: false,
      message: 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง',
    };
  }

  // OTP verified successfully! Delete it to prevent re-use
  delete otps[key];
  saveStoredOtps(otps);

  return {
    valid: true,
    message: 'ยืนยันรหัส OTP ถูกต้องสำเร็จ',
  };
}

/**
 * Get remaining cooldown seconds for resending OTP
 */
export function getOtpCooldownSeconds(email: string, purpose: OTPPurpose): number {
  const normalizedEmail = email.trim().toLowerCase();
  const otps = getStoredOtps();
  const key = `${normalizedEmail}_${purpose}`;
  const record = otps[key];

  if (!record) return 0;
  const elapsedSeconds = Math.floor((Date.now() - record.createdAt) / 1000);
  const remaining = 60 - elapsedSeconds;
  return remaining > 0 ? remaining : 0;
}
