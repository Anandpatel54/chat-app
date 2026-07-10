import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage } from '@/types';

interface MessageState {
  messages: Record<string, IMessage[]>; // keyed by conversationId
  isLoading: boolean;
  hasMore: Record<string, boolean>;
  page: Record<string, number>;
  replyTo: IMessage | null;
  error: string | null;
}

const initialState: MessageState = {
  messages: {},
  isLoading: false,
  hasMore: {},
  page: {},
  replyTo: null,
  error: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: IMessage[]; hasMore: boolean }>
    ) => {
      const { conversationId, messages, hasMore } = action.payload;
      state.messages[conversationId] = messages;
      state.hasMore[conversationId] = hasMore;
      state.page[conversationId] = 1;
      state.isLoading = false;
    },
    prependMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: IMessage[]; hasMore: boolean }>
    ) => {
      const { conversationId, messages, hasMore } = action.payload;
      const existing = state.messages[conversationId] || [];
      state.messages[conversationId] = [...messages, ...existing];
      state.hasMore[conversationId] = hasMore;
      state.page[conversationId] = (state.page[conversationId] || 1) + 1;
      state.isLoading = false;
    },
    addMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: IMessage; tempId?: string }>
    ) => {
      const { conversationId, message, tempId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      // Remove temp message if exists
      if (tempId) {
        state.messages[conversationId] = state.messages[conversationId].filter(
          (m) => m._id !== tempId
        );
      }

      // Avoid duplicates
      const exists = state.messages[conversationId].find(
        (m) => m._id === message._id
      );
      if (!exists) {
        state.messages[conversationId].push(message);
      }
    },
    updateMessage: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string; updates: Partial<IMessage> }>
    ) => {
      const { conversationId, messageId, updates } = action.payload;
      const messages = state.messages[conversationId];
      if (messages) {
        const index = messages.findIndex((m) => m._id === messageId);
        if (index !== -1) {
          messages[index] = { ...messages[index], ...updates };
        }
      }
    },
    removeMessage: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) => {
      const { conversationId, messageId } = action.payload;
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].filter(
          (m) => m._id !== messageId
        );
      }
    },
    markMessageAsDelivered: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string; userId: string }>
    ) => {
      const { conversationId, messageId, userId } = action.payload;
      const messages = state.messages[conversationId];
      if (messages) {
        const message = messages.find((m) => m._id === messageId);
        if (message && !message.deliveredTo.includes(userId)) {
          message.deliveredTo.push(userId);
        }
      }
    },
    markMessageAsRead: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string; userId: string }>
    ) => {
      const { conversationId, messageId, userId } = action.payload;
      const messages = state.messages[conversationId];
      if (messages) {
        const message = messages.find((m) => m._id === messageId);
        if (message && !message.readBy.includes(userId)) {
          message.readBy.push(userId);
        }
      }
    },
    markAllAsRead: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const { conversationId, userId } = action.payload;
      const messages = state.messages[conversationId];
      if (messages) {
        messages.forEach((m) => {
          if (!m.readBy.includes(userId)) {
            m.readBy.push(userId);
          }
        });
      }
    },
    setReplyTo: (state, action: PayloadAction<IMessage | null>) => {
      state.replyTo = action.payload;
    },
    setMessageLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMessageError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearMessages: (state, action: PayloadAction<string>) => {
      delete state.messages[action.payload];
      delete state.hasMore[action.payload];
      delete state.page[action.payload];
    },
  },
});

export const {
  setMessages,
  prependMessages,
  addMessage,
  updateMessage,
  removeMessage,
  markMessageAsDelivered,
  markMessageAsRead,
  markAllAsRead,
  setReplyTo,
  setMessageLoading,
  setMessageError,
  clearMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
