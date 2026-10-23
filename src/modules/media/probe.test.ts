import { describe, it, expect } from 'vitest';
import { calculateAspectRatio } from './probe';

describe('MediaProbeService', () => {
  describe('calculateAspectRatio', () => {
    it('should correctly identify 9:16 vertical videos (Shorts, Reels, TikTok)', () => {
      expect(calculateAspectRatio(1080, 1920)).toBe('9:16');
      expect(calculateAspectRatio(720, 1280)).toBe('9:16');
      expect(calculateAspectRatio(2160, 3840)).toBe('9:16');
    });

    it('should correctly identify 16:9 standard landscape videos (YouTube)', () => {
      expect(calculateAspectRatio(1920, 1080)).toBe('16:9');
      expect(calculateAspectRatio(1280, 720)).toBe('16:9');
      expect(calculateAspectRatio(3840, 2160)).toBe('16:9');
    });

    it('should correctly identify 1:1 square videos', () => {
      expect(calculateAspectRatio(1080, 1080)).toBe('1:1');
      expect(calculateAspectRatio(720, 720)).toBe('1:1');
    });

    it('should correctly identify 4:5 portrait feed videos', () => {
      expect(calculateAspectRatio(1080, 1350)).toBe('4:5');
    });

    it('should return simplified ratio string for custom resolutions', () => {
      expect(calculateAspectRatio(800, 600)).toBe('4:3');
    });

    it('should handle invalid or zero dimensions gracefully', () => {
      expect(calculateAspectRatio(0, 1080)).toBe('unknown');
      expect(calculateAspectRatio(1920, 0)).toBe('unknown');
    });
  });
});
