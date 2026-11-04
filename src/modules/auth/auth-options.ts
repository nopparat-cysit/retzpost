import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Password hashing helper using standard Node.js crypto
export function hashPassword(password: string, salt = 'retzpost_salt_2026'): string {
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  // If hash matches direct scryptSync
  const calculated = hashPassword(password);
  if (calculated === hash) return true;
  // Fallback for plain demo passwords (e.g. Password123! or SuperAdmin2026!)
  if (password === hash) return true;
  return false;
}

// Built-in Seed fallback users for development and testing
export const BUILTIN_USERS = [
  {
    id: 'usr_losstary',
    email: 'losstary@gmail.com',
    name: 'Nopparat Losstary',
    systemRole: 'SUPER_ADMIN' as const,
    passwordHash: '123123123',
    status: 'ACTIVE' as const,
    activeWorkspaceId: 'ws_main',
    planTier: 'STUDIO_PRO' as const,
    tokenBalance: 2000,
  },
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'superadmin@retzpost.io',
    name: 'RetzPost Super Admin',
    systemRole: 'SUPER_ADMIN' as const,
    passwordHash: 'SuperAdmin2026!',
    status: 'ACTIVE' as const,
    activeWorkspaceId: '00000000-0000-0000-0000-000000000010',
    planTier: 'AGENCY' as const,
    tokenBalance: 8000,
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'demo.owner@gmail.com',
    name: 'Demo Owner',
    systemRole: 'USER' as const,
    passwordHash: 'Password123!',
    status: 'ACTIVE' as const,
    activeWorkspaceId: '00000000-0000-0000-0000-000000000011',
    planTier: 'STUDIO_PRO' as const,
    tokenBalance: 2000,
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'demo.manager@gmail.com',
    name: 'Demo Manager',
    systemRole: 'USER' as const,
    passwordHash: 'Password123!',
    status: 'ACTIVE' as const,
    activeWorkspaceId: '00000000-0000-0000-0000-000000000012',
    planTier: 'CREATOR' as const,
    tokenBalance: 500,
  },
];

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email or Username', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials, req) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('กรุณากรอกอีเมลและรหัสผ่าน');
      }

      const input = credentials.email.trim().toLowerCase();
      const clientIp = (req?.headers?.['x-forwarded-for'] as string) || '127.0.0.1';

      // 1. Try checking Neon Postgres Database first
      try {
        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: input,
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

        if (user) {
          if (user.status === 'BANNED') {
            throw new Error('บัญชีของคุณถูกระงับการใช้งานอย่างถาวรเนื่องจากละเมิดนโยบาย');
          }
          if (user.status === 'SUSPENDED') {
            throw new Error('บัญชีของคุณถูกระงับการใช้งานชั่วคราว กรุณาติดต่อฝ่ายสนับสนุน');
          }

          const valid = user.passwordHash
            ? verifyPassword(credentials.password, user.passwordHash)
            : false;

          if (valid) {
            // Update last login IP for Computer Crime Act compliance
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginIp: clientIp },
            }).catch(() => null);

            const defaultWs = user.memberships[0]?.workspace;

            return {
              id: user.id,
              email: user.email,
              name: user.name || user.email.split('@')[0],
              systemRole: user.systemRole,
              status: user.status,
              workspaceId: defaultWs?.id || null,
              planTier: defaultWs?.planTier || 'STARTER',
              tokenBalance: defaultWs?.tokenBalance ?? 50,
            };
          }
        }
      } catch (dbErr: any) {
        // If message is our custom error, rethrow
        if (dbErr.message?.includes('บัญชีของคุณ')) {
          throw dbErr;
        }
        console.warn('[NextAuth] DB query bypassed, falling back to seed accounts:', dbErr?.message);
      }

      // 2. Fallback to Built-in Seed Accounts
      const matchedBuiltin = BUILTIN_USERS.find(
        (u) => u.email.toLowerCase() === input || u.name.toLowerCase().replace(/\s+/g, '') === input.replace(/[@\s]/g, '')
      );

      if (matchedBuiltin) {
        const valid = verifyPassword(credentials.password, matchedBuiltin.passwordHash);
        if (valid) {
          return {
            id: matchedBuiltin.id,
            email: matchedBuiltin.email,
            name: matchedBuiltin.name,
            systemRole: matchedBuiltin.systemRole,
            status: matchedBuiltin.status,
            workspaceId: matchedBuiltin.activeWorkspaceId,
            planTier: matchedBuiltin.planTier,
            tokenBalance: matchedBuiltin.tokenBalance,
          };
        }
      }

      throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'retzpost-super-secret-jwt-key-32-chars-min',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          const emailNormalized = user.email.trim().toLowerCase();
          const existingUser = await prisma.user.findFirst({
            where: {
              email: {
                equals: emailNormalized,
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

          if (existingUser) {
            if (existingUser.status === 'BANNED' || existingUser.status === 'SUSPENDED') {
              return false;
            }

            let workspace = existingUser.memberships[0]?.workspace;
            if (!workspace) {
              const newWs = await prisma.workspace.create({
                data: {
                  name: `${existingUser.name || 'My'} Studio`,
                  slug: `studio-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
                  tokenBalance: 50,
                  planTier: 'STARTER',
                },
              });
              await prisma.membership.create({
                data: {
                  workspaceId: newWs.id,
                  userId: existingUser.id,
                  role: 'OWNER',
                },
              });
              workspace = newWs;
            }

            user.id = existingUser.id;
            (user as any).systemRole = existingUser.systemRole;
            (user as any).status = existingUser.status;
            (user as any).workspaceId = workspace.id;
            (user as any).planTier = workspace.planTier;
            (user as any).tokenBalance = workspace.tokenBalance;

            // Sync avatar if existing user has none
            if (!existingUser.avatarUrl && user.image) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { avatarUrl: user.image },
              }).catch(() => null);
            }
          } else {
            // Create default Workspace first
            const studioName = `${user.name || 'My'} Studio`;
            const studioSlug = `studio-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
            const newWs = await prisma.workspace.create({
              data: {
                name: studioName,
                slug: studioSlug,
                tokenBalance: 50,
                planTier: 'STARTER',
              },
            });

            // Create User with membership
            const newUser = await prisma.user.create({
              data: {
                email: emailNormalized,
                name: user.name || emailNormalized.split('@')[0],
                avatarUrl: user.image || null,
                systemRole: 'USER',
                memberships: {
                  create: {
                    workspaceId: newWs.id,
                    role: 'OWNER',
                  },
                },
              },
            });

            user.id = newUser.id;
            (user as any).systemRole = newUser.systemRole;
            (user as any).status = newUser.status;
            (user as any).workspaceId = newWs.id;
            (user as any).planTier = newWs.planTier;
            (user as any).tokenBalance = newWs.tokenBalance;
          }
        } catch (dbErr: any) {
          console.warn('[NextAuth] Google signIn DB query error, using fallback session data:', dbErr?.message);
          user.id = user.id || `usr_google_${Date.now().toString(36)}`;
          (user as any).systemRole = (user as any).systemRole || 'USER';
          (user as any).status = (user as any).status || 'ACTIVE';
          (user as any).workspaceId = (user as any).workspaceId || 'ws_main';
          (user as any).planTier = (user as any).planTier || 'STARTER';
          (user as any).tokenBalance = (user as any).tokenBalance ?? 50;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.systemRole = (user as any).systemRole || 'USER';
        token.status = (user as any).status || 'ACTIVE';
        token.workspaceId = (user as any).workspaceId || null;
        token.planTier = (user as any).planTier || 'STARTER';
        token.tokenBalance = typeof (user as any).tokenBalance === 'number' ? (user as any).tokenBalance : 50;
        if (user.image) {
          token.picture = user.image;
        }
      }
      if (trigger === 'update' && session) {
        if (session.planTier) token.planTier = session.planTier;
        if (typeof session.tokenBalance === 'number') token.tokenBalance = session.tokenBalance;
        if (session.themePreset) token.themePreset = session.themePreset;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).systemRole = token.systemRole;
        (session.user as any).status = token.status;
        (session.user as any).workspaceId = token.workspaceId;
        (session.user as any).planTier = token.planTier;
        (session.user as any).tokenBalance = token.tokenBalance;
        (session.user as any).themePreset = token.themePreset;
        if (token.picture && !session.user.image) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
};
