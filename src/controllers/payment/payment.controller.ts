import { handlePayment } from "@/services/payment/paymentStrategy"
import ApiError from "@/utils/ApiError"
import { FastifyReply, FastifyRequest } from "fastify"
import httpStatus from 'http-status'
import { config} from '@/config/config'
import { CreatePaymentRefundSchema } from "@/validations/payment.validation"

const { paymentGateway:{paymentProvider}} = config

export const createPaymentRefund = async(request:FastifyRequest,reply:FastifyReply) => { 
    try {
        const {paymentData,
            message} = await handlePayment(paymentProvider).createPaymentRefund(request.body as CreatePaymentRefundSchema)

        return reply.code(httpStatus.OK).send({
            success : true,
            data:paymentData,
            message
        })
    } catch (error) {
        if (error instanceof Error)
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,error.message || 'something went wrong')
    }
}