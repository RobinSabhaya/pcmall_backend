import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';

import {
  findDoc,
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from '../common/utils/mongoose.utils';
import { UserRole } from '../user/enums/user.enum';
import { UserService } from '../user/user.service';

import { CreateUpdateSellerDto, DeleteSellerDto } from './dto/seller.dto';
import { Seller } from './schema/seller.schema';
import {
  ICreateUpdateSeller,
  IDeleteSeller,
  IGetAllSellers,
} from './seller.interface';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller.name) private readonly sellerModel: Model<Seller>,
    private readonly userService: UserService,
  ) {}

  async createUpdateSeller(
    createUpdateSellerDto: CreateUpdateSellerDto,
  ): Promise<ICreateUpdateSeller> {
    const { sellerId, password, confirm_password, ...rest } =
      createUpdateSellerDto;

    let sellerData, userData, message;

    // Match password and confirm password
    if (
      password != null &&
      confirm_password != null &&
      password.localeCompare(confirm_password)
    )
      throw new BadRequestException('Invalid credentials.');

    /** Create and Update Seller */
    if (sellerId != null) {
      /** Get seller */
      sellerData = await findOneDoc(this.sellerModel, {
        _id: sellerId,
      });

      if (!sellerData) throw new NotFoundException('Seller not found');

      sellerData = await findOneAndUpdateDoc(
        this.sellerModel,
        { _id: sellerId },
        createUpdateSellerDto,
        {
          upsert: true,
          new: true,
        },
      );

      message = 'Seller update successfully';
    } else {
      userData = await this.userService.create({
        email: createUpdateSellerDto.businessEmail,
        password,
        roles: [UserRole.SELLER],
      });

      if (userData)
        sellerData = await findOneAndUpdateDoc(
          this.sellerModel,
          { ...rest, user: userData._id },
          { ...rest, user: userData._id },
          {
            upsert: true,
            new: true,
          },
        );

      message = 'Seller create successfully';
    }
    return {
      message,
      sellerData,
    };
  }

  async deleteSeller(deleteSellerDto: DeleteSellerDto): Promise<IDeleteSeller> {
    const { sellerId } = deleteSellerDto;

    let sellerData,
      message = '';

    /** Get seller */
    sellerData = await findOneDoc(this.sellerModel, {
      _id: sellerId,
    });

    if (!sellerData) throw new NotFoundException('Seller not found');

    sellerData = await findOneAndDeleteDoc(this.sellerModel, {
      _id: sellerId,
    });

    await this.userService.deleteUser({
      _id: sellerData?.user,
    });

    message = 'Seller delete successfully';

    return {
      message,
      sellerData,
    };
  }

  async getAllSellers(): Promise<IGetAllSellers> {
    const sellerData = await findDoc(this.sellerModel, {});
    return { sellerData };
  }

  async findOneSeller(filter: QueryFilter<Seller>): Promise<Seller | null> {
    return findOneDoc(this.sellerModel, filter);
  }
}
