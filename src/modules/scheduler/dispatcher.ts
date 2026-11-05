import { prisma } from '@/lib/prisma';
import { Platform } from '@prisma/client';

export interface DispatchResult {
  dispatchedJobsCount: number;
  jobIds: string[];
}

export interface ExecutionResult {
  executedJobsCount: number;
  failedJobsCount: number;
  publishedJobIds: string[];
}

export interface CycleResult {
  dispatched: DispatchResult;
  executed: ExecutionResult;
  dispatchedJobsCount: number;
  executedJobsCount: number;
  failedJobsCount: number;
  publishedJobIds: string[];
}

/**
 * Scans for scheduled publishing jobs that have reached their target execution instant.
 * Transitions them from SCHEDULED to QUEUED atomically.
 */
export async function dispatchDueScheduledJobs(limit: number = 50): Promise<DispatchResult> {
  const now = new Date();

  // Find due jobs
  const dueJobs = await prisma.publishJob.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledForUtc: {
        lte: now,
      },
    },
    take: limit,
    select: {
      id: true,
      batchId: true,
    },
  });

  if (dueJobs.length === 0) {
    return { dispatchedJobsCount: 0, jobIds: [] };
  }

  const jobIds = dueJobs.map((j) => j.id);
  const batchIds = Array.from(new Set(dueJobs.map((j) => j.batchId)));

  // Atomic transition in database
  await prisma.$transaction(async (tx) => {
    // 1. Update jobs to QUEUED
    await tx.publishJob.updateMany({
      where: {
        id: { in: jobIds },
        status: 'SCHEDULED', // Guard against race conditions
      },
      data: {
        status: 'QUEUED',
      },
    });

    // 2. Update parent batches to IN_PROGRESS
    await tx.publishBatch.updateMany({
      where: {
        id: { in: batchIds },
        aggregateStatus: 'PENDING',
      },
      data: {
        aggregateStatus: 'IN_PROGRESS',
      },
    });
  });

  return {
    dispatchedJobsCount: jobIds.length,
    jobIds,
  };
}

/**
 * Executes queued publish jobs, deducts tokens per workspace, generates live simulated
 * publications, updates job/batch statuses, and logs audit events.
 */
export async function executeQueuedPublishJobs(
  jobIds?: string[],
  limit: number = 50
): Promise<ExecutionResult> {
  // Query target QUEUED jobs
  const targetJobs = await prisma.publishJob.findMany({
    where: {
      status: 'QUEUED',
      ...(jobIds && jobIds.length > 0 ? { id: { in: jobIds } } : {}),
    },
    take: limit,
    include: {
      platformAccount: true,
      content: true,
      batch: true,
    },
  });

  if (targetJobs.length === 0) {
    return {
      executedJobsCount: 0,
      failedJobsCount: 0,
      publishedJobIds: [],
    };
  }

  type TargetJob = (typeof targetJobs)[number];

  // Group jobs by workspaceId for token deduction and transaction isolation
  const workspaceMap = new Map<string, TargetJob[]>();
  for (const job of targetJobs) {
    const existing = workspaceMap.get(job.workspaceId) || [];
    existing.push(job);
    workspaceMap.set(job.workspaceId, existing);
  }

  let executedJobsCount = 0;
  let failedJobsCount = 0;
  const publishedJobIds: string[] = [];

  const entries: [string, TargetJob[]][] = Array.from(workspaceMap.entries());
  for (const [workspaceId, wsJobs] of entries) {
    try {
      await prisma.$transaction(async (tx) => {
        const tokenCost = wsJobs.length * 1;

        // 1. Fetch current workspace token balance and deduct tokens
        const workspace = await tx.workspace.findUnique({
          where: { id: workspaceId },
          select: { tokenBalance: true },
        });

        const currentBalance = workspace?.tokenBalance ?? 50;
        const newBalance = Math.max(0, currentBalance - tokenCost);

        await tx.workspace.update({
          where: { id: workspaceId },
          data: {
            tokenBalance: newBalance,
          },
        });

        // 2. Log TokenTransaction
        const requestedByUserId = wsJobs[0]?.batch?.requestedByUserId || null;
        await tx.tokenTransaction.create({
          data: {
            workspaceId,
            userId: requestedByUserId,
            actorName: 'SYSTEM_SCHEDULER',
            actionKey: 'PUBLISH_EXECUTION',
            amount: -tokenCost,
            type: 'USAGE',
            description: `Executed publishing for ${wsJobs.length} platform job(s)`,
            balanceAfter: newBalance,
          },
        });

        // 3. Generate simulated publications & update jobs to PUBLISHED
        const executionTime = new Date();
        for (const job of wsJobs) {
          const platformKey = job.platform.toLowerCase();
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const remotePostId = `${platformKey}_post_${Date.now()}_${randomSuffix}`;
          const remotePermalink = `https://${platformKey}.com/post/${remotePostId}`;

          await tx.platformPublication.create({
            data: {
              workspaceId: job.workspaceId,
              jobId: job.id,
              platformAccountId: job.platformAccountId,
              platform: job.platform,
              remotePostId,
              remotePermalink,
              remoteVisibility: 'public',
              publishedAt: executionTime,
            },
          });

          await tx.publishJob.update({
            where: { id: job.id },
            data: {
              status: 'PUBLISHED',
              updatedAt: executionTime,
            },
          });
        }

        // 4. If all jobs in a batch are published, update PublishBatch aggregateStatus
        const batchIds: string[] = Array.from(new Set(wsJobs.map((j: TargetJob) => j.batchId)));
        for (const batchId of batchIds) {
          const remainingUnpublishedCount = await tx.publishJob.count({
            where: {
              batchId,
              status: { not: 'PUBLISHED' },
            },
          });

          if (remainingUnpublishedCount === 0) {
            await tx.publishBatch.update({
              where: { id: batchId },
              data: {
                aggregateStatus: 'PUBLISHED',
                updatedAt: executionTime,
              },
            });
          }
        }

        // 5. Log AuditEvent
        await tx.auditEvent.create({
          data: {
            workspaceId,
            userId: requestedByUserId,
            action: 'SCHEDULED_DISPATCH_COMPLETED',
            resource: 'PublishJob',
            details: {
              executedJobsCount: wsJobs.length,
              jobIds: wsJobs.map((j: TargetJob) => j.id),
              timestamp: executionTime.toISOString(),
            },
          },
        });
      });

      executedJobsCount += wsJobs.length;
      publishedJobIds.push(...wsJobs.map((j: TargetJob) => j.id));
    } catch (error) {
      console.error(`[Scheduler] Failed executing queued jobs for workspace ${workspaceId}:`, error);
      failedJobsCount += wsJobs.length;
    }
  }

  return {
    executedJobsCount,
    failedJobsCount,
    publishedJobIds,
  };
}

/**
 * Combines job dispatching and queued job execution in a single cycle.
 */
export async function runScheduledPublishCycle(limit: number = 50): Promise<CycleResult> {
  const dispatchResult = await dispatchDueScheduledJobs(limit);

  // If newly dispatched jobs exist, process them; otherwise process any existing queued jobs up to limit
  const targetJobIds = dispatchResult.jobIds.length > 0 ? dispatchResult.jobIds : undefined;
  const executionResult = await executeQueuedPublishJobs(targetJobIds, limit);

  return {
    dispatched: dispatchResult,
    executed: executionResult,
    dispatchedJobsCount: dispatchResult.dispatchedJobsCount,
    executedJobsCount: executionResult.executedJobsCount,
    failedJobsCount: executionResult.failedJobsCount,
    publishedJobIds: executionResult.publishedJobIds,
  };
}
