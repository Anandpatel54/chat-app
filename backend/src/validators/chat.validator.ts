import { z } from 'zod';

export const createConversationSchema = z.object({
  participantId: z.string().min(1, 'Participant ID is required'),
});

export const conversationIdParamSchema = z.object({
  id: z.string().min(1, 'Conversation ID is required'),
});

export const searchChatSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
});
