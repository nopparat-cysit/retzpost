import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execFileAsync = promisify(execFile);

export interface ProbedMediaMetadata {
  durationSec: number;
  width: number;
  height: number;
  aspectRatio: string;
  videoCodec?: string;
  audioCodec?: string;
  fps?: number;
}

export interface ProbeResult {
  success: boolean;
  metadata?: ProbedMediaMetadata;
  posterBuffer?: Buffer;
  error?: string;
}

/**
 * Calculates standard social aspect ratio from dimensions.
 */
export function calculateAspectRatio(width: number, height: number): string {
  if (!width || !height) return 'unknown';

  const ratio = width / height;

  // Approximate match with 2.5% tolerance
  if (Math.abs(ratio - 9 / 16) < 0.03) return '9:16'; // Vertical Short/Reel/TikTok (e.g. 1080x1920)
  if (Math.abs(ratio - 16 / 9) < 0.03) return '16:9'; // Standard Landscape (e.g. 1920x1080)
  if (Math.abs(ratio - 1) < 0.03) return '1:1';       // Square (e.g. 1080x1080)
  if (Math.abs(ratio - 4 / 5) < 0.03) return '4:5';   // Portrait Feed (e.g. 1080x1350)

  // Greatest common divisor fallback
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

export class MediaProbeService {
  private ffprobePath: string;
  private ffmpegPath: string;

  constructor() {
    this.ffprobePath = process.env.FFPROBE_PATH || 'ffprobe';
    this.ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
  }

  /**
   * Probes video metadata using ffprobe.
   * Uses execFile (shell: false) and bounded timeouts to prevent command injection and hanging.
   */
  public async probeVideo(inputPathOrUrl: string): Promise<ProbedMediaMetadata> {
    const args = [
      '-v', 'error',
      '-show_entries', 'stream=codec_name,codec_type,width,height,r_frame_rate,duration:format=duration',
      '-of', 'json',
      inputPathOrUrl,
    ];

    try {
      const { stdout } = await execFileAsync(this.ffprobePath, args, {
        timeout: 30_000, // 30-second bounded timeout
      });

      const parsed = JSON.parse(stdout);
      const streams = parsed.streams || [];
      const videoStream = streams.find((s: Record<string, unknown>) => s.codec_type === 'video');
      const audioStream = streams.find((s: Record<string, unknown>) => s.codec_type === 'audio');

      if (!videoStream) {
        throw new Error('No valid video stream found in the uploaded file');
      }

      const width = parseInt(videoStream.width, 10) || 0;
      const height = parseInt(videoStream.height, 10) || 0;
      const durationSec = parseFloat(videoStream.duration || parsed.format?.duration || '0');

      let fps: number | undefined;
      if (videoStream.r_frame_rate) {
        const [num, den] = videoStream.r_frame_rate.split('/').map(Number);
        if (den && num) {
          fps = Math.round((num / den) * 100) / 100;
        }
      }

      return {
        durationSec,
        width,
        height,
        aspectRatio: calculateAspectRatio(width, height),
        videoCodec: videoStream.codec_name,
        audioCodec: audioStream?.codec_name,
        fps,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Media probe failed: ${msg}`);
    }
  }

  /**
   * Generates a single thumbnail frame (Poster) from the video at a safe timestamp.
   */
  public async generatePoster(inputPathOrUrl: string, targetDurationSec?: number): Promise<Buffer> {
    const tempOutputDir = os.tmpdir();
    const tempOutputFile = path.join(tempOutputDir, `poster_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`);

    // Determine timestamp: 1.0s or half the duration if shorter than 2s
    let seekTimestamp = '00:00:01.000';
    if (targetDurationSec && targetDurationSec < 2) {
      const half = (targetDurationSec / 2).toFixed(3);
      seekTimestamp = `00:00:00.${Math.round(parseFloat(half) * 1000).toString().padStart(3, '0')}`;
    }

    const args = [
      '-ss', seekTimestamp,
      '-i', inputPathOrUrl,
      '-vframes', '1',
      '-q:v', '2', // High quality JPEG
      '-y',
      tempOutputFile,
    ];

    try {
      await execFileAsync(this.ffmpegPath, args, {
        timeout: 30_000,
      });

      const buffer = await fs.readFile(tempOutputFile);
      await fs.unlink(tempOutputFile).catch(() => {}); // Cleanup temp file
      return buffer;
    } catch (err: unknown) {
      await fs.unlink(tempOutputFile).catch(() => {});
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Thumbnail extraction failed: ${msg}`);
    }
  }
}

export const mediaProbeService = new MediaProbeService();
