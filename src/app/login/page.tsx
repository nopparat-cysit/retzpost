'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Sticker } from '@/components/ui/sticker';
import { loginUser } from '@/modules/auth/auth-service';

export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage('กรุณากรอก Gmail หรือชื่อผู้ใช้งาน (Username)');
      return;
    }

    if (!password) {
      setErrorMessage('กรุณากรอกรหัสผ่าน');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = loginUser(identifier, password);
      if (res.success && res.user) {
        setSuccessMessage(`ยินดีต้อนรับกลับ, ${res.user.name}! กำลังเข้าสู่ระบบ...`);
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } else {
        setErrorMessage(res.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch {
      setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Fast-Login
  const handleQuickDemoLogin = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setErrorMessage('');
    const res = loginUser(email, pass);
    if (res.success && res.user) {
      setSuccessMessage(`เข้าสู่ระบบด้วยบัญชีทดสอบ ${res.user.name} เรียบร้อยแล้ว`);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-brand-indigo selection:text-white">
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
          <span className="text-ink-secondary hidden sm:inline">ยังไม่มีบัญชีผู้ใช้งาน?</span>
          <Link
            href="/register"
            className="font-semibold text-brand-indigo hover:text-brand-indigo-hover underline underline-offset-2 transition-colors"
          >
            สมัครสมาชิกใหม่ (Register) →
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-paper-raised border border-border-rule rounded-dialog p-6 sm:p-8 shadow-md relative">
          {/* Header Tag */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border-rule/80">
            <div className="flex items-center gap-2">
              <Sticker name="vault-keyhole" size="xs" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-secondary font-semibold">
                Editorial Desk Login
              </span>
            </div>
            <span className="text-[10px] font-mono text-semantic-success bg-semantic-success-bg px-2 py-0.5 rounded font-bold border border-semantic-success/20">
              SSL Encrypted 🔒
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-bold text-ink-primary mb-1 tracking-tight">
              เข้าสู่ระบบ RetzPost
            </h1>
            <p className="text-xs text-ink-secondary leading-relaxed">
              ระบุ Gmail หรือชื่อผู้ใช้เพื่อเข้าจัดการคอนเทนต์และมอนิเตอร์การกระจายโพสต์
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

          <form onSubmit={handleLogin} className="space-y-4">
            {/* 1. Gmail / Username Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-primary font-mono">
                Gmail หรือ ชื่อผู้ใช้ (Username)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="เช่น nopparat@gmail.com หรือ nopparat"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-paper-canvas border border-border-rule rounded-editorial font-mono text-ink-primary placeholder:text-ink-secondary/50 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all"
                />
              </div>
            </div>

            {/* 2. Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-ink-primary font-mono">
                  รหัสผ่าน (Password)
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-mono text-brand-indigo hover:underline font-medium"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="กรอกรหัสผ่านของคุณ"
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
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-ink-secondary">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-brand-indigo focus:ring-brand-indigo"
                />
                <span>จดจำการเข้าสู่ระบบไว้ในอุปกรณ์นี้</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold rounded-editorial shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span>กำลังตรวจสอบ...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>เข้าสู่ระบบ (Sign In)</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="mt-6 pt-5 border-t border-border-rule/70">
            <div className="flex items-center justify-between text-[10px] font-mono text-ink-secondary mb-2">
              <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                <UserCheck className="w-3 h-3 text-accent-terracotta" />
                คลิกเลือกบัญชีทดสอบด่วน (1-Click Demo)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('nopparat@gmail.com', 'Password123!')}
                className="p-2 rounded-editorial bg-paper-subtle/80 hover:bg-paper-canvas border border-border-rule text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-4 h-4 rounded-full bg-brand-indigo text-white flex items-center justify-center text-[9px] font-bold">
                    NC
                  </div>
                  <span className="font-semibold text-xs text-ink-primary group-hover:text-brand-indigo transition-colors truncate">
                    Nopparat C.
                  </span>
                </div>
                <p className="text-[9px] font-mono text-ink-secondary truncate">
                  Role: Manager (Capital One)
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('alex@gmail.com', 'Password123!')}
                className="p-2 rounded-editorial bg-paper-subtle/80 hover:bg-paper-canvas border border-border-rule text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-4 h-4 rounded-full bg-accent-terracotta text-white flex items-center justify-center text-[9px] font-bold">
                    AR
                  </div>
                  <span className="font-semibold text-xs text-ink-primary group-hover:text-brand-indigo transition-colors truncate">
                    Alex Rivera
                  </span>
                </div>
                <p className="text-[9px] font-mono text-ink-secondary truncate">
                  Role: Owner (Acme Studio)
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full pt-6 border-t border-border-rule/60 text-center text-[11px] font-mono text-ink-secondary">
        MULTIPOST — Dream Press Publishing Desk &copy; {new Date().getFullYear()} RetzPost SaaS. All rights reserved.
      </footer>
    </div>
  );
}
