/**
 * Timezone Scheduler Engine
 * Converts user wall-clock date and time strings into unambiguous UTC timestamps.
 * Preserves the original IANA timezone identifier for correct daylight-savings handling.
 */

export interface WallTimeInput {
  date: string; // "YYYY-MM-DD" e.g. "2026-10-24"
  time: string; // "HH:mm" e.g. "09:15"
  ianaTimezone: string; // e.g. "Asia/Bangkok", "America/New_York", "Europe/London"
}

export function convertWallTimeToUtc(input: WallTimeInput): Date {
  const { date, time, ianaTimezone } = input;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date format '${date}'. Expected 'YYYY-MM-DD'.`);
  }

  if (!/^\d{2}:\d{2}$/.test(time)) {
    throw new Error(`Invalid time format '${time}'. Expected 'HH:mm'.`);
  }

  // Construct ISO-like target local string: "2026-10-24T09:15:00"
  const isoLocalString = `${date}T${time}:00`;

  // Parse as UTC first
  const naiveUtc = new Date(`${isoLocalString}Z`);
  if (isNaN(naiveUtc.getTime())) {
    throw new Error(`Invalid date or time values: ${date} ${time}`);
  }

  // Calculate timezone offset using Intl.DateTimeFormat
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Calculate difference between UTC and target timezone representation
  const parts = formatter.formatToParts(naiveUtc);
  const partMap: Record<string, string> = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }

  // Target local representation formatted in that timezone
  const formattedInTz = `${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour === '24' ? '00' : partMap.hour}:${partMap.minute}:${partMap.second}Z`;
  const tzDate = new Date(formattedInTz);

  const offsetMs = tzDate.getTime() - naiveUtc.getTime();
  const actualUtcMs = naiveUtc.getTime() - offsetMs;

  return new Date(actualUtcMs);
}

/**
 * Validates that a scheduled timestamp is in the future.
 */
export function validateFutureSchedule(
  scheduledUtc: Date,
  minimumLeadSeconds: number = 60
): { valid: boolean; error?: string } {
  const now = Date.now();
  const scheduledMs = scheduledUtc.getTime();

  if (scheduledMs <= now + minimumLeadSeconds * 1000) {
    return {
      valid: false,
      error: `Scheduled time must be at least ${Math.round(minimumLeadSeconds / 60)} minute(s) in the future.`,
    };
  }

  return { valid: true };
}

/**
 * Formats a UTC date back to the user's localized wall-clock display.
 */
export function formatUtcToWallTime(
  utcDate: Date,
  ianaTimezone: string
): { dateStr: string; timeStr: string; fullDisplay: string } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaTimezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const fullDisplay = formatter.format(utcDate);

  const isoFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: ianaTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const dateStr = isoFormatter.format(utcDate);

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaTimezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const timeStr = timeFormatter.format(utcDate);

  return {
    dateStr,
    timeStr,
    fullDisplay,
  };
}
