import { describe, it, expect } from 'vitest';
import { Platform, PostFormat } from '@prisma/client';
import {
  PLATFORM_CAPABILITIES,
  getPlatformCapabilities,
  resolveEmergencyDeleteAction,
} from './platform-capabilities';

describe('Platform Capability Registry', () => {
  it('registers all platform enums defined in Prisma schema', () => {
    expect(PLATFORM_CAPABILITIES[Platform.FACEBOOK]).toBeDefined();
    expect(PLATFORM_CAPABILITIES[Platform.INSTAGRAM]).toBeDefined();
    expect(PLATFORM_CAPABILITIES[Platform.YOUTUBE]).toBeDefined();
    expect(PLATFORM_CAPABILITIES[Platform.TIKTOK]).toBeDefined();
  });

  it('correctly reports API delete capabilities per platform constraint', () => {
    expect(PLATFORM_CAPABILITIES[Platform.FACEBOOK].canDeleteViaApi).toBe(true);
    expect(PLATFORM_CAPABILITIES[Platform.INSTAGRAM].canDeleteViaApi).toBe(true);
    expect(PLATFORM_CAPABILITIES[Platform.YOUTUBE].canDeleteViaApi).toBe(true);
    expect(PLATFORM_CAPABILITIES[Platform.TIKTOK].canDeleteViaApi).toBe(false);
  });

  it('provides getPlatformCapabilities lookup helper', () => {
    const ytCaps = getPlatformCapabilities(Platform.YOUTUBE);
    expect(ytCaps.displayName).toBe('YouTube');
    expect(ytCaps.supportedFormats).toContain(PostFormat.VIDEO_REEL);
    expect(ytCaps.maxCaptionLength).toBe(5000);
  });

  describe('resolveEmergencyDeleteAction', () => {
    it('returns API_DELETE for platforms supporting server-side deletion (YouTube, Facebook, Instagram)', () => {
      const ytResolution = resolveEmergencyDeleteAction(Platform.YOUTUBE, 'dQw4w9WgXcQ', '@channel');
      expect(ytResolution.action).toBe('API_DELETE');
      expect(ytResolution.deepLinkUrl).toBeUndefined();
      expect(ytResolution.message).toContain('YouTube post');

      const fbResolution = resolveEmergencyDeleteAction(Platform.FACEBOOK, 'fb_12345', 'page_id');
      expect(fbResolution.action).toBe('API_DELETE');
    });

    it('returns DEEP_LINK_REQUIRED with formatted url for TikTok', () => {
      const ttResolution = resolveEmergencyDeleteAction(Platform.TIKTOK, '7123456789012345678', '@retzpost_official');
      expect(ttResolution.action).toBe('DEEP_LINK_REQUIRED');
      expect(ttResolution.deepLinkUrl).toBe('https://www.tiktok.com/@retzpost_official/video/7123456789012345678');
      expect(ttResolution.message).toContain('TikTok does not support programmatic deletion');
    });

    it('strips leading @ in handle for clean deep links', () => {
      const resolution = resolveEmergencyDeleteAction(Platform.TIKTOK, '987654321', 'creator_jane');
      expect(resolution.deepLinkUrl).toBe('https://www.tiktok.com/@creator_jane/video/987654321');
    });

    it('falls back to "me" when account handle is not provided', () => {
      const resolution = resolveEmergencyDeleteAction(Platform.TIKTOK, '987654321');
      expect(resolution.deepLinkUrl).toBe('https://www.tiktok.com/@me/video/987654321');
    });
  });
});
