import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  product_id: number;
  sku: string;
  name: string;
  price: number;
  cost?: number;
  special_price?: number;
  image?: string;
  url_key?: string;
  manufacturer?: string;
  website_ids: number[];
  category_ids: string[];
  stock_item: {
    item_id?: number;
    product_id?: number;
    stock_id?: number;
    qty?: number;
    is_in_stock?: boolean;
    min_qty?: number;
    min_sale_qty?: number;
    max_sale_qty?: number;
    backorders?: number;
    low_stock_date?: string;
  };
}

const ProductSchema = new Schema<IProduct>(
  {
    product_id: { type: Number, unique: true, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    cost: { type: Number },
    special_price: { type: Number },
    image: { type: String },
    url_key: { type: String },
    manufacturer: { type: String },
    website_ids: { type: [Number], default: [] },
    category_ids: { type: [String], default: [] },
    stock_item: {
      item_id: { type: Number },
      product_id: { type: Number },
      stock_id: { type: Number },
      qty: { type: Number },
      is_in_stock: { type: Boolean },
      min_qty: { type: Number },
      min_sale_qty: { type: Number },
      max_sale_qty: { type: Number },
      backorders: { type: Number },
      low_stock_date: { type: String },
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
