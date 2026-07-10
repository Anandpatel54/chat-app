export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  HOME: '/home',
  CHAT: (id: string) => `/chat/${id}`,
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATION_SETTINGS: '/settings/notifications',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE: '/auth/google',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    FCM_TOKEN: '/auth/fcm-token',
  },
  USERS: {
    SEARCH: '/users/search',
    GET_BY_ID: (id: string) => `/users/${id}`,
    BLOCK: (id: string) => `/users/block/${id}`,
    UNBLOCK: (id: string) => `/users/unblock/${id}`,
  },
  CHATS: {
    LIST: '/chats',
    CREATE: '/chats',
    GET_BY_ID: (id: string) => `/chats/${id}`,
    DELETE: (id: string) => `/chats/${id}`,
    SEARCH: '/chats/search',
  },
  MESSAGES: {
    GET: (conversationId: string) => `/messages/${conversationId}`,
    SEND: '/messages',
    READ: (id: string) => `/messages/${id}/read`,
    DELETE: (id: string) => `/messages/${id}`,
    DELETE_EVERYONE: (id: string) => `/messages/${id}/everyone`,
    FORWARD: (id: string) => `/messages/${id}/forward`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    UPDATE_IMAGE: '/profile/image',
    UPDATE_FCM: '/profile/fcm-token',
  },
} as const;
