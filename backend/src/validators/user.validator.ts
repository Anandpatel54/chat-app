import { z } from 'zod';

export const searchUserSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
});

export const userIdParamSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});
