import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/modules/auth/auth-options';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password, name, pdpaConsent } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return NextResponse.json(
        { success: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { success: false, message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'อีเมลนี้มีผู้ใช้งานในระบบแล้ว กรุณาเข้าสู่ระบบ' },
        { status: 409 }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const displayName = name?.trim() || username?.trim() || cleanEmail.split('@')[0];
    const passwordHash = hashPassword(password);
    const slugBase = (username?.trim() || cleanEmail.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 20);
    const uniqueSlug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    // Create User, Workspace, Membership, and AuditEvent in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          email: cleanEmail,
          name: displayName,
          passwordHash,
          systemRole: 'USER',
          status: 'ACTIVE',
          pdpaConsentedAt: pdpaConsent ? new Date() : new Date(),
          lastLoginIp: clientIp,
        },
      });

      // 2. Provision default Workspace
      const workspace = await tx.workspace.create({
        data: {
          name: `${displayName}'s Desk`,
          slug: uniqueSlug,
          planTier: 'STARTER',
          billingCycle: 'MONTHLY',
          tokenBalance: 50,
          themePreset: 'NEWSPRINT',
          defaultTimezone: 'Asia/Bangkok',
        },
      });

      // 3. Create Membership (OWNER)
      await tx.membership.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: 'OWNER',
        },
      });

      // 4. Log PDPA & Registration Audit Event
      await tx.auditEvent.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          action: 'USER_REGISTERED_PDPA_CONSENTED',
          resource: 'AUTH',
          details: {
            email: cleanEmail,
            ip: clientIp,
            pdpaTermsVersion: '2026.1',
            starterTokensAllocated: 50,
          },
        },
      });

      return { user, workspace };
    });

    return NextResponse.json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ ยินดีต้อนรับสู่ RETZPOST',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        workspaceId: result.workspace.id,
        planTier: result.workspace.planTier,
        tokenBalance: result.workspace.tokenBalance,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
