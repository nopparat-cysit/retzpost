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
  category: string;
  badge: string;
  icon: any;
  summary: string;
  lead: string;
  content: React.ReactNode;
}

export default function DocsPage() {
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
      title: 'เริ่มต้นใช้งานและตั้งค่าบัญชีด่วน (Quickstart & Onboarding)',
      badge: 'เริ่มที่นี่',
      icon: Rocket,
      summary: 'การสมัครสมาชิก, ยืนยันรหัส OTP ทาง Gmail, และการเลือกโปรเจกต์',
      lead: 'เรียนรู้วิธีตั้งค่าบัญชี RetzPost และเริ่มกระจายโพสต์ลงทุกช่องทางโซเชียลมีเดียพร้อมกันภายใน 3 นาที',
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
                1. กรอก Gmail & Username
              </h4>
              <p className="text-[11px] text-ink-secondary leading-snug">
                เข้าหน้า <Link href="/register" className="text-brand-indigo underline font-semibold">/register</Link> ระบุ Gmail และชื่อผู้ใช้งาน Creator ของคุณ
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
                2. ยืนยันรหัส OTP 6 หลัก
              </h4>
              <p className="text-[11px] text-ink-secondary leading-snug">
                รับรหัส OTP ใน Gmail แล้วกรอกยืนยันตัวตน (หรือคลิกปุ่ม <em>Autofill ⚡</em> บนกล่องแจ้งเตือนมุมบน)
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
                3. เลือกโปรเจกต์งาน
              </h4>
              <p className="text-[11px] text-ink-secondary leading-snug">
                ระบบสลับข้อมูลให้อัตโนมัติ เช่น <em>Capital One</em>, <em>Acme Studio</em>, หรือ <em>Coffee Craft</em>
              </p>
            </div>
          </div>

          {/* Callout Editorial Box */}
          <div className="p-4 rounded-editorial bg-brand-indigo/5 border-l-3 border-brand-indigo text-xs space-y-1">
            <h4 className="font-bold text-brand-indigo flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Global Workspace Sync Engine คืออะไร?</span>
            </h4>
            <p className="text-[11px] text-ink-primary/90 leading-relaxed font-sans">
              เมื่อคุณเลือกโปรเจกต์ในหน้าใดหน้าหนึ่ง เช่น <em>Capital One Real Estate</em> ระบบจะซิงค์โปรเจกต์เดียวกันไปยังหน้า <strong>แดชบอร์ด</strong>, <strong>ปฏิทิน</strong>, และ <strong>ห้องเขียนโพสต์</strong> ให้ตรงกันทันทีแบบ Real-time โดยไม่ต้องเลือกใหม่ซ้ำซ้อน
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'composer',
      category: '02 — PUBLISHING STUDIO',
      title: 'ห้องเขียนข่าวและปรับแต่งข้ามแพลตฟอร์ม (Universal Studio Composer)',
      badge: 'ฟีเจอร์หลัก',
      icon: PenSquare,
      summary: 'สลับ 3 โหมดสื่อ, Live Phone Preview 9:16, และการเลือกปลายทาง',
      lead: 'สร้างคอนเทนต์ครั้งเดียว แล้วให้ RetzPost จัดการสัดส่วนและจัดส่งไปยังแต่ละโซเชียลตามธรรมชาติของแต่ละแอป',
      content: (
        <div className="space-y-6 text-xs leading-relaxed text-ink-secondary">
          <p>
            เข้าใช้งานที่ <Link href="/create" className="text-brand-indigo underline font-bold">/create</Link> ซึ่งจัดวางแบบ 3 คอลัมน์ที่สมดุล เพื่อให้กองบรรณาธิการทำงานได้อย่างแม่นยำ:
          </p>

          {/* Platform Spec Comparison Table */}
          <div className="border border-border-rule rounded-dialog overflow-hidden bg-paper-canvas">
            <div className="p-3 bg-paper-subtle/80 border-b border-border-rule flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-ink-primary flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-brand-indigo" />
                <span>ตารางเปรียบเทียบสเปกสื่อที่รองรับทั้ง 6 แพลตฟอร์ม</span>
              </span>
              <span className="text-[10px] font-mono text-semantic-success font-semibold">
                ● 2026 Engine Ready
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-paper-subtle/40 border-b border-border-rule text-ink-secondary text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5">แพลตฟอร์ม</th>
                    <th className="p-2.5">โหมดสื่อหลัก</th>
                    <th className="p-2.5">สัดส่วนที่แนะนำ</th>
                    <th className="p-2.5">ความยาววิดีโอ</th>
                    <th className="p-2.5 text-right">การสั่งลบผ่าน API</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-rule/60 text-ink-primary">
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <FacebookLogo size={14} /> Facebook
                    </td>
                    <td className="p-2.5">Reels, Feed, Photos</td>
                    <td className="p-2.5">9:16 / 1:1 / 4:5</td>
                    <td className="p-2.5">ไม่เกิน 90 วินาที (Reels)</td>
                    <td className="p-2.5 text-right text-semantic-success font-bold">⚡ สั่งลบได้ทันที</td>
                  </tr>
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <InstagramLogo size={14} /> Instagram
                    </td>
                    <td className="p-2.5">Reels, Feed, Stories</td>
                    <td className="p-2.5">9:16 Vertical</td>
                    <td className="p-2.5">15 - 90 วินาที</td>
                    <td className="p-2.5 text-right text-accent-ochre font-bold">🛡️ Deep Link 3 วิ</td>
                  </tr>
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <YouTubeLogo size={14} /> YouTube
                    </td>
                    <td className="p-2.5">Shorts, VOD</td>
                    <td className="p-2.5">9:16 (Shorts) / 16:9</td>
                    <td className="p-2.5">ไม่เกิน 60 วินาที (Shorts)</td>
                    <td className="p-2.5 text-right text-semantic-success font-bold">⚡ สั่งลบได้ทันที</td>
                  </tr>
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <TikTokLogo size={14} /> TikTok
                    </td>
                    <td className="p-2.5">Video Clip, Photo Carousel</td>
                    <td className="p-2.5">9:16 Vertical</td>
                    <td className="p-2.5">15 - 180 วินาที</td>
                    <td className="p-2.5 text-right text-accent-ochre font-bold">🛡️ Deep Link 3 วิ</td>
                  </tr>
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <XLogo size={14} /> X (Twitter)
                    </td>
                    <td className="p-2.5">Text Post, Clip, Photos</td>
                    <td className="p-2.5">16:9 / 1:1</td>
                    <td className="p-2.5">ข้อความ 280 ตัวอักษร</td>
                    <td className="p-2.5 text-right text-semantic-success font-bold">⚡ สั่งลบได้ทันที</td>
                  </tr>
                  <tr className="hover:bg-paper-subtle/30">
                    <td className="p-2.5 font-bold flex items-center gap-1.5">
                      <Lemon8Logo size={14} /> Lemon8
                    </td>
                    <td className="p-2.5">Photo Album, Lifestyle Clip</td>
                    <td className="p-2.5">3:4 / 9:16</td>
                    <td className="p-2.5">คลิปและรูปภาพคุมโทน</td>
                    <td className="p-2.5 text-right text-accent-ochre font-bold">🛡️ Deep Link 3 วิ</td>
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
              ในคอลัมน์ขวาจะมีปุ่ม <strong>[Safe Zone Overlay]</strong> แสดงกรอบเซฟโซนสีเหลือง เพื่อให้คุณมั่นใจว่าข้อความหรือปุ่มแคปชันจะไม่ถูกไอคอน Like, Comment, หรือแถบ Navigation ของ TikTok / Reels บังทับ
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'calendar',
      category: '03 — PLANNING & SCHEDULING',
      title: 'ปฏิทินกองบรรณาธิการและเวลานาทีทอง (Editorial Calendar)',
      badge: 'การจัดตาราง',
      icon: Calendar,
      summary: 'การจัดคิวคอนเทนต์ล่วงหน้า และเวลานาทีทอง Bangkok Golden Peak Slots',
      lead: 'วางแผนงานล่วงหน้าแบบมองเห็นรอบสัปดาห์ พร้อมระบบล็อกเวลาที่ให้ยอด Engagement สูงที่สุดในไทย',
      content: (
        <div className="space-y-6 text-xs leading-relaxed text-ink-secondary">
          <p>
            หน้าปฏิทิน (<Link href="/calendar" className="text-brand-indigo underline font-bold">/calendar</Link>) คือเครื่องมือควบคุมจังหวะการสื่อสารของแบรนด์ ไม่ให้โพสต์กระจุกตัวหรือเว้นว่างนานเกินไป:
          </p>

          {/* Golden Peak Slots Box */}
          <div className="p-4 rounded-dialog bg-paper-canvas border-2 border-accent-ochre/30 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-rule">
              <span className="font-mono font-bold text-xs text-ink-primary flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-accent-ochre" />
                <span>Bangkok Golden Peak Slots (เวลาปล่อยโพสต์ที่ดีที่สุด)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-ochre/15 text-accent-ochre font-bold">
                High Virality 🚀
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-editorial bg-paper-subtle border border-border-rule space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-indigo font-mono">☀️ ช่วงพักกลางวัน (Lunch Hour)</span>
                  <span className="font-mono text-[10px] text-ink-secondary">11:30 - 13:30 น.</span>
                </div>
                <p className="text-[11px] text-ink-secondary font-sans">
                  เหมาะกับ: คอนเทนต์รีวิวอาหาร, โปรโมชันด่วน, อสังหาฯ และข่าวสารสาระสั้นที่อ่านจบใน 1 นาที
                </p>
              </div>

              <div className="p-3 rounded-editorial bg-paper-subtle border border-border-rule space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-accent-terracotta font-mono">🌙 ช่วงหัวค่ำผ่อนคลาย (Prime Time)</span>
                  <span className="font-mono text-[10px] text-ink-secondary">18:30 - 21:30 น.</span>
                </div>
                <p className="text-[11px] text-ink-secondary font-sans">
                  เหมาะกับ: วิดีโอสั้น Reels, TikTok, YouTube Shorts, และคอนเทนต์บันเทิง/ไลฟ์สไตล์ที่ต้องใช้เวลาดู
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
      title: 'สิทธิ์ 5 ระดับและขั้นตอนการอนุมัติงาน (Team Roles & Review Flow)',
      badge: 'การควบคุมคุณภาพ',
      icon: Users,
      summary: 'โครงสร้างสิทธิ์ Owner, Manager, Editor, Creator พร้อมตรายาง Approved / Needs Revision',
      lead: 'สร้างความมั่นใจในมาตรฐานเนื้อหาองค์กร ด้วยระบบตรวจแก้งานและบันทึกประวัติก่อนปล่อยสู่สาธารณะ',
      content: (
        <div className="space-y-6 text-xs leading-relaxed text-ink-secondary">
          <p>
            RetzPost แบ่งระดับการเข้าถึงตามหลักการ Least Privilege ในหน้า <Link href="/settings/team" className="text-brand-indigo underline font-bold">/settings/team</Link>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono text-[11px]">
            <div className="p-3 rounded bg-paper-canvas border border-border-rule space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-primary">👑 Owner (เจ้าของบัญชี)</span>
                <span className="text-[9px] bg-brand-indigo/10 text-brand-indigo px-1.5 py-0.2 rounded font-bold">Full Admin</span>
              </div>
              <p className="text-[10px] text-ink-secondary font-sans">
                จัดการสิทธิ์ทั้งระบบ, จัดการชำระเงิน, และลบหรือสร้างโปรเจกต์ใหม่
              </p>
            </div>

            <div className="p-3 rounded bg-paper-canvas border border-border-rule space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-primary">⭐ Manager (ผู้จัดการโปรเจกต์)</span>
                <span className="text-[9px] bg-brand-indigo/10 text-brand-indigo px-1.5 py-0.2 rounded font-bold">Approve & Revoke</span>
              </div>
              <p className="text-[10px] text-ink-secondary font-sans">
                มีอำนาจอนุมัติโพสต์, แก้ไขคะแนน KPI, และสั่งถอนโพสต์ฉุกเฉิน
              </p>
            </div>

            <div className="p-3 rounded bg-paper-canvas border border-border-rule space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-primary">✍️ Lead Editor (หัวหน้ากอง บ.ก.)</span>
                <span className="text-[9px] bg-semantic-info-bg text-semantic-info px-1.5 py-0.2 rounded font-bold">Editor</span>
              </div>
              <p className="text-[10px] text-ink-secondary font-sans">
                ตรวจความถูกต้องของแคปชัน, แก้ไขต้นฉบับ, และประทับตรา <em>APPROVED ✓</em>
              </p>
            </div>

            <div className="p-3 rounded bg-paper-canvas border border-border-rule space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-primary">🎨 Creator (ครีเอเตอร์)</span>
                <span className="text-[9px] bg-semantic-warning-bg text-semantic-warning px-1.5 py-0.2 rounded font-bold">Draft Only</span>
              </div>
              <p className="text-[10px] text-ink-secondary font-sans">
                สร้างดราฟต์โพสต์ อัปโหลดไฟล์สื่อ และส่งคำร้องขออนุมัติ
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'kpi',
      category: '05 — AI & ANALYTICS',
      title: 'ระบบประเมิน KPI & AI Coaching Synthesis',
      badge: 'การวิเคราะห์อัจฉริยะ',
      icon: BarChart3,
      summary: 'การคำนวณสถิติ 4 มิติ, สังเคราะห์ข้อแนะนำด้วย AI, และออกใบคะแนน Slip',
      lead: 'เปลี่ยนตัวเลขสถิติแห้งๆ ให้เป็นข้อแนะนำในการพัฒนาพนักงาน พร้อมใบคะแนนอย่างเป็นทางการสำหรับ HR',
      content: (
        <div className="space-y-6 text-xs leading-relaxed text-ink-secondary">
          <p>
            เปิดใช้งานที่หน้าแดชบอร์ดแท็บ <Link href="/?tab=kpi" className="text-brand-indigo underline font-bold">/?tab=kpi</Link> เพื่อประเมินผลงานของทีมผลิตคอนเทนต์:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
              <span className="font-bold font-mono text-ink-primary block">1. Volume Completion Rate (%)</span>
              <p className="text-[11px] text-ink-secondary font-sans">
                สัดส่วนการยิงโพสต์สำเร็จจริงเทียบกับเป้าหมายที่ตั้งไว้ในแต่ละเดือน
              </p>
            </div>

            <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
              <span className="font-bold font-mono text-ink-primary block">2. On-Time Accuracy (%)</span>
              <p className="text-[11px] text-ink-secondary font-sans">
                ความแม่นยำในการปล่อยโพสต์ตรงตามเวลานาทีทอง (Golden Peak Slots)
              </p>
            </div>

            <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
              <span className="font-bold font-mono text-ink-primary block">3. First-Pass Approval (%)</span>
              <p className="text-[11px] text-ink-secondary font-sans">
                อัตราการผ่านอนุมัติในรอบแรกโดยไม่ต้องแก้งานซ้ำซ้อน สะท้อนความประณีตของผลงาน
              </p>
            </div>

            <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule space-y-1">
              <span className="font-bold font-mono text-ink-primary block">4. Total Impressions & Views</span>
              <p className="text-[11px] text-ink-secondary font-sans">
                ยอดการเข้าชมสะสมจริงที่ซิงค์อัตโนมัติจาก Meta Graph API, YouTube Data API และ TikTok
              </p>
            </div>
          </div>

          <div className="p-4 rounded-editorial bg-paper-canvas border border-border-rule space-y-2">
            <h4 className="font-bold text-ink-primary flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
              <span>ปุ่ม [📄 พิมพ์ใบประเมิน (Slip)]</span>
            </h4>
            <p className="text-[11px] text-ink-secondary font-sans">
              ในหน้าต่าง Scorecard รายบุคคล ผู้จัดการสามารถคลิกปุ่ม <em>[📄 พิมพ์ใบประเมิน (Slip)]</em> เพื่อเปิดเอกสารขนาดมาตรฐาน พร้อมสั่งพิมพ์ (<code>window.print()</code>) หรือคัดลอกข้อความสรุปส่งต่อให้ฝ่ายบริหารและ HR ได้ทันที
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'revoke',
      category: '06 — SECURITY & COMPLIANCE',
      title: 'นโยบายและการสั่งลบโพสต์จริงผ่าน API (Revoke & API Deletion Policy)',
      badge: 'ความปลอดภัย',
      icon: Trash2,
      summary: 'มาตรฐานการสั่งลบโพสต์จริงแยกตามขีดความสามารถของแต่ละแพลตฟอร์มโซเชียล',
      lead: 'เข้าใจข้อกำหนดและความเป็นไปได้ทางเทคนิคของ Social Media APIs ในการสั่งถอนโพสต์ฉุกเฉิน',
      content: (
        <div className="space-y-6 text-xs leading-relaxed text-ink-secondary">
          <p>
            หากโพสต์มีข้อมูลผิดพลาดหรือต้องการระงับการเผยแพร่อย่างเร่งด่วน RetzPost มีปุ่ม <strong>[🗑️ ถอนโพสต์]</strong> ในแท็บ Dispatch Monitor ซึ่งจะทำงานตามมาตรฐานจริงของแต่ละแพลตฟอร์ม:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-dialog bg-semantic-success-bg/40 border border-semantic-success/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-semantic-success flex items-center gap-1">
                  ⚡ API Direct Deletion
                </span>
                <span className="text-[9px] bg-semantic-success/20 text-semantic-success px-1.5 py-0.2 rounded font-bold">
                  อัตโนมัติ 100%
                </span>
              </div>
              <h4 className="font-bold text-ink-primary">Facebook, YouTube, X (Twitter)</h4>
              <p className="text-[11px] text-ink-secondary font-sans leading-relaxed">
                ทั้ง 3 แพลตฟอร์มอนุญาตให้แอปพลิเคชัน 3rd-party สั่งลบโพสต์ได้ผ่าน API อย่างเป็นทางการ เมื่อกดถอนโพสต์ ระบบจะยิงคำสั่ง <code>DELETE</code> ไปยังเซิร์ฟเวอร์ปลายทาง และลบเนื้อหาจริงออกทันที
              </p>
            </div>

            <div className="p-4 rounded-dialog bg-semantic-warning-bg/40 border border-semantic-warning/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-semantic-warning flex items-center gap-1">
                  🛡️ Guided Deep Link Deletion
                </span>
                <span className="text-[9px] bg-semantic-warning/20 text-semantic-warning px-1.5 py-0.2 rounded font-bold">
                  ลบในแอป 3 วินาที
                </span>
              </div>
              <h4 className="font-bold text-ink-primary">Instagram, TikTok, Lemon8</h4>
              <p className="text-[11px] text-ink-secondary font-sans leading-relaxed">
                ตามนโยบายความปลอดภัยของ Meta และ ByteDance เพื่อป้องกันการลบข้อมูลโดยมิชอบ API สาธารณะจึงไม่อนุญาตให้แอปภายนอกลบคลิปแทนผู้ใช้ RetzPost จึงแสดงหน้าต่างแจ้งเตือนพร้อมปุ่ม <em>[เปิดไปที่โพสต์จริง ↗]</em> เพื่อให้คุณเปิดเข้าแอปและกดลบได้ใน 3 วินาที
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
        sec.category.toLowerCase().includes(q) ||
        sec.badge.toLowerCase().includes(q)
    );
  }, [docSections, searchQuery]);

  return (
    <div className="min-h-screen bg-paper-canvas flex flex-col font-sans selection:bg-brand-indigo selection:text-white">
      {/* Editorial Public Masthead Header */}
      <PublicHeader />

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
            คู่มือการใช้งานและเอกสารระบบ RetzPost
          </h1>
          <p className="text-sm text-ink-secondary max-w-2xl mx-auto leading-relaxed font-sans">
            คู่มือกองบรรณาธิการดิจิทัลฉบับสมบูรณ์: ตั้งแต่เริ่มต้นเชื่อมต่อโซเชียล, การเขียนข่าวและปล่อยคลิปสั้นข้าม 6 แพลตฟอร์ม, ไปจนถึงการวิเคราะห์ KPI ด้วย AI
          </p>

          {/* Search Box */}
          <div className="max-w-lg mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="ค้นหาคู่มือ เช่น สมัครสมาชิก, ปฏิทิน, ขนาดวิดีโอ 9:16, KPI, ลบโพสต์..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-paper-canvas border-2 border-border-rule rounded-editorial font-mono text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs font-mono text-ink-secondary hover:text-ink-primary px-1.5 py-0.5 rounded bg-paper-subtle"
                >
                  ล้าง
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-[11px] font-mono text-ink-secondary text-left mt-1.5 pl-1">
                ผลการค้นหา: พบ {filteredSections.length} หมวดหมู่ที่ตรงกัน
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
              { id: 'quickstart', label: '⚡ 3-Min Quickstart', sub: 'สมัคร & ยืนยัน OTP' },
              { id: 'composer', label: '📱 6-Platform Specs', sub: 'ขนาดคลิป Reels / Shorts' },
              { id: 'calendar', label: '🔥 Peak Golden Slots', sub: 'เวลานาทีทอง Engagement สูง' },
              { id: 'revoke', label: '🗑️ API Revoke Policy', sub: 'นโยบายการสั่งลบโพสต์จริง' },
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
                  สารบัญคู่มือ (Table of Contents)
                </span>
                <span className="text-[10px] font-mono text-ink-secondary">
                  {filteredSections.length} หัวข้อ
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
                เอกสารทางกฎหมาย & นโยบาย
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <Link
                  href="/privacy"
                  className="flex items-center gap-1.5 text-brand-indigo hover:underline font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-semantic-success" />
                  <span>นโยบายความเป็นส่วนตัว (Privacy Policy) →</span>
                </Link>
                <Link
                  href="/terms"
                  className="flex items-center gap-1.5 text-brand-indigo hover:underline font-semibold"
                >
                  <FileText className="w-3.5 h-3.5 text-brand-indigo" />
                  <span>ข้อกำหนดการให้บริการ (Terms of Service) →</span>
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
                  ไม่พบคู่มือที่ตรงกับคำค้นหา &quot;{searchQuery}&quot;
                </h3>
                <p className="text-xs font-mono text-ink-secondary">
                  ลองพิมพ์คำสั้นๆ เช่น &quot;สมัคร&quot;, &quot;ปฏิทิน&quot;, &quot;สเปก&quot;, หรือกดปุ่มล้างคำค้นหาด้านบน
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
                        <span>คู่มือหัวข้อนี้มีประโยชน์ต่อการทำงานของคุณหรือไม่?</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {feedback ? (
                          <span className="text-[11px] font-semibold text-semantic-success bg-semantic-success-bg px-2.5 py-1 rounded-editorial border border-semantic-success/20 animate-in fade-in">
                            ✓ ขอบคุณสำหรับข้อเสนอแนะ!
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleFeedback(sec.id, 'up')}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              <ThumbsUp className="w-3 h-3 text-semantic-success" />
                              <span>มีประโยชน์</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(sec.id, 'down')}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              <ThumbsDown className="w-3 h-3 text-accent-terracotta" />
                              <span>ต้องการรายละเอียดเพิ่ม</span>
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
