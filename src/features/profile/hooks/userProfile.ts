import {
  fetchUserProfileAtom,
  profileStateAtom
} from '@/src/features/profile/store/profileAtoms';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export function useUserService(userId: string) {
  const [profileState] = useAtom(profileStateAtom);
  const [, fetchProfile] = useAtom(fetchUserProfileAtom);

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId, fetchProfile]);

  return {
    userProfile: profileState.userProfile,
    loading: profileState.loading,
    error: profileState.error,
  };
}
