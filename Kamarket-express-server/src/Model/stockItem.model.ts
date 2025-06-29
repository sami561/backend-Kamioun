import mongoose, { Schema, Document } from "mongoose";

export interface IStockItem extends Document {
  item_id: number;
  product_id: number;
  stock_id: number;
  qty: number;
  is_in_stock: boolean;
  min_qty: number;
  min_sale_qty: number;
  max_sale_qty: number;
  backorders: number;
  low_stock_date: string;
}

const StockItemSchema = new Schema<IStockItem>(
  {
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
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IStockItem>("StockItem", StockItemSchema);
