export type { IUser, IUpdateProfile } from './user.types';
export type { IConversation, ICreateConversation } from './chat.types';
export type { IMessage, ISendMessage, IForwardMessage } from './message.types';
export type { INotification } from './notification.types';

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}
