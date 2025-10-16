import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/src/components/Button';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/src/features/profile/hooks';
import { userProfileAtom } from '@/src/features/profile/store/profileAtoms';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Set your preferences</ThemedText>
            <ThemedText style={styles.subtitle}>
              Help us match you with the right people
            </ThemedText>
          </View>

          {/* Interests Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Interests</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Select topics you&apos;re interested in (optional)
            </ThemedText>
            <View style={styles.interestsGrid}>
              {interests.map((interest) => (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestOption,
                    selectedInterests.includes(interest.id) && styles.selectedInterestOption,
                  ]}
                  onPress={() => toggleInterest(interest.id)}
                >
                  <ThemedText style={styles.interestEmoji}>{interest.emoji}</ThemedText>
                  <ThemedText
                    style={[
                      styles.interestLabel,
                      selectedInterests.includes(interest.id) && styles.selectedInterestLabel,
                    ]}
                  >
                    {interest.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Age Range Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Age Range</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Who would you like to connect with?
            </ThemedText>
            <View style={styles.ageRangeContainer}>
              {ageRanges.map((range) => (
                <TouchableOpacity
                  key={range.id}
                  style={[
                    styles.ageRangeOption,
                    selectedAgeRange === range.id && styles.selectedAgeRangeOption,
                  ]}
                  onPress={() => setSelectedAgeRange(range.id)}
                >
                  <ThemedText
                    style={[
                      styles.ageRangeLabel,
                      selectedAgeRange === range.id && styles.selectedAgeRangeLabel,
                    ]}
                  >
                    {range.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Gender Preference Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Gender Preference</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Who would you like to connect with?
            </ThemedText>
            <View style={styles.genderPreferenceContainer}>
              {genderPreferences.map((preference) => (
                <TouchableOpacity
                  key={preference.id}
                  style={[
                    styles.genderPreferenceOption,
                    selectedGenderPreference === preference.id && styles.selectedGenderPreferenceOption,
                  ]}
                  onPress={() => setSelectedGenderPreference(preference.id)}
                >
                  <ThemedText style={styles.genderPreferenceEmoji}>{preference.emoji}</ThemedText>
                  <ThemedText
                    style={[
                      styles.genderPreferenceLabel,
                      selectedGenderPreference === preference.id && styles.selectedGenderPreferenceLabel,
                    ]}
                  >
                    {preference.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <Button
              title={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? 'Update' : 'Next'}
              onPress={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? handleUpdate : handleNext}
              variant="primary"
              size="large"
              style={styles.nextButton}
            />
            <Button
              title={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? 'Back' : 'Skip'}
              onPress={profileFromAtom?.gender && profileFromAtom?.ageRange && profileFromAtom?.genderPreference ? handleUpdate : handleSkip}
              variant="text"
              size="large"
              style={styles.skipButton}
            />
         
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interestOption: {
    width: '30%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedInterestOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  interestEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  interestLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  selectedInterestLabel: {
    color: '#fff',
  },
  ageRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ageRangeOption: {
    width: '18%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAgeRangeOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  ageRangeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  selectedAgeRangeLabel: {
    color: '#fff',
  },
  genderPreferenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderPreferenceOption: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedGenderPreferenceOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  genderPreferenceEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  genderPreferenceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  selectedGenderPreferenceLabel: {
    color: '#fff',
  },
  buttonSection: {
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#FF6B6B',
    marginBottom: 12,
  },
  skipButton: {
    backgroundColor: 'transparent',
  },
  backButton: {
    backgroundColor: 'transparent',
  },
});
