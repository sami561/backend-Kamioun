import { z } from "zod";
import { baseRequestSchema } from "./common.types";

const cartItemSchema = z.object({
  product: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

const cartSchema = z.object({
  _id: z.string().optional(),
  user: z.string(),
  items: z.array(cartItemSchema).default([]),
  total: z.number().min(0).default(0),
  status: z.enum(["active", "converted", "abandoned"]).default("active"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Cart = z.infer<typeof cartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

// DTOs for cart operations
export const addToCartDto = z.object({
  productId: z.string(),
  quantity: z.number().min(1).default(1),
});

export const updateCartItemDto = z.object({
  quantity: z.number().min(1),
});

export type AddToCartDto = z.infer<typeof addToCartDto>;
export type UpdateCartItemDto = z.infer<typeof updateCartItemDto>;

// Request schemas
export const addToCartRequestSchema = baseRequestSchema.extend({
  body: addToCartDto,
});

export const updateCartItemRequestSchema = baseRequestSchema.extend({
  body: updateCartItemDto,
});
