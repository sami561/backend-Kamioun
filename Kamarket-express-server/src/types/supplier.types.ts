import { z } from "zod";
import { objectIdSchema } from "./zod.types";

export const supplierSchema = z.object({
  _id: objectIdSchema.optional(),
  code: z.string(),
  company_nameAr: z.string(),
  company_nameFr: z.string(),
  contact_name: z.string().optional(),
  phone_number: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  capital: z.string().optional(),
  email: z.string().email(),
  tax_registration_number: z.string().optional(),
  address: z.string().optional(),
});

export type Supplier = z.infer<typeof supplierSchema>;
