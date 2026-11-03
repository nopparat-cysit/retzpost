'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Sparkles, 
  Coins, 
  ShieldCheck, 
  Palette, 
  ArrowRight, 
  Receipt,
  FileCheck,
  Gift,
  Users,
  Flame,
  Wallet
} from 'lucide-react';
import { PublicHeader, PublicFooter } from '@/components/layout/public-nav';
import { Sticker } from '@/components/ui/sticker';
import { useTranslation } from '@/modules/i18n/i18n-context';
import { 
  PRICING_PLANS, 
  TOKEN_TOPUP_PACKS, 
  THEME_CONFIGS, 
  TOKEN_RATES,
  calculatePromotionalPrice,
  PlanTier, 
  BillingCycle,
  ThemePreset,
  PromoType
} from '@/modules/billing/pricing-plans';

export default function PricingPage() {
  const { t, locale } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [isPromoMode, setIsPromoMode] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>('NEWSPRINT');

  const promoType: PromoType = isPromoMode
    ? (billingCycle === 'MONTHLY' ? 'POST_TRIAL_MONTHLY_3MO' : 'POST_TRIAL_YEARLY_1YR')
    : 'STANDARD';

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col font-sans selection:bg-brand-indigo selection:text-white">
      <PublicHeader />

      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 border-b border-border-rule/80 bg-paper-raised text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo text-xs font-mono font-bold tracking-wide">
              <Sticker name="retro-stamp" size="xs" />
              <span>{t('pricing.badge')}</span>
            </div>

            <h1 className="font-serif font-black text-3xl sm:text-5xl text-ink-primary tracking-tight leading-tight">
              {t('pricing.heading')}
            </h1>

            <p className="text-base sm:text-lg text-ink-secondary max-w-2xl mx-auto leading-relaxed">
              {t('pricing.subtitle')}
            </p>

            {/* Toggles Container */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Monthly / Yearly Toggle */}
              <div className="flex items-center gap-3 bg-paper-canvas p-1.5 rounded-full border border-border-rule shadow-2xs">
                <button
                  type="button"
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    billingCycle === 'MONTHLY'
                      ? 'bg-brand-indigo text-white shadow-xs'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {t('pricing.billingMonthly')}
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('YEARLY')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    billingCycle === 'YEARLY'
                      ? 'bg-brand-indigo text-white shadow-xs'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  <span>{t('pricing.billingYearly')}</span>
                  <span className="px-1.5 py-0.2 rounded bg-accent-terracotta text-white text-[10px] font-mono">
                    {t('pricing.yearlyDiscountBadge')}
                  </span>
                </button>
              </div>

              {/* Post-Trial Promo Offer Toggle */}
              <button
                type="button"
                onClick={() => setIsPromoMode(!isPromoMode)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer ${
                  isPromoMode
                    ? 'bg-accent-terracotta text-white border-accent-terracotta shadow-xs ring-2 ring-accent-terracotta/20 animate-pulse'
                    : 'bg-paper-raised text-accent-terracotta border-accent-terracotta/40 hover:bg-accent-terracotta/10'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>
                  {isPromoMode ? '✓ กำลังแสดง: สิทธิ์โปรโมชั่นหลังครบ 7 วัน' : 'ดูสิทธิ์โปรโมชั่นหลังทดลองครบ 7 วัน'}
                </span>
              </button>
            </div>

            {isPromoMode && (
              <div className="inline-block p-3 rounded-md bg-accent-terracotta/10 border border-accent-terracotta/30 text-accent-terracotta text-xs font-mono font-bold">
                🔥 สิทธิ์พิเศษเมื่อทดลองครบ 7 วัน: เลือกรายเดือนลด 25% (นาน 3 เดือนแรก) หรือเลือกรายปีลดคุ้ม 35% (ปีแรก)!
              </div>
            )}
          </div>
        </section>

        {/* 5 Tier Pricing Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {(Object.keys(PRICING_PLANS) as PlanTier[]).map((tierKey) => {
              const plan = PRICING_PLANS[tierKey];
              const pricing = calculatePromotionalPrice(tierKey, billingCycle, promoType);
              const price = pricing.discountedPrice;
              const isFree = plan.monthlyPriceThb === 0;

              return (
                <div
                  key={tierKey}
                  className={`bg-paper-card rounded-editorial border ${
                    plan.isPopular 
                      ? 'border-2 border-brand-indigo shadow-lg ring-4 ring-brand-indigo/10' 
                      : tierKey === 'SOLO'
                      ? 'border-2 border-accent-terracotta/60 shadow-md'
                      : 'border-border-rule shadow-sm'
                  } p-5 flex flex-col justify-between relative transition-all duration-200 hover:shadow-md`}
                >
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs whitespace-nowrap ${
                      tierKey === 'SOLO' ? 'bg-accent-terracotta text-white' : 'bg-brand-indigo text-white'
                    }`}>
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="border-b border-border-rule pb-3 mb-3">
                      <h3 className="font-serif font-bold text-lg text-ink-primary">
                        {locale === 'th' ? plan.nameTh : plan.nameEn}
                      </h3>
                      <p className="text-[11px] text-ink-secondary mt-1 font-medium leading-tight">
                        {locale === 'th' ? plan.taglineTh : (plan.taglineEn || plan.taglineTh)}
                      </p>
                    </div>

                    {/* Pricing Display */}
                    <div className="mb-4">
                      {pricing.discountRate > 0 && !isFree && (
                        <span className="text-xs text-ink-muted line-through font-mono block">
                          ฿{pricing.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif font-black text-2xl sm:text-3xl text-ink-primary">
                          {isFree ? '฿0' : `฿${price.toLocaleString()}`}
                        </span>
                        <span className="text-[11px] text-ink-muted font-medium">
                          {isFree ? (locale === 'th' ? 'ตลอดชีพ' : 'forever') : billingCycle === 'YEARLY' ? t('pricing.perYear') : t('pricing.perMonth')}
                        </span>
                      </div>
                      {!isFree && (
                        <p className="text-[10px] text-accent-terracotta font-mono font-medium mt-0.5">
                          {billingCycle === 'YEARLY' 
                            ? (locale === 'th' ? `เฉลี่ย ฿${Math.round(price / 12).toLocaleString()}/เดือน` : `Avg ฿${Math.round(price / 12).toLocaleString()}/mo`) 
                            : (locale === 'th' ? 'รวมภาษีมูลค่าเพิ่ม VAT 7% ในขั้นตอนชำระเงิน' : 'VAT 7% included at checkout')}
                        </p>
                      )}
                    </div>

                    {/* Token & Quota Highlight Banner */}
                    <div className="bg-paper-raised border border-border-rule/80 rounded-md p-2.5 mb-4 space-y-1 text-[11px] font-mono">
                      <div className="flex items-center justify-between text-ink-primary font-bold">
                        <span className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-accent-terracotta" />
                          Master Tokens:
                        </span>
                        <span>{plan.monthlyTokens.toLocaleString()} {locale === 'th' ? '🪙 /ด.' : '🪙 /mo.'}</span>
                      </div>
                      <div className="flex items-center justify-between text-ink-secondary text-[10px]">
                        <span>{locale === 'th' ? 'สะสมโทเคนสูงสุด:' : 'Rollover Limit:'}</span>
                        <span>{plan.maxRolloverTokens.toLocaleString()} 🪙</span>
                      </div>
                      <div className="flex items-center justify-between text-ink-primary font-bold text-[10px] pt-1 border-t border-border-rule/60">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-brand-indigo" />
                          {locale === 'th' ? 'ทีม & สเปซ:' : 'Team & Spaces:'}
                        </span>
                        <span>
                          {locale === 'th' 
                            ? `${plan.teamMembersLimit} คน / ${plan.workspacesLimit} สเปซ` 
                            : `${plan.teamMembersLimit} members / ${plan.workspacesLimit} spaces`}
                        </span>
                      </div>
                    </div>

                    {/* Feature Checklist */}
                    <div className="space-y-2 mb-6">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary font-mono">
                        {locale === 'th' ? 'ฟีเจอร์เด่นในแพ็กนี้:' : 'Plan Features:'}
                      </p>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px]">
                          {feature.included ? (
                            <Check className="w-3.5 h-3.5 text-semantic-success shrink-0 mt-0.5" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-border-rule text-ink-muted text-center leading-3 shrink-0 mt-0.5 select-none text-[10px]">
                              -
                            </span>
                          )}
                          <span className={`${feature.included ? (feature.highlight ? 'font-bold text-ink-primary' : 'text-ink-primary') : 'text-ink-muted line-through'}`}>
                            {locale === 'th' ? feature.labelTh : (feature.labelEn || feature.labelTh)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Action */}
                  <div className="pt-3 border-t border-border-rule">
                    {tierKey === 'SOLO' && plan.has7DayTrial ? (
                      <Link
                        href="/checkout?plan=SOLO&trial=true"
                        className="w-full py-2.5 px-3 rounded-btn text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs bg-accent-terracotta hover:bg-accent-terracotta/90 text-white cursor-pointer"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>{locale === 'th' ? 'ทดลองใช้งานฟรี 7 วัน (฿0 วันนี้)' : 'Start 7-Day Free Trial (฿0 today)'}</span>
                      </Link>
                    ) : (
                      <Link
                        href={isFree ? '/register' : `/checkout?plan=${plan.id}&cycle=${billingCycle}${isPromoMode ? `&promo=${promoType}` : ''}`}
                        className={`w-full py-2 px-3 rounded-btn text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                          plan.isPopular
                            ? 'bg-brand-indigo hover:bg-brand-indigo-hover text-white'
                            : isFree
                            ? 'bg-paper-raised hover:bg-paper-canvas border border-border-rule text-ink-primary'
                            : 'bg-paper-canvas hover:bg-paper-raised border-2 border-brand-indigo text-brand-indigo'
                        }`}
                      >
                        <span>
                          {isFree 
                            ? (locale === 'th' ? 'เริ่มต้นใช้งานฟรี' : 'Get Started Free') 
                            : (locale === 'th' ? `เลือก ${plan.nameTh}` : `Select ${plan.nameEn}`)}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Master Token Wallet Architecture Explanation */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-paper-raised border-2 border-brand-indigo/30 rounded-editorial p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo text-xs font-mono font-bold">
                <Wallet className="w-4 h-4" />
                <span>
                  {locale === 'th' 
                    ? 'MASTER TOKEN WALLET • กระเป๋าตังค์แม่ใบเดียวใช้ได้ทุกสเปซ' 
                    : 'MASTER TOKEN WALLET • Unified Multi-Workspace Balance'}
                </span>
              </div>
              <h3 className="font-serif font-black text-xl sm:text-2xl text-ink-primary">
                {locale === 'th'
                  ? 'เหรียญ Press Token ก้อนเดียว ไม่ต้องโอนย้ายไปมาระหว่าง Workspace'
                  : 'Unified Master Tokens — No Transfers Needed Between Workspaces'}
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {locale === 'th'
                  ? 'เหรียญทั้งหมดจะถูกผูกไว้ที่บัญชีหลักของคุณ (Owner Master Pool) ไม่ว่าคุณจะสร้างกี่ร้านค้า (เช่น ร้านเสื้อผ้า, ร้านกาแฟ, เพจส่วนตัว) ทั้งหมดสามารถดึงเหรียญจากกระเป๋าเดียวกันไปใช้รัน AI หรือ Force Sync ได้ทันที พร้อมระบบติดตามการใช้เหรียญของลูกทีมรายบุคคลในหน้า '
                  : 'All tokens are tied to your primary account (Owner Master Pool). No matter how many workspaces you manage, all can pull tokens from the same wallet for AI runs or force syncs, with per-member usage auditing in '}
                <Link href="/settings/team" className="text-brand-indigo font-bold underline">
                  {locale === 'th' ? 'การตั้งค่าทีมงาน' : 'Team Settings'}
                </Link>
              </p>
            </div>

            <div className="p-4 bg-paper-card border border-border-rule rounded-md text-center min-w-[200px] shrink-0 font-mono">
              <span className="text-xs text-ink-secondary">
                {locale === 'th' ? 'อัตราความคุ้มค่าทีม 5 คน' : '5-Member Value Rate'}
              </span>
              <p className="font-serif font-black text-2xl text-accent-terracotta mt-1">
                {locale === 'th' ? '฿40 / คน' : '฿40 / member'}
              </p>
              <span className="text-[10px] text-ink-muted">
                {locale === 'th' ? 'ในแผน Creator ฿199' : 'On Creator plan (฿199)'}
              </span>
            </div>
          </div>
        </section>

        {/* Press Token Top-up Packs Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-paper-card border border-border-rule rounded-editorial p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-terracotta/10 text-accent-terracotta text-xs font-mono font-bold mb-3">
                <Coins className="w-4 h-4" />
                <span>
                  {locale === 'th' 
                    ? 'TOKEN TOP-UP • เติมเหรียญไม่หมดอายุ' 
                    : 'TOKEN TOP-UP • Non-Expiring Master Tokens'}
                </span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-ink-primary">
                {locale === 'th'
                  ? 'ซื้อ Press Token เพิ่มเมื่อต้องการรัน AI หรือบังคับดึงสถิติสด'
                  : 'Top up Press Tokens for AI operations and on-demand sync'}
              </h2>
              <p className="text-sm text-ink-secondary mt-2">
                {locale === 'th'
                  ? 'Token ไม่มีวันหมดอายุตราบใดที่บัญชีของคุณยังคงสถานะ Active ใช้งานได้กับระบบวิเคราะห์โพสต์ปัง ดึงยอดวิวย้อนหลังนอกรอบ และปรับขนาดภาพอัตโนมัติ'
                  : 'Tokens never expire while your account is active. Use them for post diagnostics, retroactive metrics fetch, and automated video reframing.'}
              </p>
            </div>

            {/* Token Consumption Rates Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="bg-paper-raised border border-border-rule rounded-md p-3 text-center">
                <p className="text-[11px] text-ink-secondary font-medium">
                  {locale === 'th' ? 'วินิจฉัยโพสต์' : 'Post Performance Diagnosis'}
                </p>
                <p className="font-mono font-black text-lg text-brand-indigo mt-0.5">{TOKEN_RATES.AI_POST_DIAGNOSIS} 🪙</p>
                <p className="text-[10px] text-ink-muted">
                  {locale === 'th' ? 'วิเคราะห์โพสต์ปัง' : 'Performance Analysis'}
                </p>
              </div>
              <div className="bg-paper-raised border border-border-rule rounded-md p-3 text-center">
                <p className="text-[11px] text-ink-secondary font-medium">
                  {locale === 'th' ? 'โค้ชชิ่งทีมงาน' : 'AI Team Coaching'}
                </p>
                <p className="font-mono font-black text-lg text-brand-indigo mt-0.5">{TOKEN_RATES.AI_KPI_COACHING} 🪙</p>
                <p className="text-[10px] text-ink-muted">
                  {locale === 'th' ? 'ร่างแผนโค้ชชิ่งลูกทีม' : 'KPI Coaching Outline'}
                </p>
              </div>
              <div className="bg-paper-raised border border-border-rule rounded-md p-3 text-center">
                <p className="text-[11px] text-ink-secondary font-medium">
                  {locale === 'th' ? 'ดึงสถิติสดทันที' : 'Force Sync Now'}
                </p>
                <p className="font-mono font-black text-lg text-brand-indigo mt-0.5">{TOKEN_RATES.FORCE_SYNC_NOW} 🪙</p>
                <p className="text-[10px] text-ink-muted">
                  {locale === 'th' ? 'ดึงยอดวิวย้อนหลังทันที' : 'Instant Metrics Fetch'}
                </p>
              </div>
              <div className="bg-paper-raised border border-border-rule rounded-md p-3 text-center">
                <p className="text-[11px] text-ink-secondary font-medium">
                  {locale === 'th' ? 'ปรับสัดส่วนอัตโนมัติ' : 'Smart Auto-Frame'}
                </p>
                <p className="font-mono font-black text-lg text-brand-indigo mt-0.5">{TOKEN_RATES.SMART_AUTOFRAME} 🪙</p>
                <p className="text-[10px] text-ink-muted">
                  {locale === 'th' ? 'จัดสัดส่วน Story 9:16' : 'Auto 9:16 Story Crop'}
                </p>
              </div>
            </div>

            {/* Top-up Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TOKEN_TOPUP_PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className="bg-paper-raised border border-border-rule rounded-editorial p-5 flex flex-col justify-between hover:border-brand-indigo/60 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-xs uppercase text-ink-secondary">
                        {pack.id}
                      </span>
                      {pack.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-accent-terracotta text-white text-[10px] font-mono font-bold">
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif font-bold text-lg text-ink-primary">
                      {locale === 'th' ? pack.nameTh : (pack.nameEn || pack.nameTh)}
                    </h4>
                    <p className="text-2xl font-black text-ink-primary font-serif mt-2">
                      ฿{pack.priceThb}
                    </p>
                    <p className="text-[11px] text-ink-secondary font-mono mt-0.5">
                      {locale === 'th' ? `เพียง ฿${pack.pricePerToken.toFixed(2)} / Token` : `Only ฿${pack.pricePerToken.toFixed(2)} / Token`}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-rule">
                    <Link
                      href={`/checkout?pack=${pack.id}`}
                      className="w-full py-2 px-3 rounded-btn bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>
                        {locale === 'th' ? `เติมเหรียญ ${pack.tokens.toLocaleString()} 🪙` : `Top up ${pack.tokens.toLocaleString()} 🪙`}
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5 Theme Presets Explorer */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo text-xs font-mono font-bold mb-2">
              <Palette className="w-4 h-4" />
              <span>
                {locale === 'th' 
                  ? 'EDITORIAL THEME PRESETS • 5 สไตล์การพิมพ์' 
                  : 'EDITORIAL THEME PRESETS • 5 Printing Styles'}
              </span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-ink-primary">
              {locale === 'th'
                ? 'บรรยากาศแท่นพิมพ์ที่สะท้อนคาแรกเตอร์ของแบรนด์คุณ'
                : 'Newsroom aesthetics tailored to your brand personality'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(Object.keys(THEME_CONFIGS) as ThemePreset[]).map((themeKey) => {
              const theme = THEME_CONFIGS[themeKey];
              const isSelected = selectedTheme === themeKey;

              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => setSelectedTheme(themeKey)}
                  className={`p-4 rounded-editorial border text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-2 border-brand-indigo shadow-md scale-102 ring-2 ring-brand-indigo/20 bg-paper-raised' 
                      : 'border-border-rule hover:border-border-rule/80 bg-paper-card'
                  }`}
                >
                  <div
                    className="h-16 rounded-md mb-3 border border-border-rule/60 flex items-center justify-center shadow-inner relative overflow-hidden"
                    style={{ backgroundColor: theme.bgPreview }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-serif font-bold shadow-sm"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      RP
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-serif font-bold text-sm text-ink-primary">
                      {locale === 'th' ? theme.nameTh : theme.nameEn}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-paper-canvas text-ink-secondary font-bold">
                      {theme.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-ink-secondary line-clamp-2 leading-relaxed">
                    {locale === 'th' ? theme.descriptionTh : (theme.descriptionEn || theme.descriptionTh)}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Thai Legal Guarantees */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-paper-raised border border-border-rule rounded-editorial p-6 flex items-start gap-4">
              <Receipt className="w-8 h-8 text-brand-indigo shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-bold text-base text-ink-primary">
                  ใบกำกับภาษีเต็มรูปแบบ (e-Tax)
                </h4>
                <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                  ออกใบกำกับภาษีมูลค่าเพิ่ม 7% ถูกต้องตามระเบียบกรมสรรพากร รองรับนิติบุคคลและบุคคลธรรมดา กรอกเลขนิติบุคคล 13 หลักตอนชำระเงินได้ทันที
                </p>
              </div>
            </div>

            <div className="bg-paper-raised border border-border-rule rounded-editorial p-6 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-semantic-success shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-bold text-base text-ink-primary">
                  คุ้มครองผู้บริโภค (สคบ. 7 วัน)
                </h4>
                <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                  รับประกันความพึงพอใจ 100% หากใช้งานแล้วไม่เป็นไปตามความต้องการ สามารถยื่นขอคืนเงินได้เต็มจำนวนภายใน 7 วันหลังสมัครสมาชิก
                </p>
              </div>
            </div>

            <div className="bg-paper-raised border border-border-rule rounded-editorial p-6 flex items-start gap-4">
              <FileCheck className="w-8 h-8 text-accent-terracotta shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-bold text-base text-ink-primary">
                  มาตรฐานความปลอดภัย PDPA
                </h4>
                <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                  ปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 และ พ.ร.บ. คอมพิวเตอร์ ม.26 เก็บรักษาประวัติจราจร 90 วัน ปลอดภัยระดับสากล
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
