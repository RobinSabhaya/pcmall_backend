import { FastifyReply, FastifyRequest } from "fastify";
import * as categoryService from '../../services/category/category.service'
import httpStatus from "http-status";

export const getAllCategories = async (request: FastifyRequest, reply: FastifyReply) => {
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

  return reply.code(httpStatus.OK).send({
    success: true,
    data: categoryData,
  });
}