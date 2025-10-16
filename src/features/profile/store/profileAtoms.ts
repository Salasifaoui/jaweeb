import { User } from '@/src/types/user';
import { atom } from 'jotai';

// 👤 Profile atoms
export const userProfileAtom = atom<User | null>(null);
export const profileLoadingAtom = atom<boolean>(false);
export const profileErrorAtom = atom<string | null>(null);

// 🔄 Derived atoms
export const profileStateAtom = atom(
  (get) => ({
    userProfile: get(userProfileAtom),
    loading: get(profileLoadingAtom),
    error: get(profileErrorAtom),
  })
);

// 📝 Profile update atoms
export const profileUpdateLoadingAtom = atom<boolean>(false);
export const profileUpdateErrorAtom = atom<string | null>(null);
export const profileUpdateSuccessAtom = atom<boolean>(false);

// 🎯 Profile actions atoms
export const updateUserProfileAtom = atom(
  null,
  async (get, set, { userId, data }: { userId: string; data: Partial<User> }) => {
    set(profileUpdateLoadingAtom, true);
    set(profileUpdateErrorAtom, null);
    set(profileUpdateSuccessAtom, false);

    try {
      // Import here to avoid circular dependency
      const { profileService } = await import('@/src/features/profile/service/profileService');
      
      const updatedUser = await profileService.updateUserProfile(userId, data);
      
      if (updatedUser) {
        // Update the profile atom with new data
        set(userProfileAtom, updatedUser);
        set(profileUpdateSuccessAtom, true);
        return updatedUser;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      set(profileUpdateErrorAtom, errorMessage);
      throw error;
    } finally {
      set(profileUpdateLoadingAtom, false);
    }
  }
);

// 📥 Fetch user profile atom
export const fetchUserProfileAtom = atom(
  null,
  async (get, set, userId: string) => {
    if (!userId) {
      set(userProfileAtom, null);
      set(profileLoadingAtom, false);
      return null;
    }

    set(profileLoadingAtom, true);
    set(profileErrorAtom, null);

    try {
      // Import here to avoid circular dependency
      const { profileService } = await import('@/src/features/profile/service/profileService');
      
      const profile = await profileService.getUserProfile(userId);
      set(userProfileAtom, profile);
      return profile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user profile';
      set(profileErrorAtom, errorMessage);
      console.error('Error fetching user profile:', error);
      return null;
    } finally {
      set(profileLoadingAtom, false);
    }
  }
);
