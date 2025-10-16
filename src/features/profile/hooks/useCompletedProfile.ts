import { User } from '@/src/types/user';

interface ProfileCompletionStatus {
  isCompleted: boolean;
  missingFields: string[];
  nextScreen: string | null;
}

interface UseCompletedProfileReturn {
  checkProfileCompletion: (user: User | null) => ProfileCompletionStatus;
  getNextIncompleteScreen: (user: User | null) => string | null;
}

export function useCompletedProfile(): UseCompletedProfileReturn {
  
  const checkProfileCompletion = (user: User | null): ProfileCompletionStatus => {
    if (!user) {
      return {
        isCompleted: false,
        missingFields: ['user'],
        nextScreen: '/(auth)/login'
      };
    }

    const missingFields: string[] = [];
    
    // Check required fields for profile completion
    if (!user.birthday || user.birthday.trim() === '') {
      missingFields.push('birthday');
    }
    
    if (!user.gender || user.gender.trim() === '') {
      missingFields.push('gender');
    }
    
    if (!user.genderPreference || user.genderPreference.length === 0) {
      missingFields.push('genderPreference');
    }
    
    if (!user.interest || user.interest.length === 0) {
      missingFields.push('interest');
    }
    
    if (!user.location || user.location.trim() === '') {
      missingFields.push('location');
    }
    
    if (!user.ageRange || user.ageRange.trim() === '') {
      missingFields.push('ageRange');
    }

    // Determine next screen based on missing fields
    let nextScreen: string | null = null;
    
    if (missingFields.includes('birthday') || missingFields.includes('gender')) {
      nextScreen = '/(auth)/complated/gender-birth';
    } else if (missingFields.includes('location')) {
      nextScreen = '/(auth)/complated/location';
    } else if (missingFields.includes('genderPreference') || missingFields.includes('interest') || missingFields.includes('ageRange')) {
      nextScreen = '/(auth)/complated/preference';
    }

    return {
      isCompleted: missingFields.length === 0,
      missingFields,
      nextScreen
    };
  };

  const getNextIncompleteScreen = (user: User | null): string | null => {
    const status = checkProfileCompletion(user);
    return status.nextScreen;
  };

  return {
    checkProfileCompletion,
    getNextIncompleteScreen
  };
}
