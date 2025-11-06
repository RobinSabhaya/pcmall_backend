import { Client } from 'minio';

import { config } from '../../../config/config';
import { IFileDetails } from '../../common/file.service.type';

const {
  minIO: { minIOEndpoint, minIOSecretKey, minIOAccessKey, minIOBucket },
} = config;

const minioClient = new Client({
  endPoint: minIOEndpoint!,
  useSSL: true,
  accessKey: minIOAccessKey!,
  secretKey: minIOSecretKey!,
});

export const checkBucketExists = async (): Promise<void> => {
  // Check/create bucket once before uploading
  const bucketExists = await minioClient.bucketExists(minIOBucket!);
  if (!bucketExists) {
    await minioClient.makeBucket(minIOBucket!);
  }
};

/**
 * Get file link
 * @param {string} fileName
 * @returns {{url}} url
 */
export const getFileLink = async ({
  fileName,
}: // expirySeconds = 60 * 60,
{
  fileName: string;
  expirySeconds?: number;
}): Promise<string> => {
  return minioClient.presignedUrl('GET', minIOBucket!, fileName);
};

/**
 * Upload file to minio
 * @param {Array} files
 * @returns {[fileName.fileName]} fileName
 * @returns {[fileName.fileUrl]} fileUrl
 */
export const uploadFileToMinio = async (
  files: IFileDetails[]
): Promise<
  {
    fileName: string; // Changed from IFile to string
    fileUrl: string;
  }[]
> => {
  // Return array since we're processing multiple files
  const bucketName = minIOBucket;

  await checkBucketExists();

  // Process all files concurrently
  const uploadPromises = files.map(async file => {
    const { fileName, fileBuffer, fileSize, fileMimeType } = file;

    await minioClient.putObject(bucketName!, fileName, fileBuffer, fileSize, {
      'Content-Type': fileMimeType,
    });

    const fileUrl = await getFileLink({ fileName });
    return { fileName, fileUrl };
  });

  return Promise.all(uploadPromises);
};

export const generatePresignedPutURL = async ({
  fileName,
}: {
  fileName: string;
}): Promise<string> => {
  return minioClient.presignedPutObject(minIOBucket!, fileName);
};
