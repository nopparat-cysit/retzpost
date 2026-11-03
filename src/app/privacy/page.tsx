'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileCheck, 
  Server, 
  Trash2, 
  Mail, 
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Key,
  Database,
  ArrowRight,
  Layers,
  ChevronRight
} from 'lucide-react';
import { PublicHeader, PublicFooter, DocsSubNav } from '@/components/layout/public-nav';
import { Sticker } from '@/components/ui/sticker';
import { useTranslation } from '@/modules/i18n/i18n-context';

export default function PrivacyPolicyPage() {
  const { t, locale } = useTranslation();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeArticle, setActiveArticle] = useState('art-1');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('privacy@retzpost.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const navItems = [
    { id: 'art-1', title: '1. บทนำและขอบเขต' },
    { id: 'art-2', title: '2. ข้อมูลที่เราจัดเก็บ' },
    { id: 'art-3', title: '3. วัตถุประสงค์การใช้งาน' },
    { id: 'art-4', title: '4. ระบบเข้ารหัส Token Vault' },
    { id: 'art-5', title: '5. การปฏิบัติตามกฎ APIs' },
    { id: 'art-6', title: '6. สิทธิของผู้ใช้ & การขอลบ' },
    { id: 'art-7', title: '7. ติดต่อเจ้าหน้าที่ DPO' },
  ];

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col font-sans selection:bg-brand-indigo selection:text-white">
      {/* Public Masthead Header */}
      <PublicHeader />
      <DocsSubNav />

      {/* Editorial Broadsheet Hero */}
      <section className="bg-paper-raised border-b-2 border-border-rule py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle grid pattern background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#D8D1C4_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-rule/80">
            <div className="flex items-center gap-2">
              <Sticker name="shield-certified" size="sm" />
              <span className="text-xs font-mono uppercase tracking-widest text-semantic-success font-bold">
                Privacy & Data Protection Certified • PDPA Verified
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-primary font-medium transition-colors cursor-pointer"
                title="สั่งพิมพ์เอกสารนโยบาย"
              >
                <Printer className="w-3.5 h-3.5 text-ink-secondary" />
                <span>พิมพ์เอกสาร</span>
              </button>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-ink-primary tracking-tight">
            {t('legal.privacyTitle')} (Privacy Policy)
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary max-w-3xl leading-relaxed font-sans">
            {locale === 'th'
              ? 'RetzPost ยึดมั่นในนโยบาย "Zero Plain-Text Token & Zero Data Selling" ข้อมูลบัญชีและผลงานของท่านได้รับการคุ้มครองด้วยการเข้ารหัสระดับเดียวกับสถาบันการเงิน เพื่อให้ท่านสร้างสรรค์คอนเทนต์ได้อย่างมั่นใจ 100%'
              : 'RetzPost is committed to "Zero Plain-Text Token & Zero Data Selling". Your account tokens and creative works are protected by banking-grade envelope encryption.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px] text-ink-secondary">
            <span className="bg-paper-canvas px-2.5 py-1 rounded border border-border-rule">
              มีผลบังคับใช้: <strong className="text-ink-primary">24 ตุลาคม 2026</strong>
            </span>
            <span className="bg-paper-canvas px-2.5 py-1 rounded border border-border-rule">
              เวอร์ชัน: <strong className="text-ink-primary">v2.2 Production Edition</strong>
            </span>
            <span className="bg-semantic-success-bg text-semantic-success px-2.5 py-1 rounded border border-semantic-success/20 font-bold">
              ✓ Meta & YouTube API Compliant
            </span>
          </div>
        </div>
      </section>

      {/* Visual Security Architecture Strip */}
      <section className="bg-paper-subtle/50 border-b border-border-rule py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="p-4 rounded-dialog bg-paper-raised border-2 border-border-rule shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-ink-primary flex items-center gap-1.5 uppercase tracking-wider">
                <Lock className="w-4 h-4 text-brand-indigo" />
                <span>สถาปัตยกรรมการปกป้องข้อมูลของ RetzPost (Token Vault Architecture)</span>
              </span>
              <span className="text-[10px] font-mono text-semantic-success font-bold bg-semantic-success-bg px-2 py-0.5 rounded border border-semantic-success/20">
                AES-256 GCM 🔒
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
                <span className="font-mono font-bold text-brand-indigo block">1. In-Transit Protection</span>
                <p className="text-[11px] text-ink-secondary font-sans leading-snug">
                  ข้อมูลแคปชันและคลิปส่งผ่านเครือข่ายด้วยโพรโทคอล HTTPS/TLS 1.3 เข้ารหัสตั้งแต่ต้นทางถึงปลายทาง
                </p>
              </div>

              <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
                <span className="font-mono font-bold text-accent-terracotta block">2. Token Vault Encryption</span>
                <p className="text-[11px] text-ink-secondary font-sans leading-snug">
                  OAuth Tokens ของ Facebook/TikTok/YouTube ถูกเข้ารหัส AES-256 แยกตาราง ไม่มีใครอ่านโทเคนตรงๆ ได้
                </p>
              </div>

              <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
                <span className="font-mono font-bold text-semantic-success block">3. Zero Selling Policy</span>
                <p className="text-[11px] text-ink-secondary font-sans leading-snug">
                  เราไม่ขายหรือแชร์ข้อมูลคอนเทนต์หรือประวัติการโพสต์ของท่านให้แก่บุคคลที่สามเพื่อการโฆษณาเด็ดขาด
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Legal Content with 2-Column Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Section Links */}
          <aside className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="p-4 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs">
              <span className="text-xs font-mono font-bold text-ink-primary uppercase tracking-wider block pb-3 mb-3 border-b border-border-rule/80">
                มาตราและหัวข้อนโยบาย (Sections)
              </span>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeArticle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveArticle(item.id);
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center justify-between text-left p-2.5 rounded-editorial text-xs font-mono transition-all cursor-pointer ${
                        isActive
                          ? 'bg-paper-canvas text-brand-indigo font-bold border-l-3 border-brand-indigo shadow-2xs'
                          : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle/80 border-l-3 border-transparent'
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-brand-indigo' : 'opacity-30'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* DPO Quick Card */}
            <div className="p-4 bg-paper-subtle/70 border border-border-rule rounded-dialog text-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sticker name="approved-seal" size="xs" />
                <span className="font-mono font-bold text-ink-primary text-[11px] uppercase tracking-wider">
                  เจ้าหน้าที่คุ้มครองข้อมูล (DPO)
                </span>
              </div>
              <p className="text-[11px] text-ink-secondary font-sans leading-relaxed">
                หากท่านต้องการสอบถามการใช้งานข้อมูล หรือใช้สิทธิขอลบข้อมูลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล:
              </p>
              <div className="p-2.5 rounded bg-paper-canvas border border-border-rule flex items-center justify-between gap-2 font-mono text-[11px]">
                <span className="text-brand-indigo font-bold truncate">privacy@retzpost.com</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1 text-ink-secondary hover:text-ink-primary rounded hover:bg-paper-subtle transition-colors shrink-0"
                  title="คัดลอกอีเมล"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </aside>

          {/* Right Column: Detailed Clauses */}
          <main className="lg:col-span-8 space-y-8">
            {/* Clause 1 */}
            <article id="art-1" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  ARTICLE 01
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  1. บทนำและขอบเขตการบังคับใช้ (Introduction & Scope)
                </h2>
              </div>

              {/* TL;DR Box */}
              <div className="p-3.5 rounded-editorial bg-brand-indigo/5 border-l-3 border-brand-indigo text-xs space-y-1">
                <strong className="text-brand-indigo font-mono block text-[11px]">
                  💡 สรุปภาษาคนเข้าใจง่าย (Plain Summary):
                </strong>
                <p className="text-ink-primary/90 font-sans leading-relaxed">
                  นโยบายนี้บอกว่า RetzPost จัดเก็บข้อมูลอะไรบ้างเมื่อคุณใช้บริการ และเรานำข้อมูลไปทำอะไร โดยหัวใจหลักคือเราใช้ข้อมูลเพื่อส่งโพสต์ตามที่คุณสั่งเท่านั้น
                </p>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-ink-secondary font-sans pt-1">
                <p>
                  บริษัท RetzPost SaaS Technologies จำกัด (&quot;RetzPost&quot;, &quot;เรา&quot;) เคารพและให้ความสำคัญสูงสุดต่อความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคลของท่าน นโยบายความเป็นส่วนตัวฉบับนี้มีผลบังคับใช้กับบริการ RETZPOST แพลตฟอร์มการกระจายสื่อดิจิทัล และบริการอื่นใดภายใต้โดเมนของ RetzPost
                </p>
                <p>
                  การเข้าใช้งานหรือสมัครสมาชิกถือว่าท่านรับทราบและยินยอมตามแนวปฏิบัติที่ระบุไว้ในเอกสารฉบับนี้ หากท่านไม่เห็นด้วยกับส่วนใดส่วนหนึ่ง โปรดยุติการเข้าใช้งาน
                </p>
              </div>
            </article>

            {/* Clause 2 */}
            <article id="art-2" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  ARTICLE 02
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  2. ข้อมูลส่วนบุคคลที่เราจัดเก็บ (Personal Data We Collect)
                </h2>
              </div>

              <div className="p-3.5 rounded-editorial bg-semantic-success-bg/40 border-l-3 border-semantic-success text-xs space-y-1">
                <strong className="text-semantic-success font-mono block text-[11px]">
                  💡 สรุปภาษาคนเข้าใจง่าย (Plain Summary):
                </strong>
                <p className="text-ink-primary/90 font-sans leading-relaxed">
                  เราเก็บเฉพาะ Gmail ที่ใช้สมัคร, ชื่อผู้ใช้, และ Token ที่ได้จากการที่คุณกดยินยอมเชื่อมต่อ Facebook/YouTube/TikTok เท่านั้น เราไม่เคยเก็บรหัสผ่านจริงของโซเชียลของคุณ
                </p>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-ink-secondary font-sans pt-1">
                <p>ข้อมูลที่เราจัดเก็บแบ่งออกเป็น 3 หมวดหมู่หลัก:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-mono text-[11px]">
                  <div className="p-3 rounded bg-paper-canvas border border-border-rule space-y-1">
                    <strong className="text-ink-primary block">ก. ข้อมูลบัญชี:</strong>
                    <span className="text-ink-secondary block font-sans">
                      Gmail, Username, รหัสผ่านที่เข้ารหัสแล้ว (One-Way Hashed)
                    </span>
                  </div>
                  <div className="p-3 rounded bg-paper-canvas border border-border-rule space-y-1">
                    <strong className="text-ink-primary block">ข. ข้อมูลโทเคน OAuth:</strong>
                    <span className="text-ink-secondary block font-sans">
                      Access Token, Page ID, Channel ID ที่ท่านกดยินยอมเชื่อมต่อ
                    </span>
                  </div>
                  <div className="p-3 rounded bg-paper-canvas border border-border-rule space-y-1">
                    <strong className="text-ink-primary block">ค. เนื้อหาคอนเทนต์:</strong>
                    <span className="text-ink-secondary block font-sans">
                      แคปชัน, ลิงก์รูปภาพและคลิปวิดีโอ 9:16 ที่ท่านอัปโหลดเพื่อยิงโพสต์
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Clause 3 */}
            <article id="art-3" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  ARTICLE 03
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  3. วัตถุประสงค์ในการประมวลผลข้อมูล (Purpose of Processing)
                </h2>
              </div>

              <div className="p-3.5 rounded-editorial bg-brand-indigo/5 border-l-3 border-brand-indigo text-xs space-y-1">
                <strong className="text-brand-indigo font-mono block text-[11px]">
                  💡 สรุปภาษาคนเข้าใจง่าย (Plain Summary):
                </strong>
                <p className="text-ink-primary/90 font-sans leading-relaxed">
                  เราใช้ข้อมูลเพื่อ 1) ส่งรหัส OTP ทางอีเมล 2) ยิงโพสต์และคลิปลงเพจของคุณตามเวลาที่ตั้งไว้ 3) ดึงตัวเลขยอดวิวมาคิดคะแนน KPI ให้ทีมของคุณ
                </p>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-ink-secondary font-sans pt-1">
                <p>เราประมวลผลข้อมูลของท่านตามฐานความยินยอมและฐานสัญญาในการให้บริการ:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>ส่งคำสั่ง API เพื่อสร้างโพสต์, วิดีโอ Reels, Shorts หรือทวีตตามที่ท่านกดสั่ง</li>
                  <li>คำนวณสถิติและประสิทธิภาพการทำงาน (Team KPI & Scorecard) รายบุคคล</li>
                  <li>ส่งรหัสยืนยันตัวตน OTP 6 หลักเพื่อความปลอดภัยในการเข้าใช้งานและกู้คืนรหัสผ่าน</li>
                </ul>
              </div>
            </article>

            {/* Clause 4 */}
            <article id="art-4" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  ARTICLE 04
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  4. การรักษาความมั่นคงปลอดภัยของข้อมูล (Token Vault & Encryption)
                </h2>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-ink-secondary font-sans">
                <p>
                  โทเคน OAuth และข้อมูลการเข้าถึงทั้งหมดถูกเก็บรักษาไว้ในระบบ <strong>RetzPost Token Vault</strong> ซึ่งทำงานร่วมกับ Hardware KMS (Key Management Service) โดยใช้การเข้ารหัสแบบ <strong>AES-256 GCM</strong>
                </p>
                <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-ink-primary">
                    <span>Algorithm:</span>
                    <strong className="text-brand-indigo">AES-256 GCM Authenticated Encryption</strong>
                  </div>
                  <div className="flex items-center justify-between text-ink-primary">
                    <span>Key Rotation:</span>
                    <strong className="text-semantic-success">Automated 90-Day Rotation</strong>
                  </div>
                  <div className="flex items-center justify-between text-ink-primary">
                    <span>Access Control:</span>
                    <strong className="text-accent-terracotta">Role-Based Isolated Scope</strong>
                  </div>
                </div>
              </div>
            </article>

            {/* Clause 5 */}
            <article id="art-5" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  ARTICLE 05
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  5. การปฏิบัติตามนโยบายแพลตฟอร์มพันธมิตร (Platform API Compliance)
                </h2>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-ink-secondary font-sans">
                <p>
                  การเชื่อมต่อ Social Media APIs ปฏิบัติตามข้อกำหนดของผู้ให้บริการอย่างเป็นทางการ:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 font-mono text-[11px]">
                  <li><strong>Meta Platform Terms:</strong> ปฏิบัติตาม Meta Developer Policy ไม่มีการเก็บข้อมูลส่วนบุคคลของลูกเพจ</li>
                  <li><strong>Google & YouTube API:</strong> ปฏิบัติตาม YouTube API Terms of Service และ Google Privacy Policy (<a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-brand-indigo underline">Google Privacy</a>)</li>
                  <li><strong>TikTok & X Developer Agreements:</strong> ปฏิบัติตามข้อกำหนดการเผยแพร่เนื้อหาและลิขสิทธิ์อย่างเคร่งครัด</li>
                </ul>
              </div>
            </article>

            {/* Clause 6 */}
            <article id="art-6" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  ARTICLE 06
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  6. สิทธิของผู้ใช้ & การขอลบข้อมูลอย่างถาวร (User Rights & Data Erasure)
                </h2>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-ink-secondary font-sans">
                <p>
                  ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ท่านมีสิทธิในการขอเข้าถึง ขอรับสำเนา ขอระงับการใช้ หรือขอลบข้อมูลบัญชีของท่านอย่างถาวร:
                </p>
                <div className="p-4 rounded-dialog bg-paper-canvas border border-border-rule space-y-3">
                  <h4 className="font-bold text-ink-primary font-mono text-xs">
                    ท่านสามารถดำเนินการด้วยตนเองได้ทันที:
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href="/accounts"
                      className="px-3 py-1.5 rounded-editorial bg-paper-subtle hover:bg-paper-raised border border-border-rule text-brand-indigo font-mono text-[11px] font-semibold transition-colors"
                    >
                      จัดการตัดการเชื่อมต่อเพจ (Disconnect Channels) →
                    </Link>
                    <button
                      type="button"
                      onClick={() => alert('หากต้องการลบบัญชีผู้ใช้ RetzPost ถาวร โปรดส่งคำร้องมาที่ privacy@retzpost.com โดยระบุ Gmail ที่ลงทะเบียนไว้ ระบบจะดำเนินการลบข้อมูลทั้งหมดภายใน 48 ชั่วโมง')}
                      className="px-3 py-1.5 rounded-editorial bg-semantic-error-bg hover:bg-semantic-error/15 text-semantic-error font-mono text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      ขอลบข้อมูลบัญชีถาวร (Delete Account)
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Clause 7 */}
            <article id="art-7" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  ARTICLE 07
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  7. ช่องทางการติดต่อเจ้าหน้าที่คุ้มครองข้อมูล (DPO Contact)
                </h2>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-ink-secondary font-sans">
                <p>
                  หากท่านมีข้อสงสัย ข้อร้องเรียน หรือข้อเสนอแนะเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของเราได้ที่:
                </p>

                {/* Formal Certificate Stamp Box */}
                <div className="p-5 rounded-dialog bg-paper-canvas border-2 border-border-rule shadow-2xs space-y-3 relative overflow-hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="font-serif font-bold text-base text-ink-primary block">
                        RetzPost Data Protection Office (DPO)
                      </span>
                      <p className="font-mono text-[11px] text-ink-secondary">
                        บริษัท RetzPost SaaS Technologies จำกัด (สำนักงานใหญ่ กรุงเทพมหานคร)
                      </p>
                      <p className="font-mono text-[11px] text-brand-indigo font-bold pt-1">
                        Email: privacy@retzpost.com | security@retzpost.com
                      </p>
                    </div>

                    <div className="shrink-0 text-center">
                      <Sticker name="shield-certified" size="md" />
                      <span className="font-mono text-[9px] text-semantic-success block font-bold mt-1">
                        OFFICIAL DPO SEAL
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Back Button */}
              <div className="pt-4 border-t border-border-rule/80 flex items-center justify-between text-xs font-mono">
                <Link
                  href="/register"
                  className="text-brand-indigo hover:underline flex items-center gap-1 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>กลับสู่หน้าสมัครสมาชิก (Register)</span>
                </Link>

                <Link
                  href="/terms"
                  className="text-brand-indigo hover:underline font-semibold flex items-center gap-1"
                >
                  <span>อ่านข้อกำหนดการให้บริการ (Terms)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          </main>
        </div>
      </div>

      {/* Editorial Public Footer */}
      <PublicFooter />
    </div>
  );
}
