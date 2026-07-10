'use client';

import { useAppSelector } from '@/redux/hooks';

export const useOnlineStatus = (userId: string) => {
  const onlineUsers = useAppSelector((state) => state.socket.onlineUsers);
  return onlineUsers.includes(userId);
};
