// const upload = require('../../../middlewares/upload');
import * as userController from '../../../controllers/user/user.controller';
import { FastifyInstance } from "fastify";
import { USER_ROLE } from '../../../helpers/constant.helper'

export default async function cartRoute(fastify: FastifyInstance) {

    fastify.put('/update', userController.updateUser);

    fastify.get('/details', userController.getUser);

    fastify.put('/address/update', userController.updateAddress);

    fastify.delete('/address/delete/:_id', userController.deleteAddress);
}
