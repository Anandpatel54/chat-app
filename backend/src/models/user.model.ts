import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user.types';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      required: [true, 'Google ID is required'],
      unique: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    about: {
      type: String,
      default: 'Hey there! I am using ChatApp',
      maxlength: [200, 'About cannot exceed 200 characters'],
    },
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    fcmToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ name: 'text', email: 'text' });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
