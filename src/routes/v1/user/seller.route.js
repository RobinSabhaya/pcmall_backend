const express = require('express');

const route = express.Router();

const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');
const sellerController = require('../../../controllers/user/seller.controller');

route.post('/create-update', authorizeV3(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), sellerController.createUpdateSeller);

route.delete('/delete', authorizeV3(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), sellerController.deleteSeller);

route.get('/all', authorizeV3(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), sellerController.getAllSellers);

module.exports = route;
