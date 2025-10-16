import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/src/components/Button';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/src/features/profile/hooks';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export function LocationPage() {
  const { profile } = useAuth();
  const { updateProfile } = useUpdateProfile();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const popularLocations = [
    { id: 'new-york', label: 'New York, NY', emoji: '🗽' },
    { id: 'los-angeles', label: 'Los Angeles, CA', emoji: '🌴' },
    { id: 'chicago', label: 'Chicago, IL', emoji: '🏙️' },
    { id: 'houston', label: 'Houston, TX', emoji: '🤠' },
    { id: 'phoenix', label: 'Phoenix, AZ', emoji: '☀️' },
    { id: 'philadelphia', label: 'Philadelphia, PA', emoji: '🔔' },
    { id: 'san-antonio', label: 'San Antonio, TX', emoji: '🌮' },
    { id: 'san-diego', label: 'San Diego, CA', emoji: '🏖️' },
    { id: 'dallas', label: 'Dallas, TX', emoji: '🤠' },
    { id: 'san-jose', label: 'San Jose, CA', emoji: '💻' },
    { id: 'austin', label: 'Austin, TX', emoji: '🎸' },
    { id: 'jacksonville', label: 'Jacksonville, FL', emoji: '🌊' },
  ];

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
    setShowCustomInput(false);
    setCustomLocation('');
  };

  const handleCustomLocation = () => {
    setShowCustomInput(true);
    setSelectedLocation('');
  };

  const handleNext = async () => {
    const location = selectedLocation || customLocation;
    if (!location) {
      Alert.alert('Location Required', 'Please select or enter your location to continue.');
      return;
    }

    if (!profile?.userId) {
      Alert.alert('Error', 'User not found. Please try again.');
      return;
    }

    try {
      // Get the actual location label for display
      let locationLabel = location;
      if (selectedLocation) {
        const locationObj = popularLocations.find(loc => loc.id === selectedLocation);
        locationLabel = locationObj ? locationObj.label : location;
      } else {
        locationLabel = customLocation;
      }

      await updateProfile(profile.userId, {
        location: locationLabel,
      });

      console.log('Location updated successfully');
      router.push('/(auth)/complated/preference');
    } catch (err) {
      console.error('Update location error:', err);
      Alert.alert('Error', 'Failed to update location. Please try again.');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/complated/preference');
  };

  const getSelectedLocationLabel = () => {
    if (selectedLocation) {
      const location = popularLocations.find(loc => loc.id === selectedLocation);
      return location ? location.label : '';
    }
    return customLocation;
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Where are you located?</ThemedText>
            <ThemedText style={styles.subtitle}>
              Help us connect you with people nearby
            </ThemedText>
          </View>

          {/* Current Selection Display */}
          {(selectedLocation || customLocation) && (
            <View style={styles.selectedSection}>
              <ThemedText style={styles.selectedLabel}>Selected:</ThemedText>
              <ThemedText style={styles.selectedValue}>
                📍 {getSelectedLocationLabel()}
              </ThemedText>
            </View>
          )}

          {/* Custom Location Input */}
          {showCustomInput && (
            <View style={styles.customInputSection}>
              <ThemedText style={styles.sectionTitle}>Enter your location</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="City, State/Country"
                value={customLocation}
                onChangeText={setCustomLocation}
                autoFocus
              />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowCustomInput(false);
                  setCustomLocation('');
                }}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
            </View>
          )}

          {/* Popular Locations */}
          {!showCustomInput && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Popular Locations</ThemedText>
              <View style={styles.locationGrid}>
                {popularLocations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    style={[
                      styles.locationOption,
                      selectedLocation === location.id && styles.selectedLocationOption,
                    ]}
                    onPress={() => handleLocationSelect(location.id)}
                  >
                    <ThemedText style={styles.locationEmoji}>{location.emoji}</ThemedText>
                    <ThemedText
                      style={[
                        styles.locationLabel,
                        selectedLocation === location.id && styles.selectedLocationLabel,
                      ]}
                    >
                      {location.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Custom Location Button */}
          {!showCustomInput && (
            <View style={styles.customSection}>
              <TouchableOpacity
                style={styles.customLocationButton}
                onPress={handleCustomLocation}
              >
                <ThemedText style={styles.customLocationIcon}>✏️</ThemedText>
                <ThemedText style={styles.customLocationText}>
                  Enter custom location
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}

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
  selectedSection: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  selectedLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  selectedValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  locationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  locationOption: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLocationOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  locationEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  selectedLocationLabel: {
    color: '#fff',
  },
  customInputSection: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 12,
  },
  cancelButton: {
    alignSelf: 'flex-start',
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  customSection: {
    marginBottom: 24,
  },
  customLocationButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  customLocationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  customLocationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
