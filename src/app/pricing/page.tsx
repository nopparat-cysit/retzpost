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
              <span>THAILAND COMMERCIAL PRICING • ค่าบริการคิดเป็นเงินบาทไทย (THB)</span>
            </div>

            <h1 className="font-serif font-black text-3xl sm:text-5xl text-ink-primary tracking-tight leading-tight">
              แผนแท่นพิมพ์ข่าวสารที่พอดีกับขนาดทีมของคุณ
            </h1>

            <p className="text-base sm:text-lg text-ink-secondary max-w-2xl mx-auto leading-relaxed">
              ตั้งแต่ครีเอเตอร์เดี่ยวจนถึงเอเจนซี่ระดับแถวหน้า โพสต์คอนเทนต์ข้ามโซเชียล 5 ช่องทางพร้อมกัน พร้อมระบบ <span className="font-semibold text-brand-indigo">Master Token Wallet</span> กระเป๋าแม่ใบเดียวใช้ร่วมกันได้ทุก Workspace
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
                  รายเดือน (Monthly)
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
                  <span>รายปี (Yearly)</span>
                  <span className="px-1.5 py-0.2 rounded bg-accent-terracotta text-white text-[10px] font-mono">
                    ลด 25% (จ่าย 9 เดือน)
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
                        {plan.nameEn}
                      </h3>
                      <p className="text-[11px] text-ink-secondary mt-1 font-medium leading-tight">
                        {plan.taglineTh}
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
                          {isFree ? 'ตลอดชีพ' : billingCycle === 'YEARLY' ? '/ปี' : '/เดือน'}
                        </span>
                      </div>
                      {!isFree && (
                        <p className="text-[10px] text-accent-terracotta font-mono font-medium mt-0.5">
                          {billingCycle === 'YEARLY' 
                            ? `เฉลี่ย ฿${Math.round(price / 12).toLocaleString()}/เดือน` 
                            : 'รวมภาษี VAT 7% ในขั้นตอนชำระ'}
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
                        <span>{plan.monthlyTokens.toLocaleString()} 🪙 /ด.</span>
                      </div>
                      <div className="flex items-center justify-between text-ink-secondary text-[10px]">
                        <span>สะสมทบยอดได้:</span>
                        <span>{plan.maxRolloverTokens.toLocaleString()} 🪙</span>
                      </div>
                      <div className="flex items-center justify-between text-ink-primary font-bold text-[10px] pt-1 border-t border-border-rule/60">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-brand-indigo" />
                          ทีมงาน & พท.:
                        </span>
                        <span>{plan.teamMembersLimit} คน / {plan.workspacesLimit} พท.</span>
                      </div>
                    </div>

                    {/* Feature Checklist */}
                    <div className="space-y-2 mb-6">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary font-mono">
                        สิทธิประโยชน์:
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
                            {feature.labelTh}
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
                        <span>ทดลองใช้ฟรี 7 วัน (฿0 วันนี้)</span>
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
                        <span>{isFree ? 'เริ่มต้นใช้งานฟรี' : `เลือก ${plan.nameEn}`}</span>
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
                <span>MASTER TOKEN WALLET • กระเป๋าตังค์แม่ใบเดียวใช้ได้ทุก Workspace</span>
              </div>
              <h3 className="font-serif font-black text-xl sm:text-2xl text-ink-primary">
                เหรียญ Press Token ก้อนเดียว ไม่ต้องโอนย้ายไปมาระหว่าง Workspace
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                เหรียญทั้งหมดจะถูกผูกไว้ที่บัญชีหลักของคุณ (Owner Master Pool) ไม่ว่าคุณจะสร้างกี่ร้านค้า (เช่น ร้านเสื้อผ้า, ร้านกาแฟ, เพจส่วนตัว) ทั้งหมดสามารถดึงเหรียญจากกระเป๋าเดียวกันไปใช้รัน AI หรือ Force Sync ได้ทันที พร้อมระบบติดตามการใช้เหรียญของลูกทีมรายบุคคลในหน้า <Link href="/settings/team" className="text-brand-indigo font-bold underline">Team Settings</Link>
              </p>
            </div>

            <div className="p-4 bg-paper-card border border-border-rule rounded-md text-center min-w-[200px] shrink-0 font-mono">
              <span className="text-xs text-ink-secondary">อัตราความคุ้มค่าทีม 5 คน</span>
              <p className="font-serif font-black text-2xl text-accent-terracotta mt-1">฿40 / คน</p>
              <span className="text-[10px] text-ink-muted">ในแผน Creator ฿199</span>
            </div>
          </div>
        </section>

        {/* Press Token Top-up Packs Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-paper-card border border-border-rule rounded-editorial p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-terracotta/10 text-accent-terracotta text-xs font-mono font-bold mb-3">
                <Coins className="w-4 h-4" />
                <span>TOKEN TOP-UP • เติมเหรียญเพิ่มแบบไม่มีวันหมดอายุ</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-ink-primary">
                ซื้อ Press Token เพิ่มเมื่อต้องการรัน AI หรือบังคับดึงสถิติสด
              </h2>
              <p className="text-sm text-ink-secondary mt-2">
                Token ไม่มีวันหมดอายุตราบใดที่บัญชีของคุณยังคงสถานะ Active ใช้งานได้กับระบบวิเคราะห์โพสต์ปัง ดึงยอดวิวย้อนหลังนอกรอบ และปรับขนาดภาพอัตโนมัติ
              </p>
            </div>

            {/* Token Consumption Rates Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="bg-paper-raised border border-border-rule rounded-md p-3 text-center">
                <p className="text-[11px] text-ink-secondary font-medium">AI Post Diagnosis</p>
                <p className="font-mono font-black text-lg text-brand-indigo mt-0.5">{TOKEN_RATES.AI_POST_DIAGNOSIS} 🪙</p>
                <p className="text-[10px] text-ink-muted">วิเคราะห์โพสต์ปัง</p>
              </div>
              <div className="bg-paper-raised border border-border-rule rounded-md p-3 text-center">
                <p className="text-[11px] text-ink-secondary font-medium">AI Team Coaching</p>
                <p className="font-mono font-black text-lg text-brand-indigo mt-0.5">{TOKEN_RATES.AI_KPI_COACHING} 🪙</p>
                <p className="text-[10px] text-ink-muted">ร่างแผนโค้ชชิ่งลูกทีม</p>
              </div>
              <div className="bg-paper-raised border border-border-rule rounded-md p-3 text-center">
                <p className="text-[11px] text-ink-secondary font-medium">Force Sync Now</p>
                <p className="font-mono font-black text-lg text-brand-indigo mt-0.5">{TOKEN_RATES.FORCE_SYNC_NOW} 🪙</p>
                <p className="text-[10px] text-ink-muted">ดึงยอดวิวย้อนหลังทันที</p>
              </div>
              <div className="bg-paper-raised border border-border-rule rounded-md p-3 text-center">
                <p className="text-[11px] text-ink-secondary font-medium">Smart Auto-Frame</p>
                <p className="font-mono font-black text-lg text-brand-indigo mt-0.5">{TOKEN_RATES.SMART_AUTOFRAME} 🪙</p>
                <p className="text-[10px] text-ink-muted">จัดสัดส่วน Story 9:16</p>
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
                      {pack.nameTh}
                    </h4>
                    <p className="text-2xl font-black text-ink-primary font-serif mt-2">
                      ฿{pack.priceThb}
                    </p>
                    <p className="text-[11px] text-ink-secondary font-mono mt-0.5">
                      เพียง ฿{pack.pricePerToken.toFixed(2)} / Token
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-rule">
                    <Link
                      href={`/checkout?pack=${pack.id}`}
                      className="w-full py-2 px-3 rounded-btn bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>เติมเหรียญ {pack.tokens.toLocaleString()} 🪙</span>
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
              <span>EDITORIAL THEME PRESETS • 5 สไตล์แท่นพิมพ์</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-ink-primary">
              บรรยากาศแท่นพิมพ์ที่สะท้อนคาแรกเตอร์ของแบรนด์คุณ
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
                      {theme.nameEn}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-paper-canvas text-ink-secondary font-bold">
                      {theme.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-ink-secondary line-clamp-2 leading-relaxed">
                    {theme.descriptionTh}
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
