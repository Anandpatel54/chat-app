import { Document, Types } from 'mongoose';

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  senderId: Types.ObjectId;
  type: 'message' | 'missed_call' | 'system';
  title: string;
  body: string;
  data: {
    conversationId?: string;
    messageId?: string;
    [key: string]: string | undefined;
  };
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateNotification {
  userId: string;
  senderId: string;
  type: 'message' | 'missed_call' | 'system';
  title: string;
  body: string;
  data?: Record<string, string>;
}
