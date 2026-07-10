import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl: string | null;
  fileName: string | null;
  replyTo: Types.ObjectId | null;
  readBy: Types.ObjectId[];
  deliveredTo: Types.ObjectId[];
  deletedFor: Types.ObjectId[];
  isDeletedForEveryone: boolean;
  forwardedFrom: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessagePopulated {
  _id: string;
  conversationId: string;
  sender: {
    _id: string;
    name: string;
    profileImage: string;
  };
  content: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl: string | null;
  fileName: string | null;
  replyTo: {
    _id: string;
    content: string;
    sender: {
      _id: string;
      name: string;
    };
  } | null;
  readBy: string[];
  deliveredTo: string[];
  deletedFor: string[];
  isDeletedForEveryone: boolean;
  forwardedFrom: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISendMessage {
  conversationId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  replyTo?: string;
}

export interface IForwardMessage {
  messageId: string;
  conversationIds: string[];
}
