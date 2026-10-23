import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { storageService, MAX_VIDEO_SIZE_BYTES } from '@/modules/media/storage';
import crypto from 'crypto';

const uploadRequestSchema = z.object({
  workspaceId: z.string().uuid('Invalid workspace ID format'),
  filename: z.string().min(1, 'Filename is required').max(255),
  mimeType: z.string().min(1, 'MIME type is required'),
  sizeBytes: z.number().int().positive().max(MAX_VIDEO_SIZE_BYTES, 'File size exceeds maximum 2GB limit'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = uploadRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { workspaceId, filename, mimeType, sizeBytes } = parsed.data;

    // Validate MIME type
    if (!storageService.isAllowedVideoMime(mimeType)) {
      return NextResponse.json(
        {
          error: `Unsupported media format: '${mimeType}'. Supported formats are MP4, MOV, and WebM.`,
        },
        { status: 415 }
      );
    }

    // Generate new unique Asset ID
    const assetId = crypto.randomUUID();
    const ext = storageService.getExtension(filename, mimeType);
    const storageKey = storageService.generateAssetStorageKey(workspaceId, assetId, ext);

    // Create Presigned PUT URL (valid for 30 minutes)
    const { uploadUrl, expiresInSeconds } = await storageService.createPresignedUploadUrl(
      workspaceId,
      assetId,
      filename,
      mimeType,
      sizeBytes,
      1800
    );

    // Record asset in database with UPLOADING status
    const asset = await prisma.mediaAsset.create({
      data: {
        id: assetId,
        workspaceId,
        storageKey,
        originalFilename: filename,
        mimeType,
        sizeBytes: BigInt(sizeBytes),
        status: 'UPLOADING',
      },
    });

    return NextResponse.json(
      {
        assetId: asset.id,
        storageKey: asset.storageKey,
        uploadUrl,
        expiresInSeconds,
        status: asset.status,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: 'Failed to initiate upload session',
        message,
      },
      { status: 500 }
    );
  }
}
