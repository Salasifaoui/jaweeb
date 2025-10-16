import { APP_CONFIG } from '@/src/config';
import { Session } from '@/src/models/Session';
import { User } from '@/src/models/User';
import { account, databases } from '@/src/services/apiService';
import { Alert } from 'react-native';
import { AppwriteException, ID } from 'react-native-appwrite';
import { profileService } from '../../profile/service/profileService';

export const authService = {
  // 🔹 إنشاء حساب جديد + userProfile في collection
  register: async (name: string, email: string, password: string): Promise<User | null> => {
    try {

      const user = await account.create(ID.unique(), email, password, name);

      await profileService.createUser({
        username: name,
        email,
        userId: user.$id
      });

      return user;
    } catch (error) {
      Alert.alert('خطأ', (error as AppwriteException).message || 'فشل التسجيل');
      return null;
    }
  },

  // 🔹 تسجيل الدخول
  login: async (email: string, password: string): Promise<Session | null> => {
    try {
      const existingSession = await authService.getCurrentUser();
      if (existingSession) {
        await authService.logout();
      }
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      Alert.alert('خطأ', 'فشل تسجيل الدخول');
      console.error('Login error:', error);
      return null;
    }
  },

  // 🔹 جلسة ضيف
  // 🔹 جلسة ضيف
loginAsGuest: async (): Promise<Session | null> => {
  try {
    // const session = await account.createAnonymousSession();
 
    // ✅ إنشاء userProfile إن لم يكن موجود
    // const user = await account.get();
    try {
      const user = await databases.getDocument(
        APP_CONFIG.DATABASE_ID,
        APP_CONFIG.USERS_COLLECTION,
        '68ee6c6b9dbdce28a97c'
      );
      return user as unknown as Session;
      // ✅ موجود مسبقًا — لا حاجة لإنشائه
    } catch {
      // 🚀 غير موجود، نُنشئ مستند جديد
      const user = await databases.createDocument(
        APP_CONFIG.DATABASE_ID,
        APP_CONFIG.USERS_COLLECTION,
        '68ee6c6b9dbdce28a97c',
        {
          username: 'Guest User',
          email: '',
          userId: '68ee6c6b9dbdce28a97c',
          // is_guest: true,
          // created_at: new Date().toISOString(),
        }
      );
      return user as unknown as Session;
    }

    // return {
    //   $id: '68ee6c6b9dbdce28a97c',
    //   name: 'guest',
    //   $createdAt: new Date().toISOString(),
    //   $updatedAt: new Date().toISOString(),
    // };
  } catch (error) {
    console.error('Guest session error:', error);
    return null;
  }
},

  // 🔹 تسجيل الخروج
  logout: async () => {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // 🔹 جلب المستخدم الحالي
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const current = await account.get();
      return current;
    } catch {
      return null;
    }
  },

  getCurrentSession: async (): Promise<Session | null> => {
    try {
      const current = await account.getSession('current');
      return current;
    } catch {
      return null;
    }
  },
};
