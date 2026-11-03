'use client';

import React from 'react';

export interface EditorialIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * MasterTokenIcon:
 * Crisp numismatic broadsheet coin SVG with hairline outer circle,
 * dashed/etched inner ring, and serif letter 'T' numismatic mark.
 */
export const MasterTokenIcon: React.FC<EditorialIconProps> = ({
  size = 16,
  className = '',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 align-middle ${className}`}
    style={style}
    aria-hidden="true"
  >
    {/* Outer hairline coin boundary */}
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.25" />
    {/* Inner dashed/etched numismatic ring */}
    <circle
      cx="12"
      cy="12"
      r="7.75"
      stroke="currentColor"
      strokeWidth="0.85"
      strokeDasharray="1.75 1.25"
    />
    {/* Crisp serif 'T' / Token hallmark */}
    <path
      d="M8.5 7.5H15.5M12 7.5V16.5M10 16.5H14M8.5 7.5V9M15.5 7.5V9"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * DispatchSheetIcon:
 * Folded broadsheet newspaper SVG with headline rule and multi-column article lines.
 */
export const DispatchSheetIcon: React.FC<EditorialIconProps> = ({
  size = 16,
  className = '',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 align-middle ${className}`}
    style={style}
    aria-hidden="true"
  >
    {/* Newspaper back fold and main sheet */}
    <path
      d="M19 6V20C19 20.5523 18.5523 21 18 21H5C4.44772 21 4 20.5523 4 20V5C4 3.89543 4.89543 3 6 3H16L20 7V19"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 3V7H20"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Broadsheet masthead rule */}
    <line
      x1="7"
      y1="8"
      x2="13"
      y2="8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Column 1 */}
    <line x1="7" y1="12" x2="10.5" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <line x1="7" y1="14.5" x2="10.5" y2="14.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <line x1="7" y1="17" x2="9.5" y2="17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    {/* Column 2 */}
    <line x1="13.5" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <line x1="13.5" y1="14.5" x2="17" y2="14.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <line x1="13.5" y1="17" x2="15.5" y2="17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * PressStampIcon:
 * Editorial wax seal / verification stamp SVG.
 */
export const PressStampIcon: React.FC<EditorialIconProps> = ({
  size = 16,
  className = '',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 align-middle ${className}`}
    style={style}
    aria-hidden="true"
  >
    {/* Outer scalloped seal */}
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.25" />
    {/* Inner dashed ring */}
    <circle
      cx="12"
      cy="12"
      r="7.5"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeDasharray="2 1.5"
    />
    {/* Editorial verification checkmark stamp */}
    <path
      d="M8.5 12L11 14.5L15.5 9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface SocialPlatformVectorIconProps {
  platform: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SocialPlatformVectorIcon:
 * Clean, stroke-based vector glyphs for Facebook, Instagram, YouTube, TikTok, X, Lemon8, LINE, and Web.
 */
export const SocialPlatformVectorIcon: React.FC<SocialPlatformVectorIconProps> = ({
  platform,
  size = 16,
  className = '',
  style,
}) => {
  const norm = (platform || '').toUpperCase();

  if (norm.includes('FACEBOOK') || norm === 'FB') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 align-middle ${className}`}
        style={style}
        aria-hidden="true"
      >
        <path
          d="M18 2H15C12.7909 2 11 3.79086 11 6V9H8V13H11V22H15V13H18L19 9H15V6C15 5.44772 15.4477 5 16 5H18V2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (norm.includes('INSTAGRAM') || norm === 'IG') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 align-middle ${className}`}
        style={style}
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (norm.includes('YOUTUBE') || norm === 'YT') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 align-middle ${className}`}
        style={style}
        aria-hidden="true"
      >
        <rect
          x="2.5"
          y="5"
          width="19"
          height="14"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <polygon
          points="10,8.5 16,12 10,15.5"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (norm.includes('TIKTOK') || norm === 'TT') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 align-middle ${className}`}
        style={style}
        aria-hidden="true"
      >
        <path
          d="M9 12A4 4 0 1 0 13 16V3C14.5 5 16.5 6 19 6V9.5C16.8 9.5 15 8.7 13.5 7.5V16A7.5 7.5 0 1 1 9 8.6V12Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  if (norm === 'X' || norm.includes('TWITTER')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 align-middle ${className}`}
        style={style}
        aria-hidden="true"
      >
        <path
          d="M4 4L10.5 12.5L4 20H6.5L11.8 14.1L16.5 20H20L13.2 11.2L19.3 4H16.8L11.9 9.5L7.5 4H4Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (norm.includes('LEMON')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 align-middle ${className}`}
        style={style}
        aria-hidden="true"
      >
        {/* Citrus Lemon Shape */}
        <path
          d="M17.5 6.5C14.5 3.5 9.5 3.5 6.5 6.5C3.5 9.5 3.5 14.5 6.5 17.5C9.5 20.5 14.5 20.5 17.5 17.5C20.5 14.5 20.5 9.5 17.5 6.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M17 7L19.5 4.5M7 17L4.5 19.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }

  if (norm.includes('LINE')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 align-middle ${className}`}
        style={style}
        aria-hidden="true"
      >
        <path
          d="M21 11.5C21 6.8 17 3 12 3S3 6.8 3 11.5C3 15.6 6.3 19.1 10.5 19.8C11 19.9 11.4 20.1 11.3 20.6C11.1 21.2 10.7 22.3 10.6 22.6C10.5 23 11 23.2 11.4 22.9C13.2 21.6 16.5 19.2 18.2 17.3C19.9 15.8 21 13.8 21 11.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Default: Web / Generic Globe
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 align-middle ${className}`}
      style={style}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M12 3C14.5 5.5 16 8.5 16 12C16 15.5 14.5 18.5 12 21C9.5 18.5 8 15.5 8 12C8 8.5 9.5 5.5 12 3Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
};

export const PlatformVectorIcon = SocialPlatformVectorIcon;
