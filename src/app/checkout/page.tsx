'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Receipt,
  ArrowRight,
  Upload,
  Coins,
  Clock,
  Gift,
  Flame,
  Wallet
} from 'lucide-react';
import { PublicHeader, PublicFooter } from '@/components/layout/public-nav';
import {
  PRICING_PLANS,
  TOKEN_TOPUP_PACKS,
  calculatePromotionalPrice,
  calculateVat,
  PlanTier,
  BillingCycle,
  PromoType,
} from '@/modules/billing/pricing-plans';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Params
  const planParam = (searchParams.get('plan') as PlanTier) || null;
  const packParam = searchParams.get('pack') || null;
  const cycleParam = (searchParams.get('cycle') as BillingCycle) || 'MONTHLY';
  const trialParam = searchParams.get('trial') === 'true';
  const promoParam = (searchParams.get('promo') as PromoType) || 'STANDARD';

  // State
  const [itemType, setItemType] = useState<'PLAN' | 'TOKEN_PACK'>(packParam ? 'TOKEN_PACK' : 'PLAN');
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(
    planParam && PRICING_PLANS[planParam] ? planParam : 'SOLO'
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    cycleParam === 'YEARLY' ? 'YEARLY' : 'MONTHLY'
  );
  const [selectedPackId, setSelectedPackId] = useState<string>(packParam || 'PACK_M');
  const [isTrialActive, setIsTrialActive] = useState<boolean>(
    trialParam || (itemType === 'PLAN' && planParam === 'SOLO')
  );
  const [appliedPromo, setAppliedPromo] = useState<PromoType>(promoParam);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'PROMPTPAY' | 'CREDIT_CARD'>('PROMPTPAY');
  const [slipFile, setSlipFile] = useState<string | null>(null);
  const [slipFileName, setSlipFileName] = useState<string>('');

  // Credit Card Form
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // e-Tax Invoice Form
  const [taxInvoiceRequested, setTaxInvoiceRequested] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [branchId, setBranchId] = useState('00000');
  const [companyAddress, setCompanyAddress] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successResult, setSuccessResult] = useState<any>(null);

  // Compute pricing
  let subtotal = 0;
  let title = '';
  let tokenAllocation = 0;
  let promoDescription = '';

  if (itemType === 'PLAN') {
    const plan = PRICING_PLANS[selectedPlan];
    tokenAllocation = plan.monthlyTokens;

    if (isTrialActive && plan.has7DayTrial) {
      subtotal = 0;
      title = `${plan.nameEn} • ทดลองใช้งานฟรี 7 วันเต็ม`;
      promoDescription = 'ไม่มีค่าใช้จ่ายวันนี้ ทดลองใช้ฟรี 7 วัน พร้อมรับสิทธิ์ส่วนลดพิเศษเมื่อครบกำหนด';
    } else {
      const pricing = calculatePromotionalPrice(selectedPlan, billingCycle, appliedPromo);
      subtotal = pricing.discountedPrice;
      title = `${plan.nameEn} (${billingCycle === 'YEARLY' ? 'รายปี • ประหยัด 25%' : 'รายเดือน'})`;
      promoDescription = pricing.promoDescriptionTh;
    }
  } else {
    const pack = TOKEN_TOPUP_PACKS.find(p => p.id === selectedPackId) || TOKEN_TOPUP_PACKS[1];
    subtotal = pack.priceThb;
    title = pack.nameTh;
    tokenAllocation = pack.tokens;
    promoDescription = 'แพ็กเกจเหรียญ Master Token ไม่มีวันหมดอายุ';
  }

  const vatCalc = calculateVat(subtotal);

  // Handle mock slip upload
  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setSlipFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (taxInvoiceRequested && subtotal > 0) {
      if (!companyName.trim()) {
        setErrorMessage('กรุณาระบุชื่อนิติบุคคลหรือชื่อผู้เสียภาษีสำหรับออกใบกำกับภาษี');
        return;
      }
      const cleanTax = taxId.replace(/\D/g, '');
      if (cleanTax.length !== 13) {
        setErrorMessage('เลขประจำตัวผู้เสียภาษีอากรต้องมี 13 หลัก');
        return;
      }
      if (!companyAddress.trim()) {
        setErrorMessage('กรุณาระบุที่อยู่จดทะเบียนภาษีมูลค่าเพิ่ม');
        return;
      }
    }

    if (paymentMethod === 'PROMPTPAY' && !slipFile && !isTrialActive && subtotal > 0) {
      setSlipFile('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
      setSlipFileName('promptpay_slip_auto.png');
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType,
          planTier: selectedPlan,
          billingCycle,
          isTrial: isTrialActive,
          promoType: appliedPromo,
          packId: selectedPackId,
          paymentMethod,
          promptPaySlipUrl: slipFile,
          taxInvoiceRequested,
          companyName,
          taxId,
          branchId,
          companyAddress,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessResult(data);
      } else {
        setErrorMessage(data.message || 'การดำเนินการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }
    } catch {
      setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col font-sans selection:bg-brand-indigo selection:text-white">
      <PublicHeader />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-ink-secondary mb-2 font-mono">
            <Link href="/pricing" className="hover:text-brand-indigo underline">ราคาและแผน (Pricing)</Link>
            <span>/</span>
            <span className="text-ink-primary font-bold">เช็คเอาท์และเปิดใช้งาน (Checkout)</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-4xl text-ink-primary">
            {isTrialActive ? 'เปิดใช้งานสิทธิ์ทดลองฟรี 7 วัน' : 'ตรวจสอบคำสั่งซื้อและชำระเงิน'}
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {isTrialActive 
              ? 'เปิดสิทธิ์ใช้งานระบบแท่นพิมพ์ทันที 7 วัน โดยไม่มีการตัดเงินในวันนี้ พร้อมรับ 150 Master Tokens' 
              : 'เปิดใช้งานระบบแท่นพิมพ์และรับ Master Token อัตโนมัติ พร้อมใบกำกับภาษี e-Tax ถูกต้องตามระเบียบกรมสรรพากร'}
          </p>
        </div>

        {/* 7-Day Trial Notification Banner */}
        {isTrialActive && !successResult && (
          <div className="bg-paper-raised border-2 border-accent-terracotta rounded-editorial p-5 mb-8 shadow-xs flex items-start gap-4">
            <Gift className="w-8 h-8 text-accent-terracotta shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-base text-ink-primary">
                สิทธิ์ทดลองใช้งานฟรี 7 วัน (7-Day Risk-Free Trial)
              </h3>
              <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                ยอดเรียกเก็บวันนี้คือ <strong>฿0.00 บาท</strong> คุณจะได้ทดลองใช้งานฟีเจอร์ของ Solo Press ครบทุกฟังก์ชัน เมื่อครบ 7 วัน ระบบจะเสนอโปรโมชั่นสุดพิเศษ: <strong>ลด 25% นาน 3 เดือนแรก</strong> หรือ <strong>ลด 35% สำหรับปีแรก</strong>
              </p>
            </div>
          </div>
        )}

        {/* Success Modal / Banner */}
        {successResult && (
          <div className="bg-paper-raised border-2 border-semantic-success rounded-editorial p-6 sm:p-8 shadow-md mb-8 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-semantic-success/20 text-semantic-success flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-bold text-2xl text-ink-primary">
                  {isTrialActive ? 'เปิดสิทธิ์ทดลองฟรี 7 วันเรียบร้อยแล้ว!' : 'ชำระเงินสำเร็จเรียบร้อยแล้ว!'}
                </h3>
                <p className="text-sm text-ink-secondary mt-1">
                  {successResult.message}
                </p>

                {/* Receipt Details Box */}
                <div className="bg-paper-canvas border border-border-rule rounded-md p-4 mt-4 text-xs font-mono space-y-1.5 max-w-xl">
                  <div className="flex justify-between">
                    <span className="text-ink-secondary">รหัสอ้างอิง (Reference ID):</span>
                    <span className="font-bold text-ink-primary">{successResult.invoice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-secondary">ยอดรวมสุทธิ (Total):</span>
                    <span className="font-bold text-brand-indigo">฿{successResult.invoice.totalThb?.toLocaleString()} THB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-secondary">Master Token ที่ได้รับ:</span>
                    <span className="font-bold text-accent-terracotta">+{successResult.invoice.tokensAdded} 🪙</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-secondary">กระเป๋าเงินเหรียญ:</span>
                    <span className="text-ink-primary">Master Token Wallet (ใช้ได้ทุก Workspace)</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/desk"
                    className="py-2.5 px-6 rounded-btn bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                  >
                    <span>เข้าสู่หน้าควบคุมหลัก (Go to Dashboard)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="py-2.5 px-4 rounded-btn border border-border-rule bg-paper-card text-xs font-medium text-ink-secondary hover:text-ink-primary"
                  >
                    ดูแผนอื่นเพิ่มเติม
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {!successResult && (
          <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Payment Details & e-Tax Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Payment Methods Card */}
              <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs">
                <h2 className="font-serif font-bold text-lg text-ink-primary mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-indigo" />
                    <span>ช่องทางการชำระเงิน</span>
                  </span>
                  {isTrialActive && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent-terracotta text-white font-bold">
                      ฿0 สำหรับ 7 วันแรก
                    </span>
                  )}
                </h2>

                {/* Tabs */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PROMPTPAY')}
                    className={`p-3 rounded-editorial border text-left flex items-center gap-3 transition-all ${
                      paymentMethod === 'PROMPTPAY'
                        ? 'border-2 border-brand-indigo bg-brand-indigo/5 text-ink-primary font-bold'
                        : 'border-border-rule text-ink-secondary hover:border-border-rule/80'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-accent-terracotta shrink-0" />
                    <div>
                      <p className="text-xs font-bold">พร้อมเพย์ (PromptPay QR)</p>
                      <p className="text-[10px] text-ink-muted">สแกนจ่ายได้ทุกธนาคารไทย</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                    className={`p-3 rounded-editorial border text-left flex items-center gap-3 transition-all ${
                      paymentMethod === 'CREDIT_CARD'
                        ? 'border-2 border-brand-indigo bg-brand-indigo/5 text-ink-primary font-bold'
                        : 'border-border-rule text-ink-secondary hover:border-border-rule/80'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-brand-indigo shrink-0" />
                    <div>
                      <p className="text-xs font-bold">บัตรเครดิต / เดบิต</p>
                      <p className="text-[10px] text-ink-muted">Visa, Mastercard, JCB</p>
                    </div>
                  </button>
                </div>

                {/* Tab 1: PromptPay Panel */}
                {paymentMethod === 'PROMPTPAY' && (
                  <div className="bg-paper-raised border border-border-rule rounded-editorial p-5 text-center space-y-4">
                    {subtotal > 0 ? (
                      <>
                        <p className="text-xs font-medium text-ink-secondary">
                          สแกน QR Code นี้ผ่านแอปธนาคารใดก็ได้ในประเทศไทย
                        </p>

                        <div className="inline-block p-4 bg-white rounded-editorial border border-border-rule shadow-inner">
                          <div className="w-48 h-48 mx-auto bg-gray-900 rounded-md flex flex-col items-center justify-center text-white p-4 relative">
                            <div className="absolute top-2 left-2 bg-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded text-white font-mono">
                              PROMPTPAY
                            </div>
                            <QrCode className="w-28 h-28 text-white stroke-[1.5]" />
                            <span className="font-mono text-xs font-bold mt-1 text-yellow-300">
                              ฿{vatCalc.total.toLocaleString()} THB
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-ink-secondary font-mono">
                          บริษัท เรตซ์โพสต์ เทคโนโลยี (ประเทศไทย) จำกัด • 0-1055-66012-34-5
                        </p>

                        {/* Slip Uploader */}
                        <div className="pt-3 border-t border-border-rule text-left">
                          <label className="block text-xs font-bold text-ink-primary mb-1">
                            แนบหลักฐานสลิปโอนเงิน (Slip Upload)
                          </label>
                          <div className="flex items-center gap-3">
                            <label className="cursor-pointer py-2 px-3 rounded-btn border border-dashed border-brand-indigo/60 hover:bg-brand-indigo/5 text-brand-indigo text-xs font-medium flex items-center gap-1.5 transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <span>เลือกไฟล์สลิป (PNG/JPG)</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleSlipChange}
                                className="hidden"
                              />
                            </label>
                            {slipFileName ? (
                              <span className="text-xs text-semantic-success flex items-center gap-1 font-mono">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {slipFileName}
                              </span>
                            ) : (
                              <span className="text-[11px] text-ink-muted">
                                (คลิกชำระเงินเพื่อจำลองระบบแนบสลิปอัตโนมัติได้ทันที)
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-6 space-y-2">
                        <Gift className="w-10 h-10 text-accent-terracotta mx-auto" />
                        <h4 className="font-serif font-bold text-lg text-ink-primary">
                          ยอดชำระวันนี้ ฿0.00 บาท
                        </h4>
                        <p className="text-xs text-ink-secondary max-w-sm mx-auto">
                          คุณอยู่ในสิทธิ์ทดลองใช้งานฟรี 7 วันเต็ม ไม่ต้องโอนเงินหรือแนบสลิปในขั้นตอนนี้ กดปุ่มยืนยันด้านล่างเพื่อเริ่มใช้งานได้ทันที
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Credit Card Panel */}
                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-ink-secondary mb-1">
                        หมายเลขบัตร (Card Number)
                      </label>
                      <input
                        type="text"
                        placeholder="4111 •••• •••• 1111"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono rounded-md border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink-secondary mb-1">
                        ชื่อบนบัตร (Cardholder Name)
                      </label>
                      <input
                        type="text"
                        placeholder="SOMCHAI DEEPROM"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-md border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-ink-secondary mb-1">
                          วันหมดอายุ (MM/YY)
                        </label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono rounded-md border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ink-secondary mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono rounded-md border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Thai Legal e-Tax Invoice Card */}
              {subtotal > 0 && (
                <div className="bg-paper-card border border-border-rule rounded-editorial p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border-rule">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-accent-terracotta" />
                      <div>
                        <h3 className="font-serif font-bold text-base text-ink-primary">
                          ใบกำกับภาษีเต็มรูปแบบ (e-Tax Invoice / Receipt)
                        </h3>
                        <p className="text-[11px] text-ink-secondary">
                          ถูกต้องตามประมวลรัษฎากร กรมสรรพากร สามารถนำไปหักภาษีได้
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      id="taxInvoiceToggle"
                      checked={taxInvoiceRequested}
                      onChange={(e) => setTaxInvoiceRequested(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-indigo focus:ring-brand-indigo"
                    />
                  </div>

                  {taxInvoiceRequested && (
                    <div className="mt-4 space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-ink-secondary mb-1">
                          ชื่อนิติบุคคล / ชื่อนามสกุลผู้เสียภาษี *
                        </label>
                        <input
                          type="text"
                          placeholder="บริษัท มีเดีย อินโนเวชั่น จำกัด"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-md border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo"
                          required={taxInvoiceRequested}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-ink-secondary mb-1">
                            เลขประจำตัวผู้เสียภาษี 13 หลัก *
                          </label>
                          <input
                            type="text"
                            maxLength={13}
                            placeholder="0105566000000"
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono rounded-md border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo"
                            required={taxInvoiceRequested}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-ink-secondary mb-1">
                            รหัสสาขา (Branch ID)
                          </label>
                          <input
                            type="text"
                            placeholder="00000 (สำนักงานใหญ่)"
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono rounded-md border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-ink-secondary mb-1">
                          ที่อยู่ตามทะเบียนภาษีมูลค่าเพิ่ม (ภ.พ.20) *
                        </label>
                        <textarea
                          rows={2}
                          placeholder="เลขที่ 123 อาคารเพรส ทาวเวอร์ ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110"
                          value={companyAddress}
                          onChange={(e) => setCompanyAddress(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-md border border-border-rule bg-paper-canvas focus:outline-none focus:border-brand-indigo"
                          required={taxInvoiceRequested}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Order Summary & Action (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-paper-card border-2 border-brand-indigo/40 rounded-editorial p-6 shadow-sm sticky top-20">
                <h2 className="font-serif font-bold text-lg text-ink-primary pb-3 border-b border-border-rule flex items-center justify-between">
                  <span>สรุปคำสั่งซื้อ</span>
                  <span className="text-xs font-mono text-brand-indigo font-bold uppercase">
                    Order Summary
                  </span>
                </h2>

                {/* Item Details */}
                <div className="py-4 border-b border-border-rule space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-ink-primary">{title}</p>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        {promoDescription}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-sm text-ink-primary">
                      ฿{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-accent-terracotta font-mono font-medium pt-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>ได้รับ {tokenAllocation.toLocaleString()} Master Tokens</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-ink-secondary font-mono pt-0.5">
                    <Wallet className="w-3 h-3 text-brand-indigo" />
                    <span>เก็บใน Master Wallet ใบเดียว (แชร์ใช้ได้ทุก Workspace)</span>
                  </div>
                </div>

                {/* Price Breakdown with VAT 7% */}
                <div className="py-4 border-b border-border-rule space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-ink-secondary">
                    <span>มูลค่าสินค้าก่อนภาษี (Subtotal):</span>
                    <span>฿{vatCalc.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-ink-secondary">
                    <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                    <span>฿{vatCalc.vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-ink-primary pt-2 border-t border-border-rule/60">
                    <span>ยอดรวมที่ต้องชำระวันนี้:</span>
                    <span className="text-brand-indigo font-black">
                      {isTrialActive ? '฿0.00 (ฟรี 7 วัน)' : `฿${vatCalc.total.toLocaleString()} THB`}
                    </span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mt-4 p-3 rounded-md bg-semantic-error/10 border border-semantic-error/30 text-semantic-error text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-3 px-4 rounded-btn bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>กำลังดำเนินการ...</span>
                  ) : isTrialActive ? (
                    <>
                      <span>ยืนยันเริ่มทดลองใช้ฟรี 7 วัน (฿0)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>ยืนยันการชำระเงิน (฿{vatCalc.total.toLocaleString()})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-4 pt-4 border-t border-border-rule/80 text-[11px] text-ink-secondary space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-semantic-success" />
                    <span>ชำระเงินปลอดภัยด้วยมาตรฐานการเข้ารหัส SSL/TLS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-indigo" />
                    <span>เปิดสิทธิ์เข้าใช้งานทันทีหลังยืนยันคำสั่งซื้อ</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper-canvas p-10 font-mono text-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
