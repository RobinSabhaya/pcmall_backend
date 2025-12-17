import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductBrandController } from './product-brand.controller';
import { ProductBrandService } from './product-brand.service';
import {
  ProductBrand,
  ProductBrandSchema,
} from './schema/product-brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductBrand.name,
        schema: ProductBrandSchema,
      },
    ]),
  ],
  controllers: [ProductBrandController],
  providers: [ProductBrandService],
})
export class ProductBrandModule {}
