'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Coins, 
  Receipt, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileDown, 
  ExternalLink, 
  Lock, 
  Building2, 
  Clock, 
  Eye, 
  SlidersHorizontal,
  Flame,
  Zap,
  Settings,
  AlertOctagon,
  Check,
  X,
  Menu,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { Sticker } from '@/components/ui/sticker';
import { MasterTokenIcon } from '@/components/icons/editorial-icons';
import { PlanTier } from '@/modules/billing/pricing-plans';
import { useTranslation, LanguageToggle } from '@/modules/i18n/i18n-context';

type AdminTab = 'OVERVIEW' | 'USERS' | 'BILLING' | 'LEGAL' | 'CIRCUIT' | 'SETTINGS';

interface AdminNavItem {
  id: AdminTab;
  labelTh: string;
  labelEn: string;
  subtextTh: string;
  subtextEn: string;
  icon: React.ComponentType<{ className?: string }>;
  section: 'INTELLIGENCE' | 'GOVERNANCE' | 'SYSTEM';
  badge?: string | number;
  badgeAlert?: boolean;
}

export default function SuperAdminPage() {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Platform Settings State
  const [trialActive, setTrialActive] = useState(true);
  const [trialDays, setTrialDays] = useState(7);
  const [postTrialMonthlyRate, setPostTrialMonthlyRate] = useState(25);
  const [postTrialYearlyRate, setPostTrialYearlyRate] = useState(35);
  const [standardYearlyRate, setStandardYearlyRate] = useState(25);
  const [vatRate, setVatRate] = useState(7);
  const [welcomeTokens, setWelcomeTokens] = useState(30);

  // Circuit breaker state
  const [metaActive, setMetaActive] = useState(true);
  const [youtubeActive, setYoutubeActive] = useState(true);
  const [tiktokActive, setTiktokActive] = useState(true);
  const [globalFreeze, setGlobalFreeze] = useState(false);

  // Token adjust modal state
  const [tokenModalUser, setTokenModalUser] = useState<any>(null);
  const [tokenAdjustAmount, setTokenAdjustAmount] = useState('100');
  const [tokenAdjustReason, setTokenAdjustReason] = useState(locale === 'en' ? 'Super Admin Special Bonus' : 'โบนัสพิเศษจาก Super Admin');

  // Slip preview modal
  const [previewSlipUrl, setPreviewSlipUrl] = useState<string | null>(null);

  const fetchOverview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (json.platformSettings) {
          setTrialActive(json.platformSettings.isTrialActive ?? true);
          setTrialDays(json.platformSettings.trialDays ?? 7);
          setPostTrialMonthlyRate(Math.round((json.platformSettings.postTrialMonthlyDiscountRate ?? 0.25) * 100));
          setPostTrialYearlyRate(Math.round((json.platformSettings.postTrialYearlyDiscountRate ?? 0.35) * 100));
          setStandardYearlyRate(Math.round((json.platformSettings.standardYearlyDiscountRate ?? 0.25) * 100));
          setVatRate(Math.round((json.platformSettings.defaultVatRate ?? 0.07) * 100));
          setWelcomeTokens(json.platformSettings.welcomeTokens ?? 30);
        }
      }
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleAdminAction = async (action: string, targetId: string, payload: any) => {
    try {
      const res = await fetch('/api/admin/overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, targetId, payload }),
      });
      const result = await res.json();
      if (result.success) {
        setActionMessage({ text: result.message, type: 'success' });
        fetchOverview();
      } else {
        setActionMessage({ text: result.message || 'Action failed', type: 'error' });
      }
    } catch {
      setActionMessage({ text: 'Network error performing action', type: 'error' });
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Download Compliance Audit CSV (Computer Crime Act Sec 26)
  const downloadComplianceCsv = () => {
    if (!data?.auditLogs?.length) return;
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Details'];
    const rows = data.auditLogs.map((log: any) => [
      `"${log.createdAt}"`,
      `"${log.userEmail}"`,
      `"${log.action}"`,
      `"${log.resource}"`,
      `"${JSON.stringify(log.details).replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RETZPOST_CCA_SEC26_TRAFFIC_AUDIT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = (data?.users || []).filter((u: any) => {
    const q = searchTerm.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q) ||
      u.workspace?.name?.toLowerCase().includes(q) ||
      u.lastLoginIp?.includes(q)
    );
  });

  // Sidebar navigation configuration
  const navItems: AdminNavItem[] = [
    {
      id: 'OVERVIEW',
      labelTh: 'ภาพรวมผู้บริหาร',
      labelEn: 'Executive Overview',
      subtextTh: 'รายได้ประจำและโทเคนในระบบ',
      subtextEn: 'MRR & Token Economy',
      icon: LayoutDashboard,
      section: 'INTELLIGENCE',
    },
    {
      id: 'USERS',
      labelTh: 'ผู้ใช้งานและบัญชีกลาง',
      labelEn: 'Users & Master Ledger',
      subtextTh: 'สิทธิ์ระบบและจัดสรรโควตา',
      subtextEn: 'User Accounts & Roles',
      icon: Users,
      section: 'GOVERNANCE',
      badge: data?.metrics?.totalUsers || undefined,
    },
    {
      id: 'BILLING',
      labelTh: 'ใบแจ้งหนี้และตรวจสลิป',
      labelEn: 'Invoices & PromptPay Slips',
      subtextTh: 'ตรวจสอบสลิปและภาษี e-Tax',
      subtextEn: 'Verify Slips & VAT 7%',
      icon: Receipt,
      section: 'GOVERNANCE',
      badge: data?.metrics?.pendingInvoicesCount || 0,
      badgeAlert: (data?.metrics?.pendingInvoicesCount || 0) > 0,
    },
    {
      id: 'LEGAL',
      labelTh: 'พ.ร.บ. คอมพิวเตอร์ และ PDPA',
      labelEn: 'Legal Compliance & Audit',
      subtextTh: 'บันทึกจราจร 90 วันตาม ม.26',
      subtextEn: 'CCA Sec 26 & DSAR Queue',
      icon: Scale,
      section: 'GOVERNANCE',
      badge: locale === 'en' ? 'Sec.26' : 'ม.26',
    },
    {
      id: 'CIRCUIT',
      labelTh: 'สวิตช์ตัดวงจรฉุกเฉิน',
      labelEn: 'Circuit Breakers',
      subtextTh: 'ตัดไฟฉุกเฉินและระงับ API',
      subtextEn: 'API Kill Switches & Freeze',
      icon: Zap,
      section: 'SYSTEM',
      badge: globalFreeze ? 'FREEZE' : undefined,
      badgeAlert: globalFreeze,
    },
    {
      id: 'SETTINGS',
      labelTh: 'ตั้งค่าแพลตฟอร์มและราคา',
      labelEn: 'Platform Settings & Pricing',
      subtextTh: 'ทดลองฟรี 7 วันและบันไดส่วนลด',
      subtextEn: '7-Day Trial & Promos',
      icon: Settings,
      section: 'SYSTEM',
    },
  ];

  const currentTabItem = navItems.find((item) => item.id === activeTab) || navItems[0];

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col md:flex-row font-sans selection:bg-brand-indigo selection:text-white">
      {/* =========================================================================
          1. MOBILE TOP APP BAR & TOGGLE
      ========================================================================= */}
      <div className="md:hidden bg-brand-indigo text-white px-4 py-3 flex items-center justify-between border-b border-brand-indigo-hover sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-editorial bg-accent-terracotta text-white flex items-center justify-center font-serif font-black text-xs shadow-xs">
            SA
          </div>
          <div>
            <span className="font-serif font-black text-sm tracking-tight text-white block leading-none">
              RETZPOST COMMAND
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/70">
              Super Admin Desk
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle variant="compact" />
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Toggle Navigation"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. MOBILE NAVIGATION DRAWER
      ========================================================================= */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-brand-indigo text-white flex flex-col h-full shadow-2xl z-10 border-r border-white/10">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-editorial bg-accent-terracotta text-white flex items-center justify-center font-serif font-black text-xs">
                  SA
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-white">Super Admin Console</h3>
                  <p className="text-[10px] font-mono text-white/60">Thai Compliance Center</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileNavOpen(false)}
                className="p-1 rounded text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation list */}
            <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileNavOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between transition-all ${
                      isActive 
                        ? 'bg-white/15 text-white font-bold border-l-3 border-accent-terracotta' 
                        : 'text-white/75 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent-terracotta' : 'text-white/60'}`} />
                      <div className="truncate">
                        <p className="text-xs">{locale === 'th' ? item.labelTh : item.labelEn}</p>
                        <p className="text-[10px] text-white/50">{locale === 'th' ? item.subtextTh : item.subtextEn}</p>
                      </div>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        item.badgeAlert ? 'bg-accent-terracotta text-white font-bold animate-pulse' : 'bg-white/15 text-white/80'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Footer */}
            <div className="p-3 border-t border-white/10 space-y-2">
              <Link
                href="/desk"
                className="w-full py-2 px-3 rounded-md bg-accent-terracotta hover:bg-accent-terracotta/90 text-white text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{locale === 'th' ? 'กลับโต๊ะปฏิบัติการ' : 'Back to Desk'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. DESKTOP SUPER ADMIN SIDEBAR (HIGH-END DOCK)
      ========================================================================= */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:h-screen md:sticky md:top-0 border-r border-brand-indigo-hover/40 bg-brand-indigo text-white z-30 shrink-0 select-none shadow-md">
        {/* Brand Masthead */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-editorial bg-accent-terracotta text-white flex items-center justify-center font-serif font-black text-sm shadow-sm ring-2 ring-white/10">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-serif font-black text-base tracking-tight text-white block leading-tight truncate">
                  RETZPOST COMMAND
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 block mt-0.5">
                Super Admin Console
              </span>
            </div>
          </div>

          {/* System Status Pill */}
          <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
            <span className="text-white/60">System Status:</span>
            {globalFreeze ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/40 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                GLOBAL FREEZE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                100% OPERATIONAL
              </span>
            )}
          </div>
        </div>

        {/* Grouped Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* Group 1: Intelligence */}
          <div>
            <div className="px-3 pb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 font-bold">
                {locale === 'th' ? 'ภาพรวมและรายได้' : 'CORE INTELLIGENCE'}
              </span>
            </div>
            <div className="space-y-1">
              {navItems.filter(i => i.section === 'INTELLIGENCE').map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between transition-all group ${
                      isActive
                        ? 'bg-white/15 text-white font-bold border-l-4 border-accent-terracotta shadow-xs'
                        : 'text-white/75 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-accent-terracotta' : 'text-white/50 group-hover:text-white/80'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-xs truncate leading-snug">
                          {locale === 'th' ? item.labelTh : item.labelEn}
                        </p>
                        <p className="text-[10px] text-white/50 truncate font-mono">
                          {locale === 'th' ? item.subtextTh : item.subtextEn}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 2: Operations & Governance */}
          <div>
            <div className="px-3 pb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 font-bold">
                {locale === 'th' ? 'การจัดการและกฎหมาย' : 'GOVERNANCE & AUDIT'}
              </span>
            </div>
            <div className="space-y-1">
              {navItems.filter(i => i.section === 'GOVERNANCE').map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between transition-all group ${
                      isActive
                        ? 'bg-white/15 text-white font-bold border-l-4 border-accent-terracotta shadow-xs'
                        : 'text-white/75 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-accent-terracotta' : 'text-white/50 group-hover:text-white/80'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-xs truncate leading-snug">
                          {locale === 'th' ? item.labelTh : item.labelEn}
                        </p>
                        <p className="text-[10px] text-white/50 truncate font-mono">
                          {locale === 'th' ? item.subtextTh : item.subtextEn}
                        </p>
                      </div>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded tabular-nums lining-nums ${
                        item.badgeAlert
                          ? 'bg-accent-terracotta text-white font-bold animate-pulse'
                          : 'bg-white/15 text-white/80 font-medium'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 3: System Controls */}
          <div>
            <div className="px-3 pb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 font-bold">
                {locale === 'th' ? 'ระบบและการตั้งค่า' : 'SYSTEM CONTROLS'}
              </span>
            </div>
            <div className="space-y-1">
              {navItems.filter(i => i.section === 'SYSTEM').map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between transition-all group ${
                      isActive
                        ? 'bg-white/15 text-white font-bold border-l-4 border-accent-terracotta shadow-xs'
                        : 'text-white/75 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-accent-terracotta' : 'text-white/50 group-hover:text-white/80'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-xs truncate leading-snug">
                          {locale === 'th' ? item.labelTh : item.labelEn}
                        </p>
                        <p className="text-[10px] text-white/50 truncate font-mono">
                          {locale === 'th' ? item.subtextTh : item.subtextEn}
                        </p>
                      </div>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        item.badgeAlert
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-white/15 text-white/80'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pulse Stats Card */}
        <div className="p-3 mx-3 mb-3 bg-white/5 rounded-editorial border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-white/60">Estimated MRR:</span>
            <span className="font-bold text-accent-terracotta tabular-nums lining-nums">
              ฿{data?.metrics?.mrrThb?.toLocaleString() || '0'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-white/60">Token Circulation:</span>
            <span className="font-bold text-white tabular-nums lining-nums inline-flex items-center gap-1">
              {data?.metrics?.totalTokensInCirculation?.toLocaleString() || '0'} <MasterTokenIcon size={12} className="text-accent-terracotta inline" />
            </span>
          </div>
        </div>

        {/* Sidebar Footer User & Quick Return */}
        <div className="p-3 border-t border-white/10 bg-black/15 space-y-2">
          <Link
            href="/desk"
            className="w-full py-2 px-3 rounded-md bg-accent-terracotta hover:bg-accent-terracotta/90 text-white text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === 'th' ? 'กลับโต๊ะปฏิบัติการ ' : 'Return to Operations Desk'}</span>
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                SA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">superadmin</p>
                <p className="text-[10px] text-white/50 font-mono truncate">superadmin@retzpost.io</p>
              </div>
            </div>
            <LanguageToggle variant="compact" />
          </div>
        </div>
      </aside>

      {/* =========================================================================
          4. MAIN CONTENT AREA (RIGHT SIDE)
      ========================================================================= */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Control Bar */}
        <header className="bg-paper-card border-b border-border-rule px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-ink-muted">Console</span>
            <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
            <span className="font-serif font-bold text-ink-primary text-sm sm:text-base">
              {locale === 'th' ? currentTabItem.labelTh : currentTabItem.labelEn}
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-brand-indigo/10 text-brand-indigo font-bold ml-1">
              Super Admin View
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchOverview}
              className="py-1.5 px-3 rounded-md border border-border-rule hover:bg-paper-raised text-ink-secondary text-xs font-mono flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t('admin.refreshData')}</span>
            </button>
            <Link
              href="/desk"
              className="hidden sm:flex py-1.5 px-3 rounded-md bg-accent-terracotta hover:bg-accent-terracotta/90 text-white text-xs font-bold font-mono items-center gap-1.5 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('admin.backToDesk')}</span>
            </Link>
          </div>
        </header>

        {/* Global Freeze Emergency Alert Banner */}
        {globalFreeze && (
          <div className="bg-semantic-error text-white px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
            <ShieldAlert className="w-4 h-4" />
            <span>{locale === 'en' ? 'Warning: Emergency circuit breaker active . All publishing is suspended.' : 'คำเตือน: ระบบตัดไฟฉุกเฉินเปิดใช้งานอยู่  การโพสต์ทั้งหมดถูกระงับชั่วคราว'}</span>
          </div>
        )}

        {/* Action Notification Message */}
        {actionMessage && (
          <div className={`p-3 text-center text-xs font-bold transition-all ${
            actionMessage.type === 'success' ? 'bg-semantic-success text-white' : 'bg-semantic-error text-white'
          }`}>
            {actionMessage.text}
          </div>
        )}

        {/* Main Tab Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Top Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-paper-card border border-border-rule rounded-editorial p-5 shadow-xs">
                  <span className="text-xs font-mono font-bold text-ink-secondary uppercase">
                    Monthly Recurring Revenue
                  </span>
                  <p className="font-serif font-black text-3xl text-brand-indigo mt-1 tabular-nums lining-nums">
                    ฿{data?.metrics?.mrrThb?.toLocaleString() || '0'}
                  </p>
                  <p className="text-[11px] text-ink-muted mt-1 font-mono">
                    {locale === 'en' ? 'Estimated monthly recurring revenue (THB)' : 'ประมาณการรายได้ประจำต่อเดือน'}
                  </p>
                </div>

                <div className="bg-paper-card border border-border-rule rounded-editorial p-5 shadow-xs">
                  <span className="text-xs font-mono font-bold text-ink-secondary uppercase">
                    Press Token in Circulation
                  </span>
                  <p className="font-serif font-black text-3xl text-accent-terracotta mt-1 tabular-nums lining-nums inline-flex items-center gap-1.5">
                    <span>{data?.metrics?.totalTokensInCirculation?.toLocaleString() || '0'}</span>
                    <MasterTokenIcon size={22} className="text-accent-terracotta inline" />
                  </p>
                  <p className="text-[11px] text-ink-muted mt-1 font-mono">
                    {locale === 'en' ? 'Total outstanding tokens across all user wallets' : 'เหรียญคงค้างในกระเป๋าผู้ใช้ทั้งหมด'}
                  </p>
                </div>

                <div className="bg-paper-card border border-border-rule rounded-editorial p-5 shadow-xs">
                  <span className="text-xs font-mono font-bold text-ink-secondary uppercase">
                    Total Users & Workspaces
                  </span>
                  <p className="font-serif font-black text-3xl text-ink-primary mt-1 tabular-nums lining-nums">
                    {data?.metrics?.totalUsers || 0} / {data?.metrics?.totalWorkspaces || 0}
                  </p>
                  <p className="text-[11px] text-ink-muted mt-1 font-mono">
                    {locale === 'th' ? 'บัญชีผู้ใช้งานและพื้นที่ทำงานทั้งหมด' : 'Total User Accounts & Workspaces'}
                  </p>
                </div>

                <div className="bg-paper-card border border-border-rule rounded-editorial p-5 shadow-xs">
                  <span className="text-xs font-mono font-bold text-ink-secondary uppercase">
                    Compliance Status (90 Days)
                  </span>
                  <p className="font-serif font-black text-2xl text-semantic-success mt-1 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" />
                    <span>100% Compliant</span>
                  </p>
                  <p className="text-[11px] text-ink-muted mt-1 font-mono">
                    {locale === 'en' ? `Retaining ${data?.metrics?.auditLogsRetainedCount || 0} computer traffic logs` : `เก็บบันทึก ${data?.metrics?.auditLogsRetainedCount || 0} จราจรคอมพิวเตอร์`}
                  </p>
                </div>
              </div>

              {/* Plan Tier Distribution */}
              <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs">
                <h3 className="font-serif font-bold text-lg text-ink-primary mb-4">
                  {locale === 'en' ? 'Plan Distribution by User Tier' : 'สัดส่วนผู้ใช้งานแยกตามแพ็กเกจแท่นพิมพ์ '}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3.5 rounded-md bg-paper-raised border border-border-rule text-center">
                    <p className="text-[11px] font-mono text-ink-secondary">Starter (฿0)</p>
                    <p className="font-serif font-black text-xl text-ink-primary mt-1 tabular-nums lining-nums">
                      {data?.metrics?.userTierCounts?.STARTER || 0}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-md bg-paper-raised border border-accent-terracotta/40 text-center">
                    <p className="text-[11px] font-mono text-accent-terracotta font-bold">Solo Press (฿79)</p>
                    <p className="font-serif font-black text-xl text-accent-terracotta mt-1 tabular-nums lining-nums">
                      {data?.metrics?.userTierCounts?.SOLO || 0}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-md bg-paper-raised border border-brand-indigo/40 text-center">
                    <p className="text-[11px] font-mono text-brand-indigo font-bold">Creator Team (฿199)</p>
                    <p className="font-serif font-black text-xl text-brand-indigo mt-1 tabular-nums lining-nums">
                      {data?.metrics?.userTierCounts?.CREATOR || 0}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-md bg-paper-raised border border-border-rule text-center">
                    <p className="text-[11px] font-mono text-ink-primary font-bold">Studio Pro (฿599)</p>
                    <p className="font-serif font-black text-xl text-ink-primary mt-1 tabular-nums lining-nums">
                      {data?.metrics?.userTierCounts?.STUDIO_PRO || 0}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-md bg-paper-raised border border-border-rule text-center">
                    <p className="text-[11px] font-mono text-purple-700 font-bold">Agency (฿1,490)</p>
                    <p className="font-serif font-black text-xl text-purple-700 mt-1 tabular-nums lining-nums">
                      {data?.metrics?.userTierCounts?.AGENCY || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS & TOKEN LEDGER */}
          {activeTab === 'USERS' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-ink-secondary absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder={locale === 'en' ? 'Search name, email, or IP...' : 'ค้นหาชื่อ อีเมล หรือ IP...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-border-rule bg-paper-card focus:outline-none focus:border-brand-indigo"
                  />
                </div>
                <span className="text-xs font-mono text-ink-secondary">
                  {locale === 'en' ? `Showing ${filteredUsers.length} accounts` : `แสดงผล ${filteredUsers.length} บัญชี`}
                </span>
              </div>

              <div className="bg-paper-card border border-border-rule rounded-editorial overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-paper-raised border-b border-border-rule font-mono uppercase text-ink-secondary">
                      <tr>
                        <th className="py-3 px-4">{locale === 'th' ? 'ผู้ใช้งานและสเปซ' : 'User & Workspace'}</th>
                        <th className="py-3 px-4">{locale === 'th' ? 'สิทธิ์และสถานะ' : 'Role & Status'}</th>
                        <th className="py-3 px-4">{locale === 'th' ? 'แพ็กเกจ' : 'Plan Tier'}</th>
                        <th className="py-3 px-4">{locale === 'th' ? 'ยอดโทเคนคงเหลือ' : 'Token Balance'}</th>
                        <th className="py-3 px-4">{locale === 'th' ? 'ไอพีเข้าสู่ระบบล่าสุด' : 'Last Login IP'}</th>
                        <th className="py-3 px-4 text-right">{locale === 'th' ? 'การจัดการ' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-rule/60">
                      {filteredUsers.map((user: any) => (
                        <tr key={user.id} className="hover:bg-paper-raised/50">
                          <td className="py-3 px-4">
                            <p className="font-bold text-ink-primary">{user.name || 'No Name'}</p>
                            <p className="text-[11px] text-ink-secondary font-mono">{user.email}</p>
                            {user.workspace && (
                              <p className="text-[10px] text-brand-indigo font-medium mt-0.5 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-brand-indigo shrink-0" />
                                <span>{user.workspace.name}</span>
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold mr-1.5 ${
                              user.systemRole === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.systemRole}
                            </span>
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              user.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800' 
                                : user.status === 'SUSPENDED' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={user.workspace?.planTier || user.activePlanTier || 'STARTER'}
                              onChange={(e) => {
                                if (user.workspace?.id) {
                                  handleAdminAction('UPDATE_PLAN', user.workspace.id, { planTier: e.target.value });
                                }
                              }}
                              className="text-xs font-mono py-1 px-2 rounded border border-border-rule bg-paper-canvas"
                            >
                              <option value="STARTER">STARTER (฿0)</option>
                              <option value="SOLO">SOLO (฿79)</option>
                              <option value="CREATOR">CREATOR (฿199)</option>
                              <option value="STUDIO_PRO">STUDIO_PRO (฿599)</option>
                              <option value="AGENCY">AGENCY (฿1,490)</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <span className="font-bold text-accent-terracotta tabular-nums lining-nums inline-flex items-center gap-1">
                              <span>{user.masterTokenBalance ?? user.workspace?.tokenBalance ?? 50}</span>
                              <MasterTokenIcon size={12} className="text-accent-terracotta inline" />
                            </span>
                            <span className="block text-[10px] text-ink-muted">
                              {user.masterTokenBalance != null ? 'Master Wallet' : 'Workspace Pool'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-ink-secondary">
                            {user.lastLoginIp || '127.0.0.1'}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => setTokenModalUser(user)}
                              className="py-1 px-2 rounded bg-accent-terracotta/10 text-accent-terracotta hover:bg-accent-terracotta/20 text-[11px] font-bold"
                            >
                              {locale === 'en' ? '+ Adjust Token' : '+ ปรับ Token'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
                                handleAdminAction('UPDATE_USER_STATUS', user.id, { status: newStatus });
                              }}
                              className={`py-1 px-2 rounded text-[11px] font-bold ${
                                user.status === 'ACTIVE'
                                  ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                  : 'bg-green-50 text-green-700 hover:bg-green-100'
                              }`}
                            >
                              {user.status === 'ACTIVE' ? (locale === 'en' ? 'Suspend' : 'ระงับ') : (locale === 'en' ? 'Unban' : 'ปลดแบน')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INVOICES, SLIPS & E-TAX */}
          {activeTab === 'BILLING' && (
            <div className="space-y-4">
              <div className="bg-paper-card border border-border-rule rounded-editorial overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-paper-raised border-b border-border-rule font-mono uppercase text-ink-secondary">
                      <tr>
                        <th className="py-3 px-4">{locale === 'th' ? 'รหัสใบแจ้งหนี้และวันที่' : 'Invoice ID & Date'}</th>
                        <th className="py-3 px-4">{locale === 'th' ? 'สเปซและแผน' : 'Workspace & Plan'}</th>
                        <th className="py-3 px-4">{locale === 'th' ? 'ยอดรวม (รวม VAT 7%)' : 'Total (VAT 7% included)'}</th>
                        <th className="py-3 px-4">{locale === 'th' ? 'ช่องทางชำระเงิน' : 'Payment Method'}</th>
                        <th className="py-3 px-4">{locale === 'th' ? 'สถานะการชำระ' : 'Payment Status'}</th>
                        <th className="py-3 px-4">{locale === 'th' ? 'ใบกำกับภาษี e-Tax (13 หลัก)' : 'e-Tax Invoice (13 digits)'}</th>
                        <th className="py-3 px-4 text-right">{locale === 'th' ? 'การจัดการสลิป' : 'Slip Management'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-rule/60">
                      {(data?.invoices || []).map((inv: any) => (
                        <tr key={inv.id} className="hover:bg-paper-raised/50">
                          <td className="py-3 px-4 font-mono">
                            <p className="font-bold text-ink-primary">{inv.id.slice(0, 16)}...</p>
                            <p className="text-[11px] text-ink-muted">{new Date(inv.createdAt).toLocaleString(locale === 'en' ? 'en-US' : 'th-TH')}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-ink-primary">{inv.workspaceName}</p>
                            <span className="inline-block px-1.5 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-mono text-[10px] font-bold">
                              {inv.planTier} ({inv.billingCycle})
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-ink-primary tabular-nums lining-nums">
                            ฿{inv.totalAmountThb?.toLocaleString()}
                            <span className="block text-[10px] text-ink-muted font-normal">
                              (VAT 7%: ฿{inv.vatAmountThb?.toLocaleString()})
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {inv.paymentMethod}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              inv.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {inv.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {inv.taxInvoiceRequested ? (
                              <div>
                                <p className="font-bold text-[11px] text-ink-primary">{inv.companyName}</p>
                                <p className="text-[10px] font-mono text-ink-secondary">Tax ID: {inv.taxId} ({inv.branchId})</p>
                              </div>
                            ) : (
                              <span className="text-ink-muted text-[11px]">{locale === 'en' ? '- General -' : '- ทั่วไป -'}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            {inv.promptPaySlipUrl && (
                              <button
                                type="button"
                                onClick={() => setPreviewSlipUrl(inv.promptPaySlipUrl)}
                                className="py-1 px-2 rounded bg-brand-indigo/10 text-brand-indigo hover:bg-brand-indigo/20 text-[11px] font-bold"
                              >
                                {locale === 'en' ? 'Verify Slip' : 'ตรวจสลิป'}
                              </button>
                            )}
                            {inv.paymentStatus === 'PENDING' && (
                              <button
                                type="button"
                                onClick={() => handleAdminAction('UPDATE_INVOICE_STATUS', inv.id, { status: 'COMPLETED' })}
                                className="py-1 px-2 rounded bg-semantic-success text-white text-[11px] font-bold hover:bg-semantic-success/90"
                              >
                                {locale === 'en' ? 'Approve' : 'อนุมัติ'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEGAL COMPLIANCE (PDPA & COMPUTER CRIME ACT SEC 26) */}
          {activeTab === 'LEGAL' && (
            <div className="space-y-8">
              {/* Thai Computer Crime Act Notice Banner */}
              <div className="bg-paper-raised border-2 border-brand-indigo/60 rounded-editorial p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-brand-indigo shrink-0" />
                    <h3 className="font-serif font-bold text-base text-ink-primary">
                      {locale === 'en' ? 'Computer Crime Act Sec. 26 Traffic Data Retention' : 'การจัดเก็บข้อมูลจราจรคอมพิวเตอร์ตาม พ.ร.บ. คอมพิวเตอร์ฯ ม.26 (Computer Crime Act Sec. 26)'}
                    </h3>
                  </div>
                  <p className="text-xs text-ink-secondary mt-1 max-w-3xl leading-relaxed">
                    {locale === 'en' ? 'RETZPOST continuously logs and retains computer traffic data  for not less than 90 days to identify users, timestamps, and network access points in full compliance with the Ministry of Digital Economy and Society regulations.' : 'ระบบ RETZPOST บันทึกข้อมูลจราจรคอมพิวเตอร์  ต่อเนื่องไม่น้อยกว่า 90 วัน เพื่อให้ระบุตัวบุคคล วัน เวลา และสถานที่ใช้งานได้ตามข้อกำหนดของกระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={downloadComplianceCsv}
                  className="py-2.5 px-4 rounded-btn bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold font-mono transition-colors flex items-center gap-2 shrink-0 shadow-xs"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{locale === 'en' ? 'Download 90-Day Audit Log (CSV)' : 'ดาวน์โหลด Log Audit 90 วัน'}</span>
                </button>
              </div>

              {/* PDPA DSAR Queue */}
              <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs">
                <h3 className="font-serif font-bold text-lg text-ink-primary mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-semantic-success" />
                  <span>{locale === 'en' ? 'PDPA Data Subject Access Request Queue (DSAR)' : 'คิวคำร้องขอใช้สิทธิ์เจ้าของข้อมูลส่วนบุคคล '}</span>
                </h3>
                <p className="text-xs text-ink-secondary mb-4">
                  {locale === 'en' ? 'Right of Access, Right to Erasure, and Right to Rectification requests under Thailand PDPA.' : 'สิทธิ์ในการเข้าถึงและขอรับสำเนา , สิทธิ์ในการลบทำลาย , และสิทธิ์ในการแก้ไข '}
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-paper-raised border-b border-border-rule font-mono uppercase text-ink-secondary">
                      <tr>
                        <th className="py-2.5 px-3">{locale === 'th' ? 'ผู้ยื่นคำร้อง' : 'Requester'}</th>
                        <th className="py-2.5 px-3">{locale === 'th' ? 'ประเภทสิทธิ์คำร้อง' : 'DSAR Request Type'}</th>
                        <th className="py-2.5 px-3">{locale === 'th' ? 'เหตุผลและความประสงค์' : 'Reason & Purpose'}</th>
                        <th className="py-2.5 px-3">{locale === 'th' ? 'วันที่ยื่นคำร้อง' : 'Submission Date'}</th>
                        <th className="py-2.5 px-3">{locale === 'th' ? 'สถานะ' : 'Status'}</th>
                        <th className="py-2.5 px-3 text-right">{locale === 'th' ? 'ดำเนินการ' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-rule/60">
                      {(data?.dsarRequests || []).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-ink-muted">
                            {locale === 'en' ? 'No pending PDPA requests in system' : 'ไม่มีคำร้อง PDPA ค้างอยู่ในระบบ'}
                          </td>
                        </tr>
                      ) : (
                        data.dsarRequests.map((dsar: any) => (
                          <tr key={dsar.id}>
                            <td className="py-2.5 px-3 font-mono font-bold text-ink-primary">
                              {dsar.userEmail}
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              <span className="px-2 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-bold text-[10px]">
                                {dsar.requestType}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-ink-secondary">
                              {dsar.reason || (locale === 'en' ? 'PDPA data export request' : 'ขอส่งออกข้อมูลตามสิทธิ์ PDPA')}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-ink-muted">
                              {new Date(dsar.requestedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'th-TH')}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                dsar.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {dsar.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {dsar.status === 'PENDING' && (
                                <button
                                  type="button"
                                  onClick={() => handleAdminAction('RESOLVE_DSAR', dsar.id, { status: 'COMPLETED' })}
                                  className="py-1 px-2.5 rounded bg-semantic-success text-white text-[11px] font-bold"
                                >
                                  {locale === 'en' ? 'Process & Resolve' : 'ประมวลผลและปิดคำร้อง'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Logs Sample Table */}
              <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs">
                <h3 className="font-serif font-bold text-lg text-ink-primary mb-3">
                  {locale === 'en' ? 'Recent Computer Operations & Audit Trail' : 'ตัวอย่างประวัติการปฏิบัติการคอมพิวเตอร์ล่าสุด '}
                </h3>
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-paper-raised sticky top-0 border-b border-border-rule uppercase text-ink-secondary">
                      <tr>
                        <th className="py-2 px-3">{locale === 'th' ? 'เวลาตามระบบ' : 'Timestamp'}</th>
                        <th className="py-2 px-3">{locale === 'th' ? 'ผู้ดำเนินการ' : 'Actor'}</th>
                        <th className="py-2 px-3">{locale === 'th' ? 'การกระทำ' : 'Action'}</th>
                        <th className="py-2 px-3">{locale === 'th' ? 'หมวดหมู่' : 'Resource'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-rule/60">
                      {(data?.auditLogs || []).slice(0, 15).map((log: any) => (
                        <tr key={log.id} className="hover:bg-paper-raised/40">
                          <td className="py-2 px-3 text-ink-muted">
                            {new Date(log.createdAt).toLocaleString(locale === 'en' ? 'en-US' : 'th-TH')}
                          </td>
                          <td className="py-2 px-3 font-bold text-ink-primary">
                            {log.userEmail}
                          </td>
                          <td className="py-2 px-3 text-brand-indigo font-bold">
                            {log.action}
                          </td>
                          <td className="py-2 px-3 text-ink-secondary">
                            {log.resource}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CIRCUIT BREAKERS & PLATFORM KILL SWITCHES */}
          {activeTab === 'CIRCUIT' && (
            <div className="space-y-6">
              <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-accent-terracotta">
                  <Flame className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-lg text-ink-primary">
                    {locale === 'en' ? 'Platform Emergency Circuit Breakers' : 'ระบบตัดไฟฉุกเฉินระดับแพลตฟอร์ม '}
                  </h3>
                </div>
                <p className="text-xs text-ink-secondary mb-6 leading-relaxed">
                  {locale === 'en' ? 'In the event of external Social API outages, urgent policy updates, or critical security incidents, you can immediately halt dispatches to that platform without affecting others.' : 'ในกรณีที่ Social API ภายนอกขัดข้อง มีการเปลี่ยนแปลงข้อกำหนดเร่งด่วน หรือเกิดเหตุการณ์ความปลอดภัยร้ายแรง คุณสามารถหยุดการยิงโพสต์ของแพลตฟอร์มนั้นๆ ได้ทันทีโดยไม่กระทบแพลตฟอร์มอื่น'}
                </p>

                {/* Global Emergency Publishing Freeze */}
                <div className="p-4 mb-6 rounded-editorial border-2 border-red-500/40 bg-red-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-serif font-bold text-sm text-red-900 block">
                      {locale === 'en' ? 'Global Publishing Freeze Switch' : 'สวิตช์แช่แข็งการเผยแพร่ทั้งแพลตฟอร์ม '}
                    </span>
                    <span className="text-xs text-red-700">
                      {locale === 'en' ? 'Immediately suspend dispatch queues across all channels platform-wide. Recommended for high-severity emergency situations.' : 'หยุดคิวเผยแพร่ทุกช่องทางทั่วทั้งระบบทันที เหมาะสำหรับกรณีฉุกเฉินระดับวิกฤต'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGlobalFreeze(!globalFreeze)}
                    className={`py-2 px-4 rounded font-mono text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 ${
                      globalFreeze 
                        ? 'bg-red-700 text-white hover:bg-red-800' 
                        : 'bg-paper-card border border-red-300 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    <AlertOctagon className="w-4 h-4 inline mr-1" />
                    <span>{globalFreeze ? (locale === 'en' ? 'Unfreeze All Dispatches' : 'ปลดล็อกการแช่แข็ง') : (locale === 'en' ? 'Freeze All Dispatches' : 'แช่แข็งการยิงโพสต์ทั้งหมด')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Meta */}
                  <div className={`p-5 rounded-editorial border ${metaActive ? 'border-border-rule bg-paper-raised' : 'border-red-400 bg-red-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-ink-primary">Meta Graph API</span>
                      <span className={`w-3 h-3 rounded-full ${metaActive ? 'bg-semantic-success' : 'bg-semantic-error'}`} />
                    </div>
                    <p className="text-xs text-ink-secondary mb-4">
                      Facebook Pages & Instagram Stories / Reels
                    </p>
                    <button
                      type="button"
                      onClick={() => setMetaActive(!metaActive)}
                      className={`w-full py-1.5 px-3 rounded text-xs font-bold ${
                        metaActive ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {metaActive ? (locale === 'en' ? 'Pause Meta Dispatches' : 'พักการยิง Meta ชั่วคราว') : (locale === 'en' ? 'Resume Meta Dispatches' : 'เปิดใช้งาน Meta ตามปกติ')}
                    </button>
                  </div>

                  {/* YouTube */}
                  <div className={`p-5 rounded-editorial border ${youtubeActive ? 'border-border-rule bg-paper-raised' : 'border-red-400 bg-red-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-ink-primary">YouTube Data v3 API</span>
                      <span className={`w-3 h-3 rounded-full ${youtubeActive ? 'bg-semantic-success' : 'bg-semantic-error'}`} />
                    </div>
                    <p className="text-xs text-ink-secondary mb-4">
                      YouTube Shorts & Standard Video Uploads
                    </p>
                    <button
                      type="button"
                      onClick={() => setYoutubeActive(!youtubeActive)}
                      className={`w-full py-1.5 px-3 rounded text-xs font-bold ${
                        youtubeActive ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {youtubeActive ? (locale === 'en' ? 'Pause YouTube' : 'พักการยิง YouTube') : (locale === 'en' ? 'Resume YouTube' : 'เปิดใช้งาน YouTube')}
                    </button>
                  </div>

                  {/* TikTok */}
                  <div className={`p-5 rounded-editorial border ${tiktokActive ? 'border-border-rule bg-paper-raised' : 'border-red-400 bg-red-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-ink-primary">TikTok Commercial API</span>
                      <span className={`w-3 h-3 rounded-full ${tiktokActive ? 'bg-semantic-success' : 'bg-semantic-error'}`} />
                    </div>
                    <p className="text-xs text-ink-secondary mb-4">
                      TikTok Direct Post & Inbox Notifications
                    </p>
                    <button
                      type="button"
                      onClick={() => setTiktokActive(!tiktokActive)}
                      className={`w-full py-1.5 px-3 rounded text-xs font-bold ${
                        tiktokActive ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {tiktokActive ? (locale === 'en' ? 'Pause TikTok' : 'พักการยิง TikTok') : (locale === 'en' ? 'Resume TikTok' : 'เปิดใช้งาน TikTok')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PLATFORM SETTINGS & PRICING */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-6">
              {/* Header intro */}
              <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-ink-primary flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-accent-terracotta" />
                    <span>{locale === 'en' ? 'Platform Engine Settings & Token Economy' : 'การตั้งค่าแพลตฟอร์ม แท่นพิมพ์ & โทเคน '}</span>
                  </h3>
                  <p className="text-xs text-ink-secondary mt-1">
                    {locale === 'en' ? 'Configure 7-day free trial terms, promotion ladders, token consumption rates, and VAT (7%) calculation.' : 'ปรับแต่งเงื่อนไขการทดลองใช้ฟรี 7 วัน โปรโมชั่นลดพิเศษ อัตราสิ้นเปลืองโทเคน และการคำนวณภาษีมูลค่าเพิ่ม (VAT 7%)'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleAdminAction('UPDATE_PLATFORM_SETTINGS', 'global', {
                      isTrialActive: trialActive,
                      trialDays: Number(trialDays),
                      postTrialMonthlyDiscountRate: postTrialMonthlyRate / 100,
                      postTrialYearlyDiscountRate: postTrialYearlyRate / 100,
                      standardYearlyDiscountRate: standardYearlyRate / 100,
                      defaultVatRate: vatRate / 100,
                      welcomeTokens: Number(welcomeTokens),
                    });
                  }}
                  className="py-2.5 px-5 rounded-btn bg-accent-terracotta hover:bg-accent-terracotta/90 text-white text-xs font-bold font-mono transition-colors shadow-xs flex items-center gap-2 shrink-0"
                >
                  <Check className="w-4 h-4" />
                  <span>{locale === 'en' ? 'Save Platform Settings' : 'บันทึกการตั้งค่าแพลตฟอร์ม'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Box 1: 7-Day Free Trial */}
                <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border-rule pb-3">
                    <h4 className="font-serif font-bold text-base text-ink-primary flex items-center gap-2">
                      <span>{locale === 'en' ? 'Free Trial System' : 'ระบบทดลองใช้งานฟรี '}</span>
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={trialActive}
                        onChange={(e) => setTrialActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-paper-canvas border border-border-rule peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-semantic-success"></div>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-ink-secondary mb-1">
                        {locale === 'en' ? 'Trial Duration ' : 'จำนวนวันทดลองใช้งานฟรี '}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={trialDays}
                          onChange={(e) => setTrialDays(Number(e.target.value))}
                          className="w-24 px-3 py-1.5 text-xs font-mono rounded border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo tabular-nums lining-nums"
                        />
                        <span className="text-xs text-ink-secondary">{locale === 'en' ? 'Days (Default: 7 days for Solo Press ฿79)' : 'วัน (ค่าเริ่มต้น: 7 วัน สำหรับ Solo Press ฿79)'}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-ink-secondary bg-paper-raised p-3 rounded border border-border-rule/80 leading-relaxed">
                      <strong>{locale === 'en' ? 'Terms:' : 'เงื่อนไข:'}</strong>{' '}
                      {locale === 'en'
                        ? 'Free trial users pay ฿0 upfront, receive 1 Workspace, 5 channels, and 150 Press Tokens. Upon 7-day expiration, special promotional discounts will display.'
                        : 'ผู้ใช้ทดลองฟรีไม่ต้องจ่ายเงินล่วงหน้า (฿0.00) ในวันแรก ได้สิทธิ์ 1 Workspace, 5 ช่องทาง, 150 Press Tokens เมื่อครบกำหนด 7 วัน ระบบจะแสดงข้อเสนอโปรโมชั่นส่วนลดพิเศษ'}
                    </p>
                  </div>
                </div>

                {/* Box 2: Post-Trial Promo Ladder */}
                <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs space-y-4">
                  <div className="border-b border-border-rule pb-3">
                    <h4 className="font-serif font-bold text-base text-ink-primary flex items-center gap-2">
                      <span>{locale === 'en' ? 'Post-Trial Promotion Ladder ' : 'บันไดส่วนลดหลังหมดทดลอง '}</span>
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-ink-primary">{locale === 'en' ? 'Monthly Discount (First 3 Months)' : 'ส่วนลดรายเดือน (3 เดือนแรก)'}</p>
                        <p className="text-[10px] text-ink-muted">{locale === 'en' ? 'Solo Press: ฿59.25/mo' : 'Solo Press เหลือ ฿59.25/ด.'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="90"
                          value={postTrialMonthlyRate}
                          onChange={(e) => setPostTrialMonthlyRate(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs font-mono rounded border border-border-rule bg-paper-canvas text-right tabular-nums lining-nums"
                        />
                        <span className="text-xs font-mono">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-ink-primary">{locale === 'en' ? 'Special Annual Discount (1st Year)' : 'ส่วนลดรายปีพิเศษ (1 ปีแรก)'}</p>
                        <p className="text-[10px] text-ink-muted">{locale === 'en' ? 'Solo Press: ฿462.15/yr' : 'Solo Press เหลือ ฿462.15/ปี'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="90"
                          value={postTrialYearlyRate}
                          onChange={(e) => setPostTrialYearlyRate(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs font-mono rounded border border-border-rule bg-paper-canvas text-right tabular-nums lining-nums"
                        />
                        <span className="text-xs font-mono">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-border-rule/60">
                      <div>
                        <p className="text-xs font-bold text-ink-primary">{locale === 'en' ? 'Standard Annual Discount ' : 'ส่วนลดรายปีมาตรฐาน '}</p>
                        <p className="text-[10px] text-ink-muted">{locale === 'en' ? 'Pay 9 months, get 12 months access' : 'เทียบเท่าจ่าย 9 เดือน ใช้ได้ 12 เดือน'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={standardYearlyRate}
                          onChange={(e) => setStandardYearlyRate(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs font-mono rounded border border-border-rule bg-paper-canvas text-right tabular-nums lining-nums"
                        />
                        <span className="text-xs font-mono">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Box 3: Master Token Action Rates */}
                <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs space-y-4">
                  <div className="border-b border-border-rule pb-3">
                    <h4 className="font-serif font-bold text-base text-ink-primary flex items-center gap-2">
                      <span>{locale === 'en' ? 'Master Token Action Rates' : 'อัตราหักเหรียญ Master Token กลาง'}</span>
                    </h4>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-border-rule/40">
                      <span className="text-ink-secondary">{locale === 'en' ? 'Welcome Bonus (New Users)' : 'เหรียญต้อนรับผู้ใช้ใหม่ '}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={welcomeTokens}
                          onChange={(e) => setWelcomeTokens(Number(e.target.value))}
                          className="w-16 px-2 py-0.5 text-xs font-mono rounded border border-border-rule bg-paper-canvas text-right font-bold text-accent-terracotta tabular-nums lining-nums"
                        />
                        <span className="font-mono text-ink-muted">Tokens</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-border-rule/40">
                      <span className="text-ink-secondary">{locale === 'en' ? 'AI Post Diagnosis (Analyze Weaknesses)' : 'AI Post Diagnosis (วิเคราะห์จุดอ่อนโพสต์)'}</span>
                      <span className="font-mono font-bold text-accent-terracotta tabular-nums lining-nums">5 Tokens</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-border-rule/40">
                      <span className="text-ink-secondary">{locale === 'en' ? 'AI KPI Strategy Coaching' : 'AI KPI Strategy Coaching (โค้ชกลยุทธ์ AI)'}</span>
                      <span className="font-mono font-bold text-accent-terracotta tabular-nums lining-nums">10 Tokens</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-border-rule/40">
                      <span className="text-ink-secondary">{locale === 'en' ? 'Force Sync Telemetry (Quick Fetch)' : 'Force Sync Telemetry (ดึงสถิติด่วน)'}</span>
                      <span className="font-mono font-bold text-accent-terracotta tabular-nums lining-nums">2 Tokens</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-ink-secondary">{locale === 'en' ? 'Auto-Frame Aspect Ratio' : 'Auto-Frame Aspect Ratio (ปรับสัดส่วนภาพ)'}</span>
                      <span className="font-mono font-bold text-accent-terracotta tabular-nums lining-nums">5 Tokens</span>
                    </div>
                  </div>
                </div>

                {/* Box 4: Thai Tax & Legal */}
                <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs space-y-4">
                  <div className="border-b border-border-rule pb-3">
                    <h4 className="font-serif font-bold text-base text-ink-primary flex items-center gap-2">
                      <span>{locale === 'en' ? 'VAT & Legal Corporate Information' : 'ภาษีมูลค่าเพิ่มและข้อมูลนิติบุคคล'}</span>
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-ink-primary">{locale === 'en' ? 'Value Added Tax (VAT Rate)' : 'อัตราภาษีมูลค่าเพิ่ม'}</p>
                        <p className="text-[10px] text-ink-muted">{locale === 'en' ? 'Calculated and itemized on e-Tax Invoice' : 'คำนวณแยกแสดงใน e-Tax Invoice'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={vatRate}
                          onChange={(e) => setVatRate(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs font-mono rounded border border-border-rule bg-paper-canvas text-right tabular-nums lining-nums"
                        />
                        <span className="text-xs font-mono">%</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border-rule/60 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-ink-secondary">{locale === 'en' ? 'Service Provider Legal Entity:' : 'ชื่อนิติบุคคลผู้ให้บริการ:'}</span>
                        <span className="font-bold text-ink-primary">RETZPOST (THAILAND) CO., LTD.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-secondary">{locale === 'en' ? 'Tax Identification Number (13 digits):' : 'เลขประจำตัวผู้เสียภาษี (13 หลัก):'}</span>
                        <span className="font-mono text-ink-primary font-bold tabular-nums lining-nums">0105567012345</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-secondary">{locale === 'en' ? 'CCA Sec. 26 Traffic Log:' : 'Log พ.ร.บ. คอมฯ ม.26:'}</span>
                        <span className="text-semantic-success font-bold font-mono">{locale === 'en' ? '90 Days Automated (Compliant)' : '90 วันอัตโนมัติ'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Adjust Tokens Modal */}
      {tokenModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper-card border-2 border-brand-indigo rounded-editorial max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-ink-primary">
              {locale === 'en' ? `Adjust Press Tokens for ${tokenModalUser.name}` : `ปรับเหรียญ Press Token สำหรับ ${tokenModalUser.name}`}
            </h3>
            <p className="text-xs text-ink-secondary">
              {locale === 'en' ? 'Current Balance: ' : 'ยอดคงเหลือปัจจุบัน: '}<span className="font-bold font-mono text-accent-terracotta tabular-nums lining-nums inline-flex items-center gap-1">{tokenModalUser.workspace?.tokenBalance ?? 50} <MasterTokenIcon size={12} className="inline text-accent-terracotta" /></span>
            </p>

            <div>
              <label className="block text-xs font-bold text-ink-secondary mb-1">
                {locale === 'en' ? 'Tokens to Add (+) or Deduct (-)' : 'จำนวนเหรียญที่ต้องการเพิ่ม (+) หรือลด'}
              </label>
              <input
                type="number"
                value={tokenAdjustAmount}
                onChange={(e) => setTokenAdjustAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo tabular-nums lining-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-secondary mb-1">
                {locale === 'en' ? 'Audit Log Reason' : 'เหตุผลในการปรับยอด'}
              </label>
              <input
                type="text"
                value={tokenAdjustReason}
                onChange={(e) => setTokenAdjustReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTokenModalUser(null)}
                className="py-1.5 px-3 rounded border border-border-rule text-xs font-medium text-ink-secondary hover:text-ink-primary"
              >
                {locale === 'en' ? 'Cancel' : 'ยกเลิก'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (tokenModalUser.workspace?.id) {
                    handleAdminAction('ADJUST_TOKENS', tokenModalUser.workspace.id, {
                      amount: tokenAdjustAmount,
                      reason: tokenAdjustReason,
                    });
                  }
                  setTokenModalUser(null);
                }}
                className="py-1.5 px-4 rounded bg-accent-terracotta hover:bg-accent-terracotta/90 text-white text-xs font-bold"
              >
                {locale === 'en' ? 'Save Token Adjustment' : 'บันทึกการปรับยอด'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slip Preview Modal */}
      {previewSlipUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper-card border border-border-rule rounded-editorial max-w-sm w-full p-6 shadow-xl space-y-4 text-center">
            <h3 className="font-serif font-bold text-base text-ink-primary">
              {locale === 'en' ? 'PromptPay Payment Slip Evidence' : 'หลักฐานสลิปการโอนเงิน'}
            </h3>
            <div className="p-2 bg-paper-canvas rounded border border-border-rule flex items-center justify-center min-h-[200px]">
              {previewSlipUrl.startsWith('data:image') || previewSlipUrl.startsWith('http') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewSlipUrl} alt="PromptPay Slip" className="max-h-60 rounded object-contain" />
              ) : (
                <p className="text-xs text-ink-secondary font-mono">{previewSlipUrl}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPreviewSlipUrl(null)}
              className="w-full py-2 px-4 rounded bg-brand-indigo text-white text-xs font-bold"
            >
              {locale === 'en' ? 'Close Window' : 'ปิดหน้าต่าง'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
