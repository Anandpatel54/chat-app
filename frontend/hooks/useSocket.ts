'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setConnected, addTypingUser, removeTypingUser, setOnlineUsers, setUserOnline, setUserOffline } from '@/features/socket/socketSlice';
import { addMessage, markMessageAsDelivered, markMessageAsRead } from '@/features/message/messageSlice';
import { updateConversation, updateParticipantOnlineStatus, bulkUpdateParticipantsOnlineStatus } from '@/features/chat/chatSlice';
import { SOCKET_EVENTS } from '@/constants/socketEvents';
import toast from 'react-hot-toast';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socketInstance: Socket | null = null;

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { activeConversation } = useAppSelector((state) => state.chat);
  const socketRef = useRef<Socket | null>(null);
  const activeConversationRef = useRef(activeConversation);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (socketInstance) {
      socketRef.current = socketInstance;
      if (socketInstance.connected) {
        dispatch(setConnected(true));
      }
      return;
    }

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socketInstance = socket;
    socketRef.current = socket;

    socket.on('connect', () => {
      dispatch(setConnected(true));
    });

    socket.on('disconnect', () => {
      dispatch(setConnected(false));
    });

    // Listen for incoming messages
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data: { message: any; tempId?: string }) => {
      dispatch(
        addMessage({
          conversationId: data.message.conversationId,
          message: data.message,
          tempId: data.tempId,
        })
      );
      dispatch(
        updateConversation({
          _id: data.message.conversationId,
          lastMessage:
            data.message.messageType === 'text'
              ? data.message.content
              : data.message.messageType === 'image'
              ? '📷 Photo'
              : '📎 File',
          lastMessageTime: data.message.createdAt,
        })
      );

      // Trigger notification if not from me and not in current chat
      const isFromMe =
        data.message.sender._id === user?._id ||
        data.message.sender === user?._id;
      const isCurrentChat = activeConversationRef.current?._id === data.message.conversationId;

      if (!isFromMe) {
        if (!isCurrentChat) {
          // Play notification chime
          try {
            new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-100.wav').play().catch(() => {});
          } catch {}

          // Show Toast alert
          const senderName = data.message.sender.name || 'Someone';
          const content =
            data.message.messageType === 'text'
              ? data.message.content
              : data.message.messageType === 'image'
              ? 'sent an image'
              : 'sent a file';

          toast(`${senderName}: ${content}`, {
            icon: '💬',
            duration: 4000,
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px border-border/20',
            },
          });
        } else {
          // Play a very subtle bubble sound when receiving active room message
          try {
            new Audio('https://assets.mixkit.co/active_storage/sfx/2357/2357-100.wav').play().catch(() => {});
          } catch {}
        }
      }
    });

    // Typing events
    socket.on(SOCKET_EVENTS.TYPING, (data: { conversationId: string; userId: string; userName: string }) => {
      dispatch(addTypingUser(data));
    });

    socket.on(SOCKET_EVENTS.STOP_TYPING, (data: { conversationId: string; userId: string }) => {
      dispatch(removeTypingUser(data));
    });

    // Delivery & read receipts
    socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, (data: { messageId: string; conversationId: string; userId: string }) => {
      dispatch(markMessageAsDelivered(data));
    });

    socket.on(SOCKET_EVENTS.MESSAGE_SEEN, (data: { messageId: string; conversationId: string; userId: string }) => {
      dispatch(markMessageAsRead(data));
    });

    // Online status
    socket.on(SOCKET_EVENTS.USER_ONLINE, (data: { userId: string }) => {
      dispatch(setUserOnline(data.userId));
      dispatch(updateParticipantOnlineStatus({ userId: data.userId, isOnline: true }));
    });

    socket.on(SOCKET_EVENTS.USER_OFFLINE, (data: { userId: string; lastSeen: string }) => {
      dispatch(setUserOffline(data.userId));
      dispatch(
        updateParticipantOnlineStatus({
          userId: data.userId,
          isOnline: false,
          lastSeen: data.lastSeen,
        })
      );
    });

    // Initial online users list (received on connect)
    socket.on(SOCKET_EVENTS.ONLINE_USERS_LIST, (data: { onlineUsers: string[] }) => {
      dispatch(setOnlineUsers(data.onlineUsers));
      dispatch(bulkUpdateParticipantsOnlineStatus(data.onlineUsers));
    });

    return () => {
      // Don't disconnect on unmount — keep alive across navigation
    };
  }, [isAuthenticated, user, dispatch]);

  const getSocket = useCallback((): Socket | null => {
    return socketRef.current;
  }, []);

  return { socket: socketRef.current, getSocket };
};
