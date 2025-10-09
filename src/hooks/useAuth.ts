import { useAccount } from '@/src/appwrite/account/useAccount';
import { useCreateRecovery } from '@/src/appwrite/account/useCreateRecovery';
import { useCreateVerification } from '@/src/appwrite/account/useCreateVerification';
import { useDeleteAccount as useDeleteAccountHook } from '@/src/appwrite/account/useDeleteAccount';
import { useEmailSignIn } from '@/src/appwrite/account/useEmailSignIn';
import { useEmailSignUp } from '@/src/appwrite/account/useEmailSignUp';
import { useSignOut } from '@/src/appwrite/account/useSignOut';
import { useUpdateEmail } from '@/src/appwrite/account/useUpdateEmail';
import { useUpdateName } from '@/src/appwrite/account/useUpdateName';
import { useUpdatePassword } from '@/src/appwrite/account/useUpdatePassword';
import { useAppwrite } from '@/src/appwrite/AppwriteProvider';
import { APPWRITE_CONFIG } from '@/src/appwrite/config';
import type { AuthUser, UserProfile } from '@/src/types';
import { useCallback, useEffect, useState } from 'react';

export function useAuth() {
  const { databases } = useAppwrite();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Use the new Appwrite hooks
  const { data: accountData, isLoading: accountLoading } = useAccount();
  const emailSignIn = useEmailSignIn({});
  const emailSignUp = useEmailSignUp({});
  const signOut = useSignOut({});
  const updateName = useUpdateName({});
  const updateEmail = useUpdateEmail({});
  const updatePassword = useUpdatePassword({});
  const createRecovery = useCreateRecovery({});
  const createVerification = useCreateVerification({});
  const deleteAccountHook = useDeleteAccountHook({});

  const checkAuthState = useCallback(async () => {
    try {
      if (accountData) {
        // Get user data from database
        const userData = await databases.getDocument(
          APPWRITE_CONFIG.databases[0].$id,
          'users',
          accountData.$id
        );
        
        setUser({
          id: accountData.$id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          bio: userData.bio,
          isEmailVerified: accountData.emailVerification,
          createdAt: userData.$createdAt,
          updatedAt: userData.$updatedAt,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [accountData, databases]);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const login = async (email: string, password: string) => {
    try {
      await emailSignIn.mutateAsync({ email, password });
      // User will be updated via the accountData effect
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const result = await emailSignUp.mutateAsync({ email, password, name });
      
      // Create user document in database
      await databases.createDocument(
        APPWRITE_CONFIG.databases[0].$id,
        'users',
        result.$id,
        {
          name,
          email,
          avatar: '',
          bio: '',
        }
      );
      
      // User will be updated via the accountData effect
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut.mutateAsync();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (profileData: UserProfile) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Update name if changed
      if (profileData.name !== user.name) {
        await updateName.mutateAsync({ name: profileData.name });
      }

      // Update email if changed
      if (profileData.email !== user.email) {
        await updateEmail.mutateAsync({ email: profileData.email });
      }

      // Update other profile data in database
      const updatedUser = await databases.updateDocument(
        APPWRITE_CONFIG.databases[0].$id,
        'users',
        user.id,
        {
          bio: profileData.bio,
          avatar: profileData.avatar,
        }
      );

      setUser(prev => prev ? {
        ...prev,
        name: profileData.name,
        email: profileData.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        updatedAt: updatedUser.$updatedAt,
      } : null);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await createRecovery.mutateAsync({ 
        email, 
        url: `${process.env.EXPO_PUBLIC_APP_URL}/reset-password`,
        password: '' // This will be set by the user in the recovery flow
      });
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async () => {
    try {
      await createVerification.mutateAsync({ 
        url: `${process.env.EXPO_PUBLIC_APP_URL}/verify-email` 
      });
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await updatePassword.mutateAsync({ 
        password: newPassword, 
        oldPassword 
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Delete user data from database
      await databases.deleteDocument(
        APPWRITE_CONFIG.databases[0].$id,
        'users',
        user.id
      );

      // Delete account
      await deleteAccountHook.mutateAsync();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading: loading || accountLoading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    verifyEmail,
    changePassword,
    deleteAccount,
  };
}