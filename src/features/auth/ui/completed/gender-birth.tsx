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
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import DateTimePicker from '@react-native-community/datetimepicker';

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
  }, [profileFromAtom?.gender && profileFromAtom?.birthday]);

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

  const isAgeValid = (birthDateString: string): boolean => {
    // Parse the birth date string (assuming format: DD/MM/YYYY)
    const [day, month, year] = birthDateString.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day); // month is 0-indexed
    const today = new Date();

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    // Adjust age if birthday hasn't occurred this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (
      age > 13 ||
      (age === 13 && monthDiff > 0) ||
      (age === 13 && monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return true;
    }
    return false;
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
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Header */}
          <View className="flex-1">
            <Text className="text-2xl font-bold">Tell us about yourself</Text>
            <Text className="text-sm text-muted-foreground">
              This helps us personalize your experience
            </Text>
          </View>

          {/* Gender Selection */}
          <View className="mb-4">
            <Text className="text-lg font-bold">Gender</Text>
            <View className="flex-row flex-wrap gap-2">
              {genders.map((gender) => (
                <Pressable
                  key={gender.id}
                  className={`p-2 rounded-lg border border-gray-200 ${selectedGender === gender.id ? 'bg-primary-500' : ''}`}
                  onPress={() => setSelectedGender(gender.id)}
                >
                  <Text >{gender.emoji}</Text>
                  <Text className="text-sm">{gender.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View className="mb-4">
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
          </View>

          {/* Action Buttons */}
          <View className="mb-4">
            <Button
              title={profileFromAtom?.gender && profileFromAtom?.birthday ? 'Update' : 'Next'}
              onPress={profileFromAtom?.gender && profileFromAtom?.birthday ? handleUpdate : handleNext}
              variant="primary"
              size="large"
            />
            
            <Button
              title={profileFromAtom?.gender && profileFromAtom?.birthday ? 'Back' : 'Skip'}
              onPress={profileFromAtom?.gender && profileFromAtom?.birthday ? handleUpdate : handleSkip}
              variant="text"
              size="large"
            />
            
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

