const fs = require('fs');
const { FILES_FOLDER } = require('../helper/constant.helper');
const httpStatus = require('http-status');
const path = require('path');
const ApiError = require('../utils/ApiError');
const { localUpload } = require('./aws.service');
const sharp = require('sharp');

const createFilePath = (filePath) => {
  let file_path = `${filePath.mainFolderName}`;
  if (filePath.idFolder) file_path = `${file_path}/${String(filePath.idFolder)}`; // Add folder name(idFolder) in write file path.
  if (filePath.subFolderName) file_path = `${file_path}/${filePath.subFolderName}`; // Add sub folder name in write file path.

  return file_path;
};

/**
 * Create folder.
 * @param {Object} [folder] - File payload.
 * @param {string} [folder.folderName] - File's folder name.
 * @param {string} [folder.innerFolderName] - File's inner folder name.
 * @returns {Promise<String>} - Folder path.
 */
const createFolder = (folder) => {
  const publicDir = `./${FILES_FOLDER.public}`;
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir); // If public folder doesn't exist, create it.
  }

  let folderPath = path.join(publicDir, folder.folderName); // Add folder name in write file path.

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath); // If write file path doesn't exist, create it.
  }

  if (folder.innerFolderName) {
    folderPath = path.join(folderPath, folder.innerFolderName); // Add folder name(innerFolderName) in write file path.

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath); // If write file path doesn't exist, create it.
    }
  }

  return folderPath;
};

/**
 * File compress.
 * @param {String} fromFile
 * @param {String} toFile
 * @param {String} ext
 * @param {Number} quality
 * @param {buffer} buffer
 * @returns
 */
const sharpCompress = async (fromFile, toFile, ext, quality, buffer) => {
  try {
    const compress = await sharp(buffer)
      .toFormat(ext, { quality })
      .toBuffer()
      .then((data) => data)
      .catch(() => false);
    await localUpload(toFile, compress, { filePathForMimeType: fromFile });
    return !compress ? false : toFile.split('/').at(-1); // Create file name.
  } catch (error) {
    throw new ApiError(error.statusCode, error.message, '', '');
  }
};

/**
 * File Resize.
 * @param {String} fromFile
 * @param {String} toFile
 * @param {Array} size
 * @returns
 */
const sharpResize = (fromFile, toFile, size) => {
  const resize = sharp(fromFile)
    .resize(...size)
    .toFile(toFile);

  return !resize ? false : toFile.split('/').at(-1); // Create file name.
};

/**
 * Save file.
 * @param {Object} [filePayload] - File payload.
 * @param {string} [filePayload.folderName] - File's folder name.
 * @param {string} [filePayload.innerFolderName] - File's inner folder name.
 * @param {Object} [filePayload.file] - File data.
 * @param {Object} [filePayload.file.originalname] - File original name.
 * @param {Object} [filePayload.file.buffer] - File buffer.
 * @returns {Promise<QueryResult>}
 */
exports.saveFile = (filePayload) => {
  try {
    let writeFilePath = createFolder({
      folderName: filePayload.folderName,
      innerFolderName: filePayload.innerFolderName,
    });

    const writeFile = (file) => {
      const fileName = 'org_' + Date.now() + path.extname(file.originalname); // Create file name.

      let filePath = path.join(writeFilePath, fileName);

      fs.writeFileSync(`./${filePath}`, file.buffer, 'base64'); // Create file.

      return { name: fileName, path: filePath };
    };

    if (Array.isArray(filePayload.file)) {
      const fileData = [];

      for (let i = 0; i < filePayload.file.length; i++) {
        fileData.push(writeFile(filePayload.file[i]));
      }

      return {
        name: fileData.map((ele) => ele.name),
        path: fileData.map((ele) => ele.path),
      };
    } else {
      return writeFile(filePayload.file);
    }
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, generateMessage('something_went_wrong'));
  }
};

/**
 * Compress file using path.
 * @param {String} fromFile - From file path
 * @param {Object} fileQuality
 * @param {String} [fileQuality.type] - File quality type large/small
 * @param {Number} [fileQuality.quality] - File quality
 * @returns
 */
exports.compressFileUsingPath = async (fromFile, fileQuality) => {
  try {
    const fileCompress = async (fromFile) => {
      let toFile = fromFile.replace('org', fileQuality.type); // Create file name.

      return sharpCompress(fromFile, toFile, path.extname(toFile).slice(1), fileQuality.quality);
    };

    if (Array.isArray(fromFile)) {
      const files = [];

      for (let i = 0; i < fromFile.length; i++) {
        const isCompress = await fileCompress(fromFile[i]);

        if (!isCompress) return false;

        files.push(isCompress);
      }

      return files;
    } else {
      const isCompress = await fileCompress(fromFile);

      return !isCompress ? false : isCompress;
    }
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, generateMessage('something_went_wrong'));
  }
};

/**
 * Compress file using sharp.
 * @param {Object} filePayload
 * @param {String} [filePayload.folderName] - Main folder name
 * @param {String} [filePayload.subFolderName] - Sub folder name
 * @param {String} [filePayload.idFolder] - ID folder name
 * @param {Object} [filePayload.file] - Req file object
 * @param {Boolean} [filePayload.needCompress] - true / false
 * @param {Object} fileQuality -
 * @param {String} [fileQuality.type] - Quality type large/small
 * @param {Number} [fileQuality.quality] - File quality
 * @returns
 */
exports.compressFileUsingBuffer = async (filePayload, fileQuality) => {
  try {
    let writeFilePath = createFolder({
      mainFolderName: filePayload.folderName,
      subFolderName: filePayload?.subFolderName || null,
      idFolder: filePayload?.idFolder || null,
    });

    const fileCompress = async (fromFile, fileName, mimeType) => {
      let ext = path.extname(fromFile.originalname);
      const file_name = `${fileQuality.type}_${fileName}`;

      const compress = await sharp(fromFile.buffer)
        .toFormat(ext.split('.')[1], { quality: fileQuality.quality })
        .toBuffer()
        .then((data) => data)
        .catch(() => false);

      await localUpload(`${writeFilePath}/${file_name}`, compress, { mimeType });
      return !compress ? false : fileName;
    };

    if (Array.isArray(filePayload.file)) {
      const files = [];

      for (let i = 0; i < filePayload.file.length; i++) {
        let ext = path.extname(filePayload.file[i].originalname);
        const fileName = `file_${Date.now()}${ext}`;
        await localUpload(`${writeFilePath}/${fileName}`, filePayload.file[i].buffer, {
          mimeType: filePayload?.file[i]?.mimetype,
        });
        await fileCompress(filePayload.file[i], fileName, filePayload?.file[i]?.mimetype);

        files.push(fileName);
      }

      return files;
    } else {
      let ext = path.extname(filePayload.file.originalname);
      const fileName = `file_${Date.now()}${ext}`;
      await localUpload(`${writeFilePath}/${fileName}`, filePayload.file.buffer, {
        mimeType: filePayload?.file?.mimetype,
      });

      if (filePayload.needCompress) {
        await fileCompress(filePayload.file, fileName, filePayload?.file?.mimetype);
      }

      return fileName;
    }
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, generateMessage('something_went_wrong'));
  }
};

/**
 * Resize file using path.
 * @param {String} fromFile - From file path
 * @param {Object} fileSize
 * @param {String} [fileSize.type] - File quality type large/small
 * @param {Number} [fileSize.size] - File size
 * @returns
 */
exports.resizeFileUsingPath = async (fromFile, fileSize) => {
  try {
    const fileResize = async (fromFile) => {
      let toFile = fromFile.replace('org', fileSize.type); // Create file name.

      return sharpResize(fromFile, toFile, fileSize.size);
    };

    if (Array.isArray(fromFile)) {
      const files = [];

      for (let i = 0; i < fromFile.length; i++) {
        const isCompress = await fileResize(fromFile[i]);

        if (!isCompress) return false;

        files.push(isCompress);
      }

      return files;
    } else {
      const isCompress = await fileResize(fromFile);

      return !isCompress ? false : isCompress;
    }
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, generateMessage('something_went_wrong'));
  }
};

/**
 * Compress file using buffer.
 * @param {Object} filePayload
 * @param {String} [filePayload.folderName] - Main folder name
 * @param {string} [filePayload.innerFolderName] - File's inner folder name.
 * @param {Object} [filePayload.file] - Req file object
 * @param {Object} fileSize -
 * @param {String} [fileSize.type] - File size type large/small
 * @param {Number} [fileSize.size] - File size
 * @returns
 */
exports.resizeFileUsingBuffer = async (filePayload, fileSize) => {
  try {
    let writeFilePath = createFolder({
      folderName: filePayload.folderName,
      innerFolderName: filePayload.innerFolderName,
    });

    const fileResize = async (fromFile) => {
      let ext = fromFile.originalname.split('.').at(-1);

      return sharpResize(fromFile.buffer, `./${writeFilePath}/${fileSize.type}_${Date.now()}.${ext}`, fileSize.size);
    };

    if (Array.isArray(filePayload.file)) {
      const files = [];

      for (let i = 0; i < filePayload.file.length; i++) {
        const isResize = await fileResize(filePayload.file[i]);

        if (!isResize) return false;

        files.push(isResize);
      }

      return files;
    } else {
      const isResize = await fileResize(filePayload.file);

      return !isResize ? false : isResize;
    }
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, generateMessage('something_went_wrong'));
  }
};

/**
 * Delete file.
 * @param {String} filePath - File path.
 */
exports.deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
 * Delete files.
 * @param {Array} filePath - Array of file path.
 */
exports.deleteFiles = (filePath) => {
  for (let i = 0; i < filePath.length; i++) {
    if (fs.existsSync(filePath[i])) {
      fs.unlinkSync(filePath[i]);
    }
  }
};

/**
 * Compress file in all given qualities
 * @param {String} fromFile
 * @param {Array} qualities
 * @param {String} toFile
 * @param {String} fileName
 * @returns {Boolean}
 */
const compressFile = async (fromFile, qualities, toFile, fileName, buffer) => {
  try {
    for (let i = 0; i < qualities.length; i++) {
      const toFilePath = `${toFile}/${qualities[i].type}_${fileName}`;

      await sharpCompress(fromFile, toFilePath, fromFile.split('/')[1], qualities[i].quality, buffer);
    }
    return true;
  } catch (error) {
    throw new ApiError(error.statusCode, error.message, '', '');
  }
};

/**
 * Store file with compress in particular given folder
 * @param {Object} filesDtl
 * @param {string} [filesDtl.fileUploadType]
 * @param {string} [filesDtl.fileName]
 * @param {string} [filesDtl.fileMainFolder]
 * @param {string} [filesDtl.subFolderName]
 * @param {string} [filesDtl.idFolder]
 * @param {Buffer} [filesDtl.fileBuffer]
 * @param {string} [filesDtl.fileMimeType]
 * @param {Array<string>} [filesDtl.fileQualities]
 * @param {Boolean} [filesDtl.needCompress]
 * @returns {Boolean}
 */
exports.saveFiles = async (filesDtl) => {
  try {
    for (let j = 0; j < filesDtl.length; j++) {
      const writeFilePath = createFilePath({
        mainFolderName: filesDtl[j].fileMainFolder,
        subFolderName: filesDtl[j].subFolderName || null,
        idFolder: filesDtl[j].idFolder || null,
      });

      if (filesDtl[j].fileUploadType === 'single') {
        let fileName = Buffer.from(filesDtl[j].fileName.split('/').at(-1), 'latin1').toString('utf-8'); //! For support non-latin language
        const fromFile = filesDtl[j].fileMimeType;
        let buffer = filesDtl[j].fileBuffer;
        if (fromFile.split('/').includes('image')) {
          buffer = await sharp(filesDtl[j].fileBuffer).toFormat('webp').toBuffer();
        }
        // const buffer = fs.readFileSync(path.join(__dirname, '../../public', fromFile));
        /** save original file */
        // fs.copyFileSync(fromFile, `${writeFilePath}/${filesDtl[j].fileName}`);

        await localUpload(`${writeFilePath}/${fileName}`, buffer, {
          filePathForMimeType: fromFile,
        });

        if (filesDtl[j].needCompress) {
          await compressFile(fromFile, filesDtl[j]?.fileQualities, writeFilePath, filesDtl[j].fileName, buffer);
        }
      } else {
        for (let i = 0; i < filesDtl[j].fileName.length; i++) {
          let fileName = filesDtl[j].fileName;

          const fromFile = filesDtl[j].fileMimeType;
          let buffer = filesDtl[j].fileBuffer;
          if (fromFile.split('/').includes('image')) {
            buffer = await sharp(filesDtl[j].fileBuffer).toFormat('webp').toBuffer();
          }

          /** save original file */
          await localUpload(`${writeFilePath}/${fileName}`, buffer, {
            filePathForMimeType: fromFile,
          });
          // fs.copyFileSync(fromFile, `${writeFilePath}/${filesDtl[j].fileName[i]}`);
          if (filesDtl[j].needCompress) {
            await compressFile(fromFile, filesDtl[j]?.fileQualities, writeFilePath, filesDtl[j].fileName[i], buffer);
          }
        }
      }
    }

    return true;
  } catch (error) {
    throw new ApiError(error.statusCode, error.message, '', '');
  }
};

/**
 * Validate image files
 * @param {Object} filesObj
 * @returns {Boolean}
 */
exports.validateImageFile = async (filesObj) => {
  try {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.docx'];

    for (const key in filesObj) {
      if (Array.isArray(filesObj[key])) {
        for (const filename of filesObj[key]) {
          const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
          if (!allowedExtensions.includes(extension)) {
            throw new ApiError(
              httpStatus.BAD_REQUEST,
              `${key} some files are not valid, please check once. allowed extensions are (${allowedExtensions})`,
              '',
              ''
            );
          }
        }
      } else if (typeof filesObj[key] === 'string') {
        const extension = filesObj[key].substring(filesObj[key].lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(extension)) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `${key} file is not valid, please check once. allowed extensions are (${allowedExtensions})`,
            '',
            ''
          );
        }
      }
    }
    return true;
  } catch (error) {
    throw new ApiError(error.statusCode, error.message, '', '');
  }
};

/**
 * Validate document types
 * @param {Object} filesObj
 * @returns {Promise<Boolean>}
 */
exports.validateDocFile = async (filesObj) => {
  try {
    const allowedExtensions = ['.pdf', '.docx'];

    for (const key in filesObj) {
      if (Array.isArray(filesObj[key])) {
        for (const filename of filesObj[key]) {
          const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
          if (!allowedExtensions.includes(extension)) {
            throw new ApiError(
              httpStatus.BAD_REQUEST,
              `${key} some files are not valid, please check once. allowed extensions are (${allowedExtensions})`,
              '',
              ''
            );
          }
        }
      } else if (typeof filesObj[key] === 'string') {
        const extension = filesObj[key].substring(filesObj[key].lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(extension)) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `${key} file is not valid, please check once. allowed extensions are (${allowedExtensions})`,
            '',
            ''
          );
        }
      }
    }
    return true;
  } catch (error) {
    throw new ApiError(error.statusCode, error.message, '', '');
  }
};

// Upload images without compress
exports.uploadWithoutCompress = async (file, uploadFolder, fileFor) => {
  const ext = file.originalname === 'blob' ? `.${file.mimetype.split('/')[1]}` : path.extname(file.originalname);

  // Check file size is greater than 10 MB (Binary)?
  if (file.size > 10485760) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Maximum image size limit is 10 MB.');
  }

  // Check file formate
  switch (fileFor) {
    case 'image':
      if (!['.png', '.jpg', '.jpeg', '.webp', '.gif', '.tiff'].includes(ext.toLowerCase()))
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Only .png, .jpg, .jpeg, .webp, .gif, .tiff formats are allowed.',
          '',
          ''
        );
      break;
    case 'sound':
      if (!['.mp3', '.wav', '.wav', '.ogg', '.m4a'].includes(ext.toLowerCase()))
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only .mp3, .wav, .ogg, .m4a formats are allowed.', '', '');
      break;
    case 'csv':
      if (ext !== '.csv') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only .csv format is allowed.', '', '');
      }
      break;
    case 'document':
      if (!['.pdf', '.docx'].includes(ext.toLowerCase())) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only .pdf .docx format is allowed.', '', '');
      }
      break;

    default:
      if (!['.png', '.jpg', '.jpeg', '.webp', '.mp3', '.wav', '.ogg', '.m4a', '.pdf', '.docx'].includes(ext.toLowerCase()))
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Only .png, .jpg, .jpeg, .webp, .mp3, .wav, .ogg, .m4a .pdf and .docx formats are allowed.'
        );
      break;
  }

  const dir = `./${FILES_FOLDER.public}/${uploadFolder}`;
  let tempFileName;

  // Check that if directory is present or not.
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Check file extension for convert image into .webp format
  if (
    (['.png', '.jpg', '.jpeg'].includes(ext.toLowerCase()) || fileFor === 'image') &&
    !['.webp'].includes(ext.toLowerCase())
  ) {
    tempFileName = `file_${Date.now()}.webp`;
    const fileName = `${dir}/${tempFileName}`;

    await sharp(file.buffer).toFormat('webp').toFile(fileName);
  } else {
    tempFileName = `file_${Date.now()}${ext}`;
    const fileName = `${dir}/${tempFileName}`;

    fs.writeFileSync(fileName, file.buffer, 'base64');
  }

  return tempFileName;
};

exports.generateFileName = (file) => {
  const ext = path.extname(file.originalname);
  return `file_${Date.now()}${Math.random().toString(16).slice(2, 7)}${ext}`;
};
