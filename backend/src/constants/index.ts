export { HTTP_STATUS } from './httpStatus';
export type { HttpStatusCode } from './httpStatus';
export { SOCKET_EVENTS } from './socketEvents';
export type { SocketEvent } from './socketEvents';

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
} as const;

export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  MISSED_CALL: 'missed_call',
  SYSTEM: 'system',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip',
  ],
  CLOUDINARY_FOLDERS: {
    PROFILE: 'chat-app/profiles',
    MESSAGES: 'chat-app/messages',
    FILES: 'chat-app/files',
  },
} as const;

export const JWT = {
  COOKIE_NAME: 'chat_token',
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
