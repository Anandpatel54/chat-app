import api from './api';
import { API_ENDPOINTS } from '@/constants/routes';
import { INotification } from '@/types';

export const notificationService = {
  getNotifications: async (
    page: number = 1,
    limit: number = 20
  ): Promise<{
    notifications: INotification[];
    total: number;
    hasMore: boolean;
    unreadCount: number;
  }> => {
    const { data } = await api.get(API_ENDPOINTS.NOTIFICATIONS.LIST, {
      params: { page, limit },
    });
    return data.data;
  },

  markAsRead: async (id: string): Promise<INotification> => {
    const { data } = await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    return data.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },
};
