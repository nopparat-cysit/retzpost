/**
 * RETZPOST PRICING PLANS & TOKEN ECONOMY
 * 
 * Defines commercial pricing tiers for the Thai market (THB),
 * 7-Day Free Trial & Post-Trial Promos (25% off 3mo / 35% off 1yr / standard 25% yearly),
 * Master Token Wallet allocations & consumption rates, Theme presets, and Tax (VAT 7%) calculations.
 */

export type PlanTier = 'STARTER' | 'SOLO' | 'CREATOR' | 'STUDIO_PRO' | 'AGENCY';
export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type ThemePreset = 'NEWSPRINT' | 'MIDNIGHT' | 'MATCHA' | 'TERRACOTTA' | 'INDIGO';
export type PromoType = 'STANDARD' | 'POST_TRIAL_MONTHLY_3MO' | 'POST_TRIAL_YEARLY_1YR';

export interface PlanFeature {
  labelTh: string;
  labelEn?: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingPlan {
  id: PlanTier;
  nameTh: string;
  nameEn: string;
  taglineTh: string;
  taglineEn?: string;
  monthlyPriceThb: number;
  yearlyPriceThb: number; // 25% discount (pay 9 months)
  monthlyEquivalentThb: number; // yearly / 12
  monthlyTokens: number;
  maxRolloverTokens: number;
  workspacesLimit: number;
  channelsLimit: number;
  teamMembersLimit: number;
  unlimitedPosts: boolean;
  monthlyPostsLimit?: number;
  supportedThemes: ThemePreset[];
  has7DayTrial?: boolean;
  trialDays?: number;
  badge?: string;
  isPopular?: boolean;
  features: PlanFeature[];
}

export interface TokenTopupPack {
  id: 'PACK_S' | 'PACK_M' | 'PACK_L';
  nameTh: string;
  nameEn?: string;
  tokens: number;
  priceThb: number;
  pricePerToken: number;
  badge?: string;
}

export interface ThemeConfig {
  id: ThemePreset;
  nameTh: string;
  nameEn: string;
  descriptionTh: string;
  descriptionEn?: string;
  primaryColor: string;
  bgPreview: string;
  badge: string;
  minPlan: PlanTier;
}

// -----------------------------------------------------------------------------
// 1. SUBSCRIPTION PLANS FOR THAI MARKET (0 / 79 / 199 / 599 / 1,490 THB)
// -----------------------------------------------------------------------------
export const PRICING_PLANS: Record<PlanTier, PricingPlan> = {
  STARTER: {
    id: 'STARTER',
    nameTh: 'Starter Press (แผนเริ่มต้น)',
    nameEn: 'Starter Press',
    taglineTh: 'สำหรับมือใหม่ทดลองระบบจริง ฟรีตลอดชีพ',
    taglineEn: 'For beginners testing the newsroom, free forever',
    monthlyPriceThb: 0,
    yearlyPriceThb: 0,
    monthlyEquivalentThb: 0,
    monthlyTokens: 30,
    maxRolloverTokens: 30,
    workspacesLimit: 1,
    channelsLimit: 2,
    teamMembersLimit: 1,
    unlimitedPosts: false,
    monthlyPostsLimit: 10,
    supportedThemes: ['NEWSPRINT'],
    features: [
      { labelTh: '1 Workspace พื้นที่ทำงานหลัก', labelEn: '1 Primary Workspace', included: true },
      { labelTh: 'เชื่อมต่อโซเชียล 2 ช่องทาง', labelEn: '2 Connected Social Channels', included: true },
      { labelTh: 'โควต้าโพสต์ 10 ครั้งต่อเดือน', labelEn: '10 Scheduled Dispatches / Month', included: true },
      { labelTh: '30 Master Tokens / เดือน (รีเซ็ตทุกเดือน)', labelEn: '30 Master Tokens / Month (Monthly Reset)', included: true },
      { labelTh: 'ธีมคลาสสิก Classic Newsprint (กระดาษครีม)', labelEn: 'Classic Newsprint Theme', included: true },
      { labelTh: 'แปะลิงก์ Story 24h & ตั้งเวลาล่วงหน้า', labelEn: '24h Story Link & Advance Scheduling', included: false },
      { labelTh: 'ระบบตรวจอนุมัติงานและสิทธิ์ทีมงาน (RBAC)', labelEn: 'Editorial Approval & Role Permissions (RBAC)', included: false },
      { labelTh: 'ดึงโพสต์กลับฉุกเฉิน (Emergency API Revoke)', labelEn: 'Emergency API Post Revocation', included: false },
    ],
  },
  SOLO: {
    id: 'SOLO',
    nameTh: 'Solo Press (ครีเอเตอร์ลุยเดี่ยว)',
    nameEn: 'Solo Press',
    taglineTh: 'สำหรับพ่อค้าแม่ค้าออนไลน์ และครีเอเตอร์เดี่ยว ถูกกว่ากาแฟ 1 แก้ว',
    taglineEn: 'For solopreneurs and independent creators, cheaper than a cup of coffee',
    monthlyPriceThb: 79,
    yearlyPriceThb: 711, // 79 * 9 = 711 (~25% off)
    monthlyEquivalentThb: 59,
    monthlyTokens: 150,
    maxRolloverTokens: 300,
    workspacesLimit: 1,
    channelsLimit: 5,
    teamMembersLimit: 1,
    unlimitedPosts: true,
    supportedThemes: ['NEWSPRINT', 'MIDNIGHT'],
    has7DayTrial: true,
    trialDays: 7,
    badge: 'ทดลองฟรี 7 วันแรก!',
    features: [
      { labelTh: 'ทดลองใช้ฟรี 7 วันเต็ม (ไม่มีค่าใช้จ่ายวันนี้)', labelEn: '7-Day Full Free Trial (฿0 Charged Today)', included: true, highlight: true },
      { labelTh: '1 Workspace สำหรับลุยเดี่ยวคนเดียว', labelEn: '1 Independent Creator Workspace', included: true },
      { labelTh: 'เชื่อมต่อได้ 5 ช่องทางโซเชียล', labelEn: '5 Connected Social Channels', included: true },
      { labelTh: 'โพสต์และตั้งเวลาล่วงหน้าได้ไม่จำกัด', labelEn: 'Unlimited Dispatches & Advance Scheduling', included: true, highlight: true },
      { labelTh: '150 Master Tokens ต่อเดือน (ทบได้สูงสุด 300 🪙)', labelEn: '150 Master Tokens / Month (Rollover up to 300 🪙)', included: true },
      { labelTh: 'แปะลิงก์ IG & Facebook Story 24h', labelEn: 'IG & Facebook 24h Story Link Stamping', included: true },
      { labelTh: 'ปลดล็อกธีมโหมดมืด Midnight Gazette (Dark Mode)', labelEn: 'Midnight Gazette Dark Mode Theme', included: true },
      { labelTh: 'ระบบตรวจอนุมัติงานและสิทธิ์ทีมงาน', labelEn: 'Editorial Approval & Role Permissions', included: false },
    ],
  },
  CREATOR: {
    id: 'CREATOR',
    nameTh: 'Creator Team (ทีมงานขนาดเล็ก & ร้านค้าออนไลน์)',
    nameEn: 'Creator Team',
    taglineTh: 'ตอบโจทย์ร้านค้าออนไลน์ที่มีทีมไม่เกิน 5 คน แบงก์ร้อยสองใบมีทอน',
    taglineEn: 'For small social teams & online brands up to 5 members',
    monthlyPriceThb: 199,
    yearlyPriceThb: 1791, // 199 * 9 = 1791 (~25% off)
    monthlyEquivalentThb: 149,
    monthlyTokens: 600,
    maxRolloverTokens: 1200,
    workspacesLimit: 3,
    channelsLimit: 15,
    teamMembersLimit: 5, // 5 SEATS for <= 5 people!
    unlimitedPosts: true,
    supportedThemes: ['NEWSPRINT', 'MIDNIGHT', 'MATCHA', 'TERRACOTTA'],
    badge: 'คุ้มค่าที่สุด • ทีม 2-5 คน',
    isPopular: true,
    features: [
      { labelTh: 'ทีมงานสูงสุด 5 คน (Owner 1 + แอดมิน/คนตัดต่อ 4)', labelEn: 'Up to 5 Team Members (1 Owner + 4 Staff)', included: true, highlight: true },
      { labelTh: '3 Workspaces แยกโปรเจกต์หรือหลายแบรนด์', labelEn: '3 Workspaces for Multiple Brands/Projects', included: true },
      { labelTh: 'เชื่อมต่อโซเชียลได้สูงสุด 15 ช่องทาง', labelEn: 'Up to 15 Connected Social Channels', included: true },
      { labelTh: 'โพสต์และตั้งเวลาได้ไม่จำกัดตลอดทั้งเดือน', labelEn: 'Unlimited Dispatches & Scheduling All Month', included: true },
      { labelTh: '600 Master Tokens ต่อเดือน (ทบได้สูงสุด 1,200 🪙)', labelEn: '600 Master Tokens / Month (Rollover up to 1,200 🪙)', included: true, highlight: true },
      { labelTh: 'กระเป๋าแม่ Master Wallet ใช้ได้ทุก Workspace', labelEn: 'Unified Master Wallet Across Workspaces', included: true, highlight: true },
      { labelTh: 'ระบบตรวจอนุมัติโพสต์และสิทธิ์ทีมงาน (RBAC 4 ระดับ)', labelEn: '4-Tier Editorial Approval & Team RBAC', included: true },
      { labelTh: 'ระบบติดตามการใช้ Token ของลูกทีมรายบุคคล', labelEn: 'Per-Member Token Usage Auditing', included: true, highlight: true },
      { labelTh: 'ปลดล็อก 4 ธีม (Newsprint, Midnight, Matcha, Terracotta)', labelEn: '4 Unlocked Themes (Newsprint, Midnight, Matcha, Terracotta)', included: true },
    ],
  },
  STUDIO_PRO: {
    id: 'STUDIO_PRO',
    nameTh: 'Studio Pro (สตูดิโอ & แบรนด์หลายสาขา)',
    nameEn: 'Studio Pro',
    taglineTh: 'สำหรับทีมมีเดีย สตูดิโอโปรดักชั่น และร้านค้าที่มีหลายสาขา',
    taglineEn: 'For media teams, production studios & multi-branch brands',
    monthlyPriceThb: 599,
    yearlyPriceThb: 5391, // 599 * 9 = 5391 (~25% off)
    monthlyEquivalentThb: 449,
    monthlyTokens: 2500,
    maxRolloverTokens: 5000,
    workspacesLimit: 10,
    channelsLimit: 40,
    teamMembersLimit: 15,
    unlimitedPosts: true,
    supportedThemes: ['NEWSPRINT', 'MIDNIGHT', 'MATCHA', 'TERRACOTTA', 'INDIGO'],
    features: [
      { labelTh: '10 Workspaces แยกตามแบรนด์หรือสาขา', labelEn: '10 Workspaces for Multi-Brand Branches', included: true },
      { labelTh: 'เชื่อมต่อได้สูงสุด 40 ช่องทางโซเชียล', labelEn: 'Up to 40 Connected Social Channels', included: true },
      { labelTh: 'ทีมงานสูงสุด 15 คน แยกสิทธิ์ตามพื้นที่ทำงาน', labelEn: 'Up to 15 Members with Workspace Scoping', included: true, highlight: true },
      { labelTh: '2,500 Master Tokens ต่อเดือน (ทบได้สูงสุด 5,000 🪙)', labelEn: '2,500 Master Tokens / Month (Rollover up to 5,000 🪙)', included: true },
      { labelTh: 'ระบบวิเคราะห์สถิติคนดู 5 ชั้น + AI Diagnosis ละเอียด', labelEn: '5-Layer Audience Analytics & Deep AI Diagnosis', included: true },
      { labelTh: 'ประเมินเกรด KPI ทีมงานรายบุคคล + พิมพ์ Evaluation Slip', labelEn: 'Individual Staff KPI Grading & Slip Printing', included: true },
      { labelTh: 'ดึงโพสต์กลับฉุกเฉิน (Emergency API Revoke & Delete)', labelEn: 'Emergency API Post Revocation & Deletion', included: true, highlight: true },
      { labelTh: 'ปลดล็อกครบ 5 ธีมพรีเมียม (รวม Royal Indigo Executive)', labelEn: 'All 5 Themes Unlocked (incl. Royal Indigo)', included: true },
    ],
  },
  AGENCY: {
    id: 'AGENCY',
    nameTh: 'Agency Syndicate (เอเจนซี่ & องค์กรใหญ่)',
    nameEn: 'Agency Syndicate',
    taglineTh: 'สำหรับดิจิทัลเอเจนซี่ที่ดูแลลูกค้าหลายสิบแบรนด์ และองค์กรขนาดใหญ่',
    taglineEn: 'For digital agencies managing dozens of brands and enterprises',
    monthlyPriceThb: 1490,
    yearlyPriceThb: 13410, // 1490 * 9 = 13410 (~25% off)
    monthlyEquivalentThb: 1118,
    monthlyTokens: 8000,
    maxRolloverTokens: 16000,
    workspacesLimit: 30,
    channelsLimit: 100,
    teamMembersLimit: 50,
    unlimitedPosts: true,
    supportedThemes: ['NEWSPRINT', 'MIDNIGHT', 'MATCHA', 'TERRACOTTA', 'INDIGO'],
    badge: 'สำหรับมืออาชีพ & เอเจนซี่',
    features: [
      { labelTh: '30 Workspaces แยกพื้นที่ตามแบรนด์ลูกค้าเด็ดขาด', labelEn: '30 Isolated Workspaces for Client Brands', included: true, highlight: true },
      { labelTh: 'เชื่อมต่อได้สูงสุด 100 ช่องทางโซเชียล', labelEn: 'Up to 100 Connected Social Channels', included: true },
      { labelTh: 'ทีมงานสูงสุด 50 คน แยกสิทธิ์ตามโปรเจกต์', labelEn: 'Up to 50 Team Members with Scoped Roles', included: true },
      { labelTh: '8,000 Master Tokens ต่อเดือน + ส่วนลดซื้อ Token เพิ่ม 30%', labelEn: '8,000 Master Tokens / Mo + 30% Off Token Top-ups', included: true, highlight: true },
      { labelTh: 'White-Label Report Header (ใส่โลโก้เอเจนซี่บนรายงาน PDF/CSV)', labelEn: 'White-Label Reports (Custom Agency Branding)', included: true, highlight: true },
      { labelTh: 'Priority Queue Serverless Execution ยิงโพสต์ด่วนพิเศษ', labelEn: 'Priority Serverless Publishing Queue', included: true },
      { labelTh: 'ระบบเก็บประวัติจราจรคอมพิวเตอร์และ Audit Trail 90 วันตาม พ.ร.บ.', labelEn: '90-Day Computer Traffic & Compliance Audit Trail', included: true },
      { labelTh: 'Dedicated Onboarding & Account Manager ประจำตัว', labelEn: 'Dedicated Onboarding & Account Manager', included: true },
    ],
  },
};

// -----------------------------------------------------------------------------
// 2. TOKEN ECONOMY & TOP-UP PACKS
// -----------------------------------------------------------------------------
export const TOKEN_RATES = {
  AI_POST_DIAGNOSIS: 5,     // วิเคราะห์ว่าทำไมโพสต์ถึงปัง
  AI_KPI_COACHING: 10,      // ให้ AI ร่างคำชมและแผนโค้ชชิ่งลูกทีม
  FORCE_SYNC_NOW: 2,        // สั่งดึงยอดวิวสดทันทีนอกรอบระฆัง
  SMART_AUTOFRAME: 5,       // ดัดแปลงภาพ/วิดีโอให้เข้ากับ Story 9:16 อัตโนมัติ
};

export const TOKEN_TOPUP_PACKS: TokenTopupPack[] = [
  {
    id: 'PACK_S',
    nameTh: 'Press Token Pack S (300 🪙)',
    nameEn: 'Starter Spark Pack',
    tokens: 300,
    priceThb: 99,
    pricePerToken: 0.33,
  },
  {
    id: 'PACK_M',
    nameTh: 'Press Token Pack M (1,000 🪙)',
    nameEn: 'Growth Pulse Pack',
    tokens: 1000,
    priceThb: 259,
    pricePerToken: 0.259,
    badge: 'คุ้มค่าสุด • ขายดี',
  },
  {
    id: 'PACK_L',
    nameTh: 'Press Token Pack L (3,500 🪙)',
    nameEn: 'Agency Flood Pack',
    tokens: 3500,
    priceThb: 690,
    pricePerToken: 0.197,
    badge: 'สำหรับทีม & เอเจนซี่',
  },
];

// -----------------------------------------------------------------------------
// 3. THEME PRESETS & UNLOCK REQUIREMENTS
// -----------------------------------------------------------------------------
export const THEME_CONFIGS: Record<ThemePreset, ThemeConfig> = {
  NEWSPRINT: {
    id: 'NEWSPRINT',
    nameTh: 'Classic Newsprint (ครีมหนังสือพิมพ์)',
    nameEn: 'Classic Newsprint',
    descriptionTh: 'ธีมมาตรฐาน กลิ่นอายกระดาษหนังสือพิมพ์คลาสสิก อบอุ่น สบายตา',
    descriptionEn: 'Standard theme with a classic newsprint aesthetic, warm and easy on the eyes.',
    primaryColor: '#364165', // Indigo
    bgPreview: '#F3F0E8',
    badge: 'ฟรีทุกแพ็กเกจ',
    minPlan: 'STARTER',
  },
  MIDNIGHT: {
    id: 'MIDNIGHT',
    nameTh: 'Midnight Gazette (โหมดมืดถนอมสายตา)',
    nameEn: 'Midnight Gazette',
    descriptionTh: 'ธีมมืดตัดเส้นขอบสีเงินเข้ม เหมาะสำหรับทำงานกลางคืนและครีเอเตอร์สายเทค',
    descriptionEn: 'Dark theme with high-contrast silver borders, ideal for night work and tech creators.',
    primaryColor: '#8898AA',
    bgPreview: '#121214',
    badge: 'Solo ขึ้นไป',
    minPlan: 'SOLO',
  },
  MATCHA: {
    id: 'MATCHA',
    nameTh: 'Matcha Botanical (เขียวชาเขียว)',
    nameEn: 'Matcha Botanical',
    descriptionTh: 'สีเขียวธรรมชาติ ผ่อนคลาย เหมาะสำหรับแบรนด์สุขภาพ คาเฟ่ และไลฟ์สไตล์',
    descriptionEn: 'Relaxing botanical green, perfect for health brands, cafes, and lifestyle publishers.',
    primaryColor: '#1D6F42',
    bgPreview: '#F4F7F4',
    badge: 'Creator ขึ้นไป',
    minPlan: 'CREATOR',
  },
  TERRACOTTA: {
    id: 'TERRACOTTA',
    nameTh: 'Kyoto Terracotta (ส้มอิฐเผา)',
    nameEn: 'Kyoto Terracotta',
    descriptionTh: 'โทนสีดินเผาศิลปะร่วมสมัย เพิ่มพลังความกระตือรือร้นและคาแรกเตอร์พรีเมียม',
    descriptionEn: 'Contemporary ceramic tones that bring vibrant enthusiasm and premium editorial character.',
    primaryColor: '#A24836',
    bgPreview: '#FAEDE7',
    badge: 'Creator ขึ้นไป',
    minPlan: 'CREATOR',
  },
  INDIGO: {
    id: 'INDIGO',
    nameTh: 'Royal Indigo Executive (น้ำเงินครามองค์กร)',
    nameEn: 'Royal Indigo Executive',
    descriptionTh: 'โทนสีน้ำเงินกรมท่าระดับผู้บริหาร มั่นคง น่าเชื่อถือ สูงส่ง',
    descriptionEn: 'Executive deep navy palette offering distinguished trust, stability, and authority.',
    primaryColor: '#1E2B58',
    bgPreview: '#F4F5F9',
    badge: 'Studio Pro ขึ้นไป',
    minPlan: 'STUDIO_PRO',
  },
};

// -----------------------------------------------------------------------------
// 4. PLATFORM SETTINGS (ADMIN CONFIGURABLE DEFAULTS)
// -----------------------------------------------------------------------------
export interface PlatformSystemSettings {
  isTrialActive: boolean;
  trialDays: number;
  postTrialMonthlyDiscountRate: number; // 0.25 (25% off)
  postTrialMonthlyMonths: number; // 3 months
  postTrialYearlyDiscountRate: number; // 0.35 (35% off)
  postTrialYearlyYears: number; // 1 year
  standardYearlyDiscountRate: number; // 0.25 (25% off)
  defaultVatRate: number; // 0.07 (7%)
  welcomeTokens: number; // 30
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSystemSettings = {
  isTrialActive: true,
  trialDays: 7,
  postTrialMonthlyDiscountRate: 0.25,
  postTrialMonthlyMonths: 3,
  postTrialYearlyDiscountRate: 0.35,
  postTrialYearlyYears: 1,
  standardYearlyDiscountRate: 0.25,
  defaultVatRate: 0.07,
  welcomeTokens: 30,
};

// -----------------------------------------------------------------------------
// 5. HELPER FUNCTIONS & PROMO PRICING CALCULATIONS
// -----------------------------------------------------------------------------

/**
 * Calculates standard plan price according to chosen billing cycle (Standard 25% yearly discount)
 */
export function calculatePlanPrice(tier: PlanTier, cycle: BillingCycle): number {
  const plan = PRICING_PLANS[tier];
  if (!plan) return 0;
  return cycle === 'YEARLY' ? plan.yearlyPriceThb : plan.monthlyPriceThb;
}

/**
 * Calculates promotional pricing:
 * - STANDARD: normal monthly or normal 25% yearly
 * - POST_TRIAL_MONTHLY_3MO: 25% discount on monthly for first 3 months
 * - POST_TRIAL_YEARLY_1YR: 35% discount on yearly for year 1
 */
export function calculatePromotionalPrice(
  tier: PlanTier,
  cycle: BillingCycle,
  promoType: PromoType = 'STANDARD',
  settings: PlatformSystemSettings = DEFAULT_PLATFORM_SETTINGS
): {
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  promoDescriptionTh: string;
} {
  const plan = PRICING_PLANS[tier];
  if (!plan || plan.monthlyPriceThb === 0) {
    return {
      originalPrice: 0,
      discountedPrice: 0,
      discountRate: 0,
      promoDescriptionTh: 'แผนเริ่มต้น ฟรีตลอดชีพ',
    };
  }

  // Case 1: Post-trial 25% off monthly for 3 months
  if (promoType === 'POST_TRIAL_MONTHLY_3MO' && cycle === 'MONTHLY') {
    const original = plan.monthlyPriceThb;
    const rate = settings.postTrialMonthlyDiscountRate;
    const discounted = Math.round(original * (1 - rate));
    return {
      originalPrice: original,
      discountedPrice: discounted,
      discountRate: rate,
      promoDescriptionTh: `สิทธิ์พิเศษหลังทดลองครบ 7 วัน: ลด ${Math.round(rate * 100)}% นาน ${settings.postTrialMonthlyMonths} เดือนแรก (เหลือ ฿${discounted.toLocaleString()}/ด.)`,
    };
  }

  // Case 2: Post-trial 35% off yearly for year 1
  if (promoType === 'POST_TRIAL_YEARLY_1YR' && cycle === 'YEARLY') {
    const full12Months = plan.monthlyPriceThb * 12;
    const rate = settings.postTrialYearlyDiscountRate;
    const discounted = Math.round(full12Months * (1 - rate));
    return {
      originalPrice: full12Months,
      discountedPrice: discounted,
      discountRate: rate,
      promoDescriptionTh: `สิทธิ์พิเศษหลังทดลองครบ 7 วัน: ลด ${Math.round(rate * 100)}% สำหรับ 1 ปีแรก (เหลือ ฿${discounted.toLocaleString()}/ปี เฉลี่ย ฿${Math.round(discounted / 12).toLocaleString()}/ด.)`,
    };
  }

  // Case 3: Standard Yearly (25% off)
  if (cycle === 'YEARLY') {
    const full12Months = plan.monthlyPriceThb * 12;
    const discounted = plan.yearlyPriceThb;
    const rate = settings.standardYearlyDiscountRate;
    return {
      originalPrice: full12Months,
      discountedPrice: discounted,
      discountRate: rate,
      promoDescriptionTh: `ชำระรายปีประหยัด ${Math.round(rate * 100)}% (จ่าย 9 เดือน ได้ใช้งาน 12 เดือน)`,
    };
  }

  // Case 4: Standard Monthly
  return {
    originalPrice: plan.monthlyPriceThb,
    discountedPrice: plan.monthlyPriceThb,
    discountRate: 0,
    promoDescriptionTh: 'รอบชำระรายเดือนมาตรฐาน',
  };
}

/**
 * Calculates standard Thai VAT (7%) and total breakdown
 */
export function calculateVat(amountThb: number, vatRate = 0.07): {
  subtotal: number;
  vat: number;
  total: number;
  vatRateText: string;
} {
  const subtotal = Math.round(amountThb);
  const vat = Math.round(subtotal * vatRate);
  const total = subtotal + vat;
  return {
    subtotal,
    vat,
    total,
    vatRateText: `${(vatRate * 100).toFixed(0)}%`,
  };
}

/**
 * Checks if a theme is unlocked for a given plan tier
 */
export function isThemeUnlocked(theme: ThemePreset, userPlan: PlanTier): boolean {
  const planOrder: Record<PlanTier, number> = {
    STARTER: 1,
    SOLO: 2,
    CREATOR: 3,
    STUDIO_PRO: 4,
    AGENCY: 5,
  };
  const themeMinPlan = THEME_CONFIGS[theme]?.minPlan || 'STARTER';
  return (planOrder[userPlan] || 1) >= (planOrder[themeMinPlan] || 1);
}

/**
 * Checks if user has enough tokens for an activity
 */
export function canAffordTokens(currentBalance: number, activity: keyof typeof TOKEN_RATES): boolean {
  return currentBalance >= TOKEN_RATES[activity];
}
