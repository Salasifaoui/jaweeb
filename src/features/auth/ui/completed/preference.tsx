import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ButtonAction from '@/src/components/ButtonAction';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/src/features/profile/hooks';
import { userProfileAtom } from '@/src/features/profile/store/profileAtoms';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';

export function PreferencePage() {
  const { profile } = useAuth();
  const { updateProfile } = useUpdateProfile();
  const [profileFromAtom] = useAtom(userProfileAtom);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>('');
  const [selectedGenderPreference, setSelectedGenderPreference] = useState<string>('');
  const interests = [
    { id: 'gaming', label: 'Gaming', emoji: '🎮' },
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'sports', label: 'Sports', emoji: '⚽' },
    { id: 'movies', label: 'Movies', emoji: '🎬' },
    { id: 'books', label: 'Books', emoji: '📚' },
    { id: 'travel', label: 'Travel', emoji: '✈️' },
    { id: 'food', label: 'Food', emoji: '🍕' },
    { id: 'fitness', label: 'Fitness', emoji: '💪' },
    { id: 'art', label: 'Art', emoji: '🎨' },
    { id: 'technology', label: 'Technology', emoji: '💻' },
    { id: 'photography', label: 'Photography', emoji: '📸' },
    { id: 'fashion', label: 'Fashion', emoji: '👗' },
  ];

  const ageRanges = [
    { id: '13-17', label: '13-17' },
    { id: '18-20', label: '18-20' },
    { id: '18-25', label: '18-25' },
    { id: '26-35', label: '26-35' },
    { id: '36-45', label: '36-45' },
    { id: '46-55', label: '46-55' },
    { id: '55+', label: '55+' },
  ];

  const genderPreferences = [
    { id: 'male', label: 'Male', emoji: '👨' },
    { id: 'female', label: 'Female', emoji: '👩' },
    { id: 'all', label: 'All', emoji: '👥' },
  ];

  useEffect(() => {
    const hasProfileData = profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference;
    if (hasProfileData) {
      setSelectedInterests(profileFromAtom?.interest || []);
      setSelectedAgeRange(profileFromAtom?.ageRange || '');
      setSelectedGenderPreference(profileFromAtom?.genderPreference?.map((gender: string) => gender.toLowerCase())[0] || '');
    } else {
      setSelectedInterests([]);
      setSelectedAgeRange('');
      setSelectedGenderPreference('');
    }
  }, [profileFromAtom?.gender, profileFromAtom?.ageRange, profileFromAtom?.genderPreference, profileFromAtom?.interest]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = async () => {
    if (!profile?.userId) {
      Alert.alert('Error', 'User not found. Please try again.');
      return;
    }
    try {
      const updateData: any = {};
      
      // Only update fields that have values
      if (selectedInterests.length > 0) {
        updateData.interest = selectedInterests;
      }
      
      if (selectedAgeRange) {
        updateData.ageRange = selectedAgeRange;
      }
      
      if (selectedGenderPreference) {
        updateData.genderPreference = [selectedGenderPreference];
      }

      await updateProfile(profile.userId, updateData);

      console.log('Preferences updated successfully');
      router.push('/(auth)/complated/choose-room');
    } catch (err) {
      console.error('Update preferences error:', err);
      Alert.alert('Error', 'Failed to update preferences. Please try again.');
    }
  };

  const handleSkip = () => {
      router.push('/(auth)/complated/choose-room');
  };

  const handleUpdate = async () => {
    await updateProfile(profile?.userId || '', {
      interest: selectedInterests,
      ageRange: selectedAgeRange as '13-17' | '18-20' | '18-25' | '26-35' | '36-45' | '55+',
      genderPreference: [selectedGenderPreference as 'male' | 'female' | 'all'],
    });
    router.back();
  };
  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="flex-1 items-center justify-between py-10 gap-6">
          {/* Header */}
          <VStack className="items-center justify-center gap-2">
            <Text size="2xl" bold>Set your preferences</Text>
            <Text size="sm" className="text-muted-foreground">
              Help us match you with the right people
            </Text>
          </VStack>

          {/* Interests Section */}
          <Box className="mb-4 w-full">
            <Text size="lg" bold className="mb-2">Interests</Text>
            <Text size="sm" className="text-muted-foreground mb-4">
              Select topics you&apos;re interested in (optional)
            </Text>
            <Box className="flex-row flex-wrap gap-2">
              {interests.map((interest) => (
                <Pressable
                  key={interest.id}
                  className={`p-3 rounded-lg border border-outline-200 items-center justify-center min-w-[80px] ${selectedInterests.includes(interest.id) ? 'bg-primary-500 border-primary-500' : 'bg-background-0'}`}
                  onPress={() => toggleInterest(interest.id)}
                >
                  <VStack className="items-center gap-1">
                    <Text size="lg">{interest.emoji}</Text>
                    <Text size="sm" className={selectedInterests.includes(interest.id) ? 'text-white' : 'text-typography-700'}>{interest.label}</Text>
                  </VStack>
                </Pressable>
              ))}
            </Box>
          </Box>

          {/* Age Range Section */}
          <Box className="mb-4 w-full">
            <Text size="lg" bold className="mb-2">Age Range</Text>
            <Text size="sm" className="text-muted-foreground mb-4">
              Who would you like to connect with?
            </Text>
            <Box className="flex-row flex-wrap gap-2">
              {ageRanges.map((range) => (
                <Pressable
                  key={range.id}
                  className={`px-4 py-2 rounded-lg border items-center justify-center ${selectedAgeRange === range.id ? 'bg-primary-500 border-primary-500' : 'bg-background-0 border-outline-200'}`}
                  onPress={() => setSelectedAgeRange(range.id)}
                >
                  <Text size="sm" className={selectedAgeRange === range.id ? 'text-white' : 'text-typography-700'}>{range.label}</Text>
                </Pressable>
              ))}
            </Box>
          </Box>

          {/* Gender Preference Section */}
          <Box className="mb-4 w-full">
            <Text size="lg" bold className="mb-2">Gender Preference</Text>
            <Text size="sm" className="text-muted-foreground mb-4">
              Who would you like to connect with?
            </Text>
            <Box className="flex-row flex-wrap gap-2">
              {genderPreferences.map((preference) => (
                <Pressable
                  key={preference.id}
                  className={`p-3 rounded-lg border items-center justify-center min-w-[80px] ${selectedGenderPreference === preference.id ? 'bg-primary-500 border-primary-500' : 'bg-background-0 border-outline-200'}`}
                  onPress={() => setSelectedGenderPreference(preference.id)}
                >
                  <VStack className="items-center gap-1">
                    <Text size="lg">{preference.emoji}</Text>
                    <Text size="sm" className={selectedGenderPreference === preference.id ? 'text-white' : 'text-typography-700'}>{preference.label}</Text>
                  </VStack>
                </Pressable>
              ))}
            </Box>
          </Box>

          {/* Action Buttons */}
          <VStack className="mb-4 w-full gap-2">
            <ButtonAction
              text={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? 'Update' : 'Next'}
              onPress={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? handleUpdate : handleNext}
              action="primary"
              variant="solid"
            />
            <ButtonAction
              text={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? 'Back' : 'Skip'}
              onPress={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? () => router.back() : handleSkip}
              action="secondary"
              variant="outline"
            />
          </VStack>
        </VStack>
      </ScrollView>
    </ScreenLayout>
  );
}