import { Server } from 'socket.io';
import http from 'http';
import { verifyToken } from '../utils/jwt';
import User from '../models/user.model';
import { IAuthenticatedSocket } from '../types/socket.types';
import { handleConnection } from './events/connection.event';
import { handleMessageEvents } from './events/message.event';
import { handleTypingEvents } from './events/typing.event';
import { handleStatusEvents } from './events/status.event';
import corsOptions from '../config/cors';

let io: Server;

export const initializeSocket = (server: http.Server): Server => {
  io = new Server(server, {
    cors: {
      origin: corsOptions.origin,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use(async (socket: IAuthenticatedSocket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.cookie
          ?.split(';')
          .find((c: string) => c.trim().startsWith('chat_token='))
          ?.split('=')[1];

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle connections
  io.on('connection', (socket: IAuthenticatedSocket) => {
    handleConnection(io, socket);
    handleMessageEvents(io, socket);
    handleTypingEvents(io, socket);
    handleStatusEvents(io, socket);
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
