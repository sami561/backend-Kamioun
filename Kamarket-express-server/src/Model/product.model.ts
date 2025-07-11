import mongoose, { Schema, Document } from "mongoose";
import { Product } from "../types/product.types";
type IProduct = Product & Document;

const ProductSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    showSpecialPrice: { type: Boolean, required: false },
    cost: { type: Number },
    special_price: { type: Number },
    image: { type: [String], default: [] },
    manufacturer: { type: String },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    website_ids: { type: [Number], default: [] },
    related_products: [
      { type: Schema.Types.ObjectId, ref: "Product", default: [] },
    ],
    pcb: { type: Number },
    stock_item: { type: Schema.Types.ObjectId, ref: "StockItem" },
    sales: { type: Boolean, default: false },
    wholesales: { type: Boolean, default: false },
    newArrivals: { type: Boolean, default: false },
    discount: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
