'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  RotateCcw,
  KeyRound
} from 'lucide-react';
import { Sticker } from '@/components/ui/sticker';
import { EmailOtpToast } from '@/components/auth/email-otp-toast';
import { sendEmailOtp, verifyEmailOtp } from '@/modules/auth/otp-service';
import { resetUserPassword, isEmailRegistered } from '@/modules/auth/auth-service';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step wizard: 'REQUEST_EMAIL' | 'VERIFY_OTP' | 'NEW_PASSWORD' | 'SUCCESS'
  const [step, setStep] = useState<'REQUEST_EMAIL' | 'VERIFY_OTP' | 'NEW_PASSWORD' | 'SUCCESS'>('REQUEST_EMAIL');

  // Input states
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Timers
  const [cooldown, setCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Autofill hook from EmailOtpToast
  useEffect(() => {
    const handleAutofillEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ code: string }>;
      if (customEvent.detail && customEvent.detail.code) {
        fillOtpCode(customEvent.detail.code);
      }
    };
    window.addEventListener('retzpost:autofill-otp', handleAutofillEvent);
    return () => {
      window.removeEventListener('retzpost:autofill-otp', handleAutofillEvent);
    };
  }, []);

  const fillOtpCode = (code: string) => {
    const digits = code.slice(0, 6).split('');
    const newDigits = [...digits];
    while (newDigits.length < 6) newDigits.push('');
    setOtpDigits(newDigits);
    setErrorMessage('');
    const lastIdx = Math.min(digits.length, 5);
    inputRefs.current[lastIdx]?.focus();
  };

  // Step 1: Send OTP to email
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('กรุณากรอกอีเมล Gmail ให้ถูกต้องตามรูปแบบ');
      return;
    }

    if (!isEmailRegistered(cleanEmail)) {
      setErrorMessage('ไม่พบบัญชีที่ผูกกับอีเมลนี้ในระบบ กรุณาตรวจสอบอีกครั้งหรือสมัครสมาชิกใหม่');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = sendEmailOtp(cleanEmail, 'FORGOT_PASSWORD');
      if (res.success) {
        setStep('VERIFY_OTP');
        setCooldown(60);
        setSuccessMessage(`รหัส OTP กู้คืนรหัสผ่านถูกส่งไปยัง ${cleanEmail} แล้ว`);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('เกิดข้อผิดพลาดในการส่งรหัส OTP กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');

    if (code.length < 6) {
      setErrorMessage('กรุณากรอกรหัส OTP ให้ครบทั้ง 6 หลัก');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const res = verifyEmailOtp(email, code, 'FORGOT_PASSWORD');
    if (!res.valid) {
      setErrorMessage(res.message);
      setIsSubmitting(false);
      return;
    }

    setStep('NEW_PASSWORD');
    setIsSubmitting(false);
    setSuccessMessage('ยืนยันรหัส OTP สำเร็จ กรุณากำหนดรหัสผ่านใหม่');
  };

  // Step 3: Set New Password
  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 8) {
      setErrorMessage('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setIsSubmitting(true);

    const res = resetUserPassword(email, newPassword);
    if (!res.success) {
      setErrorMessage(res.message);
      setIsSubmitting(false);
      return;
    }

    setStep('SUCCESS');
    setIsSubmitting(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setErrorMessage('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (cooldown > 0) return;
    setErrorMessage('');
    const res = sendEmailOtp(email, 'FORGOT_PASSWORD');
    if (res.success) {
      setCooldown(60);
      setSuccessMessage('ส่งรหัส OTP กู้คืนรหัสผ่านชุดใหม่เรียบร้อยแล้ว');
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-brand-indigo selection:text-white">
      {/* Simulation Email Notification Toast in top right */}
      <EmailOtpToast onAutofill={fillOtpCode} />

      {/* Top Header Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-border-rule/60">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-editorial bg-brand-indigo text-white flex items-center justify-center font-serif font-bold text-sm shadow-2xs group-hover:bg-brand-indigo-hover transition-colors">
            RP
          </div>
          <div className="leading-none">
            <span className="font-serif font-bold text-xl tracking-tight text-ink-primary">
              RETZPOST
            </span>
            <span className="text-[10px] font-mono uppercase text-accent-terracotta ml-1.5 font-bold tracking-wider">
              Dream Press
            </span>
          </div>
        </Link>

        <Link
          href="/login"
          className="text-xs font-semibold text-brand-indigo hover:text-brand-indigo-hover underline underline-offset-2 transition-colors"
        >
          ← กลับหน้าเข้าสู่ระบบ (Sign In)
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-paper-raised border border-border-rule rounded-dialog p-6 sm:p-8 shadow-md relative">
          {/* Header Tag */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border-rule/80">
            <div className="flex items-center gap-2">
              <Sticker name="brass-keyring" size="xs" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-secondary font-semibold">
                Account Recovery Desk
              </span>
            </div>
            <span className="text-[10px] font-mono text-accent-terracotta bg-accent-terracotta/10 px-2 py-0.5 rounded font-bold">
              {step === 'REQUEST_EMAIL' && 'สเต็ป 1/3'}
              {step === 'VERIFY_OTP' && 'สเต็ป 2/3'}
              {step === 'NEW_PASSWORD' && 'สเต็ป 3/3'}
              {step === 'SUCCESS' && 'เสร็จสิ้น'}
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-bold text-ink-primary mb-1 tracking-tight">
              {step === 'REQUEST_EMAIL' && 'ลืมรหัสผ่าน?'}
              {step === 'VERIFY_OTP' && 'กรอกรหัส OTP จาก Gmail'}
              {step === 'NEW_PASSWORD' && 'ตั้งรหัสผ่านใหม่'}
              {step === 'SUCCESS' && 'รีเซ็ตรหัสผ่านสำเร็จ!'}
            </h1>
            <p className="text-xs text-ink-secondary leading-relaxed">
              {step === 'REQUEST_EMAIL' && 'ระบุอีเมล Gmail ที่ลงทะเบียนไว้เพื่อรับรหัส OTP สำหรับยืนยันตัวตน'}
              {step === 'VERIFY_OTP' && `ระบบส่งรหัส 6 หลักไปยัง ${email}`}
              {step === 'NEW_PASSWORD' && 'กำหนดรหัสผ่านใหม่สำหรับเข้าสู่ระบบ RetzPost'}
              {step === 'SUCCESS' && 'รหัสผ่านของคุณได้รับการอัปเดตเรียบร้อยแล้ว'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-editorial bg-semantic-error-bg border border-semantic-error/30 text-semantic-error text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-editorial bg-semantic-success-bg border border-semantic-success/30 text-semantic-success text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-snug">{successMessage}</span>
            </div>
          )}

          {/* STEP 1: REQUEST EMAIL */}
          {step === 'REQUEST_EMAIL' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-primary font-mono">
                  Gmail / อีเมลที่ลงทะเบียนไว้
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="เช่น demo.manager@gmail.com หรือ your.email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-paper-canvas border border-border-rule rounded-editorial font-mono text-ink-primary placeholder:text-ink-secondary/50 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold rounded-editorial shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>กำลังส่งรหัส OTP...</span>
                ) : (
                  <>
                    <span>ส่งรหัส OTP กู้คืนรหัสผ่าน</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 'VERIFY_OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in duration-200">
              <div className="p-3 bg-paper-subtle/80 rounded-editorial border border-border-rule text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-secondary font-mono block">อีเมลปลายทาง:</span>
                  <span className="font-mono font-bold text-ink-primary">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('REQUEST_EMAIL')}
                  className="text-[10px] font-mono text-brand-indigo hover:underline flex items-center gap-1 font-semibold"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>เปลี่ยนอีเมล</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-ink-primary font-mono text-center">
                  กรอกรหัส 6 หลัก (OTP Verification Code)
                </label>
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold bg-paper-canvas border-2 border-border-rule rounded-editorial text-brand-indigo focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all shadow-2xs"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1 text-[11px] font-mono text-ink-secondary">
                  <Clock className="w-3.5 h-3.5 text-accent-terracotta" />
                  {cooldown > 0 ? (
                    <span>ขอรหัสใหม่ได้ในอีก 00:{cooldown < 10 ? `0${cooldown}` : cooldown}</span>
                  ) : (
                    <span className="text-semantic-success font-semibold">ขอรหัส OTP ใหม่ได้แล้ว</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0}
                  className="text-xs font-semibold font-mono text-brand-indigo hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>ขอรหัสใหม่</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpDigits.join('').length < 6}
                className="w-full py-2.5 px-4 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold rounded-editorial shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>กำลังตรวจสอบ...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>ยืนยันรหัส OTP</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: SET NEW PASSWORD */}
          {step === 'NEW_PASSWORD' && (
            <form onSubmit={handleSetNewPassword} className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-primary font-mono">
                  รหัสผ่านใหม่ (New Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-xs bg-paper-canvas border border-border-rule rounded-editorial font-mono text-ink-primary placeholder:text-ink-secondary/50 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-ink-secondary hover:text-ink-primary"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-primary font-mono">
                  ยืนยันรหัสผ่านใหม่อีกครั้ง
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="พิมพ์รหัสผ่านใหม่อีกครั้งให้ตรงกัน"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-xs bg-paper-canvas border border-border-rule rounded-editorial font-mono text-ink-primary placeholder:text-ink-secondary/50 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-ink-secondary hover:text-ink-primary"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold rounded-editorial shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>กำลังบันทึกรหัสผ่าน...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>บันทึกรหัสผ่านใหม่</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'SUCCESS' && (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 mx-auto rounded-full bg-semantic-success-bg text-semantic-success flex items-center justify-center border border-semantic-success/30 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  เปลี่ยนรหัสผ่านใหม่เรียบร้อยแล้ว!
                </h3>
                <p className="text-xs text-ink-secondary mt-1">
                  คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold rounded-editorial shadow-xs transition-colors"
                >
                  <span>ไปที่หน้าเข้าสู่ระบบ (Sign In)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full pt-6 border-t border-border-rule/60 text-center text-[11px] font-mono text-ink-secondary space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium">
          <Link href="/docs" target="_blank" className="hover:text-brand-indigo underline underline-offset-2 transition-colors">
            📖 คู่มือใช้งาน (Docs & Guide)
          </Link>
          <span>•</span>
          <Link href="/privacy" target="_blank" className="hover:text-brand-indigo underline underline-offset-2 transition-colors">
            🔒 นโยบายความเป็นส่วนตัว (Privacy Policy)
          </Link>
          <span>•</span>
          <Link href="/terms" target="_blank" className="hover:text-brand-indigo underline underline-offset-2 transition-colors">
            📜 ข้อกำหนดการใช้งาน (Terms of Service)
          </Link>
        </div>
        <p>RETZPOST — Dream Press Publishing Desk &copy; {new Date().getFullYear()} RetzPost SaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
