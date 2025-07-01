const express = require('express');
const ratingController = require('../../../controllers/rating/rating.controller');
const { authorizeV3 } = require('../../../middlewares/auth');
const upload = require('../../../middlewares/upload');
const { USER_ROLE } = require('../../../helpers/constant.helper');

const router = express.Router();

router.post('/create', authorizeV3(USER_ROLE.BUYER), upload.array('file', 5), ratingController.createRating);
router.get('/all', authorizeV3(USER_ROLE.BUYER), ratingController.getRatingList);

module.exports = router;
