import { Document } from "mongoose";

export interface IOrderItem {
  item_id: number;
  order_id: number;
  product_id: number;
  name: string;
  qty_invoiced: number;
  row_total_incl_tax: number;
  qty_refunded: number;
  amount_refunded: number;
}

export interface IOrder extends Document {
  entity_id?: number;
  state: string;
  status: string;
  base_grand_total: number;
  created_at: Date;
  updated_at: Date;
  customer_id: number;
  discount_amount: number;
  store_id: number;
  items: IOrderItem[];
  delivery_date?: Date;
  delivery_description?: string;
}
