import mongoose, { Document, Schema } from 'mongoose';

// Define the Supplier interface
export interface ISupplier extends Document {
  manufacturerId: number;
  code: string;
  company_name: string;
  contact_name?: string;
  phone_number?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  capital?: string;
  email: string;
  tax_registration_number?: string;
  address?: string;
}

// Define Schema for Supplier
const SupplierSchema = new Schema<ISupplier>({
  manufacturerId: { type: Number, required: true, unique: true },
  code: { type: String, required: true },
  company_name: { type: String, required: true },
  contact_name: { type: String },
  phone_number: { type: String },
  postal_code: { type: String },
  city: { type: String },
  country: { type: String },
  capital: { type: String },
  email: { type: String, required: true },
  tax_registration_number: { type: String },
  address: { type: String },
}, { versionKey: false });

// Export the Supplier model
export default mongoose.model<ISupplier>('Supplier', SupplierSchema, 'manufacturers');
