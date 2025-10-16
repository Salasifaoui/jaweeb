import { Session } from '@/src/models/Session';
import { User } from '@/src/types/user';
import { atom } from 'jotai';

// 🔐 Authentication atoms
export const userAtom = atom<User | null>(null);
export const sessionAtom = atom<Session | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
export const authLoadingAtom = atom<boolean>(true);

// 🔄 Derived atoms
export const authStateAtom = atom(
  (get) => ({
    user: get(userAtom),
    session: get(sessionAtom),
    isAuthenticated: get(isAuthenticatedAtom),
    loading: get(authLoadingAtom),
  })
);

// 🎯 Navigation atoms
export const initialRouteAtom = atom<string | null>(null);
export const hasNavigatedAtom = atom<boolean>(false);

// 👤 Profile update atoms
export const profileUpdateLoadingAtom = atom<boolean>(false);
export const profileUpdateErrorAtom = atom<string | null>(null);
export const profileUpdateSuccessAtom = atom<boolean>(false);
