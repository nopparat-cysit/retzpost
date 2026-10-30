import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PlanTier, DEFAULT_PLATFORM_SETTINGS, PlatformSystemSettings } from '@/modules/billing/pricing-plans';

export const dynamic = 'force-dynamic';

let inMemoryPlatformSettings: PlatformSystemSettings = { ...DEFAULT_PLATFORM_SETTINGS };

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch Users & Workspaces
    const users = await prisma.user.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
        },
      },
    }).catch(() => []);

    const workspaces = await prisma.workspace.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    }).catch(() => []);

    // 2. Fetch Invoices
    const invoices = await prisma.subscriptionInvoice.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        workspace: true,
      },
    }).catch(() => []);

    // 3. Fetch DSAR Requests
    const dsarRequests = await prisma.dsarRequest.findMany({
      take: 50,
      orderBy: { requestedAt: 'desc' },
      include: {
        user: true,
      },
    }).catch(() => []);

    // 4. Fetch Computer Crime Act Sec 26 Audit Events (last 90 days queryable)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const auditLogs = await prisma.auditEvent.findMany({
      where: {
        createdAt: { gte: ninetyDaysAgo },
      },
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
      },
    }).catch(() => []);

    // 5. Aggregate metrics
    const userTierCounts: Record<PlanTier, number> = {
      STARTER: 0,
      SOLO: 0,
      CREATOR: 0,
      STUDIO_PRO: 0,
      AGENCY: 0,
    };

    let totalTokensInCirculation = 0;
    workspaces.forEach((ws) => {
      const tier = (ws.planTier as PlanTier) || 'STARTER';
      if (userTierCounts[tier] !== undefined) {
        userTierCounts[tier]++;
      }
      totalTokensInCirculation += ws.tokenBalance;
    });

    // Compute estimated MRR with 79 / 199 / 599 / 1490 ladder
    const mrr = 
      (userTierCounts.SOLO * 79) +
      (userTierCounts.CREATOR * 199) + 
      (userTierCounts.STUDIO_PRO * 599) + 
      (userTierCounts.AGENCY * 1490);

    const pendingInvoicesCount = invoices.filter(i => i.paymentStatus === 'PENDING').length;
    const pendingDsarCount = dsarRequests.filter(d => d.status === 'PENDING').length;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      platformSettings: inMemoryPlatformSettings,
      metrics: {
        totalUsers: users.length,
        totalWorkspaces: workspaces.length,
        mrrThb: mrr,
        totalTokensInCirculation,
        userTierCounts,
        pendingInvoicesCount,
        pendingDsarCount,
        auditLogsRetainedCount: auditLogs.length,
      },
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        systemRole: u.systemRole,
        status: u.status,
        lastLoginIp: u.lastLoginIp,
        masterTokenBalance: u.masterTokenBalance,
        activePlanTier: u.activePlanTier,
        trialStartedAt: u.trialStartedAt,
        trialEndsAt: u.trialEndsAt,
        promoEligible: u.promoEligible,
        pdpaConsentedAt: u.pdpaConsentedAt,
        createdAt: u.createdAt,
        workspace: u.memberships[0]?.workspace ? {
          id: u.memberships[0].workspace.id,
          name: u.memberships[0].workspace.name,
          planTier: u.memberships[0].workspace.planTier,
          tokenBalance: u.memberships[0].workspace.tokenBalance,
          themePreset: u.memberships[0].workspace.themePreset,
        } : null,
      })),
      invoices: invoices.map((inv) => ({
        id: inv.id,
        workspaceId: inv.workspaceId,
        workspaceName: inv.workspace?.name || 'Workspace',
        planTier: inv.planTier,
        billingCycle: inv.billingCycle,
        amountThb: inv.amountThb,
        vatAmountThb: inv.vatAmountThb,
        totalAmountThb: inv.totalAmountThb,
        paymentMethod: inv.paymentMethod,
        paymentStatus: inv.paymentStatus,
        promptPaySlipUrl: inv.promptPaySlipUrl,
        taxInvoiceRequested: inv.taxInvoiceRequested,
        companyName: inv.companyName,
        taxId: inv.taxId,
        branchId: inv.branchId,
        createdAt: inv.createdAt,
      })),
      dsarRequests: dsarRequests.map((d) => ({
        id: d.id,
        userId: d.userId,
        userEmail: d.user?.email || 'Unknown',
        requestType: d.requestType,
        status: d.status,
        reason: d.reason,
        requestedAt: d.requestedAt,
        completedAt: d.completedAt,
      })),
      auditLogs: auditLogs.map((log) => ({
        id: log.id,
        createdAt: log.createdAt,
        userEmail: log.user?.email || 'SYSTEM',
        action: log.action,
        resource: log.resource,
        details: log.details,
      })),
    });
  } catch (err: any) {
    console.error('Super Admin Overview error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admin overview' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, targetId, payload } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, message: 'Action is required' },
        { status: 400 }
      );
    }

    switch (action) {
      // 0. Update Platform Settings
      case 'UPDATE_PLATFORM_SETTINGS': {
        inMemoryPlatformSettings = {
          ...inMemoryPlatformSettings,
          ...payload,
        };
        return NextResponse.json({
          success: true,
          message: 'บันทึกการตั้งค่าระบบและโปรโมชั่นเรียบร้อยแล้ว',
          platformSettings: inMemoryPlatformSettings,
        });
      }

      // 1. Change user plan
      case 'UPDATE_PLAN': {
        const { planTier } = payload;
        await prisma.workspace.update({
          where: { id: targetId },
          data: { planTier },
        });
        return NextResponse.json({ success: true, message: `Updated workspace plan to ${planTier}` });
      }

      // 2. Adjust tokens (Credit / Deduct)
      case 'ADJUST_TOKENS': {
        const { amount, reason } = payload;
        const ws = await prisma.workspace.findUnique({ where: { id: targetId } });
        if (!ws) throw new Error('Workspace not found');

        const newBalance = Math.max(0, ws.tokenBalance + Number(amount));
        await prisma.$transaction([
          prisma.workspace.update({
            where: { id: targetId },
            data: { tokenBalance: newBalance },
          }),
          prisma.tokenTransaction.create({
            data: {
              workspaceId: targetId,
              amount: Number(amount),
              type: Number(amount) >= 0 ? 'ADMIN_CREDIT' : 'ADMIN_DEDUCTION',
              description: reason || 'Super Admin token adjustment',
              balanceAfter: newBalance,
            },
          }),
        ]);
        return NextResponse.json({
          success: true,
          message: `Adjusted tokens by ${amount}. New balance: ${newBalance}`,
          newBalance,
        });
      }

      // 3. User account status (ACTIVE, SUSPENDED, BANNED)
      case 'UPDATE_USER_STATUS': {
        const { status } = payload;
        await prisma.user.update({
          where: { id: targetId },
          data: { status },
        });
        return NextResponse.json({ success: true, message: `User status changed to ${status}` });
      }

      // 4. Approve / Reject invoice slip
      case 'UPDATE_INVOICE_STATUS': {
        const { status } = payload;
        const inv = await prisma.subscriptionInvoice.findUnique({
          where: { id: targetId },
        });
        if (!inv) throw new Error('Invoice not found');

        await prisma.subscriptionInvoice.update({
          where: { id: targetId },
          data: {
            paymentStatus: status,
            paidAt: status === 'COMPLETED' ? new Date() : null,
          },
        });

        // If approved, ensure workspace is updated
        if (status === 'COMPLETED' && inv.planTier !== 'STARTER') {
          await prisma.workspace.update({
            where: { id: inv.workspaceId },
            data: {
              planTier: inv.planTier,
              billingCycle: inv.billingCycle,
            },
          });
        }
        return NextResponse.json({ success: true, message: `Invoice status updated to ${status}` });
      }

      // 5. Complete / Resolve PDPA DSAR request
      case 'RESOLVE_DSAR': {
        const { status, notes } = payload;
        await prisma.dsarRequest.update({
          where: { id: targetId },
          data: {
            status,
            notes: notes || 'Processed by Super Admin',
            completedAt: new Date(),
          },
        });
        return NextResponse.json({ success: true, message: `DSAR request resolved with status: ${status}` });
      }

      default:
        return NextResponse.json(
          { success: false, message: `Unknown admin action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err: any) {
    console.error('Super Admin POST action error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Admin action failed' },
      { status: 500 }
    );
  }
}
