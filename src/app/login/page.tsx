'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Sticker } from '@/components/ui/sticker';
import { GoogleLogo } from '@/components/ui/social-icons';
import { loginUserAsync } from '@/modules/auth/auth-service';
import { useTranslation, LanguageToggle } from '@/modules/i18n/i18n-context';

export default function LoginPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle OAuth callback errors
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err) {
      if (err === 'AccessDenied') {
        setErrorMessage(locale === 'th' ? 'การเข้าสู่ระบบถูกปฏิเสธ หรือบัญชีถูกระงับ' : 'Access denied or account suspended');
      } else if (err === 'OAuthSignin' || err === 'OAuthCallback') {
        setErrorMessage(locale === 'th' ? 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google กรุณาลองใหม่อีกครั้ง' : 'Error connecting with Google, please try again');
      } else {
        setErrorMessage(locale === 'th' ? 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' : 'Authentication error occurred');
      }
    }
  }, [locale]);

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleSubmitting(true);
    try {
      await signIn('google', { callbackUrl: '/desk' });
    } catch {
      setIsGoogleSubmitting(false);
      setErrorMessage(locale === 'th' ? 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google กรุณาลองใหม่อีกครั้ง' : 'Failed to connect with Google, please try again');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage(locale === 'th' ? 'กรุณากรอก Gmail หรือชื่อผู้ใช้งาน' : 'Please enter your email or username');
      return;
    }

    if (!password) {
      setErrorMessage(locale === 'th' ? 'กรุณากรอกรหัสผ่าน' : 'Please enter your password');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await loginUserAsync(identifier, password, locale);
      if (res.success && res.user) {
        setSuccessMessage(locale === 'th' ? `ยินดีต้อนรับกลับ, ${res.user.name}! กำลังเข้าสู่ระบบ...` : `Welcome back, ${res.user.name}! Redirecting...`);
        setTimeout(() => {
          router.push('/desk');
        }, 800);
      } else {
        setErrorMessage(res.message || (locale === 'th' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : 'Invalid email or password'));
      }
    } catch {
      setErrorMessage(locale === 'th' ? 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง' : 'Connection error, please try again');
    } finally {
      setIsSubmitting(false);
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
              RETZPOST
            </span>
            <span className="text-[10px] font-mono uppercase text-accent-terracotta ml-1.5 font-bold tracking-wider">
              Dream Press
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          <LanguageToggle variant="compact" />
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-ink-secondary">{t('auth.noAccountYet')}</span>
            <Link
              href="/register"
              className="font-semibold text-brand-indigo hover:text-brand-indigo-hover underline underline-offset-2 transition-colors"
            >
              {t('auth.signUpButton')} →
            </Link>
          </div>
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
              {t('auth.loginTitle')}
            </h1>
            <p className="text-xs text-ink-secondary leading-relaxed">
              {t('auth.loginSubtitle')}
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

          {/* Google Sign-in Option */}
          <div className="space-y-4 mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleSubmitting || isSubmitting}
              className="w-full py-2.5 px-4 bg-paper-canvas hover:bg-paper-subtle text-ink-primary text-xs font-semibold rounded-editorial border border-border-rule hover:border-ink-secondary/40 shadow-2xs flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              <GoogleLogo className="w-4 h-4 shrink-0" size={16} />
              <span className="font-sans">
                {isGoogleSubmitting
                  ? (locale === 'th' ? 'กำลังเชื่อมต่อกับ Google...' : 'Connecting to Google...')
                  : t('auth.signInWithGoogle')}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-rule" />
              </div>
              <span className="relative bg-paper-raised px-3 text-[11px] font-sans font-medium uppercase tracking-wider text-ink-secondary">
                {t('auth.orDivider')}
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* 1. Gmail / Username Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-primary font-mono">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder={locale === 'th' ? "เช่น losstary@gmail.com หรือชื่อผู้ใช้" : "e.g. losstary@gmail.com or username"}
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
                  {t('auth.passwordLabel')}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-mono text-brand-indigo hover:underline font-medium"
                >
                  {t('auth.forgotPasswordLink')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={locale === 'th' ? "กรอกรหัสผ่านของคุณ" : "Enter your password"}
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
                <span>{t('auth.rememberMe')}</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold rounded-editorial shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span>{t('common.loading')}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('auth.signInButton')}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full pt-6 border-t border-border-rule/60 text-center text-[11px] font-mono text-ink-secondary space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium">
          <Link href="/docs" target="_blank" className="hover:text-brand-indigo underline underline-offset-2 transition-colors">
            📖 {locale === 'en' ? 'Docs & Guides' : 'คู่มือการใช้งาน'}
          </Link>
          <span>•</span>
          <Link href="/privacy" target="_blank" className="hover:text-brand-indigo underline underline-offset-2 transition-colors">
            🔒 {locale === 'en' ? 'Privacy Policy' : 'นโยบายความเป็นส่วนตัว'}
          </Link>
          <span>•</span>
          <Link href="/terms" target="_blank" className="hover:text-brand-indigo underline underline-offset-2 transition-colors">
            📜 {locale === 'en' ? 'Terms of Service' : 'ข้อกำหนดการใช้งาน'}
          </Link>
        </div>
        <p>RETZPOST — Dream Press Publishing Desk &copy; {new Date().getFullYear()} RetzPost SaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
