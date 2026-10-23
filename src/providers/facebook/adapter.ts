export interface FacebookPublishResult {
  postId: string;
  permalink: string;
}

export class FacebookProvider {
  /**
   * Publishes a single photo post to a Facebook Page feed.
   */
  public async publishPagePhoto(
    pageId: string,
    pageAccessToken: string,
    imageUrl: string,
    caption?: string
  ): Promise<FacebookPublishResult> {
    const url = `https://graph.facebook.com/v20.0/${pageId}/photos`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        url: imageUrl,
        caption: caption || '',
        access_token: pageAccessToken,
      }),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(`Facebook photo publish failed: ${data.error.message}`);
    }

    const postId = data.post_id || data.id;
    return {
      postId,
      permalink: `https://www.facebook.com/${postId}`,
    };
  }

  /**
   * Publishes an album with multiple photos to a Facebook Page feed.
   */
  public async publishPageAlbum(
    pageId: string,
    pageAccessToken: string,
    imageUrls: string[],
    message?: string
  ): Promise<FacebookPublishResult> {
    // 1. Upload each photo as unpublished to obtain media FBIDs
    const mediaIds: string[] = [];
    for (const url of imageUrls) {
      const uploadRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          url,
          published: 'false',
          access_token: pageAccessToken,
        }),
      });
      const uploadData = await uploadRes.json();
      if (uploadData.error) {
        throw new Error(`Failed uploading unpublished photo to Facebook: ${uploadData.error.message}`);
      }
      mediaIds.push(uploadData.id);
    }

    // 2. Create the combined feed post with attached media
    const attachedMedia = mediaIds.map((id) => ({ media_fbid: id }));
    const feedRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        message: message || '',
        attached_media: JSON.stringify(attachedMedia),
        access_token: pageAccessToken,
      }),
    });

    const feedData = await feedRes.json();
    if (feedData.error) {
      throw new Error(`Facebook album publish failed: ${feedData.error.message}`);
    }

    return {
      postId: feedData.id,
      permalink: `https://www.facebook.com/${feedData.id}`,
    };
  }

  /**
   * Publishes a text-only status update to a Facebook Page feed.
   */
  public async publishPageTextPost(
    pageId: string,
    pageAccessToken: string,
    message: string
  ): Promise<FacebookPublishResult> {
    const url = `https://graph.facebook.com/v20.0/${pageId}/feed`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        message,
        access_token: pageAccessToken,
      }),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(`Facebook status publish failed: ${data.error.message}`);
    }

    return {
      postId: data.id,
      permalink: `https://www.facebook.com/${data.id}`,
    };
  }
}

export const facebookProvider = new FacebookProvider();
