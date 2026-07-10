export type { IUser, IUserResponse, IUpdateProfile } from './user.types';
export type {
  IConversation,
  IConversationPopulated,
  ICreateConversation,
} from './chat.types';
export type {
  IMessage,
  IMessagePopulated,
  ISendMessage,
  IForwardMessage,
} from './message.types';
export type {
  INotification,
  ICreateNotification,
} from './notification.types';
export type {
  ISocketUser,
  IAuthenticatedSocket,
  ITypingPayload,
  IMessagePayload,
  IDeliveredPayload,
  ISeenPayload,
  IOnlineStatusPayload,
  OnlineUsersMap,
} from './socket.types';

import { Request } from 'express';
import { IUser } from './user.types';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export type AuthRequest = Request;

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface SearchQuery {
  q?: string;
  page?: string;
  limit?: string;
}
