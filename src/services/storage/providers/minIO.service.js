const { Client } = require('minio');
const {
  minIO: { minIOEndpoint, minIOBucket, minIOSecretKey, minIOAccessKey, minIOPort },
} = require('../../../config/config');

const minioClient = new Client({
  endPoint: minIOEndpoint,
  useSSL: true,
  accessKey: minIOAccessKey,
  secretKey: minIOSecretKey,
});

/**
 * Get file link
 * @param {string} fileName
 * @returns {{url}} url
 */
const getFileLink = async ({ fileName, expirySeconds = 60 * 60 }) => {
  const fileUrl = await minioClient.presignedUrl('GET', minIOBucket, fileName);
  return fileUrl;
};

/**
 * Upload file to minio
 * @param {Array} files
 * @returns {[fileName.fileName]} fileName
 * @returns {[fileName.fileUrl]} fileUrl
 */
const uploadFileToMinio = async (files) => {
  const { fileName, fileBuffer, fileSize, fileMimeType } = files[0];
  const bucketName = minIOBucket;

  const bucketExists = await minioClient.bucketExists(bucketName);
  if (!bucketExists) {
    await minioClient.makeBucket(bucketName);
  }

  await minioClient.putObject(bucketName, fileName, fileBuffer, fileSize, {
    'Content-Type': fileMimeType,
  });

  const fileUrl = getFileLink({ fileName });
  return { fileName, fileUrl };
};

module.exports = { uploadFileToMinio, getFileLink };
