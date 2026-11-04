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
  categoryLabelEn?: string;
  icon: string;
  titleTh: string;
  titleEn?: string;
  descriptionTh: string;
  descriptionEn?: string;
  impactScore: number; // 0 - 100
  metricHighlight: string;
}

export interface PlaybookRecommendation {
  step: number;
  type: 'REPURPOSE' | 'AUDIENCE_EXPANSION' | 'CADENCE' | 'A_B_TEST';
  titleTh: string;
  titleEn?: string;
  actionTh: string;
  actionEn?: string;
  expectedOutcomeTh: string;
  expectedOutcomeEn?: string;
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
  executiveSummaryEn?: string;
  attributionDrivers: AttributionFactor[];
  actionablePlaybook: PlaybookRecommendation[];
  isMockData: boolean;
  generatedByModel: string;
}

export const MOCK_POST_DIAGNOSES: Record<string, PostDiagnosisInsight> = {
  'post-c1-1': {
    postId: 'post-c1-1',
    postTitle: 'Masterclass Behind-the-Scenes Reel',
    workspaceName: 'Main Studio',
    platform: 'FACEBOOK',
    views: 142000,
    likes: 8900,
    comments: 420,
    shares: 2400,
    clicks: 1850,
    engagementRate: '9.4%',
    overallSuccessScore: 97,
    executiveSummaryTh: 'โพสต์นี้ทำผลงานได้สูงกว่าค่าเฉลี่ยของเพจ 3.4 เท่า เนื่องจากจับกระแส Studio Production ได้ถูกจังหวะเวลา มีภาพปกที่หยุดนิ้วโป้งคนดู และมี Call-to-Action ที่พาคนกดลิงก์เข้าสู่หน้าเป้าหมายได้โดยตรง',
    executiveSummaryEn: 'This dispatch outperformed page benchmark by 3.4x due to precise studio production timing, thumb-stopping cover contrast, and a direct CTA funneling traffic to the target destination.',
    isMockData: true,
    generatedByModel: 'RetzPost AI Attribution Engine (Simulated v2.4)',
    attributionDrivers: [
      {
        category: 'TIMING',
        categoryLabelTh: 'ช่วงเวลาทอง',
        categoryLabelEn: 'Peak Timing Window',
        icon: '⏰',
        titleTh: 'ปล่อยตรงหน้าต่างเวลา Lunch Swipes (12:15 PM)',
        titleEn: 'Dispatched during Lunch Swipes window (12:15 PM)',
        descriptionTh: 'โพสต์ถูกปล่อยในช่วงพักเที่ยงของวันพฤหัสบดี ซึ่งกลุ่มเป้าหมายนักลงทุนและผู้บริหารเปิด Feed ดูมือถือมากที่สุด มี Peak Hour Match สูงถึง 98%',
        descriptionEn: 'Published during Thursday lunch break when target executives actively scroll mobile feeds, yielding a 98% Peak Hour Match.',
        impactScore: 95,
        metricHighlight: '+42% Organic Reach บูสต์ใน 60 นาทีแรก',
      },
      {
        category: 'VISUAL',
        categoryLabelTh: 'จุดดึงดูดสายตา',
        categoryLabelEn: 'Thumb-Stop Visuals',
        icon: '📸',
        titleTh: 'ภาพปก Studio Master Suite มี Contrast แสงจัดจ้านสะดุดตา',
        titleEn: 'Studio Master Suite cover features high-contrast cinematic lighting',
        descriptionTh: 'การจัดแสง Cinematic Lighting ระดับ 4K พร้อมเงาสะท้อนระดับสตูดิโอ มีอัตราหยุดดู นาน 4.2 วินาที ซึ่งสูงกว่าค่าเฉลี่ยมาตรฐานอุตสาหกรรม (2.1 วินาที) ถึง 2 เท่า',
        descriptionEn: '4K cinematic lighting setup and reflections yielded a 4.2-second dwell time, 2x above industry benchmark (2.1s).',
        impactScore: 98,
        metricHighlight: 'Dwell Time 4.2s (Benchmark 2.1s)',
      },
      {
        category: 'COPYWRITING',
        categoryLabelTh: 'จิตวิทยาแคปชัน',
        categoryLabelEn: 'Copywriting Psychology',
        icon: '✍️',
        titleTh: 'ใช้กรอบความคิด Exclusivity & Scarcity',
        titleEn: 'Leveraged Exclusivity & Scarcity framing',
        descriptionTh: 'คำเปิดประโยคระบุขั้นตอนการทำงานแบบเจาะลึก ทำให้เกิดการแท็กเพื่อนและแชร์ไปยังกลุ่มครีเอเตอร์และโปรดักชันเฮาส์สูงถึง 2,400 ครั้ง',
        descriptionEn: 'In-depth workflow opening hook catalyzed peer tags and shares across creator communities, reaching 2,400 shares.',
        impactScore: 91,
        metricHighlight: '2,400 Shares (Viral Coefficient 1.8x)',
      },
      {
        category: 'PLACEMENT',
        categoryLabelTh: 'โครงสร้างลิงก์',
        categoryLabelEn: 'Link Structure & Placement',
        icon: '🔗',
        titleTh: 'แนบ Direct Link เว็บเป้าหมายและ Story Link Sticker',
        titleEn: 'Attached Direct Destination Link and Story Link Sticker',
        descriptionTh: 'จัดวางลิงก์ในจุด Thumb-Zone ที่กดง่าย ส่งผลให้อัตรา Click-Through Rate (CTR) พุ่งสูงถึง 5.4% ได้ยอดเข้าชมเว็บเป้าหมายจริง 1,850 คน',
        descriptionEn: 'Placed links inside the ergonomic thumb zone, elevating CTR to 5.4% and driving 1,850 verified destination visits.',
        impactScore: 94,
        metricHighlight: 'CTR 5.4% (Industry Avg: 1.8%)',
      },
    ],
    actionablePlaybook: [
      {
        step: 1,
        type: 'REPURPOSE',
        titleTh: 'นำฟุตเทจมาตัดเป็น 9:16 Video Reel สั้น 15 วินาที',
        titleEn: 'Cut footage into a 15s 9:16 vertical Reel',
        actionTh: 'นำคลิปเจาะลึกเฉพาะอุปกรณ์บันทึกเสียงและเทคนิคจัดไฟ 3-Point Lighting มาตัดเป็นคลิปสั้นลง TikTok และ YouTube Shorts โดยใส่เสียงเพลง Lo-Fi Beats',
        actionEn: 'Extract 3-point lighting and audio gear highlights into short-form TikTok & Shorts clips paired with Lo-Fi beats.',
        expectedOutcomeTh: 'คาดการณ์ยอดวิวเพิ่มเติม 35,000 - 60,000 วิว ภายใน 48 ชั่วโมง',
        expectedOutcomeEn: 'Estimated 35,000 - 60,000 incremental views within 48 hours.',
      },
      {
        step: 2,
        type: 'AUDIENCE_EXPANSION',
        titleTh: 'สร้าง Custom Audience สำหรับยิงแคมเปญ Masterclass Edition',
        titleEn: 'Build Custom Audience for Masterclass Campaign',
        actionTh: 'ดึงคนที่ดูคลิปนี้เกิน 10 วินาที หรือคลิกลิงก์เว็บเป้าหมาย ไปทำเป็นกลุ่มเป้าหมาย Retargeting เชิญชวนลงทะเบียนรับคู่มือสรุปฉบับเต็ม Exclusive ประจำสัปดาห์นี้',
        actionEn: 'Retarget viewers with >10s watch time or link clicks, inviting them to download the full exclusive weekly playbook.',
        expectedOutcomeTh: 'เพิ่มอัตรา Lead Conversion ลงทะเบียนรับชมได้ 12 - 18 ราย',
        expectedOutcomeEn: 'Expected 12 - 18 verified subscriber conversions.',
      },
      {
        step: 3,
        type: 'CADENCE',
        titleTh: 'ตั้งคิวโพสต์ Follow-up ในวันพฤหัสบดีหน้า เวลา 19:30 PM',
        titleEn: 'Schedule Follow-up dispatch for next Thursday at 7:30 PM',
        actionTh: 'ปล่อยภาพบรรยากาศยามค่ำคืน ของยูนิตนี้ต่อเนื่อง เพื่อรักษาโมเมนตัมอัลกอริทึมของเพจ',
        actionEn: 'Publish Twilight Sunset sequence photos to maintain organic algorithm distribution momentum.',
        expectedOutcomeTh: 'รักษาอัตรา Engagement Rate ให้อยู่เหนือ 7.5% ต่อเนื่อง',
        expectedOutcomeEn: 'Sustained engagement rate above 7.5%.',
      },
    ],
  },
  'post-acme-1': {
    postId: 'post-acme-1',
    postTitle: 'Studio Redesign Tour Master Cut ($45K Setup)',
    workspaceName: 'Creator Hub',
    platform: 'YOUTUBE',
    views: 248000,
    likes: 18900,
    comments: 1120,
    shares: 4200,
    clicks: 2100,
    engagementRate: '9.8%',
    overallSuccessScore: 98,
    executiveSummaryTh: 'วิดีโอนี้ได้ยอดวิวทะลุ 2.4 แสนวิว จากพลังของ Hook ใน 3 วินาทีแรกที่บอกตัวเลขงบประมาณ $45,000 ชัดเจน ทำให้เกิดข้อถกเถียงและคอมเมนต์ถามพิกัดอุปกรณ์อย่างล้นหลาม',
    executiveSummaryEn: 'Video exceeded 248K views driven by a potent 3-second hook stating the $45K budget, sparking vibrant discussion and gear inquiries in comments.',
    isMockData: true,
    generatedByModel: 'RetzPost AI Attribution Engine (Simulated v2.4)',
    attributionDrivers: [
      {
        category: 'VISUAL',
        categoryLabelTh: 'พลัง Hook 3 วินาทีแรก',
        categoryLabelEn: '3-Second Hook Power',
        icon: '⚡',
        titleTh: 'ก่อน-หลัง รีโนเวทแบบ Jump Cut รวดเร็ว',
        titleEn: 'Rapid before-and-after jump cut renovation sequence',
        descriptionTh: 'อัตรา Retention ในช่วง 15 วินาทีแรกสูงถึง 86% คนดูไม่ออกจากคลิป อัลกอริทึม YouTube Shorts จึงดันคลิปเข้าหน้า Feed ผู้ใช้กว้างขึ้น',
        descriptionEn: 'First 15-second retention reached 86%, prompting the Shorts algorithm to push the video to broader audiences.',
        impactScore: 98,
        metricHighlight: '86% 15s Retention Rate',
      },
      {
        category: 'ALGORITHM',
        categoryLabelTh: 'การเร่งรอบ Re-watch ของอัลกอริทึม',
        categoryLabelEn: 'Algorithmic Re-watch Loop',
        icon: '🔄',
        titleTh: 'จบคลิปแบบ Perfect Loop วนกลับมาเริ่มต้นเนียนตา',
        titleEn: 'Seamless end-to-beginning loop transition',
        descriptionTh: 'คนดูเฉลี่ย 1.6 รอบต่อคน ทำให้ระบบ Shorts ส่งต่อไปยังผู้ชมในต่างประเทศโดยอัตโนมัติ',
        descriptionEn: 'Audience averaged 1.6 re-watches per viewer, prompting automated cross-regional algorithmic recommendations.',
        impactScore: 96,
        metricHighlight: '1.6x Average Re-watch Ratio',
      },
      {
        category: 'COPYWRITING',
        categoryLabelTh: 'ตัวเลขงบประมาณกระตุ้นความอยากรู้',
        categoryLabelEn: 'Budget Hook & Curiosity Trigger',
        icon: '💡',
        titleTh: 'ระบุราคา $45,000 ทำให้เกิด Social Proof ชัดเจน',
        titleEn: 'Disclosing $45,000 budget established strong social proof',
        descriptionTh: 'คนดูเกิดการเปรียบเทียบความคุ้มค่า และสอบถามแบรนด์สินค้าในคอมเมนต์กว่า 1,120 ข้อความ',
        descriptionEn: 'Viewers engaged in cost-benefit debates and inquired about equipment across 1,120 comments.',
        impactScore: 92,
        metricHighlight: '1,120 Comments Dispatched',
      },
    ],
    actionablePlaybook: [
      {
        step: 1,
        type: 'REPURPOSE',
        titleTh: 'สร้าง Carousel Infographic สรุปพิกัดของแต่งห้อง',
        titleEn: 'Create Carousel Infographic detailing gear list',
        actionTh: 'นำภาพนิ่งของโต๊ะ ขาตั้งจอ และไฟสตูดิโอ มาทำเป็น Album 5 ภาพลง Instagram Feed พร้อมแปะรหัสส่วนลด',
        actionEn: 'Transform desk, monitor arm, and light photos into a 5-slide Instagram carousel with partner promo codes.',
        expectedOutcomeTh: 'ดันยอด Saves ใน Instagram เพิ่มขึ้น 2,000+ ครั้ง',
        expectedOutcomeEn: 'Estimated 2,000+ incremental Instagram saves.',
      },
      {
        step: 2,
        type: 'A_B_TEST',
        titleTh: 'ทำคลิปเปรียบเทียบ "ไฟราคา $100 vs $1,000"',
        titleEn: 'Produce comparison clip: "$100 vs $1,000 Studio Lighting"',
        actionTh: 'แตกประเด็นย่อยจากคอมเมนต์ที่ถามเรื่องไฟสตูดิโอ มาทำคอนเทนต์ตอนต่อไปในสัปดาห์นี้',
        actionEn: 'Address lighting questions raised in comments with a standalone episode this week.',
        expectedOutcomeTh: 'ดึงยอดวิวจากฐานแฟนคลับเดิมได้ทันที 80,000+ วิว',
        expectedOutcomeEn: 'Expected 80,000+ immediate views from loyal subscriber base.',
      },
    ],
  },
  'post-c1-2': {
    postId: 'post-c1-2',
    postTitle: 'Sukhumvit Sky Pool Twilight Highlight',
    workspaceName: 'Main Studio',
    platform: 'INSTAGRAM',
    views: 185000,
    likes: 14200,
    comments: 680,
    shares: 3100,
    clicks: 1420,
    engagementRate: '8.8%',
    overallSuccessScore: 94,
    executiveSummaryTh: 'ได้รับ Engagement สูงจากการใช้ฟอร์แมต Carousel ภาพสลับมุมมอง และการแนบ Interactive Link Sticker ในตำแหน่งที่ผู้ใช้ถนัดมือ',
    executiveSummaryEn: 'Achieved high engagement via alternating multi-angle Carousel format and ergonomic interactive link sticker placement.',
    isMockData: true,
    generatedByModel: 'RetzPost AI Attribution Engine (Simulated v2.4)',
    attributionDrivers: [
      {
        category: 'PLACEMENT',
        categoryLabelTh: 'Link Sticker Positioning',
        categoryLabelEn: 'Link Sticker Positioning',
        icon: '🎯',
        titleTh: 'สติกเกอร์อยู่กึ่งกลางด้านล่างใน Safe Zone',
        titleEn: 'Sticker positioned center-bottom within Safe Zone',
        descriptionTh: 'ไม่มีส่วนใดของ UI อินสตาแกรมมาบดบัง ทำให้ผู้ติดตามแตะดูลิงก์ห้องตัวอย่างได้ง่ายดาย',
        descriptionEn: 'Zero overlap with native Instagram UI elements, allowing followers to easily tap the preview suite link.',
        impactScore: 93,
        metricHighlight: 'CTR 4.8% on IG Story',
      },
      {
        category: 'VISUAL',
        categoryLabelTh: 'Twilight Gradient Color Harmony',
        categoryLabelEn: 'Twilight Gradient Color Harmony',
        icon: '🎨',
        titleTh: 'โทนสีท้องฟ้ายามเย็นกระตุ้นความรู้สึกผ่อนคลายหรูหรา',
        titleEn: 'Evening sky tones convey luxurious relaxation',
        descriptionTh: 'โทนสีน้ำเงินครามตัดทองส้ม ดึงดูดสายตาบนหน้า Feed ที่ส่วนใหญ่เป็นสีขาวสว่าง',
        descriptionEn: 'Deep twilight blues against golden amber stood out distinctly against bright feeds.',
        impactScore: 94,
        metricHighlight: '14.2K Likes (7.7% Like Rate)',
      },
    ],
    actionablePlaybook: [
      {
        step: 1,
        type: 'CADENCE',
        titleTh: 'จัดตารางโพสต์ซีรีส์ "Twilight Architecture" ทุกวันศุกร์',
        titleEn: 'Schedule "Twilight Architecture" recurring Friday series',
        actionTh: 'สร้างแคมเปญประจำสัปดาห์เน้นคอนเทนต์พรีเมียม เพื่อสร้างการจดจำแบรนด์ให้องค์กร',
        actionEn: 'Establish a weekly recurring premium feature to reinforce brand recognition.',
        expectedOutcomeTh: 'เพิ่ม Follower ใหม่ออร์แกนิก 450 - 600 บัญชีต่อสัปดาห์',
        expectedOutcomeEn: 'Expected 450 - 600 organic new followers per week.',
      },
    ],
  },
};

export function getPostDiagnosis(postId: string, fallbackTitle?: string): PostDiagnosisInsight {
  if (MOCK_POST_DIAGNOSES[postId]) {
    return MOCK_POST_DIAGNOSES[postId];
  }

  // Fallback dynamic generator for any post
  const title = fallbackTitle || 'คอนเทนต์เผยแพร่สด';
  return {
    postId,
    postTitle: title,
    workspaceName: 'Main Studio',
    platform: 'FACEBOOK',
    views: 94000,
    likes: 6200,
    comments: 310,
    shares: 1420,
    clicks: 890,
    engagementRate: '8.4%',
    overallSuccessScore: 92,
    executiveSummaryTh: `การวิเคราะห์สำหรับ "${title}": คอนเทนต์นี้มีสัญญาณเชิงบวกสูงด้านเวลาปล่อยโพสต์และอัตราการแชร์ต่อ แนะนำให้นำเนื้อหาไปตัดต่อเป็นคลิปสั้นสำหรับ Reels/Shorts เพื่อขยายการเข้าถึงเพิ่มเติม`,
    executiveSummaryEn: `Analysis for "${title}": This dispatch demonstrates strong positive signals in dispatch timing and share velocity. Repurposing into short-form Reels/Shorts is recommended to expand reach.`,
    isMockData: true,
    generatedByModel: 'RetzPost AI Attribution Engine (Simulated Fallback)',
    attributionDrivers: [
      {
        category: 'TIMING',
        categoryLabelTh: 'ช่วงเวลาที่เหมาะสม',
        categoryLabelEn: 'Optimal Timing Window',
        icon: '⏰',
        titleTh: 'ตรงกับพฤติกรรมกลุ่มเป้าหมาย',
        titleEn: 'Aligned with Audience Active Peak',
        descriptionTh: 'ส่งโพสต์ในช่วงเวลาที่มีอัตราการเปิดอ่านสูง ส่งผลให้อัลกอริทึมกระจายโพสต์ได้อย่างมีประสิทธิภาพ',
        descriptionEn: 'Dispatched during peak active engagement window, maximizing algorithmic feed distribution.',
        impactScore: 91,
        metricHighlight: '+35% Initial Impressions',
      },
      {
        category: 'COPYWRITING',
        categoryLabelTh: 'โครงสร้างเนื้อหา',
        categoryLabelEn: 'Content Structure & Clarity',
        icon: '✍️',
        titleTh: 'ข้อมูลครบถ้วน ชัดเจน และมี Call-to-Action',
        titleEn: 'Clear information hierarchy with distinct CTA',
        descriptionTh: 'การแบ่งข้อย่อยและระบุช่องทางติดต่อ ทำให้ผู้อ่านตัดสินใจทักสอบถามได้ง่าย',
        descriptionEn: 'Clear bullet points and defined contact points lowered friction for direct customer inquiries.',
        impactScore: 89,
        metricHighlight: '310 Comments / Direct Inquiries',
      },
    ],
    actionablePlaybook: [
      {
        step: 1,
        type: 'REPURPOSE',
        titleTh: 'ต่อยอดเป็น 24h Story พร้อม Link Sticker',
        titleEn: 'Repurpose into 24h Story with Link Sticker',
        actionTh: 'นำจุดเด่น 3 ข้อมาทำ Story สรุปสั้นๆ และแปะลิงก์ตรงไปยังหน้าเว็บเป้าหมาย',
        actionEn: 'Synthesize top 3 highlights into a brief Story sequence with a direct target link sticker.',
        expectedOutcomeTh: 'คาดการณ์ยอดคลิกเพิ่ม 250 - 400 Clicks',
        expectedOutcomeEn: 'Projected 250 - 400 incremental link clicks.',
      },
    ],
  };
}
