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
  coachingNotesTh: string;
  recentPosts: EmployeePostSummary[];
  isMockData: boolean;
}

export const MOCK_EMPLOYEE_KPIS: EmployeeKPI[] = [
  {
    memberId: 'mbr-c1-3',
    name: 'Narumon K. (นฤมล)',
    role: 'EDITOR',
    roleTh: 'Senior Content Creator & Editor',
    workspaceId: 'ws_capitalone',
    workspaceName: 'Capital One Real Estate',
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
    strengthsTh: 'เชี่ยวชาญการเขียนแคปชันอสังหาฯ ไฮเอนด์ และเลือกเวลาปล่อยโพสต์ตรง Peak Hour 100%',
    coachingNotesTh: 'ทำผลงานเกินเป้าหมาย 120% แนะนำให้เป็น Mentor ช่วยเทรนการเขียน Story Link Sticker ให้ทีม',
    isMockData: true,
    recentPosts: [
      {
        id: 'p-1',
        title: 'The Rich Rama 9 Penthouse Walkthrough',
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
        title: 'Bangkok Luxury Duplex Weekend Open House',
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
    name: 'Alex Rivera',
    role: 'OWNER',
    roleTh: 'Lead Creator & Tech Director',
    workspaceId: 'ws_acme',
    workspaceName: 'Acme Creator Studio',
    avatarBg: 'bg-brand-indigo',
    avatarText: 'AR',
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
    coachingNotesTh: 'ความคมชัดของภาพระดับสตูดิโอดีเยี่ยม สามารถขยายการทำ Carousel รูปภาพเพิ่มเพื่อดึง Saves',
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
        title: 'Aputure vs Godox Lighting Breakdown',
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
    workspaceId: 'ws_capitalone',
    workspaceName: 'Capital One Real Estate',
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
    coachingNotesTh: 'ปรับปรุงการตรวจทานลิงก์ Story Sticker ให้ครบถ้วนก่อนส่งให้ผู้จัดการอนุมัติ (Approval Flow)',
    isMockData: true,
    recentPosts: [
      {
        id: 'p-6',
        title: 'Flash Sale คอนโดพร้อมอยู่ ลดสูงสุด 500,000.-',
        views: 112000,
        likes: 7800,
        shares: 1900,
        dateStr: '2026-10-21',
        platform: 'FACEBOOK',
        status: 'PUBLISHED',
      },
      {
        id: 'p-7',
        title: 'Unit 12B Virtual Tour Walkthrough',
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
    name: 'Dave Miller',
    role: 'EDITOR',
    roleTh: 'Video Production Specialist',
    workspaceId: 'ws_acme',
    workspaceName: 'Acme Creator Studio',
    avatarBg: 'bg-purple-600',
    avatarText: 'DM',
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
    coachingNotesTh: 'ขาดโพสต์อีก 1 งานเพื่อให้ครบ Target ประจำเดือน แนะนำให้ตั้งคิวปล่อยอัตโนมัติในปฏิทิน',
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
    coachingNotesTh: '⚠️ ยอดโพสต์ยังไม่ถึงเป้าหมาย (ทำได้ 7/10 งาน) และปล่อยโพสต์เลทกว่าเวลา Peak แนะนำให้ใช้ฟีเจอร์ AI Schedule แนะนำเวลาทอง',
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

export function getEmployeeKPIs(workspaceId?: string): EmployeeKPI[] {
  if (!workspaceId || workspaceId === 'ALL') {
    return MOCK_EMPLOYEE_KPIS;
  }
  return MOCK_EMPLOYEE_KPIS.filter((e) => e.workspaceId === workspaceId);
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
  const topPerformer = [...kpis].sort((a, b) => b.overallKpiScore - a.overallKpiScore)[0];

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
