import api from './api';
import { API_ENDPOINTS } from '@/constants/routes';
import { IUser } from '@/types';

export const userService = {
  searchUsers: async (query: string): Promise<IUser[]> => {
    const { data } = await api.get(API_ENDPOINTS.USERS.SEARCH, {
      params: { q: query },
    });
    return data.data;
  },

  getUserById: async (id: string): Promise<IUser> => {
    const { data } = await api.get(API_ENDPOINTS.USERS.GET_BY_ID(id));
    return data.data;
  },

  blockUser: async (id: string): Promise<IUser> => {
    const { data } = await api.put(API_ENDPOINTS.USERS.BLOCK(id));
    return data.data;
  },

  unblockUser: async (id: string): Promise<IUser> => {
    const { data } = await api.put(API_ENDPOINTS.USERS.UNBLOCK(id));
    return data.data;
  },
};
