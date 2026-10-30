import { DefaultSession } from 'next-auth';
import { PlanTier, ThemePreset } from '@/modules/billing/pricing-plans';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      systemRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
      status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
      workspaceId?: string | null;
      planTier: PlanTier;
      tokenBalance: number;
      themePreset?: ThemePreset;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    systemRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
    workspaceId?: string | null;
    planTier: PlanTier;
    tokenBalance: number;
    themePreset?: ThemePreset;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    systemRole?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    status?: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
    workspaceId?: string | null;
    planTier?: PlanTier;
    tokenBalance?: number;
    themePreset?: ThemePreset;
  }
}
