import { describe, it, expect, beforeEach } from 'vitest';
import {
  classifyCohortFloor,
  isMealTimeDue,
  chunkArray,
  checkCooldown,
  recordSyncActivity,
  resetCooldown,
  simulateIncrementalGrowth,
  calculateAggregates,
  syncWorkspaceTelemetry,
  PostTelemetryMetrics,
  COHORT_FLOORS,
} from './sync-engine';

describe('Analytics Sync Engine - Cohort 5-Floor Architecture', () => {
  beforeEach(() => {
    resetCooldown();
  });

  describe('classifyCohortFloor (5-Floor Cohort Metaphor)', () => {
    const now = new Date('2026-10-29T12:00:00Z');

    it('should classify posts 0 to 3 days old as FLOOR_1_NEWBORN', () => {
      const tenHoursAgo = new Date(now.getTime() - 10 * 3600 * 1000);
      const seventyHoursAgo = new Date(now.getTime() - 70 * 3600 * 1000);

      expect(classifyCohortFloor(tenHoursAgo, now)).toBe('FLOOR_1_NEWBORN');
      expect(classifyCohortFloor(seventyHoursAgo, now)).toBe('FLOOR_1_NEWBORN');
    });

    it('should classify posts 4 to 7 days old as FLOOR_2_TODDLER', () => {
      const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 3600 * 1000);
      const sixDaysAgo = new Date(now.getTime() - 6.5 * 24 * 3600 * 1000);

      expect(classifyCohortFloor(fourDaysAgo, now)).toBe('FLOOR_2_TODDLER');
      expect(classifyCohortFloor(sixDaysAgo, now)).toBe('FLOOR_2_TODDLER');
    });

    it('should classify posts 8 to 14 days old as FLOOR_3_PRIMARY', () => {
      const nineDaysAgo = new Date(now.getTime() - 9 * 24 * 3600 * 1000);
      const thirteenDaysAgo = new Date(now.getTime() - 13 * 24 * 3600 * 1000);

      expect(classifyCohortFloor(nineDaysAgo, now)).toBe('FLOOR_3_PRIMARY');
      expect(classifyCohortFloor(thirteenDaysAgo, now)).toBe('FLOOR_3_PRIMARY');
    });

    it('should classify posts 15 to 30 days old as FLOOR_4_SECONDARY', () => {
      const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 3600 * 1000);
      const twentyNineDaysAgo = new Date(now.getTime() - 29 * 24 * 3600 * 1000);

      expect(classifyCohortFloor(twentyDaysAgo, now)).toBe('FLOOR_4_SECONDARY');
      expect(classifyCohortFloor(twentyNineDaysAgo, now)).toBe('FLOOR_4_SECONDARY');
    });

    it('should classify posts older than 30 days as FLOOR_5_VETERAN', () => {
      const thirtyFiveDaysAgo = new Date(now.getTime() - 35 * 24 * 3600 * 1000);
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 3600 * 1000);

      expect(classifyCohortFloor(thirtyFiveDaysAgo, now)).toBe('FLOOR_5_VETERAN');
      expect(classifyCohortFloor(oneYearAgo, now)).toBe('FLOOR_5_VETERAN');
    });
  });

  describe('isMealTimeDue (Fixed Scheduled Meal Windows)', () => {
    const now = new Date('2026-10-29T12:00:00Z');

    it('should always be due if never synced before', () => {
      expect(isMealTimeDue('FLOOR_1_NEWBORN', null, now)).toBe(true);
      expect(isMealTimeDue('FLOOR_5_VETERAN', undefined, now)).toBe(true);
    });

    it('should always be due when force is true (Sync Now bypass)', () => {
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
      expect(isMealTimeDue('FLOOR_1_NEWBORN', tenMinutesAgo, now, true)).toBe(true);
      expect(isMealTimeDue('FLOOR_5_VETERAN', tenMinutesAgo, now, true)).toBe(true);
    });

    it('should verify Floor 1 (2-hour mealtime window)', () => {
      const oneHourAgo = new Date(now.getTime() - 1 * 3600 * 1000);
      const twoPointFiveHoursAgo = new Date(now.getTime() - 2.5 * 3600 * 1000);

      expect(isMealTimeDue('FLOOR_1_NEWBORN', oneHourAgo, now)).toBe(false);
      expect(isMealTimeDue('FLOOR_1_NEWBORN', twoPointFiveHoursAgo, now)).toBe(true);
    });

    it('should verify Floor 2 (24-hour mealtime window)', () => {
      const tenHoursAgo = new Date(now.getTime() - 10 * 3600 * 1000);
      const twentyFiveHoursAgo = new Date(now.getTime() - 25 * 3600 * 1000);

      expect(isMealTimeDue('FLOOR_2_TODDLER', tenHoursAgo, now)).toBe(false);
      expect(isMealTimeDue('FLOOR_2_TODDLER', twentyFiveHoursAgo, now)).toBe(true);
    });

    it('should verify Floor 3 (3-day = 72-hour mealtime window)', () => {
      const twoDaysAgo = new Date(now.getTime() - 48 * 3600 * 1000);
      const fourDaysAgo = new Date(now.getTime() - 96 * 3600 * 1000);

      expect(isMealTimeDue('FLOOR_3_PRIMARY', twoDaysAgo, now)).toBe(false);
      expect(isMealTimeDue('FLOOR_3_PRIMARY', fourDaysAgo, now)).toBe(true);
    });

    it('should verify Floor 4 (7-day = 168-hour mealtime window)', () => {
      const fourDaysAgo = new Date(now.getTime() - 96 * 3600 * 1000);
      const eightDaysAgo = new Date(now.getTime() - 192 * 3600 * 1000);

      expect(isMealTimeDue('FLOOR_4_SECONDARY', fourDaysAgo, now)).toBe(false);
      expect(isMealTimeDue('FLOOR_4_SECONDARY', eightDaysAgo, now)).toBe(true);
    });

    it('should verify Floor 5 (30-day = 720-hour mealtime window)', () => {
      const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 3600 * 1000);
      const thirtyFiveDaysAgo = new Date(now.getTime() - 35 * 24 * 3600 * 1000);

      expect(isMealTimeDue('FLOOR_5_VETERAN', twentyDaysAgo, now)).toBe(false);
      expect(isMealTimeDue('FLOOR_5_VETERAN', thirtyFiveDaysAgo, now)).toBe(true);
    });
  });

  describe('chunkArray (50 IDs Batch Chunker)', () => {
    it('should chunk 125 items into batches of 50, 50, and 25', () => {
      const items = Array.from({ length: 125 }, (_, i) => `item_${i + 1}`);
      const chunks = chunkArray(items, 50);

      expect(chunks.length).toBe(3);
      expect(chunks[0].length).toBe(50);
      expect(chunks[1].length).toBe(50);
      expect(chunks[2].length).toBe(25);
      expect(chunks[0][0]).toBe('item_1');
      expect(chunks[2][24]).toBe('item_125');
    });

    it('should return 1 chunk for items <= 50', () => {
      const items = ['a', 'b', 'c'];
      const chunks = chunkArray(items, 50);

      expect(chunks.length).toBe(1);
      expect(chunks[0]).toEqual(['a', 'b', 'c']);
    });

    it('should return empty array for empty items', () => {
      expect(chunkArray([])).toEqual([]);
    });

    it('should throw error for invalid chunk size <= 0', () => {
      expect(() => chunkArray(['a'], 0)).toThrow('Chunk size must be greater than 0');
    });
  });

  describe('Cooldown & Rate Limit Protection', () => {
    it('should allow initial sync for new workspace', () => {
      const { isAllowed, remainingSeconds } = checkCooldown('ws_floor_test');
      expect(isAllowed).toBe(true);
      expect(remainingSeconds).toBe(0);
    });

    it('should block sync during active cooldown window', () => {
      const now = 1000000;
      recordSyncActivity('ws_floor_test_2', now);

      const check1 = checkCooldown('ws_floor_test_2', 60_000, now + 10_000);
      expect(check1.isAllowed).toBe(false);
      expect(check1.remainingSeconds).toBe(50);
    });
  });

  describe('simulateIncrementalGrowth', () => {
    it('should give higher growth to Floor 1 than Floor 5', () => {
      const base: PostTelemetryMetrics = {
        views: 1000,
        likes: 100,
        comments: 20,
        shares: 10,
        linkClicks: 50,
      };

      const floor1Result = simulateIncrementalGrowth(base, 'FLOOR_1_NEWBORN');
      const floor5Result = simulateIncrementalGrowth(base, 'FLOOR_5_VETERAN');

      expect(floor1Result.views).toBeGreaterThan(base.views);
      expect(floor5Result.views).toBeGreaterThanOrEqual(base.views);
      expect(floor1Result.views - base.views).toBeGreaterThanOrEqual(floor5Result.views - base.views);
    });
  });

  describe('calculateAggregates with Floor Breakdown', () => {
    it('should calculate floor breakdown accurately', () => {
      const items = [
        { metrics: { views: 100, likes: 10, comments: 2, shares: 1, linkClicks: 5 }, floor: 'FLOOR_1_NEWBORN' as const },
        { metrics: { views: 200, likes: 20, comments: 4, shares: 2, linkClicks: 10 }, floor: 'FLOOR_1_NEWBORN' as const },
        { metrics: { views: 300, likes: 30, comments: 6, shares: 3, linkClicks: 15 }, floor: 'FLOOR_4_SECONDARY' as const },
      ];

      const agg = calculateAggregates(items);
      expect(agg.totalViews).toBe(600);
      expect(agg.floorBreakdown.FLOOR_1_NEWBORN).toBe(2);
      expect(agg.floorBreakdown.FLOOR_4_SECONDARY).toBe(1);
      expect(agg.floorBreakdown.FLOOR_2_TODDLER).toBe(0);
    });
  });

  describe('syncWorkspaceTelemetry (End-to-End Cohort Sync)', () => {
    it('should skip posts that are not yet due for mealtime when force is false', async () => {
      const now = new Date();
      const mockPosts = [
        {
          id: 'post_due',
          views: 500,
          likes: 20,
          comments: 2,
          shares: 1,
          linkClicks: 10,
          publishedAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(), // Floor 1
          lastSyncedAt: new Date(now.getTime() - 3 * 3600 * 1000).toISOString(), // Synced 3h ago (due!)
        },
        {
          id: 'post_not_due',
          views: 1000,
          likes: 50,
          comments: 5,
          shares: 3,
          linkClicks: 20,
          publishedAt: new Date(now.getTime() - 5 * 24 * 3600 * 1000).toISOString(), // Floor 2 (24h interval)
          lastSyncedAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(), // Synced 2h ago (NOT due!)
        },
      ];

      const res = await syncWorkspaceTelemetry('ws_cohort_test', { mockPosts, force: false });

      expect(res.status).toBe('SUCCESS');
      expect(res.syncedCount).toBe(1); // Only post_due was synced
      expect(res.skippedCount).toBe(1); // post_not_due was skipped
      expect(res.records.find((r) => r.id === 'post_due')?.syncStatus).toBe('SUCCESS');
      expect(res.records.find((r) => r.id === 'post_not_due')?.syncStatus).toBe('SKIPPED_NOT_DUE');
    });

    it('should sync ALL posts regardless of mealtime when force is true (Manual Sync Now)', async () => {
      const now = new Date();
      const mockPosts = [
        {
          id: 'post_forced_1',
          views: 800,
          likes: 30,
          comments: 3,
          shares: 2,
          linkClicks: 15,
          publishedAt: new Date(now.getTime() - 20 * 24 * 3600 * 1000).toISOString(), // Floor 4
          lastSyncedAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(), // Synced 10 mins ago
        },
      ];

      const res = await syncWorkspaceTelemetry('ws_force_cohort', { mockPosts, force: true });

      expect(res.status).toBe('SUCCESS');
      expect(res.syncedCount).toBe(1);
      expect(res.skippedCount).toBe(0);
      expect(res.records[0].syncStatus).toBe('SUCCESS');
    });
  });
});
