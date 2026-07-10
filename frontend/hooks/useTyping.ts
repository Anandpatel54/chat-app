'use client';

import { useRef, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useAppSelector } from '@/redux/hooks';
import { SOCKET_EVENTS } from '@/constants/socketEvents';

export const useTyping = (conversationId: string) => {
  const { socket } = useSocket();
  const { user } = useAppSelector((state) => state.auth);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const isTyping = useRef(false);

  const startTyping = useCallback(() => {
    if (!socket || !user || isTyping.current) return;

    isTyping.current = true;
    socket.emit(SOCKET_EVENTS.TYPING, {
      conversationId,
      userName: user.name,
    });
  }, [socket, user, conversationId]);

  const stopTyping = useCallback(() => {
    if (!socket || !isTyping.current) return;

    isTyping.current = false;
    socket.emit(SOCKET_EVENTS.STOP_TYPING, {
      conversationId,
    });
  }, [socket, conversationId]);

  const handleTyping = useCallback(() => {
    startTyping();

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [startTyping, stopTyping]);

  return { handleTyping, stopTyping };
};
