import mongoose, { Schema, Document } from "mongoose";
import { Category } from "../types/category.types";

type ICategory = Category & Document;
const CategorySchema = new Schema<ICategory>(
  {
    nameCategoryAr: { type: String, required: true },
    nameCategoryFr: { type: String, required: true },
    Description: { type: String },
    image: { type: String, required: true },
  },
  { versionKey: false }
);

export default mongoose.model<ICategory>(
  "Category",
  CategorySchema,
  "Category"
);
