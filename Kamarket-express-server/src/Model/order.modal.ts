import mongoose, { Schema, Document } from "mongoose";
import {
  IOrder,
  IOrderItem,
  OrderState,
  OrderStatus,
} from "../types/order.types";
import OrderLifecycleEventSchema from "./orderLifecycle.model";
import OrderItemSchema from "./orderItem.model";

const OrderSchema = new Schema<IOrder>(
  {
    state: {
      type: String,
      enum: Object.values(OrderState),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
    },
    total: { type: Number, required: true },
    customer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    discount_amount: { type: Number, required: true },
    store_id: { type: Number },
    items: { type: [OrderItemSchema], required: true },
    delivery_date: { type: Date, required: true },
    delivery_description: { type: String },
    lifecycle: { type: [OrderLifecycleEventSchema], default: [] },
  },
  { versionKey: false }
);

export default mongoose.model<IOrder>("Order", OrderSchema, "orders");
