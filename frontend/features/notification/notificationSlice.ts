import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotification } from '@/types';

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  hasMore: false,
  page: 1,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (
      state,
      action: PayloadAction<{
        notifications: INotification[];
        unreadCount: number;
        hasMore: boolean;
      }>
    ) => {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
      state.hasMore = action.payload.hasMore;
      state.isLoading = false;
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n._id === action.payload
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    setNotificationLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setNotificationLoading,
} = notificationSlice.actions;

export default notificationSlice.reducer;
