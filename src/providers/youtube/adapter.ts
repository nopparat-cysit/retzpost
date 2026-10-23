export interface YouTubeVideoMetadata {
  title: string;
  description?: string;
  tags?: string[];
  privacyStatus?: 'public' | 'unlisted' | 'private';
  selfDeclaredMadeForKids?: boolean;
  categoryId?: string;
}

export interface ResumableSessionInitResult {
  sessionUri: string;
}

export interface YouTubeUploadResult {
  videoId: string;
  permalink: string;
  channelId: string;
  title: string;
}

export interface YouTubeProcessingStatus {
  uploadStatus: 'uploaded' | 'processed' | 'rejected' | 'failed';
  failureReason?: string;
  rejectionReason?: string;
  processingProgress?: {
    partsProcessed?: number;
    partsTotal?: number;
    timeLeftMs?: number;
  };
}

export class YouTubeProvider {
  /**
   * Initiates a Resumable Upload Session with YouTube Data API v3.
   * Returns the unique Resumable Upload URI (Location header).
   */
  public async initiateResumableUpload(
    accessToken: string,
    metadata: YouTubeVideoMetadata,
    sizeBytes: number,
    mimeType: string = 'video/mp4'
  ): Promise<ResumableSessionInitResult> {
    const url = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status';

    const payload = {
      snippet: {
        title: metadata.title.slice(0, 100), // Max 100 chars
        description: metadata.description || '',
        tags: metadata.tags || [],
        categoryId: metadata.categoryId || '22', // 22 = People & Blogs default
      },
      status: {
        privacyStatus: metadata.privacyStatus || 'public',
        selfDeclaredMadeForKids: metadata.selfDeclaredMadeForKids ?? false,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': mimeType,
        'X-Upload-Content-Length': sizeBytes.toString(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`YouTube resumable session initialization failed (${response.status}): ${errorText}`);
    }

    const sessionUri = response.headers.get('Location');
    if (!sessionUri) {
      throw new Error('YouTube API did not return a resumable session URI in the Location header.');
    }

    return { sessionUri };
  }

  /**
   * Uploads the video payload to the resumable session URI.
   * Supports single or chunked upload.
   */
  public async uploadToSession(
    sessionUri: string,
    videoBuffer: Buffer,
    mimeType: string = 'video/mp4'
  ): Promise<YouTubeUploadResult> {
    const totalBytes = videoBuffer.length;

    const response = await fetch(sessionUri, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
        'Content-Length': totalBytes.toString(),
        'Content-Range': `bytes 0-${totalBytes - 1}/${totalBytes}`,
      },
      body: videoBuffer,
    });

    // HTTP 200 or 201 indicates complete upload
    if (response.status === 200 || response.status === 201) {
      const data = await response.json();
      const videoId = data.id;

      return {
        videoId,
        permalink: `https://youtu.be/${videoId}`,
        channelId: data.snippet?.channelId || '',
        title: data.snippet?.title || '',
      };
    }

    const errorText = await response.text();
    throw new Error(`YouTube chunk upload failed with HTTP ${response.status}: ${errorText}`);
  }

  /**
   * Polls video processing status to verify whether transcode/moderation completed or failed.
   */
  public async getProcessingStatus(accessToken: string, videoId: string): Promise<YouTubeProcessingStatus> {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=status,processingDetails&id=${videoId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to query YouTube video status: ${errorText}`);
    }

    const data = await response.json();
    const items = data.items || [];
    if (items.length === 0) {
      throw new Error(`Video with ID ${videoId} not found in YouTube.`);
    }

    const video = items[0];
    const status = video.status || {};
    const processingDetails = video.processingDetails || {};

    return {
      uploadStatus: status.uploadStatus || 'uploaded',
      failureReason: status.failureReason,
      rejectionReason: status.rejectionReason,
      processingProgress: processingDetails.processingProgress,
    };
  }

  /**
   * Classifies YouTube API error responses into normalized error taxonomy.
   */
  public normalizeError(err: unknown): { category: string; safeMessage: string; isRetryable: boolean } {
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes('quotaExceeded') || msg.includes('429')) {
      return {
        category: 'RATE_LIMIT_OR_QUOTA',
        safeMessage: 'YouTube API daily quota limit exceeded. System will pause dispatches until quota reset.',
        isRetryable: true,
      };
    }

    if (msg.includes('401') || msg.includes('invalid_grant') || msg.includes('revoked')) {
      return {
        category: 'AUTH_OR_PERMISSION',
        safeMessage: 'YouTube authorization expired or was revoked. Please reconnect the channel.',
        isRetryable: false,
      };
    }

    if (msg.includes('uploadStatus: rejected') || msg.includes('Terms of Service') || msg.includes('copyright')) {
      return {
        category: 'POLICY_OR_MODERATION',
        safeMessage: 'YouTube rejected this content due to community guidelines or copyright restrictions.',
        isRetryable: false,
      };
    }

    if (msg.includes('ETIMEDOUT') || msg.includes('ECONNRESET') || msg.includes('500') || msg.includes('502') || msg.includes('503')) {
      return {
        category: 'TRANSIENT_NETWORK',
        safeMessage: 'Temporary network connection failure with Google servers. Automatic retry scheduled.',
        isRetryable: true,
      };
    }

    return {
      category: 'VALIDATION_OR_MEDIA',
      safeMessage: `YouTube upload error: ${msg.slice(0, 200)}`,
      isRetryable: false,
    };
  }
}

export const youtubeProvider = new YouTubeProvider();
