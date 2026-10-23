import { describe, it, expect } from 'vitest';
import { StorageService, MAX_VIDEO_SIZE_BYTES, MAX_IMAGE_SIZE_BYTES } from './storage';

describe('StorageService (Multi-Format Support)', () => {
  const service = new StorageService();

  describe('isAllowedMediaMime', () => {
    it('should permit both video and image formats', () => {
      // Videos
      expect(service.isAllowedMediaMime('video/mp4')).toBe(true);
      expect(service.isAllowedMediaMime('video/quicktime')).toBe(true);
      expect(service.isAllowedMediaMime('video/webm')).toBe(true);

      // Images (for Feed Posts & Stories)
      expect(service.isAllowedMediaMime('image/jpeg')).toBe(true);
      expect(service.isAllowedMediaMime('image/png')).toBe(true);
      expect(service.isAllowedMediaMime('image/webp')).toBe(true);
    });

    it('should reject unpermitted media formats (executables, audio, pdf)', () => {
      expect(service.isAllowedMediaMime('audio/mpeg')).toBe(false);
      expect(service.isAllowedMediaMime('application/pdf')).toBe(false);
      expect(service.isAllowedMediaMime('application/x-msdownload')).toBe(false);
    });
  });

  describe('getMediaType', () => {
    it('should correctly distinguish between IMAGE and VIDEO', () => {
      expect(service.getMediaType('image/jpeg')).toBe('IMAGE');
      expect(service.getMediaType('image/png')).toBe('IMAGE');
      expect(service.getMediaType('video/mp4')).toBe('VIDEO');
      expect(service.getMediaType('video/quicktime')).toBe('VIDEO');
    });
  });

  describe('createPresignedUploadUrl validation for images and videos', () => {
    it('should enforce 25 MB limit for images', async () => {
      const oversizeImage = MAX_IMAGE_SIZE_BYTES + 1;
      await expect(
        service.createPresignedUploadUrl('ws-1', 'asset-img-1', 'photo.jpg', 'image/jpeg', oversizeImage)
      ).rejects.toThrowError(/exceeds maximum limit of 25 MB/);
    });

    it('should allow valid image size', async () => {
      const validSize = 5 * 1024 * 1024; // 5 MB
      const result = await service.createPresignedUploadUrl(
        'ws-1',
        'asset-img-1',
        'photo.jpg',
        'image/jpeg',
        validSize
      );

      expect(result.storageKey).toBe('workspaces/ws-1/assets/asset-img-1/source.jpg');
      expect(result.uploadUrl).toBeDefined();
    });
  });
});
