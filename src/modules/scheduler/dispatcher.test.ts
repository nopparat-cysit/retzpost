import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import {
  dispatchDueScheduledJobs,
  executeQueuedPublishJobs,
  runScheduledPublishCycle,
} from './dispatcher';
import { prisma } from '@/lib/prisma';
import { GET } from '@/app/api/cron/publish/route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    publishJob: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    publishBatch: {
      updateMany: vi.fn(),
      update: vi.fn(),
    },
    workspace: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    tokenTransaction: {
      create: vi.fn(),
    },
    platformPublication: {
      create: vi.fn(),
    },
    auditEvent: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe('Scheduler Dispatcher & Job Executor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      return callback(prisma);
    });
  });

  describe('dispatchDueScheduledJobs', () => {
    it('returns 0 dispatched jobs when no jobs are due', async () => {
      (prisma.publishJob.findMany as any).mockResolvedValueOnce([]);

      const result = await dispatchDueScheduledJobs(50);

      expect(result.dispatchedJobsCount).toBe(0);
      expect(result.jobIds).toEqual([]);
      expect(prisma.publishJob.findMany).toHaveBeenCalledWith({
        where: {
          status: 'SCHEDULED',
          scheduledForUtc: {
            lte: expect.any(Date),
          },
        },
        take: 50,
        select: {
          id: true,
          batchId: true,
        },
      });
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('atomically transitions due jobs to QUEUED and batches to IN_PROGRESS', async () => {
      const mockDueJobs = [
        { id: 'job-1', batchId: 'batch-1' },
        { id: 'job-2', batchId: 'batch-1' },
        { id: 'job-3', batchId: 'batch-2' },
      ];
      (prisma.publishJob.findMany as any).mockResolvedValueOnce(mockDueJobs);

      const result = await dispatchDueScheduledJobs(10);

      expect(result.dispatchedJobsCount).toBe(3);
      expect(result.jobIds).toEqual(['job-1', 'job-2', 'job-3']);
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.publishJob.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['job-1', 'job-2', 'job-3'] },
          status: 'SCHEDULED',
        },
        data: {
          status: 'QUEUED',
        },
      });
      expect(prisma.publishBatch.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['batch-1', 'batch-2'] },
          aggregateStatus: 'PENDING',
        },
        data: {
          aggregateStatus: 'IN_PROGRESS',
        },
      });
    });
  });

  describe('executeQueuedPublishJobs', () => {
    it('returns 0 executed jobs when no jobs are queued', async () => {
      (prisma.publishJob.findMany as any).mockResolvedValueOnce([]);

      const result = await executeQueuedPublishJobs();

      expect(result.executedJobsCount).toBe(0);
      expect(result.failedJobsCount).toBe(0);
      expect(result.publishedJobIds).toEqual([]);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('deducts tokens, creates publications, updates jobs and batches, and logs audit events', async () => {
      const mockJobs = [
        {
          id: 'job-101',
          workspaceId: 'ws-1',
          batchId: 'batch-10',
          platformAccountId: 'pa-1',
          platform: 'YOUTUBE' as const,
          batch: { requestedByUserId: 'usr-1' },
          content: { id: 'cnt-1' },
          platformAccount: { id: 'pa-1' },
        },
        {
          id: 'job-102',
          workspaceId: 'ws-1',
          batchId: 'batch-10',
          platformAccountId: 'pa-2',
          platform: 'TIKTOK' as const,
          batch: { requestedByUserId: 'usr-1' },
          content: { id: 'cnt-1' },
          platformAccount: { id: 'pa-2' },
        },
      ];

      (prisma.publishJob.findMany as any).mockResolvedValueOnce(mockJobs);
      (prisma.workspace.findUnique as any).mockResolvedValueOnce({ tokenBalance: 50 });
      // When checking remaining unpublished jobs for batch-10, return 0 (all published)
      (prisma.publishJob.count as any).mockResolvedValueOnce(0);

      const result = await executeQueuedPublishJobs(['job-101', 'job-102']);

      expect(result.executedJobsCount).toBe(2);
      expect(result.failedJobsCount).toBe(0);
      expect(result.publishedJobIds).toEqual(['job-101', 'job-102']);

      // 1. Token deduction: 2 jobs * 1 token = 2 tokens; balance 50 -> 48
      expect(prisma.workspace.update).toHaveBeenCalledWith({
        where: { id: 'ws-1' },
        data: { tokenBalance: 48 },
      });

      // 2. TokenTransaction log
      expect(prisma.tokenTransaction.create).toHaveBeenCalledWith({
        data: {
          workspaceId: 'ws-1',
          userId: 'usr-1',
          actorName: 'SYSTEM_SCHEDULER',
          actionKey: 'PUBLISH_EXECUTION',
          amount: -2,
          type: 'USAGE',
          description: 'Executed publishing for 2 platform job(s)',
          balanceAfter: 48,
        },
      });

      // 3. PlatformPublications created
      expect(prisma.platformPublication.create).toHaveBeenCalledTimes(2);
      expect(prisma.platformPublication.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            jobId: 'job-101',
            platform: 'YOUTUBE',
            remoteVisibility: 'public',
          }),
        })
      );

      // 4. Jobs updated to PUBLISHED
      expect(prisma.publishJob.update).toHaveBeenCalledWith({
        where: { id: 'job-101' },
        data: {
          status: 'PUBLISHED',
          updatedAt: expect.any(Date),
        },
      });

      // 5. Batch aggregateStatus updated to PUBLISHED
      expect(prisma.publishBatch.update).toHaveBeenCalledWith({
        where: { id: 'batch-10' },
        data: {
          aggregateStatus: 'PUBLISHED',
          updatedAt: expect.any(Date),
        },
      });

      // 6. AuditEvent logged
      expect(prisma.auditEvent.create).toHaveBeenCalledWith({
        data: {
          workspaceId: 'ws-1',
          userId: 'usr-1',
          action: 'SCHEDULED_DISPATCH_COMPLETED',
          resource: 'PublishJob',
          details: {
            executedJobsCount: 2,
            jobIds: ['job-101', 'job-102'],
            timestamp: expect.any(String),
          },
        },
      });
    });

    it('does not mark batch as PUBLISHED if other jobs in the batch remain pending', async () => {
      const mockJobs = [
        {
          id: 'job-201',
          workspaceId: 'ws-2',
          batchId: 'batch-20',
          platformAccountId: 'pa-1',
          platform: 'INSTAGRAM' as const,
          batch: { requestedByUserId: 'usr-2' },
          content: { id: 'cnt-2' },
          platformAccount: { id: 'pa-1' },
        },
      ];

      (prisma.publishJob.findMany as any).mockResolvedValueOnce(mockJobs);
      (prisma.workspace.findUnique as any).mockResolvedValueOnce({ tokenBalance: 10 });
      // Remaining unpublished jobs > 0
      (prisma.publishJob.count as any).mockResolvedValueOnce(1);

      const result = await executeQueuedPublishJobs(['job-201']);

      expect(result.executedJobsCount).toBe(1);
      expect(prisma.publishBatch.update).not.toHaveBeenCalled();
    });

    it('isolates errors per workspace and tracks failed count', async () => {
      const mockJobs = [
        {
          id: 'job-301',
          workspaceId: 'ws-broken',
          batchId: 'batch-30',
          platformAccountId: 'pa-1',
          platform: 'FACEBOOK' as const,
          batch: { requestedByUserId: null },
          content: { id: 'cnt-3' },
          platformAccount: { id: 'pa-1' },
        },
      ];

      (prisma.publishJob.findMany as any).mockResolvedValueOnce(mockJobs);
      (prisma.$transaction as any).mockRejectedValueOnce(new Error('Database write deadlock'));

      const result = await executeQueuedPublishJobs(['job-301']);

      expect(result.executedJobsCount).toBe(0);
      expect(result.failedJobsCount).toBe(1);
      expect(result.publishedJobIds).toEqual([]);
    });
  });

  describe('runScheduledPublishCycle', () => {
    it('coordinates dispatch and execution and returns unified summary', async () => {
      // 1. Dispatch finds 1 due job
      (prisma.publishJob.findMany as any)
        .mockResolvedValueOnce([{ id: 'job-cycle-1', batchId: 'batch-cycle-1' }])
        // 2. Execution finds that queued job
        .mockResolvedValueOnce([
          {
            id: 'job-cycle-1',
            workspaceId: 'ws-cycle',
            batchId: 'batch-cycle-1',
            platformAccountId: 'pa-cycle',
            platform: 'YOUTUBE' as const,
            batch: { requestedByUserId: null },
            content: { id: 'cnt-cycle' },
            platformAccount: { id: 'pa-cycle' },
          },
        ]);

      (prisma.workspace.findUnique as any).mockResolvedValueOnce({ tokenBalance: 20 });
      (prisma.publishJob.count as any).mockResolvedValueOnce(0);

      const cycle = await runScheduledPublishCycle();

      expect(cycle.dispatchedJobsCount).toBe(1);
      expect(cycle.executedJobsCount).toBe(1);
      expect(cycle.failedJobsCount).toBe(0);
      expect(cycle.publishedJobIds).toEqual(['job-cycle-1']);
      expect(cycle.dispatched).toBeDefined();
      expect(cycle.executed).toBeDefined();
    });
  });

  describe('Vercel Cron API Route (/api/cron/publish)', () => {
    const originalEnv = process.env.CRON_SECRET;

    beforeEach(() => {
      process.env.CRON_SECRET = 'super-secret-cron-token';
    });

    afterAll(() => {
      process.env.CRON_SECRET = originalEnv;
    });

    it('rejects unauthorized requests when CRON_SECRET is configured', async () => {
      const req = new NextRequest('http://localhost:3000/api/cron/publish', {
        headers: {
          authorization: 'Bearer wrong-secret',
        },
      });

      const res = await GET(req);
      expect(res.status).toBe(401);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain('Unauthorized');
    });

    it('authorizes requests with matching Bearer token', async () => {
      (prisma.publishJob.findMany as any).mockResolvedValueOnce([]); // dispatch
      (prisma.publishJob.findMany as any).mockResolvedValueOnce([]); // execute

      const req = new NextRequest('http://localhost:3000/api/cron/publish', {
        headers: {
          authorization: 'Bearer super-secret-cron-token',
        },
      });

      const res = await GET(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.timestamp).toBeDefined();
      expect(json.dispatched).toBeDefined();
      expect(json.executed).toBeDefined();
    });

    it('authorizes requests with x-vercel-cron header', async () => {
      (prisma.publishJob.findMany as any).mockResolvedValueOnce([]); // dispatch
      (prisma.publishJob.findMany as any).mockResolvedValueOnce([]); // execute

      const req = new NextRequest('http://localhost:3000/api/cron/publish', {
        headers: {
          'x-vercel-cron': '1',
        },
      });

      const res = await GET(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });
});
