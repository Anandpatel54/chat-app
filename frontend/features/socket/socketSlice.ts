import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  isConnected: boolean;
  typingUsers: Record<string, { userId: string; userName: string }[]>; // keyed by conversationId
  onlineUsers: string[];
}

const initialState: SocketState = {
  isConnected: false,
  typingUsers: {},
  onlineUsers: [],
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    addTypingUser: (
      state,
      action: PayloadAction<{
        conversationId: string;
        userId: string;
        userName: string;
      }>
    ) => {
      const { conversationId, userId, userName } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      const exists = state.typingUsers[conversationId].find(
        (u) => u.userId === userId
      );
      if (!exists) {
        state.typingUsers[conversationId].push({ userId, userName });
      }
    },
    removeTypingUser: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[
          conversationId
        ].filter((u) => u.userId !== userId);
      }
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    setUserOnline: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    setUserOffline: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      );
    },
    clearTypingUsers: (state, action: PayloadAction<string>) => {
      delete state.typingUsers[action.payload];
    },
  },
});

export const {
  setConnected,
  addTypingUser,
  removeTypingUser,
  setOnlineUsers,
  setUserOnline,
  setUserOffline,
  clearTypingUsers,
} = socketSlice.actions;

export default socketSlice.reducer;
