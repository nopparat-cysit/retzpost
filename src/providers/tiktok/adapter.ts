export interface TikTokDirectPostInfo {
  title: string; // Max 2,200 UTF-16 runes (caption + hashtags)
  privacyLevel: string; // e.g. "PUBLIC_TO_EVERYONE", "MUTUAL_FOLLOW_FRIENDS", "SELF_ONLY"
  disableComment?: boolean;
  disableDuet?: boolean;
  disableStitch?: boolean;
  coverTimestampMs?: number;
  brandContentToggle?: boolean;
  brandOrganicToggle?: boolean;
}

export interface TikTokInitPublishResult {
  publishId: string;
  uploadUrl: string;
}

export interface TikTokStatusResult {
  status: 'PROCESSING_DOWNLOAD' | 'PROCESSING_UPLOAD' | 'SUCCESS' | 'FAILED';
  failReason?: string;
  publiclyAvailablePostId?: string[];
}

export class TikTokProvider {
  /**
   * Initiates Direct Post via FILE_UPLOAD strategy.
   * Direct Post requires approved 'video.publish' scope.
   */
  public async initiateDirectPost(
    accessToken: string,
    postInfo: TikTokDirectPostInfo,
    videoSizeBytes: number
  ): Promise<TikTokInitPublishResult> {
    const url = 'https://open.tiktokapis.com/v2/post/publish/video/init/';

    const payload = {
      post_info: {
        title: postInfo.title.slice(0, 2200),
        privacy_level: postInfo.privacyLevel,
        disable_comment: postInfo.disableComment ?? false,
        disable_duet: postInfo.disableDuet ?? false,
        disable_stitch: postInfo.disableStitch ?? false,
        video_cover_timestamp_ms: postInfo.coverTimestampMs || 1000,
        brand_content_toggle: postInfo.brandContentToggle ?? false,
        brand_organic_toggle: postInfo.brandOrganicToggle ?? false,
      },
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: videoSizeBytes,
        chunk_size: videoSizeBytes,
        total_chunk_count: 1,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.error?.code !== 'ok' || !data.data) {
      throw new Error(`TikTok Direct Post init failed: ${data.error?.message || JSON.stringify(data)}`);
    }

    return {
      publishId: data.data.publish_id,
      uploadUrl: data.data.upload_url,
    };
  }

  /**
   * Initiates Upload-to-Inbox Fallback (Scope: 'video.upload').
   * Used when public autopublish audit is pending or unavailable.
   */
  public async initiateInboxUpload(
    accessToken: string,
    videoSizeBytes: number
  ): Promise<TikTokInitPublishResult> {
    const url = 'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/';

    const payload = {
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: videoSizeBytes,
        chunk_size: videoSizeBytes,
        total_chunk_count: 1,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.error?.code !== 'ok' || !data.data) {
      throw new Error(`TikTok Inbox Upload init failed: ${data.error?.message || JSON.stringify(data)}`);
    }

    return {
      publishId: data.data.publish_id,
      uploadUrl: data.data.upload_url,
    };
  }

  /**
   * Uploads the video chunk to TikTok's provided upload_url.
   */
  public async uploadChunk(uploadUrl: string, buffer: Buffer): Promise<void> {
    const totalBytes = buffer.length;

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': totalBytes.toString(),
        'Content-Range': `bytes 0-${totalBytes - 1}/${totalBytes}`,
      },
      body: new Uint8Array(buffer),
    });

    if (response.status !== 200 && response.status !== 201) {
      const errorText = await response.text();
      throw new Error(`TikTok chunk upload failed with HTTP ${response.status}: ${errorText}`);
    }
  }

  /**
   * Polls the status of a TikTok post execution.
   */
  public async fetchPostStatus(accessToken: string, publishId: string): Promise<TikTokStatusResult> {
    const url = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ publish_id: publishId }),
    });

    const data = await response.json();
    if (data.error?.code !== 'ok' || !data.data) {
      throw new Error(`Failed to fetch TikTok publish status: ${data.error?.message || JSON.stringify(data)}`);
    }

    return {
      status: data.data.status,
      failReason: data.data.fail_reason,
      publiclyAvailablePostId: data.data.publicly_available_post_id,
    };
  }

  /**
   * Normalizes TikTok API error codes into unified error taxonomy.
   */
  public normalizeError(err: unknown): { category: string; safeMessage: string; isRetryable: boolean } {
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes('rate_limit') || msg.includes('429') || msg.includes('spam_risk_too_many_pending_share')) {
      return {
        category: 'RATE_LIMIT_OR_QUOTA',
        safeMessage: 'TikTok rate limit exceeded or too many pending shares. Auto-retry scheduled.',
        isRetryable: true,
      };
    }

    if (msg.includes('scope_not_authorized') || msg.includes('access_token_invalid') || msg.includes('401')) {
      return {
        category: 'AUTH_OR_PERMISSION',
        safeMessage: 'TikTok permissions insufficient or authorization expired. Please reconnect.',
        isRetryable: false,
      };
    }

    if (msg.includes('unaudited_client_can_only_post_to_private_users') || msg.includes('unaudited')) {
      return {
        category: 'POLICY_OR_MODERATION',
        safeMessage: 'TikTok App is unaudited for public posting. Video can only be posted as Private (Self Only).',
        isRetryable: false,
      };
    }

    if (msg.includes('duration') || msg.includes('aspect_ratio') || msg.includes('format')) {
      return {
        category: 'VALIDATION_OR_MEDIA',
        safeMessage: `TikTok video specification violation: ${msg.slice(0, 180)}`,
        isRetryable: false,
      };
    }

    return {
      category: 'TRANSIENT_NETWORK',
      safeMessage: `TikTok temporary dispatch error: ${msg.slice(0, 180)}`,
      isRetryable: true,
    };
  }
}

export const tiktokProvider = new TikTokProvider();
