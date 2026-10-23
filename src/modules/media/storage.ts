import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  HeadObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Supported MIME types for social video distribution
export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime', // .mov
  'video/webm',
] as const;

// Supported MIME types for images (Feed posts, Carousels, Stories)
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_MEDIA_MIME_TYPES = [
  ...ALLOWED_VIDEO_MIME_TYPES,
  ...ALLOWED_IMAGE_MIME_TYPES,
] as const;

export type AllowedVideoMimeType = (typeof ALLOWED_VIDEO_MIME_TYPES)[number];
export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];
export type AllowedMediaMimeType = (typeof ALLOWED_MEDIA_MIME_TYPES)[number];

// Size constraints
export const MAX_VIDEO_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB
export const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024;        // 25 MB per photo

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
    const endpoint = process.env.STORAGE_ENDPOINT;
    const region = process.env.STORAGE_REGION || 'auto';
    const accessKeyId = process.env.STORAGE_ACCESS_KEY || 'minioadmin';
    const secretAccessKey = process.env.STORAGE_SECRET_KEY || 'minioadminpassword';

    this.client = new S3Client({
      region,
      endpoint: endpoint || undefined,
      forcePathStyle: Boolean(endpoint && endpoint.includes('localhost')),
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  public isAllowedVideoMime(mime: string): mime is AllowedVideoMimeType {
    return ALLOWED_VIDEO_MIME_TYPES.includes(mime as AllowedVideoMimeType);
  }

  public isAllowedImageMime(mime: string): mime is AllowedImageMimeType {
    return ALLOWED_IMAGE_MIME_TYPES.includes(mime as AllowedImageMimeType);
  }

  public isAllowedMediaMime(mime: string): mime is AllowedMediaMimeType {
    return ALLOWED_MEDIA_MIME_TYPES.includes(mime as AllowedMediaMimeType);
  }

  public getMediaType(mime: string): 'VIDEO' | 'IMAGE' {
    return this.isAllowedImageMime(mime) ? 'IMAGE' : 'VIDEO';
  }

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
    return match ? match[1].toLowerCase() : 'bin';
  }

  public generateAssetStorageKey(workspaceId: string, assetId: string, extension: string): string {
    return `workspaces/${workspaceId}/assets/${assetId}/source.${extension}`;
  }

  public generatePosterStorageKey(workspaceId: string, assetId: string, extension: string = 'jpg'): string {
    return `workspaces/${workspaceId}/assets/${assetId}/poster.${extension}`;
  }

  public async createPresignedUploadUrl(
    workspaceId: string,
    assetId: string,
    filename: string,
    mimeType: string,
    sizeBytes: number,
    expiresInSeconds: number = 1800
  ): Promise<PresignedUploadResult> {
    if (!this.isAllowedMediaMime(mimeType)) {
      throw new Error(`Unsupported media format: '${mimeType}'. Supported formats: MP4, MOV, WebM, JPEG, PNG, WebP.`);
    }

    const isImage = this.isAllowedImageMime(mimeType);
    const maxLimit = isImage ? MAX_IMAGE_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES;

    if (sizeBytes > maxLimit) {
      const limitMb = Math.round(maxLimit / (1024 * 1024));
      throw new Error(`File size exceeds maximum limit of ${limitMb} MB for ${isImage ? 'images' : 'videos'}.`);
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
        mediaType: isImage ? 'IMAGE' : 'VIDEO',
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

  public async getPresignedDownloadUrl(storageKey: string, expiresInSeconds: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds,
    });
  }

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

  public async uploadBuffer(storageKey: string, buffer: Buffer, mimeType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.client.send(command);
  }

  public async deleteObject(storageKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
    });

    await this.client.send(command);
  }
}

export const storageService = new StorageService();
