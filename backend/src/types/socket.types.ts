import { Server, Socket } from 'socket.io';
import { IUser } from './user.types';

export interface ISocketUser {
  userId: string;
  socketId: string;
}

export interface IAuthenticatedSocket extends Socket {
  userId?: string;
  user?: IUser;
}

export interface ITypingPayload {
  conversationId: string;
  userId: string;
  userName: string;
}

export interface IMessagePayload {
  conversationId: string;
  message: {
    _id: string;
    sender: string;
    content: string;
    messageType: string;
    fileUrl?: string;
    fileName?: string;
    replyTo?: string;
    createdAt: Date;
  };
}

export interface IDeliveredPayload {
  messageId: string;
  conversationId: string;
  userId: string;
}

export interface ISeenPayload {
  messageId: string;
  conversationId: string;
  userId: string;
}

export interface IOnlineStatusPayload {
  userId: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export type OnlineUsersMap = Map<string, string>;
