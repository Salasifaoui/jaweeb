// Appwrite Configuration
export const APPWRITE_CONFIG = {
  ENDPOINT: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '',
  DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || 'Jaweeb',
  COLLECTIONS: {
    USERS: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
    MEMBERSHIPS: process.env.EXPO_PUBLIC_APPWRITE_MEMBERSHIP_COLLECTION_ID|| 'memberships',
    MESSAGES: process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION || 'messages',
    GROUPS: process.env.EXPO_PUBLIC_APPWRITE_GROUPS_COLLECTION_ID || 'groups',
  },
  BUCKETS: {
    AVATARS: process.env.EXPO_PUBLIC_APPWRITE_AVATARS_BUCKET || 'avatars',
    MESSAGE_ATTACHMENTS: process.env.EXPO_PUBLIC_APPWRITE_ATTACHMENTS_BUCKET || 'message_attachments',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    SEARCH: '/users/search',
  },
  CHATS: {
    LIST: '/chats',
    CREATE: '/chats',
    GET: '/chats/:id',
    UPDATE: '/chats/:id',
    DELETE: '/chats/:id',
    MEMBERS: '/chats/:id/members',
  },
  MESSAGES: {
    LIST: '/chats/:chatId/messages',
    SEND: '/chats/:chatId/messages',
    UPDATE: '/messages/:id',
    DELETE: '/messages/:id',
  },
};

// UI Constants
export const UI_CONSTANTS = {
  COLORS: {
    PRIMARY: '#007AFF',
    SECONDARY: '#5856D6',
    SUCCESS: '#34C759',
    WARNING: '#FF9500',
    ERROR: '#FF3B30',
    BACKGROUND: '#F2F2F7',
    SURFACE: '#FFFFFF',
    TEXT_PRIMARY: '#000000',
    TEXT_SECONDARY: '#8E8E93',
    BORDER: '#C6C6C8',
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
  BORDER_RADIUS: {
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 20,
  },
  FONT_SIZES: {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
  },
};

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 200,
  MESSAGE_MAX_LENGTH: 1000,
  GROUP_NAME_MAX_LENGTH: 50,
  GROUP_DESCRIPTION_MAX_LENGTH: 200,
};

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/aac'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
};

// Real-time Events
export const REALTIME_EVENTS = {
  MESSAGE_CREATED: 'message.created',
  MESSAGE_UPDATED: 'message.updated',
  MESSAGE_DELETED: 'message.deleted',
  USER_TYPING: 'user.typing',
  USER_ONLINE: 'user.online',
  USER_OFFLINE: 'user.offline',
  CHAT_UPDATED: 'chat.updated',
  CHAT_MEMBER_ADDED: 'chat.member.added',
  CHAT_MEMBER_REMOVED: 'chat.member.removed',
};
