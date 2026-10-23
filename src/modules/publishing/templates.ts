export type TemplateCategory = 'REAL_ESTATE' | 'PROMOTION' | 'PRODUCT_LAUNCH' | 'INSIGHTS' | 'CUSTOM' | string;

export interface PostTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  categoryLabel: string;
  title: string;
  caption: string;
  tags: string;
  storyLink?: string;
  isBuiltIn: boolean;
  updatedAt?: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  REAL_ESTATE: 'อสังหาริมทรัพย์',
  PROMOTION: 'โปรโมชั่น',
  PRODUCT_LAUNCH: 'เปิดตัวสินค้า',
  INSIGHTS: 'บทวิเคราะห์',
  CUSTOM: 'เทมเพลตของฉัน',
};

export const BUILT_IN_TEMPLATES: PostTemplate[] = [
  {
    id: 'tpl-c1-luxury-condo',
    name: '🏢 คอนโดหรูติด BTS (Capital One Deal)',
    category: 'REAL_ESTATE',
    categoryLabel: 'อสังหาริมทรัพย์',
    title: '[HOT DEAL] ขาย/ให้เช่าคอนโดหรูใจกลางสุขุมวิท พร้อมเข้าอยู่',
    caption: `✨ ปล่อยเช่า/ขาย คอนโดมิเนียมหรู ทำเลทองใจกลางเมือง\n\n🏢 รายละเอียดห้อง:\n• ขนาดห้อง: 35 ตร.ม. 1 ห้องนอน 1 ห้องน้ำ\n• ชั้น 18 วิวเมืองโปร่งโล่ง ไม่มีตึกบัง\n• เฟอร์นิเจอร์ Built-in สไตล์โมเดิร์น พร้อมเครื่องใช้ไฟฟ้าครบชุด\n\n🚆 การเดินทางสะดวกสบาย:\n• ใกล้ BTS เพียง 250 เมตร\n• ใกล้จุดขึ้นลงทางด่วน และห้างสรรพสินค้าชั้นนำ\n\n💰 ราคาพิเศษเพียง 4.29 ล้านบาท (หรือเช่า 18,500 บาท/เดือน)\n\n📲 สนใจนัดชมห้องจริงหรือสอบถามข้อมูลเพิ่มเติม:\nTel: 02-XXX-XXXX / Line: @capitalone`,
    tags: 'คอนโดติดbts, คอนโดหรู, อสังหาริมทรัพย์, CapitalOne, SukhumvitLiving',
    storyLink: 'https://line.me/ti/p/@capitalone',
    isBuiltIn: true,
  },
  {
    id: 'tpl-c1-penthouse-luxury',
    name: '🏰 The Penthouse Collection (KW Luxury)',
    category: 'REAL_ESTATE',
    categoryLabel: 'อสังหาริมทรัพย์',
    title: 'The Ultimate Penthouse Living: Private Pool & Panoramic View',
    caption: `Experience sheer exclusivity at The Penthouse Collection.\n\nKey Highlights:\n- 180 sqm Duplex Penthouse with Private Sky Pool\n- 3 Bedrooms, 4 Bathrooms with Marble Finishes\n- Unobstructed 360-degree skyline views of Bangkok\n\nListed exclusively by Keller Williams & Capital One Luxury.\nPrivate inspection by appointment only.\nDirect inquiry: +66 (0) 2-XXX-XXXX`,
    tags: 'KWLuxury, PenthouseBangkok, LuxuryRealEstate, ThailandDreamHome',
    storyLink: 'https://capitalone.co.th/penthouse-collection',
    isBuiltIn: true,
  },
  {
    id: 'tpl-flash-sale',
    name: '⚡ Flash Sale & ส่วนลดพิเศษจำกัดเวลา',
    category: 'PROMOTION',
    categoryLabel: 'โปรโมชั่น',
    title: '⚡ FLASH SALE 48 ชั่วโมงเท่านั้น! ลดสูงสุด 50%',
    caption: `🔥 มอบสิทธิพิเศษเฉพาะผู้ติดตามเพจของเรา!\n\nรับส่วนลดพิเศษทันทีสูงสุด 50% สำหรับทุกรายการ\n📅 ระยะเวลาแคมเปญ: วันนี้ - วันอาทิตย์นี้เท่านั้น (หรือจนกว่าสิทธิ์จะเต็ม)\n\n⚠️ ด่วน! โค้ดส่วนลดและสิทธิ์มีจำนวนจำกัด\n\n👇 แตะปุ่มลิงก์ในสตอรี่เพื่อกดรับสิทธิ์และชมรายละเอียดโปรโมชั่นก่อนหมดเวลา`,
    tags: 'FlashSale, ExclusiveDeal, ส่วนลดพิเศษ, SpecialOffer, LimitedTime',
    storyLink: 'https://retzpost.io/promotions/flash-deal',
    isBuiltIn: true,
  },
  {
    id: 'tpl-product-launch',
    name: '🚀 Product Launch & Tech Announcement',
    category: 'PRODUCT_LAUNCH',
    categoryLabel: 'เปิดตัวสินค้า',
    title: '🚀 Introducing Next-Gen Multi-Placement Publishing Studio',
    caption: `Today we are thrilled to unveil our biggest leap forward in content distribution.\n\nWhat makes this different?\n• Simultaneous Feed, Story (24h), and Reels distribution from one canvas\n• Intelligent phone mockups with vertical 9:16 safe zones\n• Project-scoped automation with 1-click recipes\n\nUpload once. Adapt everywhere.\nRead our launch editorial and documentation at the link below.`,
    tags: 'ProductLaunch, MultiPost, CreatorEconomy, SaaS, Automation',
    storyLink: 'https://retzpost.io/whats-new',
    isBuiltIn: true,
  },
  {
    id: 'tpl-weekly-insights',
    name: '📊 Weekly Market Brief & Analysis',
    category: 'INSIGHTS',
    categoryLabel: 'บทวิเคราะห์',
    title: '📊 Weekly Dispatch: Social Platform Algorithm Shifts in 2026',
    caption: `สรุป 3 การเปลี่ยนแปลงสำคัญของ Social Algorithms สัปดาห์นี้ ที่ครีเอเตอร์และแบรนด์ควรรู้:\n\n1. การให้ค่าน้ำหนักกับ 24h Stories ที่มี Link Sticker ปฏิสัมพันธ์สูงขึ้น\n2. อัตรา Re-watch ของวิดีโอสั้น Reels/Shorts ภายใต้ความยาว 45 วินาที\n3. โครงสร้างอัลบั้มภาพแบบ Mixed Carousel ที่เพิ่มการบันทึก (Saves)\n\nคุณคิดเห็นอย่างไรกับทิศทางนี้? แลกเปลี่ยนกันได้ในคอมเมนต์ด้านล่างครับ 👇`,
    tags: 'WeeklyBrief, MarketTrends, SocialMediaStrategy, ContentGrowth',
    storyLink: 'https://retzpost.io/insights/2026-algorithms',
    isBuiltIn: true,
  },
];

const STORAGE_KEY = 'retzpost_all_templates';
const LEGACY_STORAGE_KEY = 'retzpost_custom_templates';

// In-memory fallback for SSR / testing environments
let inMemoryStore: Record<string, string> = {};

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: (key: string) => inMemoryStore[key] || null,
    setItem: (key: string, value: string) => {
      inMemoryStore[key] = value;
    },
    removeItem: (key: string) => {
      delete inMemoryStore[key];
    },
    clear: () => {
      inMemoryStore = {};
    },
  };
}

export function _clearTemplateStorageForTesting() {
  getStorage().clear();
}

/**
 * READ: Fetch all templates (with persistence and built-in fallback)
 */
export function getInitialTemplates(): PostTemplate[] {
  const storage = getStorage();
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: PostTemplate[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Check legacy storage
    const legacy = storage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const custom: PostTemplate[] = JSON.parse(legacy);
      const combined = [...custom, ...BUILT_IN_TEMPLATES];
      storage.setItem(STORAGE_KEY, JSON.stringify(combined));
      return combined;
    }

    // Default initialization
    storage.setItem(STORAGE_KEY, JSON.stringify(BUILT_IN_TEMPLATES));
  } catch {
    // fallback
  }
  return BUILT_IN_TEMPLATES;
}

/**
 * CREATE: Add a new template to the collection
 */
export function createTemplate(
  template: Omit<PostTemplate, 'id' | 'isBuiltIn' | 'categoryLabel'> & { categoryLabel?: string }
): PostTemplate {
  const storage = getStorage();
  const categoryLabel = template.categoryLabel || CATEGORY_LABELS[template.category] || 'เทมเพลตของฉัน';
  const newTpl: PostTemplate = {
    ...template,
    id: `tpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    categoryLabel,
    isBuiltIn: false,
    updatedAt: new Date().toISOString(),
  };

  try {
    const current = getInitialTemplates();
    const updated = [newTpl, ...current];
    storage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore quota
  }

  return newTpl;
}

/**
 * Alias for backward compatibility
 */
export function saveCustomTemplate(
  template: Omit<PostTemplate, 'id' | 'isBuiltIn' | 'category' | 'categoryLabel'> & {
    category?: TemplateCategory;
    categoryLabel?: string;
  }
): PostTemplate {
  return createTemplate({
    ...template,
    category: template.category || 'CUSTOM',
    categoryLabel: template.categoryLabel || 'เทมเพลตของฉัน',
  });
}

/**
 * UPDATE: Update an existing template by id
 */
export function updateTemplate(
  id: string,
  updates: Partial<Omit<PostTemplate, 'id'>>
): PostTemplate | null {
  const storage = getStorage();
  try {
    const list = getInitialTemplates();
    const index = list.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const updatedCategory = updates.category || existing.category;
    const updatedLabel = updates.categoryLabel || (updates.category ? CATEGORY_LABELS[updates.category] : existing.categoryLabel);

    const updatedItem: PostTemplate = {
      ...existing,
      ...updates,
      category: updatedCategory,
      categoryLabel: updatedLabel || existing.categoryLabel,
      updatedAt: new Date().toISOString(),
      // If a built-in template is edited by user, it becomes a customized template
      isBuiltIn: false,
    };

    const nextList = [...list];
    nextList[index] = updatedItem;
    storage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    return updatedItem;
  } catch {
    return null;
  }
}

/**
 * DUPLICATE: Clone an existing template
 */
export function duplicateTemplate(id: string): PostTemplate | null {
  const storage = getStorage();
  try {
    const list = getInitialTemplates();
    const target = list.find((t) => t.id === id);
    if (!target) return null;

    const clone: PostTemplate = {
      ...target,
      id: `tpl-copy-${Date.now()}`,
      name: `${target.name} (สำเนา)`,
      isBuiltIn: false,
      category: target.category === 'REAL_ESTATE' || target.category === 'PROMOTION' ? target.category : 'CUSTOM',
      categoryLabel: target.categoryLabel || 'เทมเพลตของฉัน',
      updatedAt: new Date().toISOString(),
    };

    const updated = [clone, ...list];
    storage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return clone;
  } catch {
    return null;
  }
}

/**
 * DELETE: Delete a template by id
 */
export function deleteTemplate(id: string): boolean {
  const storage = getStorage();
  try {
    const list = getInitialTemplates();
    const filtered = list.filter((t) => t.id !== id);
    if (filtered.length === list.length) return false;

    storage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/**
 * Alias for backward compatibility
 */
export function deleteCustomTemplate(id: string): void {
  deleteTemplate(id);
}

/**
 * RESET: Reset all templates back to system defaults
 */
export function resetTemplatesToDefault(): PostTemplate[] {
  const storage = getStorage();
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(BUILT_IN_TEMPLATES));
    storage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore
  }
  return BUILT_IN_TEMPLATES;
}
