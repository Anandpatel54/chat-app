import { Document, Types } from 'mongoose';

export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCounts: Map<string, number>;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversationPopulated {
  _id: string;
  participants: {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
    isOnline: boolean;
    lastSeen: Date;
    about: string;
  }[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCounts: Map<string, number>;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateConversation {
  participantId: string;
}
