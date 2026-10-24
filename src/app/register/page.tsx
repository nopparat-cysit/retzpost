'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import { Sticker } from '@/components/ui/sticker';
import { EmailOtpToast } from '@/components/auth/email-otp-toast';
import { sendEmailOtp, verifyEmailOtp } from '@/modules/auth/otp-service';
import { registerUser, isEmailRegistered } from '@/modules/auth/auth-service';

export default function RegisterPage() {
  const router = useRouter();

  // Form State
  const [gmail, setGmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Flow & OTP State
  const [step, setStep] = useState<'DETAILS' | 'OTP' | 'SUCCESS'>('DETAILS');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // OTP Input refs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Listen to Autofill OTP event from Toast
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
    // Focus last filled
    const lastIdx = Math.min(digits.length, 5);
    inputRefs.current[lastIdx]?.focus();
  };

  // Password strength score calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: 'ว่างเปล่า', color: 'bg-border-rule' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'เปราะบาง', color: 'bg-semantic-error' };
    if (score === 2) return { score: 2, label: 'ปานกลาง', color: 'bg-accent-ochre' };
    if (score === 3) return { score: 3, label: 'ค่อนข้างดี', color: 'bg-brand-indigo' };
    return { score: 4, label: 'แข็งแรงมาก', color: 'bg-semantic-success' };
  };

  const strength = getPasswordStrength();

  // Validate Step 1 and Send OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanGmail = gmail.trim().toLowerCase();
    const cleanUsername = username.trim().replace(/^@/, '');

    if (!cleanGmail || !cleanGmail.includes('@') || !cleanGmail.includes('.')) {
      setErrorMessage('กรุณาระบุที่อยู่อีเมล Gmail ให้ถูกต้องตามรูปแบบ (เช่น name@gmail.com)');
      return;
    }

    if (isEmailRegistered(cleanGmail)) {
      setErrorMessage('อีเมลนี้เคยลงทะเบียนไว้แล้ว กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น');
      return;
    }

    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMessage('ชื่อผู้ใช้ (Username) ต้องมีความยาวอย่างน้อย 3 ตัวอักษร');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('กรุณายอมรับข้อกำหนดและนโยบายความเป็นส่วนตัว');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send OTP to email
      const res = sendEmailOtp(cleanGmail, 'REGISTER');
      if (res.success) {
        setStep('OTP');
        setCooldown(60);
        setSuccessMessage(`รหัส OTP 6 หลักถูกส่งไปยัง ${cleanGmail} เรียบร้อยแล้ว`);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP Digit Input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setErrorMessage('');

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      fillOtpCode(pasteData);
    }
  };

  // Verify OTP and complete registration
  const handleVerifyOtpAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');

    if (code.length < 6) {
      setErrorMessage('กรุณากรอกรหัส OTP ให้ครบทั้ง 6 หลัก');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const verifyResult = verifyEmailOtp(gmail, code, 'REGISTER');
    if (!verifyResult.valid) {
      setErrorMessage(verifyResult.message);
      setIsSubmitting(false);
      return;
    }

    // Register user in storage
    const regResult = registerUser({
      email: gmail,
      username,
      password,
    });

    if (!regResult.success) {
      setErrorMessage(regResult.message || 'ไม่สามารถลงทะเบียนได้');
      setIsSubmitting(false);
      return;
    }

    setStep('SUCCESS');
    setIsSubmitting(false);

    // Redirect to home/dashboard after 1.8 seconds
    setTimeout(() => {
      router.push('/');
    }, 1800);
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (cooldown > 0) return;
    setErrorMessage('');
    const res = sendEmailOtp(gmail, 'REGISTER');
    if (res.success) {
      setCooldown(60);
      setSuccessMessage('ส่งรหัส OTP ชุดใหม่ไปยังอีเมลของคุณเรียบร้อยแล้ว');
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-brand-indigo selection:text-white relative">
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
              MULTIPOST
            </span>
            <span className="text-[10px] font-mono uppercase text-accent-terracotta ml-1.5 font-bold tracking-wider">
              Dream Press
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-ink-secondary hidden sm:inline">มีบัญชีผู้ใช้งานอยู่แล้ว?</span>
          <Link
            href="/login"
            className="font-semibold text-brand-indigo hover:text-brand-indigo-hover underline underline-offset-2 transition-colors"
          >
            เข้าสู่ระบบ (Sign In) →
          </Link>
        </div>
      </header>

      {/* Main Registration Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-paper-raised border border-border-rule rounded-dialog p-6 sm:p-8 shadow-md relative">
          {/* Masthead Tag */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border-rule/80">
            <div className="flex items-center gap-2">
              <Sticker name="approved-seal" size="xs" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-secondary font-semibold">
                Creator Registration Desk
              </span>
            </div>
            <span className="text-[10px] font-mono text-accent-terracotta bg-accent-terracotta/10 px-2 py-0.5 rounded font-bold">
              {step === 'DETAILS' ? 'ขั้นตอน 1/2' : step === 'OTP' ? 'ขั้นตอน 2/2' : 'เสร็จสมบูรณ์'}
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-bold text-ink-primary mb-1 tracking-tight">
              {step === 'DETAILS' && 'สมัครสมาชิกใหม่'}
              {step === 'OTP' && 'ยืนยันรหัส OTP ใน Gmail'}
              {step === 'SUCCESS' && 'ลงทะเบียนสำเร็จ!'}
            </h1>
            <p className="text-xs text-ink-secondary leading-relaxed">
              {step === 'DETAILS' && 'สร้างบัญชี RetzPost เพื่อเชื่อมต่อและยิงโพสต์ทุกโซเชียลพร้อมกัน'}
              {step === 'OTP' && `ระบบส่งรหัส 6 หลักไปที่ ${gmail}`}
              {step === 'SUCCESS' && 'กำลังพาคุณเข้าสู่ Studio Dispatch Monitor...'}
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

          {/* STEP 1: ACCOUNT DETAILS (Gmail, Username, Pass) */}
          {step === 'DETAILS' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              {/* 1. Gmail Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-primary font-mono">
                  Gmail / อีเมลติดต่อ <span className="text-accent-terracotta">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-paper-canvas border border-border-rule rounded-editorial font-mono text-ink-primary placeholder:text-ink-secondary/50 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all"
                  />
                </div>
                <p className="text-[10px] text-ink-secondary font-mono">
                  ระบบจะส่งรหัสยืนยัน OTP 6 หลักไปยังอีเมลนี้
                </p>
              </div>

              {/* 2. Username Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-primary font-mono">
                  ชื่อผู้ใช้ (Username) <span className="text-accent-terracotta">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="retz_creator"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-paper-canvas border border-border-rule rounded-editorial font-mono text-ink-primary placeholder:text-ink-secondary/50 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all"
                  />
                </div>
              </div>

              {/* 3. Password Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-primary font-mono">
                  รหัสผ่าน (Password) <span className="text-accent-terracotta">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="pt-1 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-ink-secondary">ความปลอดภัยของรหัส:</span>
                      <span className="font-semibold text-ink-primary">{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-full rounded-full transition-all ${
                            strength.score >= level ? strength.color : 'bg-border-rule/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-primary font-mono">
                  ยืนยันรหัสผ่านอีกครั้ง <span className="text-accent-terracotta">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="พิมพ์รหัสผ่านเดิมซ้ำอีกครั้ง"
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

              {/* Terms Checkbox */}
              <div className="pt-1 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-brand-indigo focus:ring-brand-indigo"
                />
                <label htmlFor="terms" className="text-[11px] text-ink-secondary leading-tight cursor-pointer">
                  ฉันยอมรับ{' '}
                  <Link href="/terms" target="_blank" className="text-brand-indigo font-semibold underline underline-offset-1 hover:text-brand-indigo-hover">
                    ข้อกำหนดการใช้งาน
                  </Link>{' '}
                  และ{' '}
                  <Link href="/privacy" target="_blank" className="text-brand-indigo font-semibold underline underline-offset-1 hover:text-brand-indigo-hover">
                    นโยบายความเป็นส่วนตัว (Privacy Policy)
                  </Link>{' '}
                  ของ RetzPost
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold rounded-editorial shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>กำลังส่งรหัส OTP...</span>
                ) : (
                  <>
                    <span>ส่งรหัส OTP ยืนยันไปยัง Gmail</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-5 animate-in fade-in duration-200">
              <div className="p-3 bg-paper-subtle/80 rounded-editorial border border-border-rule text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-secondary font-mono block">อีเมลปลายทาง:</span>
                  <span className="font-mono font-bold text-ink-primary">{gmail}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('DETAILS')}
                  className="text-[10px] font-mono text-brand-indigo hover:underline flex items-center gap-1 font-semibold"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>แก้ไขอีเมล</span>
                </button>
              </div>

              {/* 6 Digits Boxes */}
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
                      onPaste={handleOtpPaste}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold bg-paper-canvas border-2 border-border-rule rounded-editorial text-brand-indigo focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all shadow-2xs"
                    />
                  ))}
                </div>
              </div>

              {/* Resend Cooldown */}
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
                  <span>ขอรหัสใหม่ (Resend)</span>
                </button>
              </div>

              {/* Submit OTP */}
              <button
                type="submit"
                disabled={isSubmitting || otpDigits.join('').length < 6}
                className="w-full py-2.5 px-4 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold rounded-editorial shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>กำลังตรวจสอบรหัส...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>ยืนยันรหัส OTP และสร้างบัญชี</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="w-full py-2 text-center text-xs font-mono text-ink-secondary hover:text-ink-primary"
              >
                ← ย้อนกลับไปแก้ไขข้อมูล
              </button>
            </form>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 'SUCCESS' && (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 mx-auto rounded-full bg-semantic-success-bg text-semantic-success flex items-center justify-center border border-semantic-success/30 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  ยินดีต้อนรับสู่ RetzPost!
                </h3>
                <p className="text-xs text-ink-secondary mt-1">
                  สร้างบัญชี <span className="font-mono font-bold text-brand-indigo">{username}</span> เรียบร้อยแล้ว
                </p>
              </div>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-ink-secondary bg-paper-subtle px-3 py-1.5 rounded-full border border-border-rule">
                  <span className="w-2 h-2 rounded-full bg-semantic-success animate-ping" />
                  <span>กำลังเข้าสู่ระบบและนำท่านไปยังแดชบอร์ด...</span>
                </div>
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
        <p>MULTIPOST — Dream Press Publishing Desk &copy; {new Date().getFullYear()} RetzPost SaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
