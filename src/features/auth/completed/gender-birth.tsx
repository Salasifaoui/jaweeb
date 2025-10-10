import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/src/components/Button';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

export default function GenderBirthPage() {
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // const [showDatePicker, setShowDatePicker] = useState(false);

  const genders = [
    { id: 'male', label: 'Male', emoji: '👨' },
    { id: 'female', label: 'Female', emoji: '👩' },
    { id: 'non-binary', label: 'Non-binary', emoji: '🧑' },
    { id: 'prefer-not-to-say', label: 'Prefer not to say', emoji: '🤐' },
  ];

  const handleNext = () => {
    // Save gender and birthday data here
    console.log('Gender:', selectedGender);
    console.log('Birthday:', selectedDate);
    router.push('/(auth)/complated/location');
  };

  const handleSkip = () => {
    router.push('/(auth)/complated/location');
  };

  // const onDateChange = (event: any, selectedDate?: Date) => {
  //   setShowDatePicker(false);
  //   if (selectedDate) {
  //     setSelectedDate(selectedDate);
  //   }
  // };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Tell us about yourself</ThemedText>
            <ThemedText style={styles.subtitle}>
              This helps us personalize your experience
            </ThemedText>
          </View>

          {/* Gender Selection */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Gender</ThemedText>
            <View style={styles.genderGrid}>
              {genders.map((gender) => (
                <TouchableOpacity
                  key={gender.id}
                  style={[
                    styles.genderOption,
                    selectedGender === gender.id && styles.selectedGenderOption,
                  ]}
                  onPress={() => setSelectedGender(gender.id)}
                >
                  <ThemedText style={styles.genderEmoji}>{gender.emoji}</ThemedText>
                  <ThemedText
                    style={[
                      styles.genderLabel,
                      selectedGender === gender.id && styles.selectedGenderLabel,
                    ]}
                  >
                    {gender.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Birthday Selection */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Birthday</ThemedText>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {/* setShowDatePicker(true) */}}
            >
              <ThemedText style={styles.dateButtonText}>
                {formatDate(selectedDate)}
              </ThemedText>
              <ThemedText style={styles.dateButtonIcon}>📅</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <Button
              title="Next"
              onPress={handleNext}
              variant="primary"
              size="large"
              style={styles.nextButton}
            />
            <Button
              title="Skip"
              onPress={handleSkip}
              variant="text"
              size="large"
              style={styles.skipButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Date Picker Modal - Commented out until DateTimePicker is installed */}
      {/* {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )} */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
    marginBottom: 16,
  },
  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  genderOption: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedGenderOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  genderEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  selectedGenderLabel: {
    color: '#fff',
  },
  dateButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dateButtonIcon: {
    fontSize: 20,
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
});
