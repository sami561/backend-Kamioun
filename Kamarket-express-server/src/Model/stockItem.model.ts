import mongoose, { Schema, Document } from "mongoose";
import { StockItem } from "../types/stockItem.types";

type IStockItem = StockItem & Document;

const StockItemSchema = new Schema<IStockItem>(
  {
    item_id: { type: Number },
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
