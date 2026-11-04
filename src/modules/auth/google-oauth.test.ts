import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { authOptions } from './auth-options';
import { th } from '@/modules/i18n/translations/th';
import { en } from '@/modules/i18n/translations/en';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    workspace: {
      create: vi.fn(),
    },
    membership: {
      create: vi.fn(),
    },
  },
}));

describe('Google OAuth & NextAuth Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Provider Configuration', () => {
    it('should include GoogleProvider in authOptions.providers when credentials are set', () => {
      const googleProvider = authOptions.providers.find(
        (p: any) => p.id === 'google' || p.name === 'Google'
      );
      expect(googleProvider).toBeDefined();
    });
  });

  describe('signIn callback with Google provider', () => {
    const signInCallback = authOptions.callbacks?.signIn;

    it('should create new workspace, user, and membership when Google user does not exist', async () => {
      expect(signInCallback).toBeDefined();
      if (!signInCallback) return;

      const mockUserFindFirst = prisma.user.findFirst as any;
      const mockWorkspaceCreate = prisma.workspace.create as any;
      const mockUserCreate = prisma.user.create as any;

      mockUserFindFirst.mockResolvedValueOnce(null);

      const mockWs = {
        id: 'ws-google-new-uuid',
        name: 'New Creator Studio',
        slug: 'studio-test-slug',
        tokenBalance: 50,
        planTier: 'STARTER' as const,
      };
      mockWorkspaceCreate.mockResolvedValueOnce(mockWs);

      const mockUser = {
        id: 'usr-google-new-uuid',
        email: 'newgoogle@gmail.com',
        name: 'New Google User',
        systemRole: 'USER' as const,
        status: 'ACTIVE' as const,
      };
      mockUserCreate.mockResolvedValueOnce(mockUser);

      const userArg: any = {
        email: 'NewGoogle@gmail.com',
        name: 'New Google User',
        image: 'https://lh3.googleusercontent.com/avatar.jpg',
      };
      const accountArg: any = {
        provider: 'google',
      };

      const result = await signInCallback({
        user: userArg,
        account: accountArg,
        profile: undefined,
        email: undefined,
        credentials: undefined,
      });

      expect(result).toBe(true);
      expect(mockUserFindFirst).toHaveBeenCalledWith({
        where: {
          email: {
            equals: 'newgoogle@gmail.com',
            mode: 'insensitive',
          },
        },
        include: {
          memberships: {
            include: {
              workspace: true,
            },
            take: 1,
          },
        },
      });

      expect(mockWorkspaceCreate).toHaveBeenCalled();
      expect(mockUserCreate).toHaveBeenCalled();

      // Attached properties check
      expect(userArg.id).toBe(mockUser.id);
      expect(userArg.systemRole).toBe('USER');
      expect(userArg.workspaceId).toBe(mockWs.id);
      expect(userArg.planTier).toBe('STARTER');
      expect(userArg.tokenBalance).toBe(50);
    });

    it('should link to existing user and default workspace when email already exists', async () => {
      expect(signInCallback).toBeDefined();
      if (!signInCallback) return;

      const mockUserFindFirst = prisma.user.findFirst as any;
      const mockUserUpdate = prisma.user.update as any;

      const existingRecord = {
        id: 'usr-existing-uuid',
        email: 'existing@retzpost.io',
        name: 'Existing User',
        avatarUrl: null,
        systemRole: 'USER' as const,
        status: 'ACTIVE' as const,
        memberships: [
          {
            workspace: {
              id: 'ws-existing-uuid',
              name: 'Existing Studio',
              slug: 'studio-existing',
              tokenBalance: 120,
              planTier: 'STUDIO_PRO' as const,
            },
          },
        ],
      };
      mockUserFindFirst.mockResolvedValueOnce(existingRecord);
      mockUserUpdate.mockResolvedValueOnce(existingRecord);

      const userArg: any = {
        email: 'existing@retzpost.io',
        name: 'Existing User',
        image: 'https://lh3.googleusercontent.com/avatar-new.jpg',
      };
      const accountArg: any = {
        provider: 'google',
      };

      const result = await signInCallback({
        user: userArg,
        account: accountArg,
        profile: undefined,
        email: undefined,
        credentials: undefined,
      });

      expect(result).toBe(true);
      expect(userArg.id).toBe('usr-existing-uuid');
      expect(userArg.workspaceId).toBe('ws-existing-uuid');
      expect(userArg.planTier).toBe('STUDIO_PRO');
      expect(userArg.tokenBalance).toBe(120);

      // Verify avatar update was triggered
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: 'usr-existing-uuid' },
        data: { avatarUrl: 'https://lh3.googleusercontent.com/avatar-new.jpg' },
      });
    });

    it('should reject sign-in when existing account is BANNED or SUSPENDED', async () => {
      expect(signInCallback).toBeDefined();
      if (!signInCallback) return;

      const mockUserFindFirst = prisma.user.findFirst as any;
      mockUserFindFirst.mockResolvedValueOnce({
        id: 'usr-banned',
        email: 'banned@bad.com',
        status: 'BANNED' as const,
        memberships: [],
      });

      const userArg: any = { email: 'banned@bad.com' };
      const accountArg: any = { provider: 'google' };

      const result = await signInCallback({
        user: userArg,
        account: accountArg,
        profile: undefined,
        email: undefined,
        credentials: undefined,
      });

      expect(result).toBe(false);
    });
  });

  describe('JWT and Session callbacks', () => {
    it('should populate token and session correctly', async () => {
      const jwtCallback = authOptions.callbacks?.jwt;
      const sessionCallback = authOptions.callbacks?.session;

      expect(jwtCallback).toBeDefined();
      expect(sessionCallback).toBeDefined();
      if (!jwtCallback || !sessionCallback) return;

      const userArg: any = {
        id: 'usr-token-test',
        email: 'jwt@retzpost.io',
        name: 'JWT User',
        systemRole: 'USER',
        status: 'ACTIVE',
        workspaceId: 'ws-jwt-test',
        planTier: 'STARTER',
        tokenBalance: 50,
      };

      const tokenResult = await jwtCallback({
        token: {},
        user: userArg,
      } as any);

      expect(tokenResult.id).toBe('usr-token-test');
      expect(tokenResult.workspaceId).toBe('ws-jwt-test');
      expect(tokenResult.planTier).toBe('STARTER');
      expect(tokenResult.tokenBalance).toBe(50);

      const sessionResult = (await sessionCallback({
        session: { user: {} } as any,
        token: tokenResult,
      } as any)) as any;

      expect(sessionResult.user?.id).toBe('usr-token-test');
      expect(sessionResult.user?.workspaceId).toBe('ws-jwt-test');
      expect(sessionResult.user?.planTier).toBe('STARTER');
      expect(sessionResult.user?.tokenBalance).toBe(50);
    });
  });

  describe('Bilingual i18n Typography & Consistency Invariants', () => {
    it('should have pure Thai translations with zero parenthetical English tells', () => {
      expect(th.auth.signInWithGoogle).toBe('เข้าสู่ระบบด้วย Google');
      expect(th.auth.signUpWithGoogle).toBe('ลงทะเบียนด้วย Google');
      expect(th.auth.orDivider).toBe('หรือ');

      // Zero parenthetical English tells in auth strings
      expect(th.auth.signInWithGoogle).not.toMatch(/\([A-Za-z\s]+\)/);
      expect(th.auth.signUpWithGoogle).not.toMatch(/\([A-Za-z\s]+\)/);
      expect(th.auth.orDivider).not.toMatch(/\([A-Za-z\s]+\)/);
    });

    it('should have pure English translations with zero Thai script', () => {
      expect(en.auth.signInWithGoogle).toBe('Sign in with Google');
      expect(en.auth.signUpWithGoogle).toBe('Sign up with Google');
      expect(en.auth.orDivider).toBe('or');

      // Zero Thai unicode range (\u0E00-\u0E7F)
      expect(/[\u0E00-\u0E7F]/.test(en.auth.signInWithGoogle)).toBe(false);
      expect(/[\u0E00-\u0E7F]/.test(en.auth.signUpWithGoogle)).toBe(false);
      expect(/[\u0E00-\u0E7F]/.test(en.auth.orDivider)).toBe(false);
    });
  });
});
