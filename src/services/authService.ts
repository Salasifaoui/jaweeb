import { appwriteClient } from '@/src/appwrite/appwriteClient';
import { APPWRITE_CONFIG } from '@/src/appwrite/config';
import type { AuthUser, UserProfile } from '@/src/types';

export class AuthService {
  async login(email: string, password: string): Promise<AuthUser> {
    try {
      const session = await appwriteClient.account.createEmailPasswordSession(email, password);
      
      // Get user data from database
      const userData = await appwriteClient.databases.getDocument(
        APPWRITE_CONFIG.databases[0].$id,
        'users',
        session.userId
      );
      
      return {
        id: session.userId,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        bio: userData.bio,
        isEmailVerified: (session as any).emailVerification || false,
        createdAt: userData.$createdAt,
        updatedAt: userData.$updatedAt,
      };
    } catch (error) {
      throw new Error('فشل في تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى.');
    }
  }

  async register(name: string, email: string, password: string): Promise<AuthUser> {
    try {
      // Create account
      const user = await appwriteClient.account.create('unique()', email, password, name);
      
      // Create user document in database
      const userData = await appwriteClient.databases.createDocument(
        APPWRITE_CONFIG.databases[0].$id,
        'users',
        user.$id,
        {
          name,
          email,
          avatar: '',
          bio: '',
        }
      );

      return {
        id: user.$id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        bio: userData.bio,
        isEmailVerified: user.emailVerification,
        createdAt: userData.$createdAt,
        updatedAt: userData.$updatedAt,
      };
    } catch (error) {
      throw new Error('فشل في إنشاء الحساب. تحقق من البيانات وحاول مرة أخرى.');
    }
  }

  async logout(): Promise<void> {
    try {
      await appwriteClient.account.deleteSession('current');
    } catch (error) {
      throw new Error('فشل في تسجيل الخروج.');
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const session = await appwriteClient.account.getSession('current');
      if (!session) return null;

      const userData = await appwriteClient.databases.getDocument(
        APPWRITE_CONFIG.databases[0].$id,
        'users',
        session.userId
      );
      
      return {
        id: session.userId,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        bio: userData.bio,
        isEmailVerified: (session as any).emailVerification || false,
        createdAt: userData.$createdAt,
        updatedAt: userData.$updatedAt,
      };
    } catch (error) {
      return null;
    }
  }

  async updateProfile(profileData: UserProfile): Promise<AuthUser> {
    try {
      const session = await appwriteClient.account.getSession('current');
      if (!session) throw new Error('غير مصرح لك');

      const updatedUser = await appwriteClient.databases.updateDocument(
        APPWRITE_CONFIG.databases[0].$id,
        'users',
        session.userId,
        profileData
      );

      return {
        id: session.userId,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        isEmailVerified: (session as any).emailVerification || false,
        createdAt: updatedUser.$createdAt,
        updatedAt: updatedUser.$updatedAt,
      };
    } catch (error) {
      throw new Error('فشل في تحديث الملف الشخصي.');
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await appwriteClient.account.createRecovery(email, `${process.env.EXPO_PUBLIC_APP_URL}/reset-password`);
    } catch (error) {
      throw new Error('فشل في إرسال رابط إعادة تعيين كلمة المرور.');
    }
  }

  async verifyEmail(): Promise<void> {
    try {
      await appwriteClient.account.createVerification(`${process.env.EXPO_PUBLIC_APP_URL}/verify-email`);
    } catch (error) {
      throw new Error('فشل في إرسال رابط التحقق من البريد الإلكتروني.');
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await appwriteClient.account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      throw new Error('فشل في تغيير كلمة المرور.');
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const session = await appwriteClient.account.getSession('current');
      if (!session) throw new Error('غير مصرح لك');

      // Delete user data from database
      await appwriteClient.databases.deleteDocument(
        APPWRITE_CONFIG.databases[0].$id,
        'users',
        session.userId
      );
      
      // Delete account
      await appwriteClient.account.deleteIdentity('current');
    } catch (error) {
      throw new Error('فشل في حذف الحساب.');
    }
  }
}

export const authService = new AuthService();