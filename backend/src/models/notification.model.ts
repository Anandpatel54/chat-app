import mongoose, { Schema } from 'mongoose';
import { INotification } from '../types/notification.types';

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required'],
    },
    type: {
      type: String,
      enum: ['message', 'missed_call', 'system'],
      default: 'message',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
