import { z } from 'zod';

export const OrderItemSchema = z.object({
  item_id: z.number(),
  order_id: z.number(),
  product_id: z.number(),
  name: z.string(),
  qty_invoiced: z.number(),
  row_total_incl_tax: z.number(),
  qty_refunded: z.number(),
  amount_refunded: z.number(),
});

export const OrderSchema = z.object({
  entity_id: z.number(),
  state: z.string(),
  status: z.string(),
  base_grand_total: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
  customer_id: z.number(),
  discount_amount: z.number(),
  store_id: z.number(),
  items: z.array(OrderItemSchema),
});

export type Order = z.infer<typeof OrderSchema>;
