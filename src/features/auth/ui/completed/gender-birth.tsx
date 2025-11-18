import { HStack } from '@/components/ui/hstack';
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
import { Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export function GenderBirthPage() {
  const { profile } = useAuth();
  const { updateProfile } = useUpdateProfile();
  const [profileFromAtom] = useAtom(userProfileAtom);
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const genders = [
    { id: 'male', label: 'Male', emoji: '👨' },
    { id: 'female', label: 'Female', emoji: '👩' },
    { id: 'non-binary', label: 'Non-binary', emoji: '🧑' },
    { id: 'prefer-not-to-say', label: 'Prefer not to say', emoji: '🤐' },
  ];

  useEffect(() => {
    if (profileFromAtom?.gender && profileFromAtom?.birthday) {
      setSelectedGender(profileFromAtom?.gender as string);
      setSelectedDate(new Date(profileFromAtom?.birthday));
    }
  }, [profileFromAtom?.gender, profileFromAtom?.birthday]);

  const handleNext = async () => {
    if (!selectedGender) {
      Alert.alert('Gender Required', 'Please select your gender to continue.');
      return;
    }

    if (!profile?.userId) {
      Alert.alert('Error', 'User not found. Please try again.');
      return;
    }

    try {
      const birthdayString = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

      await updateProfile(profile.userId, {
        gender: selectedGender,
        birthday: birthdayString,
      });

      console.log('Profile updated successfully');

      router.push('/(auth)/complated/location');

    } catch (err) {
      console.error('Update profile error:', err);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/complated/location');

  };

  const handleUpdate = async () => {

    await updateProfile(profileFromAtom?.userId || '', {
      gender: selectedGender ? selectedGender : profileFromAtom?.gender,
      birthday: selectedDate ? selectedDate.toISOString().split('T')[0] : profileFromAtom?.birthday,
    });
    router.back();

  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScreenLayout>
      <VStack className="flex-1 items-center justify-between py-10" space="xl">
        {/* Header */}
        <VStack className="items-center justify-center" space="sm">
          <Text size="2xl" bold>Tell us about yourself</Text>
          <Text size="sm" className="text-muted-foreground">
            This helps us personalize your experience
          </Text>
        </VStack>

        {/* Gender Selection */}
        <VStack className="items-center justify-center" space="sm">
          <Text size="lg" bold>Gender</Text>
          <HStack className="items-center" space="sm">
            {genders.map((gender) => (
              <Pressable
                key={gender.id}
                className={`p-2 rounded-lg border ${
                  selectedGender === gender.id 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'border-outline-200 bg-background-0'
                }`}
                onPress={() => setSelectedGender(gender.id)}
              >
                <VStack className="items-center" space="xs">
                  <Text size="lg">{gender.emoji}</Text>
                  <Text 
                    size="sm" 
                    className={selectedGender === gender.id ? 'text-white' : 'text-typography-700'}
                  >
                    {gender.label}
                  </Text>
                </VStack>
              </Pressable>
            ))}
          </HStack>
        </VStack>

        {/* Date of Birth Selection */}
        <VStack className="items-center justify-center" space="sm">
          <Text size="lg" bold>Date of Birth</Text>
          <Pressable
            className="p-3 rounded-lg border border-outline-200 bg-background-0"
            onPress={() => setDatePickerVisibility(true)}
          >
            <Text size="md" className="text-typography-700">
              {formatDate(selectedDate)}
            </Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(date) => {
              const currentDate = new Date();
              const maximumDate = new Date(
                currentDate.setFullYear(currentDate.getFullYear() - 13)
              );

              // Check if the selected date is the same as the current date
              if (date.toDateString() === new Date().toDateString()) {
                date = maximumDate;
              }
              setSelectedDate(date);
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
            maximumDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 13))
            }
          />
        </VStack>

        {/* Action Buttons */}
        <VStack className="mb-4 w-full" space="sm">
          <ButtonAction
            text={profileFromAtom?.gender && profileFromAtom?.birthday ? 'Update' : 'Next'}
            onPress={profileFromAtom?.gender && profileFromAtom?.birthday ? handleUpdate : handleNext}
            action="primary"
            variant="solid"
          />

          <ButtonAction
            text={profileFromAtom?.gender && profileFromAtom?.birthday ? 'Back' : 'Skip'}
            onPress={profileFromAtom?.gender && profileFromAtom?.birthday ? () => router.back() : handleSkip}
            action="secondary"
            variant="outline"
          />
        </VStack>
      </VStack>
    </ScreenLayout>
  );
}

