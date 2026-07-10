import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  profileImage: string;
  isOnline: boolean;
  lastSeen: Date;
  about: string;
  blockedUsers: Types.ObjectId[];
  fcmToken: string | null;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  isOnline: boolean;
  lastSeen: Date;
  about: string;
  blockedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateProfile {
  name?: string;
  about?: string;
  profileImage?: string;
}
