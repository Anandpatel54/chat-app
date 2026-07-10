import api from './api';
import { API_ENDPOINTS } from '@/constants/routes';
import { IUser } from '@/types';

export const authService = {
  getMe: async (): Promise<IUser> => {
    const { data } = await api.get(API_ENDPOINTS.AUTH.ME);
    return data.data;
  },

  logout: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  updateFcmToken: async (fcmToken: string): Promise<void> => {
    await api.put(API_ENDPOINTS.AUTH.FCM_TOKEN, { fcmToken });
  },

  getGoogleAuthUrl: (): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return `${apiUrl}${API_ENDPOINTS.AUTH.GOOGLE}`;
  },
};
