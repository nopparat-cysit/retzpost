import { describe, it, expect } from 'vitest';
import { BUILT_IN_TEMPLATES, getInitialTemplates } from './templates';

describe('Post Templates Engine', () => {
  it('loads built-in templates covering real estate, promotions, and announcements', () => {
    expect(BUILT_IN_TEMPLATES.length).toBeGreaterThanOrEqual(4);
    const realEstate = BUILT_IN_TEMPLATES.find((t) => t.category === 'REAL_ESTATE');
    expect(realEstate).toBeDefined();
    expect(realEstate?.name).toContain('คอนโด');
    expect(realEstate?.caption).toContain('รายละเอียดห้อง');
  });

  it('provides complete template schema with title, caption, and storyLink', () => {
    for (const t of BUILT_IN_TEMPLATES) {
      expect(t.id).toBeDefined();
      expect(t.name.length).toBeGreaterThan(0);
      expect(t.title.length).toBeGreaterThan(0);
      expect(t.caption.length).toBeGreaterThan(0);
      expect(t.isBuiltIn).toBe(true);
    }
  });

  it('getInitialTemplates returns built-in templates in non-browser context', () => {
    const list = getInitialTemplates();
    expect(list.length).toBe(BUILT_IN_TEMPLATES.length);
  });
});
