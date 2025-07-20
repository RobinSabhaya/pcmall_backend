import * as ratingController from '../../../controllers/rating/rating.controller';
import { FastifyInstance } from "fastify";
import { USER_ROLE } from '../../../helpers/constant.helper'

export default function ratingRoute(fastify: FastifyInstance) {
    fastify.post('/create', ratingController.createRating);
    fastify.get('/all', ratingController.getRatingList);
    fastify.get('/count', ratingController.getRatingCount);
}
