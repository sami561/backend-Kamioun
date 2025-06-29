import { z } from "zod";
import { objectIdSchema } from "./zod.types";
import mongoose from "mongoose";

export const productSchema = z.object({
  _id: objectIdSchema.optional(),
  sku: z.string(),
  name: z.string(),
  price: z.number(),
  pcb: z.number().optional(),
  cost: z.number().optional(),
  special_price: z.number().optional(),
  image: z.array(z.string()).optional(),
  manufacturer: z.string().optional(),
  brand: z.instanceof(mongoose.Types.ObjectId).optional(),
  supplier: z.instanceof(mongoose.Types.ObjectId).optional(),
  categories: z.array(z.instanceof(mongoose.Types.ObjectId)),
  website_ids: z.array(z.number()),
  related_products: z.array(z.instanceof(mongoose.Types.ObjectId)).optional(),
  stock_item: z.object({
    item_id: z.number().optional(),
    product_id: z.number().optional(),
    stock_id: z.number().optional(),
    qty: z.number().optional(),
    is_in_stock: z.boolean().optional(),
    min_qty: z.number().optional(),
    min_sale_qty: z.number().optional(),
    max_sale_qty: z.number().optional(),
    backorders: z.number().optional(),
    low_stock_date: z.string().optional(),
  }),
});
export type Product = z.infer<typeof productSchema>;
