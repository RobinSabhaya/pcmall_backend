const catchAsync = require('../../utils/catchAsync');
const ratingService = require('../../services/rating/rating.service');
const fileService = require('../../services/common/file.service');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');
const { createDoc, findOneDoc } = require('../../helpers/mongoose.helper');
const ApiError = require('../../utils/ApiError');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { FILES_FOLDER } = require('../../helpers/constant.helper');
const { handleStorage } = require('../../services/storage/storageStrategy');
const {
  minIO: { fileStorageProvider },
} = require('../../config/config');

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
    message: 'Rating added successfully',
    data: ratingData,
  });
});

/**
 * Get rating list
 */
const getRatingList = catchAsync(async (req, res) => {
  const { productId, rating, ...options } = req.query;

  const filter = {};

  if (productId) filter.product = new mongoose.Types.ObjectId(productId);

  if (rating) filter.rating = +rating;

  const ratingData = await ratingService.getRatingList(filter, options);

  if (ratingData[0]?.results?.length)
    await Promise.all(
      ratingData[0]?.results.map(async (rating) => {
        // For rating images
        if (!rating.images.includes(null) && !rating.images.includes('')) {
          rating.images = await Promise.all(
            rating.images.map((img) => handleStorage(fileStorageProvider).getFileLink({ fileName: img }))
          );
        } else {
          rating.images = [];
        }

        // For user profile picture
        if (rating.user_profile?.profile_picture && rating.user_profile.profile_picture !== '') {
          rating.user_profile.profile_picture = await handleStorage(fileStorageProvider).getFileLink({
            fileName: rating.user_profile.profile_picture,
          });
        } else {
          rating.user_profile.profile_picture = null;
        }

        return rating;
      })
    );

  return res.status(httpStatus.OK).json({
    success: true,
    data: {
      results: ratingData[0]?.results,
      totalResults: ratingData[0].totalResults,
      page: ratingData[0].page,
      limit: ratingData[0].limit,
      totalPages: ratingData[0].totalPages,
    },
  });
});

/** Get rating count */
const getRatingCount = catchAsync(async (req, res) => {
  const { productId, rating, ...options } = req.query;

  const filter = {};

  if (productId) filter.product = new mongoose.Types.ObjectId(productId);

  if (rating) filter.rating = +rating;

  /** Get rating count */
  const ratingCount = await ratingService.getRatingCount(filter, options);

  return res.status(httpStatus.OK).json({
    success: true,
    data: {
      ratingCount: ratingCount[0],
    },
  });
});

module.exports = {
  createRating,
  getRatingList,
  getRatingCount,
};
