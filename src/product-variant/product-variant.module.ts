import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
  providers: [ProductVariantService],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
