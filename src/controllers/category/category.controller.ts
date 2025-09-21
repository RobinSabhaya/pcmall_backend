import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import * as categoryService from '../../services/category/category.service';

export const getAllCategories = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  // get all category
  const { categoryData } = await categoryService.getAllCategories(
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
    data: { categoryData },
  });
};
