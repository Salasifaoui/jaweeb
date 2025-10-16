export const APP_CONFIG = {
    APPWRITE_API_URL: process.env.EXPO_PUBLIC_APPWRITE_API_URL || 'https://cloud.appwrite.io/v1',
    APPWRITE_PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '',
    APPWRITE_DEV_KEY: process.env.EXPO_PUBLIC_APPWRITE_DEV_KEY || '',
    APP_URL: process.env.EXPO_PUBLIC_APP_URL || 'http://localhost:8081',
    DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || 'Jaweeb',
    USERS_COLLECTION: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION || 'users',
    STORAGE_BUCKET_ID: process.env.EXPO_PUBLIC_APPWRITE_AVATARS_BUCKET || 'storage',
    STORAGE_BUCKET_NAME: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_BUCKET_NAME || 'storage',
  } as const;