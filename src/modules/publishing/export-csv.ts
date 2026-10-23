import { JobStatus } from './state-machine';

export interface ExportableJob {
  id: string;
  platform: string;
  format: string;
  handle: string;
  storyTitle: string;
  status: JobStatus | string;
  attemptCount: number;
  maxAttempts: number;
  scheduledOrExecutedAt: string;
  errorSafeMessage?: string;
  liveUrl?: string;
}

/**
 * Escapes a field for CSV format following RFC 4180.
 * Wraps in double quotes if it contains commas, double quotes, or newlines.
 * Escapes internal double quotes by doubling them.
 */
export function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates an RFC 4180 CSV string with UTF-8 BOM (\uFEFF) for failed dispatches.
 */
export function generateErrorLogCsv(jobs: ExportableJob[]): string {
  const failedJobs = jobs.filter((j) =>
    ['FAILED_RETRYABLE', 'FAILED_FINAL', 'REVOKED'].includes(j.status) || Boolean(j.errorSafeMessage)
  );

  const headers = [
    'Job ID',
    'Timestamp / Scheduled At',
    'Platform',
    'Placement Format',
    'Account / Page Handle',
    'Story Title',
    'Status',
    'Attempt Count',
    'Max Attempts',
    'Failure Reason / Error Details',
    'Suggested Remediation'
  ];

  const rows = failedJobs.map((j) => {
    let remediation = 'Monitor system retry engine.';
    const msg = (j.errorSafeMessage || '').toLowerCase();
    if (msg.includes('rate limit') || msg.includes('429')) {
      remediation = 'Wait for cooldown period or trigger exponential backoff retry.';
    } else if (msg.includes('aspect ratio') || msg.includes('dimension') || msg.includes('1:1')) {
      remediation = 'Re-upload asset formatted as 9:16 vertical (1080x1920) for Story/Reels.';
    } else if (msg.includes('token') || msg.includes('oauth') || msg.includes('permission') || msg.includes('expired')) {
      remediation = 'Re-authenticate account in /accounts settings desk.';
    } else if (msg.includes('duplicate')) {
      remediation = 'Change video title/hash or delete previous duplicate upload.';
    }

    return [
      escapeCsvField(j.id),
      escapeCsvField(j.scheduledOrExecutedAt),
      escapeCsvField(j.platform),
      escapeCsvField(j.format),
      escapeCsvField(j.handle),
      escapeCsvField(j.storyTitle),
      escapeCsvField(j.status),
      escapeCsvField(j.attemptCount),
      escapeCsvField(j.maxAttempts),
      escapeCsvField(j.errorSafeMessage || 'Unknown execution fault'),
      escapeCsvField(remediation),
    ].join(',');
  });

  // UTF-8 BOM ensures Excel handles Thai and special characters seamlessly
  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
}

/**
 * Generates an RFC 4180 CSV string with UTF-8 BOM for all dispatch records.
 */
export function generateAllDispatchesCsv(jobs: ExportableJob[]): string {
  const headers = [
    'Job ID',
    'Timestamp / Scheduled At',
    'Platform',
    'Placement Format',
    'Account / Page Handle',
    'Story Title',
    'Status',
    'Attempts',
    'Live URL / Result',
    'Error Details'
  ];

  const rows = jobs.map((j) => {
    return [
      escapeCsvField(j.id),
      escapeCsvField(j.scheduledOrExecutedAt),
      escapeCsvField(j.platform),
      escapeCsvField(j.format),
      escapeCsvField(j.handle),
      escapeCsvField(j.storyTitle),
      escapeCsvField(j.status),
      escapeCsvField(`${j.attemptCount}/${j.maxAttempts}`),
      escapeCsvField(j.liveUrl || 'N/A'),
      escapeCsvField(j.errorSafeMessage || 'None'),
    ].join(',');
  });

  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
}

/**
 * Triggers a browser download of a CSV file.
 */
export function downloadCsvFile(content: string, filename: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
