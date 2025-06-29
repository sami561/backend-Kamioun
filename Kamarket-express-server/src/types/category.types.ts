import { z } from "zod";
import { objectIdSchema } from "./zod.types";

export const categoryschema = z.object({
  _id: objectIdSchema.optional(),
  nameCategoryAr: z.string().optional(),
  nameCategoryFr: z.string().optional(),
  Description: z.string().optional(),
  image: z.string().optional(),
});

export type Category = z.infer<typeof categoryschema>;
