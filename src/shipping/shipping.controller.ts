import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/schema/user.schema';

import {
  CreateUpdateShippingDto,
  GenerateShippingLabelDto,
  ShippingTrackDto,
} from './dto/shipping.dto';
import {
  IBuyShippingLabelResponse,
  ICreateUpdateShippingResponse,
  ITrackResponse,
} from './shipping.interface';
import { ShippingService } from './shipping.service';

@Controller({
  version: '1',
  path: 'shipping',
})
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  async createUpdateShipping(
    @CurrentUser() user: User,
    @Body() createUpdateShippingDto: CreateUpdateShippingDto,
  ): Promise<ICreateUpdateShippingResponse> {
    const { message, shippingData, shippingShipmentData } =
      await this.shippingService.createUpdateShipping(createUpdateShippingDto, {
        user,
      });

    return {
      success: true,
      message,
      data: {
        shippingData: shippingData ?? null,
        shippingShipmentData: shippingShipmentData ?? null,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('generate-label')
  async generateShippingLabel(
    @Body() generateShippingLabelDto: GenerateShippingLabelDto,
  ): Promise<IBuyShippingLabelResponse> {
    const { message, label } = await this.shippingService.generateShippingLabel(
      generateShippingLabelDto,
    );

    return {
      success: true,
      message,
      data: {
        label: label ?? null,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('track-shipping')
  async trackShipping(
    @Body() shippingTrackDto: ShippingTrackDto,
  ): Promise<ITrackResponse> {
    const { message, trackingData } =
      await this.shippingService.track(shippingTrackDto);

    return {
      success: true,
      message,
      data: {
        trackingData: trackingData ?? null,
      },
    };
  }
}
