/**
 * RETZPOST AI CONTENT DIAGNOSIS & ATTRIBUTION ENGINE
 * 
 * [🧪 MOCKUP & TEST DATA REGISTRY]
 * This module provisions AI-driven performance attribution:
 * - Why a post performed well ("ทำไมถึงดี หรือได้ยอด")
 * - Key Attribution Factors (Timing, Visual Hook, Copywriting, Safe-Zone Link Placement)
 * - Actionable Recommendations ("แนวทางอย่างไร")
 * 
 * Replace with live Gemini 1.5 / OpenAI GPT-4o API calls when deploying to production.
 */

export interface AttributionFactor {
  category: 'TIMING' | 'VISUAL' | 'COPYWRITING' | 'PLACEMENT' | 'ALGORITHM';
  categoryLabelTh: string;
  icon: string;
  titleTh: string;
  descriptionTh: string;
  impactScore: number; // 0 - 100
  metricHighlight: string;
}

export interface PlaybookRecommendation {
  step: number;
  type: 'REPURPOSE' | 'AUDIENCE_EXPANSION' | 'CADENCE' | 'A_B_TEST';
  titleTh: string;
  actionTh: string;
  expectedOutcomeTh: string;
}

export interface PostDiagnosisInsight {
  postId: string;
  postTitle: string;
  workspaceName: string;
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK';
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks?: number;
  engagementRate: string;
  overallSuccessScore: number; // 0 - 100
  executiveSummaryTh: string;
  attributionDrivers: AttributionFactor[];
  actionablePlaybook: PlaybookRecommendation[];
  isMockData: boolean;
  generatedByModel: string;
}

export const MOCK_POST_DIAGNOSES: Record<string, PostDiagnosisInsight> = {
  'post-c1-1': {
    postId: 'post-c1-1',
    postTitle: 'The Rich Rama 9 Penthouse Walkthrough',
    workspaceName: 'Capital One Real Estate',
    platform: 'FACEBOOK',
    views: 142000,
    likes: 8900,
    comments: 420,
    shares: 2400,
    clicks: 1850,
    engagementRate: '9.4%',
    overallSuccessScore: 97,
    executiveSummaryTh: 'โพสต์นี้ทำผลงานได้สูงกว่าค่าเฉลี่ยของเพจ 3.4 เท่า เนื่องจากจับกระแส Penthouse Luxury ได้ถูกจังหวะเวลา มีภาพปกที่หยุดนิ้วโป้งคนดู และมี Call-to-Action ที่พาคนกดลิงก์เข้าสู่หน้าโครงการได้โดยตรง',
    isMockData: true,
    generatedByModel: 'RetzPost AI Attribution Engine (Simulated v2.4)',
    attributionDrivers: [
      {
        category: 'TIMING',
        categoryLabelTh: 'ช่วงเวลาทอง (Peak Timing)',
        icon: '⏰',
        titleTh: 'ปล่อยตรงหน้าต่างเวลา Lunch Swipes (12:15 PM)',
        descriptionTh: 'โพสต์ถูกปล่อยในช่วงพักเที่ยงของวันพฤหัสบดี ซึ่งกลุ่มเป้าหมายนักลงทุนและผู้บริหารเปิด Feed ดูมือถือมากที่สุด มี Peak Hour Match สูงถึง 98%',
        impactScore: 95,
        metricHighlight: '+42% Organic Reach บูสต์ใน 60 นาทีแรก',
      },
      {
        category: 'VISUAL',
        categoryLabelTh: 'จุดดึงดูดสายตา (Thumb-Stop Visual)',
        icon: '📸',
        titleTh: 'ภาพปก Duplex Sky Pool มี Contrast แสงเย็นสะดุดตา',
        descriptionTh: 'การใช้มุมกล้องมองเห็นวิวเมือง 360 องศา พร้อมสะท้อนผิวน้ำ มีอัตราหยุดดู (Thumb-stop Dwell Time) นาน 4.2 วินาที ซึ่งสูงกว่าค่าเฉลี่ยมาตรฐานอสังหาฯ (2.1 วินาที) ถึง 2 เท่า',
        impactScore: 98,
        metricHighlight: 'Dwell Time 4.2s (Benchmark 2.1s)',
      },
      {
        category: 'COPYWRITING',
        categoryLabelTh: 'จิตวิทยาแคปชัน (Copywriting & Angle)',
        icon: '✍️',
        titleTh: 'ใช้กรอบความคิด Exclusivity & Scarcity',
        descriptionTh: 'คำเปิดประโยคระบุจำนวนจำกัดและยูนิตพิเศษ ทำให้เกิดการแท็กเพื่อนและแชร์ไปยังกลุ่มนักลงทุนอสังหาฯ สูงถึง 2,400 ครั้ง',
        impactScore: 91,
        metricHighlight: '2,400 Shares (Viral Coefficient 1.8x)',
      },
      {
        category: 'PLACEMENT',
        categoryLabelTh: 'โครงสร้างลิงก์ (Placement & CTA)',
        icon: '🔗',
        titleTh: 'แนบ Direct Link เว็บโครงการและ Story Link Sticker',
        descriptionTh: 'จัดวางลิงก์ในจุด Thumb-Zone ที่กดง่าย ส่งผลให้อัตรา Click-Through Rate (CTR) พุ่งสูงถึง 5.4% ได้ยอดเข้าชมเว็บโครงการจริง 1,850 คน',
        impactScore: 94,
        metricHighlight: 'CTR 5.4% (Industry Avg: 1.8%)',
      },
    ],
    actionablePlaybook: [
      {
        step: 1,
        type: 'REPURPOSE',
        titleTh: 'นำฟุตเทจมาตัดเป็น 9:16 Video Reel สั้น 15 วินาที',
        actionTh: 'นำคลิปเจาะลึกเฉพาะห้องน้ำหินอ่อนและสระว่ายน้ำส่วนตัว มาตัดเป็นคลิปสั้นลง TikTok และ YouTube Shorts โดยใส่เสียงเพลง Ambient Luxury',
        expectedOutcomeTh: 'คาดการณ์ยอดวิวเพิ่มเติม 35,000 - 60,000 วิว ภายใน 48 ชั่วโมง',
      },
      {
        step: 2,
        type: 'AUDIENCE_EXPANSION',
        titleTh: 'สร้าง Custom Audience สำหรับยิงแคมเปญ Private Viewing',
        actionTh: 'ดึงคนที่ดูคลิปนี้เกิน 10 วินาที หรือคลิกลิงก์เว็บโครงการ ไปทำเป็นกลุ่มเป้าหมาย Retargeting เชิญชวนลงทะเบียนนัดชมห้องจริงรอบ Exclusive เสาร์-อาทิตย์นี้',
        expectedOutcomeTh: 'เพิ่มอัตรา Lead Conversion นัดหมายชมโครงการจริงได้ 12 - 18 ราย',
      },
      {
        step: 3,
        type: 'CADENCE',
        titleTh: 'ตั้งคิวโพสต์ Follow-up ในวันพฤหัสบดีหน้า เวลา 19:30 PM',
        actionTh: 'ปล่อยภาพบรรยากาศยามค่ำคืน (Twilight Sunset) ของยูนิตนี้ต่อเนื่อง เพื่อรักษาโมเมนตัมอัลกอริทึมของเพจ',
        expectedOutcomeTh: 'รักษาอัตรา Engagement Rate ให้อยู่เหนือ 7.5% ต่อเนื่อง',
      },
    ],
  },
  'post-acme-1': {
    postId: 'post-acme-1',
    postTitle: 'Studio Redesign Tour Master Cut ($45K Setup)',
    workspaceName: 'Acme Creator Studio',
    platform: 'YOUTUBE',
    views: 248000,
    likes: 18900,
    comments: 1120,
    shares: 4200,
    clicks: 2100,
    engagementRate: '9.8%',
    overallSuccessScore: 98,
    executiveSummaryTh: 'วิดีโอนี้ได้ยอดวิวทะลุ 2.4 แสนวิว จากพลังของ Hook ใน 3 วินาทีแรกที่บอกตัวเลขงบประมาณ $45,000 ชัดเจน ทำให้เกิดข้อถกเถียงและคอมเมนต์ถามพิกัดอุปกรณ์อย่างล้นหลาม',
    isMockData: true,
    generatedByModel: 'RetzPost AI Attribution Engine (Simulated v2.4)',
    attributionDrivers: [
      {
        category: 'VISUAL',
        categoryLabelTh: 'พลัง Hook 3 วินาทีแรก',
        icon: '⚡',
        titleTh: 'ก่อน-หลัง รีโนเวทแบบ Jump Cut รวดเร็ว',
        descriptionTh: 'อัตรา Retention ในช่วง 15 วินาทีแรกสูงถึง 86% คนดูไม่ออกจากคลิป อัลกอริทึม YouTube Shorts จึงดันคลิปเข้าหน้า Feed ผู้ใช้กว้างขึ้น',
        impactScore: 98,
        metricHighlight: '86% 15s Retention Rate',
      },
      {
        category: 'ALGORITHM',
        categoryLabelTh: 'การเร่งรอบ Re-watch ของอัลกอริทึม',
        icon: '🔄',
        titleTh: 'จบคลิปแบบ Perfect Loop วนกลับมาเริ่มต้นเนียนตา',
        descriptionTh: 'คนดูเฉลี่ย 1.6 รอบต่อคน ทำให้ระบบ Shorts ส่งต่อไปยังผู้ชมในต่างประเทศโดยอัตโนมัติ',
        impactScore: 96,
        metricHighlight: '1.6x Average Re-watch Ratio',
      },
      {
        category: 'COPYWRITING',
        categoryLabelTh: 'ตัวเลขงบประมาณกระตุ้นความอยากรู้',
        icon: '💡',
        titleTh: 'ระบุราคา $45,000 ทำให้เกิด Social Proof ชัดเจน',
        descriptionTh: 'คนดูเกิดการเปรียบเทียบความคุ้มค่า และสอบถามแบรนด์สินค้าในคอมเมนต์กว่า 1,120 ข้อความ',
        impactScore: 92,
        metricHighlight: '1,120 Comments Dispatched',
      },
    ],
    actionablePlaybook: [
      {
        step: 1,
        type: 'REPURPOSE',
        titleTh: 'สร้าง Carousel Infographic สรุปพิกัดของแต่งห้อง',
        actionTh: 'นำภาพนิ่งของโต๊ะ ขาตั้งจอ และไฟสตูดิโอ มาทำเป็น Album 5 ภาพลง Instagram Feed พร้อมแปะรหัสส่วนลด',
        expectedOutcomeTh: 'ดันยอด Saves ใน Instagram เพิ่มขึ้น 2,000+ ครั้ง',
      },
      {
        step: 2,
        type: 'A_B_TEST',
        titleTh: 'ทำคลิปเปรียบเทียบ "ไฟราคา $100 vs $1,000"',
        actionTh: 'แตกประเด็นย่อยจากคอมเมนต์ที่ถามเรื่องไฟสตูดิโอ มาทำคอนเทนต์ตอนต่อไปในสัปดาห์นี้',
        expectedOutcomeTh: 'ดึงยอดวิวจากฐานแฟนคลับเดิมได้ทันที 80,000+ วิว',
      },
    ],
  },
  'post-c1-2': {
    postId: 'post-c1-2',
    postTitle: 'Sukhumvit Sky Pool Twilight Highlight',
    workspaceName: 'Capital One Real Estate',
    platform: 'INSTAGRAM',
    views: 185000,
    likes: 14200,
    comments: 680,
    shares: 3100,
    clicks: 1420,
    engagementRate: '8.8%',
    overallSuccessScore: 94,
    executiveSummaryTh: 'ได้รับ Engagement สูงจากการใช้ฟอร์แมต Carousel ภาพสลับมุมมอง และการแนบ Interactive Link Sticker ในตำแหน่งที่ผู้ใช้ถนัดมือ',
    isMockData: true,
    generatedByModel: 'RetzPost AI Attribution Engine (Simulated v2.4)',
    attributionDrivers: [
      {
        category: 'PLACEMENT',
        categoryLabelTh: 'Link Sticker Positioning',
        icon: '🎯',
        titleTh: 'สติกเกอร์อยู่กึ่งกลางด้านล่างใน Safe Zone',
        descriptionTh: 'ไม่มีส่วนใดของ UI อินสตาแกรมมาบดบัง ทำให้ผู้ติดตามแตะดูลิงก์ห้องตัวอย่างได้ง่ายดาย',
        impactScore: 93,
        metricHighlight: 'CTR 4.8% on IG Story',
      },
      {
        category: 'VISUAL',
        categoryLabelTh: 'Twilight Gradient Color Harmony',
        icon: '🎨',
        titleTh: 'โทนสีท้องฟ้ายามเย็นกระตุ้นความรู้สึกผ่อนคลายหรูหรา',
        descriptionTh: 'โทนสีน้ำเงินครามตัดทองส้ม ดึงดูดสายตาบนหน้า Feed ที่ส่วนใหญ่เป็นสีขาวสว่าง',
        impactScore: 94,
        metricHighlight: '14.2K Likes (7.7% Like Rate)',
      },
    ],
    actionablePlaybook: [
      {
        step: 1,
        type: 'CADENCE',
        titleTh: 'จัดตารางโพสต์ซีรีส์ "Twilight Architecture" ทุกวันศุกร์',
        actionTh: 'สร้างแคมเปญประจำสัปดาห์เน้นคอนโดหรูยามเย็น เพื่อสร้างจดจำแบรนด์ให้ Capital One',
        expectedOutcomeTh: 'เพิ่ม Follower ใหม่ออร์แกนิก 450 - 600 บัญชีต่อสัปดาห์',
      },
    ],
  },
};

export function getPostDiagnosis(postId: string, fallbackTitle?: string): PostDiagnosisInsight {
  if (MOCK_POST_DIAGNOSES[postId]) {
    return MOCK_POST_DIAGNOSES[postId];
  }

  // Fallback dynamic generator for any post
  const title = fallbackTitle || 'คอนเทนต์เผยแพร่สด (Live Content Dispatch)';
  return {
    postId,
    postTitle: title,
    workspaceName: 'Capital One Real Estate',
    platform: 'FACEBOOK',
    views: 94000,
    likes: 6200,
    comments: 310,
    shares: 1420,
    clicks: 890,
    engagementRate: '8.4%',
    overallSuccessScore: 92,
    executiveSummaryTh: `การวิเคราะห์สำหรับ "${title}": คอนเทนต์นี้มีสัญญาณเชิงบวกสูงด้านเวลาปล่อยโพสต์และอัตราการแชร์ต่อ แนะนำให้นำเนื้อหาไปตัดต่อเป็นคลิปสั้นสำหรับ Reels/Shorts เพื่อขยายการเข้าถึงเพิ่มเติม`,
    isMockData: true,
    generatedByModel: 'RetzPost AI Attribution Engine (Simulated Fallback)',
    attributionDrivers: [
      {
        category: 'TIMING',
        categoryLabelTh: 'ช่วงเวลาที่เหมาะสม',
        icon: '⏰',
        titleTh: 'ตรงกับพฤติกรรมกลุ่มเป้าหมาย (Active Peak)',
        descriptionTh: 'ส่งโพสต์ในช่วงเวลาที่มีอัตราการเปิดอ่านสูง ส่งผลให้อัลกอริทึมกระจายโพสต์ได้อย่างมีประสิทธิภาพ',
        impactScore: 91,
        metricHighlight: '+35% Initial Impressions',
      },
      {
        category: 'COPYWRITING',
        categoryLabelTh: 'โครงสร้างเนื้อหา',
        icon: '✍️',
        titleTh: 'ข้อมูลครบถ้วน ชัดเจน และมี Call-to-Action',
        descriptionTh: 'การแบ่งข้อย่อยและระบุช่องทางติดต่อ ทำให้ผู้อ่านตัดสินใจทักสอบถามได้ง่าย',
        impactScore: 89,
        metricHighlight: '310 Comments / Direct Inquiries',
      },
    ],
    actionablePlaybook: [
      {
        step: 1,
        type: 'REPURPOSE',
        titleTh: 'ต่อยอดเป็น 24h Story พร้อม Link Sticker',
        actionTh: 'นำจุดเด่น 3 ข้อมาทำ Story สรุปสั้นๆ และแปะลิงก์ตรงไปยังหน้าเว็บโครงการ',
        expectedOutcomeTh: 'คาดการณ์ยอดคลิกเพิ่ม 250 - 400 Clicks',
      },
    ],
  };
}
