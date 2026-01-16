import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SellerModule } from '../seller/seller.module';

import { Warehouse, WarehouseSchema } from './schema/warehouse.schema';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Warehouse.name, schema: WarehouseSchema },
    ]),
    SellerModule,
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
