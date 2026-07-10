'use client';

import { useEffect } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { useAppSelector } from '@/redux/hooks';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { initializeNotifications } = useNotification();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      initializeNotifications();
    }
  }, [isAuthenticated, initializeNotifications]);

  return <>{children}</>;
}
