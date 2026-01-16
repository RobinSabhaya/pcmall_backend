import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/schema/user.schema';

import { ICreateUpdateAddressResponse } from './address.interface';
import { AddressService } from './address.service';
import { CreateUpdateAddressDto, DeleteAddressDto } from './dto/address.dto';

@Controller({
  path: 'address',
  version: '1',
})
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create-update')
  async createUpdateAddress(
    @CurrentUser() user: User,
    @Body() createUpdateAddressDto: CreateUpdateAddressDto,
  ): Promise<ICreateUpdateAddressResponse> {
    const { addressData, message } =
      await this.addressService.createUpdateAddress(createUpdateAddressDto, {
        user,
      });

    return {
      success: true,
      message,
      data: { addressData: addressData ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete')
  async deleteAddress(
    @Query() deleteAddressDto: DeleteAddressDto,
  ): Promise<ICreateUpdateAddressResponse> {
    const { addressData, message } =
      await this.addressService.deleteAddress(deleteAddressDto);

    return {
      success: true,
      message,
      data: { addressData: addressData ?? null },
    };
  }
}
