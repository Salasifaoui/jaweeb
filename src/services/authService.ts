import { Account } from '@/src/models/Account';
import { Jwt } from '@/src/models/Jwt';
import { Session } from '@/src/models/Session';
import { User } from '@/src/models/User';
import { account } from "@/src/services/apiService";
import { Alert } from 'react-native';
import { OAuthProvider } from 'react-native-appwrite';
import { APP_CONFIG } from '../configs';
import { UserService } from './usersService';

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getCurrentSession = async (): Promise<Session | null> => {
  try {
    const session = await account.getSession('current');
    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

export const getAccount = async (): Promise<Account | null> => {
  try {
    const accountData = await account.get();
    return accountData;
  } catch (error) {
    console.error('Error getting account:', error);
    return null;
  }
};

export const createJWT = async (): Promise<Jwt | null> => {
  try {
    const jwt = await account.createJWT();
    return jwt;
  } catch (error) {
    console.error('Error creating JWT:', error);
    return null;
  }
};


export function createOAuth2Token(provider: OAuthProvider) {
    try {
      const SUCCESS_OAUTH2 = `jaweeb://(auth)/success?provider=${provider}`;
      const FAILURE_OAUTH2 = `jaweeb://(auth)/failure?provider=${provider}`;
      const token = account.createOAuth2Token(
        provider,
        SUCCESS_OAUTH2,
        FAILURE_OAUTH2
      );
  
      return token;
    } catch (error) {
      throw new Error(String(error));
    }
  }
  
export async function createSession(userId: string, secret: string) {
    try {
      const session = await account.createSession(userId, secret);
  
      return session;
    } catch (error) {
      throw new Error(String(error));
    }
  }

// Sign In as Guest
export async function createAnonymousSession() {
    try {
      // Check for existing session and clean up if needed
      const existingSession = await getCurrentSession();
      if (existingSession) {
        console.log('Existing session found, cleaning up before guest sign in...');
        await signOut();
      }
      
      const session = await account.createAnonymousSession();
  
      return session;
    } catch (error) {
      throw new Error(String(error));
    }
  }

export const signIn = async (email: string, password: string): Promise<Session> => {
  try {
    // Check for existing session and clean up if needed
    const session = await account.createEmailPasswordSession(email, password);
    // Note: User profile will be fetched in useAuth hook after session is set
    return session;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, name?: string): Promise<User> => {
  try {
    const user = await account.create(
      'unique()',
      email,
      password,
      name || ""
    );
    if (!user) throw Error;
    await UserService.createUser({email, username: name || "", password}, user as unknown as User);
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signOut = async (): Promise<Session | null> => {
    try {
        const session = await account.deleteSession("current");
    
        return session as unknown as Session;
      } catch (error) {
        Alert.alert('Error signing out:', String(error));
        return null;
      }
};

export const deleteAllSessions = async (): Promise<void> => {
  try {
    await account.deleteSessions();
  } catch (error) {
    console.error('Error deleting all sessions:', error);
    throw error;
  }
};

export const updatePassword = async (password: string, oldPassword?: string): Promise<User> => {
  try {
    const user = await account.updatePassword(password, oldPassword);
    return user as unknown as User;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const updateEmail = async (email: string, password: string): Promise<User> => {
  try {
    const user = await account.updateEmail(email, password);
    return user as unknown as User;
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

export const updateName = async (name: string): Promise<User> => {
  try {
    const user = await account.updateName(name);
    return user as unknown as User;
  } catch (error) {
    console.error('Error updating name:', error);
    throw error;
  }
};

export const createRecovery = async (email: string, url: string): Promise<void> => {
  try {
    await account.createRecovery(email, url);
  } catch (error) {
    console.error('Error creating recovery:', error);
    throw error;
  }
};

export const updateRecovery = async (userId: string, secret: string, password: string): Promise<User> => {
  try {
    const user = await account.updateRecovery(userId, secret, password);
    return user as unknown as User;
  } catch (error) {
    console.error('Error updating recovery:', error);
    throw error;
  }
};

export const createVerification = async (url: string): Promise<void> => {
  try {
    await account.createVerification(url);
  } catch (error) {
    console.error('Error creating verification:', error);
    throw error;
  }
};

export const updateVerification = async (userId: string, secret: string): Promise<User> => {
  try {
    const user = await account.updateVerification(userId, secret);
    return user as unknown as User;
  } catch (error) {
    console.error('Error updating verification:', error);
    throw error;
  }
}; 

// Reset Password
export async function resetPassword(email: string) {
  try {
    const response = await account.createRecovery(
      email,
      `${APP_CONFIG.APP_URL}/reset-password/new`
    );

    return response;
  } catch (error) {
    throw new Error(String(error));
  }
}