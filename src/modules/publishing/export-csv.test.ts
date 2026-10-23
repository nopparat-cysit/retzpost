import { describe, it, expect } from 'vitest';
import { escapeCsvField, generateErrorLogCsv, generateAllDispatchesCsv } from './export-csv';

describe('CSV Export Engine', () => {
  it('correctly escapes CSV fields with quotes and commas', () => {
    expect(escapeCsvField('normal text')).toBe('normal text');
    expect(escapeCsvField('text with, comma')).toBe('"text with, comma"');
    expect(escapeCsvField('text with "quotes"')).toBe('"text with ""quotes"""');
    expect(escapeCsvField("line 1\nline 2")).toBe('"line 1\nline 2"');
  });

  it('generates error log CSV with UTF-8 BOM and extracts failed jobs only', () => {
    const jobs = [
      {
        id: 'MP-JOB-1',
        platform: 'INSTAGRAM',
        format: 'FEED_POST',
        handle: '@c1_luxury',
        storyTitle: 'Penthouse Showcase',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: '2026-10-24 09:00',
      },
      {
        id: 'MP-JOB-2',
        platform: 'TIKTOK',
        format: 'VIDEO_REEL',
        handle: '@c1_official',
        storyTitle: 'BTS Tour',
        status: 'FAILED_RETRYABLE',
        attemptCount: 2,
        maxAttempts: 4,
        scheduledOrExecutedAt: '2026-10-24 09:05',
        errorSafeMessage: 'Rate limit 429 exceeded',
      },
    ];

    const csv = generateErrorLogCsv(jobs);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('Job ID,Timestamp / Scheduled At');
    expect(csv).toContain('MP-JOB-2');
    expect(csv).toContain('Rate limit 429 exceeded');
    // Should NOT contain the successful job
    expect(csv).not.toContain('MP-JOB-1');
  });

  it('generates full dispatches CSV with all jobs', () => {
    const jobs = [
      {
        id: 'MP-JOB-1',
        platform: 'INSTAGRAM',
        format: 'FEED_POST',
        handle: '@c1_luxury',
        storyTitle: 'Penthouse Showcase',
        status: 'PUBLISHED',
        attemptCount: 1,
        maxAttempts: 4,
        scheduledOrExecutedAt: '2026-10-24 09:00',
        liveUrl: 'https://instagram.com/p/123',
      },
    ];

    const csv = generateAllDispatchesCsv(jobs);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('MP-JOB-1');
    expect(csv).toContain('https://instagram.com/p/123');
  });
});
