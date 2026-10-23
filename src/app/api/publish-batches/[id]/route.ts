import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
