import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IOption } from '../common/interfaces/common.interface';
import {
  createDoc,
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
  updateManyDoc,
} from '../common/utils/mongoose.utils';

import { ICreateUpdateAddress, IDeleteAddress } from './address.interface';
import { CreateUpdateAddressDto, DeleteAddressDto } from './dto/address.dto';
import { Address } from './schema/address.schema';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
  ) {}

  async createUpdateAddress(
    createUpdateAddressDto: CreateUpdateAddressDto,
    options: IOption,
  ): Promise<ICreateUpdateAddress> {
    const { addressId, isPrimary } = createUpdateAddressDto;
    const { user } = options;
    let addressData, message;

    // Update Address
    if (addressId != null) {
      addressData = await findOneDoc(this.addressModel, { _id: addressId });

      if (!addressData) throw new NotFoundException('Address not found');

      if (isPrimary) {
        // Set default all the false
        await updateManyDoc(
          this.addressModel,
          {
            user: user?._id,
          },
          {
            isPrimary: false,
          },
        );
      }

      addressData = await findOneAndUpdateDoc(
        this.addressModel,
        { _id: addressId },
        { ...createUpdateAddressDto, isPrimary },
        { new: true },
      );

      message = 'User Address updated successfully';
    } else {
      addressData = await createDoc(this.addressModel, {
        ...createUpdateAddressDto,
        user: user._id,
        isPrimary: true,
      });

      message = 'User Address created successfully';
    }

    return {
      addressData,
      message,
    };
  }

  async deleteAddress(
    deleteAddressDto: DeleteAddressDto,
  ): Promise<IDeleteAddress> {
    const { addressId } = deleteAddressDto;
    let addressData = await findOneDoc(this.addressModel, {
      _id: addressId,
    });

    if (addressData?.isPrimary as boolean)
      throw new BadRequestException("You can't delete primary address.");

    addressData = await findOneAndDeleteDoc(this.addressModel, {
      _id: addressId,
    });

    return {
      addressData,
      message: 'Address deleted successfully',
    };
  }
}
