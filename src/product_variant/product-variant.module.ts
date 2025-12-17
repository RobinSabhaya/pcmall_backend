import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';
import {
  ProductVariant,
  ProductVariantSchema,
} from './schema/product-variant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductVariant.name,
        schema: ProductVariantSchema,
      },
    ]),
  ],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  exports: [MongooseModule],
})
export class ProductVariantModule {}
