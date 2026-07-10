import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import chatReducer from '@/features/chat/chatSlice';
import messageReducer from '@/features/message/messageSlice';
import userReducer from '@/features/user/userSlice';
import socketReducer from '@/features/socket/socketSlice';
import notificationReducer from '@/features/notification/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    message: messageReducer,
    user: userReducer,
    socket: socketReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['socket.socket'],
        ignoredActions: ['socket/setSocket'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
