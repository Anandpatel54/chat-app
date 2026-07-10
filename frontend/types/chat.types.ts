import { IUser } from './user.types';

export interface IConversation {
  _id: string;
  participants: IUser[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCounts: Record<string, number>;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateConversation {
  participantId: string;
}
