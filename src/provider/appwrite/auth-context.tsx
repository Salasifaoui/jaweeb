import { account, databases } from "@/src/services/apiService";
import { UserService } from "@/src/services/usersService";
import { useRouter } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import { Account, Query } from "react-native-appwrite";
// import { OAuthService } from "@/src/services/oauthService";
import { APP_CONFIG } from "@/src/configs";
import { Jwt } from "@/src/models/Jwt";
import { Session } from "@/src/models/Session";
import { UserProfile } from "@/src/models/types";
import { User } from "@/src/models/User";
import { signIn, signOut, signUp } from "@/src/services/authService";

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isFetchingUser: boolean;
  isLoggedIn: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<Session>;
  // signInWithGoogle: () => Promise<void>;
  // signInWithApple: () => Promise<void>;
  signOut: () => Promise<Session | null>;
  updateProfile: (data: any) => Promise<void>;
  getAccount: () => Promise<Account | null>;
  createJWT: () => Promise<Jwt | null>;
  getCurrentSession: () => Promise<Session | null>;
  getCurrentUser: () => Promise<User | null>;
  resetPassword: (email: string) => Promise<any | null>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const getUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
      setIsLoggedIn(true);
      
      // Get user profile
      const profile = await UserService.getUserProfile(session.$id);
      setUserProfile(profile);
    } catch (error) {
      setUser(null);
      setUserProfile(null);
      setIsLoggedIn(false);
    } finally {
      setIsFetchingUser(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // const signInWithGoogle = async () => {
  //   try {
  //     setIsLoading(true);
  //     const oauthUser = await OAuthService.signInWithGoogle();
      
  //     // Create a mock user object for the auth context
  //     const mockUser = {
  //       $id: oauthUser.id,
  //       email: oauthUser.email,
  //       name: oauthUser.name,
  //       status: true,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     } as unknown as Models.User<Models.Preferences>;
      
  //     setUser(mockUser);
  //     setIsLoggedIn(true);
      
  //     // Get user profile
  //     const profile = await UserService.getUserProfile(mockUser.$id);
  //     setUserProfile(profile);
      
  //   } catch (error) {
  //     console.error("Google sign-in error:", error);
  //     throw new Error("Google sign-in failed");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const signInWithApple = async () => {
  //   try {
  //     setIsLoading(true);
  //     const oauthUser = await OAuthService.signInWithApple();
      
  //     // Create a mock user object for the auth context
  //     const mockUser = {
  //       $id: oauthUser.id,
  //       email: oauthUser.email,
  //       name: oauthUser.name,
  //       status: true,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     } as unknown as Models.User<Models.Preferences>;
      
  //     setUser(mockUser);
  //     setIsLoggedIn(true);
      
  //     // Get user profile
  //     const profile = await UserService.getUserProfile(mockUser.$id);
  //     setUserProfile(profile);
      
  //   } catch (error) {
  //     console.error("Apple sign-in error:", error);
  //     throw new Error("Apple sign-in failed");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const updateProfile = async (data: any) => {
    try {
      if (!user) return;
      
      const updatedProfile = await UserService.updateUserProfile(user.$id, data);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Reset Password
async function resetPassword(email: string) {
  try {
    const response = await account.createRecovery(
      email,
      `${APP_CONFIG.APPWRITE_API_URL}/reset-password/new`
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
}

  // Get Account
async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Create JWT Session
async function createJWT() {
  try {
    const jwt = await account.createJWT();

    return jwt;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current Session
async function getCurrentSession() {
  try {
    const currentSession = await account.getSession("current");

    return currentSession;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(APP_CONFIG.DATABASE_ID!, APP_CONFIG.USERS_COLLECTION!, [
      Query.equal("$id", currentAccount.$id),
    ]);

    if (!currentUser) throw Error;

    return currentUser.documents[0] as unknown as UserProfile;
  } catch (error) {
    return null;
  }
}

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isFetchingUser,
        isLoading,
        isLoggedIn,
        signIn,
        signOut,
        signUp,
        // signInWithGoogle,
        // signInWithApple,
        updateProfile,
        getAccount,
        createJWT,
        getCurrentSession,
        getCurrentUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

