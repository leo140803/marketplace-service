import { ZodType, z } from 'zod';

export class StoreValidation {
  static readonly CREATE: ZodType = z.object({
    store_name: z.string().min(1).max(100),
    longitude: z.number().min(-180).max(180),
    latitude: z.number().min(-90).max(90),
    image: z.instanceof(Buffer).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    store_name: z.string().min(1).max(100).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    image: z.instanceof(Buffer).optional(),
  });
}
