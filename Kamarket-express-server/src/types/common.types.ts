import { z } from 'zod';

export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;

export const baseRequestSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
