'use client';

import React from 'react';
import { ExternalLink, Copy } from 'lucide-react';

export interface SocialIconProps {
  className?: string;
  size?: number;
}

export const FacebookLogo: React.FC<SocialIconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
  >
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      fill="#FFFFFF"
      d="M15.12 12.35l.43-2.82h-2.7v-1.83c0-.77.38-1.52 1.58-1.52h1.23V3.79s-1.11-.19-2.18-.19c-2.22 0-3.68 1.35-3.68 3.79v2.14H7.28v2.82h2.5V19.4a12.06 12.06 0 003.7 0v-7.05h2.38z"
    />
  </svg>
);

export const InstagramLogo: React.FC<SocialIconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
  >
    <defs>
      <radialGradient id="ig-grad-component" cx="10%" cy="100%" r="120%">
        <stop offset="0%" stopColor="#FEE411" />
        <stop offset="20%" stopColor="#FEDB16" />
        <stop offset="45%" stopColor="#FD415B" />
        <stop offset="70%" stopColor="#D800B9" />
        <stop offset="90%" stopColor="#8E00D7" />
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="6.5" fill="url(#ig-grad-component)" />
    <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="#FFFFFF" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="3.2" stroke="#FFFFFF" strokeWidth="1.8" />
    <circle cx="15.8" cy="8.2" r="0.9" fill="#FFFFFF" />
  </svg>
);

export const InstagramStoryLogo: React.FC<SocialIconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
  >
    <defs>
      <linearGradient id="ig-story-grad-comp" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FEE411" />
        <stop offset="25%" stopColor="#FD415B" />
        <stop offset="60%" stopColor="#D800B9" />
        <stop offset="100%" stopColor="#8E00D7" />
      </linearGradient>
    </defs>
    {/* Story Gradient Ring */}
    <circle cx="12" cy="12" r="10.5" stroke="url(#ig-story-grad-comp)" strokeWidth="1.8" strokeDasharray="4 1.5" />
    {/* Dark Inner Base */}
    <circle cx="12" cy="12" r="8.2" fill="#181512" />
    {/* 24h Flash mark */}
    <path
      fill="#FEE411"
      d="M12.5 7.5L9.5 12h2.2l-.7 4.5 3-4.5h-2.2l.7-4.5z"
    />
  </svg>
);

export const YouTubeLogo: React.FC<SocialIconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
  >
    <rect width="24" height="24" rx="5.5" fill="#FF0000" />
    <polygon points="10,8 16,12 10,16" fill="#FFFFFF" />
  </svg>
);

export const TikTokLogo: React.FC<SocialIconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
  >
    <rect width="24" height="24" rx="5.5" fill="#000000" />
    {/* Cyan Note */}
    <path
      fill="#25F4EE"
      d="M15.4 8.2a2.8 2.8 0 01-1.8-1.5h-1.6v9.3a1.8 1.8 0 01-3.3.9 1.8 1.8 0 011.5-2.7c.3 0 .5.1.7.2v-2c-.2 0-.5-.1-.7-.1a3.7 3.7 0 00-3.7 3.7 3.7 3.7 0 006.3 2.6 3.7 3.7 0 001.1-2.6V9.4c1.1.8 2.4.9 2.8.9v-2.1h-.3z"
    />
    {/* Magenta Note */}
    <path
      fill="#FE2C55"
      d="M16 7.4a2.8 2.8 0 01-1.8-1.5h-1.6v9.3a1.8 1.8 0 01-3.3.9 1.8 1.8 0 011.5-2.7c.3 0 .5.1.7.2V11.6c-.2 0-.5-.1-.7-.1a3.7 3.7 0 00-3.7 3.7 3.7 3.7 0 006.3 2.6 3.7 3.7 0 001.1-2.6V8.6c1.1.8 2.4.9 2.8.9V7.4h-.3z"
    />
    {/* White Note */}
    <path
      fill="#FFFFFF"
      d="M15.7 7.8a2.8 2.8 0 01-1.8-1.5h-1.6v9.3a1.8 1.8 0 01-1.8 1.8 1.8 1.8 0 01-1.8-1.8 1.8 1.8 0 011.8-1.8c.2 0 .4 0 .6.1v-2c-.2 0-.4-.1-.6-.1a3.7 3.7 0 00-3.7 3.7 3.7 3.7 0 003.7 3.7 3.7 3.7 0 003.7-3.7V9c1.1.8 2.4.9 2.8.9V7.8h-.4z"
    />
  </svg>
);

export const LineLogo: React.FC<SocialIconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
  >
    <rect width="24" height="24" rx="5.5" fill="#06C755" />
    <path
      fill="#FFFFFF"
      d="M19 11.2c0-3.6-3.4-6.5-7.5-6.5S4 7.6 4 11.2c0 3.2 2.9 6 6.7 6.4.3 0 .6.2.7.4l.2.8s-.1.4.6.2c.7-.3 3.8-2.3 5.2-4 1-1.1 1.6-2.4 1.6-3.8z"
    />
    <path
      fill="#06C755"
      d="M9.8 12.8H8v-3.5c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.2c0 .2.2.4.4.4h2.2c.2 0 .4-.2.4-.4s-.2-.7-.4-.7zm1.3-3.9c-.2 0-.4.2-.4.4v3.5c0 .2.2.4.4.4s.4-.2.4-.4V9.3c0-.2-.2-.4-.4-.4zm4.8 0c-.2 0-.4.2-.4.4v2.1l-2.1-2.7c-.1-.1-.2-.2-.4-.2h-.1c-.2 0-.4.2-.4.4v3.5c0 .2.2.4.4.4s.4-.2.4-.4V10.2l2.1 2.8c.1.2.3.2.5.2h.1c.2 0 .4-.2.4-.4V9.3c-.1-.2-.3-.4-.5-.4zm3.8 1c.2 0 .4-.2.4-.4s-.2-.4-.4-.4h-2.3c-.2 0-.4.2-.4.4v3.5c0 .2.2.4.4.4h2.3c.2 0 .4-.2.4-.4s-.2-.4-.4-.4h-1.8v-.8h1.5c.2 0 .4-.2.4-.4s-.2-.4-.4-.4h-1.5v-.7h1.8z"
    />
  </svg>
);

export const WebsiteLogo: React.FC<SocialIconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
  >
    <rect width="24" height="24" rx="5.5" fill="#10B981" />
    <path
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4a8 8 0 100 16 8 8 0 000-16zM4 12h16M12 4c2.5 2.5 4 5.5 4 8s-1.5 5.5-4 8c-2.5-2.5-4-5.5-4-8s1.5-5.5 4-8z"
    />
  </svg>
);

export type SupportedPlatform = 'FACEBOOK' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK' | 'LINE' | 'WEBSITE';
export type SupportedFormat = 'FEED' | 'STORY' | 'REEL' | 'FEED_POST' | 'VIDEO_REEL';

interface SocialPlatformIconProps {
  platform: SupportedPlatform | string;
  format?: SupportedFormat | string;
  className?: string;
  size?: number;
}

export const SocialPlatformIcon: React.FC<SocialPlatformIconProps> = ({
  platform,
  format,
  className = 'w-4 h-4',
  size = 18,
}) => {
  const plat = platform.toUpperCase();
  const fmt = (format || '').toUpperCase();

  if (plat === 'FACEBOOK') {
    return <FacebookLogo className={className} size={size} />;
  }

  if (plat === 'INSTAGRAM') {
    if (fmt === 'STORY') {
      return <InstagramStoryLogo className={className} size={size} />;
    }
    return <InstagramLogo className={className} size={size} />;
  }

  if (plat === 'YOUTUBE') {
    return <YouTubeLogo className={className} size={size} />;
  }

  if (plat === 'TIKTOK') {
    return <TikTokLogo className={className} size={size} />;
  }

  if (plat === 'LINE') {
    return <LineLogo className={className} size={size} />;
  }

  return <WebsiteLogo className={className} size={size} />;
};

interface SocialMediaLiveButtonProps {
  platform: SupportedPlatform | string;
  format?: SupportedFormat | string;
  label: string;
  url: string;
  onCopy?: (url: string, label: string) => void;
  className?: string;
}

export const SocialMediaLiveButton: React.FC<SocialMediaLiveButtonProps> = ({
  platform,
  format,
  label,
  url,
  onCopy,
  className = '',
}) => {
  const plat = platform.toUpperCase();
  const fmt = (format || '').toUpperCase();

  let btnTheme = 'bg-paper-canvas text-ink-primary border-border-rule hover:border-brand-indigo';

  if (plat === 'FACEBOOK') {
    btnTheme = 'bg-blue-50/80 text-blue-900 border-blue-200/80 hover:bg-blue-100 hover:border-blue-300';
  } else if (plat === 'INSTAGRAM' && fmt === 'STORY') {
    btnTheme = 'bg-amber-50/80 text-amber-950 border-amber-200/80 hover:bg-amber-100 hover:border-amber-300';
  } else if (plat === 'INSTAGRAM') {
    btnTheme = 'bg-purple-50/80 text-purple-900 border-purple-200/80 hover:bg-purple-100 hover:border-purple-300';
  } else if (plat === 'YOUTUBE') {
    btnTheme = 'bg-red-50/80 text-red-900 border-red-200/80 hover:bg-red-100 hover:border-red-300';
  } else if (plat === 'TIKTOK') {
    btnTheme = 'bg-neutral-900 text-cyan-300 border-neutral-700 hover:bg-black';
  } else if (plat === 'LINE') {
    btnTheme = 'bg-emerald-50/80 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300';
  } else if (plat === 'WEBSITE') {
    btnTheme = 'bg-emerald-50/80 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300';
  }

  return (
    <div className={`inline-flex items-center gap-0.5 group/btn ${className}`}>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        title={`เปิดดูโพสต์จริงบน ${platform}: ${label}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold border transition-all shadow-2xs hover:shadow-xs cursor-pointer ${btnTheme}`}
      >
        <SocialPlatformIcon platform={platform} format={format} size={16} />
        <span>เปิดดูบน {label}</span>
        <ExternalLink className="w-3 h-3 opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-transform" />
      </a>
      {onCopy && (
        <button
          type="button"
          onClick={() => onCopy(url, label)}
          className="p-1 hover:bg-paper-subtle rounded text-ink-muted hover:text-ink-primary transition-colors cursor-pointer"
          title={`คัดลอกลิงก์ ${label}`}
        >
          <Copy className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
};
