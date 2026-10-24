import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateRandomOtpCode,
  sendEmailOtp,
  verifyEmailOtp,
  getOtpCooldownSeconds,
  clearMemoryOtps,
} from './otp-service';
import {
  registerUser,
  loginUser,
  resetUserPassword,
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  isEmailRegistered,
  resetMemoryAccounts,
} from './auth-service';

describe('Auth & Email OTP Verification System', () => {
  beforeEach(() => {
    clearMemoryOtps();
    resetMemoryAccounts();
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }
  });

  describe('OTP Service', () => {
    it('should generate a 6-digit numeric OTP code', () => {
      const code = generateRandomOtpCode();
      expect(code).toHaveLength(6);
      expect(/^\d{6}$/.test(code)).toBe(true);
    });

    it('should send and verify a valid OTP code', () => {
      const email = 'test_user@gmail.com';
      const sendResult = sendEmailOtp(email, 'REGISTER');
      expect(sendResult.success).toBe(true);
      expect(sendResult.code).toHaveLength(6);

      // Verify with matching code
      const verifyResult = verifyEmailOtp(email, sendResult.code, 'REGISTER');
      expect(verifyResult.valid).toBe(true);

      // Second verification should fail because OTP was consumed
      const secondVerify = verifyEmailOtp(email, sendResult.code, 'REGISTER');
      expect(secondVerify.valid).toBe(false);
    });

    it('should reject invalid or wrong OTP code', () => {
      const email = 'test_wrong@gmail.com';
      sendEmailOtp(email, 'REGISTER');

      const result = verifyEmailOtp(email, '000000', 'REGISTER');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('ไม่ถูกต้อง');
    });

    it('should calculate cooldown seconds accurately', () => {
      const email = 'cooldown@gmail.com';
      sendEmailOtp(email, 'FORGOT_PASSWORD');

      const cooldown = getOtpCooldownSeconds(email, 'FORGOT_PASSWORD');
      expect(cooldown).toBeGreaterThanOrEqual(58);
      expect(cooldown).toBeLessThanOrEqual(60);
    });
  });

  describe('Auth Service (Register, Login, Password Reset)', () => {
    it('should login default seed user successfully with email or username', () => {
      // By email
      const res1 = loginUser('nopparat@gmail.com', 'Password123!');
      expect(res1.success).toBe(true);
      expect(res1.user?.name).toBe('Nopparat C.');

      // By username
      const res2 = loginUser('nopparat', 'Password123!');
      expect(res2.success).toBe(true);
      expect(res2.user?.name).toBe('Nopparat C.');
    });

    it('should reject invalid password or unknown user', () => {
      const badPass = loginUser('nopparat@gmail.com', 'WrongPassword!');
      expect(badPass.success).toBe(false);
      expect(badPass.message).toContain('รหัสผ่านไม่ถูกต้อง');

      const unknown = loginUser('nobody@gmail.com', 'Password123!');
      expect(unknown.success).toBe(false);
      expect(unknown.message).toContain('ไม่พบบัญชีผู้ใช้งาน');
    });

    it('should register a new user with gmail, username, and pass', () => {
      const regRes = registerUser({
        email: 'newcreator@gmail.com',
        username: 'retz_super',
        password: 'SecurePass2026!',
      });

      expect(regRes.success).toBe(true);
      expect(regRes.user?.email).toBe('newcreator@gmail.com');
      expect(regRes.user?.username).toBe('retz_super');

      // Check duplicate email
      const dupEmail = registerUser({
        email: 'newcreator@gmail.com',
        username: 'other_user',
        password: 'Password123!',
      });
      expect(dupEmail.success).toBe(false);
      expect(dupEmail.message).toContain('อีเมล Gmail นี้ถูกใช้สมัครสมาชิกไปแล้ว');

      // Can login with new user credentials
      const loginRes = loginUser('retz_super', 'SecurePass2026!');
      expect(loginRes.success).toBe(true);
    });

    it('should reset user password and allow login with new password', () => {
      const email = 'alex@gmail.com';
      expect(isEmailRegistered(email)).toBe(true);

      const resetRes = resetUserPassword(email, 'BrandNewPass2026!');
      expect(resetRes.success).toBe(true);

      // Old password fails
      const oldLogin = loginUser(email, 'Password123!');
      expect(oldLogin.success).toBe(false);

      // New password succeeds
      const newLogin = loginUser(email, 'BrandNewPass2026!');
      expect(newLogin.success).toBe(true);
      expect(newLogin.user?.name).toBe('Alex Rivera');
    });

    it('should handle session and logout', () => {
      loginUser('nopparat@gmail.com', 'Password123!');
      expect(getCurrentUser()?.username).toBe('nopparat');

      logoutUser();
      expect(getCurrentUser()).toBeNull();
    });
  });
});
