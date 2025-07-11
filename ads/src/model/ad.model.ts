import mongoose, { Document, Schema } from 'mongoose';
import { Ad, adStatus, adType } from '../types/ad.types';
type IAd = Ad & Document;

const AdSchema: Schema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    imageUrl: { type: [String], default: [] },
    adType: { type: String, enum: adType, required: true },
    clickUrl: { type: [String], default: [] },
    status: { type: String, enum: adStatus, default: 'draft' },
    startDate: { type: Date },
    endDate: { type: Date },
    backgroundImage: { type: String },
    product: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAd>('Ads', AdSchema);
