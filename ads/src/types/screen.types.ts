import { z } from 'zod';
import { objectIdSchema } from './zod.types';
export enum ScreenStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DAFT = 'draft',
}
export const ScreenSchema = z.object({
  _id: objectIdSchema.optional(),
  title: z.string(),
  description: z.string(),
});
export type Screen = z.infer<typeof ScreenSchema>;
