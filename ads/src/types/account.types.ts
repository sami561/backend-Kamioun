import { z } from 'zod';
import { objectIdSchema } from './zod.types';

export enum AccountTypes {
    SUPPLIER = 'supplier',
    SUPER_ADMIN = 'superAdmin',
  }
  
  
  export const accountSchema = z.object({
    _id: objectIdSchema.optional(),
    accountType: z.nativeEnum(AccountTypes),
  });
  
  export type Account = z.infer<typeof accountSchema>;