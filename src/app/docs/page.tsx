'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  BookOpen, 
  Rocket, 
  PenSquare, 
  Calendar, 
  Users, 
  BarChart3, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Share2,
  Sparkles,
  Lock,
  Layers,
  FileText
} from 'lucide-react';
import { PublicHeader, PublicFooter } from '@/components/layout/public-nav';
import { Sticker } from '@/components/ui/sticker';
import { 
  FacebookLogo, 
  InstagramLogo, 
  YouTubeLogo, 
  TikTokLogo, 
  XLogo, 
  Lemon8Logo 
} from '@/components/ui/social-icons';

interface DocSection {
  id: string;
  title: string;
  badge: string;
  icon: any;
  summary: string;
  content: React.ReactNode;
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('quickstart');

  const docSections: DocSection[] = useMemo(() => [
    {
      id: 'quickstart',
      title: '1. เริ่มต้นใช้งานด่วน (Quickstart & Onboarding)',
      badge: 'เริ่มต้นที่นี่',
      icon: Rocket,
      summary: 'การสมัครสมาชิก, ยืนยันรหัส OTP ผ่าน Gmail, และการตั้งค่าโปรเจกต์แรก',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-ink-secondary">
          <p>
            <strong className="text-ink-primary font-semibold">MULTIPOST (RetzPost)</strong> คือแพลตฟอร์มกองบรรณาธิการดิจิทัล (Editorial Desk) ที่ออกแบบมาเพื่อช่วยให้ครีเอเตอร์และทีมมีเดียสามารถ <em>&quot;สร้างคอนเทนต์ครั้งเดียว แล้วปรับแต่งกระจายลงทุกโซเชียลพร้อมกัน&quot;</em>
          </p>

          <div className="p-3 bg-paper-subtle rounded-editorial border border-border-rule space-y-2">
            <h4 className="font-bold text-ink-primary flex items-center gap-1.5 text-xs">
              <Sticker name="approved-seal" size="xs" />
              <span>ขั้นตอนการเริ่มต้นใช้งาน 3 นาที</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 pl-1 font-mono text-[11px]">
              <li>
                <strong className="text-ink-primary">สมัครสมาชิกใหม่:</strong> ไปที่หน้า{' '}
                <Link href="/register" className="text-brand-indigo underline font-semibold">
                  /register
                </Link>{' '}
                กรอก Gmail, ชื่อผู้ใช้งาน (Username), และรหัสผ่าน
              </li>
              <li>
                <strong className="text-ink-primary">ยืนยันรหัส OTP:</strong> ระบบจะส่งรหัส 6 หลักไปยัง Gmail ของคุณ กรอกรหัสเพื่อยืนยันตัวตน (หรือคลิกปุ่ม 1-Click Autofill บนกล่องแจ้งเตือน)
              </li>
              <li>
                <strong className="text-ink-primary">เลือกโปรเจกต์ (Workspace Isolation):</strong> ระบบจะแบ่งข้อมูลออกเป็นโปรเจกต์อย่างเคร่งครัด เช่น <em>Capital One</em>, <em>Acme Studio</em>, <em>Coffee Craft</em>
              </li>
            </ol>
          </div>

          <div className="border-l-2 border-brand-indigo pl-3 py-1 bg-brand-indigo/5 rounded-r">
            <p className="text-[11px] text-brand-indigo font-medium">
              💡 <strong>Global Workspace Sync:</strong> เมื่อคุณสลับเลือกโปรเจกต์ที่หน้าใดหน้าหนึ่ง ระบบจะอัปเดตตัวกรองในหน้าแดชบอร์ด, ปฏิทิน, และหน้าสร้างโพสต์ให้ตรงกันทุกหน้าจอโดยอัตโนมัติ
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'composer',
      title: '2. ห้องเขียนข่าว & ปล่อยโพสต์ (Studio Dispatch Composer)',
      badge: 'Core Feature',
      icon: PenSquare,
      summary: 'การเลือกช่องทาง, สลับโหมดสื่อ 3 รูปแบบ, และ Live Phone Preview 9:16',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-ink-secondary">
          <p>
            หน้าสร้างโพสต์ (<Link href="/create" className="text-brand-indigo underline font-semibold">/create</Link>) ถูกออกแบบเสมือนโต๊ะข่าว บ.ก. แบบ 3 คอลัมน์ที่ทรงพลัง:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-editorial bg-paper-subtle border border-border-rule">
              <span className="font-mono font-bold text-ink-primary block mb-1">คอลัมน์ที่ 1: ปลายทาง</span>
              <p className="text-[11px]">
                เลือกบัญชีและเพจที่ต้องการยิงโพสต์ รองรับ Facebook, Instagram, YouTube, TikTok, X (Twitter), Lemon8
              </p>
            </div>
            <div className="p-2.5 rounded-editorial bg-paper-subtle border border-border-rule">
              <span className="font-mono font-bold text-ink-primary block mb-1">คอลัมน์ที่ 2: เนื้อหาข่าว</span>
              <p className="text-[11px]">
                พิมพ์หัวข้อข่าว, แคปชัน, แฮชแท็ก พร้อมตัวช่วย AI Magic Writer แนะนำคำโปรยที่ดึงดูด
              </p>
            </div>
            <div className="p-2.5 rounded-editorial bg-paper-subtle border border-border-rule">
              <span className="font-mono font-bold text-ink-primary block mb-1">คอลัมน์ที่ 3: Live Preview</span>
              <p className="text-[11px]">
                ดูหน้าจอโทรศัพท์จำลองอัตราส่วน 9:16 แบบ Real-time ตาม Layout จริงของแต่ละแอป
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-ink-primary text-xs">โหมดสื่อที่รองรับ:</h4>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li><strong>Photos (อัลบั้มรูปภาพ):</strong> เหมาะสำหรับ Facebook Feed, Instagram Carousel, Lemon8 Story</li>
              <li><strong>Video / Reels (วิดีโอแนวตั้ง 9:16):</strong> เหมาะสำหรับ YouTube Shorts, TikTok, Instagram Reels, Facebook Reels</li>
              <li><strong>Text Status (ข้อความล้วน):</strong> รองรับ X (Twitter), Threads, และ Facebook Feed</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'calendar',
      title: '3. ปฏิทินกองบรรณาธิการ (Editorial Calendar)',
      badge: 'การจัดตาราง',
      icon: Calendar,
      summary: 'การวางแผนคอนเทนต์ล่วงหน้า และเวลานาทีทอง Bangkok Golden Peak Slots',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-ink-secondary">
          <p>
            หน้าปฏิทิน (<Link href="/calendar" className="text-brand-indigo underline font-semibold">/calendar</Link>) ช่วยให้ทีมมองเห็นภาพรวมของคอนเทนต์ตลอดทั้งสัปดาห์และทั้งเดือน ป้องกันปัญหาการโพสต์ทับซ้อนหรือช่วงเวลาที่ขาดการเคลื่อนไหว
          </p>

          <div className="p-3 bg-paper-subtle rounded-editorial border border-border-rule space-y-2">
            <h4 className="font-bold text-ink-primary text-xs flex items-center gap-1.5">
              <Sticker name="clock-peak" size="xs" />
              <span>Bangkok Golden Peak Slots (เวลานาทีทองที่ Engagement สูงสุด):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-paper-canvas border border-border-rule">
                <span className="font-bold text-brand-indigo block">☀️ มื้อเที่ยง (Lunch Break):</span>
                <span>11:30 น. - 13:30 น. (อัตราการเปิดดูฟีดพุ่งสูง)</span>
              </div>
              <div className="p-2 rounded bg-paper-canvas border border-border-rule">
                <span className="font-bold text-accent-terracotta block">🌙 หัวค่ำ (Prime Evening):</span>
                <span>18:30 น. - 21:30 น. (ช่วงเวลาเสพคลิปสั้นที่ดีที่สุด)</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'roles',
      title: '4. บทบาททีมและระบบอนุมัติ (Team Roles & Approval Workflow)',
      badge: 'Governance',
      icon: Users,
      summary: 'สิทธิ์ 5 ระดับ และกระบวนการตรวจแก้งานด้วยตราประทับ Approved / Needs Revision',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-ink-secondary">
          <p>
            เพื่อรักษามาตรฐานของเนื้อหาในระดับองค์กร RetzPost มีระบบจัดการสิทธิ์ 5 ลำดับขั้น:
          </p>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-2 rounded bg-paper-subtle border border-border-rule flex items-center justify-between">
              <div>
                <strong className="text-ink-primary">👑 Owner (เจ้าขององค์กร):</strong> จัดการบิลลิ่ง สิทธิ์ และการลบโปรเจกต์
              </div>
              <span className="px-1.5 py-0.2 rounded bg-brand-indigo/10 text-brand-indigo font-bold text-[9px]">Full Access</span>
            </div>
            <div className="p-2 rounded bg-paper-subtle border border-border-rule flex items-center justify-between">
              <div>
                <strong className="text-ink-primary">⭐ Manager (ผู้จัดการโปรเจกต์):</strong> อนุมัติโพสต์, ลบโพสต์ฉุกเฉิน, ตรวจสอบ KPI
              </div>
              <span className="px-1.5 py-0.2 rounded bg-brand-indigo/10 text-brand-indigo font-bold text-[9px]">Approve & Revoke</span>
            </div>
            <div className="p-2 rounded bg-paper-subtle border border-border-rule flex items-center justify-between">
              <div>
                <strong className="text-ink-primary">✍️ Lead Editor (หัวหน้ากอง บ.ก.):</strong> ตรวจแก้ต้นฉบับ ประทับตรา Approved
              </div>
              <span className="px-1.5 py-0.2 rounded bg-semantic-info-bg text-semantic-info font-bold text-[9px]">Editor</span>
            </div>
            <div className="p-2 rounded bg-paper-subtle border border-border-rule flex items-center justify-between">
              <div>
                <strong className="text-ink-primary">🎨 Creator (ครีเอเตอร์):</strong> เขียนโพสต์ อัปโหลดคลิป และส่งงานเพื่อรอรีวิว
              </div>
              <span className="px-1.5 py-0.2 rounded bg-semantic-warning-bg text-semantic-warning font-bold text-[9px]">Draft & Submit</span>
            </div>
            <div className="p-2 rounded bg-paper-subtle border border-border-rule flex items-center justify-between">
              <div>
                <strong className="text-ink-primary">🔍 Viewer (ผู้สังเกตการณ์):</strong> ดูปฏิทินและสถิติภาพรวมเท่านั้น
              </div>
              <span className="px-1.5 py-0.2 rounded bg-paper-canvas text-ink-secondary font-bold text-[9px]">Read-Only</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'kpi',
      title: '5. ระบบประเมิน KPI & AI Coaching Synthesis',
      badge: 'AI Analytics',
      icon: BarChart3,
      summary: 'การคำนวณสถิติ 4 มิติ, สังเคราะห์ข้อแนะนำด้วย AI, และออกใบประเมิน (Slip)',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-ink-secondary">
          <p>
            ที่หน้าแดชบอร์ด (<Link href="/?tab=kpi" className="text-brand-indigo underline font-semibold">/?tab=kpi</Link>) มีระบบวัดผลงานของทีมผลิตคอนเทนต์อย่างเป็นธรรมและโปร่งใส โดยประเมินจาก 4 มิติหลัก:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded bg-paper-subtle border border-border-rule">
              <strong className="text-ink-primary block mb-0.5">1. ปริมาณงานเทียบเป้า (Volume Target):</strong>
              <span>อัตราการปล่อยโพสต์สำเร็จจริงเทียบกับโควตาเป้าหมายประจำเดือน</span>
            </div>
            <div className="p-2.5 rounded bg-paper-subtle border border-border-rule">
              <strong className="text-ink-primary block mb-0.5">2. การยิงตรงเวลา (On-Time %):</strong>
              <span>ความแม่นยำในการปล่อยโพสต์ตามเวลานาทีทองที่วางแผนไว้</span>
            </div>
            <div className="p-2.5 rounded bg-paper-subtle border border-border-rule">
              <strong className="text-ink-primary block mb-0.5">3. อัตราผ่านรอบแรก (First-Pass Quality):</strong>
              <span>งานที่มีคุณภาพสูง ผ่านการอนุมัติได้ทันทีโดยไม่ต้องตีกลับแก้ไขซ้ำ</span>
            </div>
            <div className="p-2.5 rounded bg-paper-subtle border border-border-rule">
              <strong className="text-ink-primary block mb-0.5">4. ยอดการเข้าชม (Total Impressions):</strong>
              <span>ยอดวิวและการเข้าชมจริงสะสมจาก Meta Graph, YouTube, และ TikTok</span>
            </div>
          </div>

          <div className="p-3 bg-paper-subtle rounded-editorial border border-border-rule space-y-1.5">
            <h4 className="font-bold text-ink-primary text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
              <span>AI Coaching & Printable Slip:</span>
            </h4>
            <p className="text-[11px]">
              ผู้จัดการสามารถกดปุ่ม <strong>[✨ สังเคราะห์ด้วย AI]</strong> เพื่อให้ระบบสร้างบทวิเคราะห์จุดเด่นและคำแนะนำภาษาไทย และกดปุ่ม <strong>[📄 พิมพ์ใบประเมิน (Slip)]</strong> เพื่อสั่งพิมพ์เอกสารเกรดผลงาน (A+, A, B) ส่งต่อให้ HR หรือพนักงานได้ในคลิกเดียว
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'revoke',
      title: '6. ระบบสั่งถอนโพสต์และข้อจำกัดของ API (Revoke Policy)',
      badge: 'Security',
      icon: Trash2,
      summary: 'มาตรฐานการสั่งลบโพสต์จริงผ่าน API แยกตามนโยบายของแต่ละโซเชียลมีเดีย',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-ink-secondary">
          <p>
            ในกรณีที่โพสต์มีข้อผิดพลาดหรือเกิดวิกฤติต้องการดึงโพสต์กลับด่วน RetzPost มีปุ่ม <strong>[🗑️ ถอนโพสต์]</strong> บน Dispatch Monitor ซึ่งทำงานตามมาตรฐานความปลอดภัยของแพลตฟอร์มจริง:
          </p>

          <div className="space-y-2">
            <div className="p-2.5 rounded bg-semantic-success-bg border border-semantic-success/30 text-semantic-success">
              <strong className="block text-xs font-bold mb-1">⚡ สั่งลบผ่าน API อัตโนมัติ (Direct API Deletion):</strong>
              <p className="text-[11px] leading-snug">
                <strong>Facebook, YouTube, X (Twitter):</strong> รองรับคำสั่ง <code>DELETE</code> ผ่าน Graph API, YouTube Data API, และ X API v2 อย่างเป็นทางการ เมื่อกดถอนโพสต์ ระบบจะยิงคำสั่งลบโพสต์และคลิปบนเพจจริงให้อัตโนมัติทันที
              </p>
            </div>

            <div className="p-2.5 rounded bg-semantic-warning-bg border border-semantic-warning/30 text-semantic-warning">
              <strong className="block text-xs font-bold mb-1">🛡️ ลบผ่าน Deep Link ภายในแอป (Guided Manual Deletion):</strong>
              <p className="text-[11px] leading-snug">
                <strong>Instagram, TikTok, Lemon8:</strong> นโยบายความปลอดภัยระดับสากลของ Meta และ ByteDance ไม่อนุญาตให้แอปพลิเคชันบุคคลที่สามลบคลิปแทนผู้ใช้ RetzPost จึงแสดงหน้าต่างพร้อมปุ่ม <em>[เปิดไปที่โพสต์จริงเพื่อกดลบ ↗]</em> (Deep Link) ให้เปิดเข้าไปกดเมนู <code>...</code> แล้วแตะ Delete ได้ภายใน 3 วินาที
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ], []);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return docSections;
    const q = searchQuery.toLowerCase();
    return docSections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.summary.toLowerCase().includes(q) ||
        sec.badge.toLowerCase().includes(q)
    );
  }, [docSections, searchQuery]);

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col font-sans selection:bg-brand-indigo selection:text-white">
      {/* Public Top Header */}
      <PublicHeader />

      {/* Hero Banner */}
      <section className="bg-paper-raised border-b border-border-rule py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono text-xs font-semibold border border-brand-indigo/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>RetzPost Documentation & Creator Knowledge Base</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
            คู่มือการใช้งานระบบ RetzPost
          </h1>
          <p className="text-sm text-ink-secondary max-w-2xl mx-auto leading-relaxed">
            แหล่งรวมคำแนะนำการใช้งาน, เทคนิคการกระจายโพสต์ข้ามแพลตฟอร์ม, การบริหารกองบรรณาธิการ, และการวิเคราะห์ผลงานแบบละเอียด ครบ จบ ในที่เดียว
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-ink-secondary absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="ค้นหาคู่มือ เช่น สมัครสมาชิก, ปฏิทิน, ลบโพสต์, KPI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-paper-canvas border border-border-rule rounded-editorial font-mono text-ink-primary placeholder:text-ink-secondary/50 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Table of Contents */}
          <aside className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-4 bg-paper-raised border border-border-rule rounded-dialog shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-rule/80">
                <span className="text-xs font-mono font-bold text-ink-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-accent-terracotta" />
                  สารบัญหัวข้อ (Topics)
                </span>
                <span className="text-[10px] font-mono text-ink-secondary">
                  {filteredSections.length} หมวดหมู่
                </span>
              </div>

              <nav className="space-y-1">
                {filteredSections.map((sec) => {
                  const isActive = activeSectionId === sec.id;
                  const Icon = sec.icon;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        setActiveSectionId(sec.id);
                        document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center justify-between text-left p-2 rounded-editorial text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-paper-canvas text-brand-indigo font-bold border border-border-rule shadow-2xs'
                          : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-indigo' : 'text-ink-secondary'}`} />
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'translate-x-0.5 text-brand-indigo' : 'opacity-40'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Links Card */}
            <div className="p-4 bg-paper-subtle/70 border border-border-rule rounded-dialog text-xs space-y-2.5">
              <span className="font-mono font-bold text-ink-primary block text-[11px] uppercase tracking-wider">
                เอกสารทางกฎหมายและความปลอดภัย
              </span>
              <div className="space-y-1 font-mono text-[11px]">
                <Link
                  href="/privacy"
                  className="flex items-center gap-1.5 text-brand-indigo hover:underline font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>นโยบายความเป็นส่วนตัว (Privacy Policy) →</span>
                </Link>
                <Link
                  href="/terms"
                  className="flex items-center gap-1.5 text-brand-indigo hover:underline font-semibold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>ข้อกำหนดการให้บริการ (Terms of Service) →</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Column: Detailed Sections */}
          <main className="lg:col-span-8 space-y-8">
            {filteredSections.length === 0 ? (
              <div className="p-8 text-center bg-paper-raised border border-border-rule rounded-dialog text-ink-secondary">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-mono">ไม่พบคู่มือที่ตรงกับคำค้นหา &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              filteredSections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <article
                    key={sec.id}
                    id={sec.id}
                    className="p-6 sm:p-8 bg-paper-raised border border-border-rule rounded-dialog shadow-xs scroll-mt-24 space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-border-rule/80">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-editorial bg-brand-indigo/10 text-brand-indigo flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h2 className="font-serif text-xl font-bold text-ink-primary tracking-tight">
                            {sec.title}
                          </h2>
                        </div>
                        <p className="text-xs text-ink-secondary font-mono">
                          {sec.summary}
                        </p>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper-subtle border border-border-rule text-ink-secondary shrink-0 font-semibold">
                        {sec.badge}
                      </span>
                    </div>

                    {/* Section Body */}
                    <div>{sec.content}</div>
                  </article>
                );
              })
            )}
          </main>
        </div>
      </div>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
