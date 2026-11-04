import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, hashPassword, BUILTIN_USERS } from '@/modules/auth/auth-options';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = String(body.email || body.identifier || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 1. Check Neon PostgreSQL Database
    let dbUser = null;
    try {
      dbUser = await prisma.user.findFirst({
        where: {
          email: { equals: identifier, mode: 'insensitive' },
        },
        include: {
          memberships: {
            include: { workspace: true },
            take: 1,
          },
        },
      });
    } catch (dbErr) {
      console.warn('[Login API] DB query warning:', dbErr);
    }

    if (dbUser) {
      if (dbUser.status === 'BANNED') {
        return NextResponse.json(
          { success: false, message: 'บัญชีของคุณถูกระงับการใช้งานอย่างถาวรเนื่องจากละเมิดนโยบาย' },
          { status: 403 }
        );
      }
      if (dbUser.status === 'SUSPENDED') {
        return NextResponse.json(
          { success: false, message: 'บัญชีของคุณถูกระงับการใช้งานชั่วคราว กรุณาติดต่อฝ่ายสนับสนุน' },
          { status: 403 }
        );
      }

      const isValid = dbUser.passwordHash
        ? verifyPassword(password, dbUser.passwordHash)
        : false;

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
          { status: 401 }
        );
      }

      // Update last login IP
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { lastLoginIp: clientIp },
      }).catch(() => null);

      const membership = dbUser.memberships[0];
      const ws = membership?.workspace;

      const authUser = {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.email.split('@')[0],
        name: dbUser.name || dbUser.email.split('@')[0],
        role: (dbUser.systemRole === 'SUPER_ADMIN' ? 'Owner' : membership?.role === 'OWNER' ? 'Owner' : 'Manager') as 'Owner' | 'Manager',
        avatarBg: 'bg-brand-indigo',
        avatarText: (dbUser.name || dbUser.email).slice(0, 2).toUpperCase(),
        activeWorkspaceId: ws?.id || 'ws_main',
        createdAt: dbUser.createdAt.toISOString(),
      };

      const res = NextResponse.json({
        success: true,
        message: `ยินดีต้อนรับกลับ, ${authUser.name}!`,
        user: authUser,
      });

      // Set cookie for session persistence
      res.cookies.set('retzpost_session', JSON.stringify({
        id: authUser.id,
        email: authUser.email,
        role: authUser.role,
        workspaceId: authUser.activeWorkspaceId,
      }), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });

      return res;
    }

    // 2. Fallback to Built-in Seed Users
    const builtin = BUILTIN_USERS.find(
      (u) => u.email.toLowerCase() === identifier || u.name.toLowerCase().replace(/\s+/g, '') === identifier.replace(/[@\s]/g, '')
    );

    if (builtin && verifyPassword(password, builtin.passwordHash)) {
      const authUser = {
        id: builtin.id,
        email: builtin.email,
        username: builtin.email.split('@')[0],
        name: builtin.name,
        role: (builtin.systemRole === 'SUPER_ADMIN' ? 'Owner' : 'Manager') as 'Owner' | 'Manager',
        avatarBg: 'bg-brand-indigo',
        avatarText: builtin.name.slice(0, 2).toUpperCase(),
        activeWorkspaceId: builtin.activeWorkspaceId,
        createdAt: new Date().toISOString(),
      };

      const res = NextResponse.json({
        success: true,
        message: `ยินดีต้อนรับกลับ, ${authUser.name}!`,
        user: authUser,
      });

      res.cookies.set('retzpost_session', JSON.stringify({
        id: authUser.id,
        email: authUser.email,
        role: authUser.role,
        workspaceId: authUser.activeWorkspaceId,
      }), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });

      return res;
    }

    return NextResponse.json(
      { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[Login API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
