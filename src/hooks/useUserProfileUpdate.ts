import {
  UpdateUserData,
  updateUserProfileErrorAtom,
  updateUserProfileLoadingAtom,
  updateUserProfileWithRefreshAtom,
  userProfileAtom,
  userProfileUpdateTriggerAtom
} from '@/src/store/atoms';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

/**
 * Hook for updating user profile with automatic state management
 * 
 * @returns Object containing:
 * - updateUserProfile: Function to update user profile
 * - isLoading: Boolean indicating if update is in progress
 * - error: Error message if update failed
 * - userProfile: Current user profile data
 * - clearError: Function to clear error state
 */
export const useUserProfileUpdate = () => {
  const [isLoading] = useAtom(updateUserProfileLoadingAtom);
  const [error, setError] = useAtom(updateUserProfileErrorAtom);
  const [userProfile] = useAtom(userProfileAtom);
  const [, updateProfile] = useAtom(updateUserProfileWithRefreshAtom);
  const [updateTrigger] = useAtom(userProfileUpdateTriggerAtom);

  const updateUserProfile = useCallback(async (
    userId: string, 
    updateData: UpdateUserData
  ) => {
    try {
      const result = await updateProfile({ userId, updateData });
      return result;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }, [updateProfile]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    updateUserProfile,
    isLoading,
    error,
    userProfile,
    clearError,
    updateTrigger, // Can be used to listen for profile updates
  };
};
