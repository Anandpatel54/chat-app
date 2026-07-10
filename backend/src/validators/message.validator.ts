import { z } from 'zod';

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  content: z.string().max(5000, 'Message too long').default(''),
  messageType: z.enum(['text', 'image', 'file']).default('text'),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  replyTo: z.string().optional(),
});

export const messageIdParamSchema = z.object({
  id: z.string().min(1, 'Message ID is required'),
});

export const conversationIdParamSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
});

export const forwardMessageSchema = z.object({
  conversationIds: z
    .array(z.string().min(1))
    .min(1, 'At least one conversation is required'),
});

export const getMessagesQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});

export const searchMessagesQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
});
