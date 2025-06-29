import { z } from 'zod';

export const ProductStockSchema = z.object({
  product_id: z.number(),
  stock: z.array(z.object({
    store_id: z.number(),
    quantity: z.number(),
    price: z.number(),
  })),
});

export type ProductStock = z.infer<typeof ProductStockSchema>;
