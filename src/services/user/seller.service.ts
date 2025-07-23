import { USER_ROLE } from "@/helpers/constant.helper";
import { createDoc, findDoc, findOneAndDeleteDoc, findOneAndUpdateDoc, findOneDoc } from "@/helpers/mongoose.helper";
import { MONGOOSE_MODELS } from "@/helpers/mongoose.model.helper";
import { ISeller, IUser } from "@/models/user";
import ApiError from "@/utils/ApiError";
import { CreateUpdateSellerSchema, DeleteSellerSchema, GetAllSellersSchema } from "@/validations/seller.validation";
import httpStatus from 'http-status'
import { DeleteSellerFilter } from "./seller.service.type";

interface IOptions { 
    user?:IUser
}

export const createUpdateSeller = async (reqBody: CreateUpdateSellerSchema, options?: IOptions): Promise<{
    message: string;
    sellerData: ISeller | null;
}> => { 
    const { sellerId, password, confirm_password, ...rest} = reqBody;

    let sellerData, userData, message;

    // Match password and confirm password
    if (password != confirm_password) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials.');

    /** Create and Update Seller */
    if (sellerId) {
      /** Get seller */
      sellerData = await findOneDoc<ISeller>(MONGOOSE_MODELS.SELLER, { _id: sellerId });

      if (!sellerData) throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');

      sellerData = await findOneAndUpdateDoc<ISeller>(MONGOOSE_MODELS.SELLER, { _id: sellerId }, reqBody, {
        upsert: true,
        new: true,
      });

      message = 'Seller update successfully';
    } else {
      userData = await createDoc<ISeller>(MONGOOSE_MODELS.USER, {
        email: reqBody.businessEmail,
        password,
        roles: [USER_ROLE.SELLER],
      });

      sellerData = await findOneAndUpdateDoc<ISeller>(
        MONGOOSE_MODELS.SELLER,
        { ...rest, user: userData._id },
        { ...rest, user: userData._id },
        {
          upsert: true,
          new: true,
        }
      );

      message = 'Seller create successfully';
    }
    return {
        message,
        sellerData
    }
}

export const deleteSeller = async (reqQuery: DeleteSellerSchema): Promise<{
    message: string;
    sellerData: ISeller | null;
}> => {
     const { sellerId } = reqQuery;
     console.log("🚀 ~ deleteSeller ~ sellerId:", sellerId)

    let sellerData, message;

    /** Get seller */
    sellerData = await findOneDoc<ISeller>(MONGOOSE_MODELS.SELLER, { _id: sellerId });

    if (!sellerData) throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');

    sellerData = await findOneAndDeleteDoc<ISeller>(MONGOOSE_MODELS.SELLER, { _id: sellerId });
    await findOneAndDeleteDoc<ISeller>(MONGOOSE_MODELS.USER, { _id: sellerData?.user });
    message = 'Seller delete successfully';

    return {
        message,
        sellerData
    }
}

export const getAllSellers = async (reqQuery: GetAllSellersSchema, options?: IOptions): Promise<{
  sellerData : ISeller[]
}> => { 
  const sellerData = await findDoc<ISeller>(MONGOOSE_MODELS.SELLER, reqQuery);
  return {sellerData}
}