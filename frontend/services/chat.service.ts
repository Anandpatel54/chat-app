import api from './api';
import { API_ENDPOINTS } from '@/constants/routes';
import { IConversation } from '@/types';

export const chatService = {
  getConversations: async (): Promise<IConversation[]> => {
    const { data } = await api.get(API_ENDPOINTS.CHATS.LIST);
    return data.data;
  },

  createConversation: async (participantId: string): Promise<IConversation> => {
    const { data } = await api.post(API_ENDPOINTS.CHATS.CREATE, {
      participantId,
    });
    return data.data;
  },

  getConversationById: async (id: string): Promise<IConversation> => {
    const { data } = await api.get(API_ENDPOINTS.CHATS.GET_BY_ID(id));
    return data.data;
  },

  deleteConversation: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.CHATS.DELETE(id));
  },

  searchConversations: async (query: string): Promise<IConversation[]> => {
    const { data } = await api.get(API_ENDPOINTS.CHATS.SEARCH, {
      params: { q: query },
    });
    return data.data;
  },
};
