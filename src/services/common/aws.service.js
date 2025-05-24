// const config = require('../config/config');
// const S3 = require('aws-sdk/clients/s3');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');

// const s3 = new S3({
//     region: config.aws.region,
//     accessKeyId: config.aws.access_key,
//     secretAccessKey: config.aws.secret_key,
// });

/** Upload image on AWS S3 bucket */
const localUpload = async (fileKeyPath, fileBuffer, fileType) => {
  // Check if the directory exists, and if not, create it
  if (!fs.existsSync(path.resolve(__dirname, `../${fileKeyPath.split('/')[0]}/${fileKeyPath.split('/')[1]}`))) {
    fs.mkdirSync(path.resolve(__dirname, `../${fileKeyPath.split('/')[0]}/${fileKeyPath.split('/')[1]}`), {
      recursive: true,
    });
  }

  await fs.writeFile(path.resolve(__dirname, `../${fileKeyPath}`), fileBuffer, (err, data) => {
    if (err) return false;
    return true;
  });
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
};

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

module.exports = {
  localUpload,
  // s3Delete, s3Update
};
