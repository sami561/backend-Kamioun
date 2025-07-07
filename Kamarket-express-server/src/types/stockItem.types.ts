import { z } from "zod";
import { objectIdSchema } from "./zod.types";

export const stockItemSchema = z.object({
  _id: objectIdSchema.optional(),
  item_id: z.number().optional(),
  stock_id: z.number().optional(),
  qty: z.number().optional(),
  is_in_stock: z.boolean().optional(),
  min_qty: z.number().optional(),
  min_sale_qty: z.number().optional(),
  max_sale_qty: z.number().optional(),
  backorders: z.number().optional(),
  low_stock_date: z.string().optional(),
});

export type StockItem = z.infer<typeof stockItemSchema>;
