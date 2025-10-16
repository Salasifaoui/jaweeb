import { APP_CONFIG } from '@/src/config';
import { createDocument, databases, getDocument, updateDocument } from '@/src/services/apiService';
import { User } from '@/src/types/user';
import { Query } from 'react-native-appwrite';

export const profileService = {

  // ➕ إنشاء مستخدم جديد
  async createUser(userData: Omit<User, '$id' | '$createdAt' | '$updatedAt'>): Promise<User | null> {
    try {
      const created = await createDocument(APP_CONFIG.USERS_COLLECTION, userData.userId,
        userData,
  );
      return created as unknown as User;
    } catch (error) {
      console.error('createUser error:', error);
      return null;
    }
  },

  // 📄 جلب بيانات المستخدم من الجدول
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      if (!userId) {
        return null;
      }
      const doc = await getDocument(APP_CONFIG.USERS_COLLECTION, userId) as unknown as User;
      return doc;
    } catch (error) {
      console.error('getUserProfile error:', error);
      return null;
    }
  },

  // 📝 تحديث بيانات المستخدم
  async updateUserProfile(userId: string, data: Partial<User>): Promise<User | null> {
    try {
      const updated = await updateDocument(
        APP_CONFIG.USERS_COLLECTION,
        userId,
          data
      );
      return updated as unknown as User;
    } catch (error) {
      console.error('updateUserProfile error:', error);
      return null;
    }
  },

  // ❌ حذف المستخدم
  async deleteUserProfile(userId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        APP_CONFIG.DATABASE_ID,
        APP_CONFIG.USERS_COLLECTION,
        userId
      );
      return true;
    } catch (error) {
      console.error('deleteUserProfile error:', error);
      return false;
    }
  },

  // 📋 جلب جميع المستخدمين (اختياري)
  async listUsers(): Promise<User[]> {
    try {
      const res = await databases.listDocuments(
        APP_CONFIG.DATABASE_ID,
        APP_CONFIG.USERS_COLLECTION,
        [Query.orderDesc('$createdAt')]
      );
      return res.documents as unknown as User[];
    } catch (error) {
      console.error('listUsers error:', error);
      return [];
    }
  },
};
