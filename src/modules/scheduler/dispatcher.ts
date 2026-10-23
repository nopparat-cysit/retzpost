import { prisma } from '@/lib/prisma';

export interface DispatchResult {
  dispatchedJobsCount: number;
  jobIds: string[];
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
