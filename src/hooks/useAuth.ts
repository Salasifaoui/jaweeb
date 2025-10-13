import {
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  createJWT,
  getAccount,
  getCurrentSession,
  getCurrentUser
} from '@/src/services/authService';
import { UserService } from '@/src/services/usersService';
import {
  accountAtom,
  authErrorAtom,
  authLoadingAtom,
  isGuestInAtom,
  isLoggedInAtom,
  jwtAtom,
  sessionAtom,
  userAtom,
  userProfileAtom,
} from '@/src/store/atoms';
import { useAtom } from 'jotai';
import { useCallback } from 'react';


export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [userProfile, setUserProfile] = useAtom(userProfileAtom);
  const [account, setAccount] = useAtom(accountAtom);
  const [session, setSession] = useAtom(sessionAtom);
  const [jwt, setJwt] = useAtom(jwtAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [isGuestIn] = useAtom(isGuestInAtom);
  const [isLoading, setIsLoading] = useAtom(authLoadingAtom);
  const [error, setError] = useAtom(authErrorAtom);

  const fetchAuthData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, try to get session to determine if user is authenticated
      const sessionData = await getCurrentSession();
      
      if (sessionData) {
        setSession(sessionData);
        
        // Only try to fetch account/user data if we have a valid session
        // and it's not a guest session
     
          try {
            const [accountData, userData, jwtData] = await Promise.all([
              getAccount(),
              getCurrentUser(),
              createJWT(),
            ]);

            if (accountData) setAccount(accountData);
            if (userData) {
              setUser(userData);
              // Fetch user profile only for authenticated users
              const profile = await UserService.getUserProfile(userData.$id);
              if (profile) setUserProfile(profile);
            }
            if (jwtData) setJwt(jwtData);
          } catch (authErr) {
            // If we can't get account/user data, clear everything
            console.warn('Auth data fetch failed, clearing state:', authErr);
            setUser(null);
            setUserProfile(null);
            setAccount(null);
            setJwt(null);
          }
        
      } else {
        // No session - clear everything
        setUser(null);
        setUserProfile(null);
        setAccount(null);
        setSession(null);
        setJwt(null);
      }
    } catch (err) {
      console.error('Session fetch error:', err);
      // Only set error for session-related errors, not auth data errors
      if (err instanceof Error && err.message.includes('session')) {
        setError((err as Error).message || 'Session error occurred');
      }
      setUser(null);
      setUserProfile(null);
      setAccount(null);
      setSession(null);
      setJwt(null);
    } finally {
      setIsLoading(false);
    }
  }, [setAccount, setUser, setSession, setJwt, setUserProfile, setIsLoading, setError]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if there's already an active session
      const existingSession = await getCurrentSession();
      if (existingSession) {
        // If there's an existing session, sign out first
        console.log('Existing session found, signing out first...');
        await authSignOut();
        // Clear state
        setUser(null);
        setUserProfile(null);
        setAccount(null);
        setSession(null);
        setJwt(null);
      }
      
      const sessionData = await authSignIn(email, password);
      setSession(sessionData);
      await fetchAuthData();
      return sessionData;
    } catch (err) {
      const errorMessage = (err as Error).message || 'Sign in failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAuthData, setIsLoading, setError, setSession, setUser, setUserProfile, setAccount, setJwt]);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await authSignUp(email, password, name);
      setUser(userData);
      await fetchAuthData();
      return userData;
    } catch (err) {
      const errorMessage = (err as Error).message || 'Sign up failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAuthData, setIsLoading, setError, setUser]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authSignOut();
      // Clear all auth state
      setUser(null);
      setUserProfile(null);
      setAccount(null);
      setSession(null);
      setJwt(null);
    } catch (err) {
      const errorMessage = (err as Error).message || 'Sign out failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setUserProfile, setAccount, setSession, setJwt, setIsLoading, setError]);

  // const signInAsGuest = useCallback(async () => {
  //   setIsLoading(true);
  //   setError(null);
    
  //   try {
  //     // Check if there's already an active session
  //     const existingSession = await getCurrentSession();
  //     if (existingSession) {
  //       // If there's an existing session, sign out first
  //       console.log('Existing session found, signing out first...');
  //       await authSignOut();
  //       // Clear state
  //       setUser(null);
  //       setUserProfile(null);
  //       setAccount(null);
  //       setSession(null);
  //       setJwt(null);
  //     }
      
  //     const sessionData = await createAnonymousSession();
  //     setSession(sessionData);
  //     // For guest sessions, user remains null but session exists
  //     return sessionData;
  //   } catch (err) {
  //     const errorMessage = (err as Error).message || 'Guest sign in failed';
  //     setError(errorMessage);
  //     throw new Error(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [setSession, setIsLoading, setError, setUser, setUserProfile, setAccount, setJwt]);


  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const resetAuth = useCallback(() => {
    setUser(null);
    setUserProfile(null);
    setAccount(null);
    setSession(null);
    setJwt(null);
    setError(null);
    setIsLoading(false);
  }, [setUser, setUserProfile, setAccount, setSession, setJwt, setError, setIsLoading]);

  return {
    // State
    user,
    userProfile,
    account,
    session,
    jwt,
    isLoggedIn,
    isGuestIn,
    isLoading,
    error,
    
    // Actions
    fetchAuthData,
    signIn,
    signUp,
    signOut,
    // signInAsGuest,
    clearError,
    resetAuth,
  };
};