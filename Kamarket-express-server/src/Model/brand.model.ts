import mongoose, { Schema, Document } from "mongoose";
import { Brand } from "../types/brand.types";

type IBrand = Brand & Document;
const BrandSchema = new Schema<IBrand>(
  {
    nameBrandAr: { type: String, required: true },
    nameBrandFr: { type: String, required: true },
    image: { type: String },
  },
  { versionKey: false }
);

export default mongoose.model<IBrand>("Brand", BrandSchema, "Brand");
