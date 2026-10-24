'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { PublicHeader, PublicFooter } from '@/components/layout/public-nav';
import { Sticker } from '@/components/ui/sticker';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col font-sans selection:bg-brand-indigo selection:text-white">
      {/* Public Top Header */}
      <PublicHeader />

      {/* Header Banner */}
      <section className="bg-paper-raised border-b border-border-rule py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <Sticker name="approved-seal" size="sm" />
            <span className="text-xs font-mono uppercase tracking-widest text-brand-indigo font-bold">
              Legal & Service Agreement
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
            ข้อกำหนดและเงื่อนไขการให้บริการ (Terms of Service)
          </h1>
          <p className="text-xs font-mono text-ink-secondary">
            มีผลบังคับใช้ตั้งแต่วันที่: <strong className="text-ink-primary">24 ตุลาคม 2026</strong> | สัญญาผูกพันทางกฎหมายระหว่างผู้ใช้งานและ RetzPost
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="bg-paper-raised border border-border-rule rounded-dialog p-6 sm:p-10 shadow-xs space-y-8 text-xs leading-relaxed text-ink-secondary">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              1. การยอมรับข้อกำหนด (Acceptance of Terms)
            </h2>
            <p>
              การเข้าใช้งาน การสมัครสมาชิก หรือการเชื่อมต่อบัญชีโซเชียลมีเดียผ่านแพลตฟอร์ม MULTIPOST (RetzPost) ถือว่าท่านได้อ่าน ทำความเข้าใจ และตกลงที่จะผูกพันตนเองตามข้อกำหนดและเงื่อนไขการให้บริการฉบับนี้ รวมถึงนโยบายความเป็นส่วนตัว (Privacy Policy) หากท่านไม่ยอมรับข้อกำหนดเหล่านี้ โปรดยุติการเข้าใช้งานบริการโดยทันที
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              2. สิทธิในเนื้อหาของผู้ใช้ (Content Ownership & Intellectual Property)
            </h2>
            <p>
              <strong>ท่านยังคงเป็นเจ้าของสิทธิในเนื้อหาทั้งหมดของท่าน 100%:</strong> ข้อความ ภาพถ่าย วิดีโอ และทรัพย์สินทางปัญญาใดๆ ที่ท่านสร้างขึ้นหรืออัปโหลดเข้าสู่ RetzPost ยังคงเป็นกรรมสิทธิ์ของท่านโดยสมบูรณ์ RetzPost ไม่ถือสิทธิความเป็นเจ้าของในผลงานของท่าน
            </p>
            <p>
              ท่านอนุญาตให้ RetzPost มีสิทธิ์ในการส่งต่อข้อมูลเนื้อหาไปยัง Social Media APIs ตามคำสั่งการปล่อยโพสต์ที่ท่านได้ตั้งเวลาหรือกดยิงเท่านั้น
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              3. ข้อห้ามและการใช้งานที่ยอมรับได้ (Acceptable Use Policy)
            </h2>
            <p>ท่านตกลงที่จะไม่ใช้งาน RetzPost เพื่อการกระทำดังต่อไปนี้:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>เผยแพร่เนื้อหาที่ผิดกฎหมาย ละเมิดลิขสิทธิ์ เครื่องหมายการค้า หรือสิทธิในทรัพย์สินทางปัญญาของบุคคลอื่น</li>
              <li>การส่งข้อความสแปม (Spam) หรือสร้างบอทยิงโพสต์ซ้ำซ้อนจนก่อให้เกิดความเสียหายแก่แพลตฟอร์มปลายทาง</li>
              <li>การพยายามเจาะระบบ หรือถอดรหัส (Reverse Engineering) กลไก Token Vault และระบบรักษาความปลอดภัยของ RetzPost</li>
              <li>การกระทำที่ละเมิดข้อกำหนดการใช้งานของผู้ให้บริการโซเชียลมีเดีย (Meta, Google, TikTok, X, Lemon8)</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              4. ความรับผิดชอบต่อบัญชีและรหัสผ่าน (Account Security)
            </h2>
            <p>
              ท่านมีหน้าที่ในการรักษารหัสผ่านและรหัสยืนยัน OTP ให้เป็นความลับ การกระทำใดๆ ที่เกิดขึ้นภายใต้บัญชีผู้ใช้ของท่าน ถือเป็นความรับผิดชอบของท่านโดยตรง หากท่านพบการเข้าถึงโดยไม่ได้รับอนุญาต โปรดแจ้งให้เราทราบทันทีที่ <code>security@retzpost.com</code>
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              5. ข้อจำกัดความรับผิดชอบ (Limitation of Liability)
            </h2>
            <p>
              RetzPost มุ่งมั่นให้บริการด้วยความเสถียรสูงสุด อย่างไรก็ดี เนื่องจากความพร้อมในการใช้งานของบริการภายนอก (Social Media APIs) เช่น การหยุดชะงักของเครือข่าย หรือข้อจำกัด Rate Limits ของแต่ละแพลตฟอร์มอยู่นอกเหนือการควบคุมโดยตรงของเรา เราจึงไม่รับผิดชอบต่อความสูญเสียทางธุรกิจหรือความล่าช้าในการเผยแพร่อันเกิดจากเหตุดังกล่าว
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              6. กฎหมายที่ใช้บังคับ (Governing Law)
            </h2>
            <p>
              ข้อกำหนดฉบับนี้ให้อยู่ภายใต้และการตีความตามกฎหมายของราชอาณาจักรไทย ข้อพิพาทใดๆ ที่เกิดขึ้นจะอยู่ภายใต้เขตอำนาจของศาลไทย
            </p>
          </section>

          {/* Bottom Back Button */}
          <div className="pt-4 border-t border-border-rule/80 flex items-center justify-between">
            <Link
              href="/privacy"
              className="text-xs font-mono text-brand-indigo hover:underline flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>อ่านนโยบายความเป็นส่วนตัว (Privacy Policy)</span>
            </Link>

            <Link
              href="/docs"
              className="text-xs font-mono text-brand-indigo hover:underline font-semibold"
            >
              อ่านคู่มือการใช้งานระบบ (Docs & Guide) →
            </Link>
          </div>
        </div>
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
