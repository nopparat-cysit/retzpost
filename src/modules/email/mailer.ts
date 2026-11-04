import nodemailer from 'nodemailer';

let transporterInstance: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');

  if (!user || !pass) {
    return null;
  }

  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  return transporterInstance;
}

export interface SendOtpEmailOptions {
  to: string;
  code: string;
  purpose: 'REGISTER' | 'RESET_PASSWORD';
  locale?: string;
}

export async function sendOtpEmail({
  to,
  code,
  purpose,
  locale = 'th',
}: SendOtpEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn('[Mailer] GMAIL_USER or GMAIL_APP_PASSWORD not configured. Skipping SMTP dispatch.');
    return { success: false, error: 'Gmail credentials not configured' };
  }

  const isEn = locale === 'en';
  const subject =
    purpose === 'REGISTER'
      ? isEn
        ? `[RetzPost Security] Registration Verification Code: ${code}`
        : `[RetzPost Security] รหัส OTP ยืนยันการสมัครสมาชิก: ${code}`
      : isEn
      ? `[RetzPost Security] Password Reset Code: ${code}`
      : `[RetzPost Security] รหัส OTP กู้คืนรหัสผ่านของคุณ: ${code}`;

  const title =
    purpose === 'REGISTER'
      ? isEn
        ? 'Welcome to RetzPost'
        : 'ยินดีต้อนรับสู่ RetzPost'
      : isEn
      ? 'Password Reset Request'
      : 'คำขอกู้คืนรหัสผ่าน';

  const description =
    purpose === 'REGISTER'
      ? isEn
        ? 'Use the following 6-digit verification code to complete your registration:'
        : 'โปรดใช้รหัส OTP 6 หลักด้านล่างนี้เพื่อยืนยันการสมัครสมาชิกของคุณ:'
      : isEn
      ? 'Use the following 6-digit verification code to reset your account password:'
      : 'โปรดใช้รหัส OTP 6 หลักด้านล่างนี้เพื่อตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ:';

  const footer = isEn
    ? 'This code is valid for 5 minutes. If you did not make this request, please disregard this email.'
    : 'รหัสนี้มีอายุการใช้งาน 5 นาที หากคุณไม่ได้ทำรายการ โปรดเพิกเฉยต่ออีเมลฉบับนี้';

  const html = `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 16px;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <!-- Header -->
        <div style="background-color: #4F46E5; padding: 24px 32px; text-align: left;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">RETZPOST</h1>
          <p style="color: #c7d2fe; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Security & Dispatch Hub</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <h2 style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">${title}</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">${description}</p>

          <!-- OTP Badge -->
          <div style="background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4F46E5;">
              ${code}
            </div>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 24px 0 0 0;">
            ⚠️ ${footer}
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; text-align: center;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} RetzPost. Powered by Cloud Lakebase & Realtime Dispatch Engine.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    const fromAddress = `"RetzPost Security" <${process.env.GMAIL_USER}>`;
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Mailer] Failed to send OTP email:', message);
    return { success: false, error: message };
  }
}
