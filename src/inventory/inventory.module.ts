import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductSkuModule } from '../product-sku/product-sku.module';
import { WarehouseModule } from '../warehouse/warehouse.module';

import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import {
  InventoryLog,
  InventoryLogSchema,
} from './schema/inventory-log.schema';
import { Inventory, InventorySchema } from './schema/inventory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Inventory.name,
        schema: InventorySchema,
      },
      {
        name: InventoryLog.name,
        schema: InventoryLogSchema,
      },
    ]),
    ProductSkuModule,
    WarehouseModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
