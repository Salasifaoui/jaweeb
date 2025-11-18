import { Pressable } from '@/components/ui/pressable';
import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { Text } from '@/components/ui/text';
import { Button } from '@/src/components/Button';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/src/features/profile/hooks';
import { userProfileAtom } from '@/src/features/profile/store/profileAtoms';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

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
    if (profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference) {
      setSelectedInterests(profileFromAtom?.interest || []);
      setSelectedAgeRange(profileFromAtom?.ageRange || '');
      setSelectedGenderPreference(profileFromAtom?.genderPreference.map((gender: string) => gender.toLowerCase())[0] || '');
    } else {
      setSelectedInterests([]);
      setSelectedAgeRange('');
      setSelectedGenderPreference('');
    }
  }, [profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference]);

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
      ageRange: selectedAgeRange as '13-17' | '18-20' | '18-25' | '26-35' | '36-45' | '46-55' | '56-65' | '66-75' | '76-85' | '86-95',
      genderPreference: [selectedGenderPreference as 'male' | 'female' | 'all'],
    });
    router.back();
  };
  return (
    <ScreenLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Header */}
          <View className="flex-1">
            <Text className="text-2xl font-bold">Set your preferences</Text>
            <Text className="text-sm text-muted-foreground">
              Help us match you with the right people
            </Text>
          </View>

          {/* Interests Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold">Interests</Text>
            <Text className="text-sm text-muted-foreground">
              Select topics you&apos;re interested in (optional)
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {interests.map((interest) => (
                <Pressable
                  key={interest.id}
                  className={`p-2 rounded-lg border border-gray-200 ${selectedInterests.includes(interest.id) ? 'bg-primary-500' : ''}`}
                  onPress={() => toggleInterest(interest.id)}
                >
                  <Text >{interest.emoji}</Text>
                  <Text className="text-sm">{interest.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Age Range Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold">Age Range</Text>
            <Text className="text-sm text-muted-foreground">
              Who would you like to connect with?
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {ageRanges.map((range) => (
                <Pressable
                  key={range.id}
                  className={`p-2 rounded-lg border border-gray-200 ${selectedAgeRange === range.id ? 'bg-primary-500' : ''}`}
                  onPress={() => setSelectedAgeRange(range.id)}
                >
                  <Text className="text-sm">{range.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Gender Preference Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold">Gender Preference</Text>
            <Text className="text-sm text-muted-foreground">
              Who would you like to connect with?
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {genderPreferences.map((preference) => (
                <Pressable
                  key={preference.id}
                  className={`p-2 rounded-lg border border-gray-200 ${selectedGenderPreference === preference.id ? 'bg-primary-500' : ''}`}
                  onPress={() => setSelectedGenderPreference(preference.id)}
                >
                  <Text >{preference.emoji}</Text>
                  <Text className="text-sm">{preference.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mb-4">
            <Button
              title={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? 'Update' : 'Next'}
              onPress={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? handleUpdate : handleNext}
              variant="primary"
              size="large"
            />
            <Button
              title={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? 'Back' : 'Skip'}
              onPress={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? handleUpdate : handleSkip}
              variant="text"
              size="large"
            />
         
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}