import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  getEmployeeKPIs, 
  getDepartmentSummary, 
  MOCK_EMPLOYEE_KPIS, 
  generateAiKpiCoaching,
  saveEmployeeKpiEvaluation,
  loadEmployeeKpiOverrides,
  resetEmployeeKpiEvaluations 
} from './kpi-engine';
import { getPostDiagnosis, MOCK_POST_DIAGNOSES } from './ai-insights';

describe('Staff KPI Telemetry Engine', () => {
  it('loads all mock employee KPIs across workspaces', () => {
    const list = getEmployeeKPIs('ALL');
    expect(list.length).toBeGreaterThanOrEqual(5);
    expect(list[0].name).toContain('Narumon');
    expect(list[0].actualPosts).toBeGreaterThanOrEqual(list[0].targetPosts);
    expect(list[0].overallKpiScore).toBeGreaterThanOrEqual(90);
    expect(list[0].isMockData).toBe(true);
  });

  it('filters employee KPIs by workspaceId correctly', () => {
    const c1Employees = getEmployeeKPIs('ws_capitalone');
    expect(c1Employees.length).toBe(2);
    expect(c1Employees.every((e) => e.workspaceId === 'ws_capitalone')).toBe(true);

    const acmeEmployees = getEmployeeKPIs('ws_acme');
    expect(acmeEmployees.length).toBe(2);
    expect(acmeEmployees.every((e) => e.workspaceId === 'ws_acme')).toBe(true);
  });

  it('calculates department summary and top performer accurately', () => {
    const summary = getDepartmentSummary('ALL');
    expect(summary.totalEmployees).toBe(MOCK_EMPLOYEE_KPIS.length);
    expect(summary.totalTargetPosts).toBeGreaterThan(0);
    expect(summary.totalActualPosts).toBeGreaterThan(0);
    expect(summary.overallCompletionRate).toBeGreaterThan(0);
    expect(summary.topPerformer).toBeDefined();
    expect(summary.topPerformer.grade).toBe('A+');
    expect(summary.isMockData).toBe(true);
  });
});

describe('AI Post Performance Diagnosis Engine', () => {
  it('returns comprehensive diagnosis for known post with attribution factors and playbook', () => {
    const diagnosis = getPostDiagnosis('post-c1-1');
    expect(diagnosis).toBeDefined();
    expect(diagnosis.postTitle).toContain('The Rich Rama 9');
    expect(diagnosis.overallSuccessScore).toBeGreaterThanOrEqual(95);
    expect(diagnosis.attributionDrivers.length).toBeGreaterThanOrEqual(3);
    expect(diagnosis.actionablePlaybook.length).toBeGreaterThanOrEqual(2);
    expect(diagnosis.isMockData).toBe(true);
    expect(diagnosis.generatedByModel).toContain('Simulated');
  });

  it('returns valid fallback diagnosis for any arbitrary post ID', () => {
    const fallback = getPostDiagnosis('random-post-id', 'Test Luxury Penthouse');
    expect(fallback).toBeDefined();
    expect(fallback.postTitle).toBe('Test Luxury Penthouse');
    expect(fallback.attributionDrivers.length).toBeGreaterThanOrEqual(2);
    expect(fallback.actionablePlaybook.length).toBeGreaterThanOrEqual(1);
    expect(fallback.isMockData).toBe(true);
  });
});

describe('AI Employee KPI Coaching Synthesis & Evaluation Persistence', () => {
  it('synthesizes high-performing coaching insights for overachieving staff', () => {
    const narumon = MOCK_EMPLOYEE_KPIS[0];
    const aiResult = generateAiKpiCoaching(narumon);

    expect(aiResult).toBeDefined();
    expect(aiResult.strengthsTh).toContain('เกินเป้าหมาย');
    expect(aiResult.strengthsTh).toContain('ตรงเวลาระดับยอดเยี่ยม');
    expect(aiResult.strengthsTh).toContain('ผ่านการอนุมัติในรอบแรก');
    expect(aiResult.coachingNotesTh).toContain('Mentor');
    expect(aiResult.focusTags.length).toBeGreaterThanOrEqual(2);
    expect(aiResult.modelName).toContain('Gemini');
  });

  it('generates corrective and constructive coaching for members needing attention', () => {
    const ploy = MOCK_EMPLOYEE_KPIS.find((e) => e.memberId === 'mbr-coffee-1')!;
    const aiResult = generateAiKpiCoaching(ploy);

    expect(aiResult).toBeDefined();
    expect(aiResult.coachingNotesTh).toContain('ต่ำกว่าเป้าหมาย');
    expect(aiResult.coachingNotesTh).toContain('Auto-Schedule');
    expect(aiResult.focusTags).toContain('⚠️ Volume Gap');
  });

  describe('Client Persistence with LocalStorage Mock', () => {
    let mockStorage: Record<string, string> = {};

    beforeEach(() => {
      mockStorage = {};
      const fakeLocalStorage = {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => {
          mockStorage[key] = value;
        },
        removeItem: (key: string) => {
          delete mockStorage[key];
        },
        clear: () => {
          mockStorage = {};
        },
      };
      vi.stubGlobal('window', { localStorage: fakeLocalStorage });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('saves custom manager evaluation and merges into getEmployeeKPIs', () => {
      saveEmployeeKpiEvaluation(
        'mbr-coffee-1',
        'จุดเด่นที่หัวหน้างานพิมพ์ประเมินใหม่เอง',
        'แผนการโค้ชชิ่งประจำไตรมาส 4: เพิ่มความถี่เป็นสัปดาห์ละ 3 คอนเทนต์',
        ['🎯 Custom Focus', '☕ Cafe Lead'],
        false
      );

      const overrides = loadEmployeeKpiOverrides();
      expect(overrides['mbr-coffee-1']).toBeDefined();
      expect(overrides['mbr-coffee-1'].strengthsTh).toBe('จุดเด่นที่หัวหน้างานพิมพ์ประเมินใหม่เอง');
      expect(overrides['mbr-coffee-1'].evaluatedBy).toContain('หัวหน้างาน');

      // Assert merged KPIs
      const kpis = getEmployeeKPIs('ws_coffee');
      const ploy = kpis.find((e) => e.memberId === 'mbr-coffee-1')!;
      expect(ploy.strengthsTh).toBe('จุดเด่นที่หัวหน้างานพิมพ์ประเมินใหม่เอง');
      expect(ploy.coachingNotesTh).toContain('ไตรมาส 4');
      expect(ploy.focusTags).toContain('🎯 Custom Focus');
    });

    it('resets custom evaluations back to mock defaults on resetEmployeeKpiEvaluations', () => {
      saveEmployeeKpiEvaluation('mbr-c1-3', 'Custom note', 'Custom coaching');
      expect(loadEmployeeKpiOverrides()['mbr-c1-3']).toBeDefined();

      resetEmployeeKpiEvaluations();
      expect(loadEmployeeKpiOverrides()['mbr-c1-3']).toBeUndefined();

      const kpis = getEmployeeKPIs('ws_capitalone');
      const narumon = kpis.find((e) => e.memberId === 'mbr-c1-3')!;
      expect(narumon.strengthsTh).toContain('เชี่ยวชาญการเขียนแคปชัน');
    });
  });
});
