import mongoose, { Document, Schema } from 'mongoose';
import { Warehouse } from '../types/warehouse.types';

type IWarehouse = Warehouse & Document;

const WarehouseSchema: Schema = new Schema(
  {
    warehouseId: { type: Number, required: true, unique: true },
    websiteId: { type: Number, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: false, versionKey: false
  }
);

export default mongoose.model<IWarehouse>('Warehouse', WarehouseSchema,'Warehouse');