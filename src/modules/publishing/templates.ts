export interface PostTemplate {
  id: string;
  name: string;
  category: 'REAL_ESTATE' | 'PROMOTION' | 'PRODUCT_LAUNCH' | 'INSIGHTS' | 'CUSTOM';
  categoryLabel: string;
  title: string;
  caption: string;
  tags: string;
  storyLink?: string;
  isBuiltIn: boolean;
}

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

export function getInitialTemplates(): PostTemplate[] {
  if (typeof window === 'undefined') return BUILT_IN_TEMPLATES;
  try {
    const saved = localStorage.getItem('retzpost_custom_templates');
    if (saved) {
      const parsed: PostTemplate[] = JSON.parse(saved);
      return [...BUILT_IN_TEMPLATES, ...parsed];
    }
  } catch {
    // fallback to built-ins
  }
  return BUILT_IN_TEMPLATES;
}

export function saveCustomTemplate(template: Omit<PostTemplate, 'id' | 'isBuiltIn' | 'category' | 'categoryLabel'>): PostTemplate {
  const newTpl: PostTemplate = {
    ...template,
    id: `tpl-custom-${Date.now()}`,
    category: 'CUSTOM',
    categoryLabel: 'เทมเพลตของฉัน',
    isBuiltIn: false,
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem('retzpost_custom_templates');
      const list: PostTemplate[] = existing ? JSON.parse(existing) : [];
      list.unshift(newTpl);
      localStorage.setItem('retzpost_custom_templates', JSON.stringify(list));
    } catch {
      // storage failed or quota exceeded
    }
  }

  return newTpl;
}

export function deleteCustomTemplate(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = localStorage.getItem('retzpost_custom_templates');
    if (existing) {
      const list: PostTemplate[] = JSON.parse(existing);
      const filtered = list.filter((t) => t.id !== id);
      localStorage.setItem('retzpost_custom_templates', JSON.stringify(filtered));
    }
  } catch {
    // ignore
  }
}
