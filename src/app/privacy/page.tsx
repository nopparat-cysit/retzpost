'use client';

import React from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { PublicHeader, PublicFooter } from '@/components/layout/public-nav';
import { Sticker } from '@/components/ui/sticker';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col font-sans selection:bg-brand-indigo selection:text-white">
      {/* Public Top Header */}
      <PublicHeader />

      {/* Header Banner */}
      <section className="bg-paper-raised border-b border-border-rule py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <Sticker name="shield-certified" size="sm" />
            <span className="text-xs font-mono uppercase tracking-widest text-semantic-success font-bold">
              Privacy & Data Protection Certified
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
            นโยบายความเป็นส่วนตัว (Privacy Policy)
          </h1>
          <p className="text-xs font-mono text-ink-secondary">
            มีผลบังคับใช้ตั้งแต่วันที่: <strong className="text-ink-primary">24 ตุลาคม 2026</strong> | สอดคล้องตาม PDPA, Meta Platform Policy, และ Google API Services Policy
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="bg-paper-raised border border-border-rule rounded-dialog p-6 sm:p-10 shadow-xs space-y-8 text-xs leading-relaxed text-ink-secondary">
          
          {/* Quick Summary Box */}
          <div className="p-4 bg-paper-subtle rounded-editorial border border-border-rule space-y-2">
            <h3 className="font-bold text-sm text-ink-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-indigo" />
              <span>สรุปสาระสำคัญใน 1 นาที (Privacy at a Glance)</span>
            </h3>
            <ul className="space-y-1.5 pl-1 font-mono text-[11px]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success shrink-0 mt-0.5" />
                <span><strong>เราไม่ขายข้อมูลของคุณ:</strong> RetzPost ไม่เคยและจะไม่มีวันขายข้อมูลส่วนบุคคล เนื้อหา หรือสถิติของคุณแก่บุคคลภายนอก</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success shrink-0 mt-0.5" />
                <span><strong>จัดเก็บโทเคนด้วยการเข้ารหัส:</strong> ข้อมูล Access Token ทุกแพลตฟอร์มถูกเข้ารหัสด้วยมาตรฐานระดับธนาคาร AES-256 GCM</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success shrink-0 mt-0.5" />
                <span><strong>คุณเป็นเจ้าของข้อมูล 100%:</strong> คุณสามารถสั่งเพิกถอนสิทธิ์การเชื่อมต่อ (Revoke) หรือขอลบข้อมูลทั้งหมดได้ตลอดเวลา</span>
              </li>
            </ul>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              1. บทนำและขอบเขตการบังคับใช้ (Introduction & Scope)
            </h2>
            <p>
              บริษัท RetzPost SaaS Technologies จำกัด (&quot;RetzPost&quot;, &quot;เรา&quot;, &quot;พวกเรา&quot;) ให้ความสำคัญอย่างยิ่งต่อการคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้งาน นโยบายความเป็นส่วนตัวฉบับนี้จัดทำขึ้นเพื่อชี้แจงแนวปฏิบัติในการเก็บรวบรวม ใช้ เปิดเผย และปกป้องข้อมูลส่วนบุคคลของท่านเมื่อเข้าใช้งานเว็บไซต์ แพลตฟอร์ม MULTIPOST และบริการใดๆ ที่เกี่ยวข้อง
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              2. ข้อมูลที่เราจัดเก็บ (Personal Data We Collect)
            </h2>
            <p>ในการให้บริการตั้งเวลาและเผยแพร่คอนเทนต์ข้ามแพลตฟอร์ม เราจำเป็นต้องจัดเก็บข้อมูลเท่าที่จำเป็นดังนี้:</p>
            <div className="space-y-2 pl-2">
              <div>
                <strong className="text-ink-primary font-semibold block">ก. ข้อมูลการลงทะเบียนและการระบุตัวตน (Account Data):</strong>
                <p>ที่อยู่อีเมล Gmail, ชื่อผู้ใช้งาน (Username), และรหัสผ่านที่ผ่านการแฮชแบบเข้ารหัสทางเดียว (One-way Cryptographic Hash)</p>
              </div>
              <div>
                <strong className="text-ink-primary font-semibold block">ข. ข้อมูลการเชื่อมต่อโซเชียลมีเดีย (Connected Account Credentials):</strong>
                <p>โทเคนยืนยันสิทธิ์ OAuth Access Tokens, หมายเลขบัญชี Page IDs, Channel IDs, และชื่อโปรไฟล์สาธารณะที่ท่านเลือกเชื่อมต่อ</p>
              </div>
              <div>
                <strong className="text-ink-primary font-semibold block">ค. เนื้อหาและประวัติการเผยแพร่ (Content & Telemetry Logs):</strong>
                <p>ข้อความแคปชัน, แฮชแท็ก, ลิงก์ไฟล์สื่อภาพ/วิดีโอ, กำหนดเวลาปล่อยโพสต์, และบันทึกประวัติการยิงสำเร็จ (Audit Logs)</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              3. วัตถุประสงค์ในการประมวลผลข้อมูล (Purpose of Data Processing)
            </h2>
            <p>เรานำข้อมูลส่วนบุคคลของท่านไปใช้เพื่อวัตถุประสงค์ดังต่อไปนี้เท่านั้น:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>ส่งคำสั่งเผยแพร่เนื้อหาและตั้งเวลาโพสต์ไปยัง Social Media APIs (Facebook, Instagram, YouTube, TikTok, X, Lemon8) ตามคำสั่งของท่าน</li>
              <li>ส่งรหัส OTP 6 หลักไปยังอีเมล Gmail เพื่อยืนยันตัวตนในการสมัครสมาชิกหรือกู้คืนรหัสผ่าน</li>
              <li>คำนวณและแสดงผลสถิติประสิทธิภาพการทำงาน (KPI & Dispatch Monitor) ภายในองค์กรของท่าน</li>
              <li>รักษาความปลอดภัยและตรวจสอบความผิดปกติในการเข้าใช้งานระบบ</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              4. การรักษาความมั่นคงปลอดภัยของข้อมูล (Data Security & Token Vault)
            </h2>
            <p>
              เราใช้มาตรการทางเทคนิคและการบริหารจัดการระดับมาตรฐานสากลเพื่อปกป้องข้อมูลของท่าน:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>การเข้ารหัสข้อมูลขณะจัดเก็บ (Encryption at Rest):</strong> โทเคน Access Token และข้อมูลที่เป็นความลับจะถูกเข้ารหัสด้วยอัลกอริทึม AES-256 GCM ภายใน Token Vault</li>
              <li><strong>การเข้ารหัสข้อมูลขณะส่งผ่าน (Encryption in Transit):</strong> ทุกการรับส่งข้อมูลผ่านเครือข่ายอินเทอร์เน็ตจะดำเนินการผ่านโพรโทคอล HTTPS/TLS 1.3</li>
              <li><strong>ระบบควบคุมสิทธิ์ระดับบทบาท (RBAC):</strong> เฉพาะผู้มีอำนาจตามบทบาทที่ได้รับมอบหมายเท่านั้นที่สามารถเข้าถึงฟังก์ชันจัดการได้</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              5. การปฏิบัติตามนโยบายแพลตฟอร์มพันธมิตร (Third-Party Platforms Compliance)
            </h2>
            <p>
              การใช้งาน RetzPost มีการเชื่อมต่อกับ Application Programming Interfaces (APIs) ของบุคคลภายนอก การใช้งานข้อมูลดังกล่าวสอดคล้องกับข้อกำหนดของแต่ละแพลตฟอร์มอย่างเคร่งครัด:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <div className="p-2.5 rounded bg-paper-subtle border border-border-rule">
                <span className="font-bold text-ink-primary block mb-1">Meta Platforms (Facebook & IG):</span>
                <span>ปฏิบัติตาม Meta Platform Terms and Developer Policies ไม่มีการเก็บข้อมูลผู้ใช้นอกเหนือจากเพจที่ได้รับอนุญาต</span>
              </div>
              <div className="p-2.5 rounded bg-paper-subtle border border-border-rule">
                <span className="font-bold text-ink-primary block mb-1">Google & YouTube:</span>
                <span>ปฏิบัติตาม YouTube API Terms of Service และ Google API Services User Data Policy</span>
              </div>
              <div className="p-2.5 rounded bg-paper-subtle border border-border-rule">
                <span className="font-bold text-ink-primary block mb-1">TikTok:</span>
                <span>ปฏิบัติตาม TikTok Developer Terms of Service สำหรับการอัปโหลดวิดีโอและภาพ</span>
              </div>
              <div className="p-2.5 rounded bg-paper-subtle border border-border-rule">
                <span className="font-bold text-ink-primary block mb-1">X (Twitter):</span>
                <span>ปฏิบัติตาม Developer Agreement & Policy ในการสร้างและลบทวีตผ่าน X API v2</span>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              6. สิทธิของผู้เป็นเจ้าของข้อมูล (Your Privacy Rights)
            </h2>
            <p>ภายใต้กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA และ GDPR) ท่านมีสิทธิดังนี้:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>สิทธิในการเพิกถอนความยินยอม (Revocation):</strong> ท่านสามารถยกเลิกการเชื่อมต่อเพจหรือช่องทางโซเชียลได้ตลอดเวลาที่หน้า <code>/accounts</code></li>
              <li><strong>สิทธิในการขอลบข้อมูล (Right to Erasure):</strong> ท่านสามารถขอลบประวัติการโพสต์หรือลบบัญชีผู้ใช้ RetzPost ของท่านได้อย่างถาวร</li>
              <li><strong>สิทธิในการเข้าถึงและขอรับสำเนาข้อมูล (Data Portability):</strong> ท่านสามารถส่งออกข้อมูลประวัติการยิงโพสต์เป็นไฟล์ CSV ได้</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-ink-primary border-b border-border-rule/80 pb-1.5">
              7. ช่องทางการติดต่อเจ้าหน้าที่คุ้มครองข้อมูล (Contact Information)
            </h2>
            <p>
              หากท่านมีข้อสงสัย ข้อเสนอแนะ หรือต้องการใช้สิทธิตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) ของเราได้ที่:
            </p>
            <div className="p-3 bg-paper-subtle rounded-editorial border border-border-rule font-mono text-[11px] space-y-1">
              <p><strong>ฝ่ายความปลอดภัยและความเป็นส่วนตัว (Data Protection Office):</strong></p>
              <p>อีเมล: <span className="text-brand-indigo font-bold">privacy@retzpost.com</span> หรือ <span className="text-brand-indigo font-bold">security@retzpost.com</span></p>
              <p>ที่อยู่: RetzPost SaaS Desk, Bangkok, Thailand</p>
            </div>
          </section>

          {/* Bottom Back Button */}
          <div className="pt-4 border-t border-border-rule/80 flex items-center justify-between">
            <Link
              href="/register"
              className="text-xs font-mono text-brand-indigo hover:underline flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าสมัครสมาชิก (Register)</span>
            </Link>

            <Link
              href="/terms"
              className="text-xs font-mono text-brand-indigo hover:underline font-semibold"
            >
              อ่านข้อกำหนดการให้บริการ (Terms of Service) →
            </Link>
          </div>
        </div>
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
