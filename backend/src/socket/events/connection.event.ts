import { Server } from 'socket.io';
import { IAuthenticatedSocket, OnlineUsersMap } from '../../types/socket.types';
import { SOCKET_EVENTS } from '../../constants/socketEvents';
import userRepository from '../../repositories/user.repository';
import messageRepository from '../../repositories/message.repository';

const onlineUsers: OnlineUsersMap = new Map();

export const handleConnection = (io: Server, socket: IAuthenticatedSocket) => {
  const userId = socket.userId!;

  // Add user to online users map
  onlineUsers.set(userId, socket.id);

  // Mark user as online in DB
  userRepository.setOnline(userId);

  // Broadcast user online status to all connected clients
  socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, {
    userId,
    isOnline: true,
  });

  console.log(`✅ User connected: ${userId} (Socket: ${socket.id})`);

  // Deliver any pending messages
  deliverPendingMessages(io, socket, userId);

  // Handle disconnect
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    onlineUsers.delete(userId);
    userRepository.setOffline(userId);

    socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, {
      userId,
      isOnline: false,
      lastSeen: new Date(),
    });

    console.log(`❌ User disconnected: ${userId}`);
  });
};

const deliverPendingMessages = async (
  io: Server,
  socket: IAuthenticatedSocket,
  userId: string
) => {
  // This can be expanded to deliver messages that were sent while user was offline
  // For now, the delivery tracking is handled by the message events
};

export const getOnlineUsers = (): OnlineUsersMap => onlineUsers;

export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};

export const getUserSocketId = (userId: string): string | undefined => {
  return onlineUsers.get(userId);
};
