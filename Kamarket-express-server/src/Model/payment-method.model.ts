import mongoose, { Schema, Document } from "mongoose";

interface IPaymentMethod extends Document {
  name: string;
  type: "cash" | "flouci";
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["cash", "flouci"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
PaymentMethodSchema.index({ type: 1 }, { unique: true });

export default mongoose.model<IPaymentMethod>(
  "PaymentMethod",
  PaymentMethodSchema
);
