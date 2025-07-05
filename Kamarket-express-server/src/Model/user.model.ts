import mongoose, { Document, Schema } from "mongoose";
import { User } from "../types/users.types";

type IUser = User & Document;

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    active: { type: Boolean, required: true, default: false },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    address: { type: String },
    city: { type: String },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    profilePhoto: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
