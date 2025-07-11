import { z } from 'zod';

export const CustomAttributeSchema = z.object({
  attribute_code: z.string(),
  value: z.string().nullable(),
});

export const CustomerSchema = z.object({
  id: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
  gender: z.number(),
  store_id: z.number(),
  website_id: z.number(),
  addresses: z.array(z.unknown()), 
  zone: z.string(),
  retailer_profile: z.string(),
  governorate: z.string(),
});

export type Customer = z.infer<typeof CustomerSchema>;
