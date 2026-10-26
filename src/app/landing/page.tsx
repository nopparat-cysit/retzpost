'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  PublicHeader, 
  PublicFooter 
} from '@/components/layout/public-nav';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Share2, 
  ShieldCheck, 
  Layers, 
  Film, 
  Camera, 
  FileText, 
  Sliders, 
  Play, 
  Check, 
  Zap, 
  Award, 
  Coins, 
  Ticket, 
  RotateCcw, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Lock,
  Star,
  Users,
  Compass,
  LayoutGrid
} from 'lucide-react';
import { 
  FacebookLogo, 
  InstagramLogo, 
  YouTubeLogo, 
  TikTokLogo, 
  XLogo, 
  Lemon8Logo 
} from '@/components/ui/social-icons';
import { Sticker } from '@/components/ui/sticker';

// =============================================================================
// PRESS COIN SVG ICON COMPONENT
// =============================================================================
interface PressCoinIconProps {
  size?: number;
  className?: string;
}

const PressCoinIcon: React.FC<PressCoinIconProps> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    <defs>
      <linearGradient id="coinGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="35%" stopColor="#EAB308" />
        <stop offset="70%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
      <linearGradient id="coinRim" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <radialGradient id="coinShine" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#CA8A04" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Outer Rim */}
    <circle cx="50" cy="50" r="47" fill="url(#coinRim)" stroke="#78350F" strokeWidth="2" />
    {/* Coin Inner Face */}
    <circle cx="50" cy="50" r="42" fill="url(#coinGold)" />
    <circle cx="50" cy="50" r="42" fill="url(#coinShine)" />
    {/* Beaded Edge Ring */}
    <circle cx="50" cy="50" r="37" fill="none" stroke="#713F12" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.6" />
    {/* Engraved Center Emblem: Press Star & Fountain Quill */}
    <path
      d="M50 24L53.5 35.5L65.5 35.5L56 42.5L59.5 54L50 47L40.5 54L44 42.5L34.5 35.5L46.5 35.5L50 24Z"
      fill="#78350F"
      opacity="0.85"
    />
    <path
      d="M50 46L46 68L50 78L54 68L50 46Z"
      fill="#78350F"
      opacity="0.9"
    />
    <line x1="50" y1="56" x2="50" y2="72" stroke="#FDE047" strokeWidth="1.5" />
    {/* Micro Engraving Text */}
    <text x="50" y="87" textAnchor="middle" fill="#713F12" fontSize="7" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
      RETZPOST
    </text>
  </svg>
);

export default function LandingPage() {
  // ===========================================================================
  // INTERACTIVE DEMO COMPONENT STATE (PURE IN-MEMORY, ZERO BACKEND/STORAGE)
  // ===========================================================================
  const [coins, setCoins] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<{
    platforms: boolean;
    caption: boolean;
    schedule: boolean;
    failure: boolean;
  }>({
    platforms: false,
    caption: false,
    schedule: false,
    failure: false,
  });

  const [recentAwardNotice, setRecentAwardNotice] = useState<{ amount: number; message: string } | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState<boolean>(false);
  const [isClaimSuccess, setIsClaimSuccess] = useState<boolean>(false);

  // Task 1: Selected Platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  // Task 2: Active Tone
  const [activeTone, setActiveTone] = useState<'HOOK' | 'BROADSHEET' | 'LUXURY'>('HOOK');
  // Task 3: Scheduled Slot
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  // Task 4: Failure State
  const [isFailureResolved, setIsFailureResolved] = useState<boolean>(false);

  // Tasks Section Anchor Ref
  const tasksSectionRef = useRef<HTMLDivElement>(null);

  // Helper to award coins without farming
  const awardCoins = (amount: number, message: string, taskKey: keyof typeof completedTasks) => {
    if (completedTasks[taskKey]) return; // Prevent double farming

    setCoins((prev) => Math.min(100, prev + amount));
    setCompletedTasks((prev) => ({ ...prev, [taskKey]: true }));
    setRecentAwardNotice({ amount, message });
    setTimeout(() => setRecentAwardNotice(null), 3500);
  };

  // Check Task 1 Platform Selection
  const togglePlatform = (id: string) => {
    const next = selectedPlatforms.includes(id)
      ? selectedPlatforms.filter((p) => p !== id)
      : [...selectedPlatforms, id];
    setSelectedPlatforms(next);

    if (next.length >= 2 && !completedTasks.platforms) {
      awardCoins(20, 'เลือก 2 แพลตฟอร์มสำเร็จ (+20 Coins)', 'platforms');
    }
  };

  // Check Task 2 Caption Customization
  const handleSelectTone = (tone: 'HOOK' | 'BROADSHEET' | 'LUXURY') => {
    setActiveTone(tone);
    if (!completedTasks.caption) {
      awardCoins(25, 'ปรับแต่งโทนเนื้อหาสำเร็จ (+25 Coins)', 'caption');
    }
  };

  // Check Task 3 Schedule Slot
  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    if (!completedTasks.schedule) {
      awardCoins(25, 'จัดตารางเวลานาทีทองสำเร็จ (+25 Coins)', 'schedule');
    }
  };

  // Check Task 4 Fix Resolution
  const handleResolveFailure = () => {
    setIsFailureResolved(true);
    if (!completedTasks.failure) {
      awardCoins(30, 'ปรับสัดส่วน 9:16 ด้วย AI สำเร็จ (+30 Coins)', 'failure');
    }
  };

  // Reset interactive session
  const handleResetDemo = () => {
    setCoins(0);
    setCompletedTasks({
      platforms: false,
      caption: false,
      schedule: false,
      failure: false,
    });
    setSelectedPlatforms([]);
    setSelectedSlot(null);
    setIsFailureResolved(false);
    setIsClaimSuccess(false);
    setRecentAwardNotice({ amount: 0, message: 'รีเซ็ตการทดลองแล้ว เริ่มสะสมเหรียญใหม่ได้เลย!' });
    setTimeout(() => setRecentAwardNotice(null), 3000);
  };

  const scrollToTasks = () => {
    tasksSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isPassUnlocked = coins >= 100;

  return (
    <div className="min-h-screen bg-paper-canvas text-ink-primary font-sans selection:bg-brand-indigo selection:text-white flex flex-col">
      {/* 1. PUBLIC EDITORIAL HEADER */}
      <PublicHeader />

      {/* FLOATING REWARD HUD (Sticky Pill showing Coin balance) */}
      <div className="fixed bottom-5 right-5 z-40 transition-all duration-300">
        <div className="p-1.5 pl-3 pr-2 bg-paper-raised/95 backdrop-blur-md border-2 border-border-rule rounded-full shadow-lg flex items-center gap-3 ring-1 ring-border-rule/50">
          <div className="flex items-center gap-2">
            <PressCoinIcon size={24} />
            <div className="leading-none">
              <span className="font-mono text-xs font-bold text-ink-primary">
                {coins} <span className="text-[10px] text-ink-secondary">/ 100 Coins</span>
              </span>
              <div className="w-16 h-1 bg-paper-subtle rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 rounded-full"
                  style={{ width: `${coins}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (isPassUnlocked) {
                setIsPassModalOpen(true);
              } else {
                scrollToTasks();
              }
            }}
            className={`py-1.5 px-3 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPassUnlocked
                ? 'bg-accent-terracotta text-white hover:bg-accent-terracotta/90 shadow-xs animate-bounce'
                : 'bg-brand-indigo text-white hover:bg-brand-indigo-hover'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isPassUnlocked ? 'เปิด 7-Day Pass!' : 'รับภารกิจ'}</span>
          </button>
        </div>
      </div>

      {/* RECENT COIN AWARD NOTIFICATION TOAST */}
      {recentAwardNotice && (
        <div className="fixed top-20 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-3 bg-paper-raised border-2 border-amber-400/80 rounded-editorial shadow-xl flex items-center gap-3 text-xs font-mono">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
              +{recentAwardNotice.amount || '✓'}
            </div>
            <div>
              <p className="font-bold text-ink-primary text-xs">{recentAwardNotice.message}</p>
              <p className="text-[10px] text-ink-secondary">สะสมครบ 100 Coins เพื่อปลดล็อก 7-Day Dream Pass</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HERO SECTION — THE DREAM PRESS BROADSHEET                             */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-10 -z-10 opacity-5 pointer-events-none font-serif text-[180px] font-bold select-none text-ink-primary">
          PRESS
        </div>

        {/* Issue Folio Bar */}
        <div className="flex items-center justify-between border-b-2 border-border-rule pb-2 mb-8 text-[11px] font-mono text-ink-secondary">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-widest text-brand-indigo">
              MULTIPOST GAZETTE
            </span>
            <span>•</span>
            <span>SPECIAL CREATOR EDITION</span>
          </div>
          <div className="flex items-center gap-2">
            <span>BANGKOK TIME (UTC+7)</span>
            <span>•</span>
            <span className="px-1.5 py-0.2 rounded bg-semantic-success/10 text-semantic-success font-semibold border border-semantic-success/20">
              DISPATCH READY
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Broadsheet Editorial Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper-subtle border border-border-rule text-xs font-mono text-brand-indigo">
              <Sticker name="press-monogram-seal" size="xs" inline />
              <span className="font-semibold">The Modern Editorial Desk for Omni-Channel Creators</span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl text-ink-primary leading-[1.12] tracking-tight">
              อัปโหลดครั้งเดียว <br />
              <span className="italic font-normal text-brand-indigo">กระจายทุกแพลตฟอร์ม</span> <br />
              โดยไม่เสียคุณภาพ.
            </h1>

            <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl">
              ระบบศูนย์กลางจัดการคอนเทนต์แบบ <span className="font-semibold text-ink-primary">Universal Publishing Desk</span> ที่แปลงสัดส่วน 16:9 แนวนอน สู่ 9:16 แนวตั้งอัตโนมัติ พร้อม Safe-Zone Guide และจัดตารางปล่อยโพสต์ในเวลานาทีทองของกรุงเทพฯ บน Facebook, Instagram, YouTube, TikTok, X และ Lemon8
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={scrollToTasks}
                className="py-3 px-6 rounded-editorial bg-brand-indigo hover:bg-brand-indigo-hover text-white font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>ทดลองทำภารกิจจำลอง (รับ Dream Pass)</span>
              </button>

              <Link
                href="/register"
                className="py-3 px-5 rounded-editorial bg-paper-raised hover:bg-paper-subtle text-ink-primary border border-border-rule font-semibold flex items-center gap-2 shadow-2xs transition-colors text-sm"
              >
                <span>เริ่มใช้งานฟรี 7 วัน</span>
                <ArrowRight className="w-4 h-4 text-ink-secondary" />
              </Link>
            </div>

            {/* Social Proof & Security Stamp Row */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-[11px] font-mono text-ink-secondary border-t border-border-rule/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success" />
                <span>99.98% API Dispatch SLA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-indigo" />
                <span>Token Vault AES-256 GCM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>0% Quality Compression</span>
              </div>
            </div>
          </div>

          {/* Right Hero Ticket Art Piece (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Layered Floating Ticket Card */}
            <div className="w-full max-w-md bg-paper-raised border-2 border-border-rule rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-4 transform hover:-translate-y-1 transition-all duration-300">
              {/* Top Perforated Notch Left & Right */}
              <div className="absolute top-1/2 -left-3.5 w-7 h-7 rounded-full bg-paper-canvas border border-border-rule shadow-inner -translate-y-1/2" />
              <div className="absolute top-1/2 -right-3.5 w-7 h-7 rounded-full bg-paper-canvas border border-border-rule shadow-inner -translate-y-1/2" />

              {/* Pass Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-border-rule/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-brand-indigo text-white flex items-center justify-center font-serif font-bold text-xs shadow-2xs">
                    RP
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm tracking-tight text-ink-primary">
                      MULTIPOST DREAM PASS
                    </h3>
                    <p className="text-[9px] font-mono text-ink-secondary">
                      № DP-2026-HERO-001 • ADMIT CREATOR
                    </p>
                  </div>
                </div>

                <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px] font-mono font-bold">
                  ACTIVE SPEC
                </div>
              </div>

              {/* Visual Simulated Mockup Preview inside Ticket */}
              <div className="aspect-[16/10] bg-paper-subtle rounded-xl border border-border-rule p-3 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between text-[10px] font-mono text-ink-secondary">
                  <span>DISPATCH MATRIX</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Simultaneous Push
                  </span>
                </div>

                {/* Visual Tokens Carousel */}
                <div className="grid grid-cols-4 gap-2 my-auto">
                  <div className="p-2 bg-paper-canvas rounded-lg border border-border-rule text-center space-y-1 shadow-2xs">
                    <InstagramLogo size={18} className="mx-auto" />
                    <span className="text-[9px] font-mono block font-bold">9:16 Reel</span>
                  </div>
                  <div className="p-2 bg-paper-canvas rounded-lg border border-border-rule text-center space-y-1 shadow-2xs">
                    <YouTubeLogo size={18} className="mx-auto" />
                    <span className="text-[9px] font-mono block font-bold">16:9 Feed</span>
                  </div>
                  <div className="p-2 bg-paper-canvas rounded-lg border border-border-rule text-center space-y-1 shadow-2xs">
                    <TikTokLogo size={18} className="mx-auto" />
                    <span className="text-[9px] font-mono block font-bold">TikTok</span>
                  </div>
                  <div className="p-2 bg-paper-canvas rounded-lg border border-border-rule text-center space-y-1 shadow-2xs">
                    <FacebookLogo size={18} className="mx-auto" />
                    <span className="text-[9px] font-mono block font-bold">FB Page</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono text-ink-secondary pt-1 border-t border-border-rule/60">
                  <span>BANGKOK PEAK: 07:30 PM</span>
                  <span className="text-brand-indigo font-bold">AES-256 ENCRYPTED</span>
                </div>
              </div>

              {/* Ticket Perforated Divider */}
              <div className="pt-2 border-t-2 border-dashed border-border-rule/80 flex items-center justify-between text-xs font-mono text-ink-secondary">
                <span className="text-[10px] uppercase font-bold text-ink-primary">
                  ALL CHANNELS SYNCHRONIZED
                </span>
                <span className="text-[10px] font-mono text-accent-terracotta font-bold flex items-center gap-1">
                  <Sticker name="approved-seal" size="xs" inline />
                  OFFICIAL SEAL
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PLATFORM MARQUEE TICKER                                               */}
      {/* ========================================================================= */}
      <section className="bg-paper-raised border-y-2 border-border-rule py-3 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-ink-secondary">
          <div className="flex items-center gap-2">
            <FacebookLogo size={16} />
            <span className="font-semibold text-ink-primary">Facebook Graph API</span>
            <span className="text-[10px] text-ink-muted">(Page Post & Stories)</span>
          </div>
          <span className="text-border-rule">•</span>
          <div className="flex items-center gap-2">
            <InstagramLogo size={16} />
            <span className="font-semibold text-ink-primary">Instagram Reels & Carousel</span>
            <span className="text-[10px] text-ink-muted">(9:16 & 1:1)</span>
          </div>
          <span className="text-border-rule">•</span>
          <div className="flex items-center gap-2">
            <YouTubeLogo size={16} />
            <span className="font-semibold text-ink-primary">YouTube Data API v3</span>
            <span className="text-[10px] text-ink-muted">(16:9 Video & Shorts)</span>
          </div>
          <span className="text-border-rule">•</span>
          <div className="flex items-center gap-2">
            <TikTokLogo size={16} />
            <span className="font-semibold text-ink-primary">TikTok Creator Content</span>
            <span className="text-[10px] text-ink-muted">(Native Direct)</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE MINI TASK SECTION — EARN PRESS COINS & 7-DAY PASS         */}
      {/* ========================================================================= */}
      <section ref={tasksSectionRef} id="mini-tasks" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-border-rule pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-brand-indigo font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Interactive Dream Press Station</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary">
              ทดลองฟังก์ชันสำคัญ พร้อมสะสม <span className="text-amber-600">Press Coins</span>
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary">
              ทำครบ 4 มินิภารกิจ (100 Coins) เพื่อปลดล็อกตั๋ว <b>7-DAY DREAM PASS</b> สไตล์หนังสือพิมพ์วินเทจทันที
            </p>
          </div>

          {/* Reset button & Progress counter */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              className="py-1.5 px-3 rounded-editorial bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-xs font-mono text-ink-secondary flex items-center gap-1.5 transition-colors cursor-pointer"
              title="เริ่มสะสมเหรียญใหม่"
            >
              <RotateCcw className="w-3 h-3" />
              <span>รีเซ็ตการทดลอง</span>
            </button>

            <div className="p-2 px-3.5 bg-paper-raised border-2 border-amber-400/80 rounded-editorial shadow-xs flex items-center gap-2.5">
              <PressCoinIcon size={22} />
              <div className="leading-tight">
                <span className="font-mono text-sm font-bold text-ink-primary">
                  {coins} <span className="text-[10px] text-ink-secondary font-normal">/ 100 Coins</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 INTERACTIVE TASK CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* TASK 1: SELECT 2 PUBLISHING CHANNELS (+20 COINS) */}
          <div className={`p-5 rounded-2xl border-2 transition-all duration-300 space-y-3.5 bg-paper-raised ${
            completedTasks.platforms
              ? 'border-emerald-500/80 ring-2 ring-emerald-500/10 shadow-sm'
              : 'border-border-rule hover:border-brand-indigo/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-serif font-bold text-base text-ink-primary">
                  เลือกช่องทางปลายทาง (อย่างน้อย 2 ช่อง)
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                completedTasks.platforms ? 'bg-emerald-500/15 text-emerald-700' : 'bg-amber-400/15 text-amber-800'
              }`}>
                {completedTasks.platforms ? '✓ สำเร็จ (+20 Coins)' : '+20 Press Coins'}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              คลิกเลือกช่องทางที่ต้องการกระจายโพสต์พร้อมกันใน 1 คลิก:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'IG', name: 'Instagram', icon: InstagramLogo },
                { id: 'FB', name: 'Facebook', icon: FacebookLogo },
                { id: 'YT', name: 'YouTube', icon: YouTubeLogo },
                { id: 'TT', name: 'TikTok', icon: TikTokLogo },
                { id: 'X', name: 'X / Twitter', icon: XLogo },
                { id: 'L8', name: 'Lemon8', icon: Lemon8Logo },
              ].map((p) => {
                const isSelected = selectedPlatforms.includes(p.id);
                const IconComponent = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`p-2.5 rounded-editorial border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-indigo/10 border-brand-indigo text-brand-indigo font-bold shadow-2xs'
                        : 'bg-paper-canvas border-border-rule text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <IconComponent size={14} className="shrink-0" />
                      <span className="text-xs truncate">{p.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-indigo shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] font-mono text-ink-secondary flex items-center justify-between pt-1">
              <span>เลือกแล้ว: <b className="text-ink-primary">{selectedPlatforms.length}</b> ช่องทาง</span>
              <span className="text-[10px] text-brand-indigo">
                {selectedPlatforms.length >= 2 ? '✓ ตรงตามเงื่อนไข' : 'เลือกอีก 1 ช่องทางเพื่อรับเหรียญ'}
              </span>
            </div>
          </div>

          {/* TASK 2: CUSTOMIZE CAPTION TONE (+25 COINS) */}
          <div className={`p-5 rounded-2xl border-2 transition-all duration-300 space-y-3.5 bg-paper-raised ${
            completedTasks.caption
              ? 'border-emerald-500/80 ring-2 ring-emerald-500/10 shadow-sm'
              : 'border-border-rule hover:border-brand-indigo/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-serif font-bold text-base text-ink-primary">
                  ปรับแต่งโทนแคปชั่นด้วย AI Preset
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                completedTasks.caption ? 'bg-emerald-500/15 text-emerald-700' : 'bg-amber-400/15 text-amber-800'
              }`}>
                {completedTasks.caption ? '✓ สำเร็จ (+25 Coins)' : '+25 Press Coins'}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              เลือกสไตล์ภาษาที่ต้องการให้ระบบดัดแปลงแคปชั่นอัตโนมัติ:
            </p>

            {/* Tone Selector Chips */}
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {[
                { id: 'HOOK', label: '⚡ ดึงดูดสายตา (High-Hook)' },
                { id: 'BROADSHEET', label: '📰 พาดหัวข่าว (Gazette)' },
                { id: 'LUXURY', label: '✨ พรีเมียม (Luxury)' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTone(t.id as any)}
                  className={`py-1 px-2.5 rounded-full border transition-all cursor-pointer ${
                    activeTone === t.id
                      ? 'bg-brand-indigo text-white font-bold border-brand-indigo shadow-2xs'
                      : 'bg-paper-canvas text-ink-secondary hover:text-ink-primary border-border-rule'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Live Caption Preview Box */}
            <div className="p-3 bg-paper-canvas rounded-editorial border border-border-rule text-xs font-mono space-y-1.5">
              <span className="text-[9px] uppercase text-ink-secondary block font-semibold">
                ผลลัพธ์แคปชั่นจำลอง (Live Dynamic Preview):
              </span>
              <p className="text-ink-primary leading-relaxed font-sans text-xs">
                {activeTone === 'HOOK' && '⚡ เลิกเสียเวลาแก้คลิปทีละแอป! Dream Press Desk ช่วยปรับ 16:9 แนวนอนสู่ 9:16 แนวตั้งในคลิกเดียว ส่งตรงเข้า IG, TikTok, YouTube ทันที!'}
                {activeTone === 'BROADSHEET' && '📰 ฉบับพิเศษ: MULTIPOST เปิดตัวระบบกระจายโพสต์ครบวงจร เชื่อมต่อโทเคน OAuth พร้อมมาตรการความปลอดภัยระดับ AES-256 GCM'}
                {activeTone === 'LUXURY' && '✨ ประสบการณ์การเผยแพร่ผลงานระดับสตูดิโอชั้นนำ ออกแบบเพื่อแบรนด์และครีเอเตอร์ที่ต้องการความประณีตของสัดส่วนภาพ 100%'}
              </p>
            </div>
          </div>

          {/* TASK 3: BANGKOK GOLDEN PEAK SCHEDULER (+25 COINS) */}
          <div className={`p-5 rounded-2xl border-2 transition-all duration-300 space-y-3.5 bg-paper-raised ${
            completedTasks.schedule
              ? 'border-emerald-500/80 ring-2 ring-emerald-500/10 shadow-sm'
              : 'border-border-rule hover:border-brand-indigo/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="font-serif font-bold text-base text-ink-primary">
                  จัดตารางเวลานาทีทอง (Bangkok Golden Slot)
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                completedTasks.schedule ? 'bg-emerald-500/15 text-emerald-700' : 'bg-amber-400/15 text-amber-800'
              }`}>
                {completedTasks.schedule ? '✓ สำเร็จ (+25 Coins)' : '+25 Press Coins'}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              ระบบวิเคราะห์ช่วงเวลาที่ผู้ใช้งานโซเชียลในกรุงเทพฯ มีอัตราการมีส่วนร่วมสูงสุด:
            </p>

            <div className="space-y-2 text-xs font-mono">
              {[
                { id: 'LUNCH', time: '11:45 น.', label: 'ช่วงพักกลางวัน (Lunch Peak)', boost: '2.4x Reach' },
                { id: 'EVENING', time: '19:30 น.', label: 'ช่วงนาทีทองกลับบ้าน (Prime Reel)', boost: '3.1x Viral' },
                { id: 'NIGHT', time: '21:15 น.', label: 'ช่วงรอบดึก (Night Owl Story)', boost: '1.9x Clicks' },
              ].map((s) => {
                const isSelected = selectedSlot === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSlot(s.id)}
                    className={`w-full p-2.5 rounded-editorial border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-amber-900 font-bold shadow-2xs'
                        : 'bg-paper-canvas border-border-rule text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{s.time}</span>
                      <span className="text-ink-secondary text-[11px]">— {s.label}</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                      {s.boost}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TASK 4: RESOLVE ASPECT RATIO MISMATCH (+30 COINS) */}
          <div className={`p-5 rounded-2xl border-2 transition-all duration-300 space-y-3.5 bg-paper-raised ${
            completedTasks.failure
              ? 'border-emerald-500/80 ring-2 ring-emerald-500/10 shadow-sm'
              : 'border-border-rule hover:border-brand-indigo/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="font-serif font-bold text-base text-ink-primary">
                  แก้ไขข้อผิดพลาดสัดส่วนภาพ (Smart Ratio Fix)
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                completedTasks.failure ? 'bg-emerald-500/15 text-emerald-700' : 'bg-amber-400/15 text-amber-800'
              }`}>
                {completedTasks.failure ? '✓ สำเร็จ (+30 Coins)' : '+30 Press Coins'}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              จำลองสถานการณ์ที่ภาพเป็นสี่เหลี่ยม 1:1 แต่ช่องทางต้องการสตอรี่แนวตั้ง 9:16:
            </p>

            {!isFailureResolved ? (
              <div className="p-3 bg-accent-terracotta/10 border border-accent-terracotta/40 rounded-editorial space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-accent-terracotta font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Meta API Error 400: Aspect Ratio Mismatch</span>
                </div>
                <p className="text-[11px] text-ink-secondary">
                  Instagram Story ต้องการสัดส่วน 9:16 แนวตั้ง แต่ไฟล์ต้นฉบับเป็น 1:1
                </p>
                <button
                  onClick={handleResolveFailure}
                  className="w-full py-2 px-3 rounded bg-accent-terracotta text-white font-bold hover:bg-accent-terracotta/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>⚡ 1-Click ปรับสัดส่วน 9:16 ด้วย AI Safe-Zone</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-editorial space-y-1.5 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>แก้ไขสำเร็จ: สัดส่วน 1080x1920 (9:16) พร้อมเผยแพร่!</span>
                </div>
                <p className="text-[11px] text-emerald-800/80">
                  ระบบเว้นขอบบน 15% และขอบล่าง 25% เพื่อไม่ให้ข้อความโดนปุ่ม Like และชื่อเพจบดบัง
                </p>
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS BANNER & DREAM PASS UNLOCK CTA */}
        <div className="p-6 rounded-2xl border-2 border-border-rule bg-paper-raised shadow-md flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-400/20 text-amber-600 flex items-center justify-center shrink-0 border border-amber-400/40 shadow-inner">
              <PressCoinIcon size={34} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-ink-primary">
                  ความคืบหน้าการทดลอง: {coins} / 100 Coins
                </h3>
                {isPassUnlocked && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-500/30 animate-pulse">
                    READY TO UNLOCK
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                {isPassUnlocked
                  ? 'ยินดีด้วย! คุณสะสมครบ 100 Press Coins แล้ว สามารถกดเปิดดู 7-DAY DREAM PASS ได้ทันที'
                  : 'ทำภารกิจด้านบนให้ครบทั้ง 4 ข้อ เพื่อปลดล็อกตั๋วเอกสิทธิ์ทดลองใช้ระบบ'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPassModalOpen(true)}
              disabled={!isPassUnlocked}
              className={`py-3 px-6 rounded-editorial text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isPassUnlocked
                  ? 'bg-accent-terracotta text-white hover:bg-accent-terracotta/90 shadow-md animate-bounce scale-102'
                  : 'bg-paper-subtle text-ink-secondary/40 border border-border-rule cursor-not-allowed'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>{isPassUnlocked ? 'เปิดรับ 7-DAY DREAM PASS →' : 'ล็อกอยู่ (ต้องครบ 100 Coins)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. 7-DAY DREAM PASS MODAL REWARD EXPERIENCE                               */}
      {/* ========================================================================= */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-paper-canvas text-ink-primary border-2 border-border-rule rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 overflow-hidden">
            {/* Scalloped Notches on Left and Right */}
            <div className="absolute top-1/2 -left-4 w-8 h-8 rounded-full bg-black/60 border border-border-rule -translate-y-1/2" />
            <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-black/60 border border-border-rule -translate-y-1/2" />

            {/* Close Button */}
            <button
              onClick={() => setIsPassModalOpen(false)}
              className="absolute top-4 right-4 text-ink-secondary hover:text-ink-primary font-mono text-sm cursor-pointer"
            >
              ✕
            </button>

            {/* Vintage Ticket Header */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-dashed border-border-rule/80">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 text-amber-800 text-[10px] font-mono font-bold uppercase">
                <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
                <span>OFFICIAL ACTIVATION PASS • DREAM PRESS DESK</span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary tracking-tight">
                7-DAY DREAM PASS
              </h2>
              <p className="text-[11px] font-mono text-ink-secondary">
                SERIAL: № DP-2026-7DAY-0089 • ADMIT ONE CREATOR
              </p>
            </div>

            {/* Ticket Privileges Body */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-paper-raised rounded-xl border border-border-rule space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-brand-indigo block">
                  สิทธิ์การใช้งานในตั๋วใบนี้ (Authorized Features):
                </span>
                <ul className="space-y-1.5 text-xs text-ink-primary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success shrink-0" />
                    <span>เชื่อมต่อได้ไม่จำกัด: Facebook, Instagram, YouTube, TikTok, X, Lemon8</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success shrink-0" />
                    <span>ระบบตั้งเวลานาทีทอง Bangkok Golden Peak Slots อัตโนมัติ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success shrink-0" />
                    <span>AI Safe-Zone Guide ป้องกันข้อความโดนปุ่ม Like และแคปชั่นบัง</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success shrink-0" />
                    <span>เก็บบัญชีใน Token Vault มาตรฐานความปลอดภัยระดับ AES-256 GCM</span>
                  </li>
                </ul>
              </div>

              {!isClaimSuccess ? (
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setIsClaimSuccess(true)}
                    className="w-full py-3 px-4 rounded-editorial bg-accent-terracotta hover:bg-accent-terracotta/90 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sticker name="approved-seal" size="xs" inline />
                    <span>ประทับตราเปิดใช้งาน (Redeem Pass)</span>
                  </button>
                  <p className="text-[10px] text-center text-ink-secondary">
                    *การกดประทับตราในที่นี้เป็นการจำลองประสบการณ์หน้าเว็บเพื่อความสนุก ไม่มีการผูกมัดหรือตัดบัตรใดๆ
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/40 text-center space-y-3 animate-in fade-in duration-300">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-700 mx-auto flex items-center justify-center font-bold text-lg">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-ink-primary">
                      Your Dream Pass is ready. You&apos;ve completed the publishing experience!
                    </h4>
                    <p className="text-xs text-ink-secondary mt-1">
                      คุณได้เรียนรู้กระบวนการทำงานครบทั้ง 4 ขั้นตอนแล้ว หากพร้อมเริ่มใช้งานกับช่องทางจริง สามารถสมัครสมาชิกเพื่อทดลองใช้จริงได้ฟรี
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                    <Link
                      href="/register"
                      className="py-2.5 px-4 rounded-editorial bg-brand-indigo hover:bg-brand-indigo-hover text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>สมัครทดลองใช้จริง 7 วัน (ไม่ต้องใช้บัตรเครดิต) →</span>
                    </Link>
                    <Link
                      href="/docs"
                      className="py-2.5 px-3 rounded-editorial bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-xs font-semibold text-ink-primary flex items-center justify-center"
                    >
                      <span>เปิดอ่านคู่มือ (Docs)</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. FOUR CORE PILLARS OF MULTIPOST                                         */}
      {/* ========================================================================= */}
      <section className="py-16 bg-paper-raised border-y-2 border-border-rule px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-brand-indigo uppercase tracking-wider">
              ENGINE ARCHITECTURE
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl text-ink-primary">
              เสาหลัก 4 ประการของระบบ Dream Press
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary">
              ออกแบบขึ้นเพื่อแก้ไขทุกจุดบกพร่องของการสลับแอปโพสต์โซเชียลแบบดั้งเดิม
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-5 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-ink-primary">
                Universal Studio Composer
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                สลับโหมดมีเดียระหว่าง Photos, Shorts 9:16, Full Video 16:9 และข้อความล้วนได้อย่างราบรื่น พร้อมพรีวิวหน้าจอจริงก่อนปล่อย
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-ink-primary">
                Bangkok Golden Peak Scheduler
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                ตารางเวลาอัตโนมัติอ้างอิงช่วงเวลาผู้รับชมสูงที่สุดในไทย (11:45, 19:30, 21:15) ดันยอด Reach โดยไม่ต้องเดาเวลาเอง
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-ink-primary">
                Token Vault AES-256 GCM
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                เก็บ Access Token ของเพจและช่องทางอย่างปลอดภัยสูงสุด เข้ารหัสตามมาตรฐานสถาบันการเงิน ไม่มีการเก็บรหัสผ่านส่วนตัว
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-accent-terracotta/10 text-accent-terracotta flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-ink-primary">
                Team Roles & KPI Scorecard
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                แบ่งสิทธิ์ 5 ระดับ (Owner, Manager, Editor, Creator, Viewer) พร้อมระบบตรวจอนุมัติงาน และออกใบประเมินผลงานครีเอเตอร์
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PLATFORM COMPATIBILITY MATRIX TABLE                                    */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-mono font-bold text-brand-indigo uppercase">
            SPECIFICATION MATRIX
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary">
            ตารางข้อเท็จจริงความเข้ากันได้ของ API แต่ละช่องทาง
          </h2>
          <p className="text-xs text-ink-secondary">
            ความโปร่งใสคือหัวใจของ RetzPost: เราแจงชัดเจนว่าแต่ละแพลตฟอร์มรองรับอะไรได้บ้าง
          </p>
        </div>

        <div className="overflow-x-auto border-2 border-border-rule rounded-2xl bg-paper-raised shadow-xs">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-paper-subtle border-b-2 border-border-rule text-[11px] text-ink-secondary">
              <tr>
                <th className="p-3.5 font-bold">แพลตฟอร์ม</th>
                <th className="p-3.5 font-bold">สัดส่วนที่รองรับ</th>
                <th className="p-3.5 font-bold">รูปภาพ Carousel</th>
                <th className="p-3.5 font-bold">การลบโพสต์อัตโนมัติ</th>
                <th className="p-3.5 font-bold">การตั้งเวลาล่วงหน้า</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-rule/80">
              <tr className="hover:bg-paper-canvas/60">
                <td className="p-3.5 font-bold flex items-center gap-2 text-ink-primary">
                  <FacebookLogo size={14} /> Facebook
                </td>
                <td className="p-3.5">1:1, 4:5, 16:9, 9:16</td>
                <td className="p-3.5 text-semantic-success">✓ รองรับสูงสุด 10 รูป</td>
                <td className="p-3.5 text-semantic-success">✓ ลบได้ทันทีผ่าน API</td>
                <td className="p-3.5 text-semantic-success">✓ แม่นยำระดับวินาที</td>
              </tr>
              <tr className="hover:bg-paper-canvas/60">
                <td className="p-3.5 font-bold flex items-center gap-2 text-ink-primary">
                  <InstagramLogo size={14} /> Instagram
                </td>
                <td className="p-3.5">9:16 (Reels/Story), 1:1, 4:5</td>
                <td className="p-3.5 text-semantic-success">✓ รองรับสูงสุด 10 รูป</td>
                <td className="p-3.5 text-accent-terracotta">⚠ ลบผ่าน Deep Link แอป</td>
                <td className="p-3.5 text-semantic-success">✓ แม่นยำระดับวินาที</td>
              </tr>
              <tr className="hover:bg-paper-canvas/60">
                <td className="p-3.5 font-bold flex items-center gap-2 text-ink-primary">
                  <YouTubeLogo size={14} /> YouTube
                </td>
                <td className="p-3.5">16:9 (Full Video), 9:16 (Shorts)</td>
                <td className="p-3.5 text-ink-muted">— ไม่รองรับภาพเดี่ยว</td>
                <td className="p-3.5 text-semantic-success">✓ ลบได้ทันทีผ่าน API</td>
                <td className="p-3.5 text-semantic-success">✓ แม่นยำระดับวินาที</td>
              </tr>
              <tr className="hover:bg-paper-canvas/60">
                <td className="p-3.5 font-bold flex items-center gap-2 text-ink-primary">
                  <TikTokLogo size={14} /> TikTok
                </td>
                <td className="p-3.5">9:16 แนวตั้ง (Video & Photo Slide)</td>
                <td className="p-3.5 text-semantic-success">✓ Photo Mode Slide</td>
                <td className="p-3.5 text-accent-terracotta">⚠ ลบผ่าน Deep Link แอป</td>
                <td className="p-3.5 text-semantic-success">✓ แม่นยำระดับวินาที</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. EDITORIAL TESTIMONIALS (VOICES FROM THE DESK)                         */}
      {/* ========================================================================= */}
      <section className="py-16 bg-paper-raised border-y-2 border-border-rule px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-mono font-bold text-brand-indigo uppercase">
              CREATOR REVIEWS
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary">
              เสียงตอบรับจากทีมครีเอเตอร์และสตูดิโอ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
              <p className="font-serif italic text-xs sm:text-sm text-ink-primary leading-relaxed">
                &quot;สิ่งที่ช่วยประหยัดเวลามากที่สุดคือระบบแปลงสัดส่วน 9:16 ที่มี Safe-Zone Guide ในตัว โพสต์แล้วไม่ต้องกลัวปุ่มของ TikTok หรือ IG บังข้อความอีกต่อไป&quot;
              </p>
              <div className="pt-2 border-t border-border-rule/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-xs">
                  KD
                </div>
                <div>
                  <h4 className="font-bold text-xs text-ink-primary">Krit D.</h4>
                  <p className="text-[10px] text-ink-secondary font-mono">Senior Content Creator • Digital Studio</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
              <p className="font-serif italic text-xs sm:text-sm text-ink-primary leading-relaxed">
                &quot;การตั้งเวลาโพสต์ตาม Bangkok Golden Hour ทำให้ยอด Reach พุ่งขึ้นชัดเจน โดยเฉพาะคลิปวิดีโอ 16:9 บน YouTube ที่จัดคิวลงพร้อม Shorts 9:16 ได้ในคำสั่งเดียว&quot;
              </p>
              <div className="pt-2 border-t border-border-rule/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent-terracotta text-white flex items-center justify-center font-bold text-xs">
                  PT
                </div>
                <div>
                  <h4 className="font-bold text-xs text-ink-primary">Ploy T.</h4>
                  <p className="text-[10px] text-ink-secondary font-mono">Media Publishing Manager</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
              <p className="font-serif italic text-xs sm:text-sm text-ink-primary leading-relaxed">
                &quot;ระบบ Token Vault ที่ปลอดภัยทำให้เราเชื่อมเพจลูกค้าได้สบายใจ พร้อมระบบแบ่งสิทธิ์ไม่ให้เด็กฝึกงานเผลอกดโพสต์ตรงก่อนได้รับการอนุมัติ&quot;
              </p>
              <div className="pt-2 border-t border-border-rule/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  AN
                </div>
                <div>
                  <h4 className="font-bold text-xs text-ink-primary">Anan N.</h4>
                  <p className="text-[10px] text-ink-secondary font-mono">Agency Operations Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL GRAND ACTIVATION PASS CTA BANNER                                */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-paper-raised border-2 border-border-rule rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden space-y-6 text-center">
          {/* Perforated Notches on Ticket Sides */}
          <div className="absolute top-1/2 -left-4 w-8 h-8 rounded-full bg-paper-canvas border border-border-rule -translate-y-1/2" />
          <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-paper-canvas border border-border-rule -translate-y-1/2" />

          <div className="max-w-xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono text-xs font-bold uppercase tracking-wider">
              START YOUR 7-DAY FREE TRIAL
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-ink-primary leading-tight">
              พร้อมยกระดับสตูดิโอของคุณสู่อนาคตแล้วหรือยัง?
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              เปิดใช้งาน Multi-Placement Engine ได้ใน 60 วินาที ไม่ต้องกรอกบัตรเครดิต สามารถยกเลิกการเชื่อมต่อบัญชีได้ตลอดเวลา 100%
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-mono">
            <Link
              href="/register"
              className="py-3.5 px-8 rounded-editorial bg-brand-indigo hover:bg-brand-indigo-hover text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <span>เริ่มต้นใช้งานฟรี 7 วันทันที (Start Free Trial)</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
            <Link
              href="/docs"
              className="py-3.5 px-6 rounded-editorial bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-primary font-bold text-sm shadow-2xs transition-colors flex items-center gap-2"
            >
              <span>อ่านคู่มือระบบฉบับเต็ม</span>
            </Link>
          </div>

          <p className="text-[10px] font-mono text-ink-secondary">
            สอดคล้องตามมาตรฐาน PDPA / Meta Platform Policy / YouTube API Terms of Service
          </p>
        </div>
      </section>

      {/* 10. PUBLIC EDITORIAL FOOTER */}
      <PublicFooter />
    </div>
  );
}