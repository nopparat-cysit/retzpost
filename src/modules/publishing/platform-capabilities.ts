import { Platform, PostFormat } from '@prisma/client';

export interface PlatformCapabilities {
  platform: Platform;
  displayName: string;
  canDeleteViaApi: boolean;
  deepLinkTemplate?: string;
  supportedFormats: PostFormat[];
  maxCaptionLength: number;
  maxMediaCount: number;
}

export interface EmergencyDeleteResolution {
  action: 'API_DELETE' | 'DEEP_LINK_REQUIRED';
  deepLinkUrl?: string;
  message: string;
}

export const PLATFORM_CAPABILITIES: Record<Platform, PlatformCapabilities> = {
  [Platform.FACEBOOK]: {
    platform: Platform.FACEBOOK,
    displayName: 'Facebook',
    canDeleteViaApi: true,
    supportedFormats: [PostFormat.FEED_POST, PostFormat.STORY, PostFormat.VIDEO_REEL],
    maxCaptionLength: 63206,
    maxMediaCount: 10,
  },
  [Platform.INSTAGRAM]: {
    platform: Platform.INSTAGRAM,
    displayName: 'Instagram',
    canDeleteViaApi: true,
    supportedFormats: [PostFormat.FEED_POST, PostFormat.STORY, PostFormat.VIDEO_REEL],
    maxCaptionLength: 2200,
    maxMediaCount: 10,
  },
  [Platform.YOUTUBE]: {
    platform: Platform.YOUTUBE,
    displayName: 'YouTube',
    canDeleteViaApi: true,
    supportedFormats: [PostFormat.FEED_POST, PostFormat.VIDEO_REEL],
    maxCaptionLength: 5000,
    maxMediaCount: 1,
  },
  [Platform.TIKTOK]: {
    platform: Platform.TIKTOK,
    displayName: 'TikTok',
    canDeleteViaApi: false,
    deepLinkTemplate: 'https://www.tiktok.com/@{username}/video/{id}',
    supportedFormats: [PostFormat.FEED_POST, PostFormat.STORY, PostFormat.VIDEO_REEL],
    maxCaptionLength: 2200,
    maxMediaCount: 35,
  },
};

export function getPlatformCapabilities(platform: Platform): PlatformCapabilities {
  const caps = PLATFORM_CAPABILITIES[platform];
  if (!caps) {
    throw new Error(`Unsupported platform capability requested: ${platform}`);
  }
  return caps;
}

export function resolveEmergencyDeleteAction(
  platform: Platform,
  externalPostId: string,
  accountHandle?: string
): EmergencyDeleteResolution {
  const caps = getPlatformCapabilities(platform);

  if (caps.canDeleteViaApi) {
    return {
      action: 'API_DELETE',
      message: `${caps.displayName} post '${externalPostId}' can be deleted directly via provider API.`,
    };
  }

  const cleanHandle = accountHandle ? accountHandle.replace(/^@/, '') : 'me';
  let deepLinkUrl: string | undefined;

  if (caps.deepLinkTemplate) {
    deepLinkUrl = caps.deepLinkTemplate
      .replace('{username}', encodeURIComponent(cleanHandle))
      .replace('{id}', encodeURIComponent(externalPostId));
  }

  return {
    action: 'DEEP_LINK_REQUIRED',
    deepLinkUrl,
    message: `${caps.displayName} does not support programmatic deletion via Open API. Manual deletion required via web or mobile app.`,
  };
}
