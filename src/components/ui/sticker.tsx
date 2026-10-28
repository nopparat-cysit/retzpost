'use client';

import React from 'react';
import {
  EditorialNewspaper,
  EditorialCameraReel,
  EditorialCalendarDeadline,
  EditorialBullseye,
  EditorialAwardStarBadge,
  EditorialApprovedSeal,
  EditorialFountainPen,
  EditorialLock,
  EditorialFlame,
  EditorialSparkles,
  EditorialHeart,
  EditorialComment,
  EditorialShare,
  EditorialShield,
  EditorialRoleOwner,
  EditorialRoleManager,
  EditorialRoleEditor,
  EditorialRoleContributor,
  EditorialRoleViewer,
  EditorialWsCreator,
  EditorialWsSoftware,
  EditorialWsCafe,
  EditorialWsBrand,
  EditorialPresetVilla,
  EditorialPresetCastle,
  EditorialPresetCroissant,
  EditorialPresetSkytrain,
  EditorialTrophyGold,
  EditorialTrophySilver,
  EditorialTrophyBronze,
  EditorialAwardRibbon,
  EditorialBrassKeyring,
  EditorialStickyPushpin,
  EditorialNeedsRevisionStamp,
  EditorialSafeZoneGuide,
  EditorialWashiTerracotta,
  EditorialWashiIndigo,
} from '@/components/ui/editorial-icons';

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

interface SizeSpec {
  dimension: number;
  className: string;
}

const SIZE_MAP: Record<StickerSize, SizeSpec> = {
  xs: { dimension: 16, className: 'w-4 h-4 min-w-[16px] max-w-[16px] max-h-[16px]' },
  sm: { dimension: 20, className: 'w-5 h-5 min-w-[20px] max-w-[20px] max-h-[20px]' },
  md: { dimension: 24, className: 'w-6 h-6 min-w-[24px] max-w-[24px] max-h-[24px]' },
  lg: { dimension: 32, className: 'w-8 h-8 min-w-[32px] max-w-[32px] max-h-[32px]' },
  xl: { dimension: 40, className: 'w-10 h-10 min-w-[40px] max-w-[40px] max-h-[40px]' },
  '2xl': { dimension: 48, className: 'w-12 h-12 min-w-[48px] max-w-[48px] max-h-[48px]' },
};

export const Sticker: React.FC<StickerProps> = ({
  name,
  size = 'md',
  className = '',
  alt,
  title,
  inline = false,
}) => {
  const spec = SIZE_MAP[size] || SIZE_MAP.md;
  const commonVectorProps = {
    size: spec.dimension,
    className: `shrink-0 transition-transform duration-150 hover:scale-105 ${
      inline ? 'inline-block align-middle' : 'block'
    } ${className}`,
    style: {
      width: `${spec.dimension}px`,
      height: `${spec.dimension}px`,
    },
  };

  // Bespoke Vector Icon Fallbacks - Razor Sharp at any DPI with 0 clipping artifacts
  if (name === 'camera-reel') {
    return <EditorialCameraReel {...commonVectorProps} />;
  }
  if (name === 'broadsheet-newspaper') {
    return <EditorialNewspaper {...commonVectorProps} />;
  }
  if (name === 'calendar-deadline') {
    return <EditorialCalendarDeadline {...commonVectorProps} />;
  }
  if (name === 'bullseye') {
    return <EditorialBullseye {...commonVectorProps} />;
  }
  if (name === 'award-star-badge') {
    return <EditorialAwardStarBadge {...commonVectorProps} />;
  }
  if (name === 'approved-seal') {
    return <EditorialApprovedSeal {...commonVectorProps} />;
  }
  if (name === 'vault-keyhole') {
    return <EditorialLock {...commonVectorProps} />;
  }
  if (name === 'fountain-pen') {
    return <EditorialFountainPen {...commonVectorProps} />;
  }
  if (name === 'flame-ember' || name === 'viral-flame') {
    return <EditorialFlame {...commonVectorProps} />;
  }
  if (name === 'sparkle-wand' || name === 'sparkle-ai') {
    return <EditorialSparkles {...commonVectorProps} />;
  }
  if (name === 'heart-like') {
    return <EditorialHeart {...commonVectorProps} />;
  }
  if (name === 'comment-bubble') {
    return <EditorialComment {...commonVectorProps} />;
  }
  if (name === 'share-arrow') {
    return <EditorialShare {...commonVectorProps} />;
  }
  if (name === 'guarded-shield' || name === 'shield-certified') {
    return <EditorialShield {...commonVectorProps} />;
  }

  // Roles
  if (name === 'role-owner') {
    return <EditorialRoleOwner {...commonVectorProps} />;
  }
  if (name === 'role-manager') {
    return <EditorialRoleManager {...commonVectorProps} />;
  }
  if (name === 'role-editor') {
    return <EditorialRoleEditor {...commonVectorProps} />;
  }
  if (name === 'role-contributor') {
    return <EditorialRoleContributor {...commonVectorProps} />;
  }
  if (name === 'role-viewer') {
    return <EditorialRoleViewer {...commonVectorProps} />;
  }

  // Workspaces
  if (name === 'ws-creator') {
    return <EditorialWsCreator {...commonVectorProps} />;
  }
  if (name === 'ws-software') {
    return <EditorialWsSoftware {...commonVectorProps} />;
  }
  if (name === 'ws-cafe') {
    return <EditorialWsCafe {...commonVectorProps} />;
  }
  if (name === 'ws-brand' || name === 'ws-realestate') {
    return <EditorialWsBrand {...commonVectorProps} />;
  }

  // Presets
  if (name === 'preset-villa') {
    return <EditorialPresetVilla {...commonVectorProps} />;
  }
  if (name === 'preset-castle') {
    return <EditorialPresetCastle {...commonVectorProps} />;
  }
  if (name === 'preset-croissant') {
    return <EditorialPresetCroissant {...commonVectorProps} />;
  }
  if (name === 'preset-skytrain') {
    return <EditorialPresetSkytrain {...commonVectorProps} />;
  }

  // Trophies & Honors
  if (name === 'trophy-gold') {
    return <EditorialTrophyGold {...commonVectorProps} />;
  }
  if (name === 'trophy-silver') {
    return <EditorialTrophySilver {...commonVectorProps} />;
  }
  if (name === 'trophy-bronze') {
    return <EditorialTrophyBronze {...commonVectorProps} />;
  }
  if (name === 'award-ribbon') {
    return <EditorialAwardRibbon {...commonVectorProps} />;
  }

  // Editorial Accents & Tools
  if (name === 'brass-keyring') {
    return <EditorialBrassKeyring {...commonVectorProps} />;
  }
  if (name === 'sticky-pushpin') {
    return <EditorialStickyPushpin {...commonVectorProps} />;
  }
  if (name === 'needs-revision-stamp') {
    return <EditorialNeedsRevisionStamp {...commonVectorProps} />;
  }
  if (name === 'safe-zone-guide') {
    return <EditorialSafeZoneGuide {...commonVectorProps} />;
  }
  if (name === 'washi-terracotta') {
    return <EditorialWashiTerracotta {...commonVectorProps} />;
  }
  if (name === 'washi-indigo') {
    return <EditorialWashiIndigo {...commonVectorProps} />;
  }

  const imageSrc = `/icons/stickers/${name}.png`;

  return (
    <img
      src={imageSrc}
      alt={alt || name}
      title={title || alt || name}
      width={spec.dimension}
      height={spec.dimension}
      loading="lazy"
      style={{
        width: `${spec.dimension}px`,
        height: `${spec.dimension}px`,
        maxWidth: `${spec.dimension}px`,
        maxHeight: `${spec.dimension}px`,
        imageRendering: '-webkit-optimize-contrast',
      }}
      className={`${spec.className} object-contain select-none shrink-0 drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,0.18)] transition-transform duration-150 hover:scale-105 ${
        inline ? 'inline-block align-middle' : 'block'
      } ${className}`}
      onError={(e) => {
        // Fallback gracefully if missing
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};
