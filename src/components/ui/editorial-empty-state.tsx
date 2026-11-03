'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Sparkles, ArrowRight, Lightbulb, RotateCcw } from 'lucide-react';
import { Sticker } from '@/components/ui/sticker';
import { useTranslation } from '@/modules/i18n/i18n-context';

interface EditorialEmptyStateProps {
  stickerName: string;
  badgeText?: string;
  title: string;
  description: string;
  tipText?: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  demoActionLabel?: string;
  onDemoActionClick?: () => void;
  className?: string;
}

export const EditorialEmptyState: React.FC<EditorialEmptyStateProps> = ({
  stickerName,
  badgeText = 'Zero State • Ready',
  title,
  description,
  tipText,
  actionLabel,
  actionHref,
  onActionClick,
  demoActionLabel,
  onDemoActionClick,
  className = '',
}) => {
  const { locale } = useTranslation();
  const resolvedDemoActionLabel =
    demoActionLabel ??
    (locale === 'th' ? 'โหลดข้อมูลตัวอย่างสำหรับพรีวิว (Load Demo Data)' : 'Load Demo Data');
  const tipHeader = locale === 'th' ? 'คำแนะนำจาก บ.ก. (Editorial Tip):' : 'Editorial Tip:';
  const demoTitle = locale === 'th' ? 'โหลดข้อมูลจำลองเพื่อพรีวิวการแสดงผล' : 'Load sample demo data for preview';
  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-dialog bg-paper-raised border-2 border-dashed border-border-rule relative overflow-hidden transition-all ${className}`}
    >
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper-canvas/30 via-transparent to-paper-canvas/40 pointer-events-none" />

      <div className="max-w-md mx-auto space-y-4 relative z-10">
        {/* Die-Cut Sticker Container with soft float shadow */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center p-2 rounded-full bg-paper-canvas border border-border-rule shadow-sm">
          <Sticker name={stickerName} size="xl" className="filter drop-shadow-sm hover:scale-105 transition-transform" />
        </div>

        {/* Badge */}
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-paper-subtle border border-border-rule text-[10px] font-mono text-ink-secondary font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-semantic-warning animate-pulse" />
            <span>{badgeText}</span>
          </div>
        )}

        {/* Heading & Description */}
        <div className="space-y-1.5">
          <h3 className="font-serif font-bold text-lg sm:text-xl text-ink-primary tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
            {description}
          </p>
        </div>

        {/* Editorial Tip Callout */}
        {tipText && (
          <div className="p-3 rounded-editorial bg-paper-canvas border border-border-rule/80 text-left text-xs space-y-1">
            <span className="font-mono font-bold text-[10px] text-brand-indigo flex items-center gap-1 uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-accent-ochre" />
              {tipHeader}
            </span>
            <p className="text-[11px] text-ink-primary/90 font-sans leading-snug">
              {tipText}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {actionLabel && (
            actionHref ? (
              <Link
                href={actionHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 rounded-editorial bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold shadow-xs transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>{actionLabel}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={onActionClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 rounded-editorial bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{actionLabel}</span>
              </button>
            )
          )}

          {onDemoActionClick && (
            <button
              type="button"
              onClick={onDemoActionClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-editorial bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-secondary hover:text-ink-primary text-xs font-mono transition-colors cursor-pointer"
              title={demoTitle}
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-ochre" />
              <span>{resolvedDemoActionLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
