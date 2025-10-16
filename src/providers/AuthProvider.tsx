import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { User } from '@/src/models/User';
import React, { createContext, ReactNode, useContext } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  upgradeGuest: (email: string, password: string, name?: string) => Promise<void>;
  reload: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

/**
 * 🪄 Hook للوصول إلى بيانات المستخدم من أي مكان
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
