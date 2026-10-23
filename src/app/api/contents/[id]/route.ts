import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const updateContentSchema = z.object({
  expectedVersion: z.number().int().optional(),
  primaryAssetId: z.string().uuid().optional().nullable(),
  workingTitle: z.string().min(1).optional(),
  sharedCaption: z.string().optional().nullable(),
  sharedDescription: z.string().optional().nullable(),
  sharedTags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'READY', 'ARCHIVED']).optional(),
  editions: z
    .array(
      z.object({
        platformAccountId: z.string().uuid(),
        platform: z.enum(['YOUTUBE', 'TIKTOK']),
        overriddenFields: z.array(z.string()).default([]),
        editionPayload: z.record(z.unknown()).default({}),
        isValid: z.boolean().default(true),
        validationIssues: z.array(z.unknown()).default([]),
      })
    )
    .optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const contentId = params.id;

  try {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        primaryAsset: true,
        editions: {
          include: {
            platformAccount: true,
          },
        },
        publishBatches: {
          orderBy: { createdAt: 'desc' },
          include: {
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
        },
      },
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to retrieve content', message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const contentId = params.id;

  try {
    const body = await req.json();
    const parsed = updateContentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const {
      expectedVersion,
      primaryAssetId,
      workingTitle,
      sharedCaption,
      sharedDescription,
      sharedTags,
      status,
      editions,
    } = parsed.data;

    // Check existing content and version
    const existing = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    if (expectedVersion !== undefined && existing.version !== expectedVersion) {
      return NextResponse.json(
        {
          error: 'Concurrency conflict',
          message: 'This draft was modified by another session. Please reload to avoid overwriting.',
          currentVersion: existing.version,
        },
        { status: 409 }
      );
    }

    // Execute atomic update including editions upsert
    const updated = await prisma.$transaction(async (tx) => {
      const updatedContent = await tx.content.update({
        where: { id: contentId },
        data: {
          primaryAssetId: primaryAssetId !== undefined ? primaryAssetId : existing.primaryAssetId,
          workingTitle: workingTitle ?? existing.workingTitle,
          sharedCaption: sharedCaption !== undefined ? sharedCaption : existing.sharedCaption,
          sharedDescription: sharedDescription !== undefined ? sharedDescription : existing.sharedDescription,
          sharedTags: sharedTags ?? (existing.sharedTags as string[]),
          status: status ?? existing.status,
          version: { increment: 1 },
        },
        include: {
          primaryAsset: true,
        },
      });

      // Upsert editions if provided
      if (editions && editions.length > 0) {
        for (const ed of editions) {
          await tx.contentEdition.upsert({
            where: {
              contentId_platformAccountId: {
                contentId,
                platformAccountId: ed.platformAccountId,
              },
            },
            update: {
              overriddenFields: ed.overriddenFields,
              editionPayload: ed.editionPayload as object,
              isValid: ed.isValid,
              validationIssues: ed.validationIssues as object[],
            },
            create: {
              workspaceId: existing.workspaceId,
              contentId,
              platformAccountId: ed.platformAccountId,
              platform: ed.platform,
              overriddenFields: ed.overriddenFields,
              editionPayload: ed.editionPayload as object,
              isValid: ed.isValid,
              validationIssues: ed.validationIssues as object[],
            },
          });
        }
      }

      return updatedContent;
    });

    return NextResponse.json({ content: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to update draft content', message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const contentId = params.id;

  try {
    const existing = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    await prisma.content.delete({
      where: { id: contentId },
    });

    return NextResponse.json({ success: true, deletedId: contentId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to delete content', message }, { status: 500 });
  }
}
