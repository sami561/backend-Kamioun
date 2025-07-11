import { z } from 'zod';

export const SupplierSchema = z.object({
  manufacturerId: z.number(),
  code: z.string(),
  company_name: z.string(),
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

export type Supplier = z.infer<typeof SupplierSchema>;
