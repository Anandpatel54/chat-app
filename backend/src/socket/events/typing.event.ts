import { Server } from 'socket.io';
import { IAuthenticatedSocket } from '../../types/socket.types';
import { SOCKET_EVENTS } from '../../constants/socketEvents';

export const handleTypingEvents = (io: Server, socket: IAuthenticatedSocket) => {
  const userId = socket.userId!;

  // Typing indicator
  socket.on(SOCKET_EVENTS.TYPING, (data: {
    conversationId: string;
    userName: string;
  }) => {
    socket.to(data.conversationId).emit(SOCKET_EVENTS.TYPING, {
      conversationId: data.conversationId,
      userId,
      userName: data.userName,
    });
  });

  // Stop typing indicator
  socket.on(SOCKET_EVENTS.STOP_TYPING, (data: {
    conversationId: string;
  }) => {
    socket.to(data.conversationId).emit(SOCKET_EVENTS.STOP_TYPING, {
      conversationId: data.conversationId,
      userId,
    });
  });
};
