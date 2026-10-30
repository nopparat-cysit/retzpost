import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TOKEN_RATES, canAffordTokens } from '@/modules/billing/pricing-plans';

export const dynamic = 'force-dynamic';

function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // 1. Fetch user or first workspace
    let user = null;
    if (userId && isValidUuid(userId)) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          memberships: {
            include: { workspace: true },
          },
        },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          memberships: {
            include: { workspace: true },
          },
        },
      });
    }

    // 2. Fetch recent token transactions
    const transactions = await prisma.tokenTransaction.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    }).catch(() => []);

    const primaryWs = user?.memberships[0]?.workspace;
    const masterBalance = user?.masterTokenBalance ?? primaryWs?.tokenBalance ?? 600;
    const activePlan = user?.activePlanTier || primaryWs?.planTier || 'CREATOR';

    // Group consumption by actorName
    const memberConsumptionMap: Record<string, { actorName: string; totalConsumed: number; actionsCount: number }> = {};
    transactions.forEach((tx) => {
      const actor = tx.actorName || 'ระบบหลัก (System)';
      if (!memberConsumptionMap[actor]) {
        memberConsumptionMap[actor] = { actorName: actor, totalConsumed: 0, actionsCount: 0 };
      }
      if (tx.amount < 0) {
        memberConsumptionMap[actor].totalConsumed += Math.abs(tx.amount);
        memberConsumptionMap[actor].actionsCount++;
      }
    });

    return NextResponse.json({
      success: true,
      masterTokenBalance: masterBalance,
      activePlanTier: activePlan,
      trialStartedAt: user?.trialStartedAt,
      trialEndsAt: user?.trialEndsAt,
      promoEligible: user?.promoEligible ?? true,
      recentTransactions: transactions.map((t) => ({
        id: t.id,
        actorName: t.actorName || 'Staff Member',
        actionKey: t.actionKey || t.type,
        amount: t.amount,
        type: t.type,
        description: t.description,
        balanceAfter: t.balanceAfter,
        createdAt: t.createdAt,
      })),
      memberBreakdown: Object.values(memberConsumptionMap),
    });
  } catch (err: any) {
    console.error('Master Tokens GET error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      actorName = 'แอดมิน (Team Member)',
      actionKey, // 'AI_POST_DIAGNOSIS' | 'AI_KPI_COACHING' | 'FORCE_SYNC_NOW' | 'SMART_AUTOFRAME'
      description,
      workspaceName = 'Main Studio',
    } = body;

    if (!actionKey || !TOKEN_RATES[actionKey as keyof typeof TOKEN_RATES]) {
      return NextResponse.json(
        { success: false, message: 'รหัสกิจกรรม (Action Key) ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const tokensToDeduct = TOKEN_RATES[actionKey as keyof typeof TOKEN_RATES];

    // Find user & workspace
    let user = null;
    if (userId && isValidUuid(userId)) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { memberships: { include: { workspace: true } } },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { memberships: { include: { workspace: true } } },
      });
    }

    const primaryWs = user?.memberships[0]?.workspace;
    const currentBalance = user?.masterTokenBalance ?? primaryWs?.tokenBalance ?? 600;

    if (currentBalance < tokensToDeduct) {
      return NextResponse.json(
        {
          success: false,
          message: `เหรียญ Master Token ไม่เพียงพอ (คงเหลือ ${currentBalance} 🪙 ต้องการ ${tokensToDeduct} 🪙) กรุณาเติมเหรียญเพิ่ม`,
          currentBalance,
          required: tokensToDeduct,
        },
        { status: 402 }
      );
    }

    const newBalance = currentBalance - tokensToDeduct;

    // Execute database update
    if (user && primaryWs) {
      try {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { masterTokenBalance: newBalance },
          }),
          prisma.workspace.update({
            where: { id: primaryWs.id },
            data: { tokenBalance: newBalance },
          }),
          prisma.tokenTransaction.create({
            data: {
              workspaceId: primaryWs.id,
              userId: user.id,
              actorName,
              actionKey,
              amount: -tokensToDeduct,
              type: 'MASTER_WALLET_CONSUMPTION',
              description: description || `หัก ${tokensToDeduct} 🪙 สำหรับ ${actionKey} (${workspaceName})`,
              balanceAfter: newBalance,
            },
          }),
        ]);
      } catch (dbErr: any) {
        console.warn('DB Token transaction bypass:', dbErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `หัก ${tokensToDeduct} Press Tokens สำเร็จ`,
      deducted: tokensToDeduct,
      balanceAfter: newBalance,
      actorName,
      actionKey,
    });
  } catch (err: any) {
    console.error('Master Tokens POST deduction error:', err);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการตัดเหรียญ' },
      { status: 500 }
    );
  }
}
