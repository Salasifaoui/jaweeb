import { profileService } from '@/src/features/profile/service/profileService';
import {
    profileUpdateErrorAtom,
    profileUpdateLoadingAtom,
    profileUpdateSuccessAtom,
    userAtom
} from '@/src/store/atoms';
import { User } from '@/src/types/user';
import { useAtom } from 'jotai';

interface UpdateProfileData {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  imageUrl?: string;
  status?: string;
  is_online?: boolean;
}

interface UseUpdateProfileReturn {
  updateProfile: (userId: string, data: UpdateProfileData) => Promise<User | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export function useUpdateProfile(): UseUpdateProfileReturn {
  const [loading, setLoading] = useAtom(profileUpdateLoadingAtom);
  const [error, setError] = useAtom(profileUpdateErrorAtom);
  const [success, setSuccess] = useAtom(profileUpdateSuccessAtom);
  const [user, setUser] = useAtom(userAtom);

  const updateProfile = async (userId: string, data: UpdateProfileData): Promise<User | null> => {
    if (!userId) {
      setError('User ID is required');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Validate required fields
      if (data.username !== undefined && !data.username.trim()) {
        throw new Error('Username cannot be empty');
      }

      if (data.email !== undefined && (!data.email.trim() || !data.email.includes('@'))) {
        throw new Error('Please enter a valid email address');
      }

      // Call the profile service to update the user
      const updatedUser = await profileService.updateUserProfile(userId, data);
      
      if (!updatedUser) {
        throw new Error('Failed to update profile');
      }

      // Update the user atom with the new data
      if (user && user.userId === userId) {
        setUser({ ...user, ...updatedUser });
      }

      setSuccess(true);
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Update profile error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    updateProfile,
    loading,
    error,
    success,
    reset,
  };
}
