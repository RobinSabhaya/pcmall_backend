const express = require('express');

const route = express.Router();

const { authorizeV3 } = require('../../../middlewares/auth');
const upload = require('../../../middlewares/upload');
const { USER_ROLE } = require('../../../helpers/constant.helper');
const userController = require('../../../controllers/user/user.controller');

route.put('/update', authorizeV3(USER_ROLE.BUYER), upload.single('file'), userController.updateUser);

route.get('/details', authorizeV3(USER_ROLE.BUYER), userController.getUser);

route.put('/address/update', authorizeV3(USER_ROLE.BUYER), userController.updateAddress);

route.delete('/address/delete/:_id', authorizeV3(USER_ROLE.BUYER), userController.deleteAddress);

module.exports = route;
