import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const createContentSchema = z.object({
  workspaceId: z.string().uuid(),
  primaryAssetId: z.string().uuid().optional().nullable(),
  workingTitle: z.string().min(1).default('Untitled Story'),
  sharedCaption: z.string().optional().nullable(),
  sharedDescription: z.string().optional().nullable(),
  sharedTags: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId query parameter is required' }, { status: 400 });
    }

    const whereClause: Record<string, unknown> = {
      workspaceId,
    };

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { workingTitle: { contains: search, mode: 'insensitive' } },
        { sharedCaption: { contains: search, mode: 'insensitive' } },
      ];
    }

    const contents = await prisma.content.findMany({
      where: whereClause,
      include: {
        primaryAsset: true,
        editions: {
          include: {
            platformAccount: true,
          },
        },
        publishBatches: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            jobs: {
              include: {
                publication: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ contents });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to fetch contents', message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createContentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { workspaceId, primaryAssetId, workingTitle, sharedCaption, sharedDescription, sharedTags } = parsed.data;

    const content = await prisma.content.create({
      data: {
        workspaceId,
        primaryAssetId,
        workingTitle,
        sharedCaption,
        sharedDescription,
        sharedTags,
        status: 'DRAFT',
        version: 1,
      },
      include: {
        primaryAsset: true,
      },
    });

    return NextResponse.json({ content }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to create draft content', message }, { status: 500 });
  }
}
