const httpStatus = require('http-status');
const categoryService = require('../../services/category/category.service');
const catchAsync = require('../../utils/catchAsync');

const getAllCategories = catchAsync(async (req, res) => {
  // get all category
  const categoryData = await categoryService.getAllCategories(
    {},
    {
      populate: [
        {
          path: 'subCategory',
        },
      ],
    }
  );

  return res.status(httpStatus.OK).json({
    success: true,
    data: categoryData,
  });
});

module.exports = { getAllCategories };
