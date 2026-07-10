import { Server } from 'socket.io';
import { IAuthenticatedSocket } from '../../types/socket.types';
import { SOCKET_EVENTS } from '../../constants/socketEvents';
import { isUserOnline } from './connection.event';

export const handleStatusEvents = (io: Server, socket: IAuthenticatedSocket) => {
  // Check if a specific user is online
  socket.on('check_online', (data: { userId: string }) => {
    const online = isUserOnline(data.userId);
    socket.emit('online_status', {
      userId: data.userId,
      isOnline: online,
    });
  });
};
