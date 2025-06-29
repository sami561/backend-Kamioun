import { z } from "zod";
import { objectIdSchema } from "./zod.types";

export const brandSchema = z.object({
  _id: objectIdSchema.optional(),
  nameBrandAr: z.string(),
  nameBrandFr: z.string(),
  image: z.string().optional(),
});

export type Brand = z.infer<typeof brandSchema>;
