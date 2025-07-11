import { z } from 'zod';

export const CategorySchema = z.object({
  categoryId: z.number(),
  nameCategory: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;
