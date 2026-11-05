import { NextRequest, NextResponse } from 'next/server';
import { runScheduledPublishCycle } from '@/modules/scheduler/dispatcher';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get('authorization');
    const vercelCronHeader = req.headers.get('x-vercel-cron');

    // Validation:
    // If CRON_SECRET is configured, validate Authorization Bearer or Vercel Cron header
    if (cronSecret) {
      const isBearerValid = authHeader === `Bearer ${cronSecret}`;
      const isVercelCron = Boolean(vercelCronHeader);

      if (!isBearerValid && !isVercelCron) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Invalid cron authorization' },
          { status: 401 }
        );
      }
    }

    const cycleResult = await runScheduledPublishCycle();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      dispatched: cycleResult.dispatched,
      executed: cycleResult.executed,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Cron Publish] Error running scheduled cycle:', error);
    return NextResponse.json(
      {
        success: false,
        error: message || 'Internal server error running publish cycle',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
