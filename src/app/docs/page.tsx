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
  FileText,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  ArrowLeft,
  Flame,
  Clock,
  Smartphone,
  Eye,
  CheckCheck
} from 'lucide-react';
import { PublicHeader, PublicFooter, DocsSubNav } from '@/components/layout/public-nav';
import { Sticker } from '@/components/ui/sticker';
import { useTranslation } from '@/modules/i18n/i18n-context';
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
  category: string;
  badge: string;
  icon: any;
  summary: string;
  lead: string;
  content: React.ReactNode;
}

export default function DocsPage() {
  const { t, locale } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('quickstart');
  const [copiedCode, setCopiedCode] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({ ...prev, [id]: type }));
  };

  // Structured Documentation Content
  const docSections: DocSection[] = useMemo(() => [
    {
      id: 'quickstart',
      category: '01 — GETTING STARTED',
      title: locale === 'en' ? 'Quickstart & Account Onboarding' : 'เริ่มต้นใช้งานและตั้งค่าบัญชีด่วน',
      badge: locale === 'en' ? 'Start Here' : 'เริ่มที่นี่',
      icon: Rocket,
      summary: locale === 'en' ? 'Registration, OTP verification via Gmail, and workspace selection' : 'การสมัครสมาชิก, ยืนยันรหัส OTP ทาง Gmail, และการเลือกโปรเจกต์',
      lead: locale === 'en' ? 'Learn how to set up your RetzPost account and start multi-channel publishing across social platforms in 3 minutes.' : 'เรียนรู้วิธีตั้งค่าบัญชี RetzPost และเริ่มกระจายโพสต์ลงทุกช่องทางโซเชียลมีเดียพร้อมกันภายใน 3 นาที',
      content: (
        <div className="space-y-6 text-xs leading-relaxed text-ink-secondary">
          {/* Visual Step-by-Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-dialog bg-paper-canvas border border-border-rule shadow-2xs space-y-2 hover:border-brand-indigo/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-indigo bg-brand-indigo/10 px-2 py-0.5 rounded">
                  STEP 01
                </span>
                <Sticker name="approved-seal" size="xs" />
              </div>
              <h4 className="font-serif font-bold text-sm text-ink-primary">
                {locale === 'en' ? '1. Enter Gmail & Username' : '1. กรอก Gmail & Username'}
              </h4>
              <p className="text-[11px] text-ink-secondary leading-snug">
                {locale === 'en' ? <>Go to <Link href="/register" className="text-brand-indigo underline font-semibold">/register</Link> and enter your Gmail and Creator handle.</> : <>เข้าหน้า <Link href="/register" className="text-brand-indigo underline font-semibold">/register</Link> ระบุ Gmail และชื่อผู้ใช้งาน Creator ของคุณ</>}
              </p>
            </div>

            <div className="p-4 rounded-dialog bg-paper-canvas border border-border-rule shadow-2xs space-y-2 hover:border-brand-indigo/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-accent-terracotta bg-accent-terracotta/10 px-2 py-0.5 rounded">
                  STEP 02
                </span>
                <Sticker name="vault-keyhole" size="xs" />
              </div>
              <h4 className="font-serif font-bold text-sm text-ink-primary">
                {locale === 'en' ? '2. Verify 6-Digit OTP' : '2. ยืนยันรหัส OTP 6 หลัก'}
              </h4>
              <p className="text-[11px] text-ink-secondary leading-snug">
                {locale === 'en' ? <>Receive the OTP code in Gmail and verify (or click <em>Autofill ⚡</em> on the top toast notification).</> : <>รับรหัส OTP ใน Gmail แล้วกรอกยืนยันตัวตน (หรือคลิกปุ่ม <em>Autofill ⚡</em> บนกล่องแจ้งเตือนมุมบน)</>}
              </p>
            </div>

            <div className="p-4 rounded-dialog bg-paper-canvas border border-border-rule shadow-2xs space-y-2 hover:border-brand-indigo/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-semantic-success bg-semantic-success/10 px-2 py-0.5 rounded">
                  STEP 03
                </span>
                <Sticker name="broadsheet-newspaper" size="xs" />
              </div>
              <h4 className="font-serif font-bold text-sm text-ink-primary">
                {locale === 'en' ? '3. Select Workspace' : '3. เลือกโปรเจกต์งาน'}
              </h4>
              <p className="text-[11px] text-ink-secondary leading-snug">
                {locale === 'en' ? <>System automatically switches contexts, e.g. <em>Main Studio</em>, <em>Creator Hub</em>, or <em>Lifestyle & Brand</em>.</> : <>ระบบสลับข้อมูลให้อัตโนมัติ เช่น <em>Main Studio</em>, <em>Creator Hub</em>, หรือ <em>Lifestyle & Brand</em></>}
              </p>
            </div>
          </div>

          {/* Callout Editorial Box */}
          <div className="p-4 rounded-editorial bg-brand-indigo/5 border-l-3 border-brand-indigo text-xs space-y-1">
            <h4 className="font-bold text-brand-indigo flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'What is the Global Workspace Sync Engine?' : 'Global Workspace Sync Engine คืออะไร?'}</span>
            </h4>
            <p className="text-[11px] text-ink-primary/90 leading-relaxed font-sans">
              {locale === 'en'
                ? <>When you select a workspace on any page, the sync engine mirrors it to <strong>Desk</strong>, <strong>Calendar</strong>, and <strong>Composer</strong> in real time without repetitive switching.</>
                : <>เมื่อคุณเลือกโปรเจกต์ในหน้าใดหน้าหนึ่ง เช่น <em>Main Studio</em> ระบบจะซิงค์โปรเจกต์เดียวกันไปยังหน้า <strong>แดชบอร์ด</strong>, <strong>ปฏิทิน</strong>, และ <strong>ห้องเขียนโพสต์</strong> ให้ตรงกันทันทีแบบ Real-time โดยไม่ต้องเลือกใหม่ซ้ำซ้อน</>}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'composer',
      category: '02 — PUBLISHING STUDIO',
      title: locale === 'en' ? 'Universal Studio Composer & Multi-Platform Adaptation' : 'ห้องเขียนข่าวและปรับแต่งข้ามแพลตฟอร์ม',
      badge: locale === 'en' ? 'Core Feature' : 'ฟีเจอร์หลัก',
      icon: PenSquare,
      summary: locale === 'en' ? '3 media modes, Live Phone Preview 9:16, and channel selection' : 'สลับ 3 โหมดสื่อ, Live Phone Preview 9:16, และการเลือกปลายทาง',
      lead: locale === 'en' ? 'Create content once, and let RetzPost automatically adapt aspect ratios and dispatch to each social network natively.' : 'สร้างคอนเทนต์ครั้งเดียว แล้วให้ RetzPost จัดการสัดส่วนและจัดส่งไปยังแต่ละโซเชียลตามธรรมชาติของแต่ละแอป',
      content: (
        <div className="space-y-6 text-xs leading-relaxed text-ink-secondary">
          <p>
            {locale === 'en' ? <>Access at <Link href="/create" className="text-brand-indigo underline font-bold">/create</Link>, featuring a balanced 3-column layout engineered for newsroom precision:</> : <>เข้าใช้งานที่ <Link href="/create" className="text-brand-indigo underline font-bold">/create</Link> ซึ่งจัดวางแบบ 3 คอลัมน์ที่สมดุล เพื่อให้กองบรรณาธิการทำงานได้อย่างแม่นยำ:</>}
          </p>

          {/* Platform Spec Comparison Table */}
          <div className="border border-border-rule rounded-dialog overflow-hidden bg-paper-canvas">
            <div className="p-3 bg-paper-subtle/80 border-b border-border-rule flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-ink-primary flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-brand-indigo" />
                <span>{locale === 'en' ? 'Supported Media Specs Across 6 Platforms' : 'ตารางเปรียบเทียบสเปกสื่อที่รองรับทั้ง 6 แพลตฟอร์ม'}</span>
              </span>
              <span className="text-[10px] font-mono text-semantic-success font-semibold">
                ● 2026 Engine Ready
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-paper-subtle/40 border-b border-border-rule text-ink-secondary text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5">{locale === 'en' ? 'Platform' : 'แพลตฟอร์ม'}</th>
                    <th className="p-2.5">{locale === 'en' ? 'Primary Media Mode' : 'โหมดสื่อหลัก'}</th>
                    <th className="p-2.5">{locale === 'en' ? 'Recommended Ratio' : 'สัดส่วนที่แนะนำ'}</th>
                    <th className="p-2.5">{locale === 'en' ? 'Video Duration' : 'ความยาววิดีโอ'}</th>
                    <th className="p-2.5 text-right">{locale === 'en' ? 'API Deletion' : 'การสั่งลบผ่าน API'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-rule/60 text-ink-primary">
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <FacebookLogo size={14} /> Facebook
                    </td>
                    <td className="p-2.5">Reels, Feed, Photos</td>
                    <td className="p-2.5">9:16 / 1:1 / 4:5</td>
                    <td className="p-2.5">{locale === 'en' ? 'Under 90s (Reels)' : 'ไม่เกิน 90 วินาที'}</td>
                    <td className="p-2.5 text-right text-semantic-success font-bold">{locale === 'en' ? '⚡ Instant Deletion' : '⚡ สั่งลบได้ทันที'}</td>
                  </tr>
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <InstagramLogo size={14} /> Instagram
                    </td>
                    <td className="p-2.5">Reels, Feed, Stories</td>
                    <td className="p-2.5">9:16 Vertical</td>
                    <td className="p-2.5">{locale === 'en' ? '15 - 90 seconds' : '15 - 90 วินาที'}</td>
                    <td className="p-2.5 text-right text-accent-ochre font-bold">{locale === 'en' ? '🛡️ Deep Link 3s' : '🛡️ Deep Link 3 วิ'}</td>
                  </tr>
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <YouTubeLogo size={14} /> YouTube
                    </td>
                    <td className="p-2.5">Shorts, VOD</td>
                    <td className="p-2.5">9:16 (Shorts) / 16:9</td>
                    <td className="p-2.5">{locale === 'en' ? 'Under 60s (Shorts)' : 'ไม่เกิน 60 วินาที'}</td>
                    <td className="p-2.5 text-right text-semantic-success font-bold">{locale === 'en' ? '⚡ Instant Deletion' : '⚡ สั่งลบได้ทันที'}</td>
                  </tr>
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <TikTokLogo size={14} /> TikTok
                    </td>
                    <td className="p-2.5">Video Clip, Photo Carousel</td>
                    <td className="p-2.5">9:16 Vertical</td>
                    <td className="p-2.5">{locale === 'en' ? '15 - 180 seconds' : '15 - 180 วินาที'}</td>
                    <td className="p-2.5 text-right text-accent-ochre font-bold">{locale === 'en' ? '🛡️ Deep Link 3s' : '🛡️ Deep Link 3 วิ'}</td>
                  </tr>
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <XLogo size={14} /> X (Twitter)
                    </td>
                    <td className="p-2.5">Text Post, Clip, Photos</td>
                    <td className="p-2.5">16:9 / 1:1</td>
                    <td className="p-2.5">{locale === 'en' ? 'Text 280 chars' : 'ข้อความ 280 ตัวอักษร'}</td>
                    <td className="p-2.5 text-right text-semantic-success font-bold">{locale === 'en' ? '⚡ Instant Deletion' : '⚡ สั่งลบได้ทันที'}</td>
                  </tr>
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <Lemon8Logo size={14} /> Lemon8
                    </td>
                    <td className="p-2.5">Photo Album, Lifestyle Clip</td>
                    <td className="p-2.5">3:4 / 9:16</td>
                    <td className="p-2.5">{locale === 'en' ? 'Aesthetic clips & photos' : 'คลิปและรูปภาพคุมโทน'}</td>
                    <td className="p-2.5 text-right text-accent-ochre font-bold">{locale === 'en' ? '🛡️ Deep Link 3s' : '🛡️ Deep Link 3 วิ'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Phone Preview Note */}
          <div className="p-4 rounded-editorial bg-accent-terracotta/5 border-l-3 border-accent-terracotta space-y-1">
            <h4 className="font-bold text-accent-terracotta flex items-center gap-1.5 font-mono">
              <Eye className="w-3.5 h-3.5" />
              <span>Safe Zone Overlay & Live Preview</span>
            </h4>
            <p className="text-[11px] text-ink-primary/90 font-sans">
              {locale === 'en'
                ? <>In the right column, click <strong>[Safe Zone Overlay]</strong> to toggle the yellow safe-zone guide, ensuring key captions and buttons avoid TikTok / Reels UI overlays.</>
                : <>ในคอลัมน์ขวาจะมีปุ่ม <strong>[Safe Zone Overlay]</strong> แสดงกรอบเซฟโซนสีเหลือง เพื่อให้คุณมั่นใจว่าข้อความหรือปุ่มแคปชันจะไม่ถูกไอคอน Like, Comment, หรือแถบ Navigation ของ TikTok / Reels บังทับ</>}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'calendar',
      category: '03 — PLANNING & SCHEDULING',
      title: locale === 'en' ? 'Editorial Calendar & Peak Slots' : 'ปฏิทินกองบรรณาธิการและเวลานาทีทอง',
      badge: locale === 'en' ? 'Scheduling' : 'การจัดตาราง',
      icon: Calendar,
      summary: locale === 'en' ? 'Content queue planning and Bangkok Golden Peak Slots' : 'การจัดคิวคอนเทนต์ล่วงหน้า และเวลานาทีทอง Bangkok Golden Peak Slots',
      lead: locale === 'en' ? 'Plan content ahead across weeks with high-precision time locks for maximum engagement in Bangkok timezone.' : 'วางแผนงานล่วงหน้าแบบมองเห็นรอบสัปดาห์ พร้อมระบบล็อกเวลาที่ให้ยอด Engagement สูงที่สุดในไทย',
      content: (
        <div className="space-y-6 text-xs leading-relaxed text-ink-secondary">
          <p>
            {locale === 'en' ? <>The calendar view (<Link href="/calendar" className="text-brand-indigo underline font-bold">/calendar</Link>) regulates brand publishing cadence to prevent content clustering or gaps:</> : <>หน้าปฏิทิน (<Link href="/calendar" className="text-brand-indigo underline font-bold">/calendar</Link>) คือเครื่องมือควบคุมจังหวะการสื่อสารของแบรนด์ ไม่ให้โพสต์กระจุกตัวหรือเว้นว่างนานเกินไป:</>}
          </p>

          {/* Golden Peak Slots Box */}
          <div className="p-4 rounded-dialog bg-paper-canvas border-2 border-accent-ochre/30 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-rule">
              <span className="font-mono font-bold text-xs text-ink-primary flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-accent-ochre" />
                <span>{locale === 'en' ? 'Bangkok Golden Peak Slots (Optimal Dispatch Windows)' : 'Bangkok Golden Peak Slots (เวลาปล่อยโพสต์ที่ดีที่สุด)'}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-ochre/15 text-accent-ochre font-bold">
                High Virality 🚀
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-editorial bg-paper-subtle border border-border-rule space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-indigo font-mono">{locale === 'en' ? '☀️ Lunch Break (Lunch Hour)' : '☀️ ช่วงพักกลางวัน'}</span>
                  <span className="font-mono text-[10px] text-ink-secondary">{locale === 'en' ? '11:30 AM - 1:30 PM' : '11:30 - 13:30 น.'}</span>
                </div>
                <p className="text-[11px] text-ink-secondary font-sans">
                  {locale === 'en' ? 'Ideal for: Reviews, flash promos, design studios, and short news bites read in under 1 minute.' : 'เหมาะกับ: คอนเทนต์รีวิว, โปรโมชันด่วน, ดีไซน์สตูดิโอ และข่าวสารสาระสั้นที่อ่านจบใน 1 นาที'}
                </p>
              </div>

              <div className="p-3 rounded-editorial bg-paper-subtle border border-border-rule space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-accent-terracotta font-mono">{locale === 'en' ? '🌙 Evening Prime Time' : '🌙 ช่วงหัวค่ำผ่อนคลาย'}</span>
                  <span className="font-mono text-[10px] text-ink-secondary">{locale === 'en' ? '6:30 PM - 9:30 PM' : '18:30 - 21:30 น.'}</span>
                </div>
                <p className="text-[11px] text-ink-secondary font-sans">
                  {locale === 'en' ? 'Ideal for: Short video Reels, TikTok, YouTube Shorts, and entertainment/lifestyle content requiring viewer attention.' : 'เหมาะกับ: วิดีโอสั้น Reels, TikTok, YouTube Shorts, และคอนเทนต์บันเทิง/ไลฟ์สไตล์ที่ต้องใช้เวลาดู'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'roles',
      category: '04 — GOVERNANCE & TEAMS',
      title: locale === 'en' ? '5-Level Roles & Review Approval Flow' : 'สิทธิ์ 5 ระดับและขั้นตอนการอนุมัติงาน',
      badge: locale === 'en' ? 'Quality Governance' : 'การควบคุมคุณภาพ',
      icon: Users,
      summary: locale === 'en' ? 'Permission structure for Owner, Manager, Editor, Creator with Approved / Needs Revision stamps' : 'โครงสร้างสิทธิ์ Owner, Manager, Editor, Creator พร้อมตรายาง Approved / Needs Revision',
      lead: locale === 'en' ? 'Maintain enterprise content standards with multi-level review workflows and audit trails prior to publishing.' : 'สร้างความมั่นใจในมาตรฐานเนื้อหาองค์กร ด้วยระบบตรวจแก้งานและบันทึกประวัติก่อนปล่อยสู่สาธารณะ',
      content: (
        <div className="space-y-6 text-xs leading-relaxed text-ink-secondary">
          <p>
            {locale === 'en' ? <>RetzPost enforces Least Privilege access control on <Link href="/settings/team" className="text-brand-indigo underline font-bold">/settings/team</Link>:</> : <>RetzPost แบ่งระดับการเข้าถึงตามหลักการ Least Privilege ในหน้า <Link href="/settings/team" className="text-brand-indigo underline font-bold">/settings/team</Link>:</>}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono text-[11px]">
            <div className="p-3 rounded bg-paper-canvas border border-border-rule space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-primary">{locale === 'en' ? '👑 Owner (Workspace Owner)' : '👑 Owner (เจ้าของบัญชี)'}</span>
                <span className="text-[9px] bg-brand-indigo/10 text-brand-indigo px-1.5 py-0.2 rounded font-bold">Full Admin</span>
              </div>
              <p className="text-[10px] text-ink-secondary font-sans">
                {locale === 'en' ? 'Full system governance, billing management, and workspace lifecycle.' : 'จัดการสิทธิ์ทั้งระบบ, จัดการชำระเงิน, และลบหรือสร้างโปรเจกต์ใหม่'}
              </p>
            </div>

            <div className="p-3 rounded bg-paper-canvas border border-border-rule space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-primary">{locale === 'en' ? '⭐ Manager (Project Manager)' : '⭐ Manager (ผู้จัดการโปรเจกต์)'}</span>
                <span className="text-[9px] bg-brand-indigo/10 text-brand-indigo px-1.5 py-0.2 rounded font-bold">Approve & Revoke</span>
              </div>
              <p className="text-[10px] text-ink-secondary font-sans">
                {locale === 'en' ? 'Post approval authority, KPI adjustments, and emergency post revocation.' : 'มีอำนาจอนุมัติโพสต์, แก้ไขคะแนน KPI, และสั่งถอนโพสต์ฉุกเฉิน'}
              </p>
            </div>

            <div className="p-3 rounded bg-paper-canvas border border-border-rule space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-primary">{locale === 'en' ? '✍️ Lead Editor (Senior Editor)' : '✍️ Lead Editor (หัวหน้ากอง บ.ก.)'}</span>
                <span className="text-[9px] bg-semantic-info-bg text-semantic-info px-1.5 py-0.2 rounded font-bold">Editor</span>
              </div>
              <p className="text-[10px] text-ink-secondary font-sans">
                {locale === 'en' ? <>Caption verification, draft editing, and <em>APPROVED ✓</em> stamping.</> : <>ตรวจความถูกต้องของแคปชัน, แก้ไขต้นฉบับ, และประทับตรา <em>APPROVED ✓</em></>}
              </p>
            </div>

            <div className="p-3 rounded bg-paper-canvas border border-border-rule space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-primary">{locale === 'en' ? '🎨 Creator (Content Creator)' : '🎨 Creator (ครีเอเตอร์)'}</span>
                <span className="text-[9px] bg-semantic-warning-bg text-semantic-warning px-1.5 py-0.2 rounded font-bold">Draft Only</span>
              </div>
              <p className="text-[10px] text-ink-secondary font-sans">
                {locale === 'en' ? 'Create post drafts, upload media files, and submit review requests.' : 'สร้างดราฟต์โพสต์ อัปโหลดไฟล์สื่อ และส่งคำร้องขออนุมัติ'}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'kpi',
      category: '05 — AI & ANALYTICS',
      title: locale === 'en' ? 'KPI Evaluation System & AI Coaching Synthesis' : 'ระบบประเมิน KPI & AI Coaching Synthesis',
      badge: locale === 'en' ? 'Smart Analytics' : 'การวิเคราะห์อัจฉริยะ',
      icon: BarChart3,
      summary: locale === 'en' ? '4-dimensional metric engine, AI coaching synthesis, and official evaluation slips' : 'การคำนวณสถิติ 4 มิติ, สังเคราะห์ข้อแนะนำด้วย AI, และออกใบคะแนน Slip',
      lead: locale === 'en' ? 'Transform raw operational metrics into actionable staff coaching insights with official printable HR evaluation slips.' : 'เปลี่ยนตัวเลขสถิติแห้งๆ ให้เป็นข้อแนะนำในการพัฒนาพนักงาน พร้อมใบคะแนนอย่างเป็นทางการสำหรับ HR',
      content: (
        <div className="space-y-6 text-xs leading-relaxed text-ink-secondary">
          <p>
            {locale === 'en' ? <>Launch from the dashboard tab <Link href="/desk?tab=kpi" className="text-brand-indigo underline font-bold">/desk?tab=kpi</Link> to evaluate production team output:</> : <>เปิดใช้งานที่หน้าแดชบอร์ดแท็บ <Link href="/?tab=kpi" className="text-brand-indigo underline font-bold">/?tab=kpi</Link> เพื่อประเมินผลงานของทีมผลิตคอนเทนต์:</>}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
              <span className="font-bold font-mono text-ink-primary block">1. Volume Completion Rate (%)</span>
              <p className="text-[11px] text-ink-secondary font-sans">
                {locale === 'en' ? 'Ratio of actual successful dispatches against monthly target.' : 'สัดส่วนการยิงโพสต์สำเร็จจริงเทียบกับเป้าหมายที่ตั้งไว้ในแต่ละเดือน'}
              </p>
            </div>

            <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
              <span className="font-bold font-mono text-ink-primary block">2. On-Time Accuracy (%)</span>
              <p className="text-[11px] text-ink-secondary font-sans">
                {locale === 'en' ? 'Accuracy of publishing strictly within Bangkok Golden Peak Slots.' : 'ความแม่นยำในการปล่อยโพสต์ตรงตามเวลานาทีทอง'}
              </p>
            </div>

            <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
              <span className="font-bold font-mono text-ink-primary block">3. First-Pass Approval (%)</span>
              <p className="text-[11px] text-ink-secondary font-sans">
                {locale === 'en' ? 'First-pass approval rate without requiring revision loops, reflecting work precision.' : 'อัตราการผ่านอนุมัติในรอบแรกโดยไม่ต้องแก้งานซ้ำซ้อน สะท้อนความประณีตของผลงาน'}
              </p>
            </div>

            <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
              <span className="font-bold font-mono text-ink-primary block">4. Total Impressions & Views</span>
              <p className="text-[11px] text-ink-secondary font-sans">
                {locale === 'en' ? 'Verified cumulative reach synced automatically via Meta Graph, YouTube Data, and TikTok APIs.' : 'ยอดการเข้าชมสะสมจริงที่ซิงค์อัตโนมัติจาก Meta Graph API, YouTube Data API และ TikTok'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-editorial bg-paper-canvas border border-border-rule space-y-2">
            <h4 className="font-bold text-ink-primary flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
              <span>{locale === 'en' ? '[📄 Print Evaluation Slip] Feature' : 'ปุ่ม [📄 พิมพ์ใบประเมิน]'}</span>
            </h4>
            <p className="text-[11px] text-ink-secondary font-sans">
              {locale === 'en'
                ? <>In each employee Scorecard modal, managers can click <em>[📄 Print Evaluation Slip]</em> to open a standardized slip, ready for printing (<code>window.print()</code>) or sharing with HR leadership.</>
                : <>ในหน้าต่าง Scorecard รายบุคคล ผู้จัดการสามารถคลิกปุ่ม <em>[📄 พิมพ์ใบประเมิน]</em> เพื่อเปิดเอกสารขนาดมาตรฐาน พร้อมสั่งพิมพ์ (<code>window.print()</code>) หรือคัดลอกข้อความสรุปส่งต่อให้ฝ่ายบริหารและ HR ได้ทันที</>}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'revoke',
      category: '06 — SECURITY & COMPLIANCE',
      title: locale === 'en' ? 'Revoke & API Deletion Policy' : 'นโยบายและการสั่งลบโพสต์จริงผ่าน API (Revoke & API Deletion Policy)',
      badge: locale === 'en' ? 'Security' : 'ความปลอดภัย',
      icon: Trash2,
      summary: locale === 'en' ? 'Platform-specific technical standards for live post revocation and deletion' : 'มาตรฐานการสั่งลบโพสต์จริงแยกตามขีดความสามารถของแต่ละแพลตฟอร์มโซเชียล',
      lead: locale === 'en' ? 'Understand technical capabilities and policy constraints of Social Media APIs when initiating emergency post recalls.' : 'เข้าใจข้อกำหนดและความเป็นไปได้ทางเทคนิคของ Social Media APIs ในการสั่งถอนโพสต์ฉุกเฉิน',
      content: (
        <div className="space-y-6 text-xs leading-relaxed text-ink-secondary">
          <p>
            {locale === 'en' ? <>If a post contains errors or requires urgent takedown, RetzPost provides <strong>[🗑️ Revoke Post]</strong> in Dispatch Monitor, operating natively per platform:</> : <>หากโพสต์มีข้อมูลผิดพลาดหรือต้องการระงับการเผยแพร่อย่างเร่งด่วน RetzPost มีปุ่ม <strong>[🗑️ ถอนโพสต์]</strong> ในแท็บ Dispatch Monitor ซึ่งจะทำงานตามมาตรฐานจริงของแต่ละแพลตฟอร์ม:</>}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-dialog bg-semantic-success-bg/40 border border-semantic-success/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-semantic-success flex items-center gap-1">
                  ⚡ API Direct Deletion
                </span>
                <span className="text-[9px] bg-semantic-success/20 text-semantic-success px-1.5 py-0.2 rounded font-bold">
                  {locale === 'en' ? '100% Automated' : 'อัตโนมัติ 100%'}
                </span>
              </div>
              <h4 className="font-bold text-ink-primary">Facebook, YouTube, X (Twitter)</h4>
              <p className="text-[11px] text-ink-secondary font-sans leading-relaxed">
                {locale === 'en'
                  ? <>All 3 platforms permit third-party applications to delete posts via official APIs. When revoking, RetzPost dispatches a <code>DELETE</code> command directly to remote servers, removing content immediately.</>
                  : <>ทั้ง 3 แพลตฟอร์มอนุญาตให้แอปพลิเคชัน 3rd-party สั่งลบโพสต์ได้ผ่าน API อย่างเป็นทางการ เมื่อกดถอนโพสต์ ระบบจะยิงคำสั่ง <code>DELETE</code> ไปยังเซิร์ฟเวอร์ปลายทาง และลบเนื้อหาจริงออกทันที</>}
              </p>
            </div>

            <div className="p-4 rounded-dialog bg-semantic-warning-bg/40 border border-semantic-warning/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-semantic-warning flex items-center gap-1">
                  🛡️ Guided Deep Link Deletion
                </span>
                <span className="text-[9px] bg-semantic-warning/20 text-semantic-warning px-1.5 py-0.2 rounded font-bold">
                  {locale === 'en' ? '3-Second App Action' : 'ลบในแอป 3 วินาที'}
                </span>
              </div>
              <h4 className="font-bold text-ink-primary">Instagram, TikTok, Lemon8</h4>
              <p className="text-[11px] text-ink-secondary font-sans leading-relaxed">
                {locale === 'en'
                  ? <>Per Meta and ByteDance policies preventing unauthorized data deletion, public APIs do not allow third parties to delete short clips. RetzPost triggers a guided modal with <em>[Open Live Post ↗]</em> for a 3-second in-app removal.</>
                  : <>ตามนโยบายความปลอดภัยของ Meta และ ByteDance เพื่อป้องกันการลบข้อมูลโดยมิชอบ API สาธารณะจึงไม่อนุญาตให้แอปภายนอกลบคลิปแทนผู้ใช้ RetzPost จึงแสดงหน้าต่างแจ้งเตือนพร้อมปุ่ม <em>[เปิดไปที่โพสต์จริง ↗]</em> เพื่อให้คุณเปิดเข้าแอปและกดลบได้ใน 3 วินาที</>}
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ], [locale]);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return docSections;
    const q = searchQuery.toLowerCase();
    return docSections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.summary.toLowerCase().includes(q) ||
        sec.category.toLowerCase().includes(q) ||
        sec.badge.toLowerCase().includes(q)
    );
  }, [docSections, searchQuery]);

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col font-sans selection:bg-brand-indigo selection:text-white">
      {/* Editorial Public Masthead Header */}
      <PublicHeader />
      <DocsSubNav />

      {/* Hero Header Section */}
      <section className="bg-paper-raised border-b-2 border-border-rule py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle grid pattern background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#D8D1C4_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo font-mono text-xs font-semibold border border-brand-indigo/20 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>RetzPost Documentation & Knowledge Base v2.2</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-ink-primary tracking-tight">
            {t('docs.docsHubTitle')}
          </h1>
          <p className="text-sm text-ink-secondary max-w-2xl mx-auto leading-relaxed font-sans">
            {t('docs.docsHubSubtitle')}
          </p>

          {/* Search Box */}
          <div className="max-w-lg mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder={t('docs.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-paper-canvas border-2 border-border-rule rounded-editorial font-mono text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs font-mono text-ink-secondary hover:text-ink-primary px-1.5 py-0.5 rounded bg-paper-subtle cursor-pointer"
                >
                  {t('common.close')}
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-[11px] font-mono text-ink-secondary text-left mt-1.5 pl-1">
                {locale === 'th' ? `ผลการค้นหา: พบ ${filteredSections.length} หมวดหมู่ที่ตรงกัน` : `Search results: ${filteredSections.length} matching sections`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 4 Featured Quick Jump Cards */}
      <section className="border-b border-border-rule/80 bg-paper-subtle/40 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'quickstart', label: '⚡ 3-Min Quickstart', sub: locale === 'en' ? 'Register & Verify OTP' : 'สมัคร & ยืนยัน OTP' },
              { id: 'composer', label: '📱 6-Platform Specs', sub: locale === 'en' ? 'Reels & Shorts Specs' : 'ขนาดคลิป Reels / Shorts' },
              { id: 'calendar', label: '🔥 Peak Golden Slots', sub: locale === 'en' ? 'Peak Engagement Times' : 'เวลานาทีทอง Engagement สูง' },
              { id: 'revoke', label: '🗑️ API Revoke Policy', sub: locale === 'en' ? 'Live API Deletion Policy' : 'นโยบายการสั่งลบโพสต์จริง' },
            ].map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  setActiveSectionId(card.id);
                  document.getElementById(card.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-3 rounded-dialog bg-paper-raised hover:bg-paper-canvas border border-border-rule text-left shadow-2xs hover:shadow-xs transition-all group cursor-pointer"
              >
                <span className="font-mono font-bold text-xs text-ink-primary group-hover:text-brand-indigo transition-colors block">
                  {card.label}
                </span>
                <span className="text-[10px] text-ink-secondary font-mono truncate block mt-0.5">
                  {card.sub}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Table of Contents */}
          <aside className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="p-4 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-rule/80">
                <span className="text-xs font-mono font-bold text-ink-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-accent-terracotta" />
                  {locale === 'en' ? 'Table of Contents' : 'สารบัญคู่มือ'}
                </span>
                <span className="text-[10px] font-mono text-ink-secondary">
                  {locale === 'en' ? `${filteredSections.length} sections` : `${filteredSections.length} หัวข้อ`}
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
                      className={`w-full flex items-center justify-between text-left p-2.5 rounded-editorial text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-paper-canvas text-brand-indigo font-bold border-l-3 border-brand-indigo shadow-2xs'
                          : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle/80 border-l-3 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-indigo' : 'text-ink-secondary'}`} />
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'translate-x-0.5 text-brand-indigo' : 'opacity-30'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Legal Documents Quick Card */}
            <div className="p-4 bg-paper-subtle/70 border border-border-rule rounded-dialog text-xs space-y-2.5">
              <span className="font-mono font-bold text-ink-primary block text-[11px] uppercase tracking-wider">
                {locale === 'en' ? 'Legal & Policy Documents' : 'เอกสารทางกฎหมาย & นโยบาย'}
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <Link
                  href="/privacy"
                  className="flex items-center gap-1.5 text-brand-indigo hover:underline font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-semantic-success" />
                  <span>{locale === 'en' ? 'Privacy Policy →' : 'นโยบายความเป็นส่วนตัว →'}</span>
                </Link>
                <Link
                  href="/terms"
                  className="flex items-center gap-1.5 text-brand-indigo hover:underline font-semibold"
                >
                  <FileText className="w-3.5 h-3.5 text-brand-indigo" />
                  <span>{locale === 'en' ? 'Terms of Service →' : 'ข้อกำหนดการให้บริการ →'}</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Column: Detailed Sections */}
          <main className="lg:col-span-8 space-y-10">
            {filteredSections.length === 0 ? (
              <div className="p-12 text-center bg-paper-raised border-2 border-border-rule rounded-dialog text-ink-secondary">
                <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-40 text-accent-terracotta" />
                <h3 className="font-serif font-bold text-lg text-ink-primary mb-1">
                  {locale === 'en' ? `No documentation found for "${searchQuery}"` : `ไม่พบคู่มือที่ตรงกับคำค้นหา "${searchQuery}"`}
                </h3>
                <p className="text-xs font-mono text-ink-secondary">
                  {locale === 'en' ? 'Try searching keywords like "quickstart", "calendar", "specs", or click clear above' : 'ลองพิมพ์คำสั้นๆ เช่น "สมัคร", "ปฏิทิน", "สเปก", หรือกดปุ่มล้างคำค้นหาด้านบน'}
                </p>
              </div>
            ) : (
              filteredSections.map((sec, idx) => {
                const Icon = sec.icon;
                const feedback = feedbackGiven[sec.id];
                return (
                  <article
                    key={sec.id}
                    id={sec.id}
                    className="p-6 sm:p-8 bg-paper-raised border-2 border-border-rule rounded-dialog shadow-xs scroll-mt-28 space-y-5 relative"
                  >
                    {/* Header Strip */}
                    <div className="space-y-2 pb-4 border-b-2 border-border-rule">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-indigo font-bold">
                          {sec.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper-subtle border border-border-rule text-ink-secondary font-semibold">
                          {sec.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-editorial bg-brand-indigo text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-ink-primary tracking-tight">
                          {sec.title}
                        </h2>
                      </div>

                      {/* Lead Paragraph */}
                      <p className="text-xs sm:text-sm text-ink-primary/90 leading-relaxed font-sans pt-1">
                        {sec.lead}
                      </p>
                    </div>

                    {/* Section Body */}
                    <div className="pt-1">{sec.content}</div>

                    {/* Interactive Helpful Feedback Widget */}
                    <div className="mt-6 pt-4 border-t border-border-rule/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-ink-secondary">
                      <span className="flex items-center gap-1.5">
                        <CheckCheck className="w-3.5 h-3.5 text-semantic-success" />
                        <span>{locale === 'en' ? 'Was this documentation section helpful?' : 'คู่มือหัวข้อนี้มีประโยชน์ต่อการทำงานของคุณหรือไม่?'}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {feedback ? (
                          <span className="text-[11px] font-semibold text-semantic-success bg-semantic-success-bg px-2.5 py-1 rounded-editorial border border-semantic-success/20 animate-in fade-in">
                            {locale === 'en' ? '✓ Thank you for your feedback!' : '✓ ขอบคุณสำหรับข้อเสนอแนะ!'}
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleFeedback(sec.id, 'up')}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              <ThumbsUp className="w-3 h-3 text-semantic-success" />
                              <span>{locale === 'en' ? 'Helpful' : 'มีประโยชน์'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(sec.id, 'down')}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              <ThumbsDown className="w-3 h-3 text-accent-terracotta" />
                              <span>{locale === 'en' ? 'Needs More Detail' : 'ต้องการรายละเอียดเพิ่ม'}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </main>
        </div>
      </div>

      {/* Editorial Public Footer */}
      <PublicFooter />
    </div>
  );
}
