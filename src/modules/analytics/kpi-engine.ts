/**
 * RETZPOST EMPLOYEE KPI TELEMETRY ENGINE
 * 
 * [🧪 MOCKUP & TEST DATA REGISTRY]
 * This module provisions simulated KPI metrics, targets, completion rates, 
 * and on-time publishing adherence scores for team members.
 * 
 * Replace with real database queries (e.g., PostgreSQL / Supabase) when connecting to production.
 */

export interface EmployeePostSummary {
  id: string;
  title: string;
  views: number;
  likes: number;
  shares: number;
  dateStr: string;
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK';
  status: 'PUBLISHED' | 'SCHEDULED';
}

export interface EmployeeKPI {
  memberId: string;
  name: string;
  role: string;
  roleTh: string;
  roleEn?: string;
  workspaceId: string;
  workspaceName: string;
  avatarBg: string;
  avatarText: string;
  
  // KPI Metrics
  targetPosts: number;
  actualPosts: number;
  postsCompletionRate: number; // e.g., 120 (%)
  onTimePublishingRate: number; // e.g., 96 (%)
  totalImpressions: number; // e.g., 348,000
  totalEngagements: number; // e.g., 28,400
  avgEngagementRate: string; // e.g., '8.2%'
  firstPassApprovalRate: number; // e.g., 94 (%)
  
  // Evaluation Scorecard
  overallKpiScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  status: 'EXCEEDS_TARGET' | 'ON_TRACK' | 'NEEDS_ATTENTION';
  rank: number;
  
  // Attribution & Coaching
  strengthsTh: string;
  strengthsEn?: string;
  coachingNotesTh: string;
  coachingNotesEn?: string;
  focusTags?: string[];
  lastEvaluatedAt?: string;
  evaluatedBy?: string;
  evaluatedByEn?: string;
  isAiGenerated?: boolean;
  recentPosts: EmployeePostSummary[];
  isMockData: boolean;
}

export const MOCK_EMPLOYEE_KPIS: EmployeeKPI[] = [
  {
    memberId: 'mbr-c1-3',
    name: 'Narumon K. (นฤมล)',
    role: 'EDITOR',
    roleTh: 'Senior Content Creator & Editor',
    roleEn: 'Senior Content Creator & Editor',
    workspaceId: 'ws_main',
    workspaceName: 'Main Studio',
    avatarBg: 'bg-emerald-600',
    avatarText: 'NK',
    targetPosts: 20,
    actualPosts: 24,
    postsCompletionRate: 120,
    onTimePublishingRate: 98,
    totalImpressions: 485200,
    totalEngagements: 39400,
    avgEngagementRate: '8.1%',
    firstPassApprovalRate: 96,
    overallKpiScore: 96,
    grade: 'A+',
    status: 'EXCEEDS_TARGET',
    rank: 1,
    strengthsTh: 'เชี่ยวชาญการเขียนแคปชันแบรนด์ และเลือกเวลาปล่อยโพสต์ตรง Peak Hour 100%',
    strengthsEn: 'Expert at brand copywriting and 100% aligned with Peak Hour dispatch windows.',
    coachingNotesTh: 'ทำผลงานเกินเป้าหมาย 120% แนะนำให้เป็น Mentor ช่วยเทรนการเขียน Story Link Sticker ให้ทีม',
    coachingNotesEn: 'Exceeded target by 120%. Recommend mentoring the team on Story Link Sticker creation.',
    focusTags: ['🏆 Top Performer', '⏰ Peak Hour Master', '🎯 High First-Pass'],
    evaluatedBy: 'AI สังเคราะห์ร่วมกับหัวหน้างาน',
    evaluatedByEn: 'AI Synthesized with Lead Manager',
    isAiGenerated: true,
    isMockData: true,
    recentPosts: [
      {
        id: 'p-1',
        title: 'Masterclass Behind-the-Scenes Reel',
        views: 142000,
        likes: 8900,
        shares: 2400,
        dateStr: '2026-10-23',
        platform: 'FACEBOOK',
        status: 'PUBLISHED',
      },
      {
        id: 'p-2',
        title: 'Sukhumvit Sky Pool Twilight Highlight',
        views: 185000,
        likes: 14200,
        shares: 3100,
        dateStr: '2026-10-22',
        platform: 'INSTAGRAM',
        status: 'PUBLISHED',
      },
      {
        id: 'p-3',
        title: 'Premium Brand Campaign Weekend Launch',
        views: 98000,
        likes: 6400,
        shares: 1200,
        dateStr: '2026-10-20',
        platform: 'FACEBOOK',
        status: 'PUBLISHED',
      },
    ],
  },
  {
    memberId: 'mbr-acme-1',
    name: 'Creative Director',
    role: 'OWNER',
    roleTh: 'Lead Creator & Tech Director',
    roleEn: 'Lead Creator & Tech Director',
    workspaceId: 'ws_creator',
    workspaceName: 'Creator Hub',
    avatarBg: 'bg-brand-indigo',
    avatarText: 'CD',
    targetPosts: 15,
    actualPosts: 18,
    postsCompletionRate: 120,
    onTimePublishingRate: 95,
    totalImpressions: 392000,
    totalEngagements: 31800,
    avgEngagementRate: '8.4%',
    firstPassApprovalRate: 100,
    overallKpiScore: 94,
    grade: 'A+',
    status: 'EXCEEDS_TARGET',
    rank: 2,
    strengthsTh: 'ยอดวิวแนวตั้ง 9:16 Video Reels บน YouTube Shorts และ TikTok เติบโตต่อเนื่อง',
    strengthsEn: 'Vertical 9:16 Video Reels on YouTube Shorts and TikTok continuously growing.',
    coachingNotesTh: 'ความคมชัดของภาพระดับสตูดิโอดีเยี่ยม สามารถขยายการทำ Carousel รูปภาพเพิ่มเพื่อดึง Saves',
    coachingNotesEn: 'Excellent studio-grade image clarity. Can expand into Carousel image albums to drive Saves.',
    focusTags: ['🚀 High Velocity', '⚡ Lead Creator', '🔥 Tech Directing'],
    evaluatedBy: 'AI สังเคราะห์ร่วมกับหัวหน้างาน',
    evaluatedByEn: 'AI Synthesized with Lead Manager',
    isAiGenerated: true,
    isMockData: true,
    recentPosts: [
      {
        id: 'p-4',
        title: 'Studio Redesign Tour Master Cut ($45K Setup)',
        views: 248000,
        likes: 18900,
        shares: 4200,
        dateStr: '2026-10-22',
        platform: 'YOUTUBE',
        status: 'PUBLISHED',
      },
      {
        id: 'p-5',
        title: 'Studio Lighting & Gear Breakdown',
        views: 144000,
        likes: 12900,
        shares: 2800,
        dateStr: '2026-10-19',
        platform: 'TIKTOK',
        status: 'PUBLISHED',
      },
    ],
  },
  {
    memberId: 'mbr-c1-4',
    name: 'Anan T. (อนันต์)',
    role: 'CONTRIBUTOR',
    roleTh: 'Junior Copywriter & Content Specialist',
    roleEn: 'Junior Copywriter & Content Specialist',
    workspaceId: 'ws_main',
    workspaceName: 'Main Studio',
    avatarBg: 'bg-amber-600',
    avatarText: 'AT',
    targetPosts: 15,
    actualPosts: 16,
    postsCompletionRate: 107,
    onTimePublishingRate: 92,
    totalImpressions: 194000,
    totalEngagements: 14200,
    avgEngagementRate: '7.3%',
    firstPassApprovalRate: 88,
    overallKpiScore: 88,
    grade: 'A',
    status: 'ON_TRACK',
    rank: 3,
    strengthsTh: 'ขยันร่างคอนเทนต์ล่วงหน้าใน Studio Desk เสนอไอเดียโปรโมชั่นใหม่ๆ สม่ำเสมอ',
    strengthsEn: 'Diligent in drafting content in Studio Desk early; consistently pitches innovative promotional ideas.',
    coachingNotesTh: 'ปรับปรุงการตรวจทานลิงก์ Story Sticker ให้ครบถ้วนก่อนส่งให้ผู้จัดการอนุมัติ (Approval Flow)',
    coachingNotesEn: 'Refine verification of Story Sticker links prior to submitting for managerial approval flow.',
    focusTags: ['✍️ Fast Ideation', '📈 Good Engagement', '📝 Story Specialist'],
    evaluatedBy: 'AI สังเคราะห์ร่วมกับหัวหน้างาน',
    evaluatedByEn: 'AI Synthesized with Lead Manager',
    isAiGenerated: true,
    isMockData: true,
    recentPosts: [
      {
        id: 'p-6',
        title: 'Flash Sale สิทธิพิเศษประจำสัปดาห์ ลดสูงสุด 50%',
        views: 112000,
        likes: 7800,
        shares: 1900,
        dateStr: '2026-10-21',
        platform: 'FACEBOOK',
        status: 'PUBLISHED',
      },
      {
        id: 'p-7',
        title: 'Premium Suite Virtual Tour Walkthrough',
        views: 82000,
        likes: 6400,
        shares: 1100,
        dateStr: '2026-10-18',
        platform: 'YOUTUBE',
        status: 'PUBLISHED',
      },
    ],
  },
  {
    memberId: 'mbr-acme-3',
    name: 'Video Production Specialist',
    role: 'EDITOR',
    roleTh: 'Video Production Specialist',
    roleEn: 'Video Production Specialist',
    workspaceId: 'ws_creator',
    workspaceName: 'Creator Hub',
    avatarBg: 'bg-purple-600',
    avatarText: 'VP',
    targetPosts: 12,
    actualPosts: 11,
    postsCompletionRate: 92,
    onTimePublishingRate: 88,
    totalImpressions: 142000,
    totalEngagements: 10800,
    avgEngagementRate: '7.6%',
    firstPassApprovalRate: 90,
    overallKpiScore: 83,
    grade: 'B+',
    status: 'ON_TRACK',
    rank: 4,
    strengthsTh: 'ตัดต่อวิดีโอ Shorts รวดเร็ว จังหวะดนตรี Hook ดึงดูดผู้ชมใน 3 วินาทีแรกดีมาก',
    strengthsEn: 'Fast Shorts video editing with captivating music hooks in the initial 3 seconds.',
    coachingNotesTh: 'ขาดโพสต์อีก 1 งานเพื่อให้ครบ Target ประจำเดือน แนะนำให้ตั้งคิวปล่อยอัตโนมัติในปฏิทิน',
    coachingNotesEn: '1 post away from monthly target. Recommend scheduling automatic release in calendar.',
    focusTags: ['🎬 Video Shorts', '🎵 Sound Hook', '🎯 Quality Focus'],
    evaluatedBy: 'AI สังเคราะห์ร่วมกับหัวหน้างาน',
    evaluatedByEn: 'AI Synthesized with Lead Manager',
    isAiGenerated: true,
    isMockData: true,
    recentPosts: [
      {
        id: 'p-8',
        title: 'Color Grading Before & After LUTs',
        views: 89000,
        likes: 6200,
        shares: 980,
        dateStr: '2026-10-17',
        platform: 'YOUTUBE',
        status: 'PUBLISHED',
      },
    ],
  },
  {
    memberId: 'mbr-coffee-1',
    name: 'Ploy C. (พลอย)',
    role: 'CONTRIBUTOR',
    roleTh: 'Barista & Cafe Storyteller',
    roleEn: 'Barista & Cafe Storyteller',
    workspaceId: 'ws_coffee',
    workspaceName: 'Coffee Craft BKK',
    avatarBg: 'bg-stone-600',
    avatarText: 'PC',
    targetPosts: 10,
    actualPosts: 7,
    postsCompletionRate: 70,
    onTimePublishingRate: 75,
    totalImpressions: 54000,
    totalEngagements: 4200,
    avgEngagementRate: '7.8%',
    firstPassApprovalRate: 82,
    overallKpiScore: 68,
    grade: 'C',
    status: 'NEEDS_ATTENTION',
    rank: 5,
    strengthsTh: 'ภาพถ่ายเครื่องดื่มและบรรยากาศร้านมีเอกลักษณ์ Mood & Tone สวยงาม อัตราคอมเมนต์สูง',
    strengthsEn: 'Beverage and cafe ambiance photography has a unique, beautiful mood and high comment rate.',
    coachingNotesTh: '⚠️ ยอดโพสต์ยังไม่ถึงเป้าหมาย (ทำได้ 7/10 งาน) และปล่อยโพสต์เลทกว่าเวลา Peak แนะนำให้ใช้ฟีเจอร์ AI Schedule แนะนำเวลาทอง',
    coachingNotesEn: '⚠️ Target not yet reached (7/10 posts) and posted later than peak hours. Recommend using AI Schedule.',
    focusTags: ['📸 Aesthetic Mood', '⚠️ Volume Gap', '⏳ Schedule Adherence'],
    evaluatedBy: 'หัวหน้างาน (Lead Editor)',
    evaluatedByEn: 'Lead Editor',
    isAiGenerated: false,
    isMockData: true,
    recentPosts: [
      {
        id: 'p-9',
        title: 'Single Origin Drip Highlight',
        views: 32000,
        likes: 2400,
        shares: 420,
        dateStr: '2026-10-21',
        platform: 'INSTAGRAM',
        status: 'PUBLISHED',
      },
      {
        id: 'p-10',
        title: 'Midnight Roast Special Drop',
        views: 22000,
        likes: 1800,
        shares: 210,
        dateStr: '2026-10-15',
        platform: 'INSTAGRAM',
        status: 'PUBLISHED',
      },
    ],
  },
];

export interface AiCoachingResult {
  strengthsTh: string;
  strengthsEn?: string;
  coachingNotesTh: string;
  coachingNotesEn?: string;
  focusTags: string[];
  generatedAt: string;
  modelName: string;
}

/**
 * AI KPI COACHING SYNTHESIS ENGINE
 * Evaluates multi-dimensional telemetry (volume, adherence, pass rate, reach)
 * and drafts actionable strengths and managerial growth coaching notes in professional Thai and English.
 */
export function generateAiKpiCoaching(kpi: EmployeeKPI): AiCoachingResult {
  const strengths: string[] = [];
  const strengthsEnArr: string[] = [];
  const coaching: string[] = [];
  const coachingEnArr: string[] = [];
  const tags: string[] = [];

  // 1. Output & Volume Adherence
  if (kpi.postsCompletionRate >= 115) {
    strengths.push(`ผลิตคอนเทนต์ได้เกินเป้าหมาย ${kpi.postsCompletionRate}% (${kpi.actualPosts}/${kpi.targetPosts} โพสต์) สม่ำเสมอและมีความรับผิดชอบสูง`);
    strengthsEnArr.push(`Exceeded content production target by ${kpi.postsCompletionRate}% (${kpi.actualPosts}/${kpi.targetPosts} posts) with exceptional velocity.`);
    tags.push('🚀 High Velocity');
  } else if (kpi.postsCompletionRate >= 100) {
    strengths.push(`ส่งมอบงานครบถ้วน 100% ตามเป้าหมาย (${kpi.actualPosts}/${kpi.targetPosts} โพสต์) รักษามาตรฐานการผลิตได้ดี`);
    strengthsEnArr.push(`Delivered 100% of target dispatches (${kpi.actualPosts}/${kpi.targetPosts} posts), sustaining steady output quality.`);
    tags.push('✅ Target Achieved');
  } else {
    coaching.push(`ยอดผลิตคอนเทนต์ยังต่ำกว่าเป้าหมาย (${kpi.actualPosts}/${kpi.targetPosts} โพสต์ หรือ ${kpi.postsCompletionRate}%) ควรจัดตาราง Content Batching ล่วงหน้ารายสัปดาห์`);
    coachingEnArr.push(`Output remains below target (${kpi.actualPosts}/${kpi.targetPosts} posts or ${kpi.postsCompletionRate}%). Recommend weekly batching workflows.`);
    tags.push('⚠️ Volume Gap');
  }

  // 2. On-Time Adherence & Peak Hour Timing
  if (kpi.onTimePublishingRate >= 95) {
    strengths.push(`มีวินัยการยิงโพสต์ตรงเวลาระดับยอดเยี่ยม (${kpi.onTimePublishingRate}%) สอดคล้องกับหน้าต่างเวลา Peak Hours ของช่อง`);
    strengthsEnArr.push(`Superb dispatch timing discipline (${kpi.onTimePublishingRate}%), consistently capturing channel Peak Hour windows.`);
    tags.push('⏰ Peak Hour Master');
  } else if (kpi.onTimePublishingRate >= 85) {
    strengths.push(`การเผยแพร่ตรงเวลาอยู่ในเกณฑ์ดี (${kpi.onTimePublishingRate}%)`);
    strengthsEnArr.push(`Punctual publishing performance is good (${kpi.onTimePublishingRate}%).`);
  } else {
    coaching.push(`อัตราการปล่อยโพสต์ตรงเวลายังต่ำกว่ามาตรฐาน (${kpi.onTimePublishingRate}%) แนะนำให้ตั้งเวลาอัตโนมัติ (Auto-Schedule) ล่วงหน้าอย่างน้อย 48 ชั่วโมงเพื่อลดการสะดุด`);
    coachingEnArr.push(`On-time publishing adherence is below standard (${kpi.onTimePublishingRate}%). Recommend auto-scheduling at least 48h in advance.`);
    tags.push('⏳ Schedule Adherence');
  }

  // 3. Quality & First-Pass Approval Rate
  if (kpi.firstPassApprovalRate >= 92) {
    strengths.push(`คุณภาพงานประณีต ผ่านการอนุมัติในรอบแรกสูงถึง ${kpi.firstPassApprovalRate}% แทบไม่มีขั้นตอนแก้งานซ้ำซ้อน`);
    strengthsEnArr.push(`Refined content craft with a high ${kpi.firstPassApprovalRate}% first-pass approval rate, minimizing revision loops.`);
    tags.push('🎯 High First-Pass');
  } else if (kpi.firstPassApprovalRate >= 80) {
    coaching.push(`การตรวจผ่านรอบแรกอยู่ที่ ${kpi.firstPassApprovalRate}% สามารถยกระดับความเร็วได้โดยการทบทวน Checklist คำสะกดและ Format สื่อก่อนส่ง Approve`);
    coachingEnArr.push(`First-pass rate sits at ${kpi.firstPassApprovalRate}%. Accelerate by verifying spelling and media format checklists prior to review.`);
  } else {
    coaching.push(`อัตราส่งแก้งานซ้ำซ้อนค่อนข้างสูง (ผ่านรอบแรก ${kpi.firstPassApprovalRate}%) ควรจัดทำ Editorial Checklist ร่วมกับหัวหน้างานเพื่อลดคอขวด`);
    coachingEnArr.push(`Excessive revision iterations (first-pass ${kpi.firstPassApprovalRate}%). Collaborate on an Editorial Checklist to alleviate bottlenecks.`);
    tags.push('🛠️ Quality Checklist');
  }

  // 4. Reach & Engagement Impact
  if (kpi.totalImpressions >= 200000 || parseFloat(kpi.avgEngagementRate) >= 8.0) {
    strengths.push(`สร้างปฏิสัมพันธ์และการเข้าถึงได้ทรงพลัง (ยอดวิวรวม ${(kpi.totalImpressions / 1000).toFixed(0)}K ครั้ง, Avg ER ${kpi.avgEngagementRate})`);
    strengthsEnArr.push(`Powerful audience reach and engagement (total views ${(kpi.totalImpressions / 1000).toFixed(0)}K, Avg ER ${kpi.avgEngagementRate}).`);
    tags.push('🔥 Viral Impact');
  }

  // 5. Growth Plan / Coaching Directive
  if (kpi.overallKpiScore >= 90) {
    coaching.push(`ผลงานอยู่ในระดับโดดเด่น (${kpi.grade}) แนะนำให้เป็น Mentor ช่วยเทรนเพื่อนร่วมทีมด้าน Content Hook และการวางตารางเผยแพร่`);
    coachingEnArr.push(`Outstanding tier (${kpi.grade}). Recommended to mentor peers on content hooks and scheduling strategy.`);
    tags.push('🏆 Team Mentor');
  } else if (kpi.overallKpiScore >= 80) {
    coaching.push(`ผลงานเกณฑ์ดี มุ่งเน้นการต่อยอดคอนเทนต์ที่มี Performance สูง (Repurpose สู่ Short-form Reels/TikTok) เพื่อขยายฐานผู้ติดตาม`);
    coachingEnArr.push(`Solid performance. Focus on repurposing high-performing posts into short-form Reels/TikTok to expand reach.`);
    tags.push('📈 Growth Mode');
  } else {
    coaching.push(`วางแผนประกบคู่ 1-on-1 รายสัปดาห์กับ Lead Creator เพื่อทบทวน Workflow และช่วยปลดล็อกข้อจำกัดในการผลิต`);
    coachingEnArr.push(`Initiate weekly 1-on-1 check-ins with Lead Creator to unblock production constraints.`);
  }

  const strengthsTh = strengths.join(' พร้อมทั้ง');
  const coachingNotesTh = coaching.join(' ');
  const strengthsEn = strengthsEnArr.join(' ');
  const coachingNotesEn = coachingEnArr.join(' ');

  return {
    strengthsTh: strengthsTh || 'รักษามาตรฐานการทำงานและประสานงานกับทีมอย่างต่อเนื่อง',
    strengthsEn: strengthsEn || 'Maintains consistent work standards and team coordination.',
    coachingNotesTh: coachingNotesTh || 'ติดตามเป้าหมายอย่างใกล้ชิดและพัฒนาทักษะเฉพาะทางตามแผนงาน',
    coachingNotesEn: coachingNotesEn || 'Monitor goals closely and expand domain craft per development plan.',
    focusTags: tags.slice(0, 3),
    generatedAt: new Date().toISOString(),
    modelName: 'RetzPost AI Coaching Engine (Gemini 1.5 Pro Hybrid)',
  };
}

export interface EmployeeKpiOverride {
  strengthsTh: string;
  strengthsEn?: string;
  coachingNotesTh: string;
  coachingNotesEn?: string;
  focusTags?: string[];
  lastEvaluatedAt?: string;
  evaluatedBy?: string;
  evaluatedByEn?: string;
  isAiGenerated?: boolean;
}

const STORAGE_KEY = 'retzpost_custom_employee_kpis_v1';

export function loadEmployeeKpiOverrides(): Record<string, EmployeeKpiOverride> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to load employee KPI overrides:', err);
    return {};
  }
}

export function saveEmployeeKpiEvaluation(
  memberId: string,
  strengthsTh: string,
  coachingNotesTh: string,
  focusTags?: string[],
  isAiGenerated: boolean = false,
  strengthsEn?: string,
  coachingNotesEn?: string,
  evaluatedByEn?: string
): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadEmployeeKpiOverrides();
    current[memberId] = {
      strengthsTh,
      strengthsEn,
      coachingNotesTh,
      coachingNotesEn,
      focusTags,
      lastEvaluatedAt: new Date().toISOString(),
      evaluatedBy: isAiGenerated ? 'AI สังเคราะห์ร่วมกับหัวหน้างาน' : 'หัวหน้างาน (Lead Editor)',
      evaluatedByEn: evaluatedByEn || (isAiGenerated ? 'AI Synthesized with Lead Manager' : 'Lead Editor'),
      isAiGenerated,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save employee KPI evaluation:', err);
  }
}

export function resetEmployeeKpiEvaluations(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset employee KPI evaluations:', err);
  }
}

import { isMockDataCleared } from '../data/mock-data-manager';

export function getEmployeeKPIs(workspaceId?: string): EmployeeKPI[] {
  if (isMockDataCleared()) {
    return [];
  }
  const overrides = loadEmployeeKpiOverrides();
  
  const merged = MOCK_EMPLOYEE_KPIS.map((emp) => {
    const override = overrides[emp.memberId];
    if (override) {
      return {
        ...emp,
        strengthsTh: override.strengthsTh,
        strengthsEn: override.strengthsEn || emp.strengthsEn,
        coachingNotesTh: override.coachingNotesTh,
        coachingNotesEn: override.coachingNotesEn || emp.coachingNotesEn,
        focusTags: override.focusTags || emp.focusTags,
        lastEvaluatedAt: override.lastEvaluatedAt,
        evaluatedBy: override.evaluatedBy,
        evaluatedByEn: override.evaluatedByEn || emp.evaluatedByEn,
        isAiGenerated: override.isAiGenerated,
      };
    }
    return emp;
  });

  if (!workspaceId || workspaceId === 'ALL') {
    return merged;
  }
  return merged.filter(
    (e) =>
      e.workspaceId === workspaceId ||
      (workspaceId === 'ws_main' && e.workspaceId === 'ws_capitalone') ||
      (workspaceId === 'ws_capitalone' && e.workspaceId === 'ws_main') ||
      (workspaceId === 'ws_creator' && e.workspaceId === 'ws_acme') ||
      (workspaceId === 'ws_acme' && e.workspaceId === 'ws_creator')
  );
}

export function getDepartmentSummary(workspaceId?: string) {
  const kpis = getEmployeeKPIs(workspaceId);
  const totalEmployees = kpis.length;
  const totalTargetPosts = kpis.reduce((acc, curr) => acc + curr.targetPosts, 0);
  const totalActualPosts = kpis.reduce((acc, curr) => acc + curr.actualPosts, 0);
  const overallCompletionRate = totalTargetPosts > 0 ? Math.round((totalActualPosts / totalTargetPosts) * 100) : 0;
  
  const avgOnTime = totalEmployees > 0 
    ? Math.round(kpis.reduce((acc, curr) => acc + curr.onTimePublishingRate, 0) / totalEmployees) 
    : 0;

  const totalImpressions = kpis.reduce((acc, curr) => acc + curr.totalImpressions, 0);
  const totalEngagements = kpis.reduce((acc, curr) => acc + curr.totalEngagements, 0);
  const topPerformer = kpis.length > 0 ? [...kpis].sort((a, b) => b.overallKpiScore - a.overallKpiScore)[0] : null;

  return {
    totalEmployees,
    totalTargetPosts,
    totalActualPosts,
    overallCompletionRate,
    avgOnTime,
    totalImpressions,
    totalEngagements,
    topPerformer,
    isMockData: true,
  };
}
