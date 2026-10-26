'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  CheckCheck,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  MoveHorizontal
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
// RETRO-EDITORIAL AUDIO SYNTHESIZER (Pure Web Audio API — Zero External Files)
// =============================================================================
const playChimeSound = (soundEnabled: boolean) => {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic Coin Chime (D5 -> A5 -> D6)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.16); // D6

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.start(now);
    osc.stop(now + 0.38);
  } catch (e) {
    // AudioContext blocked by browser autoplay policy
  }
};

const playStampThud = (soundEnabled: boolean) => {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Heavy Wax Stamp Thud (Low frequency pitch drop)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    osc.start(now);
    osc.stop(now + 0.26);
  } catch (e) {}
};

// =============================================================================
// COLLECTIBLE PRESS COIN SVG WITH 3D FLIP CAPABILITY
// =============================================================================
interface PressCoinIconProps {
  size?: number;
  className?: string;
  isFlipped?: boolean;
}

const PressCoinIcon: React.FC<PressCoinIconProps> = ({ size = 28, className = '', isFlipped = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 transition-transform duration-500 ${className} ${isFlipped ? 'scale-x-[-1]' : ''}`}
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
    <circle cx="50" cy="50" r="47" fill="url(#coinRim)" stroke="#78350F" strokeWidth="2.5" />
    {/* Coin Inner Face */}
    <circle cx="50" cy="50" r="42" fill="url(#coinGold)" />
    <circle cx="50" cy="50" r="42" fill="url(#coinShine)" />
    {/* Beaded Edge Ring */}
    <circle cx="50" cy="50" r="37" fill="none" stroke="#713F12" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.65" />
    
    {!isFlipped ? (
      <>
        {/* Front Emblem: Press Star & Fountain Quill */}
        <path
          d="M50 24L53.5 35.5L65.5 35.5L56 42.5L59.5 54L50 47L40.5 54L44 42.5L34.5 35.5L46.5 35.5L50 24Z"
          fill="#78350F"
          opacity="0.9"
        />
        <path
          d="M50 46L46 68L50 78L54 68L50 46Z"
          fill="#78350F"
          opacity="0.95"
        />
        <line x1="50" y1="56" x2="50" y2="72" stroke="#FDE047" strokeWidth="1.5" />
        <text x="50" y="88" textAnchor="middle" fill="#713F12" fontSize="7" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
          RETZPOST
        </text>
      </>
    ) : (
      <>
        {/* Back Crest: Bangkok Editorial Seal & Crown */}
        <circle cx="50" cy="50" r="26" fill="none" stroke="#78350F" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M40 42L50 32L60 42L50 52Z" fill="#78350F" opacity="0.9" />
        <text x="50" y="66" textAnchor="middle" fill="#713F12" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
          BANGKOK
        </text>
        <text x="50" y="74" textAnchor="middle" fill="#78350F" fontSize="5.5" fontFamily="monospace" fontWeight="bold">
          EST. 2026
        </text>
      </>
    )}
  </svg>
);

export default function LandingPage() {
  // ===========================================================================
  // INTERACTIVE DEMO STATE (STRICTLY IN-MEMORY REACT STATE — ZERO PERSISTENCE)
  // ===========================================================================
  const [coins, setCoins] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCoinFlipped, setIsCoinFlipped] = useState<boolean>(false);

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

  // Floating Coin Particles Effect
  const [floatingCoinFx, setFloatingCoinFx] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  // Task 1: Selected Platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['YT', 'IG']);
  // Task 2: Caption Tone & Live Customization
  const [activeTone, setActiveTone] = useState<'HOOK' | 'BROADSHEET' | 'LUXURY'>('HOOK');
  const [customCaption, setCustomCaption] = useState<string>(
    '⚡ Stop exporting 5 versions! Dream Press transforms 16:9 master footage into 9:16 vertical stories with zero quality loss.'
  );
  // Task 3: Scheduled Golden Slot
  const [selectedSlot, setSelectedSlot] = useState<'LUNCH' | 'EVENING' | 'NIGHT'>('EVENING');
  // Task 4: Aspect Ratio AI Rescue Simulation
  const [isScanningRescue, setIsScanningRescue] = useState<boolean>(false);
  const [isFailureResolved, setIsFailureResolved] = useState<boolean>(false);

  // Section 02: Interactive Before / After Split Comparison Slider (0 to 100%)
  const [problemSliderPos, setProblemSliderPos] = useState<number>(50);

  // Section 03: Interactive Workflow Step
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  // Section 06: Workspace Tour active tab
  const [activeTourTab, setActiveTourTab] = useState<
    'dashboard' | 'library' | 'composer' | 'queue' | 'calendar' | 'analytics'
  >('dashboard');

  // Section 09: Dispatch Board Edge-Case Retry simulation
  const [xRetryState, setXRetryState] = useState<'FAILED' | 'RETRYING' | 'RECOVERED'>('FAILED');

  // Section 10: Dream Pass State
  const [isPassRedeemed, setIsPassRedeemed] = useState<boolean>(false);
  const [isRedeemingAnimation, setIsRedeemingAnimation] = useState<boolean>(false);

  // Hero Preview Ratio Switcher
  const [heroRatio, setHeroRatio] = useState<'16:9' | '9:16'>('16:9');
  // Hero Interactive Stamp Counter
  const [heroStamps, setHeroStamps] = useState<{ x: number; y: number; id: number }[]>([]);

  // Section References for Smooth Navigation
  const pressStudioRef = useRef<HTMLDivElement>(null);
  const workspaceTourRef = useRef<HTMLDivElement>(null);
  const dreamPassRef = useRef<HTMLDivElement>(null);

  // Helper to trigger floating celebration coin particles & play audio
  const triggerCoinCelebration = (amount: number, label: string) => {
    playChimeSound(soundEnabled);
    const newParticle = {
      id: Date.now(),
      text: `+${amount} Coins: ${label}`,
      x: Math.random() * 40 - 20,
      y: -20,
    };
    setFloatingCoinFx((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setFloatingCoinFx((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 2800);
  };

  // Award coins strictly once per session (prevents duplicate farming)
  const awardCoins = (amount: number, label: string, taskKey: keyof typeof completedTasks) => {
    if (completedTasks[taskKey]) return; // Strictly no double farming

    setCoins((prev) => Math.min(100, prev + amount));
    setCompletedTasks((prev) => ({ ...prev, [taskKey]: true }));
    triggerCoinCelebration(amount, label);
  };

  // Task 1: Toggle Platform
  const togglePlatform = (id: string) => {
    const next = selectedPlatforms.includes(id)
      ? selectedPlatforms.filter((p) => p !== id)
      : [...selectedPlatforms, id];
    setSelectedPlatforms(next);

    if (next.length >= 2 && !completedTasks.destinations) {
      awardCoins(20, '2 Channels Picked', 'destinations');
    }
  };

  // Task 2: Tone Selection
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
      awardCoins(25, 'Edition Caption Tailored', 'caption');
    }
  };

  // Task 3: Schedule Slot
  const handleSelectSlot = (slot: 'LUNCH' | 'EVENING' | 'NIGHT') => {
    setSelectedSlot(slot);
    if (!completedTasks.schedule) {
      awardCoins(25, 'Bangkok Golden Slot Confirmed', 'schedule');
    }
  };

  // Task 4: AI Safe-Zone Rescue with Animated Scanline
  const handleTriggerRescue = () => {
    if (isScanningRescue || isFailureResolved) return;
    setIsScanningRescue(true);

    setTimeout(() => {
      setIsScanningRescue(false);
      setIsFailureResolved(true);
      if (!completedTasks.rescue) {
        awardCoins(30, 'Aspect Ratio Rescued', 'rescue');
      }
    }, 1200);
  };

  // Reset Playground
  const handleResetDemo = () => {
    setCoins(0);
    setCompletedTasks({
      destinations: false,
      caption: false,
      schedule: false,
      rescue: false,
    });
    setSelectedPlatforms(['YT']);
    setIsFailureResolved(false);
    setIsScanningRescue(false);
    setIsPassRedeemed(false);
    setHeroStamps([]);
    triggerCoinCelebration(0, 'Playground Reset');
  };

  // Section 09: Isolated Partial Retry
  const handleRetryX = () => {
    setXRetryState('RETRYING');
    setTimeout(() => {
      setXRetryState('RECOVERED');
      playChimeSound(soundEnabled);
    }, 1100);
  };

  // Section 10: Redeem Ticket Action with Stamp Slam
  const handleRedeemTicket = () => {
    if (coins < 100 || isPassRedeemed) return;
    setIsRedeemingAnimation(true);
    playStampThud(soundEnabled);

    setTimeout(() => {
      setIsRedeemingAnimation(false);
      setIsPassRedeemed(true);
      playChimeSound(soundEnabled);
    }, 600);
  };

  // Hero Desk Stamp Interactive Toy
  const handleStampHeroDesk = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    playStampThud(soundEnabled);
    setHeroStamps((prev) => [...prev.slice(-4), { x, y, id: Date.now() }]);
  };

  const isPassUnlocked = coins >= 100;

  return (
    <div className="min-h-screen bg-paper-canvas text-ink-primary font-sans selection:bg-brand-indigo selection:text-white flex flex-col antialiased relative overflow-x-hidden">
      {/* 1. PUBLIC EDITORIAL HEADER */}
      <PublicHeader />

      {/* FLOATING CELEBRATION COIN FX PARTICLES */}
      <div className="fixed top-24 right-8 z-50 pointer-events-none space-y-2">
        {floatingCoinFx.map((fx) => (
          <div
            key={fx.id}
            className="animate-in fade-in slide-in-from-bottom-6 duration-500 p-2.5 px-4 bg-paper-raised/95 backdrop-blur-md border-2 border-amber-400 rounded-full shadow-2xl flex items-center gap-2 text-xs font-mono font-bold text-ink-primary"
          >
            <PressCoinIcon size={20} />
            <span className="text-amber-800">{fx.text}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          </div>
        ))}
      </div>

      {/* FLOATING REWARD HUD (Sticky Pill showing live Press Coin balance & Audio Toggle) */}
      <div className="fixed bottom-5 right-5 z-40 transition-all duration-300">
        <div className="p-1.5 pl-3.5 pr-2 bg-paper-raised/95 backdrop-blur-md border-2 border-border-rule rounded-full shadow-2xl flex items-center gap-3 ring-1 ring-border-rule/40 hover:scale-[1.02] transition-transform">
          {/* Sound Mute/Unmute Toggle Button */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-7 h-7 rounded-full bg-paper-subtle hover:bg-paper-canvas flex items-center justify-center text-ink-secondary hover:text-ink-primary border border-border-rule transition-colors cursor-pointer"
            title={soundEnabled ? 'Disable retro chime effects' : 'Enable retro chime effects'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-700" /> : <VolumeX className="w-3.5 h-3.5 text-ink-muted" />}
          </button>

          {/* 3D Flippable Coin */}
          <button
            type="button"
            onClick={() => {
              setIsCoinFlipped(!isCoinFlipped);
              playChimeSound(soundEnabled);
            }}
            className="cursor-pointer"
            title="Click to flip Press Coin!"
          >
            <PressCoinIcon size={26} isFlipped={isCoinFlipped} />
          </button>

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

          <button
            onClick={() => {
              if (isPassUnlocked) {
                dreamPassRef.current?.scrollIntoView({ behavior: 'smooth' });
              } else {
                pressStudioRef.current?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`py-1.5 px-3.5 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPassUnlocked
                ? 'bg-accent-terracotta text-white hover:bg-accent-terracotta/90 shadow-md animate-bounce ring-2 ring-amber-400'
                : 'bg-brand-indigo text-white hover:bg-brand-indigo-hover'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isPassUnlocked ? 'Forge Dream Pass! ✦' : 'Play & Earn'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 01 — HERO: THE FRONT PAGE (TACTILE DESK WITH INTERACTIVE STAMPS) */}
      {/* ========================================================================= */}
      <section id="hero" className="relative pt-8 pb-16 md:pt-12 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-10 -z-10 opacity-5 pointer-events-none font-serif text-[180px] font-bold select-none text-ink-primary">
          PRESS
        </div>

        {/* Real-time Ticker Tape Bar with Live Transmission */}
        <div className="flex items-center justify-between border-b-2 border-border-rule pb-2.5 mb-8 text-[11px] font-mono text-ink-secondary bg-paper-raised/60 p-2 rounded-xl border border-border-rule/80">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-bold uppercase tracking-widest text-brand-indigo flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              MULTIPOST GAZETTE
            </span>
            <span>•</span>
            <span className="truncate">LIVE WIRE: BANGKOK PUBLISHING DESK (UTC+7)</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline font-mono text-[10px] text-ink-secondary">TRANSMISSION: READY</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 font-bold border border-emerald-500/30 text-[10px]">
              99.98% SLA
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Broadsheet Editorial Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 relative">
            {/* Washi Tape Strip on Top Left */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#C98836]/15 border-t border-b border-[#C98836]/40 text-xs font-mono text-amber-900 rotate-[-1.5deg] shadow-2xs">
              <Sticker name="press-monogram-seal" size="xs" inline />
              <span className="font-bold tracking-wider uppercase">THE CREATOR&apos;S PUBLISHING DESK</span>
            </div>

            <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-ink-primary leading-[1.08] tracking-tight">
              One story. <br />
              <span className="italic font-normal text-brand-indigo underline decoration-amber-400 decoration-wavy decoration-2">Everywhere.</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl">
              Create once, customize for every channel, and keep your publishing workflow beautifully organized. Upload master media, tailor platform-specific safe zones and captions, and dispatch with millisecond precision across YouTube, TikTok, Instagram, Facebook, X, and Lemon8.
            </p>

            {/* Dual CTAs + Playful Hint */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  pressStudioRef.current?.scrollIntoView({ behavior: 'smooth' });
                  playChimeSound(soundEnabled);
                }}
                className="py-3.5 px-6 rounded-editorial bg-brand-indigo hover:bg-brand-indigo-hover text-white font-semibold flex items-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer text-sm group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Try the Interactive Demo</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-400 text-amber-900 font-bold text-[10px]">
                  +100 Coins
                </span>
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

            {/* Sticky Note Editorial Pin */}
            <div className="inline-flex items-center gap-2 p-2 px-3 rounded-lg bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-mono shadow-xs rotate-[1deg]">
              <span className="text-sm">📌</span>
              <span className="font-semibold">Note to Editor:</span>
              <span className="text-amber-800">Complete the 4 tasks below to unlock your physical 7-Day Dream Pass!</span>
            </div>

            {/* Trust Stamps Row */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-[11px] font-mono text-ink-secondary border-t border-border-rule/80">
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

          {/* Right Hero Tactile Desk Composition (5 cols) with Click-to-Stamp Feature */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* The Tactile Desk Paper Card */}
            <div 
              onClick={handleStampHeroDesk}
              className="w-full max-w-md bg-paper-raised border-2 border-border-rule rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-4 cursor-crosshair transform hover:-translate-y-1 transition-all duration-300 select-none"
              title="Click anywhere inside to stamp the editorial desk!"
            >
              {/* Dynamic Ink Stamps placed by visitor clicks */}
              {heroStamps.map((s) => (
                <div
                  key={s.id}
                  style={{ left: s.x - 24, top: s.y - 24 }}
                  className="absolute pointer-events-none z-30 animate-in zoom-in-50 duration-200"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-accent-terracotta/70 flex items-center justify-center text-accent-terracotta font-mono font-bold text-[9px] rotate-[-12deg] bg-accent-terracotta/10 shadow-xs backdrop-blur-2xs">
                    APPROVED
                  </div>
                </div>
              ))}

              {/* Scalloped Notches on Left and Right */}
              <div className="absolute top-1/2 -left-4 w-8 h-8 rounded-full bg-paper-canvas border border-border-rule shadow-inner -translate-y-1/2" />
              <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-paper-canvas border border-border-rule shadow-inner -translate-y-1/2" />

              {/* Pass Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-border-rule/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-brand-indigo text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs">
                    RP
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm tracking-tight text-ink-primary">
                      MULTIPOST DISPATCH PASS
                    </h3>
                    <p className="text-[9px] font-mono text-ink-secondary">
                      № DP-2026-HERO-001 • BANGKOK DESK
                    </p>
                  </div>
                </div>

                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 text-[9px] font-mono font-bold">
                  ● ACTIVE SPEC
                </div>
              </div>

              {/* Interactive Aspect Ratio Slider in Hero */}
              <div className="p-2 bg-paper-canvas rounded-xl border border-border-rule space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-ink-secondary font-bold">INTERACTIVE RATIO ADAPTATION:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHeroRatio('16:9');
                        playChimeSound(soundEnabled);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        heroRatio === '16:9' ? 'bg-brand-indigo text-white' : 'text-ink-secondary hover:text-ink-primary'
                      }`}
                    >
                      16:9 Widescreen
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHeroRatio('9:16');
                        playChimeSound(soundEnabled);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        heroRatio === '9:16' ? 'bg-brand-indigo text-white' : 'text-ink-secondary hover:text-ink-primary'
                      }`}
                    >
                      9:16 Vertical Reel
                    </button>
                  </div>
                </div>

                {/* Simulated Visual Content with Animated Aspect Guidelines */}
                <div className="aspect-[16/10] bg-paper-subtle rounded-xl border border-border-rule p-3 flex flex-col justify-between relative overflow-hidden transition-all duration-500">
                  <div className="flex items-center justify-between text-[9px] font-mono text-ink-secondary">
                    <span>CANVAS: 4K MASTER PROBE</span>
                    <span className="text-brand-indigo font-bold">
                      {heroRatio === '16:9' ? '1920 × 1080 (YouTube/FB)' : '1080 × 1920 (Reels/TikTok)'}
                    </span>
                  </div>

                  <div className="my-auto p-2 bg-paper-canvas rounded-lg border border-border-rule text-center relative overflow-hidden">
                    <div className="text-[11px] font-serif font-bold text-ink-primary">
                      &quot;Episode 04: The Bangkok Studio Dispatch&quot;
                    </div>
                    <div className="text-[9px] font-mono text-emerald-700 font-semibold mt-0.5">
                      ✓ AI Safe-Zone Clearance: Top 15% • Bottom 25%
                    </div>
                  </div>

                  {/* Target Platform Status Chips */}
                  <div className="grid grid-cols-4 gap-1.5">
                    <div className="p-1 bg-paper-canvas rounded border border-border-rule text-center shadow-2xs">
                      <YouTubeLogo size={12} className="mx-auto" />
                      <span className="text-[8px] font-mono block font-bold text-ink-primary">YT 4K</span>
                    </div>
                    <div className="p-1 bg-paper-canvas rounded border border-border-rule text-center shadow-2xs">
                      <InstagramLogo size={12} className="mx-auto" />
                      <span className="text-[8px] font-mono block font-bold text-ink-primary">IG Reel</span>
                    </div>
                    <div className="p-1 bg-paper-canvas rounded border border-border-rule text-center shadow-2xs">
                      <TikTokLogo size={12} className="mx-auto" />
                      <span className="text-[8px] font-mono block font-bold text-ink-primary">TikTok</span>
                    </div>
                    <div className="p-1 bg-paper-canvas rounded border border-border-rule text-center shadow-2xs">
                      <FacebookLogo size={12} className="mx-auto" />
                      <span className="text-[8px] font-mono block font-bold text-ink-primary">FB Page</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Footer Perforation & Stamp Trigger */}
              <div className="pt-2 border-t-2 border-dashed border-border-rule/80 flex items-center justify-between text-xs font-mono text-ink-secondary">
                <span className="text-[10px] uppercase font-bold text-ink-primary">
                  BANGKOK PEAK: 07:30 PM
                </span>
                <span className="text-[10px] font-mono text-accent-terracotta font-bold flex items-center gap-1">
                  <Sticker name="approved-seal" size="xs" inline />
                  CLICK DESK TO STAMP
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
      {/* SECTION 02 — THE PUBLISHING PROBLEM (INTERACTIVE BEFORE/AFTER SLIDER)     */}
      {/* ========================================================================= */}
      <section id="the-problem" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-accent-terracotta/10 text-accent-terracotta text-xs font-mono font-bold uppercase tracking-wider">
            <span>02 / THE PUBLISHING PROBLEM</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-ink-primary">
            The Cost of Fragmented Publishing
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
            Drag the comparison slider below to inspect the real difference between traditional manual publishing and the unified Dream Press workflow.
          </p>
        </div>

        {/* Interactive Comparison Range Slider */}
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="text-accent-terracotta flex items-center gap-1">
              <span>← The Old Fragmented Way</span>
            </span>
            <span className="text-ink-secondary text-[11px] font-normal flex items-center gap-1">
              <MoveHorizontal className="w-3.5 h-3.5" /> Drag Slider
            </span>
            <span className="text-emerald-700 flex items-center gap-1">
              <span>The Dream Press Way →</span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={problemSliderPos}
            onChange={(e) => setProblemSliderPos(Number(e.target.value))}
            className="w-full h-2 bg-paper-subtle rounded-lg appearance-none cursor-pointer accent-brand-indigo"
          />
        </div>

        {/* Responsive Dual Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: The Old Way (Opacified by slider) */}
          <div 
            style={{ opacity: Math.max(0.2, (100 - problemSliderPos) / 50) }}
            className="p-6 sm:p-8 rounded-3xl border-2 border-accent-terracotta/40 bg-accent-terracotta/5 space-y-6 relative overflow-hidden transition-opacity duration-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-accent-terracotta/20">
              <span className="px-2.5 py-1 rounded bg-accent-terracotta/15 text-accent-terracotta font-mono text-xs font-bold uppercase">
                THE OLD WAY
              </span>
              <span className="font-mono text-xs text-accent-terracotta font-bold">
                ⚠️ 15+ Hours Wasted Weekly
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
                  Exporting 16:9, 1:1, and 9:16 separately, cluttering local drives with redundant video renders.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-terracotta/20 text-accent-terracotta font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</span>
                <div>
                  <b className="text-ink-primary block font-mono text-xs uppercase">Repetitive Copy-Pasting</b>
                  Jumping across 5 to 7 browser tabs, manually copying captions, hashtags, and links over and over.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-terracotta/20 text-accent-terracotta font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</span>
                <div>
                  <b className="text-ink-primary block font-mono text-xs uppercase">Silent Publishing Failures</b>
                  One channel fails silently due to an expired OAuth token while the team assumes the campaign went live.
                </div>
              </li>
            </ul>
          </div>

          {/* Right Column: The Dream Press Way (Opacified by slider) */}
          <div 
            style={{ opacity: Math.max(0.2, problemSliderPos / 50) }}
            className="p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/50 bg-emerald-500/5 space-y-6 relative overflow-hidden transition-opacity duration-200 shadow-md"
          >
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
              <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-800 font-mono text-xs font-bold uppercase">
                THE DREAM PRESS WAY
              </span>
              <span className="font-mono text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Synchronized Desk
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
                onClick={() => {
                  setActiveWorkflowStep(item.step);
                  playChimeSound(soundEnabled);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer space-y-1 ${
                  activeWorkflowStep === item.step
                    ? 'bg-paper-canvas border-brand-indigo shadow-md ring-2 ring-brand-indigo/10 scale-[1.02]'
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
          <div className="p-6 sm:p-8 bg-paper-canvas border-2 border-border-rule rounded-3xl shadow-lg space-y-4">
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
      {/* SECTION 04 — INTERACTIVE PRESS STUDIO (PLAYFUL GAMEPLAY PLAYGROUND)       */}
      {/* ========================================================================= */}
      <section ref={pressStudioRef} id="press-studio" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-border-rule pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-brand-indigo font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
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

            <div className="p-2 px-3.5 bg-paper-raised border-2 border-amber-400/90 rounded-editorial shadow-xs flex items-center gap-2.5">
              <PressCoinIcon size={22} />
              <div className="leading-tight">
                <span className="font-mono text-sm font-bold text-ink-primary">
                  {coins} <span className="text-[10px] text-ink-secondary font-normal">/ 100 Coins</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 INTERACTIVE PLAYFUL TASK CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TASK 01: CHOOSE YOUR DESTINATIONS (+20 COINS) */}
          <div className={`p-6 rounded-3xl border-2 transition-all duration-300 space-y-4 bg-paper-raised relative ${
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
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition-transform ${
                completedTasks.destinations ? 'bg-emerald-500/15 text-emerald-800 scale-105' : 'bg-amber-400/15 text-amber-800'
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
                    className={`p-2.5 rounded-editorial border text-left transition-all cursor-pointer flex items-center justify-between active:scale-95 ${
                      isSelected
                        ? 'bg-brand-indigo/10 border-brand-indigo text-brand-indigo font-bold shadow-xs'
                        : 'bg-paper-canvas border-border-rule text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <IconComponent size={14} className="shrink-0" />
                      <span className="text-xs truncate">{p.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-indigo shrink-0 animate-in zoom-in-50" />}
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
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition-transform ${
                completedTasks.caption ? 'bg-emerald-500/15 text-emerald-800 scale-105' : 'bg-amber-400/15 text-amber-800'
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
                  className={`py-1 px-3 rounded-full border transition-all cursor-pointer text-xs active:scale-95 ${
                    activeTone === t.id
                      ? 'bg-brand-indigo text-white font-bold border-brand-indigo shadow-xs'
                      : 'bg-paper-canvas text-ink-secondary hover:text-ink-primary border-border-rule'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Live Typing Preview Caption Box */}
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
                    awardCoins(25, 'Edition Caption Tailored', 'caption');
                  }
                }}
                rows={2}
                className="w-full p-2.5 bg-paper-canvas rounded-editorial border border-border-rule text-xs font-sans text-ink-primary leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-indigo"
              />
            </div>
          </div>

          {/* TASK 03: SCHEDULE YOUR DISPATCH WITH DYNAMIC SKY GLOW (+25 COINS) */}
          <div className={`p-6 rounded-3xl border-2 transition-all duration-300 space-y-4 ${
            selectedSlot === 'LUNCH'
              ? 'bg-gradient-to-br from-amber-500/10 to-paper-raised'
              : selectedSlot === 'EVENING'
              ? 'bg-gradient-to-br from-orange-500/10 via-accent-terracotta/5 to-paper-raised'
              : 'bg-gradient-to-br from-indigo-950/10 via-brand-indigo/5 to-paper-raised'
          } ${
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
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition-transform ${
                completedTasks.schedule ? 'bg-emerald-500/15 text-emerald-800 scale-105' : 'bg-amber-400/15 text-amber-800'
              }`}>
                {completedTasks.schedule ? '✓ Completed (+25 Coins)' : '+25 Press Coins'}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              Confirm a high-performing audience window to schedule publishing (watch the dynamic sky tone change):
            </p>

            <div className="space-y-2 text-xs font-mono">
              {[
                { id: 'LUNCH', time: '11:45 AM', label: 'Bangkok Lunch Peak (Midday Break)', boost: '2.4x Reach', icon: Sun },
                { id: 'EVENING', time: '07:30 PM', label: 'Prime Commute & Reel Window', boost: '3.1x Viral Boost', icon: Clock },
                { id: 'NIGHT', time: '09:15 PM', label: 'Night Owl Leisure Feed', boost: '1.9x Clicks', icon: Moon },
              ].map((s) => {
                const isSelected = selectedSlot === s.id;
                const SlotIcon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSlot(s.id as any)}
                    className={`w-full p-2.5 rounded-editorial border text-left transition-all cursor-pointer flex items-center justify-between active:scale-98 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-paper-canvas border-border-rule text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <SlotIcon className="w-4 h-4 text-amber-600" />
                      <span>{s.time}</span>
                      <span className="text-ink-secondary text-[11px] hidden sm:inline">— {s.label}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-300 text-amber-950 text-[10px] font-bold">
                      {s.boost}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TASK 04: RESCUE A FAILED POST WITH ANIMATED LASER SCANLINE (+30 COINS) */}
          <div className={`p-6 rounded-3xl border-2 transition-all duration-300 space-y-4 bg-paper-raised relative overflow-hidden ${
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
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition-transform ${
                completedTasks.rescue ? 'bg-emerald-500/15 text-emerald-800 scale-105' : 'bg-amber-400/15 text-amber-800'
              }`}>
                {completedTasks.rescue ? '✓ Completed (+30 Coins)' : '+30 Press Coins'}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              Inspect a simulated aspect ratio mismatch and trigger automated AI Safe-Zone recovery:
            </p>

            {/* Visual Simulated Crop Box with Scanline */}
            <div className="p-3 bg-paper-canvas rounded-xl border border-border-rule relative overflow-hidden text-center min-h-[90px] flex flex-col justify-center">
              {isScanningRescue && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-md top-1/2 -translate-y-1/2" />
              )}
              
              {!isFailureResolved ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-accent-terracotta font-mono font-bold text-xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Meta Graph API 400: Aspect Ratio Mismatch</span>
                  </div>
                  <p className="text-[11px] text-ink-secondary font-mono">
                    Input: 1:1 Square • Required: 9:16 Vertical Reel
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-mono font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Framed to 1080 × 1920 with 15% Top / 25% Bottom Safe-Margins!</span>
                  </div>
                  <p className="text-[10px] text-emerald-800 font-mono">
                    ✓ Clean Safe-Zone • Zero Obstruction from Action Buttons
                  </p>
                </div>
              )}
            </div>

            {!isFailureResolved ? (
              <button
                type="button"
                onClick={handleTriggerRescue}
                disabled={isScanningRescue}
                className="w-full py-2.5 px-4 rounded bg-accent-terracotta text-white font-bold hover:bg-accent-terracotta/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-xs active:scale-98"
              >
                <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isScanningRescue ? 'animate-spin' : ''}`} />
                <span>{isScanningRescue ? 'Scanning & Re-framing Safe-Zone...' : '⚡ 1-Click AI Safe-Zone Rescue'}</span>
              </button>
            ) : (
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-center font-mono text-[11px] text-emerald-800 font-bold">
                ✓ Post Successfully Recovered & Validated!
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS UNLOCK BANNER */}
        <div className="p-6 sm:p-8 rounded-3xl border-2 border-border-rule bg-paper-raised shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setIsCoinFlipped(!isCoinFlipped);
                playChimeSound(soundEnabled);
              }}
              className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-700 flex items-center justify-center shrink-0 border border-amber-400/40 shadow-inner cursor-pointer hover:scale-105 transition-transform"
              title="Click to flip token!"
            >
              <PressCoinIcon size={38} isFlipped={isCoinFlipped} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-ink-primary">
                  Interactive Progress: {coins} / 100 Press Coins
                </h3>
                {isPassUnlocked && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-500/30 animate-pulse">
                    READY TO FORGE
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
              onClick={() => {
                dreamPassRef.current?.scrollIntoView({ behavior: 'smooth' });
                playChimeSound(soundEnabled);
              }}
              disabled={!isPassUnlocked}
              className={`py-3.5 px-6 rounded-editorial text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isPassUnlocked
                  ? 'bg-accent-terracotta text-white hover:bg-accent-terracotta/90 shadow-lg animate-bounce'
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
      {/* SECTION 05 — PRESS COINS (COLLECTIBLE 3D FLIPPABLE TOKEN SHOWCASE)        */}
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
              Press Coins represent verified milestones in the Dream Press ecosystem. Click the token below to flip and inspect the reverse seal!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Collectible 3D Flippable Coin Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-paper-canvas rounded-3xl border-2 border-border-rule text-center space-y-4">
              <button
                type="button"
                onClick={() => {
                  setIsCoinFlipped(!isCoinFlipped);
                  playChimeSound(soundEnabled);
                }}
                className="relative cursor-pointer group"
                title="Click to flip coin 360°"
              >
                <div className="w-40 h-40 rounded-full bg-amber-400/10 flex items-center justify-center p-2 shadow-inner ring-4 ring-amber-400/20 group-hover:scale-105 transition-transform duration-300">
                  <PressCoinIcon size={135} isFlipped={isCoinFlipped} />
                </div>
                <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold shadow-md">
                  {isCoinFlipped ? 'BANGKOK CREST' : 'PRESS STAR'} ↻
                </div>
              </button>

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
                  completedTasks.destinations ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 font-bold' : 'bg-paper-raised border-border-rule text-ink-secondary'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${completedTasks.destinations ? 'text-emerald-700' : 'text-ink-muted'}`} />
                  <span>Choose Destinations (+20)</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  completedTasks.caption ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 font-bold' : 'bg-paper-raised border-border-rule text-ink-secondary'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${completedTasks.caption ? 'text-emerald-700' : 'text-ink-muted'}`} />
                  <span>Customize Edition (+25)</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  completedTasks.schedule ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 font-bold' : 'bg-paper-raised border-border-rule text-ink-secondary'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${completedTasks.schedule ? 'text-emerald-700' : 'text-ink-muted'}`} />
                  <span>Bangkok Slot (+25)</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  completedTasks.rescue ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 font-bold' : 'bg-paper-raised border-border-rule text-ink-secondary'
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
                onClick={() => {
                  setActiveTourTab(tab.id as any);
                  playChimeSound(soundEnabled);
                }}
                className={`py-2 px-3.5 rounded-editorial transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-brand-indigo text-white font-bold shadow-md scale-105'
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
        <div className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-3xl shadow-xl relative min-h-[420px]">
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
      {/* SECTION 10 — FINAL REWARD: THE 7-DAY DREAM PASS (STAMP SLAM & GLOW)      */}
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

        {/* THE HORIZONTAL VINTAGE EDITORIAL TICKET WITH HOLOGRAPHIC GLOW */}
        <div className={`rounded-3xl border-2 transition-all duration-500 relative overflow-hidden shadow-2xl ${
          isPassUnlocked
            ? 'bg-paper-canvas border-accent-terracotta/80 ring-4 ring-amber-400/40 shadow-amber-500/10'
            : 'bg-paper-raised border-border-rule opacity-90'
        } ${isRedeemingAnimation ? 'scale-98 rotate-[-0.5deg]' : ''}`}>
          
          {/* Perforated Notches on Left and Right ticket edges */}
          <div className="absolute top-1/2 -left-5 w-10 h-10 rounded-full bg-paper-canvas border-2 border-border-rule shadow-inner -translate-y-1/2" />
          <div className="absolute top-1/2 -right-5 w-10 h-10 rounded-full bg-paper-canvas border-2 border-border-rule shadow-inner -translate-y-1/2" />

          {/* Heavy Wax Seal Stamp Overlay when Redeemed */}
          {isPassRedeemed && (
            <div className="absolute top-8 right-12 z-30 pointer-events-none animate-in zoom-in-75 duration-300">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-accent-terracotta/90 flex flex-col items-center justify-center text-accent-terracotta font-mono font-bold text-xs rotate-[-15deg] bg-accent-terracotta/15 shadow-xl backdrop-blur-2xs">
                <span className="text-base">✓</span>
                <span>APPROVED</span>
                <span className="text-[8px]">PRESS DESK</span>
              </div>
            </div>
          )}

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
                  {isPassUnlocked ? '✦ UNLOCKED & FORGED' : '🔒 LOCKED (REQUIRES 100 COINS)'}
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

            {/* LOCKED vs UNLOCKED INTERACTION AREA WITH STAMP SOUND */}
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
                  onClick={() => {
                    pressStudioRef.current?.scrollIntoView({ behavior: 'smooth' });
                    playChimeSound(soundEnabled);
                  }}
                  className="py-2.5 px-5 rounded-editorial bg-brand-indigo text-white font-bold text-xs hover:bg-brand-indigo-hover transition-colors cursor-pointer"
                >
                  Jump to Press Studio (+{100 - coins} Coins Remaining) →
                </button>
              </div>
            ) : !isPassRedeemed ? (
              <div className="space-y-4 pt-2">
                <button
                  onClick={handleRedeemTicket}
                  className="w-full py-4 px-6 rounded-editorial bg-accent-terracotta hover:bg-accent-terracotta/90 text-white font-bold text-base shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.98] ring-2 ring-amber-400/50"
                >
                  <Sticker name="approved-seal" size="xs" inline />
                  <span>Redeem Dream Pass (Slam Wax Stamp & Validate Ticket)</span>
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
