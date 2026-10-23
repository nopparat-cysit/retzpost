import { describe, it, expect, beforeEach } from 'vitest';
import { 
  BUILT_IN_TEMPLATES, 
  getInitialTemplates, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate, 
  duplicateTemplate, 
  resetTemplatesToDefault,
  _clearTemplateStorageForTesting
} from './templates';

describe('Post Templates Engine (Full CRUD)', () => {
  beforeEach(() => {
    _clearTemplateStorageForTesting();
  });

  it('READ: loads built-in templates covering real estate, promotions, and announcements', () => {
    expect(BUILT_IN_TEMPLATES.length).toBeGreaterThanOrEqual(4);
    const realEstate = BUILT_IN_TEMPLATES.find((t) => t.category === 'REAL_ESTATE');
    expect(realEstate).toBeDefined();
    expect(realEstate?.name).toContain('คอนโด');
    expect(realEstate?.caption).toContain('รายละเอียดห้อง');
  });

  it('READ: provides complete template schema with title, caption, and storyLink', () => {
    for (const t of BUILT_IN_TEMPLATES) {
      expect(t.id).toBeDefined();
      expect(t.name.length).toBeGreaterThan(0);
      expect(t.title.length).toBeGreaterThan(0);
      expect(t.caption.length).toBeGreaterThan(0);
      expect(t.isBuiltIn).toBe(true);
    }
  });

  it('CREATE: can create a new custom template and retrieve it', () => {
    const created = createTemplate({
      name: '🏢 Luxury Villa Phuket Deal',
      category: 'REAL_ESTATE',
      title: 'Exclusive Oceanfront Villa in Phuket',
      caption: 'Private infinity pool overlooking the Andaman sea. Contact us today!',
      tags: 'PhuketVilla, LuxuryHome',
      storyLink: 'https://phuket-villas.com/deal',
    });

    expect(created.id).toBeDefined();
    expect(created.isBuiltIn).toBe(false);
    expect(created.categoryLabel).toBe('อสังหาริมทรัพย์');

    const all = getInitialTemplates();
    expect(all[0].id).toBe(created.id);
    expect(all[0].name).toBe('🏢 Luxury Villa Phuket Deal');
  });

  it('UPDATE: can update an existing template properties', () => {
    const created = createTemplate({
      name: 'Initial Name',
      category: 'CUSTOM',
      title: 'Initial Title',
      caption: 'Initial Caption',
      tags: 'Test',
    });

    const updated = updateTemplate(created.id, {
      name: 'Updated Luxury Villa',
      caption: 'Updated Caption with Special Discount',
    });

    expect(updated).not.toBeNull();
    expect(updated?.name).toBe('Updated Luxury Villa');
    expect(updated?.caption).toBe('Updated Caption with Special Discount');

    const all = getInitialTemplates();
    const found = all.find((t) => t.id === created.id);
    expect(found?.name).toBe('Updated Luxury Villa');
  });

  it('DUPLICATE: can clone an existing template with copy suffix', () => {
    const all = getInitialTemplates();
    const target = all[0];
    const cloned = duplicateTemplate(target.id);

    expect(cloned).not.toBeNull();
    expect(cloned?.id).not.toBe(target.id);
    expect(cloned?.name).toContain('(สำเนา)');
    expect(cloned?.isBuiltIn).toBe(false);
  });

  it('DELETE: can delete a template by id', () => {
    const created = createTemplate({
      name: 'Temporary Template',
      category: 'CUSTOM',
      title: 'Temp Title',
      caption: 'To be deleted',
      tags: 'temp',
    });

    const success = deleteTemplate(created.id);
    expect(success).toBe(true);

    const all = getInitialTemplates();
    expect(all.some((t) => t.id === created.id)).toBe(false);
  });

  it('RESET: can reset all templates back to system defaults', () => {
    createTemplate({
      name: 'Will be wiped',
      category: 'CUSTOM',
      title: 'Wipe me',
      caption: 'Wipe me',
      tags: 'wipe',
    });

    const resetList = resetTemplatesToDefault();
    expect(resetList.length).toBe(BUILT_IN_TEMPLATES.length);
    expect(resetList.some((t) => t.name === 'Will be wiped')).toBe(false);
  });
});
