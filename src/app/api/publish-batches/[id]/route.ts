import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Ensure BigInt can be safely serialized into JSON
(BigInt.prototype as unknown as { toJSON: () => number }).toJSON = function () {
  return Number(this);
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const batchId = params.id;

  try {
    const batch = await prisma.publishBatch.findUnique({
      where: { id: batchId },
      include: {
        content: {
          include: {
            primaryAsset: true,
          },
        },
        jobs: {
          include: {
            platformAccount: true,
            publication: true,
            attempts: {
              orderBy: { attemptNumber: 'desc' },
              take: 3,
            },
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json({ error: 'Publish batch not found' }, { status: 404 });
    }

    return NextResponse.json({ batch });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to retrieve batch', message }, { status: 500 });
  }
}

/**
 * DELETE: Emergency Revoke
 * Cancels non-published jobs and marks batch as CANCELLED, logging an auditEvent.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const batchId = params.id;

  try {
    const batch = await prisma.publishBatch.findUnique({
      where: { id: batchId },
      include: { jobs: true },
    });

    if (!batch) {
      return NextResponse.json({ error: 'Publish batch not found' }, { status: 404 });
    }

    await prisma.$transaction(
      async (tx) => {
        // 1. Mark batch as CANCELLED
        await tx.publishBatch.update({
          where: { id: batchId },
          data: { aggregateStatus: 'CANCELLED' },
        });

        // 2. Mark non-published jobs as CANCELLED
        await tx.publishJob.updateMany({
          where: {
            batchId,
            status: { not: 'PUBLISHED' },
          },
          data: {
            status: 'CANCELLED',
          },
        });

        // 3. Log audit event
        await tx.auditEvent.create({
          data: {
            workspaceId: batch.workspaceId,
            action: 'EMERGENCY_API_REVOKE',
            resource: `publish_batch:${batch.id}`,
            details: {
              revokedAt: new Date().toISOString(),
              batchId: batch.id,
              reason: 'Emergency dispatch revocation by operator',
            },
          },
        });
      },
      { maxWait: 15000, timeout: 30000 }
    );

    return NextResponse.json({ success: true, message: 'Batch successfully revoked' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to revoke publish batch', message }, { status: 500 });
  }
}

/**
 * POST: Retry Action
 * Resets failed jobs to QUEUED and updates batch aggregateStatus to IN_PROGRESS.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const batchId = params.id;

  try {
    let specificJobId: string | undefined;
    try {
      const body = await req.json();
      specificJobId = body.jobId;
    } catch {
      // Body is optional
    }

    const batch = await prisma.publishBatch.findUnique({
      where: { id: batchId },
      include: { jobs: true },
    });

    if (!batch) {
      return NextResponse.json({ error: 'Publish batch not found' }, { status: 404 });
    }

    const updated = await prisma.$transaction(
      async (tx) => {
        // Reset failed jobs to QUEUED
        await tx.publishJob.updateMany({
          where: {
            batchId,
            ...(specificJobId ? { id: specificJobId } : { status: { in: ['FAILED_RETRYABLE', 'FAILED_FINAL'] } }),
          },
          data: {
            status: 'QUEUED',
            attemptCount: { increment: 1 },
            lastErrorCode: null,
            lastErrorSafeMessage: null,
          },
        });

        // Update batch aggregate status
        await tx.publishBatch.update({
          where: { id: batchId },
          data: { aggregateStatus: 'IN_PROGRESS' },
        });

        return tx.publishBatch.findUnique({
          where: { id: batchId },
          include: {
            jobs: {
              include: {
                platformAccount: true,
                publication: true,
              },
            },
          },
        });
      },
      { maxWait: 15000, timeout: 30000 }
    );

    return NextResponse.json({ batch: updated, success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to retry publish batch', message }, { status: 500 });
  }
}
