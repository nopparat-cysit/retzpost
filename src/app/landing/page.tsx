'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Unlock,
  Star,
  Users,
  Compass,
  LayoutGrid,
  Calendar as CalendarIcon,
  BarChart3,
  RefreshCw,
  FolderOpen,
  Send,
  Eye,
  SlidersHorizontal,
  Smartphone,
  Laptop,
  CheckCheck
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
// PRESS COIN SVG ICON COMPONENT (Muted Metallic Ochre & Editorial Details)
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
  // INTERACTIVE DEMO STATE (STRICTLY IN-MEMORY REACT STATE — ZERO BACKEND/STORAGE)
  // ===========================================================================
  const [coins, setCoins] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<{
    destinations: boolean;
    caption: boolean;
    schedule: boolean;
    rescue: boolean;
  }>({
    destinations: false,
    caption: false,
    schedule: false,
    rescue: false,
  });

  const [recentNotice, setRecentNotice] = useState<{ amount: number; message: string } | null>(null);
  const [isPassRedeemed, setIsPassRedeemed] = useState<boolean>(false);

  // Task 1: Selected Platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['YT', 'IG']);
  // Task 2: Caption Tone & Text
  const [activeTone, setActiveTone] = useState<'HOOK' | 'BROADSHEET' | 'LUXURY'>('HOOK');
  const [customCaption, setCustomCaption] = useState<string>(
    '⚡ Stop exporting 5 versions! Dream Press transforms 16:9 master footage into 9:16 vertical stories with zero quality loss.'
  );
  // Task 3: Scheduled Slot
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  // Task 4: Failure & Rescue State
  const [isFailureResolved, setIsFailureResolved] = useState<boolean>(false);

  // Section 03: Workflow interactive step
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  // Section 06: Workspace Tour active tab
  const [activeTourTab, setActiveTourTab] = useState<
    'dashboard' | 'library' | 'composer' | 'queue' | 'calendar' | 'analytics'
  >('dashboard');

  // Section 09: Dispatch Board Edge-Case Retry simulation
  const [xRetryState, setXRetryState] = useState<'FAILED' | 'RETRYING' | 'RECOVERED'>('FAILED');

  // Hero Preview Mode
  const [heroRatio, setHeroRatio] = useState<'16:9' | '9:16'>('16:9');

  // Refs for smooth navigation
  const pressStudioRef = useRef<HTMLDivElement>(null);
  const workspaceTourRef = useRef<HTMLDivElement>(null);
  const dreamPassRef = useRef<HTMLDivElement>(null);

  // Helper to award coins strictly once without duplicate farming
  const awardCoins = (amount: number, message: string, taskKey: keyof typeof completedTasks) => {
    if (completedTasks[taskKey]) return; // Strictly prevent duplicate coin farming

    setCoins((prev) => Math.min(100, prev + amount));
    setCompletedTasks((prev) => ({ ...prev, [taskKey]: true }));
    setRecentNotice({ amount, message });
    setTimeout(() => setRecentNotice(null), 3800);
  };

  // Task 1: Toggle Platform
  const togglePlatform = (id: string) => {
    const next = selectedPlatforms.includes(id)
      ? selectedPlatforms.filter((p) => p !== id)
      : [...selectedPlatforms, id];
    setSelectedPlatforms(next);

    if (next.length >= 2 && !completedTasks.destinations) {
      awardCoins(20, 'Selected 2 destination platforms (+20 Coins)', 'destinations');
    }
  };

  // Task 2: Tone Selection & Caption Customization
  const handleSelectTone = (tone: 'HOOK' | 'BROADSHEET' | 'LUXURY') => {
    setActiveTone(tone);
    if (tone === 'HOOK') {
      setCustomCaption('⚡ Stop exporting 5 versions! Dream Press transforms 16:9 master footage into 9:16 vertical stories with zero quality loss.');
    } else if (tone === 'BROADSHEET') {
      setCustomCaption('📰 SPECIAL EDITION: MULTIPOST introduces simultaneous multi-network dispatch with bank-grade AES-256 GCM token security.');
    } else {
      setCustomCaption('✨ Studio-grade publishing excellence designed for creators and teams who demand 100% visual fidelity across every feed.');
    }

    if (!completedTasks.caption) {
      awardCoins(25, 'Tailored platform edition caption (+25 Coins)', 'caption');
    }
  };

  // Task 3: Schedule Slot Selection
  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    if (!completedTasks.schedule) {
      awardCoins(25, 'Confirmed Bangkok Golden Peak slot (+25 Coins)', 'schedule');
    }
  };

  // Task 4: Resolve Simulated Aspect Ratio Failure
  const handleResolveFailure = () => {
    setIsFailureResolved(true);
    if (!completedTasks.rescue) {
      awardCoins(30, 'Rescued aspect ratio error with AI Safe-Zone (+30 Coins)', 'rescue');
    }
  };

  // Reset interactive session back to 0
  const handleResetDemo = () => {
    setCoins(0);
    setCompletedTasks({
      destinations: false,
      caption: false,
      schedule: false,
      rescue: false,
    });
    setSelectedPlatforms(['YT']);
    setSelectedSlot(null);
    setIsFailureResolved(false);
    setIsPassRedeemed(false);
    setRecentNotice({ amount: 0, message: 'Interactive playground reset. Gather 100 Coins to forge your Dream Pass!' });
    setTimeout(() => setRecentNotice(null), 3500);
  };

  // Section 09: Isolated Partial Retry
  const handleRetryX = () => {
    setXRetryState('RETRYING');
    setTimeout(() => {
      setXRetryState('RECOVERED');
    }, 1200);
  };

  const isPassUnlocked = coins >= 100;

  return (
    <div className="min-h-screen bg-paper-canvas text-ink-primary font-sans selection:bg-brand-indigo selection:text-white flex flex-col antialiased">
      {/* 1. PUBLIC EDITORIAL HEADER */}
      <PublicHeader />

      {/* FLOATING REWARD HUD (Sticky Pill showing live Press Coin balance) */}
      <div className="fixed bottom-5 right-5 z-40 transition-all duration-300">
        <div className="p-1.5 pl-3.5 pr-2 bg-paper-raised/95 backdrop-blur-md border-2 border-border-rule rounded-full shadow-lg flex items-center gap-3 ring-1 ring-border-rule/40">
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
                dreamPassRef.current?.scrollIntoView({ behavior: 'smooth' });
              } else {
                pressStudioRef.current?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`py-1.5 px-3 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPassUnlocked
                ? 'bg-accent-terracotta text-white hover:bg-accent-terracotta/90 shadow-xs animate-bounce'
                : 'bg-brand-indigo text-white hover:bg-brand-indigo-hover'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isPassUnlocked ? 'View Dream Pass!' : 'Earn Coins'}</span>
          </button>
        </div>
      </div>

      {/* RECENT COIN AWARD NOTIFICATION TOAST */}
      {recentNotice && (
        <div className="fixed top-20 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-3 bg-paper-raised border-2 border-amber-400/90 rounded-editorial shadow-xl flex items-center gap-3 text-xs font-mono">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
              +{recentNotice.amount || '✓'}
            </div>
            <div>
              <p className="font-bold text-ink-primary text-xs">{recentNotice.message}</p>
              <p className="text-[10px] text-ink-secondary">Progress: {coins}/100 Press Coins earned</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 01 — HERO: THE FRONT PAGE                                        */}
      {/* ========================================================================= */}
      <section id="hero" className="relative pt-10 pb-20 md:pt-14 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-10 -z-10 opacity-5 pointer-events-none font-serif text-[180px] font-bold select-none text-ink-primary">
          PRESS
        </div>

        {/* Issue Folio Bar */}
        <div className="flex items-center justify-between border-b-2 border-border-rule pb-2.5 mb-8 text-[11px] font-mono text-ink-secondary">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-widest text-brand-indigo">
              MULTIPOST GAZETTE
            </span>
            <span>•</span>
            <span>ISSUE № 2026-DP</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">SPECIAL CREATOR EDITION</span>
          </div>
          <div className="flex items-center gap-2">
            <span>BANGKOK TIME (UTC+7)</span>
            <span>•</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 font-semibold border border-emerald-500/20">
              DISPATCH READY
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Broadsheet Editorial Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper-subtle border border-border-rule text-xs font-mono text-brand-indigo">
              <Sticker name="press-monogram-seal" size="xs" inline />
              <span className="font-semibold tracking-wider uppercase">THE CREATOR&apos;S PUBLISHING DESK</span>
            </div>

            <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-ink-primary leading-[1.08] tracking-tight">
              One story. <br />
              <span className="italic font-normal text-brand-indigo">Everywhere.</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl">
              Create once, customize for every channel, and keep your publishing workflow beautifully organized. Upload master media, tailor platform-specific safe zones and captions, and dispatch with millisecond precision across YouTube, TikTok, Instagram, Facebook, X, and Lemon8.
            </p>

            {/* Dual CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => pressStudioRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="py-3.5 px-6 rounded-editorial bg-brand-indigo hover:bg-brand-indigo-hover text-white font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Try the Interactive Demo</span>
              </button>

              <button
                type="button"
                onClick={() => workspaceTourRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="py-3.5 px-5 rounded-editorial bg-paper-raised hover:bg-paper-subtle text-ink-primary border border-border-rule font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer text-sm"
              >
                <span>Explore MULTIPOST</span>
                <ChevronRight className="w-4 h-4 text-ink-secondary" />
              </button>
            </div>

            {/* Social Proof & Security Stamp Row */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-[11px] font-mono text-ink-secondary border-t border-border-rule/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>99.98% Dispatch Reliability</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-indigo" />
                <span>AES-256 GCM Token Vault</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Native Aspect Ratio Preservation</span>
              </div>
            </div>
          </div>

          {/* Right Hero Publishing Desk Composition (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Layered Digital Newspaper Composition Card */}
            <div className="w-full max-w-md bg-paper-raised border-2 border-border-rule rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-4 transform hover:-translate-y-1 transition-all duration-300">
              {/* Scalloped Notches on Left and Right */}
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
                      MULTIPOST DISPATCH PASS
                    </h3>
                    <p className="text-[9px] font-mono text-ink-secondary">
                      № DP-2026-HERO-001 • ADMIT CREATOR
                    </p>
                  </div>
                </div>

                <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px] font-mono font-bold">
                  ACTIVE TRANSMISSION
                </div>
              </div>

              {/* Interactive Ratio Switcher in Hero */}
              <div className="flex items-center justify-between text-[11px] font-mono bg-paper-canvas p-1 rounded-lg border border-border-rule">
                <span className="text-[10px] text-ink-secondary px-2">Master Preview Format:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setHeroRatio('16:9')}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      heroRatio === '16:9' ? 'bg-brand-indigo text-white' : 'text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    16:9 Widescreen
                  </button>
                  <button
                    onClick={() => setHeroRatio('9:16')}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      heroRatio === '9:16' ? 'bg-brand-indigo text-white' : 'text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    9:16 Vertical Story
                  </button>
                </div>
              </div>

              {/* Media Preview Viewport */}
              <div className="relative bg-paper-subtle rounded-xl border border-border-rule p-3 flex flex-col justify-between overflow-hidden min-h-[170px]">
                <div className="flex items-center justify-between text-[10px] font-mono text-ink-secondary">
                  <span>CANVAS PROBE: 4K 60FPS</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Multi-Placement Engine
                  </span>
                </div>

                {/* Simulated Visual Content with Aspect Guidelines */}
                <div className="my-2 p-3 bg-paper-canvas rounded-lg border border-border-rule/80 relative text-center space-y-1">
                  <div className="absolute inset-0 border border-dashed border-brand-indigo/30 rounded-lg pointer-events-none" />
                  <span className="text-[10px] font-mono uppercase text-brand-indigo font-bold block">
                    {heroRatio === '16:9' ? 'YouTube & Facebook Native (1920 × 1080)' : 'Reels, Shorts & TikTok Safe-Zone (1080 × 1920)'}
                  </span>
                  <p className="text-xs font-serif italic text-ink-primary">
                    &quot;Behind the Creative Desk: 24h Studio Dispatch&quot;
                  </p>
                  <div className="text-[9px] font-mono text-ink-secondary">
                    Safe-Margins: Top 15% (Status) • Bottom 25% (Captions & Actions)
                  </div>
                </div>

                {/* Target Platform Status Chips */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <div className="p-1.5 bg-paper-canvas rounded border border-border-rule text-center shadow-2xs">
                    <YouTubeLogo size={14} className="mx-auto" />
                    <span className="text-[8px] font-mono block font-bold text-ink-primary mt-0.5">Ready</span>
                  </div>
                  <div className="p-1.5 bg-paper-canvas rounded border border-border-rule text-center shadow-2xs">
                    <InstagramLogo size={14} className="mx-auto" />
                    <span className="text-[8px] font-mono block font-bold text-ink-primary mt-0.5">Safe-Zone</span>
                  </div>
                  <div className="p-1.5 bg-paper-canvas rounded border border-border-rule text-center shadow-2xs">
                    <TikTokLogo size={14} className="mx-auto" />
                    <span className="text-[8px] font-mono block font-bold text-ink-primary mt-0.5">Direct HD</span>
                  </div>
                  <div className="p-1.5 bg-paper-canvas rounded border border-border-rule text-center shadow-2xs">
                    <FacebookLogo size={14} className="mx-auto" />
                    <span className="text-[8px] font-mono block font-bold text-ink-primary mt-0.5">Page Feed</span>
                  </div>
                </div>
              </div>

              {/* Ticket Footer Perforation */}
              <div className="pt-2 border-t-2 border-dashed border-border-rule/80 flex items-center justify-between text-xs font-mono text-ink-secondary">
                <span className="text-[10px] uppercase font-bold text-ink-primary">
                  BANGKOK PEAK: 07:30 PM
                </span>
                <span className="text-[10px] font-mono text-accent-terracotta font-bold flex items-center gap-1">
                  <Sticker name="approved-seal" size="xs" inline />
                  OFFICIAL DISPATCH
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM MARQUEE TICKER */}
      <section className="bg-paper-raised border-y-2 border-border-rule py-3 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-ink-secondary">
          <div className="flex items-center gap-2">
            <YouTubeLogo size={16} />
            <span className="font-semibold text-ink-primary">YouTube Data API v3</span>
            <span className="text-[10px] text-ink-muted">(16:9 Video & Shorts)</span>
          </div>
          <span className="text-border-rule">•</span>
          <div className="flex items-center gap-2">
            <InstagramLogo size={16} />
            <span className="font-semibold text-ink-primary">Instagram Reels & Carousel</span>
            <span className="text-[10px] text-ink-muted">(9:16 & 1:1)</span>
          </div>
          <span className="text-border-rule">•</span>
          <div className="flex items-center gap-2">
            <TikTokLogo size={16} />
            <span className="font-semibold text-ink-primary">TikTok Creator Content</span>
            <span className="text-[10px] text-ink-muted">(Native Direct)</span>
          </div>
          <span className="text-border-rule">•</span>
          <div className="flex items-center gap-2">
            <FacebookLogo size={16} />
            <span className="font-semibold text-ink-primary">Facebook Graph API</span>
            <span className="text-[10px] text-ink-muted">(Pages & Reels)</span>
          </div>
          <span className="text-border-rule hidden md:inline">•</span>
          <div className="hidden md:flex items-center gap-2">
            <XLogo size={16} />
            <span className="font-semibold text-ink-primary">X API v2</span>
            <span className="text-[10px] text-ink-muted">(Thread & Media)</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 02 — THE PUBLISHING PROBLEM (BEFORE & AFTER COMPARISON)           */}
      {/* ========================================================================= */}
      <section id="the-problem" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-accent-terracotta/10 text-accent-terracotta text-xs font-mono font-bold uppercase tracking-wider">
            <span>02 / THE PUBLISHING PROBLEM</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-ink-primary">
            The Cost of Fragmented Publishing
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
            Content creators and marketing teams lose 15+ hours each week wrestling with disconnected platform uploaders, inconsistent aspect ratios, and manual repetitive metadata entry.
          </p>
        </div>

        {/* Editorial Before-and-After Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-4">
          {/* Left Column: The Old Fragmented Way */}
          <div className="p-6 sm:p-8 rounded-3xl border-2 border-accent-terracotta/30 bg-accent-terracotta/5 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-accent-terracotta/20">
              <span className="px-2.5 py-1 rounded bg-accent-terracotta/15 text-accent-terracotta font-mono text-xs font-bold uppercase">
                THE OLD WAY
              </span>
              <span className="font-mono text-xs text-accent-terracotta font-bold">
                ⚠️ Highly Inefficient
              </span>
            </div>

            <h3 className="font-serif font-bold text-2xl text-ink-primary">
              &quot;One post. Too many repetitive steps.&quot;
            </h3>

            <ul className="space-y-4 font-sans text-sm text-ink-secondary">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-terracotta/20 text-accent-terracotta font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</span>
                <div>
                  <b className="text-ink-primary block font-mono text-xs uppercase">Manual Aspect Ratio Re-Encoding</b>
                  Exporting 16:9 widescreen, 1:1 square, and 9:16 vertical separately, cluttering local storage with redundant renders.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-terracotta/20 text-accent-terracotta font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</span>
                <div>
                  <b className="text-ink-primary block font-mono text-xs uppercase">Repetitive Copy-Pasting</b>
                  Jumping across 5 to 7 open browser tabs, manually copying captions, hashtags, links, and thumbnails over and over.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-terracotta/20 text-accent-terracotta font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</span>
                <div>
                  <b className="text-ink-primary block font-mono text-xs uppercase">Unseen Safe-Zone Violations</b>
                  Important subtitles and graphics covered by TikTok comment buttons, Instagram Like hearts, or YouTube Shorts audio pills.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-terracotta/20 text-accent-terracotta font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</span>
                <div>
                  <b className="text-ink-primary block font-mono text-xs uppercase">Silent Publishing Failures</b>
                  One channel fails silently due to an expired OAuth token while the team assumes the entire campaign went live.
                </div>
              </li>
            </ul>
          </div>

          {/* Right Column: The Dream Press Way */}
          <div className="p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 bg-emerald-500/5 space-y-6 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
              <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-800 font-mono text-xs font-bold uppercase">
                THE DREAM PRESS WAY
              </span>
              <span className="font-mono text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized Desk
              </span>
            </div>

            <h3 className="font-serif font-bold text-2xl text-ink-primary">
              &quot;One workflow. Multiple destinations.&quot;
            </h3>

            <ul className="space-y-4 font-sans text-sm text-ink-secondary">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <div>
                  <b className="text-ink-primary block font-mono text-xs uppercase">Universal Master Ingestion</b>
                  Upload master 4K footage once. The publishing engine automatically adapts 16:9 to 9:16 vertical reels with AI safe framing.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <div>
                  <b className="text-ink-primary block font-mono text-xs uppercase">Synchronized Platform Nuances</b>
                  Single shared story root with per-platform character counts, hashtag rules, and tone overrides customized in one screen.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <div>
                  <b className="text-ink-primary block font-mono text-xs uppercase">Interactive Safe-Zone Overlays</b>
                  Real-time visual viewports ensure text and key visual moments are never clipped by mobile navigation overlays.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <div>
                  <b className="text-ink-primary block font-mono text-xs uppercase">Isolated Worker Failure Recovery</b>
                  Concurrent worker queues handle each network separately. Temporary rate limits on one channel never affect other dispatches.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 03 — HOW THE PRESS WORKS                                          */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-paper-raised border-y-2 border-border-rule px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-brand-indigo uppercase tracking-wider">
              03 / HOW THE PRESS WORKS
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-ink-primary">
              From Master File to Global Dispatch in Four Movements
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-secondary">
              An elegant editorial production line engineered to maintain maximum fidelity across all network endpoints.
            </p>
          </div>

          {/* Interactive 4-Checkpoint Step Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { step: 1, title: 'Upload Your Story', sub: 'Master 4K or photo carousel' },
              { step: 2, title: 'Choose Channels', sub: 'Target social endpoints' },
              { step: 3, title: 'Customize Edition', sub: 'Safe-zones & tone nuance' },
              { step: 4, title: 'Schedule & Dispatch', sub: 'Bangkok peak precision' },
            ].map((item) => (
              <button
                key={item.step}
                onClick={() => setActiveWorkflowStep(item.step)}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer space-y-1 ${
                  activeWorkflowStep === item.step
                    ? 'bg-paper-canvas border-brand-indigo shadow-sm ring-2 ring-brand-indigo/10'
                    : 'bg-paper-canvas/50 border-border-rule/80 hover:border-brand-indigo/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-6 h-6 rounded-full font-mono font-bold text-xs flex items-center justify-center ${
                    activeWorkflowStep === item.step
                      ? 'bg-brand-indigo text-white'
                      : 'bg-paper-subtle text-ink-secondary'
                  }`}>
                    0{item.step}
                  </span>
                  {activeWorkflowStep === item.step && (
                    <span className="w-2 h-2 rounded-full bg-brand-indigo animate-ping" />
                  )}
                </div>
                <h4 className="font-serif font-bold text-sm text-ink-primary pt-1">
                  {item.title}
                </h4>
                <p className="text-[11px] font-mono text-ink-secondary">
                  {item.sub}
                </p>
              </button>
            ))}
          </div>

          {/* Dynamic Workflow Detail Card */}
          <div className="p-6 sm:p-8 bg-paper-canvas border-2 border-border-rule rounded-3xl shadow-md space-y-4">
            {activeWorkflowStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <span className="px-2.5 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-mono text-xs font-bold uppercase">
                    STAGE 01 — UNIVERSAL INGESTION
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary">
                    Upload Your Master Story Without Compression
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed font-sans">
                    Drop your full-resolution 4K video or uncompressed image series. The engine automatically inspects the container, probes keyframe intervals, analyzes color profiles, and prepares baseline metadata for multi-aspect conversion.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-ink-secondary pt-2">
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ H.264 / HEVC / ProRes</span>
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ Up to 4K 60fps</span>
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ Stereo 48kHz Audio</span>
                  </div>
                </div>
                <div className="lg:col-span-5 p-4 bg-paper-raised rounded-2xl border border-border-rule font-mono text-xs space-y-2">
                  <div className="text-[10px] text-ink-secondary uppercase">PROBE METADATA REPORT</div>
                  <div className="p-2.5 bg-paper-canvas rounded border border-border-rule/80 space-y-1">
                    <div className="flex justify-between"><span>File:</span><span className="text-ink-primary font-bold">master_reel_ep04.mp4</span></div>
                    <div className="flex justify-between"><span>Resolution:</span><span className="text-brand-indigo font-bold">3840 × 2160 (16:9)</span></div>
                    <div className="flex justify-between"><span>Bitrate:</span><span>45.2 Mbps Clean</span></div>
                    <div className="flex justify-between"><span>Color Primaries:</span><span>Rec.709 Standard</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <span className="px-2.5 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-mono text-xs font-bold uppercase">
                    STAGE 02 — CHANNEL ORCHESTRATION
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary">
                    Target Connected Networks with Verified API Compliance
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed font-sans">
                    Select your active destination endpoints. The engine cross-references the official platform API limits (e.g. YouTube Shorts 60s, TikTok Reels, Instagram Carousel rules) and alerts you immediately if any channel requires dedicated adjustments.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-ink-secondary pt-2">
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ Token Vault AES-256</span>
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ No Passwords Required</span>
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ Granular Permissions</span>
                  </div>
                </div>
                <div className="lg:col-span-5 grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-3 bg-paper-raised rounded-xl border border-border-rule flex items-center gap-2">
                    <YouTubeLogo size={18} />
                    <div><b className="block text-ink-primary">YouTube</b><span className="text-[10px] text-emerald-700">✓ Token Active</span></div>
                  </div>
                  <div className="p-3 bg-paper-raised rounded-xl border border-border-rule flex items-center gap-2">
                    <InstagramLogo size={18} />
                    <div><b className="block text-ink-primary">Instagram</b><span className="text-[10px] text-emerald-700">✓ Token Active</span></div>
                  </div>
                  <div className="p-3 bg-paper-raised rounded-xl border border-border-rule flex items-center gap-2">
                    <TikTokLogo size={18} />
                    <div><b className="block text-ink-primary">TikTok</b><span className="text-[10px] text-emerald-700">✓ Token Active</span></div>
                  </div>
                  <div className="p-3 bg-paper-raised rounded-xl border border-border-rule flex items-center gap-2">
                    <FacebookLogo size={18} />
                    <div><b className="block text-ink-primary">Facebook</b><span className="text-[10px] text-emerald-700">✓ Token Active</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <span className="px-2.5 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-mono text-xs font-bold uppercase">
                    STAGE 03 — PLATFORM ADAPTATION
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary">
                    Tailor Metadata and Safe-Zones for Each Audience
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed font-sans">
                    Never send the exact same generic caption everywhere. MULTIPOST allows you to keep one core narrative, while customizing hashtags, link placements, and text hooks specifically tailored for the algorithm of each platform.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-ink-secondary pt-2">
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ Mobile Safe-Zone Visualizer</span>
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ Character Counter</span>
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ AI Tone Modulation</span>
                  </div>
                </div>
                <div className="lg:col-span-5 p-4 bg-paper-raised rounded-2xl border border-border-rule font-mono text-xs space-y-2">
                  <div className="text-[10px] text-ink-secondary uppercase">EDITION PREVIEWS</div>
                  <div className="p-2.5 bg-paper-canvas rounded border border-border-rule/80 text-[11px] space-y-1">
                    <div className="text-brand-indigo font-bold">TikTok Edition:</div>
                    <p className="text-ink-secondary line-clamp-2">Wait till the end to see the 16:9 shift... #creator #workflow #tech</p>
                    <div className="text-brand-indigo font-bold pt-1">YouTube Description:</div>
                    <p className="text-ink-secondary line-clamp-2">Full behind-the-scenes breakdown of our Bangkok editorial studio workflow...</p>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <span className="px-2.5 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-mono text-xs font-bold uppercase">
                    STAGE 04 — DISPATCH & MONITORING
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary">
                    Schedule for Bangkok Golden Hours or Push Instantly
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed font-sans">
                    Queue publication according to data-driven engagement windows. If any platform encounters a momentary API timeout, our isolated retry queues attempt recovery automatically without disturbing your other live feeds.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-ink-secondary pt-2">
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ Bangkok Golden Peak (UTC+7)</span>
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ Millisecond Precision</span>
                    <span className="px-2 py-1 bg-paper-subtle border border-border-rule rounded">✓ 1-Click Partial Recovery</span>
                  </div>
                </div>
                <div className="lg:col-span-5 p-4 bg-paper-raised rounded-2xl border border-border-rule font-mono text-xs space-y-2">
                  <div className="text-[10px] text-ink-secondary uppercase">DISPATCH ENGINE STATUS</div>
                  <div className="p-2.5 bg-paper-canvas rounded border border-border-rule/80 space-y-1 text-[11px]">
                    <div className="flex justify-between items-center"><span>Queue Status:</span><span className="text-emerald-700 font-bold">ACTIVE</span></div>
                    <div className="flex justify-between items-center"><span>Scheduled Time:</span><span>19:30 UTC+7</span></div>
                    <div className="flex justify-between items-center"><span>Worker Health:</span><span className="text-brand-indigo font-bold">100% Operational</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04 — INTERACTIVE PRESS STUDIO (4 GUIDED MINI TASKS)               */}
      {/* ========================================================================= */}
      <section ref={pressStudioRef} id="press-studio" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-border-rule pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-brand-indigo font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>04 / INTERACTIVE PRESS STUDIO</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl text-ink-primary">
              The Hands-On Publishing Playground
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary max-w-2xl">
              Complete the 4 guided micro-tasks below to collect up to <b>100 Press Coins</b> and unlock the collectible <b>7-Day Dream Pass</b> ticket.
            </p>
          </div>

          {/* Reset Playground button & Progress counter */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              className="py-1.5 px-3 rounded-editorial bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-xs font-mono text-ink-secondary flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset in-memory interactive playground"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Playground</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TASK 01: CHOOSE YOUR DESTINATIONS (+20 COINS) */}
          <div className={`p-6 rounded-3xl border-2 transition-all duration-300 space-y-4 bg-paper-raised ${
            completedTasks.destinations
              ? 'border-emerald-500/80 ring-2 ring-emerald-500/10 shadow-sm'
              : 'border-border-rule hover:border-brand-indigo/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
                  Task 01 — Choose Your Destinations
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                completedTasks.destinations ? 'bg-emerald-500/15 text-emerald-800' : 'bg-amber-400/15 text-amber-800'
              }`}>
                {completedTasks.destinations ? '✓ Completed (+20 Coins)' : '+20 Press Coins'}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              Select at least 2 simulated destination channels to prepare multi-network dispatch:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'YT', name: 'YouTube', icon: YouTubeLogo },
                { id: 'IG', name: 'Instagram', icon: InstagramLogo },
                { id: 'TT', name: 'TikTok', icon: TikTokLogo },
                { id: 'FB', name: 'Facebook', icon: FacebookLogo },
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
              <span>Selected: <b className="text-ink-primary">{selectedPlatforms.length}</b> channels</span>
              <span className="text-[10px] text-brand-indigo font-semibold">
                {selectedPlatforms.length >= 2 ? '✓ Minimum requirement met' : 'Pick 1 more platform to earn coins'}
              </span>
            </div>
          </div>

          {/* TASK 02: CUSTOMIZE YOUR EDITION (+25 COINS) */}
          <div className={`p-6 rounded-3xl border-2 transition-all duration-300 space-y-4 bg-paper-raised ${
            completedTasks.caption
              ? 'border-emerald-500/80 ring-2 ring-emerald-500/10 shadow-sm'
              : 'border-border-rule hover:border-brand-indigo/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
                  Task 02 — Customize Your Edition
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                completedTasks.caption ? 'bg-emerald-500/15 text-emerald-800' : 'bg-amber-400/15 text-amber-800'
              }`}>
                {completedTasks.caption ? '✓ Completed (+25 Coins)' : '+25 Press Coins'}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              Tailor your narrative tone using editorial presets or customize your copy:
            </p>

            {/* Tone Selector Chips */}
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {[
                { id: 'HOOK', label: '⚡ High-Hook Viral' },
                { id: 'BROADSHEET', label: '📰 Gazette Broadsheet' },
                { id: 'LUXURY', label: '✨ Luxury Studio' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTone(t.id as any)}
                  className={`py-1 px-2.5 rounded-full border transition-all cursor-pointer text-xs ${
                    activeTone === t.id
                      ? 'bg-brand-indigo text-white font-bold border-brand-indigo shadow-2xs'
                      : 'bg-paper-canvas text-ink-secondary hover:text-ink-primary border-border-rule'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Editable or Preview Caption Box */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-ink-secondary">
                <span>LIVE PLATFORM CAPTION PREVIEW</span>
                <span>{customCaption.length} characters</span>
              </div>
              <textarea
                value={customCaption}
                onChange={(e) => {
                  setCustomCaption(e.target.value);
                  if (!completedTasks.caption) {
                    awardCoins(25, 'Tailored platform edition caption (+25 Coins)', 'caption');
                  }
                }}
                rows={2}
                className="w-full p-2.5 bg-paper-canvas rounded-editorial border border-border-rule text-xs font-sans text-ink-primary leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-indigo"
              />
            </div>
          </div>

          {/* TASK 03: SCHEDULE YOUR DISPATCH (+25 COINS) */}
          <div className={`p-6 rounded-3xl border-2 transition-all duration-300 space-y-4 bg-paper-raised ${
            completedTasks.schedule
              ? 'border-emerald-500/80 ring-2 ring-emerald-500/10 shadow-sm'
              : 'border-border-rule hover:border-brand-indigo/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
                  Task 03 — Schedule Your Dispatch
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                completedTasks.schedule ? 'bg-emerald-500/15 text-emerald-800' : 'bg-amber-400/15 text-amber-800'
              }`}>
                {completedTasks.schedule ? '✓ Completed (+25 Coins)' : '+25 Press Coins'}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              Confirm a high-performing audience window to schedule publishing:
            </p>

            <div className="space-y-2 text-xs font-mono">
              {[
                { id: 'LUNCH', time: '11:45 AM', label: 'Bangkok Lunch Peak (Midday Break)', boost: '2.4x Reach' },
                { id: 'EVENING', time: '07:30 PM', label: 'Prime Commute & Reel Window', boost: '3.1x Viral Boost' },
                { id: 'NIGHT', time: '09:15 PM', label: 'Night Owl Leisure Feed', boost: '1.9x Clicks' },
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

          {/* TASK 04: RESCUE A FAILED POST (+30 COINS) */}
          <div className={`p-6 rounded-3xl border-2 transition-all duration-300 space-y-4 bg-paper-raised ${
            completedTasks.rescue
              ? 'border-emerald-500/80 ring-2 ring-emerald-500/10 shadow-sm'
              : 'border-border-rule hover:border-brand-indigo/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
                  Task 04 — Rescue a Failed Post
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                completedTasks.rescue ? 'bg-emerald-500/15 text-emerald-800' : 'bg-amber-400/15 text-amber-800'
              }`}>
                {completedTasks.rescue ? '✓ Completed (+30 Coins)' : '+30 Press Coins'}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              Inspect a simulated aspect ratio mismatch and trigger automated recovery:
            </p>

            {!isFailureResolved ? (
              <div className="p-3.5 bg-accent-terracotta/10 border border-accent-terracotta/40 rounded-editorial space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-accent-terracotta font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Meta Graph API 400: Aspect Ratio Mismatch</span>
                </div>
                <p className="text-[11px] text-ink-secondary">
                  Instagram Reel requires 9:16 vertical canvas. Master input was 1:1 square.
                </p>
                <button
                  onClick={handleResolveFailure}
                  className="w-full py-2.5 px-3 rounded bg-accent-terracotta text-white font-bold hover:bg-accent-terracotta/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>⚡ 1-Click AI Safe-Zone Rescue</span>
                </button>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/40 rounded-editorial space-y-1.5 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Fixed: Framed to 1080 × 1920 with safe margins!</span>
                </div>
                <p className="text-[11px] text-emerald-900/80">
                  Canvas adjusted with 15% top status clearance and 25% bottom caption padding. Ready for dispatch.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS UNLOCK BANNER */}
        <div className="p-6 sm:p-8 rounded-3xl border-2 border-border-rule bg-paper-raised shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-400/20 text-amber-700 flex items-center justify-center shrink-0 border border-amber-400/40 shadow-inner">
              <PressCoinIcon size={34} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-ink-primary">
                  Interactive Progress: {coins} / 100 Press Coins
                </h3>
                {isPassUnlocked && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-500/30 animate-pulse">
                    PASS FORGED
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                {isPassUnlocked
                  ? 'Congratulations! You have gathered all 100 Press Coins. Scroll to Section 10 to claim your Dream Pass!'
                  : 'Complete the tasks above to unlock the 7-Day Dream Pass editorial ticket at the bottom of the page.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => dreamPassRef.current?.scrollIntoView({ behavior: 'smooth' })}
              disabled={!isPassUnlocked}
              className={`py-3 px-6 rounded-editorial text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isPassUnlocked
                  ? 'bg-accent-terracotta text-white hover:bg-accent-terracotta/90 shadow-md animate-bounce'
                  : 'bg-paper-subtle text-ink-secondary/40 border border-border-rule cursor-not-allowed'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>{isPassUnlocked ? 'Jump to Dream Pass Ticket →' : 'Locked (Requires 100 Coins)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 05 — PRESS COINS (COLLECTIBLE REWARD SYSTEM)                      */}
      {/* ========================================================================= */}
      <section id="press-coins" className="py-20 bg-paper-raised border-y-2 border-border-rule px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-brand-indigo uppercase tracking-wider">
              05 / PRESS COINS
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-ink-primary">
              The Currency of Publishing Precision
            </h2>
            <p className="font-sans text-sm text-ink-secondary leading-relaxed">
              Press Coins represent verified milestones in the Dream Press ecosystem. Complete all assignments to forge the 7-Day Dream Pass.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Collectible Coin Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-paper-canvas rounded-3xl border-2 border-border-rule text-center space-y-4">
              <div className="relative">
                <div className="w-36 h-36 rounded-full bg-amber-400/10 flex items-center justify-center p-2 shadow-inner ring-4 ring-amber-400/20">
                  <PressCoinIcon size={120} />
                </div>
                <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold shadow-xs">
                  OFFICIAL TOKEN
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-lg text-ink-primary">
                  The Press Coin № 01
                </h4>
                <p className="text-xs font-mono text-ink-secondary">
                  Vintage Editorial Mark • Milled Ochre Rim
                </p>
              </div>

              <p className="text-xs text-ink-secondary max-w-xs font-sans leading-relaxed">
                Awarded for precision workflows: destination selection, nuanced caption tailoring, optimal time scheduling, and proactive error recovery.
              </p>
            </div>

            {/* Right: Live Coin Ledger & Progress */}
            <div className="lg:col-span-7 p-6 sm:p-8 bg-paper-canvas rounded-3xl border-2 border-border-rule space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border-rule">
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-secondary block">
                    SESSION LEDGER BALANCE
                  </span>
                  <div className="text-4xl font-serif font-bold text-ink-primary flex items-baseline gap-2">
                    <span>{coins}</span>
                    <span className="text-sm font-mono text-ink-secondary font-normal">/ 100 COINS MAX</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-ink-secondary block">STATUS</span>
                  <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded ${
                    isPassUnlocked ? 'bg-emerald-500/15 text-emerald-800' : 'bg-amber-400/15 text-amber-800'
                  }`}>
                    {isPassUnlocked ? '✦ Ready to Unlock Pass' : `${100 - coins} Coins Remaining`}
                  </span>
                </div>
              </div>

              {/* Milestone Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-ink-secondary">
                  <span>Start (0)</span>
                  <span>Destinations (20)</span>
                  <span>Caption (45)</span>
                  <span>Schedule (70)</span>
                  <span>Unlocked (100)</span>
                </div>
                <div className="w-full h-3 bg-paper-subtle rounded-full overflow-hidden border border-border-rule p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full transition-all duration-700 shadow-xs"
                    style={{ width: `${coins}%` }}
                  />
                </div>
              </div>

              {/* Assignment Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  completedTasks.destinations ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800' : 'bg-paper-raised border-border-rule text-ink-secondary'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${completedTasks.destinations ? 'text-emerald-700' : 'text-ink-muted'}`} />
                  <span>Choose Destinations (+20)</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  completedTasks.caption ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800' : 'bg-paper-raised border-border-rule text-ink-secondary'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${completedTasks.caption ? 'text-emerald-700' : 'text-ink-muted'}`} />
                  <span>Customize Edition (+25)</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  completedTasks.schedule ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800' : 'bg-paper-raised border-border-rule text-ink-secondary'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${completedTasks.schedule ? 'text-emerald-700' : 'text-ink-muted'}`} />
                  <span>Bangkok Slot (+25)</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  completedTasks.rescue ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800' : 'bg-paper-raised border-border-rule text-ink-secondary'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${completedTasks.rescue ? 'text-emerald-700' : 'text-ink-muted'}`} />
                  <span>Rescue Failed Post (+30)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 06 — EXPLORE THE WORKSPACE (INTERACTIVE FEATURE TOUR)             */}
      {/* ========================================================================= */}
      <section ref={workspaceTourRef} id="workspace-tour" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-brand-indigo uppercase tracking-wider">
            06 / EXPLORE THE WORKSPACE
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-5xl text-ink-primary">
            The Full-Spectrum Publishing Studio
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
            Inspect the core production rooms of MULTIPOST. Switch tabs to preview real workflow interfaces.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 border-b-2 border-border-rule pb-3 font-mono text-xs">
          {[
            { id: 'dashboard', label: 'Command Dashboard', icon: LayoutGrid },
            { id: 'library', label: 'Content Library', icon: FolderOpen },
            { id: 'composer', label: 'Create Post (Composer)', icon: FileText },
            { id: 'queue', label: 'Publishing Queue', icon: RefreshCw },
            { id: 'calendar', label: 'Editorial Calendar', icon: CalendarIcon },
            { id: 'analytics', label: 'Performance Radar', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTourTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTourTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-editorial transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-brand-indigo text-white font-bold shadow-xs'
                    : 'bg-paper-raised text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle border border-border-rule'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Workspace Tab Panels */}
        <div className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-3xl shadow-lg relative min-h-[420px]">
          {/* TAB 1: DASHBOARD */}
          {activeTourTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border-rule">
                <div>
                  <h3 className="font-serif font-bold text-xl text-ink-primary">
                    Central Publishing Command
                  </h3>
                  <p className="text-xs font-mono text-ink-secondary">Real-time health of scheduled campaigns, queues, and connected accounts</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-emerald-700">All Workers Healthy</span>
                </div>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-paper-canvas rounded-xl border border-border-rule">
                  <span className="text-[10px] font-mono text-ink-secondary block">DISPATCH RELIABILITY</span>
                  <div className="text-2xl font-serif font-bold text-brand-indigo">99.98%</div>
                  <span className="text-[10px] font-mono text-emerald-700">SLA Maintained</span>
                </div>
                <div className="p-4 bg-paper-canvas rounded-xl border border-border-rule">
                  <span className="text-[10px] font-mono text-ink-secondary block">ACTIVE QUEUES</span>
                  <div className="text-2xl font-serif font-bold text-ink-primary">12 Posts</div>
                  <span className="text-[10px] font-mono text-ink-secondary">Across 4 Networks</span>
                </div>
                <div className="p-4 bg-paper-canvas rounded-xl border border-border-rule">
                  <span className="text-[10px] font-mono text-ink-secondary block">PEAK SLOT TARGET</span>
                  <div className="text-2xl font-serif font-bold text-amber-600">19:30 UTC+7</div>
                  <span className="text-[10px] font-mono text-ink-secondary">Prime Reel Window</span>
                </div>
                <div className="p-4 bg-paper-canvas rounded-xl border border-border-rule">
                  <span className="text-[10px] font-mono text-ink-secondary block">TOKEN VAULT</span>
                  <div className="text-2xl font-serif font-bold text-emerald-700">AES-256</div>
                  <span className="text-[10px] font-mono text-emerald-700">Encrypted GCM</span>
                </div>
              </div>

              {/* Recent Dispatches Mock Table */}
              <div className="border border-border-rule rounded-xl overflow-hidden bg-paper-canvas">
                <div className="p-2.5 bg-paper-subtle border-b border-border-rule text-[11px] font-mono font-bold text-ink-secondary flex justify-between">
                  <span>DISPATCH STREAM</span>
                  <span>STATUS</span>
                </div>
                <div className="divide-y divide-border-rule/60 text-xs font-mono">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <YouTubeLogo size={14} />
                      <span className="font-bold text-ink-primary truncate">Behind The Scenes ep04 (4K Master)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-bold text-[10px]">PUBLISHED</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TikTokLogo size={14} />
                      <span className="font-bold text-ink-primary truncate">Micro-Teaser Hook #9:16</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-bold text-[10px]">ENCODING 78%</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <InstagramLogo size={14} />
                      <span className="font-bold text-ink-primary truncate">Prime Carousel Photo Slide</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-400/15 text-amber-800 font-bold text-[10px]">QUEUED 19:30</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT LIBRARY */}
          {activeTourTab === 'library' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border-rule">
                <div>
                  <h3 className="font-serif font-bold text-xl text-ink-primary">Master Media Asset Repository</h3>
                  <p className="text-xs font-mono text-ink-secondary">Search, tag, and reuse high-resolution master video and graphics</p>
                </div>
                <span className="px-3 py-1 bg-paper-canvas border border-border-rule rounded-editorial font-mono text-xs font-bold text-ink-primary">
                  128 Assets Ingested
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Brand Launch Reel 2026', res: '3840 × 2160', dur: '01:45', tag: 'Master 4K' },
                  { title: 'Product Showcase Carousel', res: '1080 × 1350', dur: '5 Slides', tag: 'Carousel 4:5' },
                  { title: 'Bangkok Studio Vlog Hook', res: '1080 × 1920', dur: '00:30', tag: 'Vertical 9:16' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-paper-canvas rounded-2xl border border-border-rule space-y-3">
                    <div className="aspect-video bg-paper-subtle rounded-xl border border-border-rule/80 flex items-center justify-center relative overflow-hidden">
                      <Film className="w-8 h-8 text-brand-indigo/40" />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-brand-indigo text-white font-mono text-[9px] font-bold">
                        {item.tag}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-ink-primary truncate">{item.title}</h4>
                      <div className="flex justify-between text-[10px] font-mono text-ink-secondary pt-1">
                        <span>{item.res}</span>
                        <span>{item.dur}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE POST (COMPOSER) */}
          {activeTourTab === 'composer' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border-rule">
                <div>
                  <h3 className="font-serif font-bold text-xl text-ink-primary">Universal Studio Composer</h3>
                  <p className="text-xs font-mono text-ink-secondary">Single story root with platform-specific safe-zone overlays</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo text-xs font-mono font-bold">IG Reel</span>
                  <span className="px-2 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo text-xs font-mono font-bold">YouTube</span>
                  <span className="px-2 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo text-xs font-mono font-bold">TikTok</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-4 bg-paper-canvas rounded-2xl border border-border-rule space-y-3">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-ink-primary">SHARED STORY DRAFT</span>
                      <span className="text-ink-secondary">142 / 2,200 chars</span>
                    </div>
                    <p className="text-xs font-sans text-ink-primary leading-relaxed bg-paper-raised p-3 rounded-xl border border-border-rule/80">
                      Step into our Bangkok creative press room. Today we are launching the new Dream Press multi-placement engine with instant safe-zone compliance.
                    </p>
                    <div className="flex gap-2 text-[10px] font-mono text-ink-secondary">
                      <span className="px-2 py-0.5 bg-paper-subtle rounded border border-border-rule">#multipost</span>
                      <span className="px-2 py-0.5 bg-paper-subtle rounded border border-border-rule">#dreampress</span>
                      <span className="px-2 py-0.5 bg-paper-subtle rounded border border-border-rule">#creator</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 p-4 bg-paper-canvas rounded-2xl border border-border-rule space-y-2">
                  <div className="text-[10px] font-mono text-ink-secondary uppercase">SAFE-ZONE VIEWPORT (9:16)</div>
                  <div className="aspect-[9/14] bg-paper-subtle rounded-xl border border-dashed border-brand-indigo/40 p-3 flex flex-col justify-between relative text-center">
                    <div className="p-1 bg-brand-indigo/10 rounded text-[9px] font-mono text-brand-indigo">
                      TOP SAFE-ZONE (Status Bars & Notch Clearance)
                    </div>
                    <div className="font-serif italic text-xs text-ink-primary">
                      Main focal area stays completely clear of mobile UI buttons
                    </div>
                    <div className="p-1 bg-accent-terracotta/10 rounded text-[9px] font-mono text-accent-terracotta">
                      BOTTOM SAFE-ZONE (Like, Comment & Sound Button Clearance)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PUBLISHING QUEUE */}
          {activeTourTab === 'queue' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border-rule">
                <div>
                  <h3 className="font-serif font-bold text-xl text-ink-primary">Asynchronous Dispatch Queue</h3>
                  <p className="text-xs font-mono text-ink-secondary">Track job execution, worker concurrency, and isolate partial retries</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded">
                  Queue Health: 100%
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { id: 'JOB-9021', chan: 'YouTube', type: YouTubeLogo, time: '19:30 UTC+7', status: 'READY', badge: 'bg-emerald-500/10 text-emerald-800' },
                  { id: 'JOB-9022', chan: 'Instagram', type: InstagramLogo, time: '19:30 UTC+7', status: 'IN QUEUE', badge: 'bg-brand-indigo/10 text-brand-indigo' },
                  { id: 'JOB-9023', chan: 'TikTok', type: TikTokLogo, time: '19:30 UTC+7', status: 'IN QUEUE', badge: 'bg-brand-indigo/10 text-brand-indigo' },
                  { id: 'JOB-9024', chan: 'X / Twitter', type: XLogo, time: '19:35 UTC+7', status: 'RATE LIMIT BACKOFF', badge: 'bg-amber-400/20 text-amber-900' },
                ].map((job) => {
                  const Icon = job.type;
                  return (
                    <div key={job.id} className="p-3.5 bg-paper-canvas rounded-xl border border-border-rule flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        <div>
                          <b className="text-ink-primary">{job.chan}</b>
                          <span className="text-ink-secondary text-[11px] ml-2">ID: {job.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-ink-secondary hidden sm:inline">{job.time}</span>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${job.badge}`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: CALENDAR */}
          {activeTourTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border-rule">
                <div>
                  <h3 className="font-serif font-bold text-xl text-ink-primary">Editorial Publishing Calendar</h3>
                  <p className="text-xs font-mono text-ink-secondary">Synchronized schedule with Bangkok Golden Peak highlight zones</p>
                </div>
                <span className="text-xs font-mono text-ink-secondary">Asia/Bangkok (UTC+7)</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center font-mono text-xs">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                  <div key={day} className="p-2 bg-paper-subtle rounded-lg font-bold text-ink-secondary text-[11px]">
                    {day}
                  </div>
                ))}
                {[20, 21, 22, 23, 24, 25, 26].map((date, idx) => (
                  <div key={idx} className="p-3 bg-paper-canvas rounded-xl border border-border-rule min-h-[85px] text-left space-y-1">
                    <span className="text-xs font-bold text-ink-primary">{date}</span>
                    {idx === 2 && (
                      <div className="p-1 bg-brand-indigo/10 text-brand-indigo rounded text-[9px] font-bold truncate">
                        19:30 Reel Live
                      </div>
                    )}
                    {idx === 4 && (
                      <div className="p-1 bg-amber-400/20 text-amber-900 rounded text-[9px] font-bold truncate">
                        11:45 YT Widescreen
                      </div>
                    )}
                    {idx === 6 && (
                      <div className="p-1 bg-emerald-500/15 text-emerald-800 rounded text-[9px] font-bold truncate">
                        21:15 Night Owl
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ANALYTICS */}
          {activeTourTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border-rule">
                <div>
                  <h3 className="font-serif font-bold text-xl text-ink-primary">Omni-Channel Performance Radar</h3>
                  <p className="text-xs font-mono text-ink-secondary">Consolidated impression reach and cross-platform engagement velocity</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-brand-indigo/10 text-brand-indigo font-mono text-xs font-bold">
                  Last 30 Days
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-paper-canvas rounded-2xl border border-border-rule space-y-1">
                  <span className="text-[10px] font-mono text-ink-secondary uppercase">TOTAL IMPRESSIONS</span>
                  <div className="text-3xl font-serif font-bold text-ink-primary">482,900</div>
                  <div className="flex items-center gap-1 text-emerald-700 font-mono text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+24.6% vs single-app uploads</span>
                  </div>
                </div>
                <div className="p-4 bg-paper-canvas rounded-2xl border border-border-rule space-y-1">
                  <span className="text-[10px] font-mono text-ink-secondary uppercase">AVERAGE ENGAGEMENT</span>
                  <div className="text-3xl font-serif font-bold text-ink-primary">6.8%</div>
                  <div className="text-ink-secondary font-mono text-xs">Across 6 connected endpoints</div>
                </div>
                <div className="p-4 bg-paper-canvas rounded-2xl border border-border-rule space-y-1">
                  <span className="text-[10px] font-mono text-ink-secondary uppercase">TIME SAVED / WEEK</span>
                  <div className="text-3xl font-serif font-bold text-brand-indigo">14.5 hrs</div>
                  <div className="text-emerald-700 font-mono text-xs">Zero manual copy-pasting</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 07 — FEATURES THAT MATTER (EDITORIAL MAGAZINE LAYOUT)             */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-paper-raised border-y-2 border-border-rule px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-brand-indigo uppercase tracking-wider">
              07 / FEATURES THAT MATTER
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-ink-primary">
              Engineered for Serious Publishing
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
              Eight architectural pillars designed to streamline complex multi-network delivery into one effortless, dependable routine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Upload Once */}
            <div className="p-6 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink-primary">Upload Once</h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                Universal master ingestion supporting 4K 60fps video and uncompressed photo sets without quality reduction.
              </p>
            </div>

            {/* 2. Shared Story */}
            <div className="p-6 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink-primary">Shared Story</h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                A single canonical narrative draft that maintains consistency while serving as the parent root for every channel.
              </p>
            </div>

            {/* 3. Platform Editions */}
            <div className="p-6 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink-primary">Platform Editions</h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                Tailored character limits, hashtag placements, and mobile safe-zone guides adapted for YouTube, IG, TikTok, and X.
              </p>
            </div>

            {/* 4. Smart Scheduling */}
            <div className="p-6 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-accent-terracotta/10 text-accent-terracotta flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink-primary">Smart Scheduling</h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                Bangkok Golden Peak hour recommendations (11:45, 19:30, 21:15 UTC+7) for maximum organic distribution.
              </p>
            </div>

            {/* 5. Publishing Queue */}
            <div className="p-6 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink-primary">Publishing Queue</h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                Asynchronous job engine with millisecond synchronization across concurrent social network APIs.
              </p>
            </div>

            {/* 6. Retry & Recovery */}
            <div className="p-6 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-accent-terracotta/10 text-accent-terracotta flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink-primary">Retry & Recovery</h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                Isolated partial retry: if one platform rate limits, resolve and retry it without re-posting to successful channels.
              </p>
            </div>

            {/* 7. Connected Accounts */}
            <div className="p-6 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink-primary">Connected Accounts</h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                Bank-grade Token Vault encrypted with AES-256 GCM. No user passwords stored; zero token leakage risks.
              </p>
            </div>

            {/* 8. Content Performance */}
            <div className="p-6 bg-paper-canvas border border-border-rule rounded-2xl shadow-xs space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink-primary">Content Performance</h3>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                Unified cross-network metrics tracking aggregated views, engagement velocity, and publication edition ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 08 — BUILT FOR YOUR CREATIVE WORKFLOW                             */}
      {/* ========================================================================= */}
      <section id="audience" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-brand-indigo uppercase tracking-wider">
            08 / BUILT FOR YOUR CREATIVE WORKFLOW
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-ink-primary">
            Tailored for Every Scale of Modern Publishing
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
            Engineered to remove friction whether you produce solo broadcasts or orchestrate multi-client publishing operations.
          </p>
        </div>

        {/* 5 Audience Profiles Grid (STRICTLY NO FAKE STATS / NO FAKE REVIEWS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Individual Creators */}
          <div className="p-6 bg-paper-raised border-2 border-border-rule rounded-3xl space-y-4 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-mono font-bold text-xs">
              01
            </div>
            <h3 className="font-serif font-bold text-xl text-ink-primary">
              Individual Creators
            </h3>
            <p className="text-xs text-ink-secondary font-sans leading-relaxed">
              Solo YouTubers, podcasters, and storytellers who want to distribute short-form clips to TikTok and Instagram Reels in minutes without getting trapped in repetitive export-render cycles.
            </p>
            <div className="pt-2 border-t border-border-rule/60 text-[11px] font-mono text-brand-indigo font-semibold">
              ✓ 1 Master Upload → 4 Social Feeds
            </div>
          </div>

          {/* 2. Social Media Managers */}
          <div className="p-6 bg-paper-raised border-2 border-border-rule rounded-3xl space-y-4 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-accent-terracotta/10 text-accent-terracotta flex items-center justify-center font-mono font-bold text-xs">
              02
            </div>
            <h3 className="font-serif font-bold text-xl text-ink-primary">
              Social Media Managers
            </h3>
            <p className="text-xs text-ink-secondary font-sans leading-relaxed">
              Professionals handling multiple client channels who need reliable scheduled queues, custom platform hashtags, and safe-zone preview accuracy before any post goes live.
            </p>
            <div className="pt-2 border-t border-border-rule/60 text-[11px] font-mono text-accent-terracotta font-semibold">
              ✓ Multi-Brand Channel Isolation
            </div>
          </div>

          {/* 3. Content Teams & Newsrooms */}
          <div className="p-6 bg-paper-raised border-2 border-border-rule rounded-3xl space-y-4 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
              03
            </div>
            <h3 className="font-serif font-bold text-xl text-ink-primary">
              Content Teams & Newsrooms
            </h3>
            <p className="text-xs text-ink-secondary font-sans leading-relaxed">
              Editorial publication desks that operate with structured draft stages, editorial review gates, and synchronized multi-network announcements with zero room for error.
            </p>
            <div className="pt-2 border-t border-border-rule/60 text-[11px] font-mono text-emerald-800 font-semibold">
              ✓ Review Gates & Role Permissions
            </div>
          </div>

          {/* 4. Creative Studios */}
          <div className="p-6 bg-paper-raised border-2 border-border-rule rounded-3xl space-y-4 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-800 flex items-center justify-center font-mono font-bold text-xs">
              04
            </div>
            <h3 className="font-serif font-bold text-xl text-ink-primary">
              Creative Studios
            </h3>
            <p className="text-xs text-ink-secondary font-sans leading-relaxed">
              Video production houses delivering pristine commercial assets for brands, where maintaining full 4K visual fidelity and exact color spaces is non-negotiable.
            </p>
            <div className="pt-2 border-t border-border-rule/60 text-[11px] font-mono text-amber-800 font-semibold">
              ✓ Uncompressed 4K Master Preservation
            </div>
          </div>

          {/* 5. Small Businesses & Brands */}
          <div className="p-6 bg-paper-raised border-2 border-border-rule rounded-3xl space-y-4 shadow-xs md:col-span-2 lg:col-span-2">
            <div className="w-8 h-8 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-mono font-bold text-xs">
              05
            </div>
            <h3 className="font-serif font-bold text-xl text-ink-primary">
              Small Businesses & Independent Brands
            </h3>
            <p className="text-xs text-ink-secondary font-sans leading-relaxed">
              Founders and store owners who need a vibrant multi-channel presence on Facebook, Instagram, and TikTok, but can only afford 20 minutes a week to set up their publication calendar.
            </p>
            <div className="pt-2 border-t border-border-rule/60 text-[11px] font-mono text-brand-indigo font-semibold">
              ✓ Automated Bangkok Peak Hour Publishing
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 09 — THE DISPATCH BOARD (INTERACTIVE MULTI-PLATFORM STATUS DEMO) */}
      {/* ========================================================================= */}
      <section id="dispatch-board" className="py-20 bg-paper-raised border-y-2 border-border-rule px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-brand-indigo uppercase tracking-wider">
              09 / THE DISPATCH BOARD
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-ink-primary">
              Live Multi-Platform Dispatch Simulation
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
              Observe how MULTIPOST manages concurrent platform dispatches with independent state isolation. A temporary timeout on one network never interrupts other live deliveries.
            </p>
          </div>

          {/* The Interactive Dispatch Matrix */}
          <div className="p-6 sm:p-8 bg-paper-canvas rounded-3xl border-2 border-border-rule shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border-rule">
              <div>
                <span className="text-[10px] font-mono text-ink-secondary uppercase block">CAMPAIGN DISPATCH MATRIX</span>
                <h3 className="font-serif font-bold text-lg text-ink-primary">
                  Master Reel #04: The Bangkok Studio Launch
                </h3>
              </div>
              <div className="text-xs font-mono text-ink-secondary">
                Transmission Protocol: Concurrent Asynchronous Workers
              </div>
            </div>

            {/* Independent Platform Streams */}
            <div className="space-y-4">
              {/* YouTube Stream (Published) */}
              <div className="p-4 bg-paper-raised rounded-2xl border border-border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
                    <YouTubeLogo size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="text-sm text-ink-primary">YouTube Data API v3</b>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 font-mono text-[10px] font-bold">
                        PUBLISHED (200 OK)
                      </span>
                    </div>
                    <p className="text-xs text-ink-secondary font-mono">Format: 16:9 4K Master Video • 45.2 Mbps</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Live on Feed (Watch Link Ready)</span>
                </div>
              </div>

              {/* TikTok Stream (Processing) */}
              <div className="p-4 bg-paper-raised rounded-2xl border border-border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900/10 text-ink-primary flex items-center justify-center shrink-0">
                    <TikTokLogo size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="text-sm text-ink-primary">TikTok Creator API</b>
                      <span className="px-2 py-0.5 rounded bg-brand-indigo/15 text-brand-indigo font-mono text-[10px] font-bold">
                        PROCESSING (ENCODING 78%)
                      </span>
                    </div>
                    <p className="text-xs text-ink-secondary font-mono">Format: 9:16 Vertical Safe-Zone • Direct Mobile Chunk</p>
                  </div>
                </div>
                <div className="w-40 space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between text-ink-secondary"><span>Worker Push:</span><span>78%</span></div>
                  <div className="w-full h-1.5 bg-paper-subtle rounded-full overflow-hidden">
                    <div className="h-full bg-brand-indigo w-[78%] rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Instagram Stream (Scheduled) */}
              <div className="p-4 bg-paper-raised rounded-2xl border border-border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-600/10 text-pink-600 flex items-center justify-center shrink-0">
                    <InstagramLogo size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="text-sm text-ink-primary">Instagram Graph API</b>
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-900 font-mono text-[10px] font-bold">
                        SCHEDULED (19:30 UTC+7)
                      </span>
                    </div>
                    <p className="text-xs text-ink-secondary font-mono">Format: 9:16 Reel • Mobile Sound Sync Enabled</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-amber-800">
                  <Clock className="w-4 h-4" />
                  <span>Locked for Peak Window</span>
                </div>
              </div>

              {/* X / Twitter Stream: Simulated Failure & Isolated Recovery Action */}
              <div className="p-4 bg-paper-raised rounded-2xl border border-border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900/10 text-ink-primary flex items-center justify-center shrink-0">
                    <XLogo size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="text-sm text-ink-primary">X API v2 Endpoint</b>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        xRetryState === 'FAILED'
                          ? 'bg-accent-terracotta/15 text-accent-terracotta'
                          : xRetryState === 'RETRYING'
                          ? 'bg-amber-400/20 text-amber-900'
                          : 'bg-emerald-500/15 text-emerald-800'
                      }`}>
                        {xRetryState === 'FAILED' && 'TEMPORARY RATE LIMIT (429)'}
                        {xRetryState === 'RETRYING' && 'RE-AUTHENTICATING WORKER...'}
                        {xRetryState === 'RECOVERED' && 'RECOVERED & LIVE (200 OK)'}
                      </span>
                    </div>
                    <p className="text-xs text-ink-secondary font-mono">
                      {xRetryState === 'FAILED' && 'Isolated incident. Other platform feeds are 100% unaffected.'}
                      {xRetryState === 'RETRYING' && 'Refreshing OAuth token and applying exponential backoff.'}
                      {xRetryState === 'RECOVERED' && 'Dispatched successfully via isolated worker recovery.'}
                    </p>
                  </div>
                </div>

                <div>
                  {xRetryState === 'FAILED' && (
                    <button
                      onClick={handleRetryX}
                      className="py-2 px-4 rounded-editorial bg-accent-terracotta text-white font-mono text-xs font-bold hover:bg-accent-terracotta/90 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>⚡ 1-Click Partial Retry</span>
                    </button>
                  )}
                  {xRetryState === 'RETRYING' && (
                    <span className="font-mono text-xs text-amber-700 flex items-center gap-1.5 animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Retrying X stream only...</span>
                    </span>
                  )}
                  {xRetryState === 'RECOVERED' && (
                    <span className="font-mono text-xs text-emerald-700 flex items-center gap-1.5 font-bold">
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      <span>Recovered Independently!</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10 — FINAL REWARD: THE 7-DAY DREAM PASS                           */}
      {/* ========================================================================= */}
      <section ref={dreamPassRef} id="dream-pass" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-accent-terracotta uppercase tracking-wider">
            10 / THE DREAM PASS
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-5xl text-ink-primary">
            Your Official Activation Pass
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-secondary">
            A vintage editorial ticket forged through interactive mastery of the Dream Press workspace.
          </p>
        </div>

        {/* THE HORIZONTAL VINTAGE EDITORIAL TICKET */}
        <div className={`rounded-3xl border-2 transition-all duration-500 relative overflow-hidden shadow-2xl ${
          isPassUnlocked
            ? 'bg-paper-canvas border-accent-terracotta/80 ring-4 ring-amber-400/20'
            : 'bg-paper-raised border-border-rule opacity-90'
        }`}>
          {/* Perforated Notches on Left and Right ticket edges */}
          <div className="absolute top-1/2 -left-5 w-10 h-10 rounded-full bg-paper-canvas border-2 border-border-rule shadow-inner -translate-y-1/2" />
          <div className="absolute top-1/2 -right-5 w-10 h-10 rounded-full bg-paper-canvas border-2 border-border-rule shadow-inner -translate-y-1/2" />

          <div className="p-6 sm:p-10 space-y-6">
            {/* Ticket Masthead */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-dashed border-border-rule/80">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 text-amber-800 text-[10px] font-mono font-bold uppercase">
                  <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
                  <span>OFFICIAL ACTIVATION PASS • DREAM PRESS DESK</span>
                </div>
                <h3 className="font-serif font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
                  7-DAY DREAM PASS
                </h3>
                <p className="text-xs font-mono text-ink-secondary">
                  SERIAL: № DP-2026-7DAY-0089 • ADMIT ONE CREATOR
                </p>
              </div>

              {/* Ticket Validation State Pill */}
              <div className="text-right">
                <span className="text-[10px] font-mono text-ink-secondary uppercase block">SPECIFICATION</span>
                <span className={`inline-block px-3 py-1 rounded font-mono text-xs font-bold ${
                  isPassUnlocked
                    ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30'
                    : 'bg-paper-subtle text-ink-secondary border border-border-rule'
                }`}>
                  {isPassUnlocked ? '✦ UNLOCKED & READY' : '🔒 LOCKED (REQUIRES 100 COINS)'}
                </span>
              </div>
            </div>

            {/* Ticket Privileges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-paper-raised rounded-2xl border border-border-rule space-y-2">
                <span className="text-[10px] uppercase font-bold text-brand-indigo block">
                  AUTHORIZED SPECIFICATIONS:
                </span>
                <ul className="space-y-1.5 text-xs text-ink-primary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Unrestricted Social Networks (YT, IG, TT, FB, X, Lemon8)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Automated Bangkok Golden Peak (11:45, 19:30, 21:15 UTC+7)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Mobile Safe-Zone Viewport Visualizer for 9:16 Shorts & Reels</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-paper-raised rounded-2xl border border-border-rule space-y-2">
                <span className="text-[10px] uppercase font-bold text-brand-indigo block">
                  SECURITY & INFRASTRUCTURE:
                </span>
                <ul className="space-y-1.5 text-xs text-ink-primary">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
                    <span>Token Vault Encrypted with AES-256 GCM Standards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Isolated Worker Failure Recovery (1-Click Safe Retry)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Zero Password Storage • Direct OAuth Access</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* LOCKED vs UNLOCKED INTERACTION AREA */}
            {!isPassUnlocked ? (
              <div className="p-5 bg-paper-subtle rounded-2xl border border-border-rule text-center space-y-3 font-mono">
                <div className="flex items-center justify-center gap-2 text-ink-secondary text-xs">
                  <Lock className="w-4 h-4 text-accent-terracotta" />
                  <span>Current balance: <b>{coins} / 100 Press Coins</b></span>
                </div>
                <p className="text-xs text-ink-secondary">
                  Complete the 4 interactive mini tasks in Section 04 above to forge your Dream Pass.
                </p>
                <button
                  onClick={() => pressStudioRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="py-2.5 px-5 rounded-editorial bg-brand-indigo text-white font-bold text-xs hover:bg-brand-indigo-hover transition-colors cursor-pointer"
                >
                  Jump to Press Studio (+{100 - coins} Coins Remaining) →
                </button>
              </div>
            ) : !isPassRedeemed ? (
              <div className="space-y-4 pt-2">
                <button
                  onClick={() => setIsPassRedeemed(true)}
                  className="w-full py-4 px-6 rounded-editorial bg-accent-terracotta hover:bg-accent-terracotta/90 text-white font-bold text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.99]"
                >
                  <Sticker name="approved-seal" size="xs" inline />
                  <span>Redeem Dream Pass (Stamp & Validate Ticket)</span>
                </button>
                <p className="text-[11px] text-center font-mono text-ink-secondary">
                  *This interactive ticket validation is an enjoyable marketing reward. No credit card or billing was required.
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-800 mx-auto flex items-center justify-center font-bold text-xl border border-emerald-500/30">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
                    Your Dream Pass is ready. You&apos;ve completed the publishing experience!
                  </h4>
                  <p className="text-xs sm:text-sm text-ink-secondary max-w-xl mx-auto font-sans leading-relaxed">
                    You have mastered the Dream Press workflow. When you are ready to publish real stories across your own channels, activate your real 7-day trial below.
                  </p>
                </div>

                {/* Real Trial Link */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center text-xs font-mono">
                  <Link
                    href="/register"
                    className="py-3 px-6 rounded-editorial bg-brand-indigo hover:bg-brand-indigo-hover text-white font-bold shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Start Real 7-Day Free Trial (No Card Required) →</span>
                  </Link>
                  <Link
                    href="/docs"
                    className="py-3 px-4 rounded-editorial bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-primary font-semibold flex items-center justify-center"
                  >
                    <span>Read Documentation</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 11 — MINIMAL EDITORIAL FOOTER                                     */}
      {/* ========================================================================= */}
      <footer className="bg-paper-raised border-t-2 border-border-rule mt-auto pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand Column (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-brand-indigo text-white flex items-center justify-center font-serif font-bold text-sm shadow-2xs">
                  RP
                </div>
                <span className="font-serif font-bold text-lg text-ink-primary tracking-tight">
                  MULTIPOST — DREAM PRESS
                </span>
              </div>
              <p className="font-serif italic text-sm text-ink-secondary max-w-sm leading-relaxed">
                &quot;Upload once. Adapt and publish everywhere.&quot;
              </p>
              <p className="font-sans text-xs text-ink-secondary max-w-sm leading-relaxed">
                A creative publishing desk engineered for creators, social media managers, and editorial teams. Bangkok, Thailand (UTC+7).
              </p>
            </div>

            {/* Links Columns (7 cols) */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-xs">
              <div className="space-y-3">
                <span className="font-bold text-brand-indigo uppercase text-[10px] tracking-wider block">
                  EXPLORE
                </span>
                <ul className="space-y-2 text-ink-secondary">
                  <li><a href="#hero" className="hover:text-ink-primary transition-colors">Front Page</a></li>
                  <li><a href="#the-problem" className="hover:text-ink-primary transition-colors">The Problem</a></li>
                  <li><a href="#how-it-works" className="hover:text-ink-primary transition-colors">How It Works</a></li>
                  <li><a href="#press-studio" className="hover:text-ink-primary transition-colors">Press Studio</a></li>
                  <li><a href="#workspace-tour" className="hover:text-ink-primary transition-colors">Workspace Tour</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="font-bold text-brand-indigo uppercase text-[10px] tracking-wider block">
                  RESOURCES
                </span>
                <ul className="space-y-2 text-ink-secondary">
                  <li><Link href="/docs" className="hover:text-ink-primary transition-colors">Documentation</Link></li>
                  <li><Link href="/login" className="hover:text-ink-primary transition-colors">Sign In</Link></li>
                  <li><Link href="/register" className="hover:text-ink-primary transition-colors">Register Free Trial</Link></li>
                  <li><a href="#dispatch-board" className="hover:text-ink-primary transition-colors">Dispatch Board</a></li>
                  <li><a href="#dream-pass" className="hover:text-ink-primary transition-colors">Dream Pass</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="font-bold text-brand-indigo uppercase text-[10px] tracking-wider block">
                  TRUST & COMPLIANCE
                </span>
                <ul className="space-y-2 text-ink-secondary">
                  <li><Link href="/docs" className="hover:text-ink-primary transition-colors">PDPA & Privacy</Link></li>
                  <li><Link href="/docs" className="hover:text-ink-primary transition-colors">Terms of Service</Link></li>
                  <li><span className="text-emerald-700">✓ Meta Policy Safe</span></li>
                  <li><span className="text-emerald-700">✓ YouTube API Compliant</span></li>
                  <li><span className="text-brand-indigo font-bold">AES-256 GCM Vault</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border-rule/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ink-secondary">
            <div>
              © 2026 MULTIPOST • Dream Press Publishing Desk • All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Editorial Gazette Edition</span>
              <span>•</span>
              <span className="text-ink-primary font-semibold">Bangkok Studio</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
