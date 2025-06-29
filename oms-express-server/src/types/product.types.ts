import { z } from 'zod';
import { objectIdSchema } from './zod.types';
export const ProductSchema = z.object({
  _id: objectIdSchema.optional(),
});
export type Product = z.infer<typeof ProductSchema>;
