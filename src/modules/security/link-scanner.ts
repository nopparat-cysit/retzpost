export interface LinkScanResult {
  isSafe: boolean;
  flaggedUrls: string[];
  reason?: string;
  requiresManualVerification: boolean;
}

export interface LinkScannerOptions {
  apiKey?: string;
  whitelistedDomains?: string[];
}

export const DEFAULT_WHITELISTED_DOMAINS = [
  'shopee.co.th',
  'shopee.com',
  'lazada.co.th',
  'lazada.com',
  'tiktok.com',
  'youtube.com',
  'youtu.be',
  'instagram.com',
  'facebook.com',
  'fb.com',
  'fb.me',
  'retzpost.com',
  'localhost',
];

const DANGEROUS_SCHEMES_REGEX = /(?:javascript|data|vbscript|file):\S*/gi;
const STANDARD_URL_REGEX = /https?:\/\/[^\s<>"'{}|\\^`[\]]+/gi;

export function extractUrls(text: string): string[] {
  if (!text) return [];

  const standardMatches = text.match(STANDARD_URL_REGEX) || [];
  const dangerousMatches = text.match(DANGEROUS_SCHEMES_REGEX) || [];

  const combined = [...standardMatches, ...dangerousMatches];
  return Array.from(new Set(combined.map((url) => url.trim().replace(/[.,;!?]+$/, ''))));
}

export function isDomainWhitelisted(urlStr: string, customWhitelist?: string[]): boolean {
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();
    const whitelist = customWhitelist || DEFAULT_WHITELISTED_DOMAINS;

    return whitelist.some((domain) => {
      const cleanDomain = domain.toLowerCase();
      return hostname === cleanDomain || hostname.endsWith(`.${cleanDomain}`);
    });
  } catch {
    return false;
  }
}

export function evaluateHeuristics(urlStr: string): { isSafe: boolean; reason?: string } {
  const lower = urlStr.toLowerCase();

  // 1. Dangerous scheme checks
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:') || lower.startsWith('file:')) {
    return { isSafe: false, reason: `Dangerous URI scheme detected: ${urlStr.slice(0, 15)}` };
  }

  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return { isSafe: false, reason: 'Malformed or invalid URL syntax' };
  }

  // 2. Embedded credentials (user:pass@host)
  if (parsed.username || parsed.password) {
    return { isSafe: false, reason: 'Embedded credentials in URL authority' };
  }

  // 3. Raw IPv4 / IPv6 hosts
  const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  const hostname = parsed.hostname.toLowerCase();
  if (ipv4Regex.test(hostname) && hostname !== '127.0.0.1') {
    return { isSafe: false, reason: `Raw IPv4 address host detected: ${hostname}` };
  }
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    return { isSafe: false, reason: `Raw IPv6 address host detected: ${hostname}` };
  }

  // 4. Null bytes and encoded binary payloads
  if (urlStr.includes('%00') || urlStr.includes('\0')) {
    return { isSafe: false, reason: 'Null byte injection detected in URL' };
  }

  // 5. Dangerous executable file downloads
  const pathname = parsed.pathname.toLowerCase();
  const dangerousExts = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.msi', '.ps1', '.sh'];
  if (dangerousExts.some((ext) => pathname.endsWith(ext))) {
    return { isSafe: false, reason: `URL points directly to an executable binary file (${pathname})` };
  }

  // 6. Suspicious disguised file extensions and deceptive TLDs
  const suspiciousTlds = ['.zip', '.mov', '.top', '.xyz', '.kim', '.download', '.work', '.fit', '.surf'];
  const hasSuspiciousTld = suspiciousTlds.some((tld) => hostname.endsWith(tld));
  const hasPhishingQueryParam = ['redirect', 'login', 'account_update', 'verify', 'signin'].some((param) =>
    parsed.searchParams.has(param)
  );

  if (hasSuspiciousTld && hasPhishingQueryParam) {
    return { isSafe: false, reason: `Suspicious TLD with potential phishing parameters: ${hostname}` };
  }

  if (pathname.endsWith('.zip') || pathname.endsWith('.mov')) {
    return { isSafe: false, reason: `Disguised downloader pattern detected (${pathname})` };
  }

  return { isSafe: true };
}

export async function scanLinks(text: string, options?: LinkScannerOptions): Promise<LinkScanResult> {
  const urls = extractUrls(text);

  if (urls.length === 0) {
    return {
      isSafe: true,
      flaggedUrls: [],
      requiresManualVerification: false,
    };
  }

  const flaggedUrls: string[] = [];
  const reasons: string[] = [];
  const urlsForSafeBrowsing: string[] = [];

  // Step 1: Run heuristics and domain whitelisting
  for (const url of urls) {
    const heuristicResult = evaluateHeuristics(url);
    if (!heuristicResult.isSafe) {
      flaggedUrls.push(url);
      reasons.push(heuristicResult.reason || 'Flagged by heuristic security filter');
      continue;
    }

    if (!isDomainWhitelisted(url, options?.whitelistedDomains)) {
      urlsForSafeBrowsing.push(url);
    }
  }

  const apiKey = options?.apiKey || process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  // Step 2: Query Google Safe Browsing Lookup API if API key is configured and external URLs remain
  if (apiKey && urlsForSafeBrowsing.length > 0) {
    try {
      const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(apiKey)}`;
      const payload = {
        client: {
          clientId: 'retzpost-scanner',
          clientVersion: '1.0.0',
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: urlsForSafeBrowsing.map((u) => ({ url: u })),
        },
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          matches?: Array<{
            threatType: string;
            threat: { url: string };
          }>;
        };

        if (data.matches && data.matches.length > 0) {
          for (const match of data.matches) {
            const matchedUrl = match.threat.url;
            if (!flaggedUrls.includes(matchedUrl)) {
              flaggedUrls.push(matchedUrl);
              reasons.push(`Google Safe Browsing threat detected: ${match.threatType}`);
            }
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      reasons.push(`Safe Browsing API check failed: ${msg}`);
    }
  }

  const isSafe = flaggedUrls.length === 0;
  const requiresManualVerification = !isSafe || (urlsForSafeBrowsing.length > 0 && !apiKey);

  return {
    isSafe,
    flaggedUrls,
    reason: reasons.length > 0 ? reasons.join('; ') : undefined,
    requiresManualVerification,
  };
}
