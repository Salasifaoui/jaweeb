import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ButtonAction from '@/src/components/ButtonAction';
import InputForm from '@/src/components/InputForm';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/src/features/profile/hooks';
import { userProfileAtom } from '@/src/features/profile/store/profileAtoms';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';

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

export function LocationPage() {
  const { profile } = useAuth();
  const [profileFromAtom] = useAtom(userProfileAtom);
  const { updateProfile } = useUpdateProfile();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    if (profileFromAtom?.location) {
      const location = popularLocations.find(loc => loc.label === profileFromAtom?.location);
      if (location) {
        setSelectedLocation(location.id);
        setCustomLocation('');
        setShowCustomInput(false);
      } else {
        setSelectedLocation('');
        setCustomLocation(profileFromAtom?.location || '');
        setShowCustomInput(true);
      }
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="flex-1 items-center justify-between py-10" space="2xl">
          {/* Header */}
          <VStack className="items-center justify-center" space="sm">
            <Text size="2xl" bold>Where are you located?</Text>
            <Text size="sm" className="text-muted-foreground">
              Help us connect you with people nearby
            </Text>
          </VStack>

          {/* Current Selection Display */}
          {(selectedLocation || customLocation) && (
            <VStack className="mb-4" space="xs">
              <Text size="lg" bold>Selected:</Text>
              <Text size="sm" className="text-typography-700">{getSelectedLocationLabel()}</Text>
            </VStack>
          )}

          {/* Custom Location Input */}
          {showCustomInput && (
            <VStack className="items-center justify-center" space="2xl">
              <Text size="lg" bold className="text-center">Enter your location</Text>
              <InputForm
                variant="outline"
                text="City, State/Country"
                placeholder="City, State/Country"
                value={customLocation}
                onChangeText={setCustomLocation}
                onBlur={() => {
                  setShowCustomInput(false);
                  setCustomLocation('');
                }}
                className="w-full"
                textAlign="center"
              />
            </VStack>
          )}

          {/* Popular Locations */}
          {!showCustomInput && (
            <VStack className="items-center justify-center mb-4" space="sm">
              <Text size="sm" className="text-muted-foreground">Popular Locations</Text>
              <Box className="flex-row flex-wrap items-center justify-center" style={{ gap: 16 }}>
                {popularLocations.map((location) => (
                  <Pressable
                    key={location.id}
                    className={`flex-row items-center p-2 rounded-lg border ${
                      selectedLocation === location.id 
                        ? 'bg-primary-500 border-primary-500' 
                        : 'border-outline-200 bg-background-0'
                    }`}
                    onPress={() => handleLocationSelect(location.id)}
                  >
                    <HStack className="items-center" space="sm">
                      <Text size="md" className="text-muted-foreground">{location.emoji}</Text>
                      <Text 
                        size="md" 
                        className={selectedLocation === location.id ? 'text-white' : 'text-typography-700'}
                      >
                        {location.label}
                      </Text>
                    </HStack>
                  </Pressable>
                ))}
              </Box>
            </VStack>
          )}

          {/* Custom Location Button */}
          {!showCustomInput && (
            <VStack className="mb-4">
              <Pressable
                className="p-2 rounded-lg border border-outline-200 bg-background-0"
                onPress={handleCustomLocation}
              >
                <HStack className="items-center" space="sm">
                  <Text size="md" className="text-muted-foreground">✏️</Text>
                  <Text size="sm" className="text-typography-700">Enter custom location</Text>
                </HStack>
              </Pressable>
            </VStack>
          )}

          {/* Action Buttons */}
          <VStack className="w-full items-center justify-center" space="sm">
            <ButtonAction
              text={profileFromAtom?.location ? 'Update' : 'Next'}
              onPress={profileFromAtom?.location ? handleUpdate : handleNext}
              action="primary"
              variant="solid"
            />
            
            <ButtonAction
              text={profileFromAtom?.location ? 'Back' : 'Skip'}
              onPress={profileFromAtom?.location ? () => router.back() : handleSkip}
              action="secondary"
              variant="outline"
            />
          </VStack>
        </VStack>
      </ScrollView>
    </ScreenLayout>
  );
}

