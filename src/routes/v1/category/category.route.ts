import { FastifyInstance } from "fastify";
import { getAllCategories } from '../../../controllers/category/category.controller';
import { USER_ROLE } from '../../../helpers/constant.helper'

export default async function categoryRoute(fastify: FastifyInstance) {
    fastify.get('/all', getAllCategories);
}