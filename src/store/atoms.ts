import { Account } from '@/src/models/Account';
import { Jwt } from '@/src/models/Jwt';
import { Session } from '@/src/models/Session';
import { User } from '@/src/models/User';
import { UserProfile } from '@/src/models/types';
import { UserService } from '@/src/services/usersService';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Types
export interface UpdateUserData {
  username?: string;
  email?: string;
  bio?: string;
  imageUrl?: string;
  avatar?: string;
}

// Auth atoms
export const userAtom = atomWithStorage<User | null>('user', null);
export const userProfileAtom = atomWithStorage<UserProfile | null>('userProfile', null);
export const accountAtom = atomWithStorage<Account | null>('account', null);
export const sessionAtom = atomWithStorage<Session | null>('session', null);
export const jwtAtom = atomWithStorage<Jwt | null>('jwt', null);

// Computed auth atoms
export const isLoggedInAtom = atom<boolean>((get) => get(userAtom) !== null);
export const isGuestInAtom = atom<boolean>((get) => get(sessionAtom) !== null && get(userAtom) === null);

// Loading and error atoms
export const authLoadingAtom = atom<boolean>(false);
export const authErrorAtom = atom<string | null>(null);

// User profile update atoms
export const updateUserProfileLoadingAtom = atom<boolean>(false);
export const updateUserProfileErrorAtom = atom<string | null>(null);
export const userProfileUpdateTriggerAtom = atom<number>(0);

// Write-only atom for updating user profile with automatic refresh
export const updateUserProfileWithRefreshAtom = atom(
  null, // read function not used
  async (get, set, { userId, updateData }: { userId: string; updateData: UpdateUserData }) => {
    try {
      set(updateUserProfileLoadingAtom, true);
      set(updateUserProfileErrorAtom, null);
      
      // Update user profile in database
      const updatedProfile = await UserService.updateUserProfile(userId, updateData);
      
      if (updatedProfile) {
        // Update the userProfile atom with new data
        set(userProfileAtom, updatedProfile);
        // Trigger refresh for any components listening
        set(userProfileUpdateTriggerAtom, (prev) => prev + 1);
      }
      
      set(updateUserProfileLoadingAtom, false);
      return updatedProfile;
    } catch (error) {
      set(updateUserProfileLoadingAtom, false);
      set(updateUserProfileErrorAtom, error instanceof Error ? error.message : 'Update failed');
      throw error;
    }
  }
);





