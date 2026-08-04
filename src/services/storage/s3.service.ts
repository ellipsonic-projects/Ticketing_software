import { randomUUID } from 'crypto';

import { env } from '@/config/env';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class S3Service {
  private client: S3Client | null = null;
  private bucketName: string;

  constructor() {
    this.bucketName = env.AWS_S3_BUCKET_NAME || '';

    if (env.AWS_REGION && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && this.bucketName) {
      this.client = new S3Client({
        region: env.AWS_REGION || 'auto',
        endpoint: env.AWS_S3_ENDPOINT,
        forcePathStyle: !!env.AWS_S3_ENDPOINT, // Required for Supabase & MinIO
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });
    } else {
      console.warn('⚠️ AWS S3 configuration is missing in environment variables.');
    }
  }

  /**
   * Generates a presigned URL for uploading a file directly from the browser to S3.
   * @param filename Original filename
   * @param contentType MIME type of the file
   * @param folder Optional folder path (e.g. 'tickets/123')
   * @returns An object containing the presigned URL and the final key (path) in S3.
   */
  async generatePresignedPutUrl(filename: string, contentType: string, folder?: string) {
    if (!this.client) {
      throw new Error('S3 Client is not configured. Please check environment variables.');
    }

    // Sanitize filename and create unique key
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueId = randomUUID();
    const key = folder
      ? `${folder}/${uniqueId}-${sanitizedFilename}`
      : `${uniqueId}-${sanitizedFilename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    // URL expires in 5 minutes
    const url = await getSignedUrl(this.client, command, { expiresIn: 300 });

    const publicUrl = env.AWS_S3_PUBLIC_URL_PREFIX 
      ? `${env.AWS_S3_PUBLIC_URL_PREFIX}/${key}`
      : `https://${this.bucketName}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

    return {
      url,
      key,
      publicUrl,
    };
  }
}

export const s3Service = new S3Service();
