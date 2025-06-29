import { z } from 'zod';
import { objectIdSchema } from './zod.types';
export enum adType {
  carousel = 'carousel',
  ProductShowcase = 'ProductShowcase',
  image = 'image',
}
export enum adStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DAFT = 'draft',
}


export const adSchema = z.object({
  _id: objectIdSchema.optional(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.array(z.string()),
  backgroundImage: z.string(),
  clickUrl: z.string(),
  product:z.array(z.string()),
  adType: z.nativeEnum(adType),
  status: z.nativeEnum(adStatus),
  startDate: z.date(),
  endDate: z.date(),
});
export type Ad = z.infer<typeof adSchema>;


export const createAdDto = adSchema
  .pick({
    title: true,
    description: true,
    imageUrl: true,
    clickUrl: true,
    adType: true,
    startDate: true,
    endDate: true,
    status: true,
  })
  .strict();

export type CreateAdDto = z.infer<typeof createAdDto>;

