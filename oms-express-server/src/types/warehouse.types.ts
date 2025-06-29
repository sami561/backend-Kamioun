import { z } from 'zod';
import { objectIdSchema } from './zod.types';

export const WarehouseSchema = z.object({
  _id: objectIdSchema.optional(),
  warehouseId: z.number(),
  websiteId: z.number(),
  code: z.string(),
  name: z.string(),
});

export type Warehouse = z.infer<typeof WarehouseSchema>;
