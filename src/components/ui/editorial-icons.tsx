'use client';

import React from 'react';

export interface EditorialIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

// -----------------------------------------------------------------------------
// 1. EDITORIAL ZAP (Precision High-Voltage Bolt)
// -----------------------------------------------------------------------------
export const EditorialZap: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="zapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      fill="url(#zapGrad)"
      stroke="#78350F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 2L3 14H12L11 16L17 10H12L13 2Z"
      fill="#FEF08A"
      opacity="0.6"
    />
  </svg>
);

// -----------------------------------------------------------------------------
// 2. EDITORIAL NEWSPAPER (Broadsheet Editorial Mark)
// -----------------------------------------------------------------------------
export const EditorialNewspaper: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="newsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FAF8F5" />
        <stop offset="100%" stopColor="#E7E5E4" />
      </linearGradient>
    </defs>
    {/* Newspaper Back Pages */}
    <rect x="4" y="3" width="17" height="18" rx="2" fill="#D6D3D1" stroke="#292524" strokeWidth="1.2" />
    {/* Main Front Fold */}
    <rect x="2" y="5" width="16" height="16" rx="1.5" fill="url(#newsGrad)" stroke="#1C1917" strokeWidth="1.4" />
    {/* Broadsheet Masthead Banner */}
    <rect x="4" y="7.5" width="12" height="2" rx="0.5" fill="#364165" />
    {/* Headline & Columns */}
    <line x1="4" y1="12" x2="10" y2="12" stroke="#1C1917" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="4" y1="14.5" x2="10" y2="14.5" stroke="#78716C" strokeWidth="1" strokeLinecap="round" />
    <line x1="4" y1="17" x2="9" y2="17" stroke="#78716C" strokeWidth="1" strokeLinecap="round" />
    {/* Photo Wire Box */}
    <rect x="12" y="11.5" width="4" height="6.5" rx="0.5" fill="#A24836" fillOpacity="0.15" stroke="#A24836" strokeWidth="0.8" />
  </svg>
);

// -----------------------------------------------------------------------------
// 3. EDITORIAL SPARKLE (Cut-Diamond AI Star Cluster)
// -----------------------------------------------------------------------------
export const EditorialSparkles: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    {/* Large Central Star */}
    <path
      d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
      fill="url(#sparkleGrad)"
      stroke="#78350F"
      strokeWidth="1.2"
    />
    {/* Mini Accent Star Top Right */}
    <path
      d="M19 3C19 5 17 7 15 7C17 7 19 9 19 11C19 9 21 7 21 7C19 7 19 5 19 3Z"
      fill="#FDE047"
      stroke="#78350F"
      strokeWidth="0.8"
    />
    {/* Center Core Dot */}
    <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
  </svg>
);

// -----------------------------------------------------------------------------
// 4. EDITORIAL SUN (Astronomical Peak Hour Ray)
// -----------------------------------------------------------------------------
export const EditorialSun: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <radialGradient id="sunGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="60%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </radialGradient>
    </defs>
    {/* Rays */}
    <g stroke="#B45309" strokeWidth="1.5" strokeLinecap="round">
      <line x1="12" y1="1.5" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="22.5" y2="12" />
      <line x1="4.57" y1="4.57" x2="6.69" y2="6.69" />
      <line x1="17.31" y1="17.31" x2="19.43" y2="19.43" />
      <line x1="4.57" y1="19.43" x2="6.69" y2="17.31" />
      <line x1="17.31" y1="6.69" x2="19.43" y2="4.57" />
    </g>
    {/* Central Solar Disk */}
    <circle cx="12" cy="12" r="5.5" fill="url(#sunGrad)" stroke="#78350F" strokeWidth="1.2" />
    <circle cx="10" cy="10" r="1.5" fill="#FFFFFF" opacity="0.6" />
  </svg>
);

// -----------------------------------------------------------------------------
// 5. EDITORIAL FLAME (Prime Peak Viral Flame)
// -----------------------------------------------------------------------------
export const EditorialFlame: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="flameOuter" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#A24836" />
        <stop offset="60%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#FEF08A" />
      </linearGradient>
    </defs>
    {/* Outer Tongue */}
    <path
      d="M12 2C10.5 5 7 8 7 13C7 16.866 10.134 20 14 20C17.866 20 21 16.866 21 13C21 8.5 17 5 14 3.5C14 6 12.5 7.5 11 8C11 5 12 2 12 2Z"
      fill="url(#flameOuter)"
      stroke="#78350F"
      strokeWidth="1.2"
    />
    {/* Inner Core Flame */}
    <path
      d="M13 10C11.5 12 10 13.5 10 16C10 18.2 11.8 20 14 20C16.2 20 18 18.2 18 16C18 13.5 15.5 11.5 14 10.5C14 12 13 11 13 10Z"
      fill="url(#flameInner)"
    />
  </svg>
);

// -----------------------------------------------------------------------------
// 6. EDITORIAL MOON (Celestial Late Stream Moon)
// -----------------------------------------------------------------------------
export const EditorialMoon: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0E7FF" />
        <stop offset="60%" stopColor="#A5B4FC" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      fill="url(#moonGrad)"
      stroke="#312E81"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Micro Star Accent */}
    <path
      d="M17 5L17.7 6.3L19 7L17.7 7.7L17 9L16.3 7.7L15 7L16.3 6.3L17 5Z"
      fill="#FDE047"
    />
  </svg>
);

// -----------------------------------------------------------------------------
// 7. EDITORIAL ALERT (Architectural Warning Plaque)
// -----------------------------------------------------------------------------
export const EditorialAlert: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="alertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
    </defs>
    <path
      d="M10.29 3.86L1.82 18C1.45 18.63 1.9 19.43 2.63 19.43H21.37C22.1 19.43 22.55 18.63 22.18 18L13.71 3.86C13.34 3.23 12.44 3.23 12.07 3.86H10.29Z"
      fill="url(#alertGrad)"
      stroke="#A24836"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="12" y1="9" x2="12" y2="13.5" stroke="#A24836" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1.25" fill="#A24836" />
  </svg>
);

// -----------------------------------------------------------------------------
// 8. EDITORIAL HEART (Phone Action Rail Heart)
// -----------------------------------------------------------------------------
export const EditorialHeart: React.FC<EditorialIconProps> = ({ size = 14, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      fill="#EF4444"
      stroke="#991B1B"
      strokeWidth="1.2"
    />
    <ellipse cx="7.5" cy="6" rx="2" ry="1.2" fill="#FCA5A5" opacity="0.6" />
  </svg>
);

// -----------------------------------------------------------------------------
// 9. EDITORIAL COMMENT (Phone Action Rail Comment Bubble)
// -----------------------------------------------------------------------------
export const EditorialComment: React.FC<EditorialIconProps> = ({ size = 14, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <path
      d="M21 11.5C21 16.19 16.97 20 12 20C10.5 20 9.08 19.64 7.82 19L3 20.5L4.56 16.27C3.59 14.88 3 13.25 3 11.5C3 6.81 7.03 3 12 3C16.97 3 21 6.81 21 11.5Z"
      fill="#38BDF8"
      stroke="#0369A1"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="11.5" r="1.2" fill="#FFFFFF" />
    <circle cx="12" cy="11.5" r="1.2" fill="#FFFFFF" />
    <circle cx="16" cy="11.5" r="1.2" fill="#FFFFFF" />
  </svg>
);

// -----------------------------------------------------------------------------
// 10. EDITORIAL SHARE (Phone Action Rail Dynamic Dispatch Arrow)
// -----------------------------------------------------------------------------
export const EditorialShare: React.FC<EditorialIconProps> = ({ size = 14, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <path
      d="M22 2L11 13"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 2L15 22L11 13L2 9L22 2Z"
      fill="#F59E0B"
      stroke="#78350F"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

// -----------------------------------------------------------------------------
// 11. EDITORIAL LOCK (Solid Antique Brass Padlock)
// -----------------------------------------------------------------------------
export const EditorialLock: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="lockBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>
    {/* Shackle */}
    <path
      d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11"
      stroke="#451A03"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Body */}
    <rect x="4" y="11" width="16" height="11" rx="2.5" fill="url(#lockBody)" stroke="#451A03" strokeWidth="1.5" />
    {/* Keyhole */}
    <circle cx="12" cy="15.5" r="1.5" fill="#451A03" />
    <path d="M12 16.5V19" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// -----------------------------------------------------------------------------
// 12. EDITORIAL SHIELD (Multi-Brand Security Token Shield)
// -----------------------------------------------------------------------------
export const EditorialShield: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path
      d="M12 2L4 5V11C4 16.55 7.42 21.74 12 23C16.58 21.74 20 16.55 20 11V5L12 2Z"
      fill="url(#shieldGrad)"
      stroke="#064E3B"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Internal Embellishment */}
    <path
      d="M9 12L11 14L15 10"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// -----------------------------------------------------------------------------
// 13. EDITORIAL DIAMOND (Fidelity Gem Proof)
// -----------------------------------------------------------------------------
export const EditorialDiamond: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="diaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <polygon points="6,3 18,3 22,9 12,22 2,9" fill="url(#diaGrad)" stroke="#0C4A6E" strokeWidth="1.4" />
    <polygon points="6,3 18,3 15,9 9,9" fill="#F0F9FF" opacity="0.6" />
    <line x1="9" y1="9" x2="12" y2="22" stroke="#0C4A6E" strokeWidth="1" />
    <line x1="15" y1="9" x2="12" y2="22" stroke="#0C4A6E" strokeWidth="1" />
    <line x1="2" y1="9" x2="22" y2="9" stroke="#0C4A6E" strokeWidth="1" />
  </svg>
);

// -----------------------------------------------------------------------------
// 14. EDITORIAL STAR (Faceted Proof Star)
// -----------------------------------------------------------------------------
export const EditorialStar: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="60%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill="url(#starGrad)"
      stroke="#78350F"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

// -----------------------------------------------------------------------------
// 15. EDITORIAL CHECK (Calligraphic Ink Checkmark)
// -----------------------------------------------------------------------------
export const EditorialCheck: React.FC<EditorialIconProps> = ({ size = 14, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <circle cx="10" cy="10" r="9" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.4" />
    <path
      d="M6 10.5L8.5 13L14 7.5"
      stroke="#047857"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// -----------------------------------------------------------------------------
// 16. EDITORIAL CROSS (Ink Cancellation Mark)
// -----------------------------------------------------------------------------
export const EditorialCross: React.FC<EditorialIconProps> = ({ size = 14, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <circle cx="10" cy="10" r="9" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.4" />
    <path
      d="M7 7L13 13M13 7L7 13"
      stroke="#B91C1C"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// -----------------------------------------------------------------------------
// 17. EDITORIAL CAMERA REEL (Masterwork Studio Film Camera)
// -----------------------------------------------------------------------------
export const EditorialCameraReel: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="reelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#364165" />
        <stop offset="100%" stopColor="#1E2538" />
      </linearGradient>
    </defs>
    {/* Dual film reels on top */}
    <circle cx="7.5" cy="6" r="3.5" fill="#FAF8F5" stroke="#1C1917" strokeWidth="1.2" />
    <circle cx="7.5" cy="6" r="1.2" fill="#364165" />
    <circle cx="16.5" cy="6" r="3.5" fill="#FAF8F5" stroke="#1C1917" strokeWidth="1.2" />
    <circle cx="16.5" cy="6" r="1.2" fill="#364165" />
    {/* Camera Body */}
    <rect x="3" y="9" width="18" height="12" rx="2.5" fill="url(#reelGrad)" stroke="#1C1917" strokeWidth="1.3" />
    {/* Studio Lens / Shutter */}
    <circle cx="12" cy="15" r="4" fill="#FAF8F5" stroke="#A24836" strokeWidth="1.5" />
    <circle cx="12" cy="15" r="2.2" fill="#A24836" />
    <circle cx="11" cy="14" r="0.8" fill="#FFFFFF" opacity="0.8" />
    {/* Rec Indicator LED */}
    <circle cx="18" cy="12" r="1" fill="#EF4444" />
  </svg>
);

// -----------------------------------------------------------------------------
// 18. EDITORIAL CALENDAR DEADLINE (Editorial Planner Board)
// -----------------------------------------------------------------------------
export const EditorialCalendarDeadline: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FAF8F5" />
        <stop offset="100%" stopColor="#F5F2EB" />
      </linearGradient>
    </defs>
    {/* Calendar Back Page Shadow */}
    <rect x="4" y="5" width="16" height="16" rx="2" fill="#E7E5E4" stroke="#78716C" strokeWidth="1" />
    {/* Calendar Main Board */}
    <rect x="3" y="4" width="18" height="17" rx="2.5" fill="url(#calGrad)" stroke="#1C1917" strokeWidth="1.3" />
    {/* Header Strip */}
    <path d="M3 6.5C3 5.12 4.12 4 5.5 4H18.5C19.88 4 21 5.12 21 6.5V8.5H3V6.5Z" fill="#364165" />
    {/* Spiral Rings */}
    <rect x="6.5" y="2" width="1.8" height="3.5" rx="0.9" fill="#1C1917" />
    <rect x="11.1" y="2" width="1.8" height="3.5" rx="0.9" fill="#1C1917" />
    <rect x="15.7" y="2" width="1.8" height="3.5" rx="0.9" fill="#1C1917" />
    {/* Grid Marks */}
    <circle cx="7" cy="12" r="1" fill="#A8A29E" />
    <circle cx="12" cy="12" r="1" fill="#A8A29E" />
    <circle cx="17" cy="12" r="1" fill="#A8A29E" />
    <circle cx="7" cy="16" r="1" fill="#A8A29E" />
    {/* Deadline Circled Day */}
    <circle cx="12" cy="16" r="2.8" fill="#FEE2E2" stroke="#A24836" strokeWidth="1.2" />
    <circle cx="12" cy="16" r="1" fill="#A24836" />
    <circle cx="17" cy="16" r="1" fill="#A8A29E" />
  </svg>
);

// -----------------------------------------------------------------------------
// 19. EDITORIAL BULLSEYE (Editorial Target & Objective)
// -----------------------------------------------------------------------------
export const EditorialBullseye: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <circle cx="12" cy="12" r="10" fill="#FAF8F5" stroke="#A24836" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="7" fill="#FEE2E2" stroke="#A24836" strokeWidth="1.3" />
    <circle cx="12" cy="12" r="4" fill="#FAF8F5" stroke="#A24836" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="2" fill="#A24836" />
    {/* Arrow Flight Crosshairs */}
    <line x1="12" y1="2" x2="12" y2="5" stroke="#364165" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="19" x2="12" y2="22" stroke="#364165" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="12" x2="5" y2="12" stroke="#364165" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="19" y1="12" x2="22" y2="12" stroke="#364165" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// -----------------------------------------------------------------------------
// 20. EDITORIAL AWARD STAR BADGE (Golden Ribbon Award)
// -----------------------------------------------------------------------------
export const EditorialAwardStarBadge: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="badgeStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="60%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    {/* Hanging Ribbons */}
    <path d="M8.5 13.5L7 22L12 19L17 22L15.5 13.5" fill="#364165" stroke="#1C1917" strokeWidth="1.2" strokeLinejoin="round" />
    {/* Star Medallion */}
    <circle cx="12" cy="9.5" r="7.5" fill="url(#badgeStarGrad)" stroke="#78350F" strokeWidth="1.3" />
    <circle cx="12" cy="9.5" r="5.5" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
    {/* Central Star */}
    <path
      d="M12 5.5L13.1 7.8L15.6 8.1L13.8 9.9L14.2 12.4L12 11.2L9.8 12.4L10.2 9.9L8.4 8.1L10.9 7.8L12 5.5Z"
      fill="#FFFFFF"
      stroke="#78350F"
      strokeWidth="0.6"
    />
  </svg>
);

// -----------------------------------------------------------------------------
// 21. EDITORIAL APPROVED SEAL (Terracotta Wax Stamp)
// -----------------------------------------------------------------------------
export const EditorialApprovedSeal: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    {/* Scalloped Wax Edge */}
    <circle cx="12" cy="12" r="10" fill="#A24836" stroke="#782D20" strokeWidth="1.3" />
    <circle cx="12" cy="12" r="8" fill="#B84A28" stroke="#FDE047" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
    {/* Center Checkmark */}
    <path
      d="M7.5 12L10.5 15L16.5 9"
      stroke="#FAF8F5"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// -----------------------------------------------------------------------------
// 22. EDITORIAL FOUNTAIN PEN (Press Pen Nib)
// -----------------------------------------------------------------------------
export const EditorialFountainPen: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle shrink-0 ${className}`}
    style={style}
  >
    {/* Nib Body */}
    <path
      d="M12 2L19 9L15 13L13 11L7 17L3 21L7 17L5 15L11 9L9 7L12 2Z"
      fill="#364165"
      stroke="#1C1917"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Golden Nib Point */}
    <path d="M3 21L8 16L6 14L3 21Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
    {/* Ink Breathing Hole */}
    <circle cx="6.5" cy="16.5" r="0.8" fill="#1C1917" />
    <line x1="3" y1="21" x2="6.5" y2="16.5" stroke="#1C1917" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// -----------------------------------------------------------------------------
// 23. EDITORIAL ROLES (Owner, Manager, Editor, Contributor, Viewer)
// -----------------------------------------------------------------------------
export const EditorialRoleOwner: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <defs>
      <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <path d="M4 18L2 7L7.5 12L12 4L16.5 12L22 7L20 18H4Z" fill="url(#crownGrad)" stroke="#78350F" strokeWidth="1.3" strokeLinejoin="round" />
    <circle cx="2" cy="7" r="1.3" fill="#B45309" />
    <circle cx="7.5" cy="12" r="1.1" fill="#B45309" />
    <circle cx="12" cy="4" r="1.5" fill="#EF4444" />
    <circle cx="16.5" cy="12" r="1.1" fill="#B45309" />
    <circle cx="22" cy="7" r="1.3" fill="#B45309" />
    <rect x="4" y="18" width="16" height="3" rx="1" fill="#78350F" />
  </svg>
);

export const EditorialRoleManager: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <rect x="3" y="7" width="18" height="13" rx="2" fill="#364165" stroke="#1C1917" strokeWidth="1.3" />
    <path d="M8 7V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V7" stroke="#1C1917" strokeWidth="1.5" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="#FAF8F5" strokeWidth="1" strokeDasharray="2 2" />
    <rect x="10.5" y="10.5" width="3" height="3" rx="0.5" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
  </svg>
);

export const EditorialRoleEditor: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <path d="M18.5 2.5L21.5 5.5L8 19H5V16L18.5 2.5Z" fill="#A24836" stroke="#5C1D11" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M15 6L18 9" stroke="#FAF8F5" strokeWidth="1" />
    <path d="M5 19L2 22L5 22L5 19Z" fill="#5C1D11" />
  </svg>
);

export const EditorialRoleContributor: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <rect x="4" y="3" width="16" height="18" rx="2" fill="#FAF8F5" stroke="#1C1917" strokeWidth="1.3" />
    <line x1="8" y1="7" x2="16" y2="7" stroke="#364165" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="8" y1="11" x2="16" y2="11" stroke="#78716C" strokeWidth="1.1" strokeLinecap="round" />
    <line x1="8" y1="15" x2="13" y2="15" stroke="#78716C" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="16" cy="15" r="2" fill="#A24836" />
  </svg>
);

export const EditorialRoleViewer: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <circle cx="10" cy="10" r="7" fill="#FAF8F5" stroke="#1C1917" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="3.5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// -----------------------------------------------------------------------------
// 24. WORKSPACE MARKS (Creator, Software, Cafe, Brand)
// -----------------------------------------------------------------------------
export const EditorialWsCreator: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <rect x="3" y="8" width="18" height="13" rx="2" fill="#FAF8F5" stroke="#1C1917" strokeWidth="1.3" />
    <path d="M3 8L6 3H21L18 8H3Z" fill="#364165" stroke="#1C1917" strokeWidth="1.3" />
    <polygon points="10,11 16,14.5 10,18" fill="#A24836" />
  </svg>
);

export const EditorialWsSoftware: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <rect x="2" y="4" width="20" height="16" rx="2.5" fill="#1E2538" stroke="#1C1917" strokeWidth="1.3" />
    <path d="M6 10L9 12L6 14" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="11" y1="14" x2="15" y2="14" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const EditorialWsCafe: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <path d="M4 8C4 13.5 7 16 11 16C15 16 18 13.5 18 8H4Z" fill="#78350F" stroke="#451A03" strokeWidth="1.3" />
    <path d="M18 9C19.5 9 21 10 21 11.5C21 13 19.5 14 18 14" stroke="#451A03" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="2" y1="19" x2="20" y2="19" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 3C8 4.5 9 5.5 9 6" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
    <path d="M13 3C13 4.5 14 5.5 14 6" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const EditorialWsBrand: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <rect x="4" y="4" width="16" height="16" rx="4" fill="#A24836" stroke="#5C1D11" strokeWidth="1.3" />
    <circle cx="12" cy="12" r="5" stroke="#FAF8F5" strokeWidth="1.3" strokeDasharray="2 2" />
    <circle cx="12" cy="12" r="2" fill="#FDE047" />
  </svg>
);

// -----------------------------------------------------------------------------
// 25. PRESETS (Croissant, Villa, Castle, Skytrain)
// -----------------------------------------------------------------------------
export const EditorialPresetCroissant: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <path d="M3 15C5 8 19 8 21 15C18 18 14 17 12 15C10 17 6 18 3 15Z" fill="#D97706" stroke="#78350F" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M7 11C8 9 10 9 11 11" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />
    <path d="M13 11C14 9 16 9 17 11" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const EditorialPresetVilla: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <path d="M3 10L12 3L21 10V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V10Z" fill="#FAF8F5" stroke="#1C1917" strokeWidth="1.3" strokeLinejoin="round" />
    <rect x="9.5" y="13" width="5" height="8" fill="#364165" />
    <rect x="6" y="11" width="2.5" height="2.5" rx="0.5" fill="#A24836" />
    <rect x="15.5" y="11" width="2.5" height="2.5" rx="0.5" fill="#A24836" />
  </svg>
);

export const EditorialPresetCastle: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <path d="M4 21V9L6 6L8 9V11H16V9L18 6L20 9V21H4Z" fill="#FAF8F5" stroke="#1C1917" strokeWidth="1.3" />
    <path d="M10 21V15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15V21" fill="#364165" />
    <line x1="2" y1="21" x2="22" y2="21" stroke="#1C1917" strokeWidth="1.5" />
  </svg>
);

export const EditorialPresetSkytrain: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <rect x="4" y="3" width="16" height="15" rx="3" fill="#364165" stroke="#1C1917" strokeWidth="1.3" />
    <rect x="6" y="6" width="12" height="5" rx="1" fill="#E0F2FE" />
    <circle cx="8" cy="14" r="1.5" fill="#FDE047" />
    <circle cx="16" cy="14" r="1.5" fill="#FDE047" />
    <line x1="8" y1="20" x2="6" y2="23" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="20" x2="18" y2="23" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// -----------------------------------------------------------------------------
// 26. HONORS (Trophy Gold, Silver, Bronze, Ribbon)
// -----------------------------------------------------------------------------
export const EditorialTrophyGold: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <path d="M6 3H18V10C18 13.3 15.3 16 12 16C8.7 16 6 13.3 6 10V3Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.3" />
    <path d="M6 5H3C2.4 5 2 5.4 2 6C2 8.5 3.5 10.5 6 11V5Z" fill="#FDE047" stroke="#78350F" strokeWidth="1.1" />
    <path d="M18 5H21C21.6 5 22 5.4 22 6C22 8.5 20.5 10.5 18 11V5Z" fill="#FDE047" stroke="#78350F" strokeWidth="1.1" />
    <path d="M12 16V19" stroke="#78350F" strokeWidth="1.5" />
    <rect x="8" y="19" width="8" height="3" rx="1" fill="#78350F" />
    <polygon points="12,6 12.8,7.8 14.8,8 13.3,9.4 13.7,11.3 12,10.3 10.3,11.3 10.7,9.4 9.2,8 11.2,7.8" fill="#FFFFFF" />
  </svg>
);

export const EditorialTrophySilver: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <path d="M6 3H18V10C18 13.3 15.3 16 12 16C8.7 16 6 13.3 6 10V3Z" fill="#CBD5E1" stroke="#334155" strokeWidth="1.3" />
    <path d="M6 5H3C2.4 5 2 5.4 2 6C2 8.5 3.5 10.5 6 11V5Z" fill="#F1F5F9" stroke="#334155" strokeWidth="1.1" />
    <path d="M18 5H21C21.6 5 22 5.4 22 6C22 8.5 20.5 10.5 18 11V5Z" fill="#F1F5F9" stroke="#334155" strokeWidth="1.1" />
    <path d="M12 16V19" stroke="#334155" strokeWidth="1.5" />
    <rect x="8" y="19" width="8" height="3" rx="1" fill="#334155" />
  </svg>
);

export const EditorialTrophyBronze: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <path d="M6 3H18V10C18 13.3 15.3 16 12 16C8.7 16 6 13.3 6 10V3Z" fill="#CD7F32" stroke="#5C3317" strokeWidth="1.3" />
    <path d="M6 5H3C2.4 5 2 5.4 2 6C2 8.5 3.5 10.5 6 11V5Z" fill="#E4A066" stroke="#5C3317" strokeWidth="1.1" />
    <path d="M18 5H21C21.6 5 22 5.4 22 6C22 8.5 20.5 10.5 18 11V5Z" fill="#E4A066" stroke="#5C3317" strokeWidth="1.1" />
    <path d="M12 16V19" stroke="#5C3317" strokeWidth="1.5" />
    <rect x="8" y="19" width="8" height="3" rx="1" fill="#5C3317" />
  </svg>
);

export const EditorialAwardRibbon: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <circle cx="12" cy="9" r="6" fill="#A24836" stroke="#5C1D11" strokeWidth="1.3" />
    <circle cx="12" cy="9" r="4" fill="#FAF8F5" />
    <path d="M9 13.5L7 22L12 19L17 22L15 13.5" fill="#364165" stroke="#1C1917" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

// -----------------------------------------------------------------------------
// 27. EDITORIAL ACCENTS (Brass Keyring, Pushpin, Revision Stamp, Safe Guide, Washi)
// -----------------------------------------------------------------------------
export const EditorialBrassKeyring: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <circle cx="9" cy="9" r="6" stroke="#B45309" strokeWidth="2" />
    <path d="M13.5 13.5L20 20M17 17L19 15M19 19L21 17" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const EditorialStickyPushpin: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <path d="M9 3H15V6L17 9V11H7V9L9 6V3Z" fill="#A24836" stroke="#5C1D11" strokeWidth="1.3" />
    <line x1="12" y1="11" x2="12" y2="21" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const EditorialNeedsRevisionStamp: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <rect x="2" y="5" width="20" height="14" rx="2" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 2" />
    <path d="M6 12H18" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="#D97706" />
  </svg>
);

export const EditorialSafeZoneGuide: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#364165" strokeWidth="1.3" strokeDasharray="3 3" />
    <path d="M6 3V6H3M18 3V6H21M6 21V18H3M18 21V18H21" stroke="#364165" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1.5" fill="#A24836" />
  </svg>
);

export const EditorialWashiTerracotta: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <polygon points="2,6 22,6 20,18 4,18" fill="#A24836" fillOpacity="0.85" stroke="#782D20" strokeWidth="1" />
    <line x1="6" y1="8" x2="6" y2="16" stroke="#FAF8F5" strokeWidth="0.8" strokeOpacity="0.4" />
    <line x1="12" y1="8" x2="12" y2="16" stroke="#FAF8F5" strokeWidth="0.8" strokeOpacity="0.4" />
    <line x1="18" y1="8" x2="18" y2="16" stroke="#FAF8F5" strokeWidth="0.8" strokeOpacity="0.4" />
  </svg>
);

export const EditorialWashiIndigo: React.FC<EditorialIconProps> = ({ size = 16, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block align-middle shrink-0 ${className}`} style={style}>
    <polygon points="2,6 22,6 20,18 4,18" fill="#364165" fillOpacity="0.85" stroke="#1E2538" strokeWidth="1" />
    <line x1="6" y1="8" x2="6" y2="16" stroke="#FAF8F5" strokeWidth="0.8" strokeOpacity="0.4" />
    <line x1="12" y1="8" x2="12" y2="16" stroke="#FAF8F5" strokeWidth="0.8" strokeOpacity="0.4" />
    <line x1="18" y1="8" x2="18" y2="16" stroke="#FAF8F5" strokeWidth="0.8" strokeOpacity="0.4" />
  </svg>
);


