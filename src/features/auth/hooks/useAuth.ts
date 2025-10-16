import { authService } from '@/src/features/auth/service/authService';
import {
  authLoadingAtom,
  isAuthenticatedAtom,
  sessionAtom,
  userAtom
} from '@/src/features/auth/store/authAtoms';
import { User } from '@/src/types/user';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { Models } from 'react-native-appwrite';
import { profileService } from '../../profile/service/profileService';

// Helper function to convert Appwrite User to our custom User type
const convertAppwriteUser = (appwriteUser: Models.User<Models.Preferences> | null): User | null => {
  if (!appwriteUser) return null;
  
  return {
    userId: appwriteUser.$id,
    username: appwriteUser.name || '',
    email: appwriteUser.email || '',
    avatar: undefined,
    imageUrl: undefined,
    status: undefined,
    bio: undefined,
    last_seen: undefined,
    is_online: undefined,
  };
};

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const [session, setSession] = useAtom(sessionAtom);
  const [profile, setProfile] = useAtom(userAtom); // Using same atom for profile
  const [loading, setLoading] = useAtom(authLoadingAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const current = await authService.getCurrentUser();
      const currentSession = await authService.getCurrentSession();
      
      const convertedUser = convertAppwriteUser(current);
      const profile = await profileService.getUserProfile(current?.$id || "");
      setProfile(profile);
      setUser(convertedUser);
      setSession(currentSession);
      setIsAuthenticated(!!convertedUser && !!currentSession);
      
      console.log('Auth reload:', { 
        user: !!convertedUser, 
        session: !!currentSession, 
        isAuthenticated: !!(convertedUser && currentSession) 
      });
    } catch (error) {
      console.error('Auth reload error:', error);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [setUser, setSession, setIsAuthenticated, setLoading, setProfile]);

  useEffect(() => {
    reload();
  }, [reload]);

  const login = async (email: string, password: string) => {
    try {
      const newSession = await authService.login(email, password);
      
      if (newSession) {
        setSession(newSession);
        setIsAuthenticated(true);
        await reload(); // This will fetch the user data
      }
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const newUser = await authService.register(name, email, password);
      if (newUser) {
        const convertedUser = convertAppwriteUser(newUser);
        setUser(convertedUser)
        setIsAuthenticated(true);
        await reload(); // This will fetch the session
        return newUser as unknown as User;
      }
    } catch (error) {
      console.error('Register error:', error);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAuthenticated(false);
      await reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loginAsGuest = async () => {
    try {
      const userGuest = await authService.loginAsGuest();
      if (userGuest) {
        setUser(userGuest as unknown as User);
        setIsAuthenticated(true);
        console.log("userGuest", userGuest);
      }
    } catch (error) {
      console.error('Guest login error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return {
    user, // مستخدم Appwrite الأساسي
    profile, // userProfile من قاعدة البيانات
    loading,
    login,
    register,
    logout,
    reload,
    loginAsGuest,
    session,
    isAuthenticated,
  };
}
