export interface InstagramPublishResult {
  mediaId: string;
  permalink: string;
}

export class InstagramProvider {
  /**
   * Publishes a single photo post to Instagram Feed.
   */
  public async publishSinglePhoto(
    igUserId: string,
    accessToken: string,
    imageUrl: string,
    caption?: string
  ): Promise<InstagramPublishResult> {
    // 1. Create Media Container
    const containerUrl = `https://graph.facebook.com/v20.0/${igUserId}/media`;
    const containerParams = new URLSearchParams({
      image_url: imageUrl,
      caption: caption || '',
      access_token: accessToken,
    });

    const containerRes = await fetch(`${containerUrl}?${containerParams.toString()}`, { method: 'POST' });
    const containerData = await containerRes.json();

    if (containerData.error) {
      throw new Error(`IG Container creation failed: ${containerData.error.message}`);
    }

    const containerId = containerData.id;

    // 2. Publish Container
    return this.publishContainer(igUserId, accessToken, containerId);
  }

  /**
   * Publishes a multi-image Carousel album (up to 10 images) to Instagram Feed.
   */
  public async publishCarousel(
    igUserId: string,
    accessToken: string,
    imageUrls: string[],
    caption?: string
  ): Promise<InstagramPublishResult> {
    if (imageUrls.length < 2 || imageUrls.length > 10) {
      throw new Error(`Instagram Carousel requires between 2 and 10 images. Received ${imageUrls.length}.`);
    }

    // 1. Create container for each carousel item
    const itemContainerIds: string[] = [];
    for (const url of imageUrls) {
      const itemParams = new URLSearchParams({
        image_url: url,
        is_carousel_item: 'true',
        access_token: accessToken,
      });

      const res = await fetch(`https://graph.facebook.com/v20.0/${igUserId}/media?${itemParams.toString()}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(`IG Carousel item container failed: ${data.error.message}`);
      }
      itemContainerIds.push(data.id);
    }

    // 2. Create the parent Carousel container
    const carouselParams = new URLSearchParams({
      media_type: 'CAROUSEL',
      children: itemContainerIds.join(','),
      caption: caption || '',
      access_token: accessToken,
    });

    const carouselRes = await fetch(`https://graph.facebook.com/v20.0/${igUserId}/media?${carouselParams.toString()}`, {
      method: 'POST',
    });
    const carouselData = await carouselRes.json();
    if (carouselData.error) {
      throw new Error(`IG Parent Carousel creation failed: ${carouselData.error.message}`);
    }

    // 3. Publish Carousel
    return this.publishContainer(igUserId, accessToken, carouselData.id);
  }

  /**
   * Publishes an Instagram Story (24-hour ephemeral content).
   * Supports photo or 9:16 video.
   */
  public async publishStory(
    igUserId: string,
    accessToken: string,
    mediaUrl: string,
    isVideo: boolean = false
  ): Promise<InstagramPublishResult> {
    const params = new URLSearchParams({
      media_type: 'STORIES',
      access_token: accessToken,
      ...(isVideo ? { video_url: mediaUrl } : { image_url: mediaUrl }),
    });

    // 1. Create Story Container
    const res = await fetch(`https://graph.facebook.com/v20.0/${igUserId}/media?${params.toString()}`, {
      method: 'POST',
    });
    const data = await res.json();

    if (data.error) {
      throw new Error(`Instagram Story container failed: ${data.error.message}`);
    }

    // 2. Wait for story media transcode if video
    if (isVideo) {
      await this.waitForContainerReady(data.id, accessToken);
    }

    // 3. Publish Story
    return this.publishContainer(igUserId, accessToken, data.id);
  }

  /**
   * Publishes an Instagram Reel (9:16 vertical video).
   */
  public async publishReel(
    igUserId: string,
    accessToken: string,
    videoUrl: string,
    caption?: string
  ): Promise<InstagramPublishResult> {
    const params = new URLSearchParams({
      media_type: 'REELS',
      video_url: videoUrl,
      caption: caption || '',
      access_token: accessToken,
    });

    const res = await fetch(`https://graph.facebook.com/v20.0/${igUserId}/media?${params.toString()}`, {
      method: 'POST',
    });
    const data = await res.json();

    if (data.error) {
      throw new Error(`IG Reel container creation failed: ${data.error.message}`);
    }

    await this.waitForContainerReady(data.id, accessToken);
    return this.publishContainer(igUserId, accessToken, data.id);
  }

  private async publishContainer(
    igUserId: string,
    accessToken: string,
    containerId: string
  ): Promise<InstagramPublishResult> {
    const publishUrl = `https://graph.facebook.com/v20.0/${igUserId}/media_publish`;
    const res = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        creation_id: containerId,
        access_token: accessToken,
      }),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(`IG Media publish failed: ${data.error.message}`);
    }

    const mediaId = data.id;
    return {
      mediaId,
      permalink: `https://www.instagram.com/p/${mediaId}/`,
    };
  }

  private async waitForContainerReady(
    containerId: string,
    accessToken: string,
    maxWaitSec: number = 60
  ): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitSec * 1000) {
      const res = await fetch(
        `https://graph.facebook.com/v20.0/${containerId}?fields=status_code&access_token=${accessToken}`
      );
      const data = await res.json();

      if (data.status_code === 'FINISHED') {
        return;
      }
      if (data.status_code === 'ERROR') {
        throw new Error('Instagram media processing container encountered an error');
      }

      // Wait 3 seconds before next check
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    throw new Error('Timeout waiting for Instagram media container to finish processing');
  }
}

export const instagramProvider = new InstagramProvider();
