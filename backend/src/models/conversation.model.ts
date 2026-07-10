import mongoose, { Schema } from 'mongoose';
import { IConversation } from '../types/chat.types';

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageTime: -1 });
conversationSchema.index({ participants: 1, isGroup: 1 });

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
