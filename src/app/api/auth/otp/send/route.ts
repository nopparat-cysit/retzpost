import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendOtpEmail } from '@/modules/email/mailer';

export const dynamic = 'force-dynamic';

const sendOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  purpose: z.enum(['REGISTER', 'RESET_PASSWORD']),
  locale: z.enum(['th', 'en']).default('th'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { email, code, purpose, locale } = parsed.data;

    const emailResult = await sendOtpEmail({
      to: email,
      code,
      purpose,
      locale,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          warning: 'SMTP dispatch failed or not configured, falling back to in-app OTP toast',
          error: emailResult.error,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${email}`,
      messageId: emailResult.messageId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to dispatch OTP email', message }, { status: 500 });
  }
}
