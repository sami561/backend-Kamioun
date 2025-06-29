import mongoose, { Document, Schema } from 'mongoose';
import { Screen, ScreenStatus } from '../types/screen.types';
import './ad.model';
type IScreen = Screen & Document;

const ScreenSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ScreenStatus, default: 'draft' },
    position: { type: Number },
    ad: [{ type: Schema.Types.ObjectId, ref: 'Ads' }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IScreen>('Screen', ScreenSchema);
