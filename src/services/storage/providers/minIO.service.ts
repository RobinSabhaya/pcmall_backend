import { Client } from 'minio';
import {
  config
} from '../../../config/config';

const {minIO: { minIOEndpoint, minIOSecretKey, minIOAccessKey, minIOBucket}} = config;

const minioClient = new Client({
  endPoint: minIOEndpoint!,
  useSSL: true,
  accessKey: minIOAccessKey!,
  secretKey: minIOSecretKey!,
});

export interface IFile { 
  fileName: string; fileBuffer: Buffer; fileSize: number; fileMimeType:string
}

/**
 * Get file link
 * @param {string} fileName
 * @returns {{url}} url
 */
export const getFileLink = async ({ fileName, expirySeconds = 60 * 60 }: {fileName : string, expirySeconds?:number}) => {
  const fileUrl = await minioClient.presignedUrl('GET', minIOBucket!, fileName);
  return fileUrl;
};

/**
 * Upload file to minio
 * @param {Array} files
 * @returns {[fileName.fileName]} fileName
 * @returns {[fileName.fileUrl]} fileUrl
 */
export const uploadFileToMinio = async (files : Array<IFile>) => {
  const { fileName, fileBuffer, fileSize, fileMimeType } = files[0];
  const bucketName = minIOBucket;

  const bucketExists = await minioClient.bucketExists(bucketName!);
  if (!bucketExists) {
    await minioClient.makeBucket(bucketName!);
  }

  await minioClient.putObject(bucketName!, fileName, fileBuffer, fileSize, {
    'Content-Type': fileMimeType,
  });

  const fileUrl = await getFileLink({ fileName });
  return { fileName, fileUrl };
};

