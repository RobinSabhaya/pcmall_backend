// const upload = require('../../../middlewares/upload');
import * as userController from '@/controllers/user/user.controller';
import * as userValidation from '@/validations/user.validation';
import { FastifyInstance } from "fastify";
import { USER_ROLE } from '../../../helpers/constant.helper'
import { createBaseRoute } from '@/utils/baseRoute';

export default async function cartRoute(fastify: FastifyInstance) {

      const route = createBaseRoute(fastify);
    
       route({
          method: "PUT",
          url: "/update",
          preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
          schema: userValidation.updateUser,
          handler: userController.updateUser,
       });
    
       route({
          method: "GET",
          url: "/details",
          preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
          schema: userValidation.getUser,
          handler: userController.getUser,
        });

       route({
          method: "PUT",
          url: "/address/update",
          preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
          schema: userValidation.updateAddress,
          handler: userController.updateAddress,
        });
        
       route({
          method: "DELETE",
          url: "/address/delete/:_id",
          preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
          schema: userValidation.deleteAddress,
          handler: userController.deleteAddress,
        });
}
