import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../types/message.types';

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    content: {
      type: String,
      default: '',
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    fileUrl: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    deliveredTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    deletedFor: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isDeletedForEveryone: {
      type: Boolean,
      default: false,
    },
    forwardedFrom: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ conversationId: 1, sender: 1 });
messageSchema.index({ content: 'text' });

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
