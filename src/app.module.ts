import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ZodValidationPipe } from 'nestjs-zod';

import { AddressModule } from './address/address.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import configuration from './config/configuration';
import { FileModule } from './file/file.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { ProductBrandModule } from './product-brand/product-brand.module';
import { ProductSkuModule } from './product-sku/product-sku.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { RoleModule } from './role/role.module';
import { SellerModule } from './seller/seller.module';
import { ShippingModule } from './shipping/shipping.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('mongoose.url'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10_000,
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60_000,
          limit: 100,
        },
      ],
    }),
    AuthModule,
    CartModule,
    RoleModule,
    UserModule,
    AddressModule,
    ProductVariantModule,
    ProductModule,
    ProductBrandModule,
    TokenModule,
    ProductSkuModule,
    CategoryModule,
    PaymentModule,
    OrderModule,
    WarehouseModule,
    SellerModule,
    SubCategoryModule,
    FileModule,
    InventoryModule,
    ShippingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
