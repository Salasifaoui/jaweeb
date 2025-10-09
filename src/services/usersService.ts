import { appwriteClient } from '@/src/appwrite/appwriteClient';
import type { User } from '@/src/types';
import { APPWRITE_CONFIG } from '@/src/utils/constants';
import { Query } from 'react-native-appwrite';

export interface CreateUserData {
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  status?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  status?: string;
  is_online?: boolean;
  last_seen?: string;
}

export class UsersService {
  async getUsers(): Promise<User[]> {
    try {
      const users = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.USERS
      );
      
      return users.documents.map((user: any) => ({
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        status: user.status,
        bio: user.bio,
        last_seen: user.last_seen,
        is_online: user.is_online,
        created_at: user.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل المستخدمين.');
    }
  }

  async getUser(userId: string): Promise<User> {
    try {
      const user = await appwriteClient.databases.getDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.USERS,
        userId
      );
      
      return {
        user_id: (user as any).user_id,
        username: (user as any).username,
        email: (user as any).email,
        avatar_url: (user as any).avatar_url,
        status: (user as any).status,
        bio: (user as any).bio,
        last_seen: (user as any).last_seen,
        is_online: (user as any).is_online,
        created_at: (user as any).created_at,
      };
    } catch (error) {
      throw new Error('فشل في تحميل المستخدم.');
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      console.log('userData', userData);
      console.log('APPWRITE_CONFIG.DATABASE_ID', APPWRITE_CONFIG.DATABASE_ID);
      console.log('APPWRITE_CONFIG.COLLECTIONS.USERS', APPWRITE_CONFIG.COLLECTIONS.USERS);
      const user = await appwriteClient.databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.USERS,
        'unique()',
        {
          user_id: userData.email, // Will be updated with actual user_id
          username: userData.username,
          email: userData.email,
          avatar_url: userData.avatar_url || '',
          status: userData.status || 'online',
          bio: userData.bio || '',
          is_online: true,
          last_seen: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );

      return {
        user_id: (user as any).user_id,
        username: (user as any).username,
        email: (user as any).email,
        avatar_url: (user as any).avatar_url,
        status: (user as any).status,
        bio: (user as any).bio,
        last_seen: (user as any).last_seen,
        is_online: (user as any).is_online,
        created_at: (user as any).created_at,
      };
    } catch (error) {
      throw new Error('فشل في إنشاء المستخدم.');
    }
  }

  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    try {
      const user = await appwriteClient.databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.USERS,
        userId,
        userData as any
      );

      return {
        user_id: (user as any).user_id,
        username: (user as any).username,
        email: (user as any).email,
        avatar_url: (user as any).avatar_url,
        status: (user as any).status,
        bio: (user as any).bio,
        last_seen: (user as any).last_seen,
        is_online: (user as any).is_online,
        created_at: (user as any).created_at,
      };
    } catch (error) {
      throw new Error('فشل في تحديث المستخدم.');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await appwriteClient.databases.deleteDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.USERS,
        userId
      );
    } catch (error) {
      throw new Error('فشل في حذف المستخدم.');
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      const users = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.USERS,
        [
          Query.search('username', query),
        ]
      );
      
      return users.documents.map((user: any) => ({
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        status: user.status,
        bio: user.bio,
        last_seen: user.last_seen,
        is_online: user.is_online,
        created_at: user.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في البحث عن المستخدمين.');
    }
  }

  async updateUserStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      await appwriteClient.databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.USERS,
        userId,
        {
          is_online: isOnline,
          last_seen: new Date().toISOString(),
        } as any
      );
    } catch (error) {
      throw new Error('فشل في تحديث حالة المستخدم.');
    }
  }

  async getOnlineUsers(): Promise<User[]> {
    try {
      const users = await appwriteClient.databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.USERS,
        [
          Query.equal('is_online', [true]),
        ]
      );
      
      return users.documents.map((user: any) => ({
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        status: user.status,
        bio: user.bio,
        last_seen: user.last_seen,
        is_online: user.is_online,
        created_at: user.created_at,
      }));
    } catch (error) {
      throw new Error('فشل في تحميل المستخدمين المتصلين.');
    }
  }
}

export const usersService = new UsersService();