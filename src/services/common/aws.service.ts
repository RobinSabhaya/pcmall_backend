// import config from '@/config/config';
// import S3 from 'aws-sdk/clients/s3';
// import mime from 'mime-types';
// import fs from 'fs';
// import path from 'path';

// const s3 = new S3({
//     region: config.aws.region,
//     accessKeyId: config.aws.access_key,
//     secretAccessKey: config.aws.secret_key,
// });

/** Upload image on AWS S3 bucket */
// export const localUpload = async (fileKeyPath: string, fileBuffer: Buffer):Promise<void> => {
// Check if the directory exists, and if not, create it
// const [first,second] = fileKeyPath.split('/');
//   await fs.promises.mkdir(
//     path.resolve(process.cwd(), `../${first}/${second}`),
//     {
//       recursive: true,
//     },
//   )

// fs.writeFile(path.resolve(process.cwd(), `../${fileKeyPath}`), fileBuffer, (err) => {
//   if (err) return false;
//   return true;
// });
//   const fileMimeType = fileType?.mimeType
//     ? fileType?.mimeType
//     : fileType?.filePathForMimeType
//     ? mime.lookup(fileType?.filePathForMimeType)
//     : "";
//   const uploadParams = {
//     Bucket: config.aws.bucket_name,
//     Key: fileKeyPath,
//     Body: fileBuffer,
//     ContentType: fileMimeType || "",
//     acl: "public-read",
//   };
//   s3.upload(uploadParams, function (err, data) {
//     if (err) {
//       return { status: false, message: err.message };
//     } else {
//       return { status: true, message: "Upload successfully!", data };
//     }
//   });
// };

/** Delete image on AWS S3 bucket */
// const s3Delete = async (fileKeyPath) => {
//   const params = {
//     Bucket: config.aws.bucket_name,
//     Key: fileKeyPath,
//   };

//   s3.deleteObject(params, function (err, data) {
//     if (err) {
//       return { status: false, message: err.message };
//     } else {
//       return { status: true, message: "Delete successfully!", data };
//     }
//   });
// };

/** ==================================================== 👇 DEVELOPER USE ONLY 👇 ==================================================== */
// const s3Update = async (fileKeyPath, fileBuffer, bucketName) => {
//   const uploadParams = {
//     // Bucket: 'happypetproduction',
//     Bucket: bucketName || config.aws.bucket_name,
//     Key: fileKeyPath,
//     Body: fileBuffer,
//     ContentType: "image/webp",
//     // acl: 'public-read',
//   };

//   // Upload the new image
//   s3.putObject(uploadParams, function (err, data) {
//     if (err) {
//       console.error("Error uploading image:", err);
//     } else {
//       console.log("Successfully uploaded new image.", data);
//     }
//   });
// };

// module.exports = {
// s3Delete, s3Update
// };
