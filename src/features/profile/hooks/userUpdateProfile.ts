import {
  profileUpdateErrorAtom,
  profileUpdateLoadingAtom,
  profileUpdateSuccessAtom,
  updateUserProfileAtom
} from '@/src/features/profile/store/profileAtoms';
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
  const [loading] = useAtom(profileUpdateLoadingAtom);
  const [error] = useAtom(profileUpdateErrorAtom);
  const [success] = useAtom(profileUpdateSuccessAtom);
  const [, updateProfileAction] = useAtom(updateUserProfileAtom);

  const updateProfile = async (userId: string, data: UpdateProfileData): Promise<User | null> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Validate required fields
    if (data.username !== undefined && !data.username.trim()) {
      throw new Error('Username cannot be empty');
    }

    if (data.email !== undefined && (!data.email.trim() || !data.email.includes('@'))) {
      throw new Error('Please enter a valid email address');
    }

    try {
      const updatedUser = await updateProfileAction({ userId, data });
      return updatedUser;
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  };

  const reset = () => {
    // Reset is handled by the atoms themselves
  };

  return {
    updateProfile,
    loading,
    error,
    success,
    reset,
  };
}
