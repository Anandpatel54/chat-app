'use client';

import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { addNotification } from '@/features/notification/notificationSlice';
import {
  requestNotificationPermission,
  onForegroundMessage,
} from '@/services/firebase.service';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

export const useNotification = () => {
  const dispatch = useAppDispatch();

  const initializeNotifications = useCallback(async () => {
    try {
      const token = await requestNotificationPermission();
      if (token) {
        await authService.updateFcmToken(token);
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      const { title, body, image } = payload.notification || {};

      toast(body || 'New message', {
        icon: '💬',
        duration: 4000,
      });

      if (payload.data) {
        dispatch(
          addNotification({
            _id: Date.now().toString(),
            userId: '',
            senderId: {
              _id: payload.data.senderId || '',
              name: payload.data.senderName || '',
              profileImage: payload.data.senderImage || '',
            },
            type: 'message',
            title: title || '',
            body: body || '',
            data: payload.data,
            isRead: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        );
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [dispatch]);

  return { initializeNotifications };
};
