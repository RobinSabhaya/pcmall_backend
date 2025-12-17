import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const addToCartSchema = z.object({
  productVariantId: z.string(),
  quantity: z.number(),
});

export const updateCartSchema = z.object({
  cartId: z.string(),
  quantity: z.number(),
});

export const removeCartSchema = z.object({
  cartId: z.string(),
});

export class AddToCartDto extends createZodDto(addToCartSchema) {}
export class UpdateCartDto extends createZodDto(updateCartSchema) {}
export class RemoveCartDto extends createZodDto(removeCartSchema) {}
