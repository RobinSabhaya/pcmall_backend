import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductModule } from '../product/product.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';

import { ProductSkuController } from './product-sku.controller';
import { ProductSkuService } from './product-sku.service';
import { ProductSku, ProductSkuSchema } from './schema/product-sku.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductSku.name,
        schema: ProductSkuSchema,
      },
    ]),
    ProductVariantModule,
    ProductModule,
  ],
  controllers: [ProductSkuController],
  providers: [ProductSkuService],
  exports: [ProductSkuService],
})
export class ProductSkuModule {}
