import { ZodType, z } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(255, { message: 'Name must not exceed 255 characters' })
      .trim(),
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(255, { message: 'Password must not exceed 255 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
      .regex(/[@$!%*?&#.]/, {
        message: 'Password must contain at least one special character',
      })
      .trim(),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, {
        message: 'Invalid phone number format (e.g., +1234567890)',
      })
      .trim(),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(255, { message: 'Password must not exceed 255 characters' })
      .trim(),
  });
}
