import { ZodType, z } from 'zod';

export class BannerValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(255),
    description: z.string().min(1).max(255),
    status: z.boolean(),
  });

  static readonly UPDATE: ZodType = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().min(1).max(255).optional(),
    status: z.boolean().optional(),
  });
}
