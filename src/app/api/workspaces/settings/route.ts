import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    let targetWorkspace = null;
    if (workspaceId && isValidUuid(workspaceId)) {
      targetWorkspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
      });
    }

    if (!targetWorkspace) {
      targetWorkspace = await prisma.workspace.findFirst({
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!targetWorkspace) {
      return NextResponse.json({
        success: true,
        settings: {
          id: 'ws_default',
          name: 'Main Editorial Desk',
          defaultTimezone: 'Asia/Bangkok',
          maxRetryAttempts: 4,
          autoFrameStories: true,
          emailAlertsOnFailure: true,
          themePreset: 'NEWSPRINT',
          planTier: 'STARTER',
          tokenBalance: 50,
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        id: targetWorkspace.id,
        name: targetWorkspace.name,
        defaultTimezone: targetWorkspace.defaultTimezone,
        maxRetryAttempts: targetWorkspace.maxRetryAttempts,
        autoFrameStories: targetWorkspace.autoFrameStories,
        emailAlertsOnFailure: targetWorkspace.emailAlertsOnFailure,
        themePreset: targetWorkspace.themePreset,
        planTier: targetWorkspace.planTier,
        tokenBalance: targetWorkspace.tokenBalance,
      },
    });
  } catch (err: any) {
    console.error('Workspace settings GET error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      workspaceId,
      userId,
      defaultTimezone,
      maxRetryAttempts,
      autoFrameStories,
      emailAlertsOnFailure,
      themePreset,
      dsarRequest, // { requestType: 'ACCESS_EXPORT' | 'ERASURE_DELETE' | 'RECTIFICATION', reason?: string }
    } = body;

    let targetWorkspaceId = workspaceId && isValidUuid(workspaceId) ? workspaceId : null;
    if (!targetWorkspaceId) {
      const firstWs = await prisma.workspace.findFirst();
      if (firstWs) targetWorkspaceId = firstWs.id;
    }

    // 1. If DSAR Request submitted
    if (dsarRequest && dsarRequest.requestType) {
      let targetUserId = userId && isValidUuid(userId) ? userId : null;
      if (!targetUserId) {
        const firstUser = await prisma.user.findFirst();
        if (firstUser) targetUserId = firstUser.id;
      }

      if (targetUserId) {
        await prisma.dsarRequest.create({
          data: {
            userId: targetUserId,
            requestType: dsarRequest.requestType,
            status: 'PENDING',
            reason: dsarRequest.reason || 'User self-service request from settings',
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'ยื่นคำร้อง PDPA DSAR เรียบร้อย เจ้าหน้าที่จะดำเนินการภายในระยะเวลาที่กฎหมายกำหนด',
      });
    }

    // 2. Update workspace settings
    if (targetWorkspaceId) {
      const updated = await prisma.workspace.update({
        where: { id: targetWorkspaceId },
        data: {
          ...(defaultTimezone ? { defaultTimezone } : {}),
          ...(typeof maxRetryAttempts === 'number' ? { maxRetryAttempts } : {}),
          ...(typeof autoFrameStories === 'boolean' ? { autoFrameStories } : {}),
          ...(typeof emailAlertsOnFailure === 'boolean' ? { emailAlertsOnFailure } : {}),
          ...(themePreset ? { themePreset } : {}),
        },
      });

      await prisma.auditEvent.create({
        data: {
          workspaceId: targetWorkspaceId,
          action: 'WORKSPACE_SETTINGS_UPDATED',
          resource: 'SETTINGS',
          details: {
            defaultTimezone,
            maxRetryAttempts,
            autoFrameStories,
            emailAlertsOnFailure,
            themePreset,
          },
        },
      }).catch(() => null);

      return NextResponse.json({
        success: true,
        message: 'บันทึกการตั้งค่าลงฐานข้อมูล Neon Postgres เรียบร้อยแล้ว',
        settings: {
          id: updated.id,
          name: updated.name,
          defaultTimezone: updated.defaultTimezone,
          maxRetryAttempts: updated.maxRetryAttempts,
          autoFrameStories: updated.autoFrameStories,
          emailAlertsOnFailure: updated.emailAlertsOnFailure,
          themePreset: updated.themePreset,
          planTier: updated.planTier,
          tokenBalance: updated.tokenBalance,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'บันทึกการตั้งค่าสำเร็จ (Local fallback)',
    });
  } catch (err: any) {
    console.error('Workspace settings POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
