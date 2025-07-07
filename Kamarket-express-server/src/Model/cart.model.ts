import mongoose, { Schema, Document } from "mongoose";

interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  total: number;
  status: "active" | "converted" | "abandoned";
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensures one cart per user
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "converted", "abandoned"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total before saving
CartSchema.pre("save", function (next) {
  this.total = this.items.reduce(
    (sum: number, item: ICartItem) => sum + item.price * item.quantity,
    0
  );
  next();
});

export default mongoose.model<ICart>("Cart", CartSchema);
