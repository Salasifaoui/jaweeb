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
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

export function LocationPage() {
  const { profile } = useAuth();
  const [profileFromAtom] = useAtom(userProfileAtom);
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

  useEffect(() => {
    if (profileFromAtom?.location) {
      const location = popularLocations.find(loc => loc.label === profileFromAtom?.location);
      if (location) {
        setSelectedLocation(location.id);
      } else {
        setSelectedLocation('');
        setCustomLocation(profileFromAtom?.location || '');
        setShowCustomInput(true);
      }
      setCustomLocation('');
      setShowCustomInput(false);
    } else {
      setSelectedLocation('');
      setCustomLocation('');
      setShowCustomInput(false);
    }
  }, [profileFromAtom?.location]);

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
  const handleUpdate = async () => {
    let locationLabel: string = '';
      if (selectedLocation) {
        const locationObj = popularLocations.find(loc => loc.id === selectedLocation);
        locationLabel = locationObj ? locationObj.label as string : '';
      } else {
        locationLabel = customLocation;
      }
    await updateProfile(profileFromAtom?.userId || '', {
      location: locationLabel,
    });
    router.back();
  };

  const getSelectedLocationLabel = () => {
    if (selectedLocation) {
      const location = popularLocations.find(loc => loc.id === selectedLocation);
      return location ? location.label : '';
    }
    return customLocation;
  };


  return (
    <ScreenLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Header */}
          <View className="flex-1">
            <Text className="text-2xl font-bold">Where are you located?</Text>
            <Text className="text-sm text-muted-foreground">
              Help us connect you with people nearby
            </Text>
          </View>

          {/* Current Selection Display */}
          {(selectedLocation || customLocation) && (
            <View className="mb-4">
              <Text className="text-lg font-bold">Selected:</Text>
              <Text className="text-sm">{getSelectedLocationLabel()}</Text>
            </View>
          )}

          {/* Custom Location Input */}
          {showCustomInput && (
            <View className="mb-4">
              <Text className="text-lg font-bold">Enter your location</Text>
              <TextInput
                className="border border-gray-200 rounded-lg p-2"
                placeholder="City, State/Country"
                value={customLocation}
                onChangeText={setCustomLocation}
                autoFocus
              />
              <TouchableOpacity
                className="p-2 rounded-lg border border-gray-200"
                onPress={() => {
                  setShowCustomInput(false);
                  setCustomLocation('');
                }}
              >
                <Text className="text-sm">Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Popular Locations */}
          {!showCustomInput && (
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-muted-foreground">Popular Locations</Text>
              <View className="flex-row items-center gap-2">
                {popularLocations.map((location) => (
                  <Pressable
                    key={location.id}
                    className={`flex-row items-center gap-2 ${selectedLocation === location.id ? 'bg-primary-500' : ''}`}
                    onPress={() => handleLocationSelect(location.id)}
                  >
                    <Text className="text-sm text-muted-foreground">{location.emoji}</Text>
                    <Text className="text-sm text-muted-foreground">{location.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Custom Location Button */}
          {!showCustomInput && (
            <View className="mb-4">
              <TouchableOpacity
                className="p-2 rounded-lg border border-gray-200"
                onPress={handleCustomLocation}
              >
                <Text className="text-sm">✏️</Text>
                <Text className="text-sm">Enter custom location</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          <View className="mb-4">
            <Button
              title={profileFromAtom?.location ? 'Update' : 'Next'}
              onPress={profileFromAtom?.location ? handleUpdate : handleNext}
              variant="primary"
              size="large"
            />
            
            <Button
              title={profileFromAtom?.location ? 'Back' : 'Skip'}
              onPress={profileFromAtom?.location ? handleUpdate : handleSkip}
              variant="text"
              size="large"
            />
            
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

