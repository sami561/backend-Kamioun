import mongoose, { Schema, Document } from 'mongoose';

interface IOrderItem {
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
  entity_id: number;
  state: string;
  status: string;
  base_grand_total: number;
  created_at: Date;
  updated_at: Date;
  customer_id: number;
  discount_amount: number;
  store_id: number;
  items: IOrderItem[];
}

const OrderItemSchema = new Schema<IOrderItem>({
  item_id: { type: Number, required: true },
  order_id: { type: Number, required: true },
  product_id: { type: Number, required: true },
  name: { type: String, required: true },
  qty_invoiced: { type: Number, required: true },
  row_total_incl_tax: { type: Number, required: true },
  qty_refunded: { type: Number, required: true },
  amount_refunded: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>({
  entity_id: { type: Number, required: true, unique: true },
  state: { type: String, required: true },
  status: { type: String, required: true },
  base_grand_total: { type: Number, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  customer_id: { type: Number, required: true },
  discount_amount: { type: Number, required: true },
  store_id: { type: Number, required: true },
  items: { type: [OrderItemSchema], required: true },
}, { versionKey: false });

export default mongoose.model<IOrder>('Order', OrderSchema, 'orders');
