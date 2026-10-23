import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { deriveBatchAggregateStatus } from '@/modules/publishing/state-machine';

const createBatchSchema = z.object({
  workspaceId: z.string().uuid(),
  contentId: z.string().uuid(),
  idempotencyKey: z.string().uuid(),
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

    // 2. Fetch Master Content & Media Asset
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

    if (!content.primaryAsset) {
      return NextResponse.json({ error: 'Cannot publish content without a primary video asset' }, { status: 400 });
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

    // 4. Create Batch and Jobs atomically with frozen snapshots
    const batch = await prisma.$transaction(async (tx) => {
      const scheduledDate = scheduledForUtc ? new Date(scheduledForUtc) : null;
      const initialJobStatus = mode === 'SCHEDULED' ? 'SCHEDULED' : 'QUEUED';

      const createdBatch = await tx.publishBatch.create({
        data: {
          workspaceId,
          contentId,
          idempotencyKey,
          mode,
          requestedTimezone,
          requestedLocalWallTime,
          scheduledForUtc: scheduledDate,
          aggregateStatus: mode === 'SCHEDULED' ? 'PENDING' : 'IN_PROGRESS',
        },
      });

      // Freeze payload and create PublishJob per destination
      for (const account of accounts) {
        const edition = content.editions.find((e) => e.platformAccountId === account.id);
        const editionPayload = (edition?.editionPayload as Record<string, unknown>) || {};

        // Resolve immutable snapshot
        const frozenPayload = {
          contentId: content.id,
          asset: {
            id: content.primaryAsset!.id,
            storageKey: content.primaryAsset!.storageKey,
            filename: content.primaryAsset!.originalFilename,
            sizeBytes: content.primaryAsset!.sizeBytes.toString(),
            durationSec: content.primaryAsset!.durationSec?.toString(),
            aspectRatio: content.primaryAsset!.aspectRatio,
          },
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

        await tx.publishJob.create({
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
    });

    return NextResponse.json({ batch }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to create publish batch', message }, { status: 500 });
  }
}
