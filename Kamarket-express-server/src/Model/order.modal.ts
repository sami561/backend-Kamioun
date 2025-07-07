import mongoose, { Schema, Document } from "mongoose";
import { IOrder, IOrderItem } from "../types/order.types";

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

const OrderSchema = new Schema<IOrder>(
  {
    state: { type: String, required: true },
    status: { type: String, required: true },
    base_grand_total: { type: Number, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
    customer_id: { type: Number, required: true },
    discount_amount: { type: Number, required: true },
    store_id: { type: Number },
    items: { type: [OrderItemSchema], required: true },
    delivery_date: { type: Date },
    delivery_description: { type: String },
  },
  { versionKey: false }
);

export default mongoose.model<IOrder>("Order", OrderSchema, "orders");
