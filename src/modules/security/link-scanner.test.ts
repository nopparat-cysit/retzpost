import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  scanLinks,
  extractUrls,
  isDomainWhitelisted,
  evaluateHeuristics,
} from './link-scanner';

describe('Link Scanner', () => {
  describe('extractUrls', () => {
    it('extracts standard and dangerous protocol urls from text', () => {
      const text = 'Check out https://shopee.co.th/flash-sale and javascript:alert(1) for info.';
      const urls = extractUrls(text);
      expect(urls).toContain('https://shopee.co.th/flash-sale');
      expect(urls).toContain('javascript:alert(1)');
    });

    it('strips trailing punctuation', () => {
      const text = 'Visit https://lazada.co.th/item123.';
      const urls = extractUrls(text);
      expect(urls).toEqual(['https://lazada.co.th/item123']);
    });
  });

  describe('isDomainWhitelisted', () => {
    it('recognizes whitelisted marketplace and platform domains including subdomains', () => {
      expect(isDomainWhitelisted('https://shopee.co.th/deals')).toBe(true);
      expect(isDomainWhitelisted('https://mall.shopee.co.th/products')).toBe(true);
      expect(isDomainWhitelisted('https://www.tiktok.com/@brand')).toBe(true);
      expect(isDomainWhitelisted('https://creator.youtube.com')).toBe(true);
      expect(isDomainWhitelisted('https://phishing-site.com')).toBe(false);
    });
  });

  describe('evaluateHeuristics', () => {
    it('flags dangerous URI schemes', () => {
      expect(evaluateHeuristics('javascript:void(0)').isSafe).toBe(false);
      expect(evaluateHeuristics('data:text/html;base64,PHNjcmlwdD4=').isSafe).toBe(false);
    });

    it('flags embedded credentials in URL', () => {
      const res = evaluateHeuristics('https://admin:password123@suspicious.com/api');
      expect(res.isSafe).toBe(false);
      expect(res.reason).toContain('Embedded credentials');
    });

    it('flags raw IPv4 and IPv6 hosts', () => {
      expect(evaluateHeuristics('http://192.168.1.100/config').isSafe).toBe(false);
      expect(evaluateHeuristics('http://[2001:db8::1]/path').isSafe).toBe(false);
    });

    it('flags direct executable downloads', () => {
      const res = evaluateHeuristics('https://cdn-untrusted.com/files/setup.exe');
      expect(res.isSafe).toBe(false);
      expect(res.reason).toContain('executable binary file');
    });

    it('flags disguised downloaders and suspicious phishing parameters', () => {
      expect(evaluateHeuristics('https://untrusted.com/invoice.zip').isSafe).toBe(false);
      expect(
        evaluateHeuristics('https://urgent-notice.top/account?login=true&verify=user').isSafe
      ).toBe(false);
    });

    it('passes clean URLs', () => {
      expect(evaluateHeuristics('https://retzpost.com/blog/how-to-schedule').isSafe).toBe(true);
    });
  });

  describe('scanLinks (End-to-End)', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('returns isSafe=true for captions without any links', async () => {
      const res = await scanLinks('Just a standard caption announcing our new summer collection!');
      expect(res.isSafe).toBe(true);
      expect(res.flaggedUrls).toHaveLength(0);
      expect(res.requiresManualVerification).toBe(false);
    });

    it('approves whitelisted marketplace links without requiring manual verification', async () => {
      const res = await scanLinks('Buy now on Shopee: https://shopee.co.th/product/999');
      expect(res.isSafe).toBe(true);
      expect(res.flaggedUrls).toHaveLength(0);
      expect(res.requiresManualVerification).toBe(false);
    });

    it('flags heuristic threat immediately and sets requiresManualVerification', async () => {
      const res = await scanLinks('Click here http://185.190.20.1/malware to claim discount');
      expect(res.isSafe).toBe(false);
      expect(res.flaggedUrls).toContain('http://185.190.20.1/malware');
      expect(res.requiresManualVerification).toBe(true);
    });

    it('queries Google Safe Browsing API when key is configured', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          matches: [
            {
              threatType: 'MALWARE',
              threat: { url: 'https://threat-site.com/exploit' },
            },
          ],
        }),
      });

      const res = await scanLinks('Special link: https://threat-site.com/exploit', {
        apiKey: 'test_google_key',
      });

      expect(res.isSafe).toBe(false);
      expect(res.flaggedUrls).toContain('https://threat-site.com/exploit');
      expect(res.reason).toContain('Google Safe Browsing threat detected: MALWARE');
      expect(res.requiresManualVerification).toBe(true);
    });
  });
});
