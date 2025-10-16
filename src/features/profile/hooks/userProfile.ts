import { profileService } from '@/src/features/profile/service/profileService';
import { User } from '@/src/types/user';
import { useEffect, useState } from 'react';

export function useUserService(userId: string) {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const profile = await profileService.getUserProfile(userId);
        setUserProfile(profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return {
    userProfile,
    loading,
    error,
  };
}
