import mongoose, { Schema, Document } from "mongoose";

interface IStatus extends Document {
  name: string;
  type: "order" | "payment";
  state: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StatusSchema = new Schema<IStatus>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["order", "payment"],
      required: true,
    },
    state: {
      type: String,
      required: true,
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
StatusSchema.index({ type: 1, state: 1 }, { unique: true });

export default mongoose.model<IStatus>("Status", StatusSchema);
