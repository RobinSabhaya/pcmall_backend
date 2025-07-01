const catchAsync = require('../../utils/catchAsync');
const ratingService = require('../../services/rating/rating.service');
const fileService = require('../../services/common/file.service');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');
const { createDoc, findOneDoc } = require('../../helpers/mongoose.helper');
const ApiError = require('../../utils/ApiError');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { FILES_FOLDER } = require('../../helpers/constant.helper');

/**
 * Create Rating
 */
const createRating = catchAsync(async (req, res) => {
  const { productId } = req.body;
  req.body.user = req.user._id;
  const files = req.files;

  /** Check product */
  const productData = await findOneDoc(MONGOOSE_MODELS.PRODUCT, {
    _id: productId,
  });

  if (!productData) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  req.body.product = productData._id;

  if (files?.length) {
    const uploadFiles = [];
    await Promise.all(
      files.map(async (file) => {
        const fileName = await fileService.generateFileName(file);
        await fileService.saveFiles([
          {
            fileName,
            fileBuffer: file.buffer,
            fileMainFolder: FILES_FOLDER.PUBLIC,
            fileUploadType: 'single',
            subFolderName: FILES_FOLDER.TEMP,
            fileMimeType: file.mimetype,
            fileSize: file.size,
          },
        ]);
        uploadFiles.push(fileName);
      })
    );
    req.body.images = uploadFiles;
  }

  /** Create Rating */
  const ratingData = await createDoc(MONGOOSE_MODELS.RATING, req.body);

  return res.status(httpStatus.OK).json({
    success: true,
    data: ratingData,
  });
});

/**
 * Get rating list
 */
const getRatingList = catchAsync(async (req, res) => {
  const { productId, ...options } = req.query;

  /** Get rating count */
  const ratingCount = await ratingService.getRatingCount(
    {
      product: new mongoose.Types.ObjectId(productId),
    },
    options
  );

  const ratingData = await ratingService.getRatingList(
    {
      product: new mongoose.Types.ObjectId(productId),
    },
    options
  );

  return res.status(httpStatus.OK).json({
    success: true,
    data: {
      ratingCount,
      ratingList: ratingData,
    },
  });
});

module.exports = {
  createRating,
  getRatingList,
};
