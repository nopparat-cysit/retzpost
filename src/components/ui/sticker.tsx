'use client';

import React from 'react';

export type StickerName =
  // Roles (Sheet 2)
  | 'role-owner'
  | 'role-manager'
  | 'role-editor'
  | 'role-contributor'
  | 'role-viewer'
  // Honors & Trophies (Sheet 2)
  | 'trophy-gold'
  | 'trophy-silver'
  | 'trophy-bronze'
  | 'shield-certified'
  | 'award-ribbon'
  // Engagement (Sheet 2)
  | 'viral-flame'
  | 'heart-like'
  | 'sparkle-ai'
  | 'share-arrow'
  | 'comment-bubble'
  // Formats (Sheet 2)
  | 'format-facebook'
  | 'format-instagram'
  | 'format-tiktok'
  | 'format-youtube'
  | 'format-story'
  // Workspaces & Presets (Sheet 3)
  | 'ws-realestate'
  | 'ws-creator'
  | 'ws-software'
  | 'ws-cafe'
  | 'preset-croissant'
  | 'preset-villa'
  | 'preset-castle'
  | 'preset-skytrain'
  | 'preset-logistics'
  | 'preset-mobile'
  | 'editor-pencil'
  | 'guarded-shield'
  | 'published-badge'
  | 'season-pumpkin'
  | 'ai-robot'
  | 'science-flask'
  // Core Editorial Desk & Approvals (Sheet 1)
  | 'approved-seal'
  | 'sticky-pushpin'
  | 'fountain-pen'
  | 'paper-airplane'
  | 'broadsheet-newspaper'
  | 'camera-reel'
  | 'flame-ember'
  | 'sparkle-wand'
  | 'calendar-deadline'
  | 'growth-chart'
  | 'story-hourglass'
  | 'vault-keyhole'
  | 'emergency-toggle'
  | 'award-star-badge'
  // Accents & Stamps (Sheet 4)
  | 'press-monogram-seal'
  | 'safe-zone-guide'
  | 'needs-revision-stamp'
  | 'verified-dispatch-stamp'
  | 'washi-terracotta'
  | 'washi-indigo'
  | 'audio-spectrum';

export type StickerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface StickerProps {
  name: StickerName | string;
  size?: StickerSize;
  className?: string;
  alt?: string;
  title?: string;
  inline?: boolean;
}

const SIZE_MAP: Record<StickerSize, string> = {
  xs: 'w-3.5 h-3.5 min-w-[14px]',
  sm: 'w-4.5 h-4.5 min-w-[18px]',
  md: 'w-5.5 h-5.5 min-w-[22px]',
  lg: 'w-7 h-7 min-w-[28px]',
  xl: 'w-9 h-9 min-w-[36px]',
  '2xl': 'w-12 h-12 min-w-[48px]',
};

export const Sticker: React.FC<StickerProps> = ({
  name,
  size = 'md',
  className = '',
  alt,
  title,
  inline = false,
}) => {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const imageSrc = `/icons/stickers/${name}.png`;

  return (
    <img
      src={imageSrc}
      alt={alt || name}
      title={title || alt || name}
      loading="lazy"
      className={`${sizeClass} object-contain select-none shrink-0 drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,0.18)] transition-transform duration-150 hover:scale-105 ${
        inline ? 'inline-block align-middle' : 'block'
      } ${className}`}
      style={{
        imageRendering: '-webkit-optimize-contrast',
      }}
      onError={(e) => {
        // Fallback gracefully to hidden or subtle dot if missing
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};
