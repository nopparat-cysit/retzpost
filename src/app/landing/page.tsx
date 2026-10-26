'use client';

import React, { useState, useRef } from 'react';
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
  Pause,
  Eye,
  EyeOff,
  Scissors,
  Check, 
  Zap, 
  Award, 
  Coins, 
  Ticket, 
  RotateCcw, 
  ChevronRight, 
  TrendingUp, 
  AlertCircle, 
  Lock, 
  Unlock, 
  Star, 
  Users, 
  LayoutGrid, 
  Calendar as CalendarIcon, 
  BarChart3, 
  RefreshCw, 
  FolderOpen, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  CheckCheck,
  Flame,
  Radio
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
// RETRO-EDITORIAL AUDIO SYNTHESIZER (Pure Web Audio API — Zero External Assets)
// =============================================================================
const playChimeSound = (soundEnabled: boolean) => {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.16); // D6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.start(now);
    osc.stop(now + 0.38);
  } catch (e) {}
};

const playStampThud = (soundEnabled: boolean) => {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

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
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="35%" stopColor="#FBC02D" />
        <stop offset="70%" stopColor="#E09F00" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
      <linearGradient id="coinRim" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <radialGradient id="coinShine" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.9" />
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
        <line x1="50" y1="56" x2="50" y2="72" stroke="#FFF176" strokeWidth="1.5" />
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

  // Floating Celebration Coin Particles
  const [floatingCoinFx, setFloatingCoinFx] = useState<{ id: number; text: string }[]>([]);

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

  // Section 02: Comparison View Mode
  const [problemViewMode, setProblemViewMode] = useState<'ALL' | 'CHAOS' | 'DREAM'>('ALL');

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

  // Hero Preview Ratio Switcher & Living Studio Controls
  const [heroRatio, setHeroRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isPlayingHero, setIsPlayingHero] = useState<boolean>(true);
  const [showHeroSafeZones, setShowHeroSafeZones] = useState<boolean>(true);
  const [heroScrubber, setHeroScrubber] = useState<number>(45);

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

  // Master Instant 100 Coins Claim Action ("รับ coin ได้เลย")
  const handleClaimAllCoins = () => {
    setCoins(100);
    setCompletedTasks({
      destinations: true,
      caption: true,
      schedule: true,
      rescue: true,
    });
    setIsFailureResolved(true);
    triggerCoinCelebration(100, 'Unlocked 100 Coins Instantly!');
    playChimeSound(soundEnabled);
    setTimeout(() => {
      dreamPassRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
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

  // Task 4: AI Safe-Zone Rescue
  const handleTriggerRescue = () => {
    if (isScanningRescue || isFailureResolved) return;
    setIsScanningRescue(true);

    setTimeout(() => {
      setIsScanningRescue(false);
      setIsFailureResolved(true);
      if (!completedTasks.rescue) {
        awardCoins(30, 'Aspect Ratio Rescued', 'rescue');
      }
    }, 1100);
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

  // Section 10: Redeem Ticket Action with Stamp
  const handleRedeemTicket = () => {
    if (coins < 100 || isPassRedeemed) return;
    setIsRedeemingAnimation(true);
    playStampThud(soundEnabled);

    setTimeout(() => {
      setIsRedeemingAnimation(false);
      setIsPassRedeemed(true);
      playChimeSound(soundEnabled);
    }, 500);
  };

  const isPassUnlocked = coins >= 100;

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#1A1A18] font-sans selection:bg-[#364165] selection:text-white flex flex-col antialiased relative overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* MASTER ATMOSPHERIC BACKGROUND (WARM OCHRE + LUXURY INDIGO HALOS + WATERMARK)*/}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Archival Cotton Dot Pattern & Subtle Column Rules */}
        <div className="absolute inset-0 dream-paper-texture opacity-80" />
        <div className="absolute inset-0 editorial-column-guides opacity-40" />
        
        {/* Background Editorial Watermark Typography */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-none select-none -z-10 text-center w-full overflow-hidden opacity-[0.038] leading-none">
          <div className="font-serif text-[17vw] font-bold tracking-tighter whitespace-nowrap text-[#1A1A18]">
            DREAM PRESS
          </div>
          <div className="font-mono text-xs sm:text-sm tracking-[0.45em] uppercase text-[#364165] mt-1">
            EST. 2026 • THE CREATOR&apos;S PUBLISHING DESK • BANGKOK ARCHIVE
          </div>
        </div>

        {/* Warm Ochre Sunlight Halo (Top-Left) */}
        <div className="absolute -top-40 -left-40 w-[850px] h-[850px] rounded-full bg-gradient-to-br from-amber-400/25 via-amber-200/10 to-transparent blur-3xl animate-glow-pulse" />
        
        {/* Royal Publishing Indigo Halo (Top-Right) */}
        <div className="absolute top-0 -right-48 w-[900px] h-[900px] rounded-full bg-gradient-to-bl from-[#364165]/25 via-[#364165]/8 to-transparent blur-3xl" />
        
        {/* Terracotta Wax-Seal Ambient Halo (Middle/Lower) */}
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 w-[1050px] h-[850px] rounded-full bg-gradient-to-tr from-[#A24836]/12 via-[#C98836]/8 to-transparent blur-3xl" />

        {/* Golden Dream Pass Ambient Halo (Bottom) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-gradient-to-t from-amber-300/15 via-amber-100/5 to-transparent blur-3xl" />
        
        {/* Broadsheet Desktop Margin Double Hairlines */}
        <div className="hidden 2xl:block absolute inset-y-0 left-12 w-px border-l border-black/[0.08]" />
        <div className="hidden 2xl:block absolute inset-y-0 left-14 w-px border-l border-black/[0.04]" />
        <div className="hidden 2xl:block absolute inset-y-0 right-12 w-px border-r border-black/[0.08]" />
        <div className="hidden 2xl:block absolute inset-y-0 right-14 w-px border-r border-black/[0.04]" />
      </div>

      {/* 1. PUBLIC EDITORIAL HEADER */}
      <PublicHeader />

      {/* FLOATING CELEBRATION COIN FX PARTICLES */}
      <div className="fixed top-24 right-8 z-50 pointer-events-none space-y-2">
        {floatingCoinFx.map((fx) => (
          <div
            key={fx.id}
            className="animate-in fade-in slide-in-from-bottom-6 duration-500 p-2.5 px-4 bg-white/95 backdrop-blur-md border-2 border-amber-400 rounded-full shadow-[0_10px_30px_rgba(202,138,4,0.3)] flex items-center gap-2 text-xs font-mono font-bold text-[#1A1A18]"
          >
            <PressCoinIcon size={20} />
            <span className="text-amber-800">{fx.text}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          </div>
        ))}
      </div>

      {/* FLOATING REWARD HUD (With Luxury Shimmering Instant 100 Coins Claim Button!) */}
      <div className="fixed bottom-5 right-5 z-40 transition-all duration-300">
        <div className="p-1.5 pl-3 pr-2 bg-white/95 backdrop-blur-md border border-black/10 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.12)] flex items-center gap-2.5 ring-1 ring-black/5 hover:scale-[1.02] transition-transform">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
            title={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-700" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
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

          {/* Balance display */}
          <div className="leading-none pr-1">
            <span className="font-mono text-xs font-bold text-[#1A1A18]">
              {coins} <span className="text-[10px] text-stone-500 font-normal">/ 100</span>
            </span>
            <div className="w-14 h-1 bg-stone-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 rounded-full"
                style={{ width: `${coins}%` }}
              />
            </div>
          </div>

          {/* Luxury Shimmering Instant Claim Button inside HUD */}
          {coins < 100 ? (
            <button
              onClick={handleClaimAllCoins}
              className="py-1.5 px-3.5 rounded-full text-[11px] font-mono font-bold animate-gold-shimmer text-amber-950 flex items-center gap-1.5 shadow-[0_4px_15px_rgba(245,158,11,0.45)] ring-2 ring-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Instant Unlock: Get all 100 coins immediately"
            >
              <Zap className="w-3 h-3 fill-amber-950" />
              <span>รับ 100 Coins ทันที</span>
            </button>
          ) : (
            <button
              onClick={() => dreamPassRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="py-1.5 px-3.5 rounded-full text-[11px] font-mono font-bold bg-[#A24836] text-white hover:bg-[#8e3f2f] shadow-md animate-bounce flex items-center gap-1.5 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>เปิดดูตั๋ว Dream Pass!</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 01 — HERO: THE FRONT PAGE (HIGH-CONTRAST MASTERPIECE)             */}
      {/* ========================================================================= */}
      <section id="hero" className="relative pt-8 pb-16 md:pt-14 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Ticker Tape Masthead Bar */}
        <div className="flex items-center justify-between border-b border-black/10 pb-2.5 mb-8 text-[11px] font-mono text-stone-600 bg-white/70 backdrop-blur-sm p-3 rounded-xl border shadow-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-bold uppercase tracking-widest text-[#364165] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              MULTIPOST GAZETTE
            </span>
            <span>•</span>
            <span className="truncate">BANGKOK PUBLISHING DESK (UTC+7)</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline font-mono text-[10px] text-stone-500">ENGINE STATUS: ACTIVE</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 font-bold border border-emerald-500/30 text-[10px]">
              99.98% SLA
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Broadsheet Editorial Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-500/30 text-xs font-mono text-amber-900 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-bold tracking-wider uppercase">THE CREATOR&apos;S PUBLISHING DESK</span>
            </div>

            <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-[#1A1A18] leading-[1.06] tracking-tight">
              One story. <br />
              <span className="italic font-normal text-[#364165] underline decoration-amber-400 decoration-wavy decoration-2">Everywhere.</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
              Create once, customize for every channel, and keep your publishing workflow beautifully organized. Upload master media, tailor platform-specific safe zones and captions, and dispatch with millisecond precision across YouTube, TikTok, Instagram, Facebook, X, and Lemon8.
            </p>

            {/* Primary & Secondary Hero CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => pressStudioRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="py-3.5 px-6 rounded-xl bg-[#364165] hover:bg-[#2B3452] text-white font-bold flex items-center gap-2 shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Try the Interactive Demo</span>
                <ArrowRight className="w-4 h-4 text-stone-300" />
              </button>

              <button
                type="button"
                onClick={() => workspaceTourRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="py-3.5 px-5 rounded-xl bg-white hover:bg-stone-50 text-[#1A1A18] border border-black/10 font-semibold flex items-center gap-2 shadow-xs transition-all hover:scale-102 active:scale-98 cursor-pointer text-sm"
              >
                <span>Explore MULTIPOST</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Trust Stamps Row */}
            <div className="pt-3 flex flex-wrap items-center gap-6 text-[11px] font-mono text-stone-600 border-t border-black/10">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>99.98% Dispatch SLA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#364165]" />
                <span>AES-256 GCM Vault</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Native Aspect Ratio Engine</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Luxury Obsidian Control Console (Living Publishing Desk) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Tactile Washi Tape Strip on Top Edge */}
            <div className="absolute -top-3.5 right-12 z-20 pointer-events-none drop-shadow-md rotate-[-2deg]">
              <Sticker name="washi-indigo" size="lg" />
            </div>

            <div className="w-full max-w-md bg-gradient-to-b from-[#181E2E] to-[#111520] text-white rounded-3xl p-6 shadow-[0_25px_60px_-10px_rgba(20,25,38,0.5)] border border-[#2E374D] space-y-4 animate-dream-float select-none ring-1 ring-white/10">
              
              {/* Console Masthead */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center font-serif font-bold text-xs shadow-sm">
                    RP
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                      <span>MULTIPOST CONTROL DESK</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    </h3>
                    <p className="text-[9px] font-mono text-stone-400">
                      № DP-2026-CONSOLE • STUDIO LIVE
                    </p>
                  </div>
                </div>

                <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>TRANSMITTING</span>
                </div>
              </div>

              {/* Interactive Viewport & Live Studio Controls */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                {/* Control Bar: Ratio + Safe Zones + Live Play State */}
                <div className="flex items-center justify-between text-[10px] font-mono gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setHeroRatio('16:9');
                        playChimeSound(soundEnabled);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        heroRatio === '16:9' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-stone-400 hover:text-white bg-white/5'
                      }`}
                    >
                      16:9 Wide
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHeroRatio('9:16');
                        playChimeSound(soundEnabled);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        heroRatio === '9:16' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-stone-400 hover:text-white bg-white/5'
                      }`}
                    >
                      9:16 Reel
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Safe-Zone Guide Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowHeroSafeZones(!showHeroSafeZones)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                        showHeroSafeZones ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-stone-400'
                      }`}
                      title="Toggle Safe-Zone Guides"
                    >
                      {showHeroSafeZones ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>Safe-Zone</span>
                    </button>

                    {/* Play/Pause Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsPlayingHero(!isPlayingHero)}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title={isPlayingHero ? 'Pause Master Stream' : 'Play Master Stream'}
                    >
                      {isPlayingHero ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Simulated Content Display Screen */}
                <div className={`bg-gradient-to-br from-stone-900 via-stone-950 to-black rounded-xl border border-white/15 p-3 flex flex-col justify-between relative overflow-hidden transition-all duration-500 ${
                  heroRatio === '16:9' ? 'aspect-[16/10]' : 'aspect-[9/12]'
                }`}>
                  {/* Dynamic Safe-Zone Overlays */}
                  {showHeroSafeZones && (
                    <div className="absolute inset-0 pointer-events-none p-2 flex flex-col justify-between z-10">
                      {/* Top Safe Area */}
                      <div className="border-b border-dashed border-cyan-400/50 pb-1 flex justify-between text-[8px] font-mono text-cyan-300">
                        <span>TOP MARGIN (15% SAFE)</span>
                        <span>UI HEADER FREE</span>
                      </div>
                      {/* Bottom Safe Area */}
                      <div className="border-t border-dashed border-amber-400/50 pt-1 flex justify-between text-[8px] font-mono text-amber-300">
                        <span>BOTTOM CAPTION (25% SAFE)</span>
                        <span>ENGAGEMENT DOCK</span>
                      </div>
                    </div>
                  )}

                  {/* Header Spec Tag */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 z-10">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      MASTER FEED: 4K PROBE
                    </span>
                    <span className="text-amber-300 font-bold">
                      {heroRatio === '16:9' ? '1920 × 1080 (YouTube/FB)' : '1080 × 1920 (Reels/TikTok)'}
                    </span>
                  </div>

                  {/* Video Center Graphic */}
                  <div className="my-auto p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center relative overflow-hidden z-10 shadow-lg">
                    <div className="text-xs font-serif font-bold text-white tracking-wide">
                      &quot;Episode 04: The Bangkok Studio Dispatch&quot;
                    </div>
                    
                    {/* Live Equalizer Spectrum */}
                    <div className="flex items-center justify-center gap-1 h-5 my-1.5">
                      <span className={`w-1 bg-amber-400 rounded-full ${isPlayingHero ? 'wave-bar-1' : 'h-1'}`} />
                      <span className={`w-1 bg-amber-300 rounded-full ${isPlayingHero ? 'wave-bar-2' : 'h-1.5'}`} />
                      <span className={`w-1 bg-emerald-400 rounded-full ${isPlayingHero ? 'wave-bar-3' : 'h-2'}`} />
                      <span className={`w-1 bg-cyan-400 rounded-full ${isPlayingHero ? 'wave-bar-4' : 'h-1.5'}`} />
                      <span className={`w-1 bg-indigo-400 rounded-full ${isPlayingHero ? 'wave-bar-5' : 'h-1'}`} />
                    </div>

                    <div className="text-[9px] font-mono text-emerald-300 font-semibold">
                      ✓ AI Safe-Zone Clearance: Top 15% • Bottom 25% Passed
                    </div>
                  </div>

                  {/* Scrubber & Timecode Bar */}
                  <div className="space-y-1 z-10 pt-1">
                    <div className="flex justify-between items-center text-[8px] font-mono text-stone-400">
                      <span>00:14.2 / 00:30.0</span>
                      <span>BITRATE: 45.2 Mbps</span>
                    </div>
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-300"
                        style={{ width: `${heroScrubber}%` }}
                      />
                    </div>
                  </div>

                  {/* Connected Endpoint Chips with Authentic Logos */}
                  <div className="grid grid-cols-4 gap-1.5 pt-2 z-10">
                    <div className="p-1 bg-white/10 rounded-lg border border-white/10 text-center shadow-2xs hover:bg-white/15 transition-colors">
                      <YouTubeLogo size={12} className="mx-auto" />
                      <span className="text-[8px] font-mono block font-bold text-white mt-0.5">YT 4K</span>
                    </div>
                    <div className="p-1 bg-white/10 rounded-lg border border-white/10 text-center shadow-2xs hover:bg-white/15 transition-colors">
                      <InstagramLogo size={12} className="mx-auto" />
                      <span className="text-[8px] font-mono block font-bold text-white mt-0.5">IG Reel</span>
                    </div>
                    <div className="p-1 bg-white/10 rounded-lg border border-white/10 text-center shadow-2xs hover:bg-white/15 transition-colors">
                      <TikTokLogo size={12} className="mx-auto" />
                      <span className="text-[8px] font-mono block font-bold text-white mt-0.5">TikTok</span>
                    </div>
                    <div className="p-1 bg-white/10 rounded-lg border border-white/10 text-center shadow-2xs hover:bg-white/15 transition-colors">
                      <FacebookLogo size={12} className="mx-auto" />
                      <span className="text-[8px] font-mono block font-bold text-white mt-0.5">FB Page</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Console Footer Perforation */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400">
                <span className="text-[10px] uppercase font-bold text-white">
                  BANGKOK PEAK: 07:30 PM
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1">
                  <Sticker name="approved-seal" size="xs" inline />
                  OFFICIAL ENGINE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM MARQUEE TICKER */}
      <section className="bg-white/80 backdrop-blur-sm border-y border-black/10 py-3.5 px-4 overflow-hidden shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-stone-600">
          <div className="flex items-center gap-2">
            <YouTubeLogo size={16} />
            <span className="font-semibold text-[#1A1A18]">YouTube Data API v3</span>
            <span className="text-[10px] text-stone-400">(16:9 Video & Shorts)</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-2">
            <InstagramLogo size={16} />
            <span className="font-semibold text-[#1A1A18]">Instagram Reels & Carousel</span>
            <span className="text-[10px] text-stone-400">(9:16 & 1:1)</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-2">
            <TikTokLogo size={16} />
            <span className="font-semibold text-[#1A1A18]">TikTok Creator Content</span>
            <span className="text-[10px] text-stone-400">(Native Direct)</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-2">
            <FacebookLogo size={16} />
            <span className="font-semibold text-[#1A1A18]">Facebook Graph API</span>
            <span className="text-[10px] text-stone-400">(Pages & Reels)</span>
          </div>
          <span className="text-stone-300 hidden md:inline">•</span>
          <div className="hidden md:flex items-center gap-2">
            <XLogo size={16} />
            <span className="font-semibold text-[#1A1A18]">X API v2</span>
            <span className="text-[10px] text-stone-400">(Thread & Media)</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 02 — THE PUBLISHING PROBLEM (CLEAN & ELEGANT COMPARISON)          */}
      {/* ========================================================================= */}
      <section id="the-problem" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-accent-terracotta/10 text-accent-terracotta text-xs font-mono font-bold uppercase tracking-wider">
            <span>02 / THE PUBLISHING PROBLEM</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1A1A18]">
            The Cost of Fragmented Publishing
          </h2>
          <p className="font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
            Content creators and marketing teams lose 15+ hours each week wrestling with disconnected platform uploaders, inconsistent aspect ratios, and manual repetitive metadata entry.
          </p>

          {/* Clean View Tabs */}
          <div className="pt-3 inline-flex p-1 bg-white border border-black/10 rounded-xl font-mono text-xs shadow-xs">
            <button
              onClick={() => setProblemViewMode('ALL')}
              className={`py-1.5 px-3.5 rounded-lg font-bold cursor-pointer transition-colors ${
                problemViewMode === 'ALL' ? 'bg-[#364165] text-white shadow-xs' : 'text-stone-600 hover:text-black'
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setProblemViewMode('CHAOS')}
              className={`py-1.5 px-3.5 rounded-lg font-bold cursor-pointer transition-colors ${
                problemViewMode === 'CHAOS' ? 'bg-[#A24836] text-white shadow-xs' : 'text-stone-600 hover:text-black'
              }`}
            >
              The Chaos of 5 Apps
            </button>
            <button
              onClick={() => setProblemViewMode('DREAM')}
              className={`py-1.5 px-3.5 rounded-lg font-bold cursor-pointer transition-colors ${
                problemViewMode === 'DREAM' ? 'bg-[#1D6F42] text-white shadow-xs' : 'text-stone-600 hover:text-black'
              }`}
            >
              The Dream Press Desk
            </button>
          </div>
        </div>

        {/* High-Contrast Tactile Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: The Old Way */}
          {(problemViewMode === 'ALL' || problemViewMode === 'CHAOS') && (
            <div className={`editorial-paper-card p-7 sm:p-9 rounded-3xl border border-red-200/80 space-y-6 relative overflow-hidden ${
              problemViewMode === 'CHAOS' ? 'md:col-span-2 max-w-2xl mx-auto' : ''
            }`}>
              {/* Tactile Washi Tape Strip */}
              <div className="absolute -top-3 left-10 pointer-events-none drop-shadow-xs rotate-[2deg]">
                <Sticker name="washi-terracotta" size="md" />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-red-100">
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 font-mono text-xs font-bold uppercase border border-red-200">
                  THE OLD WAY
                </span>
                <span className="font-mono text-xs text-red-600 font-bold">
                  ⚠️ 15+ Hours Wasted Weekly
                </span>
              </div>

              <h3 className="font-serif font-bold text-2xl text-[#1A1A18]">
                &quot;One post. Too many repetitive steps.&quot;
              </h3>

              <ul className="space-y-4 font-sans text-sm text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</span>
                  <div>
                    <b className="text-[#1A1A18] block font-mono text-xs uppercase">Manual Aspect Ratio Re-Encoding</b>
                    Exporting 16:9, 1:1, and 9:16 separately, cluttering local drives with redundant video renders.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</span>
                  <div>
                    <b className="text-[#1A1A18] block font-mono text-xs uppercase">Repetitive Copy-Pasting</b>
                    Jumping across 5 to 7 browser tabs, manually copying captions, hashtags, and links over and over.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✕</span>
                  <div>
                    <b className="text-[#1A1A18] block font-mono text-xs uppercase">Silent Publishing Failures</b>
                    One channel fails silently due to an expired OAuth token while the team assumes the campaign went live.
                  </div>
                </li>
              </ul>
            </div>
          )}

          {/* Right Column: The Dream Press Way */}
          {(problemViewMode === 'ALL' || problemViewMode === 'DREAM') && (
            <div className={`editorial-paper-card p-7 sm:p-9 rounded-3xl border border-emerald-200/80 space-y-6 relative overflow-hidden ${
              problemViewMode === 'DREAM' ? 'md:col-span-2 max-w-2xl mx-auto' : ''
            }`}>
              {/* Tactile Washi Tape Strip */}
              <div className="absolute -top-3 right-10 pointer-events-none drop-shadow-xs rotate-[-2deg]">
                <Sticker name="washi-indigo" size="md" />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono text-xs font-bold uppercase border border-emerald-200">
                  THE DREAM PRESS WAY
                </span>
                <span className="font-mono text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Synchronized Desk
                </span>
              </div>

              <h3 className="font-serif font-bold text-2xl text-[#1A1A18]">
                &quot;One workflow. Multiple destinations.&quot;
              </h3>

              <ul className="space-y-4 font-sans text-sm text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <b className="text-[#1A1A18] block font-mono text-xs uppercase">Universal Master Ingestion</b>
                    Upload master 4K footage once. The publishing engine automatically adapts 16:9 to 9:16 vertical reels with AI safe framing.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <b className="text-[#1A1A18] block font-mono text-xs uppercase">Synchronized Platform Nuances</b>
                    Single shared story root with per-platform character counts, hashtag rules, and tone overrides customized in one screen.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <b className="text-[#1A1A18] block font-mono text-xs uppercase">Isolated Worker Failure Recovery</b>
                    Concurrent worker queues handle each network separately. Temporary rate limits on one channel never affect other dispatches.
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 03 — HOW THE PRESS WORKS                                          */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-white/70 backdrop-blur-sm border-y border-black/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-[#364165] uppercase tracking-wider">
              03 / HOW THE PRESS WORKS
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1A1A18]">
              From Master File to Global Dispatch in Four Movements
            </h2>
            <p className="font-sans text-sm sm:text-base text-stone-600">
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
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                  activeWorkflowStep === item.step
                    ? 'bg-white border-[#364165] shadow-md ring-2 ring-[#364165]/15 scale-[1.02]'
                    : 'bg-white/60 border-black/10 hover:border-[#364165]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-6 h-6 rounded-full font-mono font-bold text-xs flex items-center justify-center ${
                    activeWorkflowStep === item.step
                      ? 'bg-[#364165] text-white'
                      : 'bg-stone-200 text-stone-600'
                  }`}>
                    0{item.step}
                  </span>
                  {activeWorkflowStep === item.step && (
                    <span className="w-2 h-2 rounded-full bg-[#364165] animate-ping" />
                  )}
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1A1A18] pt-1">
                  {item.title}
                </h4>
                <p className="text-[11px] font-mono text-stone-500">
                  {item.sub}
                </p>
              </button>
            ))}
          </div>

          {/* Dynamic Workflow Detail Card */}
          <div className="p-7 sm:p-9 bg-white border border-black/10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] space-y-4">
            {activeWorkflowStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <span className="px-3 py-0.5 rounded-full bg-[#364165]/10 text-[#364165] font-mono text-xs font-bold uppercase">
                    STAGE 01 — UNIVERSAL INGESTION
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1A18]">
                    Upload Your Master Story Without Compression
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-sans">
                    Drop your full-resolution 4K video or uncompressed image series. The engine automatically inspects the container, probes keyframe intervals, analyzes color profiles, and prepares baseline metadata for multi-aspect conversion.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-600 pt-2">
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ H.264 / HEVC / ProRes</span>
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ Up to 4K 60fps</span>
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ Stereo 48kHz Audio</span>
                  </div>
                </div>
                <div className="lg:col-span-5 p-4 bg-stone-50 rounded-2xl border border-black/5 font-mono text-xs space-y-2">
                  <div className="text-[10px] text-stone-500 uppercase font-bold">PROBE METADATA REPORT</div>
                  <div className="p-3 bg-white rounded-xl border border-black/5 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between"><span>File:</span><span className="text-[#1A1A18] font-bold">master_reel_ep04.mp4</span></div>
                    <div className="flex justify-between"><span>Resolution:</span><span className="text-[#364165] font-bold">3840 × 2160 (16:9)</span></div>
                    <div className="flex justify-between"><span>Bitrate:</span><span>45.2 Mbps Clean</span></div>
                    <div className="flex justify-between"><span>Color Primaries:</span><span>Rec.709 Standard</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <span className="px-3 py-0.5 rounded-full bg-[#364165]/10 text-[#364165] font-mono text-xs font-bold uppercase">
                    STAGE 02 — CHANNEL ORCHESTRATION
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1A18]">
                    Target Connected Networks with Verified API Compliance
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-sans">
                    Select your active destination endpoints. The engine cross-references the official platform API limits (e.g. YouTube Shorts 60s, TikTok Reels, Instagram Carousel rules) and alerts you immediately if any channel requires dedicated adjustments.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-600 pt-2">
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ Token Vault AES-256</span>
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ No Passwords Required</span>
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ Granular Permissions</span>
                  </div>
                </div>
                <div className="lg:col-span-5 grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-black/5 flex items-center gap-2.5 shadow-2xs">
                    <YouTubeLogo size={18} />
                    <div><b className="block text-[#1A1A18]">YouTube</b><span className="text-[10px] text-emerald-700">✓ Token Active</span></div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-black/5 flex items-center gap-2.5 shadow-2xs">
                    <InstagramLogo size={18} />
                    <div><b className="block text-[#1A1A18]">Instagram</b><span className="text-[10px] text-emerald-700">✓ Token Active</span></div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-black/5 flex items-center gap-2.5 shadow-2xs">
                    <TikTokLogo size={18} />
                    <div><b className="block text-[#1A1A18]">TikTok</b><span className="text-[10px] text-emerald-700">✓ Token Active</span></div>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-black/5 flex items-center gap-2.5 shadow-2xs">
                    <FacebookLogo size={18} />
                    <div><b className="block text-[#1A1A18]">Facebook</b><span className="text-[10px] text-emerald-700">✓ Token Active</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <span className="px-3 py-0.5 rounded-full bg-[#364165]/10 text-[#364165] font-mono text-xs font-bold uppercase">
                    STAGE 03 — PLATFORM ADAPTATION
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1A18]">
                    Tailor Metadata and Safe-Zones for Each Audience
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-sans">
                    Never send the exact same generic caption everywhere. MULTIPOST allows you to keep one core narrative, while customizing hashtags, link placements, and text hooks specifically tailored for the algorithm of each platform.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-600 pt-2">
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ Mobile Safe-Zone Visualizer</span>
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ Character Counter</span>
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ AI Tone Modulation</span>
                  </div>
                </div>
                <div className="lg:col-span-5 p-4 bg-stone-50 rounded-2xl border border-black/5 font-mono text-xs space-y-2">
                  <div className="text-[10px] text-stone-500 uppercase font-bold">EDITION PREVIEWS</div>
                  <div className="p-3 bg-white rounded-xl border border-black/5 text-[11px] space-y-1.5 shadow-2xs">
                    <div className="text-[#364165] font-bold">TikTok Edition:</div>
                    <p className="text-stone-600 line-clamp-2">Wait till the end to see the 16:9 shift... #creator #workflow #tech</p>
                    <div className="text-[#364165] font-bold pt-1">YouTube Description:</div>
                    <p className="text-stone-600 line-clamp-2">Full behind-the-scenes breakdown of our Bangkok editorial studio workflow...</p>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <span className="px-3 py-0.5 rounded-full bg-[#364165]/10 text-[#364165] font-mono text-xs font-bold uppercase">
                    STAGE 04 — DISPATCH & MONITORING
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1A18]">
                    Schedule for Bangkok Golden Hours or Push Instantly
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-sans">
                    Queue publication according to data-driven engagement windows. If any platform encounters a momentary API timeout, our isolated retry queues attempt recovery automatically without disturbing your other live feeds.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-600 pt-2">
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ Bangkok Golden Peak (UTC+7)</span>
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ Millisecond Precision</span>
                    <span className="px-2.5 py-1 bg-stone-100 border border-black/5 rounded">✓ 1-Click Partial Recovery</span>
                  </div>
                </div>
                <div className="lg:col-span-5 p-4 bg-stone-50 rounded-2xl border border-black/5 font-mono text-xs space-y-2">
                  <div className="text-[10px] text-stone-500 uppercase font-bold">DISPATCH ENGINE STATUS</div>
                  <div className="p-3 bg-white rounded-xl border border-black/5 space-y-1.5 text-[11px] shadow-2xs">
                    <div className="flex justify-between items-center"><span>Queue Status:</span><span className="text-emerald-700 font-bold">ACTIVE</span></div>
                    <div className="flex justify-between items-center"><span>Scheduled Time:</span><span>19:30 UTC+7</span></div>
                    <div className="flex justify-between items-center"><span>Worker Health:</span><span className="text-[#364165] font-bold">100% Operational</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04 — INTERACTIVE PRESS STUDIO (WITH INSTANT 100 COINS CLAIM!)    */}
      {/* ========================================================================= */}
      <section ref={pressStudioRef} id="press-studio" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Section Header with Instant Claim Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#364165] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              <span>04 / INTERACTIVE PRESS STUDIO</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#1A1A18]">
              The Hands-On Publishing Playground
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Complete the 4 guided tasks to collect up to <b>100 Press Coins</b>, or click <b>&quot;รับ 100 Coins ทันที&quot;</b> เพื่อปลดล็อกตั๋ว <b>7-Day Dream Pass</b> ได้ทันที!
            </p>
          </div>

          {/* Quick Actions (Master Shimmering Instant Claim + Reset) */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClaimAllCoins}
              className="py-2.5 px-5 rounded-xl animate-gold-shimmer text-amber-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-950" />
              <span>⚡ รับ 100 Coins ทันที</span>
            </button>

            <button
              onClick={handleResetDemo}
              className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-stone-50 border border-black/10 text-xs font-mono text-stone-600 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs hover:scale-102"
              title="Reset playground back to 0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>รีเซ็ต</span>
            </button>

            <div className="p-2 px-3 bg-white border border-black/10 rounded-xl shadow-xs flex items-center gap-2">
              <PressCoinIcon size={22} />
              <div className="leading-tight">
                <span className="font-mono text-sm font-bold text-[#1A1A18]">
                  {coins} <span className="text-[10px] text-stone-500 font-normal">/ 100</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive Task Cards Grid (Styled as Tactile Editorial Production Slips) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TASK 01: CHOOSE YOUR DESTINATIONS (+20 COINS) */}
          <div className={`editorial-paper-card p-6 rounded-3xl relative overflow-hidden transition-all duration-300 space-y-4 ${
            completedTasks.destinations
              ? 'border-emerald-500 ring-2 ring-emerald-500/15'
              : 'hover:border-[#364165]/50'
          }`}>
            {/* Tactile Washi Tape Strip */}
            <div className="absolute -top-3 left-8 z-10 pointer-events-none drop-shadow-xs rotate-[-2deg]">
              <Sticker name="washi-terracotta" size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#364165]/10 text-[#364165] font-mono font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1A18]">
                  Task 01 — Choose Your Destinations
                </h3>
              </div>

              {/* Shimmering Gold Instant Claim Button for Task 1 */}
              <button
                onClick={() => awardCoins(20, '2 Channels Picked', 'destinations')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  completedTasks.destinations 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'animate-gold-shimmer text-amber-950 shadow-xs hover:scale-105 active:scale-95'
                }`}
              >
                {completedTasks.destinations ? '✓ สำเร็จ (+20 Coins)' : '⚡ รับทันที (+20 Coins)'}
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
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
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between active:scale-95 ${
                      isSelected
                        ? 'bg-[#364165]/10 border-[#364165] text-[#364165] font-bold shadow-xs scale-102'
                        : 'bg-stone-50 border-black/5 text-stone-600 hover:text-black hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <IconComponent size={14} className="shrink-0" />
                      <span className="text-xs truncate">{p.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#364165] shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] font-mono text-stone-500 flex items-center justify-between pt-1">
              <span>Selected: <b className="text-[#1A1A18]">{selectedPlatforms.length}</b> channels</span>
              <span className="text-[10px] text-[#364165] font-semibold">
                {selectedPlatforms.length >= 2 ? '✓ ตรงตามเงื่อนไข' : 'เลือกอีก 1 ช่องทางเพื่อรับเหรียญ'}
              </span>
            </div>
          </div>

          {/* TASK 02: CUSTOMIZE YOUR EDITION (+25 COINS) */}
          <div className={`editorial-paper-card p-6 rounded-3xl relative overflow-hidden transition-all duration-300 space-y-4 ${
            completedTasks.caption
              ? 'border-emerald-500 ring-2 ring-emerald-500/15'
              : 'hover:border-[#364165]/50'
          }`}>
            {/* Tactile Washi Tape Strip */}
            <div className="absolute -top-3 right-8 z-10 pointer-events-none drop-shadow-xs rotate-[2deg]">
              <Sticker name="washi-indigo" size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#364165]/10 text-[#364165] font-mono font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1A18]">
                  Task 02 — Customize Your Edition
                </h3>
              </div>

              {/* Shimmering Gold Instant Claim Button for Task 2 */}
              <button
                onClick={() => awardCoins(25, 'Edition Caption Tailored', 'caption')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  completedTasks.caption 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'animate-gold-shimmer text-amber-950 shadow-xs hover:scale-105 active:scale-95'
                }`}
              >
                {completedTasks.caption ? '✓ สำเร็จ (+25 Coins)' : '⚡ รับทันที (+25 Coins)'}
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
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
                  className={`py-1.5 px-3 rounded-full border transition-all cursor-pointer text-xs active:scale-95 ${
                    activeTone === t.id
                      ? 'bg-[#364165] text-white font-bold border-[#364165] shadow-xs scale-105'
                      : 'bg-stone-50 text-stone-600 hover:text-black border-black/5 hover:bg-stone-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Live Typing Preview Caption Box & Character Gauge Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-500">
                <span>LIVE PLATFORM CAPTION PREVIEW</span>
                <span><b>{customCaption.length}</b> / 280 characters</span>
              </div>
              
              {/* Dynamic Animated Character Gauge Bar */}
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    customCaption.length > 250 ? 'bg-red-500' : customCaption.length > 180 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (customCaption.length / 280) * 100)}%` }}
                />
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
                className="w-full p-2.5 bg-stone-50 rounded-xl border border-black/10 text-xs font-sans text-[#1A1A18] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#364165]/30 focus:border-[#364165]"
              />
            </div>
          </div>

          {/* TASK 03: SCHEDULE YOUR DISPATCH (+25 COINS) */}
          <div className={`editorial-paper-card p-6 rounded-3xl relative overflow-hidden transition-all duration-300 space-y-4 ${
            completedTasks.schedule
              ? 'border-emerald-500 ring-2 ring-emerald-500/15'
              : 'hover:border-[#364165]/50'
          }`}>
            {/* Tactile Washi Tape Strip */}
            <div className="absolute -top-3 left-8 z-10 pointer-events-none drop-shadow-xs rotate-[1deg]">
              <Sticker name="washi-indigo" size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#364165]/10 text-[#364165] font-mono font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1A18]">
                  Task 03 — Schedule Your Dispatch
                </h3>
              </div>

              {/* Shimmering Gold Instant Claim Button for Task 3 */}
              <button
                onClick={() => awardCoins(25, 'Bangkok Golden Slot Confirmed', 'schedule')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  completedTasks.schedule 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'animate-gold-shimmer text-amber-950 shadow-xs hover:scale-105 active:scale-95'
                }`}
              >
                {completedTasks.schedule ? '✓ สำเร็จ (+25 Coins)' : '⚡ รับทันที (+25 Coins)'}
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Confirm a high-performing audience window to schedule publishing:
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
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between active:scale-98 ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-400 text-amber-950 font-bold shadow-xs scale-101'
                        : 'bg-stone-50 border-black/5 text-stone-600 hover:text-black hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <SlotIcon className="w-4 h-4 text-amber-600" />
                      <span>{s.time}</span>
                      <span className="text-stone-500 text-[11px] hidden sm:inline">— {s.label}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] font-bold">
                      {s.boost}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TASK 04: RESCUE A FAILED POST (+30 COINS) */}
          <div className={`editorial-paper-card p-6 rounded-3xl relative overflow-hidden transition-all duration-300 space-y-4 ${
            completedTasks.rescue
              ? 'border-emerald-500 ring-2 ring-emerald-500/15'
              : 'hover:border-[#364165]/50'
          }`}>
            {/* Tactile Washi Tape Strip */}
            <div className="absolute -top-3 right-8 z-10 pointer-events-none drop-shadow-xs rotate-[-2deg]">
              <Sticker name="washi-terracotta" size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#364165]/10 text-[#364165] font-mono font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1A18]">
                  Task 04 — Rescue a Failed Post
                </h3>
              </div>

              {/* Shimmering Gold Instant Claim Button for Task 4 */}
              <button
                onClick={() => {
                  setIsFailureResolved(true);
                  awardCoins(30, 'Aspect Ratio Rescued', 'rescue');
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  completedTasks.rescue 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'animate-gold-shimmer text-amber-950 shadow-xs hover:scale-105 active:scale-95'
                }`}
              >
                {completedTasks.rescue ? '✓ สำเร็จ (+30 Coins)' : '⚡ รับทันที (+30 Coins)'}
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Inspect a simulated aspect ratio mismatch and trigger automated AI Safe-Zone recovery:
            </p>

            {/* Visual Simulated Crop Box with Live Animated Laser Scan */}
            <div className="p-3 bg-stone-900 rounded-xl border border-stone-700 relative overflow-hidden text-center min-h-[96px] flex flex-col justify-center">
              {/* Dynamic Laser Beam Overlay */}
              {isScanningRescue && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-laser-scan z-20 pointer-events-none" />
              )}
              
              {!isFailureResolved ? (
                <div className="space-y-1.5 z-10">
                  <div className="flex items-center justify-center gap-1.5 text-red-400 font-mono font-bold text-xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Meta Graph API 400: Aspect Ratio Mismatch</span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-mono">
                    Input: 1:1 Square (1080×1080) • Required: 9:16 Vertical Reel
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 z-10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-mono font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Framed to 1080 × 1920 with Safe-Margins!</span>
                  </div>
                  <p className="text-[10px] text-stone-300 font-mono flex items-center justify-center gap-1">
                    <Sticker name="safe-zone-guide" size="xs" inline />
                    <span>Top 15% • Bottom 25% Safe • Zero UI Obstruction</span>
                  </p>
                </div>
              )}
            </div>

            {!isFailureResolved ? (
              <button
                type="button"
                onClick={handleTriggerRescue}
                disabled={isScanningRescue}
                className="w-full py-3 px-4 rounded-xl bg-[#A24836] text-white font-bold hover:bg-[#8e3f2f] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-xs active:scale-98"
              >
                <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isScanningRescue ? 'animate-spin' : ''}`} />
                <span>{isScanningRescue ? 'Laser Scanning & Re-framing Safe-Zone...' : '⚡ 1-Click AI Safe-Zone Rescue'}</span>
              </button>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-center font-mono text-[11px] text-emerald-800 font-bold flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Post Successfully Recovered & Validated!</span>
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS UNLOCK BANNER */}
        <div className="p-7 sm:p-9 rounded-3xl border border-black/10 bg-white shadow-[0_12px_36px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setIsCoinFlipped(!isCoinFlipped);
                playChimeSound(soundEnabled);
              }}
              className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-800 flex items-center justify-center shrink-0 border border-amber-400/50 shadow-inner cursor-pointer hover:scale-105 transition-transform"
              title="Click to flip token!"
            >
              <PressCoinIcon size={38} isFlipped={isCoinFlipped} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-[#1A1A18]">
                  Interactive Progress: {coins} / 100 Press Coins
                </h3>
                {isPassUnlocked && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300 animate-pulse">
                    READY TO FORGE
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                {isPassUnlocked
                  ? 'ยินดีด้วย! คุณสะสมครบ 100 Press Coins แล้ว สามารถเลื่อนลงไปดูตั๋ว 7-Day Dream Pass ได้ทันที'
                  : 'ทำภารกิจด้านบนหรือกด "รับ 100 Coins ทันที" เพื่อปลดล็อกตั๋ว 7-Day Dream Pass ด้านล่างสุด'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {coins < 100 ? (
              <button
                onClick={handleClaimAllCoins}
                className="py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-mono text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4 fill-amber-950" />
                <span>รับ 100 Coins ทันที ✦</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  dreamPassRef.current?.scrollIntoView({ behavior: 'smooth' });
                  playChimeSound(soundEnabled);
                }}
                className="py-3 px-6 rounded-xl bg-[#A24836] text-white hover:bg-[#8e3f2f] text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg animate-bounce"
              >
                <Ticket className="w-4 h-4" />
                <span>ไปที่ตั๋ว Dream Pass →</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 05 — PRESS COINS (COLLECTIBLE 3D FLIPPABLE TOKEN SHOWCASE)        */}
      {/* ========================================================================= */}
      <section id="press-coins" className="py-20 bg-white/70 backdrop-blur-sm border-y border-black/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-[#364165] uppercase tracking-wider">
              05 / PRESS COINS
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1A1A18]">
              The Currency of Publishing Precision
            </h2>
            <p className="font-sans text-sm text-stone-600 leading-relaxed">
              Press Coins represent verified milestones in the Dream Press ecosystem. Click the token below to flip and inspect the reverse seal!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Collectible 3D Flippable Coin Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-black/10 text-center space-y-4 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setIsCoinFlipped(!isCoinFlipped);
                  playChimeSound(soundEnabled);
                }}
                className="relative cursor-pointer group"
                title="Click to flip coin 360°"
              >
                <div className="w-40 h-40 rounded-full bg-amber-400/15 flex items-center justify-center p-2 shadow-inner ring-4 ring-amber-400/30 group-hover:scale-105 transition-transform duration-300">
                  <PressCoinIcon size={135} isFlipped={isCoinFlipped} />
                </div>
                <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold shadow-md">
                  {isCoinFlipped ? 'BANGKOK CREST' : 'PRESS STAR'} ↻
                </div>
              </button>

              <div>
                <h4 className="font-serif font-bold text-lg text-[#1A1A18]">
                  The Press Coin № 01
                </h4>
                <p className="text-xs font-mono text-stone-500">
                  Vintage Editorial Mark • Milled Ochre Rim
                </p>
              </div>

              <p className="text-xs text-stone-600 max-w-xs font-sans leading-relaxed">
                Awarded for precision workflows: destination selection, nuanced caption tailoring, optimal time scheduling, and proactive error recovery.
              </p>
            </div>

            {/* Right: Live Coin Ledger & Progress */}
            <div className="lg:col-span-7 p-7 sm:p-9 bg-white rounded-3xl border border-black/10 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">
                    SESSION LEDGER BALANCE
                  </span>
                  <div className="text-4xl font-serif font-bold text-[#1A1A18] flex items-baseline gap-2">
                    <span>{coins}</span>
                    <span className="text-sm font-mono text-stone-500 font-normal">/ 100 COINS MAX</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">STATUS</span>
                  <span className={`font-mono text-xs font-bold px-3 py-1 rounded-full ${
                    isPassUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {isPassUnlocked ? '✦ Ready to Unlock Pass' : `${100 - coins} Coins Remaining`}
                  </span>
                </div>
              </div>

              {/* Milestone Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-stone-500">
                  <span>Start (0)</span>
                  <span>Destinations (20)</span>
                  <span>Caption (45)</span>
                  <span>Schedule (70)</span>
                  <span>Unlocked (100)</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-black/5 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full transition-all duration-700 shadow-xs"
                    style={{ width: `${coins}%` }}
                  />
                </div>
              </div>

              {/* Assignment Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  completedTasks.destinations ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-stone-50 border-black/5 text-stone-600'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${completedTasks.destinations ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>Choose Destinations (+20)</span>
                </div>
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  completedTasks.caption ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-stone-50 border-black/5 text-stone-600'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${completedTasks.caption ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>Customize Edition (+25)</span>
                </div>
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  completedTasks.schedule ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-stone-50 border-black/5 text-stone-600'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${completedTasks.schedule ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>Bangkok Slot (+25)</span>
                </div>
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  completedTasks.rescue ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-stone-50 border-black/5 text-stone-600'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${completedTasks.rescue ? 'text-emerald-700' : 'text-stone-400'}`} />
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
          <span className="text-xs font-mono font-bold text-[#364165] uppercase tracking-wider">
            06 / EXPLORE THE WORKSPACE
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-5xl text-[#1A1A18]">
            The Full-Spectrum Publishing Studio
          </h2>
          <p className="font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
            Inspect the core production rooms of MULTIPOST. Switch tabs to preview real workflow interfaces.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-black/10 pb-4 font-mono text-xs">
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
                className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#364165] text-white font-bold shadow-md scale-105'
                    : 'bg-white text-stone-600 hover:text-black hover:bg-stone-50 border border-black/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Workspace Tab Panels */}
        <div className="editorial-paper-card p-7 sm:p-9 rounded-3xl relative min-h-[420px]">
          {/* Tactile Washi Tape Strip */}
          <div className="absolute -top-3.5 right-12 pointer-events-none drop-shadow-xs rotate-[2deg]">
            <Sticker name="washi-indigo" size="md" />
          </div>
          {/* TAB 1: DASHBOARD */}
          {activeTourTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-black/10">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1A1A18]">
                    Central Publishing Command
                  </h3>
                  <p className="text-xs font-mono text-stone-500">Real-time health of scheduled campaigns, queues, and connected accounts</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-emerald-700">All Workers Healthy</span>
                </div>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-black/5">
                  <span className="text-[10px] font-mono text-stone-500 block font-bold">DISPATCH RELIABILITY</span>
                  <div className="text-2xl font-serif font-bold text-[#364165]">99.98%</div>
                  <span className="text-[10px] font-mono text-emerald-700">SLA Maintained</span>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-black/5">
                  <span className="text-[10px] font-mono text-stone-500 block font-bold">ACTIVE QUEUES</span>
                  <div className="text-2xl font-serif font-bold text-[#1A1A18]">12 Posts</div>
                  <span className="text-[10px] font-mono text-stone-500">Across 4 Networks</span>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-black/5">
                  <span className="text-[10px] font-mono text-stone-500 block font-bold">PEAK SLOT TARGET</span>
                  <div className="text-2xl font-serif font-bold text-amber-600">19:30 UTC+7</div>
                  <span className="text-[10px] font-mono text-stone-500">Prime Reel Window</span>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-black/5">
                  <span className="text-[10px] font-mono text-stone-500 block font-bold">TOKEN VAULT</span>
                  <div className="text-2xl font-serif font-bold text-emerald-700">AES-256</div>
                  <span className="text-[10px] font-mono text-emerald-700">Encrypted GCM</span>
                </div>
              </div>

              {/* Recent Dispatches Mock Table */}
              <div className="border border-black/10 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <div className="p-3 bg-stone-50 border-b border-black/10 text-[11px] font-mono font-bold text-stone-600 flex justify-between">
                  <span>DISPATCH STREAM</span>
                  <span>STATUS</span>
                </div>
                <div className="divide-y divide-black/5 text-xs font-mono">
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <YouTubeLogo size={14} />
                      <span className="font-bold text-[#1A1A18] truncate">Behind The Scenes ep04 (4K Master)</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">PUBLISHED</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TikTokLogo size={14} />
                      <span className="font-bold text-[#1A1A18] truncate">Micro-Teaser Hook #9:16</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-[#364165]/10 text-[#364165] font-bold text-[10px]">ENCODING 78%</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <InstagramLogo size={14} />
                      <span className="font-bold text-[#1A1A18] truncate">Prime Carousel Photo Slide</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">QUEUED 19:30</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT LIBRARY */}
          {activeTourTab === 'library' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-black/10">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1A1A18]">Master Media Asset Repository</h3>
                  <p className="text-xs font-mono text-stone-500">Search, tag, and reuse high-resolution master video and graphics</p>
                </div>
                <span className="px-3 py-1 bg-stone-100 border border-black/10 rounded-xl font-mono text-xs font-bold text-[#1A1A18]">
                  128 Assets Ingested
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Brand Launch Reel 2026', res: '3840 × 2160', dur: '01:45', tag: 'Master 4K' },
                  { title: 'Product Showcase Carousel', res: '1080 × 1350', dur: '5 Slides', tag: 'Carousel 4:5' },
                  { title: 'Bangkok Studio Vlog Hook', res: '1080 × 1920', dur: '00:30', tag: 'Vertical 9:16' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-black/10 space-y-3">
                    <div className="aspect-video bg-stone-200 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <Film className="w-8 h-8 text-[#364165]/40" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#364165] text-white font-mono text-[9px] font-bold">
                        {item.tag}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1A1A18] truncate">{item.title}</h4>
                      <div className="flex justify-between text-[10px] font-mono text-stone-500 pt-1">
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
              <div className="flex justify-between items-center pb-4 border-b border-black/10">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1A1A18]">Universal Studio Composer</h3>
                  <p className="text-xs font-mono text-stone-500">Single story root with platform-specific safe-zone overlays</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#364165]/10 text-[#364165] text-xs font-mono font-bold">IG Reel</span>
                  <span className="px-2.5 py-0.5 rounded bg-[#364165]/10 text-[#364165] text-xs font-mono font-bold">YouTube</span>
                  <span className="px-2.5 py-0.5 rounded bg-[#364165]/10 text-[#364165] text-xs font-mono font-bold">TikTok</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-black/10 space-y-3">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-[#1A1A18]">SHARED STORY DRAFT</span>
                      <span className="text-stone-500">142 / 2,200 chars</span>
                    </div>
                    <p className="text-xs font-sans text-[#1A1A18] leading-relaxed bg-white p-3 rounded-xl border border-black/10">
                      Step into our Bangkok creative press room. Today we are launching the new Dream Press multi-placement engine with instant safe-zone compliance.
                    </p>
                    <div className="flex gap-2 text-[10px] font-mono text-stone-500">
                      <span className="px-2 py-0.5 bg-stone-200 rounded">#multipost</span>
                      <span className="px-2 py-0.5 bg-stone-200 rounded">#dreampress</span>
                      <span className="px-2 py-0.5 bg-stone-200 rounded">#creator</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 p-4 bg-stone-50 rounded-2xl border border-black/10 space-y-2">
                  <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">SAFE-ZONE VIEWPORT (9:16)</div>
                  <div className="aspect-[9/14] bg-stone-200 rounded-xl border border-dashed border-[#364165]/40 p-3 flex flex-col justify-between relative text-center">
                    <div className="p-1 bg-[#364165]/10 rounded text-[9px] font-mono text-[#364165]">
                      TOP SAFE-ZONE (Status Bars & Notch Clearance)
                    </div>
                    <div className="font-serif italic text-xs text-[#1A1A18]">
                      Main focal area stays completely clear of mobile UI buttons
                    </div>
                    <div className="p-1 bg-[#A24836]/10 rounded text-[9px] font-mono text-[#A24836]">
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
              <div className="flex justify-between items-center pb-4 border-b border-black/10">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1A1A18]">Asynchronous Dispatch Queue</h3>
                  <p className="text-xs font-mono text-stone-500">Track job execution, worker concurrency, and isolate partial retries</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Queue Health: 100%
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { id: 'JOB-9021', chan: 'YouTube', type: YouTubeLogo, time: '19:30 UTC+7', status: 'READY', badge: 'bg-emerald-100 text-emerald-800' },
                  { id: 'JOB-9022', chan: 'Instagram', type: InstagramLogo, time: '19:30 UTC+7', status: 'IN QUEUE', badge: 'bg-[#364165]/10 text-[#364165]' },
                  { id: 'JOB-9023', chan: 'TikTok', type: TikTokLogo, time: '19:30 UTC+7', status: 'IN QUEUE', badge: 'bg-[#364165]/10 text-[#364165]' },
                  { id: 'JOB-9024', chan: 'X / Twitter', type: XLogo, time: '19:35 UTC+7', status: 'RATE LIMIT BACKOFF', badge: 'bg-amber-100 text-amber-900' },
                ].map((job) => {
                  const Icon = job.type;
                  return (
                    <div key={job.id} className="p-3.5 bg-stone-50 rounded-xl border border-black/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        <div>
                          <b className="text-[#1A1A18]">{job.chan}</b>
                          <span className="text-stone-500 text-[11px] ml-2">ID: {job.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-stone-500 hidden sm:inline">{job.time}</span>
                        <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${job.badge}`}>
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
              <div className="flex justify-between items-center pb-4 border-b border-black/10">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1A1A18]">Editorial Publishing Calendar</h3>
                  <p className="text-xs font-mono text-stone-500">Synchronized schedule with Bangkok Golden Peak highlight zones</p>
                </div>
                <span className="text-xs font-mono text-stone-500">Asia/Bangkok (UTC+7)</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center font-mono text-xs">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                  <div key={day} className="p-2 bg-stone-100 rounded-lg font-bold text-stone-600 text-[11px]">
                    {day}
                  </div>
                ))}
                {[20, 21, 22, 23, 24, 25, 26].map((date, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-black/10 min-h-[85px] text-left space-y-1">
                    <span className="text-xs font-bold text-[#1A1A18]">{date}</span>
                    {idx === 2 && (
                      <div className="p-1 bg-[#364165]/10 text-[#364165] rounded text-[9px] font-bold truncate">
                        19:30 Reel Live
                      </div>
                    )}
                    {idx === 4 && (
                      <div className="p-1 bg-amber-100 text-amber-900 rounded text-[9px] font-bold truncate">
                        11:45 YT Widescreen
                      </div>
                    )}
                    {idx === 6 && (
                      <div className="p-1 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold truncate">
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
              <div className="flex justify-between items-center pb-4 border-b border-black/10">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1A1A18]">Omni-Channel Performance Radar</h3>
                  <p className="text-xs font-mono text-stone-500">Consolidated impression reach and cross-platform engagement velocity</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#364165]/10 text-[#364165] font-mono text-xs font-bold">
                  Last 30 Days
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-stone-50 rounded-2xl border border-black/5 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-mono text-stone-500 uppercase font-bold">TOTAL IMPRESSIONS</span>
                  <div className="text-3xl font-serif font-bold text-[#1A1A18]">482,900</div>
                  <div className="flex items-center gap-1 text-emerald-700 font-mono text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+24.6% vs single-app uploads</span>
                  </div>
                </div>
                <div className="p-5 bg-stone-50 rounded-2xl border border-black/5 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-mono text-stone-500 uppercase font-bold">AVERAGE ENGAGEMENT</span>
                  <div className="text-3xl font-serif font-bold text-[#1A1A18]">6.8%</div>
                  <div className="text-stone-500 font-mono text-xs">Across 6 connected endpoints</div>
                </div>
                <div className="p-5 bg-stone-50 rounded-2xl border border-black/5 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-mono text-stone-500 uppercase font-bold">TIME SAVED / WEEK</span>
                  <div className="text-3xl font-serif font-bold text-[#364165]">14.5 hrs</div>
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
      <section id="features" className="py-20 bg-white/70 backdrop-blur-sm border-y border-black/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-[#364165] uppercase tracking-wider">
              07 / FEATURES THAT MATTER
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1A1A18]">
              Engineered for Serious Publishing
            </h2>
            <p className="font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
              Eight architectural pillars designed to streamline complex multi-network delivery into one effortless, dependable routine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Upload Once */}
            <div className="editorial-paper-card p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#364165]/10 text-[#364165] flex items-center justify-center font-bold">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A18]">Upload Once</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Universal master ingestion supporting 4K 60fps video and uncompressed photo sets without quality reduction.
              </p>
            </div>

            {/* 2. Shared Story */}
            <div className="editorial-paper-card p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A18]">Shared Story</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                A single canonical narrative draft that maintains consistency while serving as the parent root for every channel.
              </p>
            </div>

            {/* 3. Platform Editions */}
            <div className="editorial-paper-card p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A18]">Platform Editions</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Tailored character limits, hashtag placements, and mobile safe-zone guides adapted for YouTube, IG, TikTok, and X.
              </p>
            </div>

            {/* 4. Smart Scheduling */}
            <div className="editorial-paper-card p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#A24836]/10 text-[#A24836] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A18]">Smart Scheduling</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Bangkok Golden Peak hour recommendations (11:45, 19:30, 21:15 UTC+7) for maximum organic distribution.
              </p>
            </div>

            {/* 5. Publishing Queue */}
            <div className="editorial-paper-card p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#364165]/10 text-[#364165] flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A18]">Publishing Queue</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Asynchronous job engine with millisecond synchronization across concurrent social network APIs.
              </p>
            </div>

            {/* 6. Retry & Recovery */}
            <div className="editorial-paper-card p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#A24836]/10 text-[#A24836] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A18]">Retry & Recovery</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Isolated partial retry: if one platform rate limits, resolve and retry it without re-posting to successful channels.
              </p>
            </div>

            {/* 7. Connected Accounts */}
            <div className="editorial-paper-card p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A18]">Connected Accounts</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Bank-grade Token Vault encrypted with AES-256 GCM. No user passwords stored; zero token leakage risks.
              </p>
            </div>

            {/* 8. Content Performance */}
            <div className="editorial-paper-card p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A18]">Content Performance</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
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
          <span className="text-xs font-mono font-bold text-[#364165] uppercase tracking-wider">
            08 / BUILT FOR YOUR CREATIVE WORKFLOW
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1A1A18]">
            Tailored for Every Scale of Modern Publishing
          </h2>
          <p className="font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
            Engineered to remove friction whether you produce solo broadcasts or orchestrate multi-client publishing operations.
          </p>
        </div>

        {/* 5 Audience Profiles Grid (STRICTLY NO FAKE STATS / NO FAKE REVIEWS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Individual Creators */}
          <div className="editorial-paper-card p-7 rounded-3xl space-y-4">
            <div className="w-8 h-8 rounded-full bg-[#364165]/10 text-[#364165] flex items-center justify-center font-mono font-bold text-xs">
              01
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1A1A18]">
              Individual Creators
            </h3>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Solo YouTubers, podcasters, and storytellers who want to distribute short-form clips to TikTok and Instagram Reels in minutes without getting trapped in repetitive export-render cycles.
            </p>
            <div className="pt-2 border-t border-black/10 text-[11px] font-mono text-[#364165] font-semibold">
              ✓ 1 Master Upload → 4 Social Feeds
            </div>
          </div>

          {/* 2. Social Media Managers */}
          <div className="editorial-paper-card p-7 rounded-3xl space-y-4">
            <div className="w-8 h-8 rounded-full bg-[#A24836]/10 text-[#A24836] flex items-center justify-center font-mono font-bold text-xs">
              02
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1A1A18]">
              Social Media Managers
            </h3>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Professionals handling multiple client channels who need reliable scheduled queues, custom platform hashtags, and safe-zone preview accuracy before any post goes live.
            </p>
            <div className="pt-2 border-t border-black/10 text-[11px] font-mono text-[#A24836] font-semibold">
              ✓ Multi-Brand Channel Isolation
            </div>
          </div>

          {/* 3. Content Teams & Newsrooms */}
          <div className="editorial-paper-card p-7 rounded-3xl space-y-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
              03
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1A1A18]">
              Content Teams & Newsrooms
            </h3>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Editorial publication desks that operate with structured draft stages, editorial review gates, and synchronized multi-network announcements with zero room for error.
            </p>
            <div className="pt-2 border-t border-black/10 text-[11px] font-mono text-emerald-800 font-semibold">
              ✓ Review Gates & Role Permissions
            </div>
          </div>

          {/* 4. Creative Studios */}
          <div className="editorial-paper-card p-7 rounded-3xl space-y-4">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-800 flex items-center justify-center font-mono font-bold text-xs">
              04
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1A1A18]">
              Creative Studios
            </h3>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Video production houses delivering pristine commercial assets for brands, where maintaining full 4K visual fidelity and exact color spaces is non-negotiable.
            </p>
            <div className="pt-2 border-t border-black/10 text-[11px] font-mono text-amber-800 font-semibold">
              ✓ Uncompressed 4K Master Preservation
            </div>
          </div>

          {/* 5. Small Businesses & Brands */}
          <div className="editorial-paper-card p-7 rounded-3xl space-y-4 md:col-span-2 lg:col-span-2">
            <div className="w-8 h-8 rounded-full bg-[#364165]/10 text-[#364165] flex items-center justify-center font-mono font-bold text-xs">
              05
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1A1A18]">
              Small Businesses & Independent Brands
            </h3>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Founders and store owners who need a vibrant multi-channel presence on Facebook, Instagram, and TikTok, but can only afford 20 minutes a week to set up their publication calendar.
            </p>
            <div className="pt-2 border-t border-black/10 text-[11px] font-mono text-[#364165] font-semibold">
              ✓ Automated Bangkok Peak Hour Publishing
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 09 — THE DISPATCH BOARD (INTERACTIVE MULTI-PLATFORM STATUS DEMO) */}
      {/* ========================================================================= */}
      <section id="dispatch-board" className="py-20 bg-white/70 backdrop-blur-sm border-y border-black/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-[#364165] uppercase tracking-wider">
              09 / THE DISPATCH BOARD
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1A1A18]">
              Live Multi-Platform Dispatch Simulation
            </h2>
            <p className="font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
              Observe how MULTIPOST manages concurrent platform dispatches with independent state isolation. A temporary timeout on one network never interrupts other live deliveries.
            </p>
          </div>

          {/* The Interactive Dispatch Matrix */}
          <div className="editorial-paper-card p-7 sm:p-9 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-black/10">
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase block font-bold">CAMPAIGN DISPATCH MATRIX</span>
                <h3 className="font-serif font-bold text-lg text-[#1A1A18]">
                  Master Reel #04: The Bangkok Studio Launch
                </h3>
              </div>
              <div className="text-xs font-mono text-stone-500">
                Transmission Protocol: Concurrent Asynchronous Workers
              </div>
            </div>

            {/* Independent Platform Streams */}
            <div className="space-y-4">
              {/* YouTube Stream (Published) */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
                    <YouTubeLogo size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="text-sm text-[#1A1A18]">YouTube Data API v3</b>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                        PUBLISHED (200 OK)
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-mono">Format: 16:9 4K Master Video • 45.2 Mbps</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Live on Feed (Watch Link Ready)</span>
                </div>
              </div>

              {/* TikTok Stream (Processing) */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900/10 text-[#1A1A18] flex items-center justify-center shrink-0">
                    <TikTokLogo size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="text-sm text-[#1A1A18]">TikTok Creator API</b>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#364165]/10 text-[#364165] font-mono text-[10px] font-bold">
                        PROCESSING (ENCODING 78%)
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-mono">Format: 9:16 Vertical Safe-Zone • Direct Mobile Chunk</p>
                  </div>
                </div>
                <div className="w-40 space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between text-stone-500"><span>Worker Push:</span><span>78%</span></div>
                  <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#364165] w-[78%] rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Instagram Stream (Scheduled) */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-600/10 text-pink-600 flex items-center justify-center shrink-0">
                    <InstagramLogo size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="text-sm text-[#1A1A18]">Instagram Graph API</b>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                        SCHEDULED (19:30 UTC+7)
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-mono">Format: 9:16 Reel • Mobile Sound Sync Enabled</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-amber-800">
                  <Clock className="w-4 h-4" />
                  <span>Locked for Peak Window</span>
                </div>
              </div>

              {/* X / Twitter Stream: Simulated Failure & Isolated Recovery Action */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900/10 text-[#1A1A18] flex items-center justify-center shrink-0">
                    <XLogo size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="text-sm text-[#1A1A18]">X API v2 Endpoint</b>
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        xRetryState === 'FAILED'
                          ? 'bg-red-100 text-red-700'
                          : xRetryState === 'RETRYING'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {xRetryState === 'FAILED' && 'TEMPORARY RATE LIMIT (429)'}
                        {xRetryState === 'RETRYING' && 'RE-AUTHENTICATING WORKER...'}
                        {xRetryState === 'RECOVERED' && 'RECOVERED & LIVE (200 OK)'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-mono">
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
                      className="py-2 px-4 rounded-xl bg-[#A24836] text-white font-mono text-xs font-bold hover:bg-[#8e3f2f] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
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
      {/* SECTION 10 — FINAL REWARD: THE 7-DAY DREAM PASS (LUXURY GOLD FOIL PASS)   */}
      {/* ========================================================================= */}
      <section ref={dreamPassRef} id="dream-pass" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-[#A24836] uppercase tracking-wider">
            10 / THE DREAM PASS
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-5xl text-[#1A1A18]">
            Your Official Activation Pass
          </h2>
          <p className="font-sans text-sm sm:text-base text-stone-600">
            A vintage editorial ticket forged through interactive mastery of the Dream Press workspace.
          </p>
        </div>

        {/* Instant Coin Claim Bar directly above the Ticket */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 px-6 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-xs font-mono shadow-xs">
          <div className="flex items-center gap-3">
            <PressCoinIcon size={32} />
            <div>
              <div className="font-bold text-[#1A1A18] text-sm">
                Press Coins Balance: <span className="text-amber-800">{coins}</span> / 100
              </div>
              <p className="text-[11px] text-stone-600">
                {coins >= 100 ? '✓ สะสมเหรียญครบแล้ว! ตั๋วปลดล็อกพร้อมประทับตราใช้งาน' : 'สะสมให้ครบ 100 Coins เพื่อปลดล็อกตั๋ว หรือกดรับเหรียญได้ทันทีที่นี่'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {coins < 100 ? (
              <button
                type="button"
                onClick={handleClaimAllCoins}
                className="py-2.5 px-5 rounded-xl animate-gold-shimmer text-amber-950 font-bold flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs"
              >
                <Zap className="w-4 h-4 fill-amber-950" />
                <span>⚡ รับ 100 Coins ทันที (ปลดล็อกตั๋ว)</span>
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>ตั๋วปลดล็อกแล้ว (UNLOCKED)</span>
              </span>
            )}
          </div>
        </div>

        {/* Masterwork Ivory & Gold Ticket (Physical Editorial Ticket with Notches) */}
        <div className={`rounded-3xl border-2 transition-all duration-500 relative shadow-[0_20px_50px_rgba(0,0,0,0.08)] ${
          isPassUnlocked
            ? 'bg-gradient-to-b from-white via-[#FFFDF9] to-[#FBF8F0] border-amber-400 ring-4 ring-amber-400/25 shadow-[0_25px_60px_rgba(245,158,11,0.22)]'
            : 'bg-white/95 border-black/10'
        } ${isRedeemingAnimation ? 'scale-98' : ''}`}>
          
          {/* Physical Ticket Semicircular Notches */}
          <div className="ticket-notch-left" />
          <div className="ticket-notch-right" />

          <div className="p-7 sm:p-12 space-y-6">
            {/* Physical Brass Eyelet Loop (Lanyard Hole) */}
            <div className="flex justify-center -mt-3 mb-2">
              <div className="w-6 h-6 rounded-full border-2 border-amber-500/40 bg-stone-100 flex items-center justify-center shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-300 shadow-xs" />
              </div>
            </div>

            {/* Ticket Masthead */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-dashed border-stone-200">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 text-amber-900 text-[10px] font-mono font-bold uppercase border border-amber-400/30">
                  <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
                  <span>OFFICIAL ACTIVATION PASS • DREAM PRESS DESK</span>
                </div>
                <h3 className="font-serif font-bold text-3xl sm:text-4xl text-[#1A1A18] tracking-tight">
                  7-DAY DREAM PASS
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  SERIAL: № DP-2026-7DAY-0089 • ADMIT ONE CREATOR
                </p>
              </div>

              {/* Dedicated Clean Stamp Zone with Authentic Wax-Seal Sticker */}
              <div className="flex items-center gap-3">
                {isPassRedeemed && (
                  <div className="animate-in zoom-in-75 duration-300">
                    <Sticker name="approved-seal" size="xl" className="rotate-[-12deg] drop-shadow-md" />
                  </div>
                )}
                <div className="text-right">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block font-bold">SPECIFICATION</span>
                  <span className={`inline-block px-3 py-1 rounded-full font-mono text-xs font-bold ${
                    isPassUnlocked
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-100 text-stone-500 border border-stone-200'
                  }`}>
                    {isPassUnlocked ? '✦ UNLOCKED & FORGED' : '🔒 LOCKED (REQUIRES 100 COINS)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Privileges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-stone-50/80 rounded-2xl border border-black/5 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#364165] block">
                  AUTHORIZED SPECIFICATIONS:
                </span>
                <ul className="space-y-1.5 text-xs text-[#1A1A18]">
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

              <div className="p-4 bg-stone-50/80 rounded-2xl border border-black/5 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#364165] block">
                  SECURITY & INFRASTRUCTURE:
                </span>
                <ul className="space-y-1.5 text-xs text-[#1A1A18]">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#364165] shrink-0" />
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
              <div className="p-6 bg-stone-50/80 rounded-2xl border border-black/10 text-center space-y-3 font-mono">
                <div className="flex items-center justify-center gap-2 text-stone-600 text-xs">
                  <Lock className="w-4 h-4 text-[#A24836]" />
                  <span>Current balance: <b>{coins} / 100 Press Coins</b></span>
                </div>
                <p className="text-xs text-stone-500">
                  ทำภารกิจใน Studio ด้านบน หรือคลิกปุ่ม &quot;รับ 100 Coins ทันที&quot; เพื่อเปิดใช้งานตั๋ว
                </p>
                <button
                  onClick={handleClaimAllCoins}
                  className="py-2.5 px-6 rounded-xl animate-gold-shimmer text-amber-950 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  ⚡ รับ 100 Coins ทันที และเปิดตั๋ว →
                </button>
              </div>
            ) : !isPassRedeemed ? (
              <div className="space-y-4 pt-2">
                <button
                  onClick={handleRedeemTicket}
                  className="w-full py-4 px-6 rounded-2xl bg-[#A24836] hover:bg-[#8e3f2f] text-white font-bold text-base shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.98] ring-2 ring-amber-400/50"
                >
                  <Sticker name="approved-seal" size="sm" inline />
                  <span>Redeem Dream Pass (ประทับตราครั่งเปิดใช้งานตั๋ว)</span>
                </button>
                <p className="text-[11px] text-center font-mono text-stone-500">
                  *การกดประทับตราในที่นี้เป็นการจำลองประสบการณ์ตั๋วเพื่อความสนุก ไม่มีการผูกมัดหรือตัดบัตรใดๆ
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center font-bold text-xl border border-emerald-300">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#1A1A18]">
                    Your Dream Pass is ready. You&apos;ve completed the publishing experience!
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto font-sans leading-relaxed">
                    คุณได้ปลดล็อกตั๋วสำเร็จแล้ว หากพร้อมเริ่มใช้งานจริงกับช่องทางโซเชียลของคุณ สามารถกดสมัครทดลองใช้จริงได้ฟรี 7 วัน
                  </p>
                </div>

                {/* Real Trial Link */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center text-xs font-mono">
                  <Link
                    href="/register"
                    className="py-3 px-6 rounded-xl bg-[#364165] hover:bg-[#2B3452] text-white font-bold shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <span>สมัครทดลองใช้จริงฟรี 7 วัน (ไม่ต้องใช้บัตรเครดิต) →</span>
                  </Link>
                  <Link
                    href="/docs"
                    className="py-3 px-4 rounded-xl bg-white hover:bg-stone-50 border border-black/10 text-[#1A1A18] font-semibold flex items-center justify-center"
                  >
                    <span>อ่านคู่มือระบบ (Docs)</span>
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
      <footer className="bg-white border-t border-black/10 mt-auto pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand Column (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#364165] text-white flex items-center justify-center font-serif font-bold text-sm shadow-2xs">
                  RP
                </div>
                <span className="font-serif font-bold text-lg text-[#1A1A18] tracking-tight">
                  MULTIPOST — DREAM PRESS
                </span>
              </div>
              <p className="font-serif italic text-sm text-stone-600 max-w-sm leading-relaxed">
                &quot;Upload once. Adapt and publish everywhere.&quot;
              </p>
              <p className="font-sans text-xs text-stone-500 max-w-sm leading-relaxed">
                A creative publishing desk engineered for creators, social media managers, and editorial teams. Bangkok, Thailand (UTC+7).
              </p>
            </div>

            {/* Links Columns (7 cols) */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-xs">
              <div className="space-y-3">
                <span className="font-bold text-[#364165] uppercase text-[10px] tracking-wider block">
                  EXPLORE
                </span>
                <ul className="space-y-2 text-stone-600">
                  <li><a href="#hero" className="hover:text-black transition-colors">Front Page</a></li>
                  <li><a href="#the-problem" className="hover:text-black transition-colors">The Problem</a></li>
                  <li><a href="#how-it-works" className="hover:text-black transition-colors">How It Works</a></li>
                  <li><a href="#press-studio" className="hover:text-black transition-colors">Press Studio</a></li>
                  <li><a href="#workspace-tour" className="hover:text-black transition-colors">Workspace Tour</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="font-bold text-[#364165] uppercase text-[10px] tracking-wider block">
                  RESOURCES
                </span>
                <ul className="space-y-2 text-stone-600">
                  <li><Link href="/docs" className="hover:text-black transition-colors">Documentation</Link></li>
                  <li><Link href="/login" className="hover:text-black transition-colors">Sign In</Link></li>
                  <li><Link href="/register" className="hover:text-black transition-colors">Register Free Trial</Link></li>
                  <li><a href="#dispatch-board" className="hover:text-black transition-colors">Dispatch Board</a></li>
                  <li><a href="#dream-pass" className="hover:text-black transition-colors">Dream Pass</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="font-bold text-[#364165] uppercase text-[10px] tracking-wider block">
                  TRUST & COMPLIANCE
                </span>
                <ul className="space-y-2 text-stone-600">
                  <li><Link href="/docs" className="hover:text-black transition-colors">PDPA & Privacy</Link></li>
                  <li><Link href="/docs" className="hover:text-black transition-colors">Terms of Service</Link></li>
                  <li><span className="text-emerald-700">✓ Meta Policy Safe</span></li>
                  <li><span className="text-emerald-700">✓ YouTube API Compliant</span></li>
                  <li><span className="text-[#364165] font-bold">AES-256 GCM Vault</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-500">
            <div>
              © 2026 MULTIPOST • Dream Press Publishing Desk • All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Editorial Gazette Edition</span>
              <span>•</span>
              <span className="text-[#1A1A18] font-semibold">Bangkok Studio</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
