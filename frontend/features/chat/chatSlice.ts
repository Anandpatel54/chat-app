import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConversation } from '@/types';

interface ChatState {
  conversations: IConversation[];
  activeConversation: IConversation | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  searchResults: IConversation[];
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  searchResults: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<IConversation[]>) => {
      state.conversations = action.payload;
      state.isLoading = false;
    },
    setActiveConversation: (state, action: PayloadAction<IConversation | null>) => {
      state.activeConversation = action.payload;
    },
    addConversation: (state, action: PayloadAction<IConversation>) => {
      const exists = state.conversations.find((c) => c._id === action.payload._id);
      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },
    updateConversation: (state, action: PayloadAction<Partial<IConversation> & { _id: string }>) => {
      const index = state.conversations.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.conversations[index] = {
          ...state.conversations[index],
          ...action.payload,
        };
        // Re-sort by last message time
        state.conversations.sort(
          (a, b) =>
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
        );
      }
      if (state.activeConversation?._id === action.payload._id) {
        state.activeConversation = {
          ...state.activeConversation,
          ...action.payload,
        };
      }
    },
    removeConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        (c) => c._id !== action.payload
      );
      if (state.activeConversation?._id === action.payload) {
        state.activeConversation = null;
      }
    },
    updateUnreadCount: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string; count: number }>
    ) => {
      const { conversationId, userId, count } = action.payload;
      const conv = state.conversations.find((c) => c._id === conversationId);
      if (conv) {
        conv.unreadCounts = { ...conv.unreadCounts, [userId]: count };
      }
    },
    resetUnreadCount: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const { conversationId, userId } = action.payload;
      const conv = state.conversations.find((c) => c._id === conversationId);
      if (conv) {
        conv.unreadCounts = { ...conv.unreadCounts, [userId]: 0 };
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<IConversation[]>) => {
      state.searchResults = action.payload;
    },
    setChatLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setChatError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateParticipantOnlineStatus: (
      state,
      action: PayloadAction<{ userId: string; isOnline: boolean; lastSeen?: string }>
    ) => {
      const { userId, isOnline, lastSeen } = action.payload;
      state.conversations.forEach((conv) => {
        conv.participants.forEach((p) => {
          if (p._id === userId) {
            p.isOnline = isOnline;
            if (lastSeen) p.lastSeen = lastSeen;
          }
        });
      });
      if (state.activeConversation) {
        state.activeConversation.participants.forEach((p) => {
          if (p._id === userId) {
            p.isOnline = isOnline;
            if (lastSeen) p.lastSeen = lastSeen;
          }
        });
      }
    },
    bulkUpdateParticipantsOnlineStatus: (
      state,
      action: PayloadAction<string[]>
    ) => {
      const onlineUserIds = action.payload;
      state.conversations.forEach((conv) => {
        conv.participants.forEach((p) => {
          p.isOnline = onlineUserIds.includes(p._id);
        });
      });
      if (state.activeConversation) {
        state.activeConversation.participants.forEach((p) => {
          p.isOnline = onlineUserIds.includes(p._id);
        });
      }
    },
  },
});

export const {
  setConversations,
  setActiveConversation,
  addConversation,
  updateConversation,
  removeConversation,
  updateUnreadCount,
  resetUnreadCount,
  setSearchQuery,
  setSearchResults,
  setChatLoading,
  setChatError,
  updateParticipantOnlineStatus,
  bulkUpdateParticipantsOnlineStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
