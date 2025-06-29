import mongoose, { Schema, Document } from "mongoose";
import { Supplier } from "../types/supplier.types";

type ISupplier = Supplier & Document;
const SupplierSchema = new Schema<ISupplier>(
  {
    company_nameAr: { type: String, required: true },
    company_nameFr: { type: String, required: true },
    contact_name: { type: String },
    phone_number: { type: String },
    postal_code: { type: String },
    city: { type: String },
    country: { type: String },
    capital: { type: String },
    email: { type: String, required: true },
    tax_registration_number: { type: String },
    address: { type: String },
  },
  { versionKey: false }
);

export default mongoose.model<ISupplier>(
  "Supplier",
  SupplierSchema,
  "Supplier"
);
