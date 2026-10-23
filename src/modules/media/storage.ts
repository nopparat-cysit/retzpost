import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  HeadObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

// Supported MIME types for social video distribution
export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime', // .mov
  'video/webm',
] as const;

export type AllowedVideoMimeType = (typeof ALLOWED_VIDEO_MIME_TYPES)[number];

// Default max upload size: 2 GB (configurable via env)
export const MAX_VIDEO_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

export interface PresignedUploadResult {
  assetId: string;
  storageKey: string;
  uploadUrl: string;
  expiresInSeconds: number;
}

export class StorageService {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.STORAGE_BUCKET || 'retzpost-assets';
    const endpoint = process.env.STORAGE_ENDPOINT; // e.g. "http://localhost:9000" for MinIO or R2 endpoint
    const region = process.env.STORAGE_REGION || 'auto';
    const accessKeyId = process.env.STORAGE_ACCESS_KEY || 'minioadmin';
    const secretAccessKey = process.env.STORAGE_SECRET_KEY || 'minioadminpassword';

    this.client = new S3Client({
      region,
      endpoint: endpoint || undefined,
      forcePathStyle: Boolean(endpoint && endpoint.includes('localhost')), // MinIO requires path-style access
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * Validates if the given MIME type is permitted for video publishing.
   */
  public isAllowedVideoMime(mime: string): mime is AllowedVideoMimeType {
    return ALLOWED_VIDEO_MIME_TYPES.includes(mime as AllowedVideoMimeType);
  }

  /**
   * Extracts safe file extension from MIME or filename.
   */
  public getExtension(filename: string, mime: string): string {
    const extFromMime: Record<string, string> = {
      'video/mp4': 'mp4',
      'video/quicktime': 'mov',
      'video/webm': 'webm',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

    if (extFromMime[mime]) {
      return extFromMime[mime];
    }

    const match = filename.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : 'mp4';
  }

  /**
   * Generates a multi-tenant isolated storage key.
   * Path: workspaces/{workspaceId}/assets/{assetId}/source.{ext}
   */
  public generateAssetStorageKey(workspaceId: string, assetId: string, extension: string): string {
    return `workspaces/${workspaceId}/assets/${assetId}/source.${extension}`;
  }

  /**
   * Generates a storage key for poster / thumbnail images.
   */
  public generatePosterStorageKey(workspaceId: string, assetId: string, extension: string = 'jpg'): string {
    return `workspaces/${workspaceId}/assets/${assetId}/poster.${extension}`;
  }

  /**
   * Creates a Presigned PUT URL allowing the browser to upload directly to object storage.
   */
  public async createPresignedUploadUrl(
    workspaceId: string,
    assetId: string,
    filename: string,
    mimeType: string,
    sizeBytes: number,
    expiresInSeconds: number = 1800 // 30 minutes
  ): Promise<PresignedUploadResult> {
    if (!this.isAllowedVideoMime(mimeType)) {
      throw new Error(`Unsupported MIME type: '${mimeType}'. Allowed formats: MP4, MOV, WebM.`);
    }

    if (sizeBytes > MAX_VIDEO_SIZE_BYTES) {
      throw new Error(
        `File size exceeds maximum limit of ${(MAX_VIDEO_SIZE_BYTES / (1024 * 1024 * 1024)).toFixed(1)} GB.`
      );
    }

    const ext = this.getExtension(filename, mimeType);
    const storageKey = this.generateAssetStorageKey(workspaceId, assetId, ext);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      ContentType: mimeType,
      ContentLength: sizeBytes,
      Metadata: {
        workspaceId,
        assetId,
        originalFilename: encodeURIComponent(filename),
      },
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds,
    });

    return {
      assetId,
      storageKey,
      uploadUrl,
      expiresInSeconds,
    };
  }

  /**
   * Creates a Presigned GET URL for secure video preview or download without making the bucket public.
   */
  public async getPresignedDownloadUrl(storageKey: string, expiresInSeconds: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds,
    });
  }

  /**
   * Verifies that the uploaded object exists and retrieves its actual size.
   */
  public async getObjectMetadata(storageKey: string): Promise<{ sizeBytes: number; contentType?: string }> {
    const command = new HeadObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
    });

    const response = await this.client.send(command);
    return {
      sizeBytes: response.ContentLength ?? 0,
      contentType: response.ContentType,
    };
  }

  /**
   * Uploads a Buffer directly to object storage (e.g. for generated thumbnails/posters).
   */
  public async uploadBuffer(storageKey: string, buffer: Buffer, mimeType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.client.send(command);
  }

  /**
   * Deletes an object from storage.
   */
  public async deleteObject(storageKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
    });

    await this.client.send(command);
  }
}

// Singleton storage service instance
export const storageService = new StorageService();
