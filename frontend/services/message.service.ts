import api from './api';
import { API_ENDPOINTS } from '@/constants/routes';
import { IMessage } from '@/types';

export const messageService = {
  getMessages: async (
    conversationId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ messages: IMessage[]; total: number; hasMore: boolean }> => {
    const { data } = await api.get(API_ENDPOINTS.MESSAGES.GET(conversationId), {
      params: { page, limit },
    });
    return data.data;
  },

  sendMessage: async (formData: FormData): Promise<IMessage> => {
    const { data } = await api.post(API_ENDPOINTS.MESSAGES.SEND, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  markAsRead: async (conversationId: string): Promise<void> => {
    await api.put(API_ENDPOINTS.MESSAGES.READ(conversationId));
  },

  deleteForMe: async (id: string): Promise<IMessage> => {
    const { data } = await api.delete(API_ENDPOINTS.MESSAGES.DELETE(id));
    return data.data;
  },

  deleteForEveryone: async (id: string): Promise<IMessage> => {
    const { data } = await api.delete(API_ENDPOINTS.MESSAGES.DELETE_EVERYONE(id));
    return data.data;
  },

  forwardMessage: async (
    id: string,
    conversationIds: string[]
  ): Promise<IMessage[]> => {
    const { data } = await api.post(API_ENDPOINTS.MESSAGES.FORWARD(id), {
      conversationIds,
    });
    return data.data;
  },
};
