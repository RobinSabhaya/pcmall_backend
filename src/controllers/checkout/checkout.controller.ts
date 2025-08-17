import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { IProductVariant } from '@/models/product';
import { IUser } from '@/models/user';
import { handlePayment } from '@/services/payment/paymentStrategy';
import { CheckoutSchema } from '@/validations/checkout.validation';

import { config } from '../../config/config';
import { findDoc } from '../../helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '../../helpers/mongoose.model.helper';
import ApiError from '../../utils/apiErrorHandler';

// checkout
export const checkout = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const user = request.user as IUser;
    const {
      shippingAddress,
      currency,
      items,
      shippoShipmentId,
      rateObjectId,
      cartIds,
    } = request.body as CheckoutSchema;

    const productVariantData = await findDoc<IProductVariant>(
      MONGOOSE_MODELS.PRODUCT_VARIANT,
      {
        _id: items.map(i => i.productVariantId),
      }
    );

    if (!productVariantData?.length)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Product variant not valid');

    const checkoutUrl = await handlePayment(
      config.paymentGateway.paymentProvider!
    ).createCheckoutSession({
      user,
      items,
      shippingAddress,
      currency,
      shippoShipmentId,
      rateObjectId,
      cartIds,
    });

    return reply.code(httpStatus.OK).send({
      success: true,
      data: {
        checkoutUrl,
      },
      message: 'Checkout link generate successfully!',
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
