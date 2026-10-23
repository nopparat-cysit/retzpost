import { describe, it, expect } from 'vitest';
import { getEmployeeKPIs, getDepartmentSummary, MOCK_EMPLOYEE_KPIS } from './kpi-engine';
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
