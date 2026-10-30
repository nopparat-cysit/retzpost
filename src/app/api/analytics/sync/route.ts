import { NextRequest, NextResponse } from 'next/server';
import { syncWorkspaceTelemetry } from '@/modules/analytics/sync-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional
    }

    const workspaceId = body.workspaceId || 'ALL';
    const force = Boolean(body.force);
    const mockPosts = Array.isArray(body.mockPosts) ? body.mockPosts : undefined;

    const result = await syncWorkspaceTelemetry(workspaceId, {
      force,
      mockPosts,
    });

    if (result.status === 'COOLDOWN_ACTIVE') {
      return NextResponse.json(result, {
        status: 429,
        headers: {
          'Retry-After': String(result.cooldownSecondsRemaining),
        },
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/analytics/sync] Internal error:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'เกิดข้อผิดพลาดในการเชื่อมต่อซิงค์สถิติ',
        error: error?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId') || 'ALL';
    const force = searchParams.get('force') === 'true';

    const result = await syncWorkspaceTelemetry(workspaceId, {
      force,
    });

    if (result.status === 'COOLDOWN_ACTIVE') {
      return NextResponse.json(result, {
        status: 429,
        headers: {
          'Retry-After': String(result.cooldownSecondsRemaining),
        },
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('[API GET /api/analytics/sync] Internal error:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'เกิดข้อผิดพลาดในการตรวจสอบสถิติ',
        error: error?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
