import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/schema/user.schema';

import { GetAllOrdersDto } from './dto/order.dto';
import { IGetAllOrdersResponse } from './order.interface';
import { OrderService } from './order.service';

@Controller({
  path: 'order',
  version: '1',
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getAllOrders(
    @CurrentUser() user: User,
    @Query() getAllOrdersDto: GetAllOrdersDto,
  ): Promise<IGetAllOrdersResponse> {
    const ordersData = await this.orderService.getAllOrders(getAllOrdersDto, {
      user,
    });

    return {
      success: true,
      data: { ordersData: ordersData[0] ?? [] },
    };
  }
}
