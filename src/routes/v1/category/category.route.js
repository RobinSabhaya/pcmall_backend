const express = require('express');
const categoryController = require('../../../controllers/category/category.controller');
const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');

const router = express.Router();

router.get('/all', authorizeV3(USER_ROLE.BUYER), categoryController.getAllCategories);

module.exports = router;
