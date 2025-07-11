import mongoose, { Schema, Document } from 'mongoose';

// Define the Customer interface
export interface ICustomer extends Document {
  id: number;
  created_at: Date;
  updated_at: Date;
  gender: number;
  store_id: number;
  website_id: number;
  addresses: Record<string, any>[]; 
  zone: string; 
  retailer_profile: string;
  governorate: string; 
}

// Define Schema for Customer
const CustomerSchema = new Schema<ICustomer>({
  id: { type: Number, required: true, unique: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  gender: { type: Number, required: true },
  store_id: { type: Number, required: true },
  website_id: { type: Number, required: true },
  addresses: { type: [{ type: Schema.Types.Mixed }], default: [] },
  zone: { type: String, default: '' }, 
  retailer_profile: { type: String, default: '' }, 
  governorate: { type: String, default: '' } 
}, { versionKey: false });

// Export the Customer model
export default mongoose.model<ICustomer>('Customer', CustomerSchema, 'customers');
