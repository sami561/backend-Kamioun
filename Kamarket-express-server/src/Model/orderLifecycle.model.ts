import { Schema } from "mongoose";
import { OrderState, OrderStatus } from "../types/order.types";

const OrderLifecycleEventSchema = new Schema(
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
    date: { type: Date, required: true },
    description: { type: String },
  },
  { _id: false }
);

export default OrderLifecycleEventSchema;
