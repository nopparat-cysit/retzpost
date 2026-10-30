'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Clock, 
  Bell, 
  Key, 
  CheckCircle2, 
  Save, 
  Palette,
  Sliders,
  Globe,
  FileDown,
  Trash2,
  AlertTriangle,
  User,
  Coins,
  Building2
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
import { THEME_CONFIGS, ThemePreset } from '@/modules/billing/pricing-plans';
import { useTranslation, LanguageToggle } from '@/modules/i18n/i18n-context';
import { getCurrentUser } from '@/modules/auth/auth-service';
import { AuthUser } from '@/modules/auth/auth-types';

export default function SettingsPage() {
  const { t, locale, setLocale } = useTranslation();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [defaultTimezone, setDefaultTimezone] = useState('Asia/Bangkok');
  const [autoFrameStories, setAutoFrameStories] = useState(true);
  const [maxRetryAttempts, setMaxRetryAttempts] = useState('4');
  const [emailAlertsOnFailure, setEmailAlertsOnFailure] = useState(true);
  const [themePreset, setThemePreset] = useState<ThemePreset>('NEWSPRINT');
  
  // Status
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dsarSuccess, setDsarSuccess] = useState<string | null>(null);

  // Load settings from Neon Postgres API
  useEffect(() => {
    setCurrentUser(getCurrentUser());
    fetch('/api/workspaces/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setDefaultTimezone(data.settings.defaultTimezone || 'Asia/Bangkok');
          setAutoFrameStories(data.settings.autoFrameStories ?? true);
          setMaxRetryAttempts(String(data.settings.maxRetryAttempts ?? '4'));
          setEmailAlertsOnFailure(data.settings.emailAlertsOnFailure ?? true);
          const activeTheme = data.settings.themePreset || 'NEWSPRINT';
          setThemePreset(activeTheme);
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', activeTheme);
            localStorage.setItem('retzpost_theme_preset', activeTheme);
          }
        }
      })
      .catch(err => console.error('Failed to load settings:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/workspaces/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultTimezone,
          autoFrameStories,
          maxRetryAttempts: parseInt(maxRetryAttempts, 10),
          emailAlertsOnFailure,
          themePreset,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDsarRequest = async (requestType: 'ACCESS_EXPORT' | 'ERASURE_DELETE') => {
    const isErasure = requestType === 'ERASURE_DELETE';
    const confirmMsg = isErasure
      ? 'คุณแน่ใจหรือไม่ว่าต้องการยื่นคำร้องขอลบทำลายข้อมูลบัญชีถาวรตามกฎหมาย PDPA? เมื่อดำเนินการแล้วจะไม่สามารถย้อนคืนได้'
      : 'คุณต้องการยื่นคำร้องขอรับสำเนาข้อมูลส่วนบุคคล (PDPA Data Export) หรือไม่?';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch('/api/workspaces/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dsarRequest: {
            requestType,
            reason: isErasure ? 'ขอลบทำลายข้อมูลบัญชีถาวร (Right to Erasure)' : 'ขอรับสำเนาไฟล์ข้อมูลส่วนบุคคล (Right of Access)',
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDsarSuccess(data.message);
        setTimeout(() => setDsarSuccess(null), 5000);
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการส่งคำร้อง');
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Masthead
        folio="WORKSPACE PREFERENCES / การตั้งค่าพื้นที่ทำงาน"
        editionDate="SYSTEM DEFAULTS"
        title="Workspace Settings (การตั้งค่า)"
        subtitle="จัดการเขตเวลาเผยแพร่ นโยบายลองใหม่เมื่อเครือข่ายขัดข้อง ธีมแท่นพิมพ์ และสิทธิ์คุ้มครองข้อมูลส่วนบุคคล (PDPA)"
      />

      {saveSuccess && (
        <div className="mb-6 p-3.5 bg-semantic-success-bg border border-semantic-success/20 rounded-card flex items-center gap-2.5 text-xs text-semantic-success font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>บันทึกการตั้งค่าลงฐานข้อมูล Neon Postgres สำเร็จเรียบร้อยแล้ว</span>
        </div>
      )}

      {dsarSuccess && (
        <div className="mb-6 p-3.5 bg-brand-indigo/10 border border-brand-indigo/30 rounded-card flex items-center gap-2.5 text-xs text-brand-indigo font-medium">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{dsarSuccess}</span>
        </div>
      )}

      {/* USER ACCOUNT PROFILE CARD */}
      {currentUser && (
        <div className="bg-paper-raised border-2 border-brand-indigo/60 rounded-card p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-12 h-12 rounded-full ${
                currentUser.avatarBg || 'bg-brand-indigo'
              } text-white flex items-center justify-center font-serif text-base font-bold ring-2 ring-brand-indigo/20 shadow-xs shrink-0`}
            >
              {currentUser.avatarText || 'RP'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-ink-primary truncate">
                  {currentUser.name}
                </h3>
                <span className="px-2 py-0.5 rounded bg-brand-indigo text-white font-mono font-bold text-[10px] uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-ink-secondary font-mono truncate mt-0.5">
                {currentUser.email}
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-ink-secondary">
                <span className="flex items-center gap-1 text-accent-terracotta font-bold">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Master Wallet: 150 🪙</span>
                </span>
                <span>•</span>
                <span className="text-semantic-success font-semibold">
                  Status: Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <LanguageToggle />
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* SECTION 0: SYSTEM LANGUAGE */}
        <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border-rule">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-indigo" />
              <h2 className="font-serif font-medium text-base text-ink-primary">
                {t('settings.languageSectionTitle')}
              </h2>
            </div>
            <span className="font-mono text-[10px] text-ink-muted">
              Active: {locale === 'th' ? '🇹🇭 ภาษาไทย' : '🇬🇧 English'}
            </span>
          </div>

          <p className="text-xs text-ink-secondary">
            {t('settings.languageSectionDesc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
            <button
              type="button"
              onClick={() => setLocale('th')}
              className={`p-3 rounded-editorial border text-left transition-all cursor-pointer flex items-center justify-between ${
                locale === 'th'
                  ? 'border-2 border-brand-indigo bg-paper-canvas shadow-xs ring-2 ring-brand-indigo/15'
                  : 'border-border-rule bg-paper-raised hover:border-border-rule/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🇹🇭</span>
                <div>
                  <p className="font-bold text-xs text-ink-primary">ภาษาไทย (Thai)</p>
                  <p className="text-[10px] font-mono text-ink-secondary">ค่าเริ่มต้นสำหรับตลาดไทย</p>
                </div>
              </div>
              {locale === 'th' && (
                <div className="w-5 h-5 rounded-full bg-brand-indigo text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`p-3 rounded-editorial border text-left transition-all cursor-pointer flex items-center justify-between ${
                locale === 'en'
                  ? 'border-2 border-brand-indigo bg-paper-canvas shadow-xs ring-2 ring-brand-indigo/15'
                  : 'border-border-rule bg-paper-raised hover:border-border-rule/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🇬🇧</span>
                <div>
                  <p className="font-bold text-xs text-ink-primary">English</p>
                  <p className="text-[10px] font-mono text-ink-secondary">Global editorial suite</p>
                </div>
              </div>
              {locale === 'en' && (
                <div className="w-5 h-5 rounded-full bg-brand-indigo text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
              )}
            </button>
          </div>
        </section>
        {/* SECTION 1: EDITORIAL CADENCE & TIMEZONE */}
        <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-rule">
            <Clock className="w-4 h-4 text-brand-indigo" />
            <h2 className="font-serif font-medium text-base text-ink-primary">
              เขตเวลาและนโยบายลองใหม่ (Timezone & Retry Engine)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-ink-secondary mb-1 font-bold">
                เขตเวลาหลักของแท่นพิมพ์ (Primary Timezone)
              </label>
              <select
                value={defaultTimezone}
                onChange={(e) => setDefaultTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono text-xs focus:outline-none focus:border-brand-indigo"
              >
                <option value="Asia/Bangkok">Asia/Bangkok (UTC+7, เวลามาตรฐานประเทศไทย)</option>
                <option value="Asia/Singapore">Asia/Singapore (UTC+8, สิงคโปร์)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (UTC+9, โตเกียว)</option>
                <option value="Europe/London">Europe/London (UTC+0 / BST, ลอนดอน)</option>
                <option value="America/New_York">America/New_York (EST / EDT, นิวยอร์ก)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST / PDT, ลอสแอนเจลิส)</option>
              </select>
              <p className="text-[11px] text-ink-secondary mt-1">
                การตั้งเวลาโพสต์คอนเทนต์ทั้งหมดจะอ้างอิงตามเขตเวลานี้
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-ink-secondary mb-1 font-bold">
                นโยบายลองส่งใหม่เมื่อเครือข่ายขัดข้อง (Retry Policy)
              </label>
              <select
                value={maxRetryAttempts}
                onChange={(e) => setMaxRetryAttempts(e.target.value)}
                className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono text-xs focus:outline-none focus:border-brand-indigo"
              >
                <option value="3">3 ครั้ง (Exponential Backoff มาตรฐาน)</option>
                <option value="4">4 ครั้ง (แนะนำ: หน่วงเวลา 1น., 5น., 15น., 1ชม.)</option>
                <option value="5">5 ครั้ง (Aggressive Resiliency สำหรับช่องทางสำคัญ)</option>
              </select>
              <p className="text-[11px] text-ink-secondary mt-1">
                ใช้เมื่อ TikTok หรือ Meta ส่งรหัส 429 Rate Limit หรือเครือข่ายขัดข้องชั่วคราว
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: THEME PRESETS */}
        <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-rule">
            <Palette className="w-4 h-4 text-accent-terracotta" />
            <h2 className="font-serif font-medium text-base text-ink-primary">
              ธีมบรรยากาศแท่นพิมพ์ (Editorial Theme Preset)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(Object.keys(THEME_CONFIGS) as ThemePreset[]).map((themeKey) => {
              const theme = THEME_CONFIGS[themeKey];
              const isSelected = themePreset === themeKey;

              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => {
                    setThemePreset(themeKey);
                    if (typeof document !== 'undefined') {
                      document.documentElement.setAttribute('data-theme', themeKey);
                      localStorage.setItem('retzpost_theme_preset', themeKey);
                    }
                  }}
                  className={`p-3 rounded-editorial border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-brand-indigo bg-paper-canvas shadow-xs ring-2 ring-brand-indigo/15'
                      : 'border-border-rule bg-paper-raised hover:border-border-rule/80'
                  }`}
                >
                  <div
                    className="h-10 rounded mb-2 border border-border-rule/60 flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: theme.bgPreview }}
                  >
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      ✓
                    </div>
                  </div>
                  <p className="font-serif font-bold text-xs text-ink-primary truncate">{theme.nameEn}</p>
                  <p className="text-[10px] font-mono text-ink-secondary">{theme.badge}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: MULTI-FORMAT MEDIA AUTOMATION */}
        <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-rule">
            <Sliders className="w-4 h-4 text-accent-terracotta" />
            <h2 className="font-serif font-medium text-base text-ink-primary">
              การปรับขนาดสื่ออัตโนมัติ (Media Adaptation & Automation)
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-paper-canvas border border-border-rule rounded-editorial cursor-pointer hover:border-border-strong transition-colors">
              <input
                type="checkbox"
                checked={autoFrameStories}
                onChange={(e) => setAutoFrameStories(e.target.checked)}
                className="mt-0.5 rounded text-accent-terracotta focus:ring-accent-terracotta"
              />
              <div>
                <span className="font-semibold text-xs text-ink-primary block">
                  ปรับขยายสัดส่วน 9:16 Canvas Padding สำหรับ 24h Stories อัตโนมัติ
                </span>
                <span className="text-[11px] text-ink-secondary block mt-0.5">
                  เมื่อยิงภาพแนวนอน (16:9) หรือสี่เหลี่ยม (1:1) ไปยัง Instagram / Facebook Stories ระบบจะเติมขอบสีสไตล์นิตยสารให้อัตโนมัติเพื่อไม่ให้ภาพถูกตัดตกขอบ
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-paper-canvas border border-border-rule rounded-editorial cursor-pointer hover:border-border-strong transition-colors">
              <input
                type="checkbox"
                checked={emailAlertsOnFailure}
                onChange={(e) => setEmailAlertsOnFailure(e.target.checked)}
                className="mt-0.5 rounded text-brand-indigo focus:ring-brand-indigo"
              />
              <div>
                <span className="font-semibold text-xs text-ink-primary block">
                  แจ้งเตือนทางอีเมลเมื่อโพสต์ล้มเหลว (Failure Incident Alerts)
                </span>
                <span className="text-[11px] text-ink-secondary block mt-0.5">
                  ส่งข้อความแจ้งเตือนกองบรรณาธิการทันทีเมื่อโพสต์ติดขัดเกินจำนวนครั้งที่ลองใหม่
                </span>
              </div>
            </label>
          </div>
        </section>

        {/* SECTION 4: THAI LEGAL COMPLIANCE & PDPA DSAR */}
        <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-rule">
            <ShieldCheck className="w-4 h-4 text-semantic-success" />
            <h2 className="font-serif font-medium text-base text-ink-primary">
              ความคุ้มครองข้อมูลส่วนบุคคลและกฎหมายไทย (PDPA & Legal Rights)
            </h2>
          </div>

          <p className="text-[11px] text-ink-secondary leading-relaxed">
            ท่านมีสิทธิ์ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ในการเข้าถึง ขอรับสำเนา หรือขอลบทำลายข้อมูลบัญชีของท่านได้ตลอดเวลา
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-paper-canvas border border-border-rule rounded-editorial flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-ink-primary">ขอรับสำเนาข้อมูล (Data Export)</p>
                <p className="text-[11px] text-ink-secondary">ดาวน์โหลดไฟล์ประวัติการใช้งานและคอนเทนต์</p>
              </div>
              <button
                type="button"
                onClick={() => handleDsarRequest('ACCESS_EXPORT')}
                className="py-1.5 px-3 rounded-btn border border-brand-indigo text-brand-indigo hover:bg-brand-indigo/10 text-[11px] font-bold flex items-center gap-1"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>ยื่นคำร้อง</span>
              </button>
            </div>

            <div className="p-3 bg-paper-canvas border border-border-rule rounded-editorial flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-semantic-error">ขอลบทำลายบัญชี (Right to Erasure)</p>
                <p className="text-[11px] text-ink-secondary">ลบข้อมูลส่วนบุคคลถาวรออกจากระบบ</p>
              </div>
              <button
                type="button"
                onClick={() => handleDsarRequest('ERASURE_DELETE')}
                className="py-1.5 px-3 rounded-btn border border-semantic-error text-semantic-error hover:bg-semantic-error/10 text-[11px] font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ขอลบบัญชี</span>
              </button>
            </div>
          </div>
        </section>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white font-bold text-xs rounded-editorial shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า (Save Settings)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
