'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Check, Copy, X, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { EMAIL_NOTIFICATION_EVENT } from '@/modules/auth/otp-service';
import { EmailNotificationPayload } from '@/modules/auth/auth-types';

interface EmailOtpToastProps {
  onAutofill?: (code: string) => void;
}

export const EmailOtpToast: React.FC<EmailOtpToastProps> = ({ onAutofill }) => {
  const [notification, setNotification] = useState<EmailNotificationPayload | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if there was an email sent recently in sessionStorage
    try {
      const stored = sessionStorage.getItem('retzpost_last_email_otp');
      if (stored) {
        const parsed: EmailNotificationPayload = JSON.parse(stored);
        // Only show if sent within last 2 minutes
        if (Date.now() - parsed.timestamp < 2 * 60 * 1000) {
          setNotification(parsed);
          setIsVisible(true);
        }
      }
    } catch {}

    const handleEmailEvent = (e: Event) => {
      const customEvent = e as CustomEvent<EmailNotificationPayload>;
      if (customEvent.detail) {
        setNotification(customEvent.detail);
        setIsVisible(true);
        setCopied(false);
      }
    };

    window.addEventListener(EMAIL_NOTIFICATION_EVENT, handleEmailEvent);
    return () => {
      window.removeEventListener(EMAIL_NOTIFICATION_EVENT, handleEmailEvent);
    };
  }, []);

  if (!isVisible || !notification) return null;

  const handleCopy = () => {
    if (!notification) return;
    navigator.clipboard.writeText(notification.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAutofill = () => {
    if (!notification) return;
    if (onAutofill) {
      onAutofill(notification.code);
    } else {
      // Broadcast autofill event so OTP inputs anywhere on page can populate
      window.dispatchEvent(
        new CustomEvent('retzpost:autofill-otp', { detail: { code: notification.code } })
      );
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-in slide-in-from-top-3 fade-in duration-300">
      <div className="bg-paper-raised border-2 border-brand-indigo/30 rounded-dialog p-4 shadow-xl ring-1 ring-black/5 relative overflow-hidden backdrop-blur-md">
        {/* Subtle accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-indigo via-accent-terracotta to-semantic-success" />

        {/* Header with Gmail simulation badge */}
        <div className="flex items-start justify-between gap-3 mb-2 pt-0.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-semantic-error-bg text-semantic-error flex items-center justify-center font-bold text-xs shrink-0 border border-semantic-error/20">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-ink-primary">
                  Gmail Simulation Box
                </span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-semantic-success-bg text-semantic-success border border-semantic-success/30 font-semibold">
                  Delivered ⚡
                </span>
              </div>
              <p className="text-[10px] font-mono text-ink-secondary truncate">
                จาก: <span className="text-ink-primary font-medium">security@retzpost.com</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="text-ink-secondary hover:text-ink-primary p-1 rounded hover:bg-paper-subtle transition-colors"
            title="ปิดการแจ้งเตือน"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Body Summary */}
        <div className="bg-paper-subtle/70 rounded-editorial p-2.5 mb-3 border border-border-rule text-xs space-y-1.5">
          <p className="text-[11px] font-medium text-ink-primary">
            ถึง: <span className="font-mono text-brand-indigo">{notification.to}</span>
          </p>
          <p className="text-[11px] text-ink-secondary leading-snug">
            {notification.subject}
          </p>

          <div className="pt-1.5 flex items-center justify-between border-t border-border-rule/60">
            <span className="text-[10px] font-mono text-ink-secondary flex items-center gap-1">
              <Clock className="w-3 h-3 text-accent-terracotta" />
              หมดอายุใน 5 นาที
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-ink-secondary font-mono">รหัส OTP:</span>
              <span className="font-mono font-bold text-sm text-brand-indigo tracking-widest bg-paper-canvas px-2 py-0.5 rounded border border-brand-indigo/30 shadow-2xs">
                {notification.code}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutofill}
            className="flex-1 py-1.5 px-3 bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold rounded-editorial flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-98"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>กรอกรหัส {notification.code} อัตโนมัติ</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="py-1.5 px-2.5 bg-paper-canvas hover:bg-paper-subtle text-ink-primary border border-border-rule text-xs font-medium rounded-editorial flex items-center justify-center gap-1 transition-colors cursor-pointer"
            title="คัดลอกรหัส"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-semantic-success" />
                <span className="text-[10px] font-semibold text-semantic-success">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-ink-secondary" />
                <span className="text-[10px]">คัดลอก</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
