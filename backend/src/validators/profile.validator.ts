import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  about: z.string().max(200).optional(),
});
