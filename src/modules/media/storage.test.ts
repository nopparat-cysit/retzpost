import { describe, it, expect } from 'vitest';
import { StorageService, MAX_VIDEO_SIZE_BYTES } from './storage';

describe('StorageService', () => {
  const service = new StorageService();

  describe('isAllowedVideoMime', () => {
    it('should permit supported video formats (mp4, quicktime, webm)', () => {
      expect(service.isAllowedVideoMime('video/mp4')).toBe(true);
      expect(service.isAllowedVideoMime('video/quicktime')).toBe(true);
      expect(service.isAllowedVideoMime('video/webm')).toBe(true);
    });

    it('should reject unpermitted media formats (images, audio, executables)', () => {
      expect(service.isAllowedVideoMime('image/png')).toBe(false);
      expect(service.isAllowedVideoMime('audio/mpeg')).toBe(false);
      expect(service.isAllowedVideoMime('application/x-msdownload')).toBe(false);
      expect(service.isAllowedVideoMime('text/html')).toBe(false);
    });
  });

  describe('generateAssetStorageKey', () => {
    it('should generate a strictly tenant-isolated key path', () => {
      const workspaceId = 'ws-uuid-123';
      const assetId = 'asset-uuid-456';
      const key = service.generateAssetStorageKey(workspaceId, assetId, 'mp4');

      expect(key).toBe('workspaces/ws-uuid-123/assets/asset-uuid-456/source.mp4');
    });

    it('should generate a proper poster key path', () => {
      const workspaceId = 'ws-uuid-123';
      const assetId = 'asset-uuid-456';
      const key = service.generatePosterStorageKey(workspaceId, assetId, 'jpg');

      expect(key).toBe('workspaces/ws-uuid-123/assets/asset-uuid-456/poster.jpg');
    });
  });

  describe('createPresignedUploadUrl validation', () => {
    it('should throw when mime type is not supported', async () => {
      await expect(
        service.createPresignedUploadUrl('ws-1', 'asset-1', 'audio.mp3', 'audio/mp3', 1024)
      ).rejects.toThrowError(/Unsupported MIME type/);
    });

    it('should throw when file size exceeds MAX_VIDEO_SIZE_BYTES', async () => {
      const oversize = MAX_VIDEO_SIZE_BYTES + 1;
      await expect(
        service.createPresignedUploadUrl('ws-1', 'asset-1', 'huge.mp4', 'video/mp4', oversize)
      ).rejects.toThrowError(/exceeds maximum limit/);
    });
  });
});
