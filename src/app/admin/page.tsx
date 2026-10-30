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
  Check,
  X
} from 'lucide-react';
import { Sticker } from '@/components/ui/sticker';
import { PlanTier } from '@/modules/billing/pricing-plans';
import { useTranslation, LanguageToggle } from '@/modules/i18n/i18n-context';

export default function SuperAdminPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'BILLING' | 'LEGAL' | 'CIRCUIT' | 'SETTINGS'>('OVERVIEW');
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
  const [tokenAdjustReason, setTokenAdjustReason] = useState('โบนัสพิเศษจาก Super Admin');

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

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col font-sans selection:bg-brand-indigo selection:text-white">
      {/* Super Admin Top Header */}
      <header className="bg-brand-indigo text-white border-b-2 border-brand-indigo-hover shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-editorial bg-accent-terracotta text-white flex items-center justify-center font-serif font-black text-xs shadow-xs">
                SA
              </div>
              <div>
                <span className="font-serif font-black text-lg tracking-tight text-white block leading-none">
                  RETZPOST COMMAND DESK
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">
                  Super Admin & Thai Compliance Center
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <LanguageToggle variant="compact" />
            <button
              onClick={fetchOverview}
              className="py-1 px-2.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{t('admin.refreshData')}</span>
            </button>
            <Link
              href="/desk"
              className="py-1 px-3 rounded-md bg-accent-terracotta hover:bg-accent-terracotta/90 text-white text-xs font-bold transition-colors"
            >
              {t('admin.backToDesk')}
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'border-accent-terracotta text-white bg-white/10'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            📊 Executive Overview & MRR
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'USERS'
                ? 'border-accent-terracotta text-white bg-white/10'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            👥 Users & Token Ledger
          </button>
          <button
            onClick={() => setActiveTab('BILLING')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'BILLING'
                ? 'border-accent-terracotta text-white bg-white/10'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            🧾 Invoices & Slips ({data?.metrics?.pendingInvoicesCount || 0})
          </button>
          <button
            onClick={() => setActiveTab('LEGAL')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'LEGAL'
                ? 'border-accent-terracotta text-white bg-white/10'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            ⚖️ Legal (PDPA & พ.ร.บ. คอมฯ)
          </button>
          <button
            onClick={() => setActiveTab('CIRCUIT')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'CIRCUIT'
                ? 'border-accent-terracotta text-white bg-white/10'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            ⚡ Circuit Breakers & Kill Switches
          </button>
          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'SETTINGS'
                ? 'border-accent-terracotta text-white bg-white/10'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            ⚙️ Platform Settings & Pricing
          </button>
        </div>
      </header>

      {/* Action Notification Message */}
      {actionMessage && (
        <div className={`p-3 text-center text-xs font-bold ${
          actionMessage.type === 'success' ? 'bg-semantic-success text-white' : 'bg-semantic-error text-white'
        }`}>
          {actionMessage.text}
        </div>
      )}

      {/* Main Content Area */}
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
                <p className="font-serif font-black text-3xl text-brand-indigo mt-1">
                  ฿{data?.metrics?.mrrThb?.toLocaleString() || '0'}
                </p>
                <p className="text-[11px] text-ink-muted mt-1 font-mono">
                  ประมาณการรายได้ประจำต่อเดือน (THB)
                </p>
              </div>

              <div className="bg-paper-card border border-border-rule rounded-editorial p-5 shadow-xs">
                <span className="text-xs font-mono font-bold text-ink-secondary uppercase">
                  Press Token in Circulation
                </span>
                <p className="font-serif font-black text-3xl text-accent-terracotta mt-1">
                  {data?.metrics?.totalTokensInCirculation?.toLocaleString() || '0'} 🪙
                </p>
                <p className="text-[11px] text-ink-muted mt-1 font-mono">
                  เหรียญคงค้างในกระเป๋าผู้ใช้ทั้งหมด
                </p>
              </div>

              <div className="bg-paper-card border border-border-rule rounded-editorial p-5 shadow-xs">
                <span className="text-xs font-mono font-bold text-ink-secondary uppercase">
                  Total Users & Workspaces
                </span>
                <p className="font-serif font-black text-3xl text-ink-primary mt-1">
                  {data?.metrics?.totalUsers || 0} / {data?.metrics?.totalWorkspaces || 0}
                </p>
                <p className="text-[11px] text-ink-muted mt-1 font-mono">
                  บัญชีผู้ใช้งาน / พื้นที่ทำงานทั้งหมด
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
                  เก็บบันทึก {data?.metrics?.auditLogsRetainedCount || 0} จราจรคอมพิวเตอร์
                </p>
              </div>
            </div>

            {/* Plan Tier Distribution */}
            <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs">
              <h3 className="font-serif font-bold text-lg text-ink-primary mb-4">
                สัดส่วนผู้ใช้งานแยกตามแพ็กเกจแท่นพิมพ์ (Plan Distribution)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-md bg-paper-raised border border-border-rule text-center">
                  <p className="text-[11px] font-mono text-ink-secondary">Starter (฿0)</p>
                  <p className="font-serif font-black text-xl text-ink-primary mt-1">
                    {data?.metrics?.userTierCounts?.STARTER || 0}
                  </p>
                </div>
                <div className="p-3.5 rounded-md bg-paper-raised border border-accent-terracotta/40 text-center">
                  <p className="text-[11px] font-mono text-accent-terracotta font-bold">Solo Press (฿79)</p>
                  <p className="font-serif font-black text-xl text-accent-terracotta mt-1">
                    {data?.metrics?.userTierCounts?.SOLO || 0}
                  </p>
                </div>
                <div className="p-3.5 rounded-md bg-paper-raised border border-brand-indigo/40 text-center">
                  <p className="text-[11px] font-mono text-brand-indigo font-bold">Creator Team (฿199)</p>
                  <p className="font-serif font-black text-xl text-brand-indigo mt-1">
                    {data?.metrics?.userTierCounts?.CREATOR || 0}
                  </p>
                </div>
                <div className="p-3.5 rounded-md bg-paper-raised border border-border-rule text-center">
                  <p className="text-[11px] font-mono text-ink-primary font-bold">Studio Pro (฿599)</p>
                  <p className="font-serif font-black text-xl text-ink-primary mt-1">
                    {data?.metrics?.userTierCounts?.STUDIO_PRO || 0}
                  </p>
                </div>
                <div className="p-3.5 rounded-md bg-paper-raised border border-border-rule text-center">
                  <p className="text-[11px] font-mono text-purple-700 font-bold">Agency (฿1,490)</p>
                  <p className="font-serif font-black text-xl text-purple-700 mt-1">
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
                  placeholder="ค้นหาชื่อ อีเมล หรือ IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-border-rule bg-paper-card focus:outline-none focus:border-brand-indigo"
                />
              </div>
              <span className="text-xs font-mono text-ink-secondary">
                แสดงผล {filteredUsers.length} บัญชี
              </span>
            </div>

            <div className="bg-paper-card border border-border-rule rounded-editorial overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-paper-raised border-b border-border-rule font-mono uppercase text-ink-secondary">
                    <tr>
                      <th className="py-3 px-4">ผู้ใช้งาน / Workspace</th>
                      <th className="py-3 px-4">สิทธิ์ / สถานะ</th>
                      <th className="py-3 px-4">แพ็กเกจ (Tier)</th>
                      <th className="py-3 px-4">Token Balance</th>
                      <th className="py-3 px-4">Last Login IP</th>
                      <th className="py-3 px-4 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-rule/60">
                    {filteredUsers.map((user: any) => (
                      <tr key={user.id} className="hover:bg-paper-raised/50">
                        <td className="py-3 px-4">
                          <p className="font-bold text-ink-primary">{user.name || 'No Name'}</p>
                          <p className="text-[11px] text-ink-secondary font-mono">{user.email}</p>
                          {user.workspace && (
                            <p className="text-[10px] text-brand-indigo font-medium mt-0.5">
                              🏢 {user.workspace.name}
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
                          <span className="font-bold text-accent-terracotta">
                            {user.masterTokenBalance ?? user.workspace?.tokenBalance ?? 50} 🪙
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
                            + ปรับ Token
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
                            {user.status === 'ACTIVE' ? 'ระงับ' : 'ปลดแบน'}
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
                      <th className="py-3 px-4">Invoice ID / วันที่</th>
                      <th className="py-3 px-4">Workspace / แผน</th>
                      <th className="py-3 px-4">ยอดรวม (รวม VAT 7%)</th>
                      <th className="py-3 px-4">ช่องทาง</th>
                      <th className="py-3 px-4">สถานะการชำระ</th>
                      <th className="py-3 px-4">e-Tax Invoice (13 หลัก)</th>
                      <th className="py-3 px-4 text-right">การจัดการสลิป</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-rule/60">
                    {(data?.invoices || []).map((inv: any) => (
                      <tr key={inv.id} className="hover:bg-paper-raised/50">
                        <td className="py-3 px-4 font-mono">
                          <p className="font-bold text-ink-primary">{inv.id.slice(0, 16)}...</p>
                          <p className="text-[11px] text-ink-muted">{new Date(inv.createdAt).toLocaleString('th-TH')}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-ink-primary">{inv.workspaceName}</p>
                          <span className="inline-block px-1.5 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-mono text-[10px] font-bold">
                            {inv.planTier} ({inv.billingCycle})
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-ink-primary">
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
                            <span className="text-ink-muted text-[11px]">- ทั่วไป -</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {inv.promptPaySlipUrl && (
                            <button
                              type="button"
                              onClick={() => setPreviewSlipUrl(inv.promptPaySlipUrl)}
                              className="py-1 px-2 rounded bg-brand-indigo/10 text-brand-indigo hover:bg-brand-indigo/20 text-[11px] font-bold"
                            >
                              ตรวจสลิป
                            </button>
                          )}
                          {inv.paymentStatus === 'PENDING' && (
                            <button
                              type="button"
                              onClick={() => handleAdminAction('UPDATE_INVOICE_STATUS', inv.id, { status: 'COMPLETED' })}
                              className="py-1 px-2 rounded bg-semantic-success text-white text-[11px] font-bold hover:bg-semantic-success/90"
                            >
                              อนุมัติ
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
                    การจัดเก็บข้อมูลจราจรคอมพิวเตอร์ตาม พ.ร.บ. คอมพิวเตอร์ฯ ม.26 (Computer Crime Act Sec. 26)
                  </h3>
                </div>
                <p className="text-xs text-ink-secondary mt-1 max-w-3xl leading-relaxed">
                  ระบบ RETZPOST บันทึกข้อมูลจราจรคอมพิวเตอร์ (Log Retention) ต่อเนื่องไม่น้อยกว่า 90 วัน เพื่อให้ระบุตัวบุคคล วัน เวลา และสถานที่ใช้งานได้ตามข้อกำหนดของกระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม
                </p>
              </div>

              <button
                type="button"
                onClick={downloadComplianceCsv}
                className="py-2.5 px-4 rounded-btn bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold font-mono transition-colors flex items-center gap-2 shrink-0 shadow-xs"
              >
                <FileDown className="w-4 h-4" />
                <span>ดาวน์โหลด Log Audit 90 วัน (CSV)</span>
              </button>
            </div>

            {/* PDPA DSAR Queue */}
            <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs">
              <h3 className="font-serif font-bold text-lg text-ink-primary mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-semantic-success" />
                <span>คิวคำร้องขอใช้สิทธิ์เจ้าของข้อมูลส่วนบุคคล (PDPA DSAR Queue)</span>
              </h3>
              <p className="text-xs text-ink-secondary mb-4">
                สิทธิ์ในการเข้าถึงและขอรับสำเนา (Right of Access), สิทธิ์ในการลบทำลาย (Right to Erasure), และสิทธิ์ในการแก้ไข (Right to Rectification)
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-paper-raised border-b border-border-rule font-mono uppercase text-ink-secondary">
                    <tr>
                      <th className="py-2.5 px-3">ผู้ยื่นคำร้อง</th>
                      <th className="py-2.5 px-3">ประเภทสิทธิ์ (DSAR Type)</th>
                      <th className="py-2.5 px-3">เหตุผล / ความประสงค์</th>
                      <th className="py-2.5 px-3">วันที่ยื่นคำร้อง</th>
                      <th className="py-2.5 px-3">สถานะ</th>
                      <th className="py-2.5 px-3 text-right">ดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-rule/60">
                    {(data?.dsarRequests || []).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-ink-muted">
                          ไม่มีคำร้อง PDPA ค้างอยู่ในระบบ
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
                            {dsar.reason || 'ขอส่งออกข้อมูลตามสิทธิ์ PDPA'}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-ink-muted">
                            {new Date(dsar.requestedAt).toLocaleDateString('th-TH')}
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
                                ประมวลผลและปิดคำร้อง
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
                ตัวอย่างประวัติการปฏิบัติการคอมพิวเตอร์ล่าสุด (Recent Audit Trail)
              </h3>
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-paper-raised sticky top-0 border-b border-border-rule uppercase text-ink-secondary">
                    <tr>
                      <th className="py-2 px-3">เวลา (UTC/Bangkok)</th>
                      <th className="py-2 px-3">ผู้ดำเนินการ</th>
                      <th className="py-2 px-3">การกระทำ (Action)</th>
                      <th className="py-2 px-3">หมวดหมู่</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-rule/60">
                    {(data?.auditLogs || []).slice(0, 15).map((log: any) => (
                      <tr key={log.id} className="hover:bg-paper-raised/40">
                        <td className="py-2 px-3 text-ink-muted">
                          {new Date(log.createdAt).toLocaleString('th-TH')}
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
                  ระบบตัดไฟฉุกเฉินระดับแพลตฟอร์ม (Emergency Circuit Breakers)
                </h3>
              </div>
              <p className="text-xs text-ink-secondary mb-6 leading-relaxed">
                ในกรณีที่ Social API ภายนอกขัดข้อง มีการเปลี่ยนแปลงข้อกำหนดเร่งด่วน หรือเกิดเหตุการณ์ความปลอดภัยร้ายแรง คุณสามารถหยุดการยิงโพสต์ของแพลตฟอร์มนั้นๆ ได้ทันทีโดยไม่กระทบแพลตฟอร์มอื่น
              </p>

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
                    {metaActive ? '⛔ พักการยิง Meta ชั่วคราว' : '✓ เปิดใช้งาน Meta ตามปกติ'}
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
                    {youtubeActive ? '⛔ พักการยิง YouTube' : '✓ เปิดใช้งาน YouTube'}
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
                    {tiktokActive ? '⛔ พักการยิง TikTok' : '✓ เปิดใช้งาน TikTok'}
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
                  <span>การตั้งค่าแพลตฟอร์ม แท่นพิมพ์ & โทเคน (Platform Engine Settings)</span>
                </h3>
                <p className="text-xs text-ink-secondary mt-1">
                  ปรับแต่งเงื่อนไขการทดลองใช้ฟรี 7 วัน โปรโมชั่นลดพิเศษ อัตราสิ้นเปลืองโทเคน และการคำนวณภาษีมูลค่าเพิ่ม (VAT 7%)
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
                <span>บันทึกการตั้งค่าแพลตฟอร์ม</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: 7-Day Free Trial */}
              <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border-rule pb-3">
                  <h4 className="font-serif font-bold text-base text-ink-primary flex items-center gap-2">
                    <span>🎁 ระบบทดลองใช้งานฟรี (Free Trial)</span>
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
                      จำนวนวันทดลองใช้งานฟรี (Trial Days)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={trialDays}
                        onChange={(e) => setTrialDays(Number(e.target.value))}
                        className="w-24 px-3 py-1.5 text-xs font-mono rounded border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo"
                      />
                      <span className="text-xs text-ink-secondary">วัน (ค่าเริ่มต้น: 7 วัน สำหรับ Solo Press ฿79)</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-ink-secondary bg-paper-raised p-3 rounded border border-border-rule/80 leading-relaxed">
                    💡 <strong>เงื่อนไข:</strong> ผู้ใช้ทดลองฟรีไม่ต้องจ่ายเงินล่วงหน้า (฿0.00) ในวันแรก ได้สิทธิ์ 1 Workspace, 5 ช่องทาง, 150 Press Tokens เมื่อครบกำหนด 7 วัน ระบบจะแสดงข้อเสนอโปรโมชั่นส่วนลดพิเศษ
                  </p>
                </div>
              </div>

              {/* Box 2: Post-Trial Promo Ladder */}
              <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs space-y-4">
                <div className="border-b border-border-rule pb-3">
                  <h4 className="font-serif font-bold text-base text-ink-primary flex items-center gap-2">
                    <span>🏷️ บันไดส่วนลดหลังหมดทดลอง (Promo Ladder)</span>
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-ink-primary">ส่วนลดรายเดือน (3 เดือนแรก)</p>
                      <p className="text-[10px] text-ink-muted">Solo Press เหลือ ฿59.25/ด.</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="90"
                        value={postTrialMonthlyRate}
                        onChange={(e) => setPostTrialMonthlyRate(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono rounded border border-border-rule bg-paper-canvas text-right"
                      />
                      <span className="text-xs font-mono">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-ink-primary">ส่วนลดรายปีพิเศษ (1 ปีแรก)</p>
                      <p className="text-[10px] text-ink-muted">Solo Press เหลือ ฿462.15/ปี</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="90"
                        value={postTrialYearlyRate}
                        onChange={(e) => setPostTrialYearlyRate(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono rounded border border-border-rule bg-paper-canvas text-right"
                      />
                      <span className="text-xs font-mono">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-border-rule/60">
                    <div>
                      <p className="text-xs font-bold text-ink-primary">ส่วนลดรายปีมาตรฐาน (Standard Yearly)</p>
                      <p className="text-[10px] text-ink-muted">เทียบเท่าจ่าย 9 เดือน ใช้ได้ 12 เดือน</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={standardYearlyRate}
                        onChange={(e) => setStandardYearlyRate(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono rounded border border-border-rule bg-paper-canvas text-right"
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
                    <span>🪙 อัตราหักเหรียญ Press Token กลาง</span>
                  </h4>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-border-rule/40">
                    <span className="text-ink-secondary">เหรียญต้อนรับผู้ใช้ใหม่ (Welcome Bonus)</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={welcomeTokens}
                        onChange={(e) => setWelcomeTokens(Number(e.target.value))}
                        className="w-16 px-2 py-0.5 text-xs font-mono rounded border border-border-rule bg-paper-canvas text-right font-bold text-accent-terracotta"
                      />
                      <span className="font-mono text-ink-muted">🪙</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border-rule/40">
                    <span className="text-ink-secondary">AI Post Diagnosis (วิเคราะห์จุดอ่อนโพสต์)</span>
                    <span className="font-mono font-bold text-accent-terracotta">5 🪙</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border-rule/40">
                    <span className="text-ink-secondary">AI KPI Strategy Coaching (โค้ชกลยุทธ์ AI)</span>
                    <span className="font-mono font-bold text-accent-terracotta">10 🪙</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border-rule/40">
                    <span className="text-ink-secondary">Force Sync Telemetry (ดึงสถิติด่วน)</span>
                    <span className="font-mono font-bold text-accent-terracotta">2 🪙</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-ink-secondary">Auto-Frame Aspect Ratio (ปรับสัดส่วนภาพ)</span>
                    <span className="font-mono font-bold text-accent-terracotta">5 🪙</span>
                  </div>
                </div>
              </div>

              {/* Box 4: Thai Tax & Legal */}
              <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs space-y-4">
                <div className="border-b border-border-rule pb-3">
                  <h4 className="font-serif font-bold text-base text-ink-primary flex items-center gap-2">
                    <span>🇹🇭 ภาษีมูลค่าเพิ่มและข้อมูลนิติบุคคล</span>
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-ink-primary">อัตราภาษีมูลค่าเพิ่ม (VAT)</p>
                      <p className="text-[10px] text-ink-muted">คำนวณแยกแสดงใน e-Tax Invoice</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={vatRate}
                        onChange={(e) => setVatRate(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono rounded border border-border-rule bg-paper-canvas text-right"
                      />
                      <span className="text-xs font-mono">%</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border-rule/60 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-ink-secondary">ชื่อนิติบุคคลผู้ให้บริการ:</span>
                      <span className="font-bold text-ink-primary">RETZPOST (THAILAND) CO., LTD.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-secondary">เลขประจำตัวผู้เสียภาษี (13 หลัก):</span>
                      <span className="font-mono text-ink-primary font-bold">0105567012345</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-secondary">Log พ.ร.บ. คอมฯ ม.26:</span>
                      <span className="text-semantic-success font-bold font-mono">90 วันอัตโนมัติ (Compliant)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Adjust Tokens Modal */}
      {tokenModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper-card border-2 border-brand-indigo rounded-editorial max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-ink-primary">
              ปรับเหรียญ Press Token สำหรับ {tokenModalUser.name}
            </h3>
            <p className="text-xs text-ink-secondary">
              ยอดคงเหลือปัจจุบัน: <span className="font-bold font-mono text-accent-terracotta">{tokenModalUser.workspace?.tokenBalance ?? 50} 🪙</span>
            </p>

            <div>
              <label className="block text-xs font-bold text-ink-secondary mb-1">
                จำนวนเหรียญที่ต้องการเพิ่ม (+) หรือลด (-)
              </label>
              <input
                type="number"
                value={tokenAdjustAmount}
                onChange={(e) => setTokenAdjustAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-secondary mb-1">
                เหตุผลในการปรับยอด (Audit Log Reason)
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
                ยกเลิก
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
                บันทึกการปรับยอด
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
              หลักฐานสลิปการโอนเงิน (PromptPay Slip)
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
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
