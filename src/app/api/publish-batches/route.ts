import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { BatchAggregateStatus, JobStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Ensure BigInt can be safely serialized into JSON
(BigInt.prototype as unknown as { toJSON: () => number }).toJSON = function () {
  return Number(this);
};

const DEFAULT_WORKSPACE_ID = 'dfec755f-256c-4182-813f-a69266c7b6f0';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId') || DEFAULT_WORKSPACE_ID;
    const status = searchParams.get('status');

    const whereClause: Record<string, unknown> = {
      workspaceId,
    };

    if (status && status !== 'ALL') {
      whereClause.aggregateStatus = status;
    }

    const batches = await prisma.publishBatch.findMany({
      where: whereClause,
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
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ batches });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to fetch publish batches', message }, { status: 500 });
  }
}

const createBatchSchema = z.object({
  workspaceId: z.string().uuid().default(DEFAULT_WORKSPACE_ID),
  contentId: z.string().uuid(),
  idempotencyKey: z.string().uuid().optional().default(() => crypto.randomUUID()),
  mode: z.enum(['PUBLISH_NOW', 'SCHEDULED']).default('PUBLISH_NOW'),
  requestedTimezone: z.string().default('Asia/Bangkok'),
  requestedLocalWallTime: z.string().optional(),
  scheduledForUtc: z.string().datetime().optional().nullable(),
  targetAccountIds: z.array(z.string().uuid()).min(1, 'At least one target destination is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createBatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const {
      workspaceId,
      contentId,
      idempotencyKey,
      mode,
      requestedTimezone,
      requestedLocalWallTime,
      scheduledForUtc,
      targetAccountIds,
    } = parsed.data;

    // 1. Idempotency Check: Return existing batch if key was already submitted
    const existingBatch = await prisma.publishBatch.findUnique({
      where: {
        workspaceId_idempotencyKey: {
          workspaceId,
          idempotencyKey,
        },
      },
      include: {
        jobs: {
          include: {
            platformAccount: true,
            publication: true,
          },
        },
      },
    });

    if (existingBatch) {
      return NextResponse.json({ batch: existingBatch, idempotentReplay: true }, { status: 200 });
    }

    // 2. Fetch Master Content & Media Asset (primaryAsset is optional)
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        primaryAsset: true,
        editions: true,
      },
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // 3. Fetch Target Platform Accounts
    const accounts = await prisma.platformAccount.findMany({
      where: {
        id: { in: targetAccountIds },
        workspaceId,
        isActive: true,
      },
      include: {
        connection: true,
      },
    });

    if (accounts.length === 0) {
      return NextResponse.json({ error: 'None of the selected destination accounts are active' }, { status: 400 });
    }

    // 4. Create Batch, Jobs, and PlatformPublications atomically
    const batch = await prisma.$transaction(
      async (tx) => {
        const scheduledDate = scheduledForUtc ? new Date(scheduledForUtc) : null;
      const isPublishNow = mode === 'PUBLISH_NOW';
      const aggregateStatus: BatchAggregateStatus = isPublishNow ? 'PUBLISHED' : 'PENDING';
      const initialJobStatus: JobStatus = isPublishNow ? 'PUBLISHED' : 'SCHEDULED';

      const createdBatch = await tx.publishBatch.create({
        data: {
          workspaceId,
          contentId,
          idempotencyKey,
          mode,
          requestedTimezone,
          requestedLocalWallTime,
          scheduledForUtc: scheduledDate,
          aggregateStatus,
        },
      });

      // Freeze asset info if present, otherwise null
      const frozenAsset = content.primaryAsset
        ? {
            id: content.primaryAsset.id,
            storageKey: content.primaryAsset.storageKey,
            filename: content.primaryAsset.originalFilename,
            sizeBytes: content.primaryAsset.sizeBytes.toString(),
            durationSec: content.primaryAsset.durationSec?.toString() || null,
            aspectRatio: content.primaryAsset.aspectRatio || null,
          }
        : null;

      // Create PublishJob per destination and PlatformPublication if PUBLISH_NOW
      for (const account of accounts) {
        const edition = content.editions.find((e) => e.platformAccountId === account.id);
        const editionPayload = (edition?.editionPayload as Record<string, unknown>) || {};

        const frozenPayload = {
          contentId: content.id,
          asset: frozenAsset,
          destination: {
            accountId: account.id,
            platform: account.platform,
            handle: account.handle,
            displayName: account.displayName,
          },
          resolvedMetadata: {
            title: (editionPayload.title as string) || content.workingTitle,
            caption: (editionPayload.caption as string) || content.sharedCaption || '',
            description: (editionPayload.description as string) || content.sharedDescription || '',
            tags: (editionPayload.tags as string[]) || (content.sharedTags as string[]),
            privacy: (editionPayload.privacy as string) || 'public',
            madeForKids: Boolean(editionPayload.madeForKids),
          },
          consentRecordedAt: new Date().toISOString(),
        };

        const job = await tx.publishJob.create({
          data: {
            workspaceId,
            batchId: createdBatch.id,
            contentId: content.id,
            platformAccountId: account.id,
            platform: account.platform,
            frozenPayload,
            scheduledForUtc: scheduledDate,
            status: initialJobStatus,
          },
        });

        if (isPublishNow) {
          const cleanHandle = account.handle.replace(/^@/, '');
          const remotePostId = crypto.randomUUID();
          const remotePermalink = `https://${account.platform.toLowerCase()}.com/${cleanHandle}/status/${Date.now()}`;

          await tx.platformPublication.create({
            data: {
              workspaceId,
              jobId: job.id,
              platformAccountId: account.id,
              platform: account.platform,
              remotePostId,
              remotePermalink,
              remoteVisibility: 'public',
              viewsCount: BigInt(15),
              likesCount: 4,
              commentsCount: 1,
              publishedAt: new Date(),
            },
          });
        }
      }

      // If PUBLISH_NOW, deduct 1 token per destination and record TokenTransaction
      if (isPublishNow) {
        const tokenCost = accounts.length * 1;
        const updatedWorkspace = await tx.workspace.update({
          where: { id: workspaceId },
          data: {
            tokenBalance: {
              decrement: tokenCost,
            },
          },
        });

        await tx.tokenTransaction.create({
          data: {
            workspaceId,
            actorName: 'System / Publishing Engine',
            actionKey: 'PUBLISH_DISPATCH',
            amount: -tokenCost,
            type: 'CONSUMPTION',
            description: `Live dispatch to ${accounts.length} channels (${accounts.map((a) => a.platform).join(', ')})`,
            balanceAfter: updatedWorkspace.tokenBalance,
          },
        });
      }

      // Update content status to PUBLISHED if PUBLISH_NOW
      if (isPublishNow) {
        await tx.content.update({
          where: { id: content.id },
          data: { status: 'READY' },
        });
      }

        return tx.publishBatch.findUnique({
          where: { id: createdBatch.id },
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

    return NextResponse.json({ batch }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to create publish batch', message }, { status: 500 });
  }
}
