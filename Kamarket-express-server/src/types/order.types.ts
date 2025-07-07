import { Document } from "mongoose";
import mongoose from "mongoose";

export enum OrderState {
  NEW = "new",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export interface OrderLifecycleEvent {
  state: OrderState;
  status: OrderStatus;
  date: Date;
  description?: string;
}

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  entity_id?: number;
  state: OrderState;
  status: OrderStatus;
  total: number;

  customer_id: mongoose.Types.ObjectId;
  discount_amount: number;
  store_id: number;
  items: IOrderItem[];
  delivery_date?: Date;
  delivery_description?: string;
  lifecycle: OrderLifecycleEvent[];
}
