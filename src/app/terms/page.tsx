'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Printer,
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { PublicHeader, PublicFooter, DocsSubNav } from '@/components/layout/public-nav';
import { Sticker } from '@/components/ui/sticker';

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('term-1');

  const termsNav = [
    { id: 'term-1', title: '1. การยอมรับข้อกำหนด' },
    { id: 'term-2', title: '2. สิทธิในผลงาน 100%' },
    { id: 'term-3', title: '3. กฎการใช้งานที่ยอมรับได้' },
    { id: 'term-4', title: '4. ความปลอดภัยของบัญชี' },
    { id: 'term-5', title: '5. ข้อจำกัดความรับผิดชอบ' },
    { id: 'term-6', title: '6. การระงับการให้บริการ' },
    { id: 'term-7', title: '7. กฎหมายที่ใช้บังคับ' },
  ];

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col font-sans selection:bg-brand-indigo selection:text-white">
      {/* Public Masthead Header */}
      <PublicHeader />
      <DocsSubNav />

      {/* Hero Section */}
      <section className="bg-paper-raised border-b-2 border-border-rule py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#D8D1C4_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-rule/80">
            <div className="flex items-center gap-2">
              <Sticker name="approved-seal" size="sm" />
              <span className="text-xs font-mono uppercase tracking-widest text-brand-indigo font-bold">
                Official Terms of Service • Legal Agreement
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-primary font-medium transition-colors cursor-pointer"
                title="สั่งพิมพ์เอกสาร"
              >
                <Printer className="w-3.5 h-3.5 text-ink-secondary" />
                <span>พิมพ์เอกสาร</span>
              </button>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-ink-primary tracking-tight">
            ข้อกำหนดและเงื่อนไขการให้บริการ (Terms of Service)
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary max-w-3xl leading-relaxed font-sans">
            สัญญาผูกพันทางกฎหมายระหว่างท่านและ RetzPost เพื่อกำหนดสิทธิ หน้าที่ และความรับผิดชอบในการใช้งานแพลตฟอร์มกองบรรณาธิการ RETZPOST
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px] text-ink-secondary">
            <span className="bg-paper-canvas px-2.5 py-1 rounded border border-border-rule">
              มีผลบังคับใช้: <strong className="text-ink-primary">24 ตุลาคม 2026</strong>
            </span>
            <span className="bg-semantic-success-bg text-semantic-success px-2.5 py-1 rounded border border-semantic-success/20 font-bold">
              ✓ 100% Creator Ownership Guaranteed
            </span>
          </div>
        </div>
      </section>

      {/* Creator Pledge Highlight Card */}
      <section className="bg-paper-subtle/50 border-b border-border-rule py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="p-4 rounded-dialog bg-paper-raised border-2 border-brand-indigo/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-ink-primary">
                  คำมั่นสัญญาในลิขสิทธิ์เนื้อหา (Creator Ownership Pledge)
                </h3>
                <p className="text-[11px] text-ink-secondary font-sans leading-snug">
                  ท่านยังคงเป็นเจ้าของลิขสิทธิ์ในรูปภาพ วิดีโอสั้น และข้อความแคปชันทั้งหมด 100% RetzPost ไม่มีสิทธิ์นำผลงานของท่านไปดัดแปลง ขาย หรือเคลมความเป็นเจ้าของเด็ดขาด
                </p>
              </div>
            </div>
            <Sticker name="shield-certified" size="sm" />
          </div>
        </div>
      </section>

      {/* Main Content with 2-Column Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Section Menu */}
          <aside className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="p-4 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs">
              <span className="text-xs font-mono font-bold text-ink-primary uppercase tracking-wider block pb-3 mb-3 border-b border-border-rule/80">
                หัวข้อสัญญา (Articles)
              </span>

              <nav className="space-y-1">
                {termsNav.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveSection(item.id);
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

            <div className="p-4 bg-paper-subtle/70 border border-border-rule rounded-dialog text-xs space-y-2">
              <span className="font-mono font-bold text-ink-primary block text-[11px] uppercase tracking-wider">
                เอกสารที่เกี่ยวข้อง
              </span>
              <Link
                href="/privacy"
                className="flex items-center gap-1.5 text-brand-indigo hover:underline font-mono text-[11px] font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-semantic-success" />
                <span>นโยบายความเป็นส่วนตัว (Privacy Policy) →</span>
              </Link>
            </div>
          </aside>

          {/* Right Column: Detailed Terms Clauses */}
          <main className="lg:col-span-8 space-y-8">
            {/* Clause 1 */}
            <article id="term-1" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  SECTION 01
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  1. การยอมรับข้อกำหนด (Acceptance of Terms)
                </h2>
              </div>

              <div className="p-3.5 rounded-editorial bg-brand-indigo/5 border-l-3 border-brand-indigo text-xs space-y-1">
                <strong className="text-brand-indigo font-mono block text-[11px]">
                  💡 สรุปภาษาคนเข้าใจง่าย:
                </strong>
                <p className="text-ink-primary/90 font-sans leading-relaxed">
                  เมื่อคุณสมัครสมาชิกหรือเข้าใช้ RetzPost ถือว่าคุณยอมรับเงื่อนไขเหล่านี้ หากไม่ยอมรับกรุณาอย่าใช้งาน
                </p>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-ink-secondary font-sans pt-1">
                <p>
                  การเข้าถึงและใช้งานบริการ RETZPOST ถือว่าท่านตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขการให้บริการฉบับนี้ รวมถึงนโยบายความเป็นส่วนตัว (Privacy Policy) ซึ่งถือเป็นสัญญาที่มีผลผูกพันตามกฎหมายระหว่างท่านและ RetzPost
                </p>
              </div>
            </article>

            {/* Clause 2 */}
            <article id="term-2" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  SECTION 02
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  2. สิทธิในผลงานของผู้ใช้ 100% (Creator Content Ownership)
                </h2>
              </div>

              <div className="p-3.5 rounded-editorial bg-semantic-success-bg/40 border-l-3 border-semantic-success text-xs space-y-1">
                <strong className="text-semantic-success font-mono block text-[11px]">
                  💡 สรุปภาษาคนเข้าใจง่าย:
                </strong>
                <p className="text-ink-primary/90 font-sans leading-relaxed">
                  คลิป วิดีโอ รูปภาพ ข้อความที่คุณอัปโหลด เป็นของคุณ 100% เราทำหน้าที่แค่ &quot;ส่งไปโพสต์&quot; ตามที่คุณกดสั่งเท่านั้น
                </p>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-ink-secondary font-sans pt-1">
                <p>
                  ท่านยังคงเป็นเจ้าของสิทธิในทรัพย์สินทางปัญญาทั้งหมดที่มีอยู่ในเนื้อหาที่ท่านสร้างขึ้น RetzPost ไม่ถือสิทธิ์ความเป็นเจ้าของในเนื้อหาใดๆ ของท่าน ท่านเพียงมอบสิทธิ์การใช้งานที่จำกัดแก่ RetzPost เพื่อดำเนินการส่งต่อเนื้อหาไปยัง Social Media APIs (Facebook, Instagram, YouTube, TikTok, X, Lemon8) ตามที่ท่านกำหนด
                </p>
              </div>
            </article>

            {/* Clause 3 */}
            <article id="term-3" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  SECTION 03
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  3. กฎการใช้งานที่ยอมรับได้ (Acceptable Use Policy)
                </h2>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-ink-secondary font-sans">
                <p>ท่านตกลงที่จะไม่กระทำการดังต่อไปนี้:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 font-mono text-[11px]">
                  <li>เผยแพร่เนื้อหาที่ละเมิดลิขสิทธิ์ เครื่องหมายการค้า หรือผิดกฎหมายความมั่นคง</li>
                  <li>การสร้างบอทส่งสแปมซ้ำซ้อนจนส่งผลกระทบต่อ API Rate Limits ของแพลตฟอร์ม</li>
                  <li>พยายามแฮก ดัดแปลง เจาะระบบ หรือเข้าถึง Token Vault โดยไม่ได้รับอนุญาต</li>
                </ul>
              </div>
            </article>

            {/* Clause 4 */}
            <article id="term-4" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  SECTION 04
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  4. ความรับผิดชอบต่อความปลอดภัยของบัญชี (Account Security)
                </h2>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-ink-secondary font-sans">
                <p>
                  ท่านมีหน้าที่รักษารหัสผ่านและรหัสยืนยัน OTP ให้ปลอดภัย หากพบพฤติกรรมที่น่าสงสัย ให้เปลี่ยนรหัสผ่านทันทีที่หน้า <Link href="/forgot-password" className="text-brand-indigo underline font-semibold">/forgot-password</Link>
                </p>
              </div>
            </article>

            {/* Clause 5, 6, 7 */}
            <article id="term-5" className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-4">
              <div className="pb-3 border-b-2 border-border-rule">
                <span className="text-[10px] font-mono text-brand-indigo font-bold uppercase tracking-wider block mb-1">
                  SECTION 05 - 07
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                  5 - 7. ข้อจำกัดความรับผิดชอบและกฎหมายที่ใช้บังคับ (Legal Governance)
                </h2>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-ink-secondary font-sans">
                <p>
                  <strong>ข้อจำกัดความรับผิดชอบ:</strong> เนื่องจากความพร้อมในการใช้งานของ Social Media APIs (เช่น การล่มของระบบ Meta หรือ TikTok) อยู่นอกเหนือการควบคุมโดยตรง RetzPost จะไม่รับผิดชอบต่อความสูญเสียทางธุรกิจอันเกิดจากเหตุสุดวิสัยดังกล่าว
                </p>
                <p>
                  <strong>กฎหมายที่ใช้บังคับ:</strong> ข้อกำหนดนี้ให้อยู่ภายใต้และการตีความตามกฎหมายแห่งราชอาณาจักรไทย
                </p>
              </div>

              {/* Bottom Navigation */}
              <div className="pt-4 border-t border-border-rule/80 flex items-center justify-between text-xs font-mono">
                <Link
                  href="/privacy"
                  className="text-brand-indigo hover:underline flex items-center gap-1 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>อ่านนโยบายความเป็นส่วนตัว (Privacy Policy)</span>
                </Link>

                <Link
                  href="/docs"
                  className="text-brand-indigo hover:underline font-semibold flex items-center gap-1"
                >
                  <span>อ่านคู่มือการใช้งานระบบ (Docs & Guide)</span>
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
